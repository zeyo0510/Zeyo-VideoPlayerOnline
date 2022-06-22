importScripts("all_files.js");
const Version="0.0.4",
matchOption={cacheName:Version,ignoreSearch:!0};
class SW
{
  static init()
  {
    self.addEventListener("install",SW.onInstall);
    self.addEventListener("activate",SW.onActivate);
    self.addEventListener("fetch",SW.onFetch)
  }
  
  static onInstall(a)
  {
    console.log(`${Version} installing\u2026`);
    a.waitUntil(caches.open(Version).then(b=>b.addAll(AllFiles.map(c=>`${c}`))))
  }
  
  static onActivate(a)
  {
    a.waitUntil(caches.keys().then(b=>Promise.all(b.map(c=>{if(c!=Version)return caches.delete(c)}))).then(()=>{console.log(`${Version} now ready to handle fetches!`)}))
  }
  
  static onFetch(a)
  {
    a.respondWith(caches.match(a.request, matchOption).then(function(b){return void 0!==b?b:fetch(a.request)}))
  }
}SW.init();