import React,{useState} from "react";
import {Plus,Copy,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";

export default function Templates(){
  const {tasks,createItem,deleteItem}=useApp();
  const templates = tasks.filter(t=>t.type==="template");
  const [form,setForm]=useState(null);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Reusable content assets</span><h2>Templates</h2></div><button className="primary" onClick={()=>setForm({title:"",category:"Caption",body:"",type:"template"})}><Plus size={18}/> Add Template</button></div>
    <div className="template-grid">{templates.map(t=><article className="template-card" key={t.id}><span>{t.category}</span><h3>{t.title}</h3><p>{t.body}</p><div><button onClick={()=>navigator.clipboard.writeText(t.body||"")}><Copy size={15}/> Copy</button><button onClick={()=>deleteItem("tasks",t.id)}><Trash2 size={15}/></button></div></article>)}</div>
    {!templates.length&&<div className="empty">No templates yet</div>}
    {form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("tasks",form);setForm(null)}}><div className="modal-head"><h3>Add Template</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Caption</option><option>Hashtag</option><option>Script</option><option>Checklist</option><option>Prompt</option></select><label>Content</label><textarea rows="6" value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/><button className="primary wide">Save Template</button></form></div>}
  </div>
}
