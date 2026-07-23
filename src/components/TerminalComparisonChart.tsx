import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CongestionRecord, Terminal } from '../types'

interface TerminalComparisonChartProps {
  records: CongestionRecord[]
  selectedTimeSlot: string
  isDark: boolean
}

interface ChartRow {
  terminal: Terminal
  입국장: number
  출국장: number
}

function buildChartData(records: CongestionRecord[]): ChartRow[] {
  const terminals: Terminal[] = ['T1', 'T2']
  return terminals.map((terminal) => {
    const arrival = records.find((r) => r.terminal === terminal && r.zoneType === '입국장')
    const departure = records.find((r) => r.terminal === terminal && r.zoneType === '출국장')
    return {
      terminal,
      입국장: arrival?.congestionValue ?? 0,
      출국장: departure?.congestionValue ?? 0,
    }
  })
}

export function TerminalComparisonChart({ records, selectedTimeSlot, isDark }: TerminalComparisonChartProps) {
  const data = buildChartData(records)
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const axisColor = isDark ? '#898781' : '#898781'
  const arrivalColor = isDark ? '#3987e5' : '#2a78d6'
  const departureColor = isDark ? '#d95926' : '#eb6834'
  const surfaceColor = isDark ? '#1a1a19' : '#fcfcfb'

  return (
    <section className="card">
      <p className="section-title">터미널별 비교 (입국장 vs 출국장) · 선택 시간대 {selectedTimeSlot}</p>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} barCategoryGap="30%" barGap={2}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="terminal" stroke={axisColor} tickLine={false} axisLine={{ stroke: axisColor }} />
            <YAxis stroke={axisColor} tickLine={false} axisLine={{ stroke: axisColor }} />
            <Tooltip
              contentStyle={{ background: surfaceColor, border: '1px solid var(--border)', borderRadius: 8 }}
            />
            <Legend />
            <Bar dataKey="입국장" fill={arrivalColor} radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="출국장" fill={departureColor} radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
