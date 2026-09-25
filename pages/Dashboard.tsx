import { useMemo, useState } from 'react'
import type { Page } from '../App'

type Tender = {
  id: string
  title: string
  organization: string
  deadline: string
  status: 'Шинэ' | 'Ажиллаж байна' | 'Бэлэн'
  progress: number
}

type DashboardProps = {
  onNavigate: (page: Page) => void
  onOpenCopilot: (tenderId: string) => void
}

type SortOrder = 'deadline' | 'progress'

const initialTenders: Tender[] = [
  { id: 't-001', title: 'Дижитал шилжилтийн зөвлөх үйлчилгээ', organization: 'Улаанбаатар хот', deadline: '2026.10.04', status: 'Ажиллаж байна', progress: 62 },
  { id: 't-002', title: 'Мэдээллийн системийн тоног төхөөрөмж', organization: 'Эрүүл мэндийн яам', deadline: '2026.10.12', status: 'Шинэ', progress: 18 },
  { id: 't-003', title: 'Сургалтын платформ хөгжүүлэлт', organization: 'Боловсролын яам', deadline: '2026.10.18', status: 'Бэлэн', progress: 94 },
]

const statusClass = { 'Шинэ': 'badge-blue', 'Ажиллаж байна': 'badge-yellow', 'Бэлэн': 'badge-green' }

function getDeadlineInfo(deadline: string) {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(deadline)) return { label: 'Хугацаа тодорхойгүй', tone: 'text-slate-500', days: Number.POSITIVE_INFINITY }

  const [year, month, day] = deadline.split('.').map(Number)
  const dueDate = Date.UTC(year, month - 1, day)
  const today = new Date()
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const days = Math.round((dueDate - todayUtc) / 86_400_000)

  if (days < 0) return { label: `${Math.abs(days)} хоног өнгөрсөн`, tone: 'text-red-400', days }
  if (days === 0) return { label: 'Өнөөдөр дуусна', tone: 'text-red-400', days }
  if (days <= 3) return { label: `${days} хоног үлдсэн`, tone: 'text-yellow-300', days }
  return { label: `${days} хоног үлдсэн`, tone: 'text-slate-400', days }
}

export default function Dashboard({ onNavigate, onOpenCopilot }: DashboardProps) {
  const [tenders, setTenders] = useState(initialTenders)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'Бүгд' | Tender['status']>('Бүгд')
  const [sortOrder, setSortOrder] = useState<SortOrder>('deadline')
  const visibleTenders = useMemo(
    () => tenders
      .filter((tender) => (filter === 'Бүгд' || tender.status === filter) && `${tender.title} ${tender.organization}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sortOrder === 'deadline'
        ? getDeadlineInfo(a.deadline).days - getDeadlineInfo(b.deadline).days
        : b.progress - a.progress),
    [filter, query, sortOrder, tenders],
  )
  const nextTender = tenders.find((tender) => tender.status === 'Ажиллаж байна') ?? tenders[0]

  function addTender() {
    const number = tenders.length + 1
    setTenders((items) => [{ id: `draft-${Date.now()}`, title: `Шинэ тендер #${number}`, organization: 'Байгууллага сонгоогүй', deadline: 'Хугацаа тодорхойгүй', status: 'Шинэ', progress: 0 }, ...items])
  }

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100">
      <header className="border-b border-white/8 bg-navy-900/80 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button className="font-display text-xl font-extrabold tracking-tight" onClick={() => onNavigate('landing')}>my<span className="text-teal-400">tender</span></button>
          <button className="btn-primary" onClick={addTender}>+ Шинэ тендер</button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="font-mono text-xs text-teal-400">WORKSPACE / ТЕНДЕРҮҮД</p><h1 className="mt-2 text-3xl font-extrabold">Тендерийн хяналтын самбар</h1><p className="mt-2 text-slate-400">Ажлын явц болон чухал хугацаануудаа хянаарай.</p></div>
          <div className="flex flex-wrap gap-2"><input aria-label="Тендер хайх" className="min-w-0 flex-1 rounded-button border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-teal-400 sm:flex-none" placeholder="Тендер хайх..." value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Төлөв шүүх" className="rounded-button border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>{['Бүгд', 'Шинэ', 'Ажиллаж байна', 'Бэлэн'].map((status) => <option className="bg-navy-900" key={status}>{status}</option>)}</select><select aria-label="Эрэмбэлэх" className="rounded-button border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}><option className="bg-navy-900" value="deadline">Хугацаагаар</option><option className="bg-navy-900" value="progress">Явцаар</option></select></div>
        </div>
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[['Нийт тендер', String(tenders.length)], ['Идэвхтэй ажил', String(tenders.filter((tender) => tender.status === 'Ажиллаж байна').length)], ['Дундаж бэлэн байдал', `${Math.round(tenders.reduce((sum, tender) => sum + tender.progress, 0) / tenders.length)}%`]].map(([label, value]) => <div className="card-glass rounded-card p-5" key={label}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div>)}
        </section>
        {nextTender && (
          <section className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <article className="rounded-card border border-teal-400/20 bg-gradient-to-br from-teal-400/12 to-navy-800 p-6">
              <p className="font-mono text-xs text-teal-300">АНХААРАХ ТЕНДЕР</p>
              <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><h2 className="font-display text-xl font-bold">{nextTender.title}</h2><p className="mt-1 text-sm text-slate-400">{nextTender.organization} · Дуусах: {nextTender.deadline}</p></div>
                <button className="btn-primary shrink-0" onClick={() => onOpenCopilot(nextTender.id)}>Бэлтгэлээ үргэлжлүүлэх →</button>
              </div>
              <div className="mt-5"><div className="mb-2 flex justify-between text-sm text-slate-300"><span>Бэлэн байдлын түвшин</span><strong className="text-teal-300">{nextTender.progress}%</strong></div><div className="risk-bar"><div className="risk-bar-fill bg-teal-400" style={{ width: `${nextTender.progress}%` }} /></div></div>
            </article>
            <article className="card-glass rounded-card p-6">
              <p className="font-mono text-xs text-teal-400">ӨНӨӨДӨР</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-yellow-400" /><span><strong className="block text-slate-200">Шаардлагын матриц шинэчлэх</strong><span className="text-slate-400">Эзэн: Санал боловсруулах баг</span></span></li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-teal-400" /><span><strong className="block text-slate-200">Техникийн баримтууд шалгах</strong><span className="text-slate-400">2 баримт дутуу байна</span></span></li>
              </ul>
            </article>
          </section>
        )}
        <section className="mt-8 overflow-hidden rounded-card border border-white/7">
          <div className="border-b border-white/7 bg-navy-900/50 px-5 py-4 font-display font-bold">Тендерүүд <span className="ml-2 font-mono text-xs font-normal text-slate-500">{visibleTenders.length}</span></div>
          <div className="divide-y divide-white/7">{visibleTenders.length ? visibleTenders.map((tender) => {
            const deadline = getDeadlineInfo(tender.deadline)
            return <article className="flex flex-col gap-4 bg-navy-900/30 p-5 transition hover:bg-white/3 md:flex-row md:items-center" key={tender.id}><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display font-bold">{tender.title}</h2><span className={`badge ${statusClass[tender.status]}`}>{tender.status}</span></div><p className="mt-1 text-sm text-slate-400">{tender.organization} · Дуусах: {tender.deadline}</p><p className={`mt-1 font-mono text-xs ${deadline.tone}`}>{deadline.label}</p></div><div className="w-full md:w-40"><div className="mb-1 flex justify-between text-xs text-slate-400"><span>Бэлтгэл</span><span>{tender.progress}%</span></div><div className="risk-bar"><div className="risk-bar-fill bg-teal-400" style={{ width: `${tender.progress}%` }} /></div></div><button className="btn-secondary shrink-0" onClick={() => onOpenCopilot(tender.id)}>Copilot нээх →</button></article>
          }) : <p className="p-10 text-center text-slate-400">Хайлтад тохирох тендер олдсонгүй.</p>}</div>
        </section>
      </div>
    </main>
  )
}
