import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import {onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth";
import {addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc} from "firebase/firestore";
import {auth, provider, db} from "../lib/firebase";
import {DEFAULT_BRANDS} from "../lib/constants";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({children}){
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [videos,setVideos] = useState([]);
  const [brands,setBrands] = useState([]);
  const [tasks,setTasks] = useState([]);
  const [media,setMedia] = useState([]);
  const [notifications,setNotifications] = useState([]);
  const [activity,setActivity] = useState([]);
  const [activeBrand,setActiveBrand] = useState("all");
  const [dark,setDark] = useState(false);

  useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setLoading(false)}),[]);
  useEffect(()=>document.body.classList.toggle("dark",dark),[dark]);

  useEffect(()=>{
    if(!user) return;
    const paths = ["videos","brands","tasks","media","notifications","activity"];
    const setters = [setVideos,setBrands,setTasks,setMedia,setNotifications,setActivity];
    const unsubs = paths.map((path,i)=>onSnapshot(
      query(collection(db,"users",user.uid,path)),
      snap=>setters[i](snap.docs.map(d=>({id:d.id,...d.data()})))
    ));
    return ()=>unsubs.forEach(u=>u());
  },[user]);

  useEffect(()=>{
    if(!user || brands.length) return;
    DEFAULT_BRANDS.forEach(b=>addDoc(collection(db,"users",user.uid,"brands"),{...b,createdAt:serverTimestamp()}).catch(console.error));
  },[user,brands.length]);

  async function logActivity(action, target, meta={}){
    if(!user) return;
    await addDoc(collection(db,"users",user.uid,"activity"),{
      action,target,meta,
      userName:user.displayName||user.email,
      createdAt:serverTimestamp()
    });
  }

  async function createItem(collectionName,data){
    if(!user) throw new Error("Not authenticated");\n    const ref = await addDoc(collection(db,"users",user.uid,collectionName),{...data,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
    await logActivity("created", collectionName, {id:ref.id, title:data.title||data.name||""});
    return ref;
  }
  async function updateItem(collectionName,id,data){
    if(!user) throw new Error("Not authenticated");\n    await updateDoc(doc(db,"users",user.uid,collectionName,id),{...data,updatedAt:serverTimestamp()});
    await logActivity("updated", collectionName, {id, title:data.title||data.name||""});
  }
  async function deleteItem(collectionName,id){
    if(!user) throw new Error("Not authenticated");\n    await deleteDoc(doc(db,"users",user.uid,collectionName,id));
    await logActivity("deleted", collectionName, {id});
  }

  const scopedVideos = useMemo(()=>activeBrand==="all"?videos:videos.filter(v=>v.brandId===activeBrand),[videos,activeBrand]);
  const scopedMedia = useMemo(()=>activeBrand==="all"?media:media.filter(v=>v.brandId===activeBrand),[media,activeBrand]);

  return <AppContext.Provider value={{
    user,loading,videos:scopedVideos,allVideos:videos,brands,tasks,media:scopedMedia,allMedia:media,notifications,activity,
    activeBrand,setActiveBrand,dark,setDark,
    login:()=>signInWithPopup(auth,provider),
    logout:()=>signOut(auth),
    createItem,updateItem,deleteItem,logActivity
  }}>{children}</AppContext.Provider>
}
