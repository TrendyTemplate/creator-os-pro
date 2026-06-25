import React,{useState} from "react";
import {Lightbulb,Plus,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";
export default function Ideas(){
  const {tasks,createItem,deleteItem}=useApp();
  const ideas=tasks.filter(t=>t.type==="idea");
  const [form,setForm]=useState(null);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Research hub</span><h2>Idea Vault</h2></div><button className="primary" onClick={()=>setForm({type:"idea",title:"",hook:"",category:"Travel",priority:"Medium",notes:""})}><Plus size={18}/> Add Idea</button></div>
    <div className="idea-grid">{ideas.map(i=><article className="idea-card" key={i.id}><Lightbulb size={22}/><span>{i.priority}</span><h3>{i.title}</h3><p>{i.hook}</p><small>{i.category}</small><button onClick={()=>deleteItem("tasks",i.id)}><Trash2 size={15}/></button></article>)}</div>
    {!ideas.length&&<div className="empty">No ideas yet</div>}
    {form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("tasks",form);setForm(null)}}><div className="modal-head"><h3>Add Idea</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Idea Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label>Hook</label><input value={form.hook} onChange={e=>setForm({...form,hook:e.target.value})}/><label>Category</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select><label>Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/><button className="primary wide">Save Idea</button></form></div>}
  </div>
}
