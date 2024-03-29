extensionMode=!1;
class PWA
{
  static async init()
  {
    window.resizeTo(852,518);
    await init();
    PWA.swRegister();
    PWA.fileHandler()
  }
  
  static swRegister()
  {
    "serviceWorker" in navigator
    ?navigator.serviceWorker.register("./sw.js",{updateViaCache:"all"}).then(function(a){console.log("Service worker registration succeeded")},function(a){console.log("Service worker registration failed:",a)})
    :console.log("Service workers are not supported.")
  }
  
  static fileHandler()
  {
    "launchQueue" in window && "files"in LaunchParams.prototype && launchQueue.setConsumer(a=>{a.files.length&&Promise.all(a.files.map(b=>b.getFile())).then(b=>FileManager.updateFileList(b))})
  }
}

PWA.init();