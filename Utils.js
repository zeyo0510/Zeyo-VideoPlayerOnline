class Utils
{
  static delay(a, b)
  {
    let c = 0;
    return function(...d)
    {
      clearTimeout(c);
      c = setTimeout(a.bind(this, ...d), b);
    }
  }

  static showInfo(message)
  {
    info.textContent = message;
    //////////////////////////////////////////////////
    info.classList.remove("d-none");
    //////////////////////////////////////////////////
    Utils.delayHideInfo();
  }

  static hideInfo()
  {
    info.classList.add("d-none");
  }

  static showError(message)
  {
    errorInfo.textContent = message;
    //////////////////////////////////////////////////
    errorInfo.classList.remove("d-none");
    //////////////////////////////////////////////////
    Utils.delayHideError();
  }

  static hideError()
  {
    errorInfo.classList.add("d-none");
  }

  static formatTime(a)
  {
    var b = Math.round(a);
        a = Math.floor(b / 60);
    b %= 60;
    return `${10>a?"0"+a:a}:${10>b?"0"+b:b}`
  }

  static screenshot()
  {
    if (!(2 > video.readyState))
    {
      Utils.canvas||(Utils.canvas=document.createElement("canvas"));
      Utils.file||(Utils.file=document.createElement("a"));
      var a = Utils.canvas,
          b = Utils.file;
      a.width  = video.videoWidth;
      a.height = video.videoHeight;
      a.getContext("2d").drawImage(video, 0, 0, a.width, a.height);
      settings && "png" == settings.screenshotFormat
      ? (b.download = `screenshot-${video.currentTime.toFixed(3)}.png`, b.href = a.toDataURL("image/png")     )
      : (b.download = `screenshot-${video.currentTime.toFixed(3)}.jpg`, b.href = a.toDataURL("image/jpeg",.98));
      b.click()
    }
  }
}
//////////////////////////////////////////////////
globalThis.Utils = Utils;