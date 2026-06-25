import React,{useState} from "react";
import {Plus,ExternalLink,Trash2,UploadCloud} from "lucide-react";
import {ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";
import {storage} from "../lib/firebase";
import {useApp} from "../context/AppContext";
import {MEDIA_TYPES} from "../lib/constants";
import {fileSize} from "../lib/helpers";

export default function MediaLibrary(){
  const {user,media,brands,createItem,deleteItem,logActivity} = useApp();
  const [form,setForm]=useState(null);
  const [progress,setProgress]=useState(0);

  async function upload(e){
    e.preventDefault();
    if(!form.file && !form.url) return alert("File upload করুন অথবা URL দিন");\n    if(form.file && form.file.size > 500 * 1024 * 1024) return alert("File size 500MB এর বেশি। আপাতত ছোট file upload করুন.");
    if(form.file){
      const path = `users/${user.uid}/media/${Date.now()}-${form.file.name}`;
      const storageRef = ref(storage,path);
      const task = uploadBytesResumable(storageRef,form.file,{contentType:form.file.type});
      task.on("state_changed",snap=>setProgress(Math.round((snap.bytesTransferred/snap.totalBytes)*100)),err=>alert(err.message),async()=>{
        const url = await getDownloadURL(task.snapshot.ref);
        await createItem("media",{name:form.name||form.file.name,type:form.type,brandId:form.brandId,url,storagePath:path,size:form.file.size,contentType:form.file.type});
        setForm(null); setProgress(0);
      });
    }else{
      await createItem("media",{name:form.name,type:form.type,brandId:form.brandId,url:form.url,storagePath:"",size:0});
      setForm(null);
    }
  }
  async function remove(m){
    if(!confirm("Asset delete করবেন?")) return;
    if(m.storagePath){try{await deleteObject(ref(storage,m.storagePath))}catch(e){}}
    await deleteItem("media",m.id);
  }

  return <div className="page"><div className="page-head"><div><span className="eyebrow">Real media storage</span><h2>Media Library</h2></div><button className="primary" onClick={()=>setForm({name:"",type:"Video",url:"",brandId:brands[0]?.id||"",file:null})}><Plus size={18}/> Add Asset</button></div>
    <div className="media-grid">{media.map(m=><article className="media-card" key={m.id}><div className="media-preview">{m.contentType?.startsWith("image")?<img src={m.url}/>:m.type}</div><h4>{m.name}</h4><p>{m.type} • {fileSize(m.size)}</p><div><a href={m.url} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Open</a><button onClick={()=>remove(m)}><Trash2 size={15}/></button></div></article>)}</div>
    {!media.length&&<div className="empty">No media assets yet</div>}
    {form&&<div className="modal"><form className="modal-card" onSubmit={upload}><div className="modal-head"><h3>Add Media Asset</h3><button type="button" onClick={()=>setForm(null)}>×</button></div><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{MEDIA_TYPES.map(t=><option key={t}>{t}</option>)}</select><label>Upload File</label><input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onChange={e=>setForm({...form,file:e.target.files[0],name:form.name||e.target.files[0]?.name||""})}/><label>Or External URL</label><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/><label>Brand</label><select value={form.brandId} onChange={e=>setForm({...form,brandId:e.target.value})}>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>{progress>0&&<div className="upload-progress"><i style={{width:progress+"%"}}/><span>{progress}%</span></div>}<button className="primary wide"><UploadCloud size={18}/> Save Asset</button></form></div>}
  </div>
}
