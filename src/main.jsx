import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp
} from "firebase/firestore";
import {
  LayoutDashboard, CalendarDays, KanbanSquare, ListChecks, Plus, Search,
  LogOut, Moon, Sun, Clock, AlertTriangle, CheckCircle2, Flame,
  Link as LinkIcon, Filter, X, Bell, Smartphone, Sparkles
} from "lucide-react";
import { auth, provider, db } from "./firebase";
import "./styles.css";

const STAGES = ["Idea","Script","Shoot","Editing","Thumbnail","Caption","Ready","Scheduled","Published"];
const PLATFORM_STATUS = ["Not Started","Editing","Ready","Scheduled","Published"];
const CATEGORIES = ["Travel","Food","Vlog","Review","Business","Family","Other"];
const PRIORITIES = ["Low","Medium","High","Urgent"];

const PLATFORMS = {
  facebook:{name:"Facebook", logo:"f", cls:"facebook"},
  instagram:{name:"Instagram", logo:"◎", cls:"instagram"},
  tiktok:{name:"TikTok", logo:"♪", cls:"tiktok"},
  youtube:{name:"YouTube", logo:"▶", cls:"youtube"},
};

const emptyVideo = {
  title:"",
  date:new Date().toISOString().slice(0,10),
  time:"20:00",
  type:"short",
  category:"Travel",
  priority:"Medium",
  stage:"Scheduled",
  sameStatus:true,
  commonStatus:"Scheduled",
  platformStatus:{facebook:"Scheduled", instagram:"Scheduled", tiktok:"Scheduled", youtube:"Scheduled"},
  captionReady:false,
  thumbnailReady:false,
  scriptReady:false,
  videoReady:false,
  scriptLink:"",
  driveLink:"",
  caption:"",
  hashtags:"",
  notes:"",
};

function getOverallStatus(v){
  const vals = Object.values(v.platformStatus || {});
  if (!vals.length) return v.stage || "Idea";
  if (vals.every(x => x === "Published")) return "Published";
  if (vals.includes("Scheduled")) return "Scheduled";
  if (vals.includes("Ready")) return "Ready";
  if (vals.includes("Editing")) return "Editing";
  return v.stage || vals[0] || "Idea";
}
function formatDate(d){ return new Date(d+"T00:00:00").toLocaleDateString("bn-BD",{day:"numeric",month:"short",year:"numeric"}); }
function formatTime(t){ const [h,m]=String(t||"00:00").split(":").map(Number); const d=new Date(); d.setHours(h,m,0,0); return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}); }
function hoursLeft(v){
  const dt = new Date(`${v.date}T${v.time||"00:00"}`);
  return Math.ceil((dt - new Date()) / 36e5);
}
function leftLabel(v){
  const h = hoursLeft(v);
  if (getOverallStatus(v)==="Published") return "Published";
  if (h < 0) return "Overdue";
  if (h < 24) return `${h}h left`;
  return `${Math.ceil(h/24)}d left`;
}
function platformKeysForType(type){
  return type === "full" ? ["facebook","youtube"] : ["facebook","instagram","tiktok","youtube"];
}

function App(){
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [videos,setVideos] = useState([]);
  const [view,setView] = useState("dashboard");
  const [dark,setDark] = useState(false);
  const [modal,setModal] = useState(null);
  const [month,setMonth] = useState(new Date());
  const [queryText,setQueryText] = useState("");
  const [statusFilter,setStatusFilter] = useState("All");
  const [typeFilter,setTypeFilter] = useState("All");

  useEffect(() => onAuthStateChanged(auth, (u)=>{ setUser(u); setLoading(false); }), []);
  useEffect(() => {
    if(!user) return;
    const ref = query(collection(db,"users",user.uid,"videos"), orderBy("date"));
    return onSnapshot(ref, snap => setVideos(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, [user]);
  useEffect(()=>{ document.body.classList.toggle("dark", dark); }, [dark]);

  async function saveVideo(video){
    const payload = {...video, updatedAt: serverTimestamp()};
    if(video.id){
      const id = video.id;
      delete payload.id;
      await updateDoc(doc(db,"users",user.uid,"videos",id), payload);
    }else{
      await addDoc(collection(db,"users",user.uid,"videos"), {...payload, createdAt: serverTimestamp()});
    }
    setModal(null);
  }
  async function removeVideo(id){
    if(confirm("এই ভিডিও schedule delete করবেন?")){
      await deleteDoc(doc(db,"users",user.uid,"videos",id));
    }
  }

  if(loading) return <div className="loading">Loading Creator OS...</div>;
  if(!user) return <Login />;

  const sorted = [...videos].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const filtered = sorted.filter(v => {
    const textMatch = !queryText || [v.title,v.category,v.notes,v.caption,v.hashtags].join(" ").toLowerCase().includes(queryText.toLowerCase());
    const statusMatch = statusFilter === "All" || getOverallStatus(v) === statusFilter || v.stage === statusFilter;
    const typeMatch = typeFilter === "All" || v.type === typeFilter;
    return textMatch && statusMatch && typeMatch;
  });

  return <div className="app">
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">OS</div>
        <div><h1>Creator OS</h1><p>Premium Calendar</p></div>
      </div>
      <Nav icon={<LayoutDashboard/>} label="Dashboard" value="dashboard" view={view} setView={setView}/>
      <Nav icon={<CalendarDays/>} label="Calendar" value="calendar" view={view} setView={setView}/>
      <Nav icon={<KanbanSquare/>} label="Kanban" value="kanban" view={view} setView={setView}/>
      <Nav icon={<ListChecks/>} label="All Videos" value="list" view={view} setView={setView}/>
      <div className="syncCard">
        <Sparkles size={18}/><b>Cloud Sync Active</b>
        <span>Google Login দিয়ে সব device-এ same data</span>
      </div>
      <div className="sideBottom">
        <button onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}{dark?"Light":"Dark"} Mode</button>
        <button onClick={()=>signOut(auth)}><LogOut/> Logout</button>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div>
          <span className="eyebrow">Creator workflow command center</span>
          <h2>{view==="dashboard"?"Dashboard":view==="calendar"?"Content Calendar":view==="kanban"?"Workflow Board":"All Videos"}</h2>
        </div>
        <button className="primary" onClick={()=>setModal(emptyVideo)}><Plus size={18}/> Add Video</button>
      </header>

      {view==="dashboard" && <Dashboard videos={videos} setModal={setModal}/>}
      {view==="calendar" && <CalendarView videos={videos} month={month} setMonth={setMonth} setModal={setModal}/>}
      {view==="kanban" && <KanbanView videos={videos} setModal={setModal} removeVideo={removeVideo} saveVideo={saveVideo}/>}
      {view==="list" && <ListView videos={filtered} allVideos={videos} setModal={setModal} removeVideo={removeVideo}
        queryText={queryText} setQueryText={setQueryText} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}/>}

      {modal && <VideoModal initial={modal} onClose={()=>setModal(null)} onSave={saveVideo}/>}
    </main>
  </div>
}

function Login(){
  return <div className="loginPage">
    <div className="loginCard">
      <div className="brandMark big">OS</div>
      <h1>Creator OS Premium</h1>
      <p>Facebook, Instagram, TikTok ও YouTube ভিডিও schedule, workflow, status, assets এবং publishing calendar — সব এক জায়গায়।</p>
      <button className="primary wide" onClick={()=>signInWithPopup(auth, provider)}>Continue with Google</button>
    </div>
  </div>
}
function Nav({icon,label,value,view,setView}){ return <button onClick={()=>setView(value)} className={"nav "+(view===value?"active":"")}>{icon}{label}</button> }

function Dashboard({videos,setModal}){
  const now = new Date();
  const weekEnd = new Date(); weekEnd.setDate(now.getDate()+7);
  const upcoming = [...videos].filter(v => new Date(`${v.date}T${v.time}`) >= now).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,5);
  const today = videos.filter(v => v.date === new Date().toISOString().slice(0,10));
  const overdue = videos.filter(v => getOverallStatus(v)!=="Published" && hoursLeft(v)<0);
  const scheduled = videos.filter(v => getOverallStatus(v)==="Scheduled");
  const published = videos.filter(v => getOverallStatus(v)==="Published");
  const weekly = videos.filter(v => {const d=new Date(`${v.date}T${v.time}`); return d>=now && d<=weekEnd;});

  return <div className="dashboard">
    <section className="statsGrid">
      <Stat label="মোট ভিডিও" value={videos.length}/>
      <Stat label="আজকে" value={today.length}/>
      <Stat label="এই সপ্তাহে" value={weekly.length}/>
      <Stat label="Scheduled" value={scheduled.length}/>
      <Stat label="Published" value={published.length}/>
      <Stat label="Overdue" value={overdue.length} danger/>
    </section>

    <section className="heroPanel">
      <div>
        <span className="eyebrow">Next upload</span>
        <h3>{upcoming[0]?.title || "No upcoming video"}</h3>
        {upcoming[0] && <p><Clock size={16}/> {formatDate(upcoming[0].date)} • {formatTime(upcoming[0].time)} • {leftLabel(upcoming[0])}</p>}
      </div>
      <button className="primary" onClick={()=>setModal(emptyVideo)}><Plus size={18}/> Quick Add</button>
    </section>

    <div className="gridTwo">
      <Panel title="Upcoming Queue">
        {upcoming.length ? upcoming.map(v=><VideoCard key={v.id} video={v} onEdit={()=>setModal(v)}/>) : <Empty text="Upcoming video নেই"/>}
      </Panel>
      <Panel title="Platform Overview">
        <PlatformOverview videos={videos}/>
      </Panel>
    </div>

    <Panel title="Publishing Health">
      <div className="healthGrid">
        <Health label="Caption Ready" value={videos.filter(v=>v.captionReady).length} total={videos.length}/>
        <Health label="Thumbnail Ready" value={videos.filter(v=>v.thumbnailReady).length} total={videos.length}/>
        <Health label="Script Ready" value={videos.filter(v=>v.scriptReady).length} total={videos.length}/>
        <Health label="Video Ready" value={videos.filter(v=>v.videoReady).length} total={videos.length}/>
      </div>
    </Panel>
  </div>
}
function Stat({label,value,danger}){return <div className={"stat "+(danger&&value?"danger":"")}><span>{label}</span><strong>{value}</strong></div>}
function Panel({title,children}){return <section className="panel"><div className="panelHead"><h3>{title}</h3></div>{children}</section>}
function Empty({text}){return <div className="empty">{text}</div>}
function Health({label,value,total}){ const pct= total ? Math.round((value/total)*100) : 0; return <div className="health"><div><b>{label}</b><span>{value}/{total}</span></div><div className="bar"><i style={{width:pct+"%"}}/></div></div>}

function PlatformOverview({videos}){
  return <div className="platformOverview">
    {Object.entries(PLATFORMS).map(([k,p])=>{
      const total = videos.filter(v=>v.platformStatus?.[k]).length;
      const published = videos.filter(v=>v.platformStatus?.[k]==="Published").length;
      const scheduled = videos.filter(v=>v.platformStatus?.[k]==="Scheduled").length;
      return <div className="platformRow" key={k}>
        <Logo k={k}/><div><b>{p.name}</b><span>{scheduled} scheduled • {published} published</span></div><strong>{total}</strong>
      </div>
    })}
  </div>
}

function CalendarView({videos,month,setMonth,setModal}){
  const y=month.getFullYear(), m=month.getMonth();
  const first = new Date(y,m,1);
  const start = new Date(y,m,1-first.getDay());
  const cells = Array.from({length:42},(_,i)=>{const d=new Date(start); d.setDate(start.getDate()+i); return d;});
  return <Panel title={<div className="calendarHeader"><button onClick={()=>setMonth(new Date(y,m-1,1))}>←</button><span>{month.toLocaleDateString("bn-BD",{month:"long",year:"numeric"})}</span><button onClick={()=>setMonth(new Date(y,m+1,1))}>→</button></div>}>
    <div className="weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
    <div className="calendarGrid">
      {cells.map(d=>{
        const key = d.toISOString().slice(0,10);
        const dayVideos = videos.filter(v=>v.date===key).sort((a,b)=>a.time.localeCompare(b.time));
        return <div className={"dayCell "+(d.getMonth()!==m?"muted":"")} key={key} onDoubleClick={()=>setModal({...emptyVideo,date:key})}>
          <b>{d.getDate()}</b>
          <div className="dayEvents">{dayVideos.slice(0,4).map(v=><button key={v.id} onClick={()=>setModal(v)} className={"dayEvent "+v.type}>{v.time} • {v.title}</button>)}{dayVideos.length>4 && <span className="more">+{dayVideos.length-4} more</span>}</div>
        </div>
      })}
    </div>
  </Panel>
}

function KanbanView({videos,setModal,removeVideo,saveVideo}){
  return <div className="kanban">
    {STAGES.map(stage=><div className="lane" key={stage}>
      <h3>{stage}<span>{videos.filter(v=>(v.stage||getOverallStatus(v))===stage).length}</span></h3>
      {videos.filter(v=>(v.stage||getOverallStatus(v))===stage).map(v=><VideoCard key={v.id} video={v} onEdit={()=>setModal(v)} onDelete={()=>removeVideo(v.id)} compact/>)}
    </div>)}
  </div>
}

function ListView({videos, setModal, removeVideo, queryText,setQueryText,statusFilter,setStatusFilter,typeFilter,setTypeFilter}){
  return <Panel title="All Videos">
    <div className="toolbar">
      <div className="searchBox"><Search size={16}/><input placeholder="Search title, category, caption..." value={queryText} onChange={e=>setQueryText(e.target.value)}/></div>
      <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
      <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option>All</option><option value="short">Short</option><option value="full">Full</option></select>
    </div>
    <div className="videoList">{videos.length ? videos.map(v=><VideoCard key={v.id} video={v} onEdit={()=>setModal(v)} onDelete={()=>removeVideo(v.id)}/>) : <Empty text="No video found"/>}</div>
  </Panel>
}

function VideoCard({video,onEdit,onDelete,compact}){
  const status = getOverallStatus(video);
  return <article className={"videoCard "+(compact?"compact":"")}>
    <div className="dateBox"><strong>{new Date(video.date+"T00:00").getDate()}</strong><span>{new Date(video.date+"T00:00").toLocaleDateString("en-US",{month:"short"})}</span></div>
    <div className="videoBody">
      <h4>{video.title}</h4>
      <div className="meta">
        <span>{formatDate(video.date)}</span><span>•</span><b>{formatTime(video.time)}</b>
        <TypeBadge type={video.type}/><StatusBadge status={status}/>
        <span className={leftLabel(video)==="Overdue"?"overdue":"left"}>{leftLabel(video)}</span>
      </div>
      <div className="logos">{Object.keys(video.platformStatus||{}).map(k=><Logo key={k} k={k} title={`${PLATFORMS[k].name}: ${video.platformStatus[k]}`}/>)}</div>
      {!compact && <div className="assetFlags">
        <Flag done={video.scriptReady} label="Script"/>
        <Flag done={video.videoReady} label="Video"/>
        <Flag done={video.thumbnailReady} label="Thumbnail"/>
        <Flag done={video.captionReady} label="Caption"/>
      </div>}
    </div>
    <div className="cardActions">
      {onEdit && <button onClick={onEdit}>Edit</button>}
      {onDelete && <button className="dangerBtn" onClick={onDelete}>Delete</button>}
    </div>
  </article>
}
function TypeBadge({type}){return <span className={"typeBadge "+type}>{type==="full"?"Full Video":"Short Video"}</span>}
function StatusBadge({status}){return <span className={"statusBadge s"+status.replaceAll(" ","")}>{status}</span>}
function Logo({k,title}){return <span title={title} className={"logo "+PLATFORMS[k].cls}>{PLATFORMS[k].logo}</span>}
function Flag({done,label}){return <span className={done?"flag done":"flag"}>{done?<CheckCircle2 size={13}/>:<AlertTriangle size={13}/>} {label}</span>}

function VideoModal({initial,onClose,onSave}){
  const [v,setV] = useState({...emptyVideo,...initial});
  const allowedPlatforms = platformKeysForType(v.type);

  useEffect(()=>{
    const allowed = platformKeysForType(v.type);
    const next = {};
    allowed.forEach(k => next[k] = v.sameStatus ? v.commonStatus : (v.platformStatus?.[k] || "Scheduled"));
    setV(x=>({...x, platformStatus: next}));
  }, [v.type]);

  function setField(key,val){ setV(prev=>({...prev,[key]:val})); }
  function setPlatform(k,val){ setV(prev=>({...prev, platformStatus:{...prev.platformStatus,[k]:val}})); }
  function applyCommon(val){
    const next = {};
    Object.keys(v.platformStatus||{}).forEach(k=>next[k]=val);
    setV(prev=>({...prev, commonStatus:val, platformStatus:next}));
  }
  function submit(e){ e.preventDefault(); onSave(v); }

  return <div className="modalOverlay">
    <form className="modalBox" onSubmit={submit}>
      <div className="modalTop"><div><span className="eyebrow">Video schedule</span><h3>{v.id?"Edit Video":"Add New Video"}</h3></div><button type="button" onClick={onClose}><X/></button></div>
      <label>Video Title</label>
      <input required value={v.title} onChange={e=>setField("title",e.target.value)} placeholder="Example: Thailand EP 13 Short Reel"/>
      <div className="twoCols"><div><label>Publish Date</label><input type="date" value={v.date} onChange={e=>setField("date",e.target.value)}/></div><div><label>Publish Time</label><input type="time" value={v.time} onChange={e=>setField("time",e.target.value)}/></div></div>
      <label>Video Type</label>
      <div className="segmented"><button type="button" className={v.type==="short"?"on":""} onClick={()=>setField("type","short")}>Short Video</button><button type="button" className={v.type==="full"?"on":""} onClick={()=>setField("type","full")}>Full Video</button></div>
      <div className="twoCols"><div><label>Workflow Stage</label><select value={v.stage} onChange={e=>setField("stage",e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div><div><label>Category</label><select value={v.category} onChange={e=>setField("category",e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div></div>
      <label>Platform Selection</label>
      <div className="platformPicker">{allowedPlatforms.map(k=><button type="button" className={v.platformStatus?.[k]?"on":""} onClick={()=>{ const ps={...(v.platformStatus||{})}; ps[k]?delete ps[k]:ps[k]=v.commonStatus; setField("platformStatus",ps); }} key={k}><Logo k={k}/>{PLATFORMS[k].name}</button>)}</div>
      <label className="switchLine"><span>Selected সব platform-এ same status</span><input type="checkbox" checked={v.sameStatus} onChange={e=>setField("sameStatus",e.target.checked)}/></label>
      {v.sameStatus ? <>
        <label>Common Platform Status</label>
        <select value={v.commonStatus} onChange={e=>applyCommon(e.target.value)}>{PLATFORM_STATUS.map(s=><option key={s}>{s}</option>)}</select>
      </> : <div className="platformStatuses">{Object.keys(v.platformStatus||{}).map(k=><div key={k}><span><Logo k={k}/>{PLATFORMS[k].name}</span><select value={v.platformStatus[k]} onChange={e=>setPlatform(k,e.target.value)}>{PLATFORM_STATUS.map(s=><option key={s}>{s}</option>)}</select></div>)}</div>}
      <div className="checkGrid">
        <Check label="Script Ready" checked={v.scriptReady} onChange={val=>setField("scriptReady",val)}/>
        <Check label="Video Ready" checked={v.videoReady} onChange={val=>setField("videoReady",val)}/>
        <Check label="Thumbnail Ready" checked={v.thumbnailReady} onChange={val=>setField("thumbnailReady",val)}/>
        <Check label="Caption Ready" checked={v.captionReady} onChange={val=>setField("captionReady",val)}/>
      </div>
      <div className="twoCols"><div><label>Script Link</label><input value={v.scriptLink} onChange={e=>setField("scriptLink",e.target.value)} placeholder="Google Doc / Notion"/></div><div><label>Drive Link</label><input value={v.driveLink} onChange={e=>setField("driveLink",e.target.value)} placeholder="Google Drive folder/video"/></div></div>
      <label>Caption</label><textarea rows="3" value={v.caption} onChange={e=>setField("caption",e.target.value)} placeholder="Final caption..."/>
      <label>Hashtags</label><input value={v.hashtags} onChange={e=>setField("hashtags",e.target.value)} placeholder="#travel #vlog #shorts"/>
      <label>Notes</label><textarea rows="3" value={v.notes} onChange={e=>setField("notes",e.target.value)} placeholder="Internal note..."/>
      <button className="primary wide">Save Schedule</button>
    </form>
  </div>
}
function Check({label,checked,onChange}){return <label className="check"><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/>{label}</label>}

createRoot(document.getElementById("root")).render(<App/>);
