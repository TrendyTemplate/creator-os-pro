import React,{useState} from "react";
import {ShieldCheck,Plus,Trash2} from "lucide-react";
import {useApp} from "../context/AppContext";

export default function Admin(){
  const {user,brands,tasks,activity,createItem,deleteItem}=useApp();
  const [member,setMember]=useState(null);
  const members = tasks.filter(t=>t.type==="member");
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Enterprise control</span><h2>Admin & Roles</h2></div><button className="primary" onClick={()=>setMember({title:"",email:"",role:"Editor",brandId:brands[0]?.id||"",type:"member"})}><Plus size={18}/> Add Member</button></div>
    <section className="stats-grid">
      <div className="stat-card"><span>Owner</span><strong>1</strong></div>
      <div className="stat-card"><span>Members</span><strong>{members.length}</strong></div>
      <div className="stat-card"><span>Roles</span><strong>4</strong></div>
      <div className="stat-card"><span>Brands</span><strong>{brands.length}</strong></div>
      <div className="stat-card"><span>Activity</span><strong>{activity.length}</strong></div>
      <div className="stat-card"><span>Status</span><strong>Secure</strong></div>
    </section>
    <div className="two-panel">
      <section className="panel"><h3>Role System</h3>
        <div className="role-list">
          <div><b>Owner</b><span>Full access, billing, settings, delete</span></div>
          <div><b>Admin</b><span>Manage brands, team, content, media</span></div>
          <div><b>Editor</b><span>Create/edit content, upload media, manage tasks</span></div>
          <div><b>Viewer</b><span>Read-only access</span></div>
        </div>
      </section>
      <section className="panel"><h3>Security Notes</h3>
        <p>Current app is single-owner Firebase workspace. Team members are prepared as records. Full multi-user permission enforcement needs custom claims or backend rules when you invite real users.</p>
      </section>
    </div>
    <section className="panel"><h3>Team Members</h3>
      {members.length?members.map(m=><article className="task-card" key={m.id}><span className="task-status">{m.role}</span><h4>{m.title||m.email}</h4><p>{m.email} • {m.brandId}</p><button onClick={()=>deleteItem("tasks",m.id)}><Trash2 size={15}/></button></article>):<div className="empty">No members added yet</div>}
    </section>
    {member&&<div className="modal"><form className="modal-card" onSubmit={async e=>{e.preventDefault();await createItem("tasks",member);setMember(null)}}><div className="modal-head"><h3>Add Member Record</h3><button type="button" onClick={()=>setMember(null)}>×</button></div><label>Name</label><input value={member.title} onChange={e=>setMember({...member,title:e.target.value})}/><label>Email</label><input type="email" value={member.email} onChange={e=>setMember({...member,email:e.target.value})}/><label>Role</label><select value={member.role} onChange={e=>setMember({...member,role:e.target.value})}><option>Admin</option><option>Editor</option><option>Viewer</option></select><label>Brand</label><select value={member.brandId} onChange={e=>setMember({...member,brandId:e.target.value})}>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select><button className="primary wide"><ShieldCheck size={18}/> Save Member</button></form></div>}
  </div>
}
