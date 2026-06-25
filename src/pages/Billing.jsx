import React from "react";
import {CreditCard,CheckCircle2} from "lucide-react";
export default function Billing(){
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Subscription ready</span><h2>Billing</h2></div></div>
    <section className="panel"><h3>Billing Module</h3><p>This module is ready as UI and data structure placeholder. Real paid subscription needs Stripe or Paddle account connection, webhook endpoint, product IDs and server-side payment verification.</p></section>
    <div className="pricing-grid">
      {[
        ["Starter","Personal creator workspace","$9/mo",["Content calendar","Media library","AI Studio","Backup"]],
        ["Pro","Multi-brand creator workflow","$29/mo",["All Starter","Multi-brand","Team tasks","Analytics"]],
        ["Enterprise","Agency/team system","Custom",["Admin roles","Audit log","Priority support","Future API integrations"]]
      ].map(([name,desc,price,items])=><article className="pricing-card" key={name}><h3>{name}</h3><p>{desc}</p><strong>{price}</strong>{items.map(i=><span key={i}><CheckCircle2 size={15}/> {i}</span>)}<button className="primary wide"><CreditCard size={18}/> Configure Later</button></article>)}
    </div>
  </div>
}
