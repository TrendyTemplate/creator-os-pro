import React,{useState} from "react";
import {useApp} from "../context/AppContext";
import VideoEditor from "../components/VideoEditor";
export default function Calendar(){
  const {videos,brands,createItem,updateItem} = useApp();
  const [month,setMonth] = useState(new Date());
  const [editor,setEditor] = useState(null);
  const y=month.getFullYear(),m=month.getMonth();
  const start=new Date(y,m,1-new Date(y,m,1).getDay());
  const cells=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
  async function save(v){if(v.id){const {id,...rest}=v;await updateItem("videos",id,rest)}else await createItem("videos",v);setEditor(null)}
  return <div className="page"><div className="page-head"><div><span className="eyebrow">Month planner</span><h2>Calendar</h2></div></div><section className="panel"><div className="calendar-head"><button onClick={()=>setMonth(new Date(y,m-1,1))}>←</button><h3>{month.toLocaleDateString("bn-BD",{month:"long",year:"numeric"})}</h3><button onClick={()=>setMonth(new Date(y,m+1,1))}>→</button></div><div className="weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=><span key={x}>{x}</span>)}</div><div className="calendar-grid">{cells.map(d=>{const key=d.toISOString().slice(0,10), items=videos.filter(v=>v.date===key);return <div key={key} className={`day-cell ${d.getMonth()!==m?"muted":""}`} onDoubleClick={()=>setEditor({date:key})}><b>{d.getDate()}</b>{items.slice(0,4).map(v=><button key={v.id} className={`calendar-event ${v.type}`} onClick={()=>setEditor(v)}>{v.time} • {v.title}</button>)}{items.length>4&&<small>+{items.length-4} more</small>}</div>})}</div></section>{editor&&<VideoEditor initial={editor} brands={brands} onClose={()=>setEditor(null)} onSave={save}/>}</div>
}
