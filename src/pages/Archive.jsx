import React from "react";
import {Archive as ArchiveIcon} from "lucide-react";
import {useApp} from "../context/AppContext";
import VideoCard from "../components/VideoCard";
import {overallStatus} from "../lib/helpers";
export default function Archive(){
  const {videos}=useApp();
  const archived = videos.filter(v=>overallStatus(v)==="Published");
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Completed content</span><h2>Archive</h2></div></div>
    <section className="panel"><h3><ArchiveIcon size={18}/> Published Archive</h3>{archived.length?archived.map(v=><VideoCard key={v.id} video={v}/>):<div className="empty">No archived content yet</div>}</section>
  </div>
}
