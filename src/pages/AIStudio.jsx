import React,{useState} from "react";
import {Sparkles,Copy} from "lucide-react";
export default function AIStudio(){
  const [type,setType]=useState("caption");
  const [topic,setTopic]=useState("");
  const [tone,setTone]=useState("Human and engaging");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  async function generate(){
    setLoading(true); setResult("");
    try{
      const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type,topic,tone})});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"AI request failed");
      setResult(data.text);
    }catch(e){setResult("AI Studio চালাতে Vercel Project Settings → Environment Variables-এ OPENAI_API_KEY যোগ করুন।\n\n"+e.message)}
    setLoading(false);
  }
  return <div className="page"><div className="page-head"><div><span className="eyebrow">Writing assistant</span><h2>AI Studio</h2></div></div><div className="two-panel"><section className="panel"><label>Generate</label><select value={type} onChange={e=>setType(e.target.value)}><option value="caption">Caption</option><option value="hashtags">Hashtags</option><option value="ideas">Content Ideas</option><option value="seo">YouTube SEO</option><option value="brief">Video Brief</option></select><label>Topic / Video Details</label><textarea rows="7" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="ভিডিওর বিষয়, location, footage, audience লিখুন..."/><label>Tone</label><input value={tone} onChange={e=>setTone(e.target.value)}/><button disabled={loading||!topic} className="primary wide" onClick={generate}><Sparkles size={18}/>{loading?"Generating...":"Generate"}</button></section><section className="panel"><div className="result-head"><h3>Result</h3>{result&&<button onClick={()=>navigator.clipboard.writeText(result)}><Copy size={16}/> Copy</button>}</div><pre className="ai-result">{result||"Generated content এখানে দেখা যাবে।"}</pre></section></div></div>
}
