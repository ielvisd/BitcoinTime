import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { getLocalTimeZone } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'

export const GENESIS_TIMESTAMP = 1231006505 // Jan 3, 2009, 18:15:05 UTC

export type DisplayMode = 'breakdown' | 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'

export const DISPLAY_MODES: DisplayMode[] = ['seconds', 'breakdown', 'years', 'months', 'weeks', 'days', 'hours', 'minutes']

export interface BitcoinTimeData {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  decimalYears: string
  isNegative: boolean
  isBeforeGenesis: boolean
  jsDate: Date
}

export interface UseBitcoinTimeReturn {
  currentTime: Ref<number>
  selectedDate: Ref<CalendarDate | null>
  selectedHour: Ref<number>
  selectedMinute: Ref<number>
  currentModeIndex: Ref<number>
  bitcoinTime: ComputedRef<BitcoinTimeData>
  formattedDate: ComputedRef<string>
  bitcoinTimeText: ComputedRef<string>
  cycleDisplayMode: () => void
  resetToCurrentTime: () => void
  startLiveClock: () => void
}

export function useBitcoinTime(): UseBitcoinTimeReturn {
  const now = new Date()
  const currentTime = ref(Date.now())
  const selectedDate = ref<CalendarDate | null>(null)
  const selectedHour = ref(now.getHours())
  const selectedMinute = ref(now.getMinutes())
  const currentModeIndex = ref(0)

  const bitcoinTime = computed<BitcoinTimeData>(() => {
    let jsDate: Date
    let inputTime: number

    if (selectedDate.value) {
      jsDate = selectedDate.value.toDate(getLocalTimeZone())
      jsDate.setHours(selectedHour.value || 0, selectedMinute.value || 0, 0)
      inputTime = jsDate.getTime() / 1000
    } else {
      jsDate = new Date(currentTime.value)
      inputTime = currentTime.value / 1000
    }

    const diffSeconds = inputTime - GENESIS_TIMESTAMP
    const absDiff = Math.abs(diffSeconds)

    return {
      years: Math.floor(absDiff / (365.25 * 24 * 60 * 60)),
      months: Math.floor(absDiff / (30.42 * 24 * 60 * 60)),
      weeks: Math.floor(absDiff / (7 * 24 * 60 * 60)),
      days: Math.floor(absDiff / (24 * 60 * 60)),
      hours: Math.floor(absDiff / (60 * 60)),
      minutes: Math.floor(absDiff / 60),
      seconds: Math.floor(absDiff),
      decimalYears: (absDiff / (365.25 * 24 * 60 * 60)).toFixed(2),
      isNegative: diffSeconds < 0,
      isBeforeGenesis: diffSeconds < 0,
      jsDate,
    }
  })

  const formattedDate = computed(() => {
    const { jsDate } = bitcoinTime.value
    return jsDate.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace(/(\d+),/, '$1')
  })

  const bitcoinTimeText = computed(() => {
    const { years, months, weeks, days, hours, minutes, seconds, decimalYears, isNegative } = bitcoinTime.value
    const mode = DISPLAY_MODES[currentModeIndex.value]
    const prefix = isNegative ? '-' : ''

    switch (mode) {
      case 'breakdown': {
        const remMonths = months % 12
        const remWeeks = weeks % 4
        const remDays = days % 7
        const remHours = hours % 24
        const remMinutes = minutes % 60
        const remSeconds = seconds % 60
        return `${prefix}${years}y ${remMonths}m ${remWeeks}w ${remDays}d ${remHours}h ${remMinutes}m ${remSeconds}s`
      }
      case 'years':
        return `${prefix}${decimalYears} years`
      case 'months':
        return `${prefix}${months} months`
      case 'weeks':
        return `${prefix}${weeks} weeks`
      case 'days':
        return `${prefix}${days} days`
      case 'hours':
        return `${prefix}${hours} hours`
      case 'minutes':
        return `${prefix}${minutes} minutes`
      case 'seconds':
        return `${prefix}${seconds.toLocaleString()} seconds`
      default:
        return ''
    }
  })

  function cycleDisplayMode(): void {
    currentModeIndex.value = (currentModeIndex.value + 1) % DISPLAY_MODES.length
  }

  function resetToCurrentTime(): void {
    selectedDate.value = null
    selectedHour.value = new Date().getHours()
    selectedMinute.value = new Date().getMinutes()
    currentTime.value = Date.now()
  }

  function startLiveClock(): void {
    const updateTime = () => {
      if (!selectedDate.value) {
        currentTime.value = Date.now()
      }
      requestAnimationFrame(updateTime)
    }
    updateTime()
  }

  return {
    currentTime,
    selectedDate,
    selectedHour,
    selectedMinute,
    currentModeIndex,
    bitcoinTime,
    formattedDate,
    bitcoinTimeText,
    cycleDisplayMode,
    resetToCurrentTime,
    startLiveClock,
  }
}
