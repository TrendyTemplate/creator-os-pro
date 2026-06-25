import React,{useState} from "react";
import {Plus,Target,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";

export default function Goals(){
  const {tasks,createItem,deleteItem}=useApp();
  const goals=tasks.filter(t=>t.type==="goal");
  const [form,setForm]=useState(null);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">KPI tracker</span><h2>Goals</h2></div><button className="primary" onClick={()=>setForm({type:"goal",title:"",target:30,current:0,period:"Monthly"})}><Plus size={18}/> Add Goal</button></div>
    <div className="goal-grid">{goals.map(g=>{const pct=g.target?Math.min(100,Math.round((Number(g.current||0)/Number(g.target||1))*100)):0;return <article className="goal-card" key={g.id}><Target size={22}/><h3>{g.title}</h3><p>{g.period} goal</p><div className="metric-bar big"><i style={{width:pct+"%"}}/></div><strong>{g.current||0}/{g.target||0}</strong><button onClick={()=>deleteItem("tasks",g.id)}><Trash2 size={15}/></button></article>})}</div>
    {!goals.length&&<div className="empty">No goals yet</div>}
    {form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("tasks",form);setForm(null)}}><div className="modal-head"><h3>Add Goal</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Goal Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label>Target</label><input type="number" value={form.target} onChange={e=>setForm({...form,target:Number(e.target.value)})}/><label>Current</label><input type="number" value={form.current} onChange={e=>setForm({...form,current:Number(e.target.value)})}/><label>Period</label><select value={form.period} onChange={e=>setForm({...form,period:e.target.value})}><option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Yearly</option></select><button className="primary wide">Save Goal</button></form></div>}
  </div>
}
