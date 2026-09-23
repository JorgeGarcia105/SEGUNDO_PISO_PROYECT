import { format, parseISO, isSameDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: es })
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export function parseDate(date: string): Date {
  return parseISO(date)
}

export function isSameDayDate(a: string | Date, b: string | Date): boolean {
  return isSameDay(typeof a === 'string' ? parseISO(a) : a, typeof b === 'string' ? parseISO(b) : b)
}

export function addDaysDate(date: string | Date, days: number): Date {
  return addDays(typeof date === 'string' ? parseISO(date) : date, days)
}

export function getMonthRange(date: string | Date): { start: Date; end: Date } {
  const d = typeof date === 'string' ? parseISO(date) : date
  return { start: startOfMonth(d), end: endOfMonth(d) }
}

export function getWeekRange(date: string | Date): { start: Date; end: Date } {
  const d = typeof date === 'string' ? parseISO(date) : date
  return { start: startOfWeek(d, { weekStartsOn: 1 }), end: endOfWeek(d, { weekStartsOn: 1 }) }
}

export function getDaysInMonth(date: string | Date): Date[] {
  const { start, end } = getMonthRange(date)
  return eachDayOfInterval({ start, end })
}

export function getCalendarWeeks(date: string | Date): Date[][] {
  const { start, end } = getMonthRange(date)
  const calendarStart = startOfWeek(start, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(end, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weeks: Date[][] = []
  let currentWeek: Date[] = []
  for (const day of days) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  return weeks
}

export function isDateInRange(date: string | Date, start: string | Date, end: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isWithinInterval(d, { start: typeof start === 'string' ? parseISO(start) : start, end: typeof end === 'string' ? parseISO(end) : end })
}

export function getDayName(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEEE', { locale: es })
}

export function getMonthName(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMMM yyyy', { locale: es })
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}