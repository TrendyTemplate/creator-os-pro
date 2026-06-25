import React,{useMemo,useState} from "react";
import {Plus,Clock,TrendingUp,Target,Send,CalendarDays,FolderOpen,CheckCircle2,AlertTriangle} from "lucide-react";
import {useApp} from "../context/AppContext";
import VideoEditor from "../components/VideoEditor";
import VideoCard from "../components/VideoCard";
import PlatformLogo from "../components/PlatformLogo";
import {overallStatus,toDateTime,todayISO} from "../lib/helpers";
import {PLATFORMS} from "../lib/constants";

export default function Dashboard(){
  const {videos,allVideos,brands,media,allMedia,tasks,activity,createItem,updateItem} = useApp();
  const [editor,setEditor] = useState(null);
  const now=new Date();
  const upcoming=[...videos].filter(v=>toDateTime(v)>=now).sort((a,b)=>toDateTime(a)-toDateTime(b));
  const today=videos.filter(v=>v.date===todayISO());
  const published=videos.filter(v=>overallStatus(v)==="Published");
  const scheduled=videos.filter(v=>overallStatus(v)==="Scheduled");
  const overdue=videos.filter(v=>overallStatus(v)!=="Published"&&toDateTime(v)<now);
  const completion=videos.length?Math.round(published.length/videos.length*100):0;
  async function save(v){if(v.id){const {id,...rest}=v;await updateItem("videos",id,rest)}else await createItem("videos",v);setEditor(null)}
  return <div className="page os-dashboard">
    <section className="os-hero-final">
      <div>
        <span className="eyebrow">Creator OS 2.0 • Final Integrated Core</span>
        <h2>Run your creator business from one place.</h2>
        <p>Calendar, workflow, media library, campaigns, goals, publish queue, AI Studio, analytics, team, backup and admin modules are now integrated into one workspace.</p>
        <div className="hero-actions"><button className="primary" onClick={()=>setEditor({})}><Plus size={18}/> Add Content</button><a href="/publish"><Send size={18}/> Open Publish Center</a></div>
      </div>
      <div className="hero-command-card"><b>Next Upload</b><h3>{upcoming[0]?.title||"No upcoming content"}</h3><span>{upcoming[0]?`${upcoming[0].date} • ${upcoming[0].time}`:"Add your next video"}</span></div>
    </section>
    <section className="os-stat-grid-final">
      <Kpi icon={<FolderOpen/>} label="Content" value={videos.length} sub={`${published.length} published`}/>
      <Kpi icon={<CalendarDays/>} label="Today" value={today.length} sub={`${scheduled.length} scheduled`}/>
      <Kpi icon={<AlertTriangle/>} label="Overdue" value={overdue.length} sub="Need attention" danger={overdue.length>0}/>
      <Kpi icon={<TrendingUp/>} label="Completion" value={`${completion}%`} sub="Publishing progress"/>
      <Kpi icon={<Target/>} label="Assets" value={media.length} sub={`${allMedia.length} total media`}/>
      <Kpi icon={<CheckCircle2/>} label="Records" value={tasks.length} sub="tasks, goals, templates"/>
    </section>
    <div className="os-command-grid">
      <section className="panel os-panel-large"><h3>Upcoming Queue</h3>{upcoming.slice(0,7).length?upcoming.slice(0,7).map(v=><VideoCard key={v.id} video={v} onEdit={()=>setEditor(v)}/>):<div className="empty">No upcoming videos</div>}</section>
      <section className="panel"><h3>Platform Command</h3><div className="platform-overview">{Object.entries(PLATFORMS).map(([k,p])=><div className="platform-row" key={k}><PlatformLogo platform={k}/><div><b>{p.name}</b><span>{videos.filter(v=>v.platformStatus?.[k]==="Scheduled").length} scheduled • {videos.filter(v=>v.platformStatus?.[k]==="Published").length} published</span></div><strong>{videos.filter(v=>v.platformStatus?.[k]).length}</strong></div>)}</div></section>
    </div>
    <div className="os-command-grid bottom">
      <section className="panel"><h3>Workspace Snapshot</h3><div className="snapshot-grid"><span><b>{brands.length}</b> Brands</span><span><b>{allVideos.length}</b> All Videos</span><span><b>{allMedia.length}</b> Media</span><span><b>{activity.length}</b> Activity</span></div></section>
      <section className="panel"><h3>Recent Activity</h3>{activity.slice(0,6).length?activity.slice(0,6).map(a=><div className="activity-row" key={a.id}><b>{a.action}</b><span>{a.target}</span><small>{a.userName}</small></div>):<div className="empty">No activity yet</div>}</section>
    </div>
    {editor&&<VideoEditor initial={editor} brands={brands} onClose={()=>setEditor(null)} onSave={save}/>}  
  </div>
}
function Kpi({icon,label,value,sub,danger}){return <article className={`os-kpi ${danger?"danger":""}`}><div>{icon}</div><span>{label}</span><strong>{value}</strong><p>{sub}</p></article>}
