((name) => {
  class VideoPlayer
  {
    constructor()
    {
      console.log('VideoPlayer: constructor');
    }
  }
  //////////////////////////////////////////////////
  globalThis.__zeyo__             = globalThis.__zeyo__ || {};
  globalThis.__zeyo__.VideoPlayer = VideoPlayer;
})('zeyo-videoplayer');