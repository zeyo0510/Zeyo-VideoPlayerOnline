class Player
{
  static init()
  {

  }

  static async loadFile(a)
  {
    document.title = a.name;
    //////////////////////////////////////////////////
    Player.objectURL && URL.revokeObjectURL(Player.objectURL);
    //////////////////////////////////////////////////
    Player.objectURL = URL.createObjectURL(a);
    //////////////////////////////////////////////////
    video.src = Player.objectURL;
    //////////////////////////////////////////////////
    if (void 0 === a.canPlay)
    {
      try
      {
        await video.play();
        a.canPlay = true;
      } catch(b) {
        a.canPlay = false;
        Player.stop();
        if ("NotSupportedError" == b.name)
        {
          Utils.showError(Messages.cannotSupportFormat)
        } else {
          Utils.showError(Messages.error)
        }
      }
    } else {
      true === a.canPlay && Player.play();
    }
    //////////////////////////////////////////////////
    Controls.onVideoChange();
  }

  static stop()
  {
    video.removeAttribute("src");
    //////////////////////////////////////////////////
    video.load();
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
    //////////////////////////////////////////////////
    return a ? (Player.loadFile(a), true) : false
  }

  static playPrevious()
  {
    let a = FileManager.getNextFile(false);
    //////////////////////////////////////////////////
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
      video.currentTime = a ? Math.min(video.currentTime + b, video.duration)
                            : Math.max(video.currentTime - b, 0             ),
      1 <= b && (a=`${Utils.formatTime(video.currentTime)} / ${Utils.formatTime(video.duration)}`, Utils.showInfo(a))
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
    //////////////////////////////////////////////////
    0.25 <= a && 5 >= a && (video.playbackRate = a);
    //////////////////////////////////////////////////
    Utils.showInfo(Messages.speedIs + video.playbackRate);
  }

  static resetSpeed()
  {
    video.playbackRate = 1;
    //////////////////////////////////////////////////
    Utils.showInfo(Messages.speedIs + "1");
  }

  static toggleVideoTime()
  {
    if (video.src && Number.isFinite(video.duration))
    {
      if (ltInfo.classList.contains("d-none"))
      {
        Player.updateVideoTime();
        ltInfo.classList.remove("d-none");
        Player.timeTimer = setInterval(Player.updateVideoTime, 1000);
      } else {
        ltInfo.classList.add("d-none");
        clearInterval(Player.timeTimer);
      }
    }
  }

  static updateVideoTime()
  {
    ltInfo.textContent = `${Utils.formatTime(video.currentTime)} / ${Utils.formatTime(video.duration)}  [-${Utils.formatTime(video.duration-video.currentTime)}]`;
  }
}
//////////////////////////////////////////////////
globalThis.Player = Player;