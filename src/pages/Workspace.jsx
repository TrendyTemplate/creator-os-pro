import React from "react";
import {useApp} from "../context/AppContext";
import {overallStatus} from "../lib/helpers";
export default function Workspace(){
  const {allVideos,brands,allMedia,tasks,notifications}=useApp();
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Executive overview</span><h2>Workspace</h2></div></div>
    <section className="workspace-grid">
      <div className="workspace-card"><span>Brands</span><strong>{brands.length}</strong><p>Active content workspaces</p></div>
      <div className="workspace-card"><span>Videos</span><strong>{allVideos.length}</strong><p>{allVideos.filter(v=>overallStatus(v)==="Published").length} published</p></div>
      <div className="workspace-card"><span>Assets</span><strong>{allMedia.length}</strong><p>Stored media references</p></div>
      <div className="workspace-card"><span>Tasks</span><strong>{tasks.length}</strong><p>Across campaigns and team</p></div>
      <div className="workspace-card"><span>Reminders</span><strong>{notifications.length}</strong><p>Notification center</p></div>
      <div className="workspace-card"><span>Health</span><strong>Good</strong><p>System running</p></div>
    </section>
  </div>
}
