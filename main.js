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