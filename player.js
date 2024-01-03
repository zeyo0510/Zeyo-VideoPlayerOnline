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

class Player
{
  static init()
  {

  }

  static async loadFile(a)
  {
    document.title = a.name;
    Player.objectURL && URL.revokeObjectURL(Player.objectURL);
    Player.objectURL = URL.createObjectURL(a);
    video.src = Player.objectURL;
    if (void 0 === a.canPlay) {
      try
      {
        await video.play(),
        a.canPlay = true
      } catch(b) {
        a.canPlay = false,
        Player.stop(),
        "NotSupportedError" == b.name
        ? Utils.showError(Messages.cannotSupportFormat)
        : Utils.showError(Messages.error)
      }
    } else {
      true === a.canPlay && Player.play();
    }
    Controls.onVideoChange()
  }

  static stop()
  {
    video.removeAttribute("src");
    //////////////////////////////////////////////////
    video.load()
  }

  static async play()
  {
    if (video.src)
    {
      try
      {
        await video.play();
      } catch(a) {
        Utils.showError(Messages.error);
      }
    }
  }

  static playNext()
  {
    let a = FileManager.getNextFile(true);
    return a ? (Player.loadFile(a), true) : false
  }

  static playPrevious()
  {
    let a = FileManager.getNextFile(false);
    return a ? (Player.loadFile(a), true) : false
  }

  static togglePlay()
  {
    video.paused || video.ended ? Player.play() : video.pause()
  }

  static toggleMute()
  {
    video.muted = !video.muted;
    //////////////////////////////////////////////////
    if (video.muted)
    {
      Utils.showInfo(Messages.muted);
    } else {
      Utils.showInfo(Messages.unmuted);
    }
  }

  static seek(a, b)
  {
    !video.src||!Number.isFinite(video.duration)||1>b&&!video.paused||
    (
      video.currentTime=a?Math.min(video.currentTime+b,video.duration):Math.max(video.currentTime-b,0),
      1<=b&&(a=`${Utils.formatTime(video.currentTime)} / ${Utils.formatTime(video.duration)}`,Utils.showInfo(a))
    )
  }

  static volume(a,b)
  {
    let c = Math.round(100 * video.volume);
        c = a ? Math.min(c + b, 100)
              : Math.max(c - b,   0);
    video.volume = c / 100;
    Utils.showInfo(Messages.volumeIs + c);
  }

  static speed(a,b)
  {
    a = a ? parseFloat((video.playbackRate + b).toFixed(2))
          : parseFloat((video.playbackRate - b).toFixed(2));
    .25 <= a && 5 >= a && (video.playbackRate = a);
    Utils.showInfo(Messages.speedIs + video.playbackRate);
  }

  static resetSpeed()
  {
    video.playbackRate = 1;
    Utils.showInfo(Messages.speedIs + "1");
  }

  static toggleVideoTime()
  {
    video.src && Number.isFinite(video.duration) &&
    (
      ltInfo.classList.contains("d-none")
      ? (Player.updateVideoTime(),ltInfo.classList.remove("d-none"),Player.timeTimer=setInterval(Player.updateVideoTime,1E3))
      : (ltInfo.classList.add("d-none"),clearInterval(Player.timeTimer))
    )
  }

  static updateVideoTime()
  {
    ltInfo.textContent = `${Utils.formatTime(video.currentTime)} / ${Utils.formatTime(video.duration)}  [-${Utils.formatTime(video.duration-video.currentTime)}]`;
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