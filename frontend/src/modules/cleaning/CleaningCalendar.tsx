import { useState, useMemo, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { Card, Badge } from '@components/ui'
import { useCleaningAssignments } from '@hooks/useCleaning'
import { formatDate } from '@utils/date'
import 'react-day-picker/style.css'

interface CleaningCalendarProps {
  month?: Date
  onMonthChange?: (month: Date) => void
}

export function CleaningCalendar({ month: initialMonth, onMonthChange }: CleaningCalendarProps) {
  const [month, setMonth] = useState(initialMonth || new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])

  const { assignments: allAssignments } = useCleaningAssignments()

  const assignmentsByDay = useMemo(() => {
    const map: Record<string, any[]> = {}
    allAssignments.forEach((a: any) => {
      if (a.scheduled_for) {
        const key = formatDate(a.scheduled_for)
        if (!map[key]) map[key] = []
        map[key].push(a)
      }
      if (a.due_at) {
        const dueDate = a.due_at.split('T')[0]
        if (!map[dueDate]) map[dueDate] = []
        map[dueDate].push({ ...a, isDueDate: true })
      }
    })
    return map
  }, [allAssignments])

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    const key = formatDate(day)
    setAssignments(assignmentsByDay[key] || [])
  }

  useEffect(() => {
    if (selectedDay) {
      const key = formatDate(selectedDay)
      setAssignments(assignmentsByDay[key] || [])
    }
  }, [month, selectedDay, assignmentsByDay])

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth)
    setSelectedDay(null)
    onMonthChange?.(newMonth)
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'VERIFICADO':
      case 'ENTREGADO':
        return 'success'
      case 'INCUMPLIDO':
        return 'danger'
      case 'PROGRAMADO':
        return 'info'
      default:
        return 'warning'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleMonthChange(new Date(month.getFullYear(), month.getMonth() - 1))}
              aria-label="Mes anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleMonthChange(new Date(month.getFullYear(), month.getMonth() + 1))}
              aria-label="Mes siguiente"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => { setMonth(new Date()); handleMonthChange(new Date()) }}
            >
              Hoy
            </button>
          </div>
        </div>

        <DayPicker
          mode="single"
          month={month}
          onMonthChange={(newMonth) => {
            setMonth(newMonth)
            onMonthChange?.(newMonth)
          }}
          showOutsideDays
          fixedWeeks
          selected={selectedDay ?? undefined}
          onSelect={(date) => {
            if (date) handleDayClick(date)
            else setSelectedDay(null)
          }}
          classNames={{
            root: 'w-full',
            months: 'space-y-4',
            month_caption: 'flex justify-center',
            caption_label: 'text-lg font-semibold text-gray-900',
            nav: 'flex justify-center gap-2',
            button_previous: 'p-1 rounded hover:bg-gray-100',
            button_next: 'p-1 rounded hover:bg-gray-100',
            weekdays: 'flex',
            weekday: 'w-full text-center text-xs font-medium text-gray-500 py-2',
            week: 'flex',
            day: 'relative h-24 w-full p-1',
          }}
        />

        <div className="flex flex-wrap gap-2 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> Aseos</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Vencimientos</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-green-300 bg-green-50" /> Con asignaciones</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-blue-300 bg-blue-50" /> Hoy</span>
        </div>
      </Card>

      {selectedDay && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Asignaciones para {selectedDay.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <span className="text-sm text-gray-500">{assignments.length} asignación{assignments.length !== 1 ? 'es' : ''}</span>
          </div>

          {assignments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay asignaciones para este día</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {assignments.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{a.task?.title || 'Sin tarea'}</p>
                    <p className="text-sm text-gray-500">{a.task?.zone?.name || 'Sin zona'}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {a.profile && (
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm">
                          {a.profile.display_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-sm text-gray-700">{a.profile.display_name}</span>
                      </div>
                    )}
                    <Badge
                      variant={a.isDueDate ? 'danger' : getBadgeVariant(a.status)}
                      size="sm"
                    >
                      {a.isDueDate ? 'Vence' : a.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export function getBadgeVariant(status: string) {
  switch (status) {
    case 'VERIFICADO':
    case 'ENTREGADO':
      return 'success'
    case 'INCUMPLIDO':
      return 'danger'
    case 'PROGRAMADO':
      return 'info'
    default:
      return 'warning'
  }
}