import React from "react";
import {useApp} from "../context/AppContext";
export default function Settings(){
  const {user,dark,setDark}=useApp();
  return <div className="page"><div className="page-head"><div><span className="eyebrow">Workspace preferences</span><h2>Settings</h2></div></div><div className="two-panel"><section className="panel"><h3>Profile</h3><p><b>Name:</b> {user?.displayName}</p><p><b>Email:</b> {user?.email}</p></section><section className="panel"><h3>Appearance</h3><label className="toggle-row"><span>Dark Mode</span><input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/></label></section></div><section className="panel"><h3>Enterprise Modules</h3><p>এই version-এ real Firebase Storage media upload, backup/export, activity log, multi-brand workspace, analytics, AI Studio, tasks এবং core SaaS modules আছে। Auto social posting পরে independent Publish Center হিসেবে add করা যাবে।</p></section></div>
}
