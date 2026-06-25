import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import {onAuthStateChanged,signInWithPopup,signOut} from "firebase/auth";
import {addDoc,collection,deleteDoc,doc,onSnapshot,query,serverTimestamp,updateDoc} from "firebase/firestore";
import {auth,provider,db} from "../lib/firebase";
import {DEFAULT_BRANDS} from "../lib/constants";

const AppContext=createContext(null);
export const useApp=()=>useContext(AppContext);

export function AppProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [videos,setVideos]=useState([]);
  const [brands,setBrands]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [media,setMedia]=useState([]);
  const [notifications,setNotifications]=useState([]);
  const [activity,setActivity]=useState([]);
  const [activeBrand,setActiveBrand]=useState("all");
  const [dark,setDark]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setLoading(false)}),[]);
  useEffect(()=>document.body.classList.toggle("dark",dark),[dark]);

  useEffect(()=>{
    if(!user) return;
    const names=["videos","brands","tasks","media","notifications","activity"];
    const setters=[setVideos,setBrands,setTasks,setMedia,setNotifications,setActivity];
    const unsubs=names.map((name,i)=>onSnapshot(
      query(collection(db,"users",user.uid,name)),
      snap=>setters[i](snap.docs.map(d=>({id:d.id,...d.data()}))),
      err=>setError(err.message)
    ));
    return ()=>unsubs.forEach(u=>u());
  },[user]);

  useEffect(()=>{
    if(!user || brands.length) return;
    const seeded = localStorage.getItem(`seeded-${user.uid}`);
    if(seeded) return;
    localStorage.setItem(`seeded-${user.uid}`,"1");
    DEFAULT_BRANDS.forEach(b=>addDoc(collection(db,"users",user.uid,"brands"),{...b,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}).catch(console.error));
  },[user,brands.length]);

  async function logActivity(action,target,meta={}){
    if(!user) return;
    await addDoc(collection(db,"users",user.uid,"activity"),{
      action,target,meta,userName:user.displayName||user.email,createdAt:serverTimestamp()
    }).catch(console.error);
  }
  async function createItem(collectionName,data){
    if(!user) throw new Error("Not authenticated");
    const ref = await addDoc(collection(db,"users",user.uid,collectionName),{...data,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
    await logActivity("created",collectionName,{id:ref.id,title:data.title||data.name||""});
    return ref;
  }
  async function updateItem(collectionName,id,data){
    if(!user) throw new Error("Not authenticated");
    const clean={...data}; delete clean.id;
    await updateDoc(doc(db,"users",user.uid,collectionName),{...clean,updatedAt:serverTimestamp()});
    await logActivity("updated",collectionName,{id,title:data.title||data.name||""});
  }
  async function deleteItem(collectionName,id){
    if(!user) throw new Error("Not authenticated");
    await deleteDoc(doc(db,"users",user.uid,collectionName,id));
    await logActivity("deleted",collectionName,{id});
  }

  const scopedVideos=useMemo(()=>activeBrand==="all"?videos:videos.filter(v=>v.brandId===activeBrand),[videos,activeBrand]);
  const scopedMedia=useMemo(()=>activeBrand==="all"?media:media.filter(v=>v.brandId===activeBrand),[media,activeBrand]);
  const scopedTasks=useMemo(()=>activeBrand==="all"?tasks:tasks.filter(t=>!t.brandId || t.brandId===activeBrand),[tasks,activeBrand]);

  return <AppContext.Provider value={{
    user,loading,error,setError,
    videos:scopedVideos,allVideos:videos,brands,tasks:scopedTasks,allTasks:tasks,media:scopedMedia,allMedia:media,notifications,activity,
    activeBrand,setActiveBrand,dark,setDark,
    login:()=>signInWithPopup(auth,provider), logout:()=>signOut(auth),
    createItem,updateItem,deleteItem,logActivity
  }}>{children}</AppContext.Provider>
}
