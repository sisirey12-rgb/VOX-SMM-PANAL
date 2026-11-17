"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { DashboardShell } from "@/components/Shell";

type User = { id: string; name: string; email: string; role: string };
type Service = { id: string; name: string; category: string; description: string; priceCents: number };
type Order = { id: string; status: string; targetUrl: string; budgetCents: number; createdAt: string; service: { name: string } };
type Ticket = { id: string; subject: string; status: string; createdAt: string };
type ApiKey = { id: string; name: string; prefix: string; createdAt: string; revokedAt: string | null };
type Wallet = { entries: { id: string; type: string; amountCents: number; currency: string; createdAt: string }[]; balanceCents: number; currency: string };
const money = (cents: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const responses = await Promise.all(["/api/auth/me", "/api/services", "/api/orders", "/api/wallet", "/api/tickets", "/api/keys"].map(async (url) => {
      const response = await fetch(url, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not load your workspace.");
      return body;
    }));
    setUser(responses[0].user); setServices(responses[1].services); setOrders(responses[2].orders); setWallet(responses[3]); setTickets(responses[4].tickets); setKeys(responses[5].keys);
  }, []);

  useEffect(() => { load().catch((cause: unknown) => { if (cause instanceof Error && cause.message === "Authentication required.") router.replace("/login"); else setError(cause instanceof Error ? cause.message : "Unable to load workspace."); }); }, [load, router]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const element = event.currentTarget; const form = new FormData(element);
    try { const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: form.get("serviceId"), targetUrl: form.get("targetUrl"), brief: form.get("brief"), budgetCents: Math.round(Number(form.get("budgetDollars")) * 100) }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Could not submit campaign."); setMessage(body.message); element.reset(); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not submit campaign."); } finally { setBusy(false); }
  }

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const element=event.currentTarget; const form = new FormData(element);
    try { const response = await fetch("/api/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: form.get("subject"), body: form.get("body") }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Could not open ticket."); setMessage("Support ticket created."); element.reset(); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not open ticket."); } finally { setBusy(false); }
  }

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const element=event.currentTarget; const form = new FormData(element);
    try { const response = await fetch("/api/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name") }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Could not create key."); window.alert(`Copy this API key now. It is shown once:\n\n${body.secret}`); setMessage("API key created."); element.reset(); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create key."); } finally { setBusy(false); }
  }

  async function revokeKey(id: string) { setBusy(true); setError(""); try { const response = await fetch(`/api/keys/${id}`, { method: "DELETE" }); const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Could not revoke key."); setMessage("API key revoked."); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not revoke key."); } finally { setBusy(false); } }
  return <DashboardShell><div className="pageTitle"><div><div className="eyebrow">YOUR VOX WORKSPACE</div><h1>{user ? `Welcome, ${user.name}.` : "Loading workspace…"}</h1></div></div><p className="muted">{user?.email} · Campaigns, requests, and account activity.</p>
    {error && <div className="notice" role="alert" style={{borderColor:"#9f3348",color:"#fecdd3"}}>{error}</div>}{message && <div className="notice" role="status">{message}</div>}
    <div className="stats"><div className="stat"><span className="muted">Active campaigns</span><b>{orders.filter(o=>["APPROVED","RUNNING"].includes(o.status)).length}</b></div><div className="stat"><span className="muted">In review</span><b>{orders.filter(o=>["PENDING","REVIEW"].includes(o.status)).length}</b></div><div className="stat"><span className="muted">Wallet balance</span><b>{wallet ? money(wallet.balanceCents,wallet.currency) : "—"}</b></div><div className="stat"><span className="muted">Open tickets</span><b>{tickets.filter(t=>["OPEN","WAITING"].includes(t.status)).length}</b></div></div>
    <section id="campaigns" className="card"><div className="pageTitle"><h2>Campaigns</h2><span className="muted">Recent activity</span></div><div className="scroll"><table className="table"><thead><tr><th>CAMPAIGN</th><th>SERVICE</th><th>STATUS</th><th>BUDGET</th></tr></thead><tbody>{orders.length ? orders.map(order=><tr key={order.id}><td><a href={order.targetUrl} target="_blank" rel="noreferrer">{order.targetUrl}</a></td><td>{order.service.name}</td><td><span className="badge">{order.status}</span></td><td>{money(order.budgetCents)}</td></tr>) : <tr><td colSpan={4} className="muted">No campaign requests yet.</td></tr>}</tbody></table></div></section>
    <section id="services" className="section"><h2>Request a campaign</h2><div className="card"><form onSubmit={submitOrder} className="formGrid"><label>Service<select name="serviceId" required defaultValue=""><option value="" disabled>Select service</option>{services.map(service=><option key={service.id} value={service.id}>{service.name} · {money(service.priceCents)}</option>)}</select></label><label>Campaign budget (USD)<input name="budgetDollars" type="number" min="10" max="100000" step="0.01" required placeholder="250.00"/></label><label className="full">Landing page or campaign URL<input name="targetUrl" type="url" required maxLength={2048} placeholder="https://example.com/campaign"/></label><label className="full">Campaign brief<textarea name="brief" minLength={20} maxLength={3000} required rows={4} placeholder="Describe the goal, target audience, and approved campaign details."/></label><div className="full"><button className="button" disabled={busy||!services.length}>{busy?"Submitting…":"Submit for review"}</button><p className="muted">Campaign requests are reviewed before fulfillment. No provider is contacted and no payment is taken.</p></div></form></div><div className="grid" style={{marginTop:18}}>{services.map(service=><article className="card" key={service.id}><span className="badge">{service.category}</span><h3>{service.name}</h3><p className="muted">{service.description}</p><b>{money(service.priceCents)}</b></article>)}</div></section>
    <section id="wallet" className="section"><h2>Wallet & ledger</h2><div className="notice">Deposits are disabled until a verified payment provider is configured. No payment will be accepted here.</div><div className="card scroll"><table className="table"><thead><tr><th>DATE</th><th>TYPE</th><th>AMOUNT</th></tr></thead><tbody>{wallet?.entries.length ? wallet.entries.map(entry=><tr key={entry.id}><td>{new Date(entry.createdAt).toLocaleDateString()}</td><td>{entry.type}</td><td>{money(entry.amountCents,entry.currency)}</td></tr>) : <tr><td colSpan={3} className="muted">No ledger entries yet.</td></tr>}</tbody></table></div></section>
    <section id="support" className="section"><h2>Support</h2><div className="grid" style={{gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)"}}><form className="card formGrid" onSubmit={createTicket}><h3 className="full">Open a support ticket</h3><label className="full">Subject<input name="subject" minLength={4} maxLength={160} required/></label><label className="full">Message<textarea name="body" minLength={10} maxLength={5000} rows={4} required/></label><button className="button full" disabled={busy}>Create ticket</button></form><div className="card"><h3>Your tickets</h3>{tickets.length ? tickets.map(ticket=><p key={ticket.id}><span className="badge">{ticket.status}</span> &nbsp;{ticket.subject}</p>) : <p className="muted">No support tickets yet.</p>}</div></div></section>
    <section id="keys" className="section"><h2>API keys</h2><div className="grid" style={{gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)"}}><form className="card formGrid" onSubmit={createKey}><h3 className="full">Create a key</h3><label className="full">Key name<input name="name" minLength={2} maxLength={50} required placeholder="Reporting integration"/></label><button className="button full" disabled={busy}>Create key</button><p className="muted full">The secret is shown once. Store it securely.</p></form><div className="card"><h3>Your keys</h3>{keys.length ? keys.map(key=><div key={key.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,borderBottom:"1px solid #303047",padding:"12px 0"}}><span>{key.name}<br/><small className="muted">{key.prefix}… {key.revokedAt?"· revoked":""}</small></span>{!key.revokedAt&&<button className="button secondary" disabled={busy} onClick={()=>revokeKey(key.id)}>Revoke</button>}</div>) : <p className="muted">No API keys yet.</p>}</div></div></section>
    <p className="muted">Need administrator tools? <Link href="/admin" style={{color:"#c4b5fd"}}>Open admin console</Link></p>
  </DashboardShell>;
}
