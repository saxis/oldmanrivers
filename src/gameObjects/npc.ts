export class Npc extends Entity {
    private _hp: number;
    //private _walkClip: AnimationState
    public riversWalkClip: AnimationState;
    public turnRClip: AnimationState;
    public turnLClip: AnimationState;
    public talkingClip: AnimationState;
    public fightIdle: AnimationState;
    public boxing: AnimationState;
  
    constructor(sound: AudioClip, model: GLTFShape, startingHp: number, start: Vector3) {
      super();
      engine.addEntity(this);
      this.addComponent(model);
      this.addComponent(
        new Transform({
          //position: new Vector3(12, 0, 5)
          position: start
        })
      );
      this.addComponent(new AudioSource(sound));
      this._hp = startingHp;
      let npcAnimator = new Animator();
      this.addComponent(npcAnimator);
      this.riversWalkClip = new AnimationState("walking");
      npcAnimator.addClip(this.riversWalkClip);
      this.turnRClip = new AnimationState("rightTurn")
      npcAnimator.addClip(this.turnRClip)
      this.turnLClip = new AnimationState("turnLeft")
      npcAnimator.addClip(this.turnLClip)
      this.talkingClip = new AnimationState("talk");
      npcAnimator.addClip(this.talkingClip);
      this.fightIdle = new AnimationState("fightIdle");
      npcAnimator.addClip(this.fightIdle);
      this.boxing = new AnimationState("boxing");
      npcAnimator.addClip(this.boxing)
    }
  
    public playAudio() {
      this.getComponent(AudioSource).playOnce();
    }
  
    get hp() {
      return this._hp;
    }
  
    set hp(val: number) {
      if (val > 0) {
        this._hp = val;
      }
    }

    heal(amount: number) {
      this.hp += amount;
    }
  
    takedamage(amount: number) {
      this.hp -= amount;
    }
  }

  