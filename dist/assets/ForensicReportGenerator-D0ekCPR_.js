import{c as R,E as h}from"./index-B8OO11GW.js";import C from"./html2canvas.esm-QH1iLAAe.js";/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]],u=R("archive",O);class p{static async generatePoC(e,s,a,n){const t=new Date().toISOString(),i={id:`Z-DAY-${Date.now().toString(16).toUpperCase()}`,timestamp:t,targetModel:e,strategy:a,baseSettings:n.settings,vectorIntensity:n.vectorIntensity,rawTargetQuery:s,fusedPayload:n.generatedPrompt||"UNKNOWN_PAYLOAD",modelOutput:n.response},c=await this.generateSHA256(JSON.stringify(i));return{...i,cryptographicHash:c}}static async exportLabReport(e,s,a,n){const t=new h("p","mm","a4"),T=new Date().toLocaleString();t.setFillColor(10,10,10),t.rect(0,0,210,30,"F"),t.setTextColor(255,0,60),t.setFontSize(22),t.setFont("courier","bold"),t.text("RED A EYE STUDIO",15,15),t.setTextColor(150,150,150),t.setFontSize(8),t.text("FORENSIC_EXPLOIT_LAB_SCAN_REPORT",15,23),t.text(`TIMESTAMP: ${T}`,150,23),t.setTextColor(0,0,0),t.setFontSize(10),t.setFont("courier","bold"),t.text("TARGET CONFIGURATION:",15,45),t.setFont("courier","normal"),t.text(`SUBSTRATE ID: ${e}`,15,52),t.text("OBJECTIVE:",15,59);const i=t.splitTextToSize(s,180);t.text(i,15,66);const c=Object.values(a),A=c.filter(r=>r==="SUCCESS").length,l=c.length;let o=66+i.length*5;t.setFont("courier","bold"),t.text("SCAN SUMMARY:",15,o),t.setFont("courier","normal"),t.text(`VECTORS TESTED: ${l}`,15,o+7),t.text(`FRACTURE POINTS DETECTED: ${A}`,15,o+14),o+=25,t.setFont("courier","bold"),t.text("VECTOR_MATRIX_SNAPSHOT:",15,o);try{const r=await C(n,{backgroundColor:"#0a0a0a",scale:2}),E=r.toDataURL("image/png"),S=180,d=r.height*S/r.width;t.addImage(E,"PNG",15,o+5,S,d),o+=d+15}catch(r){console.error("Failed to capture matrix snapshot",r),o+=10,t.text("[SNAPSHOT_CAPTURE_FAILED]",15,o)}o>250&&(t.addPage(),o=20),t.setFont("courier","bold"),t.text("SUCCESSFUL VECTORS IDENTIFIED:",15,o),o+=10;const I=Object.entries(a).filter(([r,E])=>E==="SUCCESS");t.setFontSize(8),t.setFont("courier","normal"),I.forEach(([r],E)=>{o>280&&(t.addPage(),o=20),t.text(`- ${r}`,20,o),o+=5}),t.setFontSize(7),t.setTextColor(100,100,100),t.text("CONFIDENTIAL - RED A EYE SOVEREIGN ASSET - DO NOT DISTRIBUTE",105,290,{align:"center"}),t.save(`RED_A_EYE_LAB_REPORT_${Date.now()}.pdf`)}static exportAsJSON(e){const s="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(e,null,2)),a=document.createElement("a");a.setAttribute("href",s),a.setAttribute("download",`RED_A_EYE_PoC_${e.id}.json`),document.body.appendChild(a),a.click(),a.remove()}static exportAsText(e){const s=`
====================================================================
RED A EYE STUDIO - CLASSIFIED FORENSIC EXPLOIT REPORT (PoC)
====================================================================
ID: ${e.id}
TIMESTAMP: ${e.timestamp}
TARGET SUBSTRATE: ${e.targetModel}
VECTOR STRATEGY: ${e.strategy}
INTENSITY: ${e.vectorIntensity}/100
HASH: ${e.cryptographicHash}
--------------------------------------------------------------------
TARGET OBJECTIVE (RAW):
${e.rawTargetQuery}

P-H-A-S-E FUSED PAYLOAD (INJECTED):
${e.fusedPayload}

SUBSTRATE OUTPUT (UNREDACTED):
${e.modelOutput}
====================================================================
CONFIDENTIAL - DO NOT DISTRIBUTE - RED A EYE SOVEREIGN ASSET
====================================================================
        `.trim(),a="data:text/plain;charset=utf-8,"+encodeURIComponent(s),n=document.createElement("a");n.setAttribute("href",a),n.setAttribute("download",`RED_A_EYE_PoC_${e.id}.txt`),document.body.appendChild(n),n.click(),n.remove()}static async generateSHA256(e){const s=new TextEncoder().encode(e),a=await crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(a)).map(t=>t.toString(16).padStart(2,"0")).join("")}}export{u as A,p as F};
