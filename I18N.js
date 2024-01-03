class I18N
{
  static init()
  {
    let a = document.querySelectorAll("[data-i18n]");
    for (const b of a)
    {
      b.textContent = Messages[b.dataset.i18n];
    }
  }
}

I18N.en =
{
    title              : "Video Player"
  , seekStep           : "Short Jump"
  , seekLongStep       : "Long Jump"
  , volumeStep         : "Volume Jump"
  , speedStep          : "Speed Jump"
  , screenshotFormat   : "Screenshot"
  , shortcuts          : "Shortcuts"
  , dropzone           : "Drop Video Files Here"
  , muted              : "Muted"
  , unmuted            : "Unmuted"
  , speedIs            : "Speed: "
  , volumeIs           : "Volume: "
  , error              : "Something wrong"
  , cannotSupportFormat: "Can't support this video format"
};

I18N["zh-CN"] =
{
    title               : "\u89c6\u9891\u64ad\u653e\u5668"
  , seekStep            : "\u77ed\u5feb\u8fdb"
  , seekLongStep        : "\u957f\u5feb\u8fdb"
  , volumeStep          : "\u97f3\u91cf+/-"
  , speedStep           : "\u500d\u901f+/-"
  , screenshotFormat    : "\u622a\u56fe\u683c\u5f0f"
  , shortcuts           : "\u5feb\u6377\u952e\u8bf4\u660e"
  , dropzone            : "\u62d6\u62fd\u89c6\u9891\u6587\u4ef6\u5230\u8fd9\u91cc"
  , muted               : "\u5df2\u9759\u97f3"
  , unmuted             : "\u5df2\u53d6\u6d88\u9759\u97f3"
  , speedIs             : "\u500d\u901f: "
  , volumeIs            : "\u97f3\u91cf: "
  , error               : "\u51fa\u9519\u4e86"
  , cannotSupportFormat : "\u4e0d\u652f\u6301\u6b64\u89c6\u9891\u683c\u5f0f"
};

globalThis.I18N = I18N;