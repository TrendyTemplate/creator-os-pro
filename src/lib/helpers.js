export const todayISO = () => new Date().toISOString().slice(0,10);
export const toDateTime = item => new Date(`${item.date}T${item.time || "00:00"}`);
export const formatDate = value => new Date(`${value}T00:00:00`).toLocaleDateString("bn-BD",{day:"numeric",month:"short",year:"numeric"});
export const formatTime = value => {
  const [h,m] = String(value || "00:00").split(":").map(Number);
  const d = new Date(); d.setHours(h,m,0,0);
  return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
};
export const overallStatus = item => {
  const values = Object.values(item.platformStatus || {});
  if(values.length && values.every(v=>v==="Published")) return "Published";
  if(values.includes("Scheduled")) return "Scheduled";
  if(values.includes("Ready")) return "Ready";
  if(values.includes("Editing")) return "Editing";
  return item.stage || values[0] || "Idea";
};
export const timeLeft = item => {
  if(overallStatus(item)==="Published") return "Published";
  const hours = Math.ceil((toDateTime(item)-new Date())/36e5);
  if(hours < 0) return "Overdue";
  if(hours < 24) return `${hours}h left`;
  return `${Math.ceil(hours/24)}d left`;
};
export const fileSize = bytes => {
  if(!bytes) return "0 KB";
  const units=["B","KB","MB","GB"];
  let size=bytes, i=0;
  while(size>=1024 && i<units.length-1){size/=1024;i++}
  return `${size.toFixed(i?1:0)} ${units[i]}`;
};
export const downloadJson = (filename,data) => {
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
};
