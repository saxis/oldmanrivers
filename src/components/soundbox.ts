export class SoundBox extends Entity {
    constructor(
      transform: TranformConstructorArgs,
      audio: AudioClip,
    ) {
      super();
      engine.addEntity(this);
      this.addComponent(new Transform(transform));
  
      if (audio) {
        this.addComponent(new AudioSource(audio));
      }
      
    }

    play() {
        this.getComponent(AudioSource).playOnce()
    }
  }