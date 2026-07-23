import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { DateTimeSelector } from './components/DateTimeSelector'
import { CongestionDetailCard } from './components/CongestionDetailCard'
import { TerminalComparisonChart } from './components/TerminalComparisonChart'
import { CongestionTrendChart } from './components/CongestionTrendChart'
import { FavoritesList } from './components/FavoritesList'
import { useDarkMode } from './hooks/useDarkMode'
import { fetchCongestionByDay } from './lib/congestion'
import { TIME_SLOTS } from './mock/congestionData'
import type { CongestionRecord, DayKind } from './types'

export function App() {
  const [isDark, toggleDark] = useDarkMode()
  const [selectedDay, setSelectedDay] = useState<DayKind>('today')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0])
  const [records, setRecords] = useState<CongestionRecord[]>([])

  useEffect(() => {
    fetchCongestionByDay(selectedDay).then(setRecords)
  }, [selectedDay])

  function handleRefresh() {
    fetchCongestionByDay(selectedDay).then(setRecords)
  }

  const selectedDate = records[0]?.date ?? ''

  const detailRecords = useMemo(
    () => records.filter((record) => record.timeSlot === selectedTimeSlot),
    [records, selectedTimeSlot],
  )

  return (
    <>
      <Header
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onRefresh={handleRefresh}
        isDark={isDark}
        onToggleDark={toggleDark}
      />
      <DateTimeSelector
        selectedDay={selectedDay}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        timeSlots={TIME_SLOTS}
        onSelectTimeSlot={setSelectedTimeSlot}
      />
      <CongestionDetailCard
        records={detailRecords}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
      />
      <TerminalComparisonChart records={detailRecords} selectedTimeSlot={selectedTimeSlot} isDark={isDark} />
      <CongestionTrendChart records={records} selectedTimeSlot={selectedTimeSlot} isDark={isDark} />
      <FavoritesList />
    </>
  )
}
