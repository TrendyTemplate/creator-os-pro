import React,{useState} from "react";
import {Bell,Plus,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";
export default function Notifications(){
  const {notifications,createItem,deleteItem}=useApp();
  const [form,setForm]=useState(null);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Reminder center</span><h2>Notifications</h2></div><button className="primary" onClick={()=>setForm({title:"",message:"",date:"",type:"notification",read:false})}><Plus size={18}/> Add Reminder</button></div>
    <section className="panel"><h3>Reminder Inbox</h3>{notifications.length?notifications.map(n=><div className="notification-row" key={n.id}><Bell size={18}/><div><b>{n.title}</b><p>{n.message}</p><small>{n.date}</small></div><button onClick={()=>deleteItem("notifications",n.id)}><Trash2 size={15}/></button></div>):<div className="empty">No notifications yet</div>}</section>
    {form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("notifications",form);setForm(null)}}><div className="modal-head"><h3>Add Reminder</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label>Message</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><button className="primary wide">Save Reminder</button></form></div>}
  </div>
}
