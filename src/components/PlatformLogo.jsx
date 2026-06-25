import React from "react";
import {PLATFORMS} from "../lib/constants";
export default function PlatformLogo({platform,title}){
  const p = PLATFORMS[platform];
  if(!p) return null;
  return <span title={title || p.name} className={`platform-logo ${p.className}`}>{p.icon}</span>;
}
