type Listener<T> = (data: T[]) => void

interface StoreConfig<T> {
  key: string
  getId: (item: T) => string
  indexes?: { [key: string]: (item: T) => string | string[] }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export class LocalStore<T extends { id?: string }> {
  private data: Map<string, T> = new Map()
  private listeners: Set<Listener<T>> = new Set()
  private indexes: Map<string, Map<string, Set<string>>> = new Map()
  private config: StoreConfig<T>
  private initialized = false

  constructor(config: StoreConfig<T>) {
    this.config = config
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(`segundopiso_${this.config.key}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          parsed.forEach((item: T) => {
            const id = this.config.getId(item)
            this.data.set(id, { ...item, id })
            this.updateIndexes(id, item)
          })
        }
      }
      this.initialized = true
    } catch {
      this.initialized = true
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return
    try {
      const arr = Array.from(this.data.values())
      localStorage.setItem(`segundopiso_${this.config.key}`, JSON.stringify(arr))
    } catch {
    }
  }

  private updateIndexes(id: string, item: T): void {
    if (!this.config.indexes) return
    Object.entries(this.config.indexes).forEach(([indexName, indexFn]) => {
      let indexMap = this.indexes.get(indexName)
      if (!indexMap) {
        indexMap = new Map()
        this.indexes.set(indexName, indexMap)
      }
      const keys = indexFn(item)
      const keyArray = Array.isArray(keys) ? keys : [keys]
      keyArray.forEach(key => {
        if (!key) return
        let set = indexMap.get(key)
        if (!set) {
          set = new Set()
          indexMap.set(key, set)
        }
        set.add(id)
      })
    })
  }

  private removeFromIndexes(id: string, item: T): void {
    if (!this.config.indexes) return
    Object.entries(this.config.indexes).forEach(([indexName, indexFn]) => {
      const indexMap = this.indexes.get(indexName)
      if (!indexMap) return
      const keys = indexFn(item)
      const keyArray = Array.isArray(keys) ? keys : [keys]
      keyArray.forEach(key => {
        if (!key) return
        const set = indexMap.get(key)
        if (set) {
          set.delete(id)
          if (set.size === 0) indexMap.delete(key)
        }
      })
    })
  }

  private notify(): void {
    const arr = Array.from(this.data.values())
    this.listeners.forEach(fn => fn(arr))
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener)
    listener(Array.from(this.data.values()))
    return () => this.listeners.delete(listener)
  }

  isReady(): boolean {
    return this.initialized
  }

  getAll(): T[] {
    return Array.from(this.data.values())
  }

  getById(id: string): T | undefined {
    return this.data.get(id)
  }

  getByIndex(indexName: string, key: string): T[] {
    const indexMap = this.indexes.get(indexName)
    if (!indexMap) return []
    const ids = indexMap.get(key)
    if (!ids) return []
    return Array.from(ids).map(id => this.data.get(id)).filter((v): v is T => v !== undefined)
  }

  query(filter: (item: T) => boolean): T[] {
    return Array.from(this.data.values()).filter(filter)
  }

  create(item: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): T {
    const id = item.id ?? generateId()
    const newItem = { ...item, id } as T
    this.data.set(id, newItem)
    this.updateIndexes(id, newItem)
    this.saveToStorage()
    this.notify()
    return newItem
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const existing = this.data.get(id)
    if (!existing) return undefined
    this.removeFromIndexes(id, existing)
    const updated = { ...existing, ...updates, id } as T
    this.data.set(id, updated)
    this.updateIndexes(id, updated)
    this.saveToStorage()
    this.notify()
    return updated
  }

  delete(id: string): boolean {
    const existing = this.data.get(id)
    if (!existing) return false
    this.removeFromIndexes(id, existing)
    const result = this.data.delete(id)
    this.saveToStorage()
    this.notify()
    return result
  }

  clear(): void {
    this.data.clear()
    this.indexes.clear()
    this.saveToStorage()
    this.notify()
  }

  seed(items: T[]): void {
    this.clear()
    items.forEach(item => {
      const id = this.config.getId(item)
      this.data.set(id, { ...item, id })
      this.updateIndexes(id, item)
    })
    this.saveToStorage()
    this.notify()
  }
}

export function createStore<T extends { id?: string }>(config: StoreConfig<T>): LocalStore<T> {
  return new LocalStore(config)
}