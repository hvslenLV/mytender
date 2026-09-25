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

const initialTenders: Tender[] = [
  { id: 't-001', title: 'Дижитал шилжилтийн зөвлөх үйлчилгээ', organization: 'Улаанбаатар хот', deadline: '2026.10.04', status: 'Ажиллаж байна', progress: 62 },
  { id: 't-002', title: 'Мэдээллийн системийн тоног төхөөрөмж', organization: 'Эрүүл мэндийн яам', deadline: '2026.10.12', status: 'Шинэ', progress: 18 },
  { id: 't-003', title: 'Сургалтын платформ хөгжүүлэлт', organization: 'Боловсролын яам', deadline: '2026.10.18', status: 'Бэлэн', progress: 94 },
]

const statusClass = { 'Шинэ': 'badge-blue', 'Ажиллаж байна': 'badge-yellow', 'Бэлэн': 'badge-green' }

export default function Dashboard({ onNavigate, onOpenCopilot }: DashboardProps) {
  const [tenders, setTenders] = useState(initialTenders)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'Бүгд' | Tender['status']>('Бүгд')
  const visibleTenders = useMemo(
    () => tenders.filter((tender) => (filter === 'Бүгд' || tender.status === filter) && `${tender.title} ${tender.organization}`.toLowerCase().includes(query.toLowerCase())),
    [filter, query, tenders],
  )

  function addTender() {
    const number = tenders.length + 1
    setTenders((items) => [{ id: `draft-${Date.now()}`, title: `Шинэ тендер #${number}`, organization: 'Байгууллага сонгоогүй', deadline: 'Хугацаа тохируулаагүй', status: 'Шинэ', progress: 0 }, ...items])
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
          <div className="flex gap-2"><input aria-label="Тендер хайх" className="rounded-button border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-teal-400" placeholder="Тендер хайх..." value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Төлөв шүүх" className="rounded-button border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>{['Бүгд', 'Шинэ', 'Ажиллаж байна', 'Бэлэн'].map((status) => <option className="bg-navy-900" key={status}>{status}</option>)}</select></div>
        </div>
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[['Нийт тендер', String(tenders.length)], ['Идэвхтэй ажил', String(tenders.filter((tender) => tender.status === 'Ажиллаж байна').length)], ['Дундаж бэлэн байдал', `${Math.round(tenders.reduce((sum, tender) => sum + tender.progress, 0) / tenders.length)}%`]].map(([label, value]) => <div className="card-glass rounded-card p-5" key={label}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div>)}
        </section>
        <section className="mt-8 overflow-hidden rounded-card border border-white/7">
          <div className="border-b border-white/7 bg-navy-900/50 px-5 py-4 font-display font-bold">Тендерүүд <span className="ml-2 font-mono text-xs font-normal text-slate-500">{visibleTenders.length}</span></div>
          <div className="divide-y divide-white/7">{visibleTenders.length ? visibleTenders.map((tender) => <article className="flex flex-col gap-4 bg-navy-900/30 p-5 transition hover:bg-white/3 md:flex-row md:items-center" key={tender.id}><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display font-bold">{tender.title}</h2><span className={`badge ${statusClass[tender.status]}`}>{tender.status}</span></div><p className="mt-1 text-sm text-slate-400">{tender.organization} · Дуусах: {tender.deadline}</p></div><div className="w-full md:w-40"><div className="mb-1 flex justify-between text-xs text-slate-400"><span>Бэлтгэл</span><span>{tender.progress}%</span></div><div className="risk-bar"><div className="risk-bar-fill bg-teal-400" style={{ width: `${tender.progress}%` }} /></div></div><button className="btn-secondary shrink-0" onClick={() => onOpenCopilot(tender.id)}>Copilot нээх →</button></article>) : <p className="p-10 text-center text-slate-400">Хайлтад тохирох тендер олдсонгүй.</p>}</div>
        </section>
      </div>
    </main>
  )
}
