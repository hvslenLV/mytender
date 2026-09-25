type LandingPageProps = {
  onEnterApp: () => void
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <main className="noise-bg min-h-screen bg-navy-950 px-6 py-8 text-slate-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="font-display text-xl font-extrabold tracking-tight">my<span className="text-teal-400">tender</span></span>
        <button className="btn-secondary" onClick={onEnterApp}>Нэвтрэх</button>
      </nav>
      <section className="mx-auto flex max-w-5xl flex-col items-center py-28 text-center">
        <span className="badge badge-green mb-6">Тендерийн ухаалаг ажлын орчин</span>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          Тендер бүрийг <span className="text-gradient">итгэлтэйгээр</span> удирд
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
          Шаардлагыг нэг дороос хянаж, ажлын явцаа удирдаж, багийнхаа дараагийн алхмыг тодорхой болго.
        </p>
        <button className="btn-primary glow-teal mt-10" onClick={onEnterApp}>Ажлын орчин руу орох <span aria-hidden>→</span></button>
        <div className="mt-20 grid w-full grid-cols-1 gap-4 text-left md:grid-cols-3">
          {[
            ['01', 'Тендерээ хяна', 'Хугацаа, шаардлага, эрсдэлийг нэг цонхноос хар.'],
            ['02', 'Багаа уялдуул', 'Хариуцагч, дараагийн алхам, баримтуудаа цэгцэл.'],
            ['03', 'Илүү хурдан бэлд', 'Copilot өрөөнд тендерээ шинжилж, ажлаа эхлүүл.'],
          ].map(([number, title, text]) => (
            <article className="card-glass rounded-card p-6" key={number}>
              <span className="font-mono text-sm text-teal-400">{number}</span>
              <h2 className="mt-5 font-display text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
