console.log('20:35');

var extensionMode;

const popupWindow = true,
      video = document.getElementById("video"),
      playerPanel = document.getElementById("player");

let fileList=[];
const info                                               = document.getElementById("info"),
      errorInfo                                          = document.getElementById("error-info"),
      ltInfo                                             = document.getElementById("lt-info"),
      rtInfo                                             = document.getElementById("rt-info"),
      controlsPanel                                      = document.getElementById("controls"),
      progress                                           = document.getElementById("progress"),
      volume                                             = document.getElementById("volume"),
      [leftTime,rightTime]                               = document.querySelectorAll("#progress-controls .time"),
      [openFileBtn,volumeBtn]                            = document.querySelectorAll("#buttons-left .btn"),
      [previousBtn,rewindBtn,playBtn,forwardBtn,nextBtn] = document.querySelectorAll("#buttons-center .btn"),
      [settingsBtn,fullscreenBtn]                        = document.querySelectorAll("#buttons-right .btn");

let remainingTimeMode = false;
const seekStepInput         = document.getElementById("seekStep"),
      seekLongStepInput     = document.getElementById("seekLongStep"),
      volumeStepInput       = document.getElementById("volumeStep"),
      speedStepInput        = document.getElementById("speedStep"),
      screenshotFormatInput = document.getElementById("screenshotFormat");

var settings=
{
  seekStep         : 5
, seekLongStep     : 30
, volumeStep       : 10
, speedStep        : .25
, timeFormatHour12 : true
, timeFormatSecond : false
, screenshotFormat : "jpg"
};

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

  static showInfo(a)
  {
    info.textContent = a;
    info.classList.remove("d-none");
    Utils.delayHideInfo();
  }

  static hideInfo()
  {
    info.classList.add("d-none");
  }

  static showError(a)
  {
    errorInfo.textContent = a;
    errorInfo.classList.remove("d-none");
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

Utils.delayHideInfo  = Utils.delay(Utils.hideInfo, 1500);
Utils.delayHideError = Utils.delay(Utils.hideError, 1500);

class Clock
{
  static init()
  {
    let a = {
      hourCycle : settings.timeFormatHour12 ? "h12" : "h23"
    , hour      : "2-digit"
    , minute    : "2-digit"
    };
    settings.timeFormatSecond && (a.second = "2-digit");
    Clock.ClockFormat = new Intl.DateTimeFormat("en-GB", a)
  }

  static toggleClockTime()
  {
    if (rtInfo.classList.contains("d-none"))
    {
      Clock.updateClockTime(),
      rtInfo.classList.remove("d-none"),
      Clock.clockTimer = setInterval(Clock.updateClockTime, 1000)
    } else {
      rtInfo.classList.add("d-none");
      clearInterval(Clock.clockTimer);
    }
  }

  static updateClockTime()
  {
    rtInfo.textContent = Clock.ClockFormat.format(new Date);
  }
}

var Messages = "zh-CN" == navigator.language
? I18N["zh-CN"]
: I18N.en;

async function init()
{
  I18N.init();
  await Settings.init();
  Clock.init();
  Player.init();
  Controls.init();
  FileManager.init();
  globalThis.WindowManager.init()
};