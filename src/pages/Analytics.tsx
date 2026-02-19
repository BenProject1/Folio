import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAnalytics } from '../services/links'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Eye, MousePointerClick, TrendingUp } from 'lucide-react'

export default function Analytics() {
  const { profile } = useAuth()
  const [data, setData] = useState<{ views: {viewed_at: string; device: string}[]; clicks: {clicked_at: string}[]; topLinks: {id: string; title: string; click_count: number}[] }>({ views: [], clicks: [], topLinks: [] })

  useEffect(() => {
    if (!profile) return
    getAnalytics(profile.id).then(setData)
  }, [profile])

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().slice(0, 10)
    return {
      label: i % 5 === 0 ? d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '',
      views: data.views.filter(v => v.viewed_at.slice(0, 10) === dateStr).length,
    }
  })

  const mobile = data.views.filter(v => v.device === 'mobile').length
  const desktop = data.views.filter(v => v.device === 'desktop').length
  const deviceData = [
    { name: 'Mobile', value: mobile, color: '#7C3AED' },
    { name: 'Desktop', value: desktop, color: '#EC4899' },
  ].filter(d => d.value > 0)

  const total = data.views.length
  const totalClicks = data.clicks.length
  const ctr = total > 0 ? ((totalClicks / total) * 100).toFixed(1) : '0.0'

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400 mt-1">Last 30 days</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Page views', value: total, icon: Eye, color: '#7C3AED' },
          { label: 'Link clicks', value: totalClicks, icon: MousePointerClick, color: '#EC4899' },
          { label: 'Click-through rate', value: `${ctr}%`, icon: TrendingUp, color: '#10B981' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-zinc-400 text-sm">{label}</span>
            </div>
            <p className="stat-number">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Page views — 30 days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last30}>
              <XAxis dataKey="label" stroke="#52525b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#52525b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, color: '#fafafa' }} />
              <Line type="monotone" dataKey="views" stroke="#7C3AED" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Devices</h3>
          {deviceData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-600 text-sm">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                    {deviceData.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {deviceData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-sm text-zinc-300 flex-1">{d.name}</span>
                    <span className="text-sm text-zinc-400 font-mono">{total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Top links by clicks</h3>
        {data.topLinks.length === 0 ? (
          <p className="text-zinc-600 text-sm py-4 text-center">No click data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.topLinks} layout="vertical">
              <XAxis type="number" stroke="#52525b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="title" stroke="#52525b" tick={{ fontSize: 11 }} width={120} />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, color: '#fafafa' }} />
              <Bar dataKey="click_count" fill="#7C3AED" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
