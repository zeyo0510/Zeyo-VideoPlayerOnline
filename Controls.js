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
    volumeSlider.addEventListener("input",Controls.onVolumeInput);
    volumeSlider.addEventListener("change",a=>volumeSlider.blur());
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
    video.volume = volumeSlider.valueAsNumber;
  }

  static onVolumeChange()
  {
    const a = video.volume;
    //////////////////////////////////////////////////
    volumeSlider.value = a;
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
    //////////////////////////////////////////////////
    playerPanel.classList.remove("hide-cursor");
  }

  static hide()
  {
    Controls.hidden = true;
    //////////////////////////////////////////////////
    controlsPanel.classList.add("d-none");
    //////////////////////////////////////////////////
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

globalThis.Controls = Controls;