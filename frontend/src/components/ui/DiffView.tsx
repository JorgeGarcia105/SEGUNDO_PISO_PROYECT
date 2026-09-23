import { useState, useMemo } from 'react'
import { Tabs, TabList, Tab, Badge } from '@components/ui'
import { cn } from '@utils/cn'
import { computeWordDiff, type DiffResult } from '@utils/diff'

interface DiffViewProps {
  oldText: string
  newText: string
  oldLabel?: string
  newLabel?: string
  mode?: 'inline' | 'side-by-side'
  showLineNumbers?: boolean
  collapseUnchanged?: boolean
  contextLines?: number
}

type DiffLineItem = DiffResult & {
  oldLineNum?: number
  newLineNum?: number
  count?: number
}

function isContext(item: DiffLineItem): item is DiffLineItem & { type: 'context' } {
  return item.type === 'context'
}

function isNotContext(item: DiffLineItem): item is Exclude<DiffLineItem, { type: 'context' }> {
  return item.type !== 'context'
}

export function DiffView({
  oldText,
  newText,
  oldLabel = 'Versión anterior',
  newLabel = 'Versión nueva',
  mode = 'side-by-side',
  showLineNumbers = true,
  collapseUnchanged = true,
  contextLines = 3,
}: DiffViewProps) {
  const [viewMode, setViewMode] = useState(mode)
  const [showContext, setShowContext] = useState(true)

  const diff = useMemo(() => {
    const linesOld = oldText.split('\n')
    const linesNew = newText.split('\n')

    let i = 0
    let j = 0
    const result: DiffLineItem[] = []

    while (i < linesOld.length || j < linesNew.length) {
      const lineOld = linesOld[i]
      const lineNew = linesNew[j]

      if (i < linesOld.length && j < linesNew.length && lineOld === lineNew) {
        result.push({
          type: 'unchanged',
          value: lineOld,
          added: false,
          removed: false,
          oldLineNum: i + 1,
          newLineNum: j + 1,
        })
        i++
        j++
      } else if (j < linesNew.length && (i >= linesOld.length || lineOld !== lineNew)) {
        const nextMatchOld = linesOld.slice(i + 1).findIndex((l) => l === linesNew[j])
        const nextMatchNew = linesNew.slice(j + 1).findIndex((l) => l === linesOld[i])

        if (nextMatchOld !== -1 && (nextMatchNew === -1 || nextMatchOld <= nextMatchNew)) {
          result.push({
            type: 'removed',
            value: lineOld,
            added: false,
            removed: true,
            oldLineNum: i + 1,
          })
          i++
        } else if (nextMatchNew !== -1 && (nextMatchOld === -1 || nextMatchNew < nextMatchOld)) {
          result.push({
            type: 'added',
            value: lineNew,
            added: true,
            removed: false,
            newLineNum: j + 1,
          })
          j++
        } else {
          result.push({
            type: 'removed',
            value: lineOld,
            added: false,
            removed: true,
            oldLineNum: i + 1,
          })
          i++
          if (j < linesNew.length) {
            result.push({
              type: 'added',
              value: linesNew[j],
              added: true,
              removed: false,
              newLineNum: j + 1,
            })
            j++
          }
        }
      }
    }

    if (collapseUnchanged) {
      const collapsed: DiffLineItem[] = []
      let unchangedBuffer: DiffLineItem[] = []

      const flushBuffer = () => {
        if (unchangedBuffer.length === 0) return
        if (unchangedBuffer.length <= contextLines * 2) {
          collapsed.push(...unchangedBuffer)
        } else {
          const head = unchangedBuffer.slice(0, contextLines)
          const tail = unchangedBuffer.slice(-contextLines)
          collapsed.push(
            ...head,
            { type: 'context', value: '', count: unchangedBuffer.length - contextLines * 2, added: false, removed: false },
            ...tail
          )
        }
        unchangedBuffer = []
      }

      for (const item of result) {
        if (item.type === 'unchanged') {
          unchangedBuffer.push(item)
        } else {
          flushBuffer()
          collapsed.push(item)
        }
      }
      flushBuffer()

      return collapsed
    }

    return result
  }, [oldText, newText, collapseUnchanged, contextLines])

  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    let unchanged = 0

    for (const item of diff) {
      if (item.type === 'added') added++
      else if (item.type === 'removed') removed++
      else if (item.type === 'unchanged') unchanged++
    }

    return { added, removed, unchanged }
  }, [diff])

  const handleModeChange = (value: string) => {
    setViewMode(value as 'inline' | 'side-by-side')
  }

  if (viewMode === 'inline') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Tabs defaultValue="inline" onChange={handleModeChange}>
            <TabList>
              <Tab value="inline">Inline</Tab>
              <Tab value="side-by-side">Lado a lado</Tab>
            </TabList>
          </Tabs>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Badge variant="success">{stats.added} añadidas</Badge>
            <Badge variant="danger">{stats.removed} eliminadas</Badge>
            <Badge variant="default">{stats.unchanged} sin cambios</Badge>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border p-4 font-mono text-sm max-h-[600px] overflow-auto">
          <table className="w-full border-collapse">
            <tbody>
              {diff.map((item, index) => {
                if (isContext(item)) {
                  return (
                    <tr key={`context-${index}`}>
                      <td colSpan={4} className="text-center py-2">
                        <button
                          type="button"
                          onClick={() => setShowContext(!showContext)}
                          className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto px-3 py-1 bg-blue-50 rounded"
                        >
                          {showContext ? 'Ocultar' : 'Mostrar'} {item.count ?? 0} líneas sin cambios
                        </button>
                      </td>
                    </tr>
                  )
                }

                if (!isNotContext(item)) {
                  return null
                }

                return (
                  <tr
                    key={index}
                    className={cn(
                      item.type === 'added' && 'bg-green-50',
                      item.type === 'removed' && 'bg-red-50'
                    )}
                  >
                    {showLineNumbers && (
                      <>
                        <td className={cn('w-10 text-right text-gray-400 pr-3 border-r', item.type === 'removed' && 'line-through')}>
                          {item.oldLineNum ?? ''}
                        </td>
                        <td className={cn('w-10 text-right text-gray-400 pr-3 border-r', item.type === 'added' && 'font-medium text-green-700')}>
                          {item.newLineNum ?? ''}
                        </td>
                      </>
                    )}
                    <td className={cn('w-1/2 p-2 border-r', item.type === 'removed' && 'line-through text-gray-500')}>
                      <pre className="whitespace-pre-wrap m-0">{item.value}</pre>
                    </td>
                    <td className={cn('w-1/2 p-2', item.type === 'added' && 'bg-green-50')}>
                      <pre className="whitespace-pre-wrap m-0">{item.value}</pre>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Tabs defaultValue="side-by-side" onChange={handleModeChange}>
          <TabList>
            <Tab value="inline">Inline</Tab>
            <Tab value="side-by-side">Lado a lado</Tab>
          </TabList>
        </Tabs>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Badge variant="success">{stats.added} añadidas</Badge>
          <Badge variant="danger">{stats.removed} eliminadas</Badge>
          <Badge variant="default">{stats.unchanged} sin cambios</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-lg border border-red-100">
          <div className="p-3 border-b border-red-100 bg-red-100">
            <h4 className="font-medium text-red-800 flex items-center gap-2">
              {oldLabel}
              <Badge variant="danger" size="sm">{stats.removed}</Badge>
            </h4>
          </div>
          <div className="p-4 font-mono text-sm max-h-[500px] overflow-auto">
            <table className="w-full border-collapse">
              <tbody>
                {diff.map((item, index) => {
                  if (isContext(item)) {
                    return (
                      <tr key={`context-${index}`}>
                        <td colSpan={2} className="text-center py-2">
                          <button
                            type="button"
                            onClick={() => setShowContext(!showContext)}
                            className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto px-3 py-1 bg-blue-50 rounded"
                          >
                            {showContext ? 'Ocultar' : 'Mostrar'} {item.count ?? 0} líneas sin cambios
                          </button>
                        </td>
                      </tr>
                    )
                  }

                  if (!isNotContext(item)) {
                    return null
                  }

                  return (
                    <tr
                      key={index}
                      className={cn(item.type === 'removed' && 'bg-red-100', item.type === 'unchanged' && 'bg-gray-50')}
                    >
                      {showLineNumbers && (
                        <td className="w-10 text-right text-gray-400 pr-3 border-r">
                          {item.oldLineNum ?? ''}
                        </td>
                      )}
                      <td className={cn('p-2', item.type === 'removed' && 'line-through text-red-700', item.type === 'unchanged' && 'text-gray-500')}>
                        <pre className="whitespace-pre-wrap m-0">{item.value}</pre>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg border border-green-100">
          <div className="p-3 border-b border-green-100 bg-green-100">
            <h4 className="font-medium text-green-800 flex items-center gap-2">
              {newLabel}
              <Badge variant="success" size="sm">{stats.added}</Badge>
            </h4>
          </div>
          <div className="p-4 font-mono text-sm max-h-[500px] overflow-auto">
            <table className="w-full border-collapse">
              <tbody>
                {diff.map((item, index) => {
                  if (isContext(item)) {
                    return (
                      <tr key={`context-${index}`}>
                        <td colSpan={2} className="text-center py-2">
                          <button
                            type="button"
                            onClick={() => setShowContext(!showContext)}
                            className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto px-3 py-1 bg-blue-50 rounded"
                          >
                            {showContext ? 'Ocultar' : 'Mostrar'} {item.count ?? 0} líneas sin cambios
                          </button>
                        </td>
                      </tr>
                    )
                  }

                  if (!isNotContext(item)) {
                    return null
                  }

                  return (
                    <tr
                      key={index}
                      className={cn(item.type === 'added' && 'bg-green-100', item.type === 'unchanged' && 'bg-gray-50')}
                    >
                      {showLineNumbers && (
                        <td className="w-10 text-right text-gray-400 pr-3 border-r">
                          {item.newLineNum ?? ''}
                        </td>
                      )}
                      <td className={cn('p-2', item.type === 'added' && 'text-green-700 font-medium', item.type === 'unchanged' && 'text-gray-500')}>
                        <pre className="whitespace-pre-wrap m-0">{item.value}</pre>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InlineDiffView({
  oldText,
  newText,
  oldLabel = 'Anterior',
  newLabel = 'Nueva',
}: { oldText: string; newText: string; oldLabel?: string; newLabel?: string }) {
  const diff = useMemo(() => computeWordDiff(oldText, newText), [oldText, newText])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium">{oldLabel} → {newLabel}</span>
      </div>
      <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded border">
        <p className="whitespace-pre-wrap m-0">
          {diff.map((part, i) => (
            <span
              key={i}
              className={cn(
                part.added && 'bg-green-100 text-green-800 underline',
                part.removed && 'bg-red-100 text-red-800 line-through',
                !part.added && !part.removed && 'text-gray-700'
              )}
            >
              {part.value}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}