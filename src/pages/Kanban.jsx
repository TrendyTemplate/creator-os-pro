import React,{useState} from "react";
import {useApp} from "../context/AppContext";
import {STAGES} from "../lib/constants";
import {overallStatus} from "../lib/helpers";
import VideoCard from "../components/VideoCard";
import VideoEditor from "../components/VideoEditor";
export default function Kanban(){
  const {videos,brands,createItem,updateItem,deleteItem} = useApp();
  const [editor,setEditor]=useState(null);
  async function save(v){if(v.id){const{id,...rest}=v;await updateItem("videos",id,rest)}else await createItem("videos",v);setEditor(null)}
  return <div className="page"><div className="page-head"><div><span className="eyebrow">Workflow board</span><h2>Kanban</h2></div></div><div className="kanban">{STAGES.map(stage=><section className="lane" key={stage}><h3>{stage}<span>{videos.filter(v=>(v.stage||overallStatus(v))===stage).length}</span></h3>{videos.filter(v=>(v.stage||overallStatus(v))===stage).map(v=><VideoCard compact key={v.id} video={v} onEdit={()=>setEditor(v)} onDelete={()=>deleteItem("videos",v.id)}/>)}</section>)}</div>{editor&&<VideoEditor initial={editor} brands={brands} onClose={()=>setEditor(null)} onSave={save}/>}</div>
}
