import { useState } from 'react'
import type { Page } from '../App'

type CopilotRoomProps = {
  tenderId: string | null
  onNavigate: (page: Page) => void
}

type Message = { sender: 'copilot' | 'user'; text: string }

export default function CopilotRoom({ tenderId, onNavigate }: CopilotRoomProps) {
  const [messages, setMessages] = useState<Message[]>([{ sender: 'copilot', text: 'Сайн байна уу! Би таны тендерийн бэлтгэлийг цэгцлэхэд тусална. Аль хэсгээс эхлэх вэ?' }])
  const [draft, setDraft] = useState('')

  function sendMessage() {
    const text = draft.trim()
    if (!text) return
    setMessages((items) => [...items, { sender: 'user', text }, { sender: 'copilot', text: 'Ойлголоо. Энэ ажлыг баримт бичгийн шалгах жагсаалт болон хариуцагчийн алхмуудад нэмлээ.' }])
    setDraft('')
  }

  return (
    <main className="flex min-h-screen flex-col bg-navy-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-white/8 bg-navy-900/80 px-5 py-4 md:px-8"><button className="text-sm text-slate-300 hover:text-teal-400" onClick={() => onNavigate('dashboard')}>← Самбар руу буцах</button><span className="font-display font-bold">Copilot өрөө</span><span className="font-mono text-xs text-slate-500">{tenderId ?? 'шинэ тендер'}</span></header>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8">
        <section className="card-glass mb-6 rounded-card p-5"><p className="font-mono text-xs text-teal-400">TENDER COPILOT</p><h1 className="mt-2 text-2xl font-extrabold">Бэлтгэлээ хамтдаа эхлүүлье</h1><div className="mt-4 flex flex-wrap gap-2">{['Шаардлага задлах', 'Баримтын жагсаалт', 'Эрсдэл шалгах'].map((label) => <button className="btn-secondary !px-3 !py-2 !text-xs" key={label} onClick={() => setDraft(label)}>{label}</button>)}</div></section>
        <section className="flex flex-1 flex-col gap-4">{messages.map((message, index) => <div className={`max-w-[85%] rounded-card px-4 py-3 text-sm leading-6 ${message.sender === 'user' ? 'ml-auto bg-teal-400 text-navy-950' : 'card-solid'}`} key={index}>{message.text}</div>)}</section>
        <form className="mt-6 flex gap-2" onSubmit={(event) => { event.preventDefault(); sendMessage() }}><label className="sr-only" htmlFor="message">Асуултаа бичих</label><input id="message" className="min-w-0 flex-1 rounded-button border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-teal-400" placeholder="Асуулт эсвэл даалгавраа бичнэ үү..." value={draft} onChange={(event) => setDraft(event.target.value)} /><button className="btn-primary" type="submit">Илгээх</button></form>
      </div>
    </main>
  )
}
