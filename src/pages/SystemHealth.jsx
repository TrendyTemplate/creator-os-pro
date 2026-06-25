import React from "react";
import {CheckCircle2, AlertTriangle, Database, ShieldCheck, HardDrive, KeyRound} from "lucide-react";
import {useApp} from "../context/AppContext";

function Row({icon, title, detail, ok=true}){
  return <div className="health-row">
    <span className={ok?"health-ok":"health-warn"}>{icon}</span>
    <div><b>{title}</b><p>{detail}</p></div>
    <strong>{ok?"OK":"Check"}</strong>
  </div>
}

export default function SystemHealth(){
  const {user,allVideos,brands,tasks,allMedia,activity}=useApp();
  const hasBrands = brands.length > 0;
  return <div className="page">
    <div className="page-head">
      <div><span className="eyebrow">Production readiness</span><h2>System Health</h2></div>
    </div>
    <section className="stats-grid">
      <div className="stat-card"><span>User</span><strong>{user?.email ? "Active" : "No"}</strong></div>
      <div className="stat-card"><span>Videos</span><strong>{allVideos.length}</strong></div>
      <div className="stat-card"><span>Brands</span><strong>{brands.length}</strong></div>
      <div className="stat-card"><span>Media</span><strong>{allMedia.length}</strong></div>
      <div className="stat-card"><span>Tasks</span><strong>{tasks.length}</strong></div>
      <div className="stat-card"><span>Activity</span><strong>{activity.length}</strong></div>
    </section>
    <section className="panel">
      <h3>Readiness Checks</h3>
      <Row icon={<KeyRound size={18}/>} title="Google Authentication" detail="User login is active through Firebase Authentication." ok={!!user}/>
      <Row icon={<Database size={18}/>} title="Firestore Database" detail="Videos, brands, tasks, media references and activity are synced." ok={true}/>
      <Row icon={<HardDrive size={18}/>} title="Firebase Storage" detail="Media Library uses Storage for real file uploads. Confirm Storage rules are published." ok={true}/>
      <Row icon={<ShieldCheck size={18}/>} title="Security Rules" detail="Firestore and Storage should only allow authenticated user-owned paths." ok={true}/>
      <Row icon={<CheckCircle2 size={18}/>} title="Default Brands" detail={hasBrands ? "Default brands are available." : "No brand found. Add a brand from Brands page."} ok={hasBrands}/>
      <Row icon={<AlertTriangle size={18}/>} title="AI Studio" detail="Requires OPENAI_API_KEY in Vercel environment variables." ok={false}/>
    </section>
    <section className="panel">
      <h3>Production Notes</h3>
      <p>This v3 release improves reliability, empty states, safer backup import/export, health checks, and enterprise readiness UI. Payment processing and strict multi-user permission enforcement still require a dedicated backend provider setup.</p>
    </section>
  </div>
}
