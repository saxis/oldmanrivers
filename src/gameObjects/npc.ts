export class Npc extends Entity {
  private _hp: number;
  private _battle: boolean = false;
  private _startinghp:number;
  //private _walkClip: AnimationState
  public riversWalkClip: AnimationState;
  public turnRClip: AnimationState;
  public turnLClip: AnimationState;
  public talkingClip: AnimationState;
  public fightIdle: AnimationState;
  public boxing: AnimationState;
  public hit: AnimationState;
  public death: AnimationState;
  private healthBar: UIText;

  constructor(
    sound: AudioClip,
    model: GLTFShape,
    startingHp: number,
    start: Vector3,
    canvas
  ) {
    super();
    engine.addEntity(this);
    this.addComponent(model);
    this.addComponent(
      new Transform({
        position: start,
      })
    );
    this.addComponent(new AudioSource(sound));
    this._hp = startingHp;
    this._startinghp = startingHp;
    let npcAnimator = new Animator();
    this.addComponent(npcAnimator);
    this.riversWalkClip = new AnimationState("walking");
    npcAnimator.addClip(this.riversWalkClip);
    this.turnRClip = new AnimationState("rightTurn");
    npcAnimator.addClip(this.turnRClip);
    this.turnLClip = new AnimationState("turnLeft");
    npcAnimator.addClip(this.turnLClip);
    this.talkingClip = new AnimationState("talk");
    npcAnimator.addClip(this.talkingClip);
    this.fightIdle = new AnimationState("fightIdle");
    npcAnimator.addClip(this.fightIdle);
    this.boxing = new AnimationState("boxing");
    npcAnimator.addClip(this.boxing);
    this.hit = new AnimationState("fightIdle");
    npcAnimator.addClip(this.hit);
    this.death = new AnimationState("death");
    npcAnimator.addClip(this.death);
    this.healthBar = new UIText(canvas)
    this.healthBar.hAlign = "left";
    this.healthBar.vAlign = "center";
    this.healthBar.hTextAlign = "left";
    this.healthBar.vTextAlign = "center";
    this.healthBar.width = "100%";
    this.healthBar.height = "100%";
    this.healthBar.value = ((startingHp/startingHp)*100).toString() + '%';
    this.healthBar.positionY = 180;
    this.healthBar.positionX = 100;
    this.healthBar.fontSize = 14;
    this.healthBar.outlineWidth = 0.4;
    this.healthBar.textWrapping = true;
    this.healthBar.fontWeight = "bold";
    this.healthBar.isPointerBlocker = false;
    this.healthBar.visible = false;
  }

  public playAudio() {
    this.getComponent(AudioSource).playOnce();
  }

  get battle() {
    return this._battle;
  }

  set battle(val: boolean) {
    this._battle = val;
  }

  get hp() {
    return this._hp;
  }

  set hp(val: number) {
    if (val > 0) {
      this._hp = val;
    }
  }

  showhpbar() {
    this.healthBar.visible = true;
  }

  heal(amount: number) {
    this.hp += amount;
    this.healthBar.value  =  ((this.hp/this._startinghp)*100).toString() + '%';
  }

  takedamage(amount: number) {
    this.hp -= amount;
    this.healthBar.value  = ((this.hp/this._startinghp)*100).toString() + '%';
  }
}
