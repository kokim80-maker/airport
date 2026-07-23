import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CongestionRecord } from '../types'
import { TIME_SLOTS } from '../mock/congestionData'

interface CongestionTrendChartProps {
  records: CongestionRecord[]
  selectedTimeSlot: string
  isDark: boolean
}

interface TrendRow {
  timeSlot: string
  t1Arrival: number | null
  t1Departure: number | null
  t2Arrival: number | null
  t2Departure: number | null
}

function findValue(records: CongestionRecord[], timeSlot: string, terminal: 'T1' | 'T2', zoneType: '입국장' | '출국장') {
  return records.find((r) => r.timeSlot === timeSlot && r.terminal === terminal && r.zoneType === zoneType)
    ?.congestionValue ?? null
}

function buildTrendData(records: CongestionRecord[]): TrendRow[] {
  return TIME_SLOTS.map((timeSlot) => ({
    timeSlot,
    t1Arrival: findValue(records, timeSlot, 'T1', '입국장'),
    t1Departure: findValue(records, timeSlot, 'T1', '출국장'),
    t2Arrival: findValue(records, timeSlot, 'T2', '입국장'),
    t2Departure: findValue(records, timeSlot, 'T2', '출국장'),
  }))
}

export function CongestionTrendChart({ records, selectedTimeSlot, isDark }: CongestionTrendChartProps) {
  const data = buildTrendData(records)
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const axisColor = '#898781'
  const surfaceColor = isDark ? '#1a1a19' : '#fcfcfb'

  const seriesColor = {
    t1Arrival: isDark ? '#3987e5' : '#2a78d6', // slot 1 blue
    t1Departure: isDark ? '#d95926' : '#eb6834', // slot 2 orange
    t2Arrival: isDark ? '#199e70' : '#1baf7a', // slot 3 aqua
    t2Departure: isDark ? '#c98500' : '#eda100', // slot 4 yellow
  }

  return (
    <section className="card">
      <p className="section-title">시간대별 혼잡도 추이 · 선택 시간대 {selectedTimeSlot} 강조</p>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="timeSlot" stroke={axisColor} tickLine={false} axisLine={{ stroke: axisColor }} />
            <YAxis stroke={axisColor} tickLine={false} axisLine={{ stroke: axisColor }} />
            <Tooltip
              contentStyle={{ background: surfaceColor, border: '1px solid var(--border)', borderRadius: 8 }}
            />
            <Legend />
            <ReferenceLine x={selectedTimeSlot} stroke={axisColor} strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="t1Arrival"
              name="T1 입국장"
              stroke={seriesColor.t1Arrival}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="t1Departure"
              name="T1 출국장"
              stroke={seriesColor.t1Departure}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="t2Arrival"
              name="T2 입국장"
              stroke={seriesColor.t2Arrival}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="t2Departure"
              name="T2 출국장"
              stroke={seriesColor.t2Departure}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
