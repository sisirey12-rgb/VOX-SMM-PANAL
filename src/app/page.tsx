import Link from "next/link";
import { ArrowUpRight, BarChart3, ShieldCheck, Megaphone, Sparkles, Wallet, ChartNoAxesCombined } from "lucide-react";

const features = [
  { icon: <BarChart3 size={20}/>, title: "Clear performance insights", text: "Understand reach, engagement and campaign outcomes with transparent reporting." },
  { icon: <Megaphone size={20}/>, title: "Campaign management", text: "Organise legitimate promotional campaigns and keep important details in one place." },
  { icon: <ShieldCheck size={20}/>, title: "Built with trust in mind", text: "A security-conscious foundation with clear service descriptions and accountable records." }
];

export default function Home() {
  return <main>
    <header className="shell nav">
      <Link className="brand" href="/">launchpad<span>.</span></Link>
      <nav className="navlinks"><a href="#features">Features</a><a href="#platform">Platform</a><a href="#trust">Trust</a></nav>
      <div className="navright"><Link className="btn" href="/login">Log in</Link><Link className="btn primary" href="/register">Get started <ArrowUpRight size={15}/></Link></div>
    </header>
    <section className="shell hero">
      <div>
        <div className="eyebrow"><span className="dot"/> SOCIAL MARKETING, MADE CLEAR</div>
        <h1>Grow with a little more <span className="gradient">intention.</span></h1>
        <p className="lead">One organised workspace for legitimate social media campaigns, performance insights and customer support. Clear tools. Transparent reporting. No fake-engagement promises.</p>
        <div className="actions"><Link className="btn primary" href="/register">Create your account <ArrowUpRight size={16}/></Link><a className="btn" href="#features">Explore platform</a></div>
        <p className="note">A new way to plan, manage and understand your social campaigns.</p>
      </div>
      <div className="preview">
        <div className="previewtop"><span>Workspace overview</span><span>● Demo preview</span></div>
        <div className="metricgrid">
          <div className="metric"><small>Campaigns</small><strong>08</strong></div>
          <div className="metric"><small>Reports ready</small><strong>12</strong></div>
          <div className="metric"><small>Tracked channels</small><strong>04</strong></div>
          <div className="metric"><small>Open tasks</small><strong>03</strong></div>
        </div>
        <div className="previewtop" style={{marginBottom:12}}><span>Performance overview</span><span>Last 7 days</span></div>
        <div className="chart"><svg viewBox="0 0 440 130" preserveAspectRatio="none"><path d="M0 105 C35 95 48 103 80 78 S135 90 165 62 S215 73 250 48 S310 61 340 28 S400 43 440 10" fill="none" stroke="#9b8dff" strokeWidth="3"/><path d="M0 105 C35 95 48 103 80 78 S135 90 165 62 S215 73 250 48 S310 61 340 28 S400 43 440 10 L440 130 L0 130Z" fill="#8b7cff" opacity=".12"/></svg></div>
      </div>
    </section>
    <section className="section" id="features"><div className="shell">
      <div className="eyebrow"><Sparkles size={14}/> WHAT YOU CAN DO</div><h2 style={{marginTop:18}}>Everything in one workspace.</h2><p className="sub">Tools to run campaigns thoughtfully and understand what is working.</p>
      <div className="cards">{features.map((f)=><article className="card" key={f.title}><div className="iconbox">{f.icon}</div><h3>{f.title}</h3><p>{f.text}</p></article>)}</div>
    </div></section>
    <section className="section" id="platform"><div className="shell">
      <div className="cards">
        <article className="card"><div className="iconbox"><Wallet size={20}/></div><h3>Customer workspace</h3><p>Account overview, campaign requests, transaction history and support.</p></article>
        <article className="card"><div className="iconbox"><ChartNoAxesCombined size={20}/></div><h3>Useful analytics</h3><p>Bring campaign results together and make performance easier to understand.</p></article>
        <article className="card"><div className="iconbox"><ShieldCheck size={20}/></div><h3>Admin controls</h3><p>Manage users, services, access permissions and audit activity.</p></article>
      </div>
    </div></section>
    <section className="section" id="trust"><div className="shell"><h2>Real campaigns. Clear records.</h2><p className="sub">Launchpad is designed for legitimate marketing workflows and platform-compliant services. It does not offer fake followers, likes, views or automated engagement.</p></div></section>
    <footer className="shell footer"><span>© {new Date().getFullYear()} Launchpad. Starter project.</span><span>Built for transparent social growth.</span></footer>
  </main>;
}
