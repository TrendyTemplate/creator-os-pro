import React,{useState} from "react";
import {NavLink,Outlet} from "react-router-dom";
import {LayoutDashboard,CalendarDays,KanbanSquare,ListChecks,Image,BrainCircuit,BarChart3,Users,BriefcaseBusiness,Settings,LogOut,Moon,Sun,Bell,Search,Database,ShieldCheck,CreditCard,History,Activity,Send,FileText,Archive,Target,CalendarRange,Lightbulb,Bot,Home,PanelLeftClose,Command} from "lucide-react";
import {useApp} from "../context/AppContext";

const sections = [
  {title:"Command", items:[["/","Dashboard",LayoutDashboard],["/workspace","Workspace",Home],["/calendar","Calendar",CalendarDays],["/kanban","Kanban",KanbanSquare]]},
  {title:"Content", items:[["/content","Content Library",ListChecks],["/media","Media Library",Image],["/ideas","Idea Vault",Lightbulb],["/templates","Templates",FileText],["/archive","Archive",Archive]]},
  {title:"Planning", items:[["/campaigns","Campaigns",CalendarRange],["/goals","Goals",Target],["/publish","Publish Center",Send],["/automations","Automations",Bot],["/notifications","Notifications",Bell]]},
  {title:"Intelligence", items:[["/ai","AI Studio",BrainCircuit],["/analytics","Analytics",BarChart3],["/reports","Reports",FileText],["/health","System Health",Activity]]},
  {title:"Enterprise", items:[["/team","Team",Users],["/brands","Brands",BriefcaseBusiness],["/backup","Backup",Database],["/audit","Audit Log",History],["/admin","Admin",ShieldCheck],["/billing","Billing",CreditCard],["/settings","Settings",Settings]]}
];

export default function Layout(){
  const {brands,activeBrand,setActiveBrand,dark,setDark,logout,notifications,allVideos,allMedia,tasks} = useApp();
  const [search,setSearch] = useState("");
  return <div className="os-shell">
    <aside className="os-sidebar">
      <div className="os-brand">
        <div className="os-brand-mark">DX</div>
        <div><h1>Creator OS 2.0</h1><p>Final Integrated Core</p></div>
      </div>
      <div className="os-release-badge"><Command size={15}/> Final Integrated Build</div>
      <label className="os-brand-switcher"><span>Workspace</span><select value={activeBrand} onChange={e=>setActiveBrand(e.target.value)}><option value="all">All Brands</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <nav className="os-nav">{sections.map(section=><div className="os-nav-section" key={section.title}><b>{section.title}</b>{section.items.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"}><Icon size={17}/><span>{label}</span></NavLink>)}</div>)}</nav>
      <div className="os-sidebar-metrics"><span>{allVideos.length} videos</span><span>{allMedia.length} assets</span><span>{tasks.length} records</span></div>
      <div className="os-sidebar-bottom"><button onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>} {dark?"Light":"Dark"}</button><button onClick={logout}><LogOut size={18}/> Logout</button></div>
    </aside>
    <main className="os-main">
      <header className="os-topbar">
        <div className="os-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search content, campaigns, ideas..."/></div>
        <div className="os-top-actions"><button className="os-pill">Enterprise Core</button><button className="os-icon-button"><Bell size={18}/>{notifications.length>0&&<span>{notifications.length}</span>}</button></div>
      </header>
      <Outlet context={{globalSearch:search}}/>
    </main>
  </div>
}
