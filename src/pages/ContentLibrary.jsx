import React,{useState} from "react";
import {Plus,Search} from "lucide-react";
import {useApp} from "../context/AppContext";
import VideoCard from "../components/VideoCard";
import VideoEditor from "../components/VideoEditor";
import {STAGES} from "../lib/constants";
import {overallStatus} from "../lib/helpers";
export default function ContentLibrary(){
  const {videos,brands,createItem,updateItem,deleteItem} = useApp();
  const [editor,setEditor]=useState(null);
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("All");
  const [type,setType]=useState("All");
  const filtered=videos.filter(v=>(!search||[v.title,v.caption,v.hashtags,v.notes].join(" ").toLowerCase().includes(search.toLowerCase()))&&(status==="All"||overallStatus(v)===status||v.stage===status)&&(type==="All"||v.type===type));
  async function save(v){if(v.id){const{id,...rest}=v;await updateItem("videos",id,rest)}else await createItem("videos",v);setEditor(null)}
  return <div className="page"><div className="page-head"><div><span className="eyebrow">All content</span><h2>Content Library</h2></div><button className="primary" onClick={()=>setEditor({})}><Plus size={18}/> Add</button></div><section className="panel"><div className="toolbar"><div className="search-field"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, caption, hashtag..."/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option>{STAGES.map(x=><option key={x}>{x}</option>)}</select><select value={type} onChange={e=>setType(e.target.value)}><option>All</option><option value="short">Short</option><option value="full">Full</option></select></div>{filtered.length?filtered.map(v=><VideoCard key={v.id} video={v} onEdit={()=>setEditor(v)} onDelete={()=>deleteItem("videos",v.id)}/>):<div className="empty">No content found</div>}</section>{editor&&<VideoEditor initial={editor} brands={brands} onClose={()=>setEditor(null)} onSave={save}/>}</div>
}
