import React,{useState} from "react";
import {NavLink,Outlet} from "react-router-dom";
import {LayoutDashboard,CalendarDays,KanbanSquare,ListChecks,Image,BrainCircuit,BarChart3,Users,BriefcaseBusiness,Settings,LogOut,Moon,Sun,Bell,Search,Database,ShieldCheck,CreditCard,History,Activity} from "lucide-react";
import {useApp} from "../context/AppContext";

const nav = [
  ["/","Dashboard",LayoutDashboard],["/calendar","Calendar",CalendarDays],["/kanban","Kanban",KanbanSquare],
  ["/content","Content Library",ListChecks],["/media","Media Library",Image],["/ai","AI Studio",BrainCircuit],
  ["/analytics","Analytics",BarChart3],["/team","Team",Users],["/brands","Brands",BriefcaseBusiness],
  ["/backup","Backup",Database],["/audit","Audit Log",History],["/admin","Admin",ShieldCheck],["/billing","Billing",CreditCard],["/health","System Health",Activity],["/settings","Settings",Settings]
];

export default function Layout(){
  const {brands,activeBrand,setActiveBrand,dark,setDark,logout,notifications} = useApp();
  const [search,setSearch] = useState("");
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">OS</div><div><h1>Creator OS</h1><p>Enterprise Core</p></div></div>
      <label className="brand-switcher"><span>Workspace</span><select value={activeBrand} onChange={e=>setActiveBrand(e.target.value)}><option value="all">All Brands</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <nav>{nav.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"}><Icon size={18}/>{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><button onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>} {dark?"Light":"Dark"} Mode</button><button onClick={logout}><LogOut size={18}/> Logout</button></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="global-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Global search..."/></div><div className="top-actions"><button className="icon-button"><Bell size={18}/>{notifications.length>0&&<span>{notifications.length}</span>}</button></div></header>
      <Outlet context={{globalSearch:search}}/>
    </main>
  </div>
}
