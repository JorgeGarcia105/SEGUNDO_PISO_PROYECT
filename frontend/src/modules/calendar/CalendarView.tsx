import { useState, useMemo, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { Card, Badge } from '@components/ui'
import { useCleaningAssignments } from '@hooks/useCleaning'
import { useAssemblyMinutes } from '@hooks/useDecisions'
import { useActiveAnnouncements } from '@hooks/useAnnouncements'
import { formatDate } from '@utils/date'
import { cn } from '@utils/cn'
import 'react-day-picker/style.css'

interface CalendarEvent {
  id: string
  date: string
  type: 'cleaning' | 'assembly' | 'announcement'
  title: string
  description?: string
  status?: string
  important?: boolean
  entityId: string
}

export function CalendarView() {
  const [month, setMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const { assignments: cleaningAssignments } = useCleaningAssignments()
  const { minutes: assemblies } = useAssemblyMinutes()
  const { announcements: activeAnnouncements } = useActiveAnnouncements()

  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = []

    cleaningAssignments.forEach((a: any) => {
      if (a.scheduled_for) {
        events.push({
          id: `cleaning-${a.id}`,
          date: a.scheduled_for,
          type: 'cleaning',
          title: a.task?.title || 'Aseo',
          description: `${a.task?.zone?.name || 'Sin zona'} - ${a.profile?.display_name || 'Sin asignar'}`,
          status: a.status,
          entityId: a.id,
        })
      }
      if (a.due_at) {
        const dueDate = a.due_at.split('T')[0]
        events.push({
          id: `cleaning-due-${a.id}`,
          date: dueDate,
          type: 'cleaning',
          title: `Vence: ${a.task?.title || 'Aseo'}`,
          description: `Fecha límite para ${a.profile?.display_name || 'sin asignar'}`,
          status: a.status,
          entityId: a.id,
        })
      }
    })

    assemblies.forEach((m: any) => {
      if (m.meeting_date) {
        events.push({
          id: `assembly-${m.id}`,
          date: m.meeting_date,
          type: 'assembly',
          title: `Asamblea: ${m.title}`,
          description: m.topics,
          status: m.status,
          entityId: m.id,
        })
      }
    })

    activeAnnouncements.forEach((an: any) => {
      if (an.starts_at) {
        const startDate = an.starts_at.split('T')[0]
        events.push({
          id: `announcement-start-${an.id}`,
          date: startDate,
          type: 'announcement',
          title: `Inicia: ${an.title}`,
          description: an.body,
          important: an.is_important,
          entityId: an.id,
        })
      }
      if (an.expires_at) {
        const expireDate = an.expires_at.split('T')[0]
        events.push({
          id: `announcement-expire-${an.id}`,
          date: expireDate,
          type: 'announcement',
          title: `Expira: ${an.title}`,
          description: an.body,
          important: an.is_important,
          entityId: an.id,
        })
      }
    })

    return events
  }, [cleaningAssignments, assemblies, activeAnnouncements])

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    allEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [allEvents])

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    const key = formatDate(day)
    setEvents(eventsByDay[key] || [])
  }

  useEffect(() => {
    if (selectedDay) {
      const key = formatDate(selectedDay)
      setEvents(eventsByDay[key] || [])
    }
  }, [month, selectedDay, eventsByDay])

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth)
    setSelectedDay(null)
  }

  const getEventDot = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'cleaning': return 'bg-blue-500'
      case 'assembly': return 'bg-purple-500'
      case 'announcement': return 'bg-amber-500'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Calendario unificado
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
          onMonthChange={handleMonthChange}
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
            day: 'relative h-28 w-full p-1',
          }}
        />

        <div className="flex flex-wrap gap-2 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> Aseos</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500" /> Asambleas</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> Avisos</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-blue-300 bg-blue-50" /> Hoy</span>
        </div>
      </Card>

      {selectedDay && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Eventos para {selectedDay.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <span className="text-sm text-gray-500">{events.length} evento{events.length !== 1 ? 's' : ''}</span>
          </div>

          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay eventos para este día</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {events.map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border',
                    e.important && 'border-amber-300 bg-amber-50',
                    !e.important && 'border-gray-200 bg-white'
                  )}
                >
                  <div className={cn('w-2 h-2 mt-2 rounded-full flex-shrink-0', getEventDot(e.type))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{e.title}</h4>
                      <Badge variant="outline" className={cn('text-xs', e.type === 'cleaning' && 'bg-blue-100 text-blue-700', e.type === 'assembly' && 'bg-purple-100 text-purple-700', e.type === 'announcement' && 'bg-amber-100 text-amber-700')}>
                        {e.type === 'cleaning' ? 'Aseo' : e.type === 'assembly' ? 'Asamblea' : 'Aviso'}
                      </Badge>
                      {e.important && <Badge variant="danger" size="sm">Importante</Badge>}
                      {e.status && <Badge variant="outline" size="sm">{e.status}</Badge>}
                    </div>
                    {e.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{e.description}</p>}
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