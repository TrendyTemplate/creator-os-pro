import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import {useApp} from "./context/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Kanban from "./pages/Kanban";
import ContentLibrary from "./pages/ContentLibrary";
import MediaLibrary from "./pages/MediaLibrary";
import AIStudio from "./pages/AIStudio";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Brands from "./pages/Brands";
import Backup from "./pages/Backup";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Billing from "./pages/Billing";
import AuditLog from "./pages/AuditLog";
import SystemHealth from "./pages/SystemHealth";

function Login(){
  const {login}=useApp();
  return <div className="login-page"><div className="login-card"><div className="brand-mark large">OS</div><h1>Creator OS Enterprise v3</h1><p>Content planning, calendar, workflow, media storage, AI, analytics, brands, backup এবং team workspace—সব এক জায়গায়।</p><button className="primary wide" onClick={login}>Continue with Google</button></div></div>
}
export default function App(){
  const {user,loading}=useApp();
  if(loading) return <div className="loader">Loading Creator OS...</div>;
  if(!user) return <Login/>;
  return <BrowserRouter><Routes><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/calendar" element={<Calendar/>}/><Route path="/kanban" element={<Kanban/>}/><Route path="/content" element={<ContentLibrary/>}/><Route path="/media" element={<MediaLibrary/>}/><Route path="/ai" element={<AIStudio/>}/><Route path="/analytics" element={<Analytics/>}/><Route path="/team" element={<Team/>}/><Route path="/brands" element={<Brands/>}/><Route path="/backup" element={<Backup/>}/><Route path="/audit" element={<AuditLog/>}/><Route path="/admin" element={<Admin/>}/><Route path="/billing" element={<Billing/>}/><Route path="/health" element={<SystemHealth/>}/><Route path="/settings" element={<Settings/>}/></Route></Routes></BrowserRouter>
}
