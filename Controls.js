var mouseMoveTimer    = 0
,   lickDblclickTimer = 0;

class Controls
{
  static init()
  {
    document.body.addEventListener("keydown",Controls.keyboardListener);
    //////////////////////////////////////////////////
    document.addEventListener("fullscreenchange",Controls.onFullscreenChange);
    //////////////////////////////////////////////////
    Controls.progressDragging = false;
    //////////////////////////////////////////////////
    controlsPanel.addEventListener("click",a => a.stopPropagation());
    //////////////////////////////////////////////////
    forwardBtn.addEventListener("click",a => Player.seek(true,settings.seekStep));
    //////////////////////////////////////////////////
    fullscreenBtn.addEventListener("click",globalThis.WindowManager.toggleFullscreen);
    //////////////////////////////////////////////////
    nextBtn.addEventListener("click",Player.playNext);
    //////////////////////////////////////////////////
    openFileBtn.addEventListener("click",FileManager.openFiles);
    //////////////////////////////////////////////////
    playBtn.addEventListener("click",Player.togglePlay);
    //////////////////////////////////////////////////
    playerPanel.addEventListener("click",Controls.onPlayerClick);
    //////////////////////////////////////////////////
    previousBtn.addEventListener("click",Player.playPrevious);
    //////////////////////////////////////////////////
    progress.addEventListener("change",Controls.onProgressChange);
    //////////////////////////////////////////////////
    progress.addEventListener("input",Controls.onProgressInput);
    //////////////////////////////////////////////////
    rewindBtn.addEventListener("click",a=>Player.seek(false,settings.seekStep));
    //////////////////////////////////////////////////
    rightTime.addEventListener("click",Controls.changeTimeMode);
    //////////////////////////////////////////////////
    video.addEventListener("ended",Controls.onVideoEnd);
    //////////////////////////////////////////////////
    video.addEventListener("loadedmetadata",Controls.onLoadedmetadata);
    //////////////////////////////////////////////////
    video.addEventListener("pause",Controls.onPause);
    //////////////////////////////////////////////////
    video.addEventListener("play",Controls.onPlay);
    //////////////////////////////////////////////////
    video.addEventListener("timeupdate",Controls.updateTime);
    //////////////////////////////////////////////////
    video.addEventListener("volumechange",Controls.onVolumeChange);
    //////////////////////////////////////////////////
    volumeBtn.addEventListener("click",a => Player.toggleMute());
    //////////////////////////////////////////////////
    volumeSlider.addEventListener("change",a => volumeSlider.blur());
    //////////////////////////////////////////////////
    volumeSlider.addEventListener("input",Controls.onVolumeInput);
    //////////////////////////////////////////////////
    "mediaSession"in navigator&&
    (
      navigator.mediaSession.setActionHandler("previoustrack",Player.playPrevious),
      navigator.mediaSession.setActionHandler("nexttrack",Player.playNext),
      navigator.mediaSession.setActionHandler("seekbackward",()=>Player.seek(false,settings.seekStep)),
      navigator.mediaSession.setActionHandler("seekforward",()=>Player.seek(true,settings.seekStep))
    );
    //////////////////////////////////////////////////
    document.body.addEventListener("contextmenu", a => a.preventDefault());
    //////////////////////////////////////////////////
    Controls.hidden = true;
    //////////////////////////////////////////////////
    document.getElementById("settings").addEventListener("mousemove",Controls.onMouseMove);
    //////////////////////////////////////////////////
    controlsPanel.addEventListener("mousemove",Controls.onMouseMove);
    //////////////////////////////////////////////////
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
    //////////////////////////////////////////////////
    Controls.hidden && Controls.show();
    //////////////////////////////////////////////////
    clearTimeout(mouseMoveTimer);
    //////////////////////////////////////////////////
    a = a.currentTarget.id;
    //////////////////////////////////////////////////
    let b = 1500;
    //////////////////////////////////////////////////
    "player"   == a && (b = 1500);
    "controls" == a && (b = 4500);
    "settings" == a && (b = 20000);
    //////////////////////////////////////////////////
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
      //////////////////////////////////////////////////
      ( 79 === b) &&  (a.ctrlKey || a.metaKey)                                 && (a.preventDefault(), FileManager.openFiles()                    ); // Control + O
      ( 37 === b) &&  (a.ctrlKey || a.metaKey)                                 && (a.preventDefault(), Player.playPrevious()                      ); // Control + Left Arrow
      ( 39 === b) &&  (a.ctrlKey || a.metaKey)                                 && (a.preventDefault(), Player.playNext()                          ); // Control + Right Arrow
      ( 37 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), Player.seek(false, settings.seekLongStep)  ); // Shift + Left Arrow
      ( 39 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), Player.seek(true , settings.seekLongStep)  ); // Shift + Right Arrow
      ( 74 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), Player.seek(false, settings.seekLongStep)  ); // Shift + J
      ( 76 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), Player.seek(true , settings.seekLongStep)  ); // Shift + L
      ( 80 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), globalThis.WindowManager.togglePip()       ); // Shift + P
      ( 83 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), Utils.screenshot()                         ); // Shift + S
      ( 32 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.togglePlay()                        ); // Space
      ( 37 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.seek  (false, settings.seekStep  )  ); // Left Arrow
      ( 38 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.volume(true , settings.volumeStep)  ); // Up Arrow
      ( 39 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.seek  (true , settings.seekStep  )  ); // Right Arrow
      ( 40 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.volume(false, settings.volumeStep)  ); // Down Arrow
      ( 70 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), globalThis.WindowManager.toggleFullscreen()); // F
      ( 71 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.toggleVideoTime()                   ); // G
      ( 72 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Clock.toggleClockTime()                    ); // H
      ( 74 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.seek(false,settings.seekStep)       ); // J
      ( 75 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.togglePlay()                        ); // K
      ( 76 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.seek(true ,settings.seekStep)       ); // L
      ( 77 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.toggleMute()                        ); // M
      ( 78 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.playNext()                          ); // N
      ( 80 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.playPrevious()                      ); // P
      ( 87 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), globalThis.WindowManager.toggleMaxSize()   ); // W
      (188 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.seek(false, 0.042)                  ); // ,
      (190 === b) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.seek(true,  0.042)                  ); // .
      ("Equal"  === c) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), globalThis.WindowManager.scale(true)   ); // Shift + =
      ("Minus"  === c) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), globalThis.WindowManager.scale(false)  ); // Shift + -
      ("Digit0" === c) && !(a.ctrlKey || a.metaKey) && !(a.altKey) &&  (a.shiftKey) && (a.preventDefault(), globalThis.WindowManager.scaleSize(1)  ); // Shift + 0
      ("Equal"  === c) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.speed(true , settings.speedStep)); // =
      ("Minus"  === c) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.speed(false, settings.speedStep)); // -
      ("Digit0" === c) && !(a.ctrlKey || a.metaKey) && !(a.altKey) && !(a.shiftKey) && (a.preventDefault(), Player.resetSpeed()                    ); // 0

      if ((83 !== b) || (!a.ctrlKey && !a.metaKey) || (a.shiftKey))
      {
        (a.ctrlKey) ||
        (a.altKey)  ||
        (a.metaKey) ||
        (
          84 === b                ? (a.preventDefault()):
           67 === b               ? (a.preventDefault()):
           66 === b && (a.preventDefault())
        )
      } else {
        a.preventDefault()
      }
    }
  }
}

globalThis.Controls = Controls;