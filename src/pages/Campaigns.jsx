import React,{useState} from "react";
import {Plus,CalendarRange,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";
export default function Campaigns(){
  const {tasks,brands,createItem,deleteItem}=useApp();
  const campaigns=tasks.filter(t=>t.type==="campaign");
  const [form,setForm]=useState(null);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Editorial planning</span><h2>Campaigns</h2></div><button className="primary" onClick={()=>setForm({type:"campaign",title:"",brandId:brands[0]?.id||"",start:"",end:"",objective:"",status:"Planning"})}><Plus size={18}/> Add Campaign</button></div>
    <div className="campaign-grid">{campaigns.map(c=><article className="campaign-card" key={c.id}><CalendarRange size={22}/><span>{c.status}</span><h3>{c.title}</h3><p>{c.objective}</p><small>{c.start} → {c.end}</small><button onClick={()=>deleteItem("tasks",c.id)}><Trash2 size={15}/></button></article>)}</div>
    {!campaigns.length&&<div className="empty">No campaigns yet</div>}
    {form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("tasks",form);setForm(null)}}><div className="modal-head"><h3>Add Campaign</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Campaign Name</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label>Objective</label><textarea value={form.objective} onChange={e=>setForm({...form,objective:e.target.value})}/><div className="two-col"><div><label>Start</label><input type="date" value={form.start} onChange={e=>setForm({...form,start:e.target.value})}/></div><div><label>End</label><input type="date" value={form.end} onChange={e=>setForm({...form,end:e.target.value})}/></div></div><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Planning</option><option>Active</option><option>Paused</option><option>Completed</option></select><button className="primary wide">Save Campaign</button></form></div>}
  </div>
}
