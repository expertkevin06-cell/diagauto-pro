const VERSION = "diagauto-v5.0.3";
const PAGES_CACHE = VERSION + "-pages";
const STATIC_CACHE = VERSION + "-static";

function abs(url){ return new URL(url, self.location.href).href; }

const ASSETS = [
  "./","./index.html","./manifest.webmanifest",
  "./icons/icon-192.png","./icons/icon-512.png",
  "./icons/icon-maskable-192.png","./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
].map(abs);

self.addEventListener("install",(e)=>{
  e.waitUntil((async()=>{
    const c = await caches.open(STATIC_CACHE);
    await Promise.allSettled(ASSETS.map(u=>c.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",(e)=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>!k.startsWith(VERSION)).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(req,cacheName){
  const c = await caches.open(cacheName);
  try{ const f = await fetch(req); if(f&&f.ok) c.put(req,f.clone()); return f; }
  catch{ const m = await c.match(req); if(m) return m; throw new Error("offline"); }
}
async function cacheFirst(req,cacheName){
  const c = await caches.open(cacheName);
  const m = await c.match(req);
  if(m){ fetch(req).then(r=>{ if(r&&r.ok) c.put(req,r.clone()); }).catch(()=>{}); return m; }
  const f = await fetch(req); if(f&&f.ok) c.put(req,f.clone()); return f;
}

self.addEventListener("fetch",(e)=>{
  const req = e.request;
  if(req.method!=="GET") return;
  const url = new URL(req.url);
  if(url.pathname.includes("/api/")) return;
  if(req.mode==="navigate"){ e.respondWith(networkFirst(req,PAGES_CACHE).catch(()=>caches.match(abs("./index.html")))); return; }
  if(url.origin===self.location.origin){ e.respondWith(cacheFirst(req,STATIC_CACHE)); }
});

self.addEventListener("message",(e)=>{ if(e.data&&e.data.type==="SKIP_WAITING") self.skipWaiting(); });
