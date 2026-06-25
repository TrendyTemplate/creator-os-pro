import React,{useState} from "react";
import {Bot,Plus,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";
export default function Automations(){
  const {tasks,createItem,deleteItem}=useApp();
  const rules=tasks.filter(t=>t.type==="automation");
  const [form,setForm]=useState(null);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">No-code rules</span><h2>Automations</h2></div><button className="primary" onClick={()=>setForm({type:"automation",title:"",trigger:"Before publish time",action:"Create reminder",enabled:true})}><Plus size={18}/> Add Rule</button></div>
    <section className="panel automation-note"><h3>Automation Builder</h3><p>এগুলো এখন rule records হিসেবে save হবে। Future version-এ এগুলো background scheduler / notification service-এর সাথে connect করা যাবে।</p></section>
    <div className="automation-grid">{rules.map(r=><article className="automation-card" key={r.id}><Bot size={22}/><span>{r.enabled?"Enabled":"Disabled"}</span><h3>{r.title}</h3><p><b>When:</b> {r.trigger}</p><p><b>Then:</b> {r.action}</p><button onClick={()=>deleteItem("tasks",r.id)}><Trash2 size={15}/></button></article>)}</div>
    {!rules.length&&<div className="empty">No automation rules yet</div>}
    {form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("tasks",form);setForm(null)}}><div className="modal-head"><h3>Add Automation</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Rule Name</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label>Trigger</label><select value={form.trigger} onChange={e=>setForm({...form,trigger:e.target.value})}><option>Before publish time</option><option>When video marked Ready</option><option>When thumbnail missing</option><option>When schedule missed</option></select><label>Action</label><select value={form.action} onChange={e=>setForm({...form,action:e.target.value})}><option>Create reminder</option><option>Add checklist item</option><option>Mark as urgent</option><option>Create task</option></select><label className="toggle-row"><span>Enabled</span><input type="checkbox" checked={form.enabled} onChange={e=>setForm({...form,enabled:e.target.checked})}/></label><button className="primary wide">Save Rule</button></form></div>}
  </div>
}
