import React from "react";
import {CheckCircle2, AlertTriangle, Pencil, Trash2} from "lucide-react";
import PlatformLogo from "./PlatformLogo";
import {formatDate,formatTime,overallStatus,timeLeft} from "../lib/helpers";

export default function VideoCard({video,onEdit,onDelete,compact=false}){
  const status = overallStatus(video);
  return <article className={`video-card ${compact?"compact":""}`}>
    <div className="date-box">
      <strong>{new Date(`${video.date}T00:00:00`).getDate()}</strong>
      <span>{new Date(`${video.date}T00:00:00`).toLocaleDateString("en-US",{month:"short"})}</span>
    </div>
    <div className="video-info">
      <h4>{video.title || "Untitled Video"}</h4>
      <div className="meta-row">
        <span>{formatDate(video.date)}</span><span>•</span><b>{formatTime(video.time)}</b>
        <span className={`pill ${video.type}`}>{video.type==="full"?"Full Video":"Short Video"}</span>
        <span className={`pill status-${status.replaceAll(" ","")}`}>{status}</span>
        <span className={timeLeft(video)==="Overdue"?"overdue":"time-left"}>{timeLeft(video)}</span>
      </div>
      <div className="logo-row">{Object.keys(video.platformStatus||{}).map(p=><PlatformLogo key={p} platform={p} title={`${p}: ${video.platformStatus[p]}`}/>)}</div>
      {!compact && <div className="asset-row">
        {[
          ["Script",video.scriptReady],["Video",video.videoReady],["Thumbnail",video.thumbnailReady],["Caption",video.captionReady]
        ].map(([label,ok])=><span key={label} className={ok?"asset-ok":"asset-missing"}>{ok?<CheckCircle2 size={13}/>:<AlertTriangle size={13}/>} {label}</span>)}
      </div>}
    </div>
    <div className="card-actions">
      {onEdit&&<button onClick={onEdit}><Pencil size={15}/></button>}
      {onDelete&&<button className="danger" onClick={onDelete}><Trash2 size={15}/></button>}
    </div>
  </article>
}
