export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const {type,topic,tone}=req.body||{};
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured"});
  const instructions = {
    caption:"Write a scroll-stopping social media caption.",
    hashtags:"Generate relevant, non-spammy hashtags.",
    ideas:"Generate practical content ideas.",
    seo:"Create a YouTube title, description outline, keywords and SEO checklist.",
    brief:"Create a concise video production brief."
  };
  const response = await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
    body:JSON.stringify({model:"gpt-5-mini",input:`${instructions[type]||instructions.caption}\nTone: ${tone}\nTopic: ${topic}\nUse Bangla unless the topic clearly requests another language.`})
  });
  const data=await response.json();
  if(!response.ok) return res.status(response.status).json({error:data.error?.message||"OpenAI request failed"});
  return res.status(200).json({text:data.output_text||""});
}
