class Settings
{
  static async init()
  {
            seekStepInput.addEventListener("change", Utils.delay(Settings.saveSeekStep    , 500));
        seekLongStepInput.addEventListener("change", Utils.delay(Settings.saveSeekLongStep, 500));
          volumeStepInput.addEventListener("change", Utils.delay(Settings.saveVolumeStep  , 500));
           speedStepInput.addEventListener("change", Settings.saveSpeedStep       );
    screenshotFormatInput.addEventListener("change", Settings.saveScreenshotFormat);
    //////////////////////////////////////////////////
    if(extensionMode)
      return new Promise(function(f,h){chrome.storage.sync.get(settings, function(g){settings=g;Settings.initInputValues();f()})});
    //////////////////////////////////////////////////
    let a = localStorage.getItem("seekStep"),
        b = localStorage.getItem("seekLongStep"),
        c = localStorage.getItem("volumeStep"),
        d = localStorage.getItem("speedStep"),
        e = localStorage.getItem("screenshotFormat");
    //////////////////////////////////////////////////
    a && (settings.seekStep         = parseInt(a,10));
    b && (settings.seekLongStep     = parseInt(b,10));
    c && (settings.volumeStep       = parseInt(c,10));
    d && (settings.speedStep        = parseFloat(d));
    e && (settings.screenshotFormat = e);
    Settings.initInputValues()
  }
  
  static initInputValues()
  {
            seekStepInput.value = settings.seekStep;
        seekLongStepInput.value = settings.seekLongStep;
          volumeStepInput.value = settings.volumeStep;
           speedStepInput.value = settings.speedStep;
    screenshotFormatInput.value = settings.screenshotFormat;
  }

  static save(a, b)
  {
    settings[a] = b;
    if(extensionMode)
    {
      let c = {};
      c[a] = b;
      chrome.storage.sync.set(c);
    } else {
      try
      {
        localStorage.setItem(a, b);
      } catch(c) {
        console.log("localStorage error:", c);
      }
    }
  }

  static saveSeekStep(a)
  {
    a = seekStepInput.valueAsNumber;
    if (1 <= a)
    {
      Settings.save("seekStep", a);
    }
  }

  static saveSeekLongStep(a)
  {
    a = seekLongStepInput.valueAsNumber;
    //////////////////////////////////////////////////
    if (1 <= a)
    {
      Settings.save("seekLongStep", a);
    }
  }

  static saveVolumeStep(a)
  {
    a = volumeStepInput.valueAsNumber;
    //////////////////////////////////////////////////
    1 <= a && 50 >= a && Settings.save("volumeStep", a);
  }

  static saveSpeedStep(a)
  {
    a = parseFloat(speedStepInput.value);
    //////////////////////////////////////////////////
    0 < a && 1 >= a && Settings.save("speedStep", a);
  }

  static saveScreenshotFormat(a)
  {
    a = screenshotFormatInput.value;
    //////////////////////////////////////////////////
    Settings.save("screenshotFormat", a);
  }
}
//////////////////////////////////////////////////
globalThis.Settings = Settings;