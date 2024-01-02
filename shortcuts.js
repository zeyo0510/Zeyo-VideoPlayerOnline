class I18N
{
  static init()
  {
    let b = document.querySelectorAll("[data-i18n]");
    for (const a of b)
    {
      a.textContent = Messages[a.dataset.i18n];
    }
    document.body.firstElementChild.classList.remove("d-none");
  }
}

I18N.en =
{
    title: "Shortcuts"
  , headKeyboard: "\u2328\ufe0f Keyboard Shortcuts"
  , headMouse: "\ud83d\uddb1\ufe0f Mouse Shortcuts"
  , thShortcut: "Shortcut"
  , thFunction: "Action"
  , note: "* All shortcuts represent physical keys, and only those that explicitly prompt Shift need to press Shift."
  , openFiles: "Open Files"
  , playPause: "Play / Pause"
  , shortForwardJump: "Short Forward Jump"
  , shortBackwardJump: "Short Backward Jump"
  , longForwardJump: "Long Forward Jump"
  , longBackwardJump: "Long Backward Jump"
  , volumeDown: "Decrease Volume"
  , volumeUp: "Increase Volume"
  , muteUnmute: "Mute / Unmute"
  , nextVideo: "Next Video"
  , previousVideo: "Previous Video"
  , nextFrame: "Next Frame (while paused)"
  , previousFrame: "Previous Frame (while paused)"
  , screenshot: "Screenshot"
  , exitFullscreen: "Exit Full Screen"
  , toggleFullscreen: "Enter / Exit Full Screen"
  , maxWindow: "Maximize the Window / Restore"
  , pip: "Picture-in-Picture Mode (window is always on top of other windows)"
  , speedUp: "Increase Playback Rate"
  , speedDown: "Decrease Playback Rate"
  , speedReset: "Reset Playback Rate"
  , windowSizeUp: "Increase the Window Size"
  , windowSizeDown: "Reduce the Window Size"
  , windowSizeReset: "Restore to the Default Window Size"
  , timeProgress: "Show or Hide Video Time Progress in the Top Left Corner"
  , clock: "Show or Hide Current Time in the Top Right Corner"
  , singleClick: "Single Click"
  , doubleClick: "Double Click"
  , dragFiles: "Drag and Drop Files to the Player"
  , dragEdge: "Drag the Edge of the Window"
  , adjustWindowSize: "Adjust the Player Size"
};

I18N["zh-CN"] =
{
    title: "\u5feb\u6377\u952e\u8bf4\u660e"
  , headKeyboard: "\u2328\ufe0f \u5feb\u6377\u952e\u529f\u80fd\u8bf4\u660e"
  , headMouse: "\ud83d\uddb1\ufe0f \u9f20\u6807\u529f\u80fd\u8bf4\u660e"
  , thShortcut: "\u5feb\u6377\u952e"
  , thFunction: "\u4f5c\u7528"
  , note: "* \u6240\u6709\u5feb\u6377\u952e\u5747\u8868\u793a\u7269\u7406\u6309\u952e\uff0c\u53ea\u6709\u660e\u786e\u63d0\u793a Shift \u7684\u624d\u9700\u8981\u6309 Shift \u952e\u3002"
  , openFiles: "\u6253\u5f00\u6587\u4ef6"
  , playPause: "\u64ad\u653e / \u6682\u505c"
  , shortForwardJump: "\u77ed\u5feb\u8fdb"
  , shortBackwardJump: "\u77ed\u5feb\u9000"
  , longForwardJump: "\u957f\u5feb\u8fdb"
  , longBackwardJump: "\u957f\u5feb\u9000"
  , volumeDown: "\u51cf\u5c0f\u97f3\u91cf"
  , volumeUp: "\u63d0\u9ad8\u97f3\u91cf"
  , muteUnmute: "\u9759\u97f3 / \u53d6\u6d88\u9759\u97f3"
  , nextVideo: "\u64ad\u653e\u4e0b\u4e00\u4e2a\u89c6\u9891"
  , previousVideo: "\u64ad\u653e\u4e0a\u4e00\u4e2a\u89c6\u9891"
  , nextFrame: "\u4e0b\u4e00\u5e27\uff08\u6682\u505c\u65f6\u53ef\u7528\uff09"
  , previousFrame: "\u4e0a\u4e00\u5e27\uff08\u6682\u505c\u65f6\u53ef\u7528\uff09"
  , screenshot: "\u622a\u56fe"
  , exitFullscreen: "\u9000\u51fa\u5168\u5c4f"
  , toggleFullscreen: "\u5168\u5c4f / \u9000\u51fa\u5168\u5c4f"
  , maxWindow: "\u6700\u5927\u5316\u7a97\u53e3 / \u9000\u51fa\u6700\u5927\u5316"
  , pip: "\u753b\u4e2d\u753b\u6a21\u5f0f\uff08\u7a97\u53e3\u59cb\u7ec8\u5728\u5176\u5b83\u7a97\u53e3\u4e4b\u4e0a\uff09"
  , speedUp: "\u63d0\u9ad8\u64ad\u653e\u901f\u5ea6"
  , speedDown: "\u964d\u4f4e\u64ad\u653e\u901f\u5ea6"
  , speedReset: "\u6062\u590d\u6b63\u5e38\u64ad\u653e\u901f\u5ea6"
  , windowSizeUp: "\u589e\u5927\u7a97\u53e3\u5927\u5c0f"
  , windowSizeDown: "\u51cf\u5c0f\u7a97\u53e3\u5927\u5c0f"
  , windowSizeReset: "\u6062\u590d\u9ed8\u8ba4\u7a97\u53e3\u5927\u5c0f"
  , timeProgress: "\u5728\u5de6\u4e0a\u89d2\u663e\u793a\u6216\u5173\u95ed\u5f53\u524d\u64ad\u653e\u8fdb\u5ea6"
  , clock: "\u5728\u53f3\u4e0a\u89d2\u663e\u793a\u6216\u5173\u95ed\u5f53\u524d\u65f6\u95f4"
  , singleClick: "\u5355\u51fb"
  , doubleClick: "\u53cc\u51fb"
  , dragFiles: "\u62d6\u62fd\u6587\u4ef6\u5230\u64ad\u653e\u5668"
  , dragEdge: "\u62d6\u62fd\u7a97\u53e3\u8fb9\u7f18"
  , adjustWindowSize: "\u8c03\u6574\u64ad\u653e\u5668\u5927\u5c0f"
};

var Messages = "zh-CN" == navigator.language ? I18N["zh-CN"] : I18N.en; I18N.init();
