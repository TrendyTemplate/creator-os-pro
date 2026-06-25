import React,{useState} from "react";
import {Plus,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";
export default function Brands(){
  const {brands,createItem,deleteItem}=useApp();
  const [form,setForm]=useState(null);
  return <div className="page"><div className="page-head"><div><span className="eyebrow">Multi-brand management</span><h2>Brands</h2></div><button className="primary" onClick={()=>setForm({name:"",color:"#2563eb",description:""})}><Plus size={18}/> Add Brand</button></div><div className="brand-grid">{brands.map(b=><article className="brand-card" key={b.id}><span style={{background:b.color}}></span><h3>{b.name}</h3><p>{b.description||"No description"}</p><button onClick={()=>deleteItem("brands",b.id)}><Trash2 size={15}/></button></article>)}</div>{form&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("brands",form);setForm(null)}}><div className="modal-head"><h3>Add Brand</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><label>Color</label><input type="color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})}/><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="primary wide">Save Brand</button></form></div>}</div>
}
