import React,{useRef} from "react";
import {Download,Upload} from "lucide-react";
import {useApp} from "../context/AppContext";
import {downloadJson} from "../lib/helpers";

export default function Backup(){
  const {allVideos,brands,tasks,allMedia,activity,createItem}=useApp();
  const fileRef = useRef(null);
  const data = {version:"1.0",exportedAt:new Date().toISOString(),videos:allVideos,brands,tasks,media:allMedia,activity};

  async function importBackup(e){
    const file = e.target.files[0]; if(!file) return;\n    let json;\n    try{ json = JSON.parse(await file.text()); }catch(err){ alert("Invalid JSON backup file"); return; }\n    if(!json || !Array.isArray(json.videos || []) || !Array.isArray(json.tasks || [])){ alert("This backup file format is not supported."); return; }
    if(!confirm("Backup import করলে duplicate data তৈরি হতে পারে। Continue?")) return;
    for(const v of (json.videos||[]).slice(0,500)){const {id,createdAt,updatedAt,...rest}=v; if(rest.title) await createItem("videos",rest)}
    for(const t of (json.tasks||[]).slice(0,500)){const {id,createdAt,updatedAt,...rest}=t; if(rest.title) await createItem("tasks",rest)}
  }

  return <div className="page"><div className="page-head"><div><span className="eyebrow">Data safety</span><h2>Backup / Export</h2></div></div>
    <div className="two-panel">
      <section className="panel"><h3>Export Data</h3><p>Videos, brands, tasks, media references and activity export হবে JSON file হিসেবে।</p><button className="primary" onClick={()=>downloadJson(`creator-os-backup-${Date.now()}.json`,data)}><Download size={18}/> Export Backup</button></section>
      <section className="panel"><h3>Import Backup</h3><p>Only videos and tasks import হবে। Media file নিজে import হবে না, শুধু URL থাকলে reference থাকবে।</p><input ref={fileRef} type="file" accept="application/json" onChange={importBackup} hidden/><button className="primary" onClick={()=>fileRef.current.click()}><Upload size={18}/> Import JSON</button></section>
    </div>
  </div>
}
