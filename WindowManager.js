class WindowManager
{
  static init()
  {
    WindowManager.saveWindowState();
  }
  
  static saveWindowState()
  {
    WindowManager.state =
    {
      x      : window.screenX
    , y      : window.screenY
    , width  : window.outerWidth
    , height : window.outerHeight
    }
  }

  static restoreState()
  {
    let state = WindowManager.state;
    //////////////////////////////////////////////////
    if (state)
    {
      window.resizeTo(state.width, state.height)
      //////////////////////////////////////////////////
      window.moveTo(state.x, state.y);
    }
  }

  static getBrowserHeadHeight()
  {
    if (void 0 !== WindowManager.browserHeadHeight)
      return WindowManager.browserHeadHeight;
    let a = window.outerHeight - window.innerHeight;
    return 0 < a ? WindowManager.browserHeadHeight = a : 28
  }

  static scaleSize(a)
  {
    if (popupWindow && 0 < video.videoWidth && 0 < video.videoHeight)
    {
      var b = WindowManager.getBrowserHeadHeight();
      const c = video.videoWidth / video.videoHeight;
      let d = Math.min(window.screen.availWidth,video.videoWidth * a);
      a = Math.min(window.screen.availHeight,video.videoHeight * a + b);
      let e = Math.floor((a-b)*c);
      e <= d ? d = e : (b = Math.floor(d / c) + b, b <= a && (a = b));
      window.resizeTo(d, a);
      window.moveTo((screen.availWidth - d) / 2 + screen.availLeft, (screen.availHeight - a) / 2 + screen.availTop);
      WindowManager.saveWindowState();
    }
  }

  static scale(a)
  {
    if (popupWindow && 0 < video.videoWidth && 0 < video.videoHeight)
    {
      a
      ?  a=(window.innerWidth+video.videoWidth / 4) / video.videoWidth
      : (a=(window.innerWidth-video.videoWidth / 4) / video.videoWidth, a = Math.max(a,.25)),
      WindowManager.scaleSize(a)
    }
  }

  static isMaxSize()
  {
    return window.outerWidth  == window.screen.availWidth
    &&     window.outerHeight == window.screen.availHeight;
  }

  static toggleMaxSize()
  {
    if (popupWindow)
    {
      if (WindowManager.isMaxSize())
      {
        WindowManager.restoreState();
      } else {
        window.resizeTo(window.screen.availWidth, window.screen.availHeight);
      }
    }
  }

  static async togglePip()
  {
    if (document.pictureInPictureEnabled && !video.disablePictureInPicture && 0 !== video.readyState)
    {
      document.fullscreenElement && await document.exitFullscreen();
      document.pictureInPictureElement
      ? document.exitPictureInPicture()
      : video.requestPictureInPicture();
    }
  }

  static async toggleFullscreen()
  {
    if (document.pictureInPictureElement)
    {
      await document.exitPictureInPicture();
    }
    //////////////////////////////////////////////////
    if (document.fullscreenElement)
    {
      document.exitFullscreen();
    } else {
      playerPanel.requestFullscreen();
    }
  }

  static exitFullscreen()
  {
    if (document.fullscreenElement)
    {
      document.exitFullscreen();
    }
  }
}

globalThis.WindowManager = WindowManager;