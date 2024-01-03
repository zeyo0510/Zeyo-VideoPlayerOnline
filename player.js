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

var mouseMoveTimer    = 0
,   lickDblclickTimer = 0;

class Controls
{
  static init()
  {
    document.body.addEventListener("keydown",Controls.keyboardListener);
    document.addEventListener("fullscreenchange",Controls.onFullscreenChange);
    Controls.progressDragging=false;
    video.addEventListener("loadedmetadata",Controls.onLoadedmetadata);
    video.addEventListener("timeupdate",Controls.updateTime);
    video.addEventListener("volumechange",Controls.onVolumeChange);
    video.addEventListener("ended",Controls.onVideoEnd);
    video.addEventListener("pause",Controls.onPause);
    video.addEventListener("play",Controls.onPlay);
    progress.addEventListener("change",Controls.onProgressChange);
    progress.addEventListener("input",Controls.onProgressInput);
    rightTime.addEventListener("click",Controls.changeTimeMode);
    controlsPanel.addEventListener("click",a=>a.stopPropagation());
    playerPanel.addEventListener("click",Controls.onPlayerClick);
    openFileBtn.addEventListener("click",FileManager.openFiles);
    volumeBtn.addEventListener("click",a=>Player.toggleMute());
    volume.addEventListener("input",Controls.onVolumeInput);
    volume.addEventListener("change",a=>volume.blur());
    previousBtn.addEventListener("click",Player.playPrevious);
    rewindBtn.addEventListener("click",a=>Player.seek(false,settings.seekStep));
    playBtn.addEventListener("click",Player.togglePlay);
    forwardBtn.addEventListener("click",a=>Player.seek(true,settings.seekStep));
    nextBtn.addEventListener("click",Player.playNext);
    fullscreenBtn.addEventListener("click",globalThis.WindowManager.toggleFullscreen);
    "mediaSession"in navigator&&
    (
      navigator.mediaSession.setActionHandler("previoustrack",Player.playPrevious),
      navigator.mediaSession.setActionHandler("nexttrack",Player.playNext),
      navigator.mediaSession.setActionHandler("seekbackward",()=>Player.seek(false,settings.seekStep)),
      navigator.mediaSession.setActionHandler("seekforward",()=>Player.seek(true,settings.seekStep))
    );
    document.body.addEventListener("contextmenu",a=>a.preventDefault());
    Controls.hidden=true;
    document.getElementById("settings").addEventListener("mousemove",Controls.onMouseMove);
    controlsPanel.addEventListener("mousemove",Controls.onMouseMove);
    playerPanel.addEventListener("mousemove",Controls.onMouseMove)
  }

  static changeTimeMode()
  {
    remainingTimeMode = !remainingTimeMode;
    //////////////////////////////////////////////////
    Controls.updateTime()
  }

  static updateTime()
  {
    Controls.hidden || 0 === video.readyState ||
    (
      Controls.progressDragging
      ? (leftTime.textContent=Utils.formatTime(progress.value),remainingTimeMode&&(rightTime.textContent="-"+Utils.formatTime(video.duration-progress.value)))
      : (progress.value=video.currentTime,leftTime.textContent=Utils.formatTime(video.currentTime),rightTime.textContent=remainingTimeMode?"-"+Utils.formatTime(video.duration-video.currentTime):Utils.formatTime(video.duration))
    )
  }

  static onLoadedmetadata()
  {
    document.fullscreenElement || globalThis.WindowManager.scaleSize(1);
    //////////////////////////////////////////////////
    progress.max = video.duration;
    //////////////////////////////////////////////////
    Controls.updateTime();
  }

  static onPause()
  {
    playBtn.src = "img/play_arrow.svg";
  }

  static onPlay()
  {
    playBtn.src = "img/pause.svg";
  }

  static onFullscreenChange()
  {
    if (document.fullscreenElement) {
      fullscreenBtn.src = "img/fullscreen_exit.svg";
    } else {
      fullscreenBtn.src = "img/fullscreen.svg";
    }
  }

  static onVideoChange()
  {
    const [a, b] = FileManager.hasPreviousNext();
    //////////////////////////////////////////////////
    a
    ? previousBtn.classList.remove("disabled")
    : previousBtn.classList.add("disabled");
    b
    ? nextBtn.classList.remove("disabled")
    : nextBtn.classList.add("disabled")
  }

  static onProgressChange()
  {
    Controls.progressDragging = false;
    //////////////////////////////////////////////////
    video.currentTime = progress.value;
    //////////////////////////////////////////////////
    progress.blur();
  }

  static onProgressInput()
  {
    Controls.progressDragging = true;
    //////////////////////////////////////////////////
    Controls.updateTime();
  }

  static onVolumeInput()
  {
    video.volume = volume.valueAsNumber;
  }

  static onVolumeChange()
  {
    const a = video.volume;
    //////////////////////////////////////////////////
    volume.value = a;
    //////////////////////////////////////////////////
         if (video.muted) { volumeBtn.src = "img/volume_off.svg" ; }
    else if (0.5 < a)     { volumeBtn.src = "img/volume_up.svg"  ; }
    else if (0 < a)       { volumeBtn.src = "img/volume_down.svg"; }
    else                  { volumeBtn.src = "img/volume_mute.svg"  }
  }

  static onVideoEnd()
  {
    Player.playNext() || globalThis.WindowManager.exitFullscreen();
  }

  static onPlayerClick(a)
  {
    if (0 < clickDblclickTimer)
    {
      clearTimeout(clickDblclickTimer);
      clickDblclickTimer = 0;
      globalThis.WindowManager.toggleFullscreen();
    } else {
      clickDblclickTimer = setTimeout(function() {
        clickDblclickTimer = 0;
        Player.togglePlay();
      }, 400);
    }
  }

  static onMouseMove(a)
  {
    a.stopPropagation();
    Controls.hidden && Controls.show();
    clearTimeout(mouseMoveTimer);
    a = a.currentTarget.id;
    let b = 1500;
    "player"   == a && (b = 1500);
    "controls" == a && (b = 4500);
    "settings" == a && (b = 20000);
    mouseMoveTimer = setTimeout(Controls.hide, b);
  }

  static show()
  {
    Controls.hidden = false;
    //////////////////////////////////////////////////
    Controls.updateTime();
    //////////////////////////////////////////////////
    controlsPanel.classList.remove("d-none");
    playerPanel.classList.remove("hide-cursor");
  }

  static hide()
  {
    Controls.hidden = true;
    //////////////////////////////////////////////////
    controlsPanel.classList.add("d-none");
    playerPanel.classList.add("hide-cursor");
  }

  static async keyboardListener(a)
  {
    var b = a.target.tagName;
    if ("INPUT" !== b && "SELECT" !== b)
    {
      b = a.keyCode;
      var c = a.code;
      79 === b && (a.ctrlKey||a.metaKey) ? (a.preventDefault(), FileManager.openFiles()):
      37 === b && (a.ctrlKey||a.metaKey) ? (a.preventDefault(), Player.playPrevious()):
      39 === b && (a.ctrlKey||a.metaKey) ? (a.preventDefault(), Player.playNext()):
      83 !== b || !a.ctrlKey&&!a.metaKey||a.shiftKey?a.ctrlKey||a.altKey||a.metaKey||
      (70===b?(a.preventDefault(),globalThis.WindowManager.toggleFullscreen()):
      87 === b ?(a.preventDefault(),globalThis.WindowManager.toggleMaxSize()):
      84 === b ?a.preventDefault():
      75 === b ||32===b?(a.preventDefault(),Player.togglePlay()):
      74 === b ||37===b?(a.preventDefault(),a.shiftKey?Player.seek(false,settings.seekLongStep):Player.seek(false,settings.seekStep)):
      76 === b ||39===b?(a.preventDefault(),a.shiftKey?Player.seek(true,settings.seekLongStep):Player.seek(true,settings.seekStep)):
      38 === b ?(a.preventDefault(),Player.volume(true,settings.volumeStep)):
      40 === b ?(a.preventDefault(),Player.volume(false,settings.volumeStep)):
      "Equal"===c?(a.preventDefault(),a.shiftKey?globalThis.WindowManager.scale(true):Player.speed(true,settings.speedStep)):
      "Minus"===c?(a.preventDefault(),a.shiftKey?globalThis.WindowManager.scale(false):Player.speed(false,settings.speedStep)):
      "Digit0"===c?(a.preventDefault(),a.shiftKey?globalThis.WindowManager.scaleSize(1):Player.resetSpeed()):
       67 === b?a.preventDefault():78===b?(a.preventDefault(),Player.playNext()):
       77 === b?(a.preventDefault(),Player.toggleMute()):
       80 === b?(a.preventDefault(),a.shiftKey?globalThis.WindowManager.togglePip():Player.playPrevious()):
      188 === b?(a.preventDefault(),Player.seek(false,.042)):
      190 === b?(a.preventDefault(),Player.seek(true,.042)):
       83 === b&&a.shiftKey?(a.preventDefault(),Utils.screenshot()):
       71 === b?(a.preventDefault(),Player.toggleVideoTime()):
       72 === b?(a.preventDefault(),Clock.toggleClockTime()):
       66 === b&&a.preventDefault()):a.preventDefault()
    }
  }
}

var lastDragTime = 0
,   dragTimer    = 0;

class FileManager
{
  static init()
  {
    FileManager.playIndex = 0;
    FileManager.inputFile = document.getElementById("file");
    FileManager.inputFile.addEventListener("change", FileManager.onSelectFile);
    document.body.addEventListener("dragover", FileManager.onDropOver);
    document.body.addEventListener("drop", FileManager.onDrop);
  }
  
  static getNextFile(a)
  {
    a = a ? FileManager.playIndex + 1 : FileManager.playIndex - 1;
    return 0 <= a && a < fileList.length ? (FileManager.playIndex = a, fileList[a]) : null
  }

  static hasPreviousNext()
  {
    return [0 < FileManager.playIndex, FileManager.playIndex < fileList.length - 1]
  }

  static openFiles()
  {
    FileManager.inputFile.click();
  }

  static updateFileList(a)
  {
    if (0 < a.length)
    {
      fileList = Array.from(a);
      //////////////////////////////////////////////////
      FileManager.playIndex = 0;
      //////////////////////////////////////////////////
      Player.loadFile(fileList[0]);
    }
  }

  static onSelectFile(a)
  {
    FileManager.updateFileList(this.files);
    //////////////////////////////////////////////////
    this.value = null;
  }

  static toggleDropzone(a)
  {
    let b = document.body.firstElementChild,
        c = b.nextElementSibling;
    a
    ? (b.classList.add("d-none")   ,c.classList.remove("d-none"))
    : (b.classList.remove("d-none"),c.classList.add("d-none")   )
  }

  static dragEnd()
  {
    clearInterval(dragTimer = 0);
    //////////////////////////////////////////////////
    FileManager.toggleDropzone(false);
  }

  static onDropOver(a)
  {
    a.preventDefault();
    a.dataTransfer.dropEffect = "move";
    lastDragTime = performance.now();
    0 == dragTimer &&
    (
      FileManager.toggleDropzone(true),
      dragTimer = setInterval(function() {
        200 < performance.now() - lastDragTime && FileManager.dragEnd()
      }, 200)
    )
  }

  static onDrop(a)
  {
    a.preventDefault();
    FileManager.dragEnd();
    FileManager.updateFileList(a.dataTransfer.files);
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