((name) => {
  class VideoPlayer extends HTMLElement
  {
    constructor()
    {
      super();
      //////////////////////////////////////////////////
      console.log('VideoPlayer: constructor');
    }
  }
  //////////////////////////////////////////////////
  globalThis.__zeyo__             = globalThis.__zeyo__ || {};
  globalThis.__zeyo__.VideoPlayer = VideoPlayer;
  //////////////////////////////////////////////////
  globalThis.customElements.define(name, globalThis.__zeyo__.VideoPlayer);
})('zeyo-videoplayer');