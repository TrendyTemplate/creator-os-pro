import React from "react";
import {useApp} from "../context/AppContext";
import {overallStatus} from "../lib/helpers";
export default function Reports(){
  const {allVideos,brands,allMedia,tasks}=useApp();
  const month = new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">Advanced reports</span><h2>Reports</h2></div></div>
    <section className="panel report-cover"><h3>{month} Creator OS Report</h3><p>Manual analytics summary generated from your workspace data.</p></section>
    <section className="stats-grid">
      <div className="stat-card"><span>Total Content</span><strong>{allVideos.length}</strong></div>
      <div className="stat-card"><span>Published</span><strong>{allVideos.filter(v=>overallStatus(v)==="Published").length}</strong></div>
      <div className="stat-card"><span>Scheduled</span><strong>{allVideos.filter(v=>overallStatus(v)==="Scheduled").length}</strong></div>
      <div className="stat-card"><span>Brands</span><strong>{brands.length}</strong></div>
      <div className="stat-card"><span>Media Assets</span><strong>{allMedia.length}</strong></div>
      <div className="stat-card"><span>Tasks</span><strong>{tasks.length}</strong></div>
    </section>
    <section className="panel"><h3>Brand-wise Content</h3>{brands.map(b=>{const n=allVideos.filter(v=>v.brandId===b.id).length;return <div className="metric-row" key={b.id}><span>{b.name}</span><div className="metric-bar"><i style={{width:(allVideos.length?Math.round(n/allVideos.length*100):0)+"%"}}/></div><b>{n}</b></div>})}</section>
  </div>
}
