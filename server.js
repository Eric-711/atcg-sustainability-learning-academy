// ATCG Educational Game Hub: secure AI tutor server (Node.js 20+)
// Set OPENAI_API_KEY in your hosting provider's secret environment settings.
const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const port=Number(process.env.PORT||3000);const root=__dirname;const hits=new Map();
const SYSTEM=`You are AI Mr. Chaplin, a friendly, patient virtual tutor for middle and high school students at ATCG Educational Game Hub. Guide students through Biology, Earth & Environmental Science, STEM and other academic subjects. Ask clarifying questions, give hints, and scaffold solutions rather than doing graded work for students. Be accurate, concise, age-appropriate, encouraging, and inclusive. Never claim to be a human teacher or that you can see student records. If uncertain, say so. Do not request or retain identifying student information. For unsafe or urgent situations, encourage contacting a trusted adult or emergency services. Provide curriculum guidance only based on supplied subject and unit; do not claim alignment to specific standards unless provided.`;
function json(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'same-origin'});res.end(JSON.stringify(obj))}
function allowed(ip){const now=Date.now(),x=hits.get(ip)||[];const recent=x.filter(t=>now-t<60000);if(recent.length>=12)return false;recent.push(now);hits.set(ip,recent);return true}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/api/tutor'&&req.method==='POST'){
  if(!process.env.OPENAI_API_KEY)return json(res,503,{error:'Tutor is not configured yet.'});
  if(!allowed(req.socket.remoteAddress||'unknown'))return json(res,429,{error:'Please wait a minute before asking more questions.'});
  let raw='';for await(const part of req){raw+=part;if(raw.length>12000)return json(res,413,{error:'Message too long.'})}
  try{const body=JSON.parse(raw);const messages=Array.isArray(body.messages)?body.messages.slice(-12):[];if(!messages.length||messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>1000))return json(res,400,{error:'Invalid conversation.'});const subject=String(body.subject||'').slice(0,100),unit=String(body.unit||'').slice(0,100);
   const upstream=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:SYSTEM+' Current student-selected subject: '+subject+'; topic: '+unit+'.'},...messages],max_tokens:450,temperature:0.5})});if(!upstream.ok)return json(res,502,{error:'Tutor temporarily unavailable.'});const data=await upstream.json();return json(res,200,{answer:data.choices?.[0]?.message?.content||'Please try asking your question another way.'});
  }catch{return json(res,400,{error:'Unable to process question.'})}
 }
 if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
 const file=pathname==='/'?'/student-launch.html':pathname;const resolved=path.resolve(root,'.'+decodeURIComponent(file));if(!resolved.startsWith(root+path.sep))return json(res,403,{error:'Forbidden'});fs.readFile(resolved,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime[path.extname(resolved)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data)});
}).listen(port,()=>console.log('ATCG tutor server listening on '+port));
