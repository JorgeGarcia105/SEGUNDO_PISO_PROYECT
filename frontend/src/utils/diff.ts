import { diffLines, diffWords, diffChars, type Change } from 'diff'

export type DiffMode = 'line' | 'word' | 'char'

export type DiffType = 'added' | 'removed' | 'unchanged' | 'context'

export interface DiffResult {
  value: string
  type: DiffType
  added?: boolean
  removed?: boolean
  count?: number
}

export function computeDiff(
  oldText: string,
  newText: string,
  mode: DiffMode = 'line'
): DiffResult[] {
  if (!oldText && !newText) return []
  if (!oldText) return [{ value: newText, type: 'added' as const, added: true }]
  if (!newText) return [{ value: oldText, type: 'removed' as const, removed: true }]

  let changes: Change[]

  switch (mode) {
    case 'word':
      changes = diffWords(oldText, newText)
      break
    case 'char':
      changes = diffChars(oldText, newText)
      break
    case 'line':
    default:
      changes = diffLines(oldText, newText)
      break
  }

  return changes.map((change) => {
    const type = change.added ? 'added' : change.removed ? 'removed' : 'unchanged'
    return {
      value: change.value,
      type,
      added: change.added,
      removed: change.removed,
      count: change.count,
    }
  })
}

export function computeLineDiff(oldText: string, newText: string): DiffResult[] {
  return computeDiff(oldText, newText, 'line')
}

export function computeWordDiff(oldText: string, newText: string): DiffResult[] {
  return computeDiff(oldText, newText, 'word')
}

export function hasChanges(diff: DiffResult[]): boolean {
  return diff.some((d) => d.added || d.removed)
}

export function getDiffStats(diff: DiffResult[]): { added: number; removed: number; unchanged: number } {
  let added = 0
  let removed = 0
  let unchanged = 0

  for (const part of diff) {
    const lines = part.value.split('\n').filter((l) => l.length > 0)
    const count = lines.length || (part.value.endsWith('\n') ? 1 : 0)
    if (part.added) added += count
    else if (part.removed) removed += count
    else unchanged += count
  }

  return { added, removed, unchanged }
}