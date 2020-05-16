export class Npc extends Entity {
  private _hp: number;
  private _battle: boolean = false;
  private _startinghp:number;
  public walking: AnimationState;
  public talk: AnimationState;
  public fightIdle: AnimationState;
  public hitInHead: AnimationState;
  public death: AnimationState;
  public turnLeft: AnimationState;
  public rightTurn: AnimationState;
  public boxing: AnimationState;
  public salute: AnimationState;
  private healthBar: UIText;

  constructor(
    sound: AudioClip,
    model: GLTFShape,
    startingHp: number,
    start: Vector3,
    rotation: Quaternion,
    canvas
  ) {
    super();
    engine.addEntity(this);
    this.addComponent(model);
    this.addComponent(
      new Transform({
        position: start,
        rotation: rotation
      })
    );
    this.addComponent(new AudioSource(sound));
    this._hp = startingHp;
    this._startinghp = startingHp;
    let npcAnimator = new Animator();
    this.addComponent(npcAnimator);
    this.walking = new AnimationState("walking")
    npcAnimator.addClip(this.walking)
    this.talk = new AnimationState("talk")
    npcAnimator.addClip(this.talk)
    this.fightIdle = new AnimationState("fightIdle")
    npcAnimator.addClip(this.fightIdle)
    this.hitInHead = new AnimationState("hitInHead");
    npcAnimator.addClip(this.hitInHead);
    this.death = new AnimationState("death")
    npcAnimator.addClip(this.death)
    this.turnLeft = new AnimationState("turnLeft")
    npcAnimator.addClip(this.turnLeft)
    this.rightTurn = new AnimationState("rightTurn")
    npcAnimator.addClip(this.rightTurn)
    this.boxing = new AnimationState("boxing")
    npcAnimator.addClip(this.boxing)
    this.salute = new AnimationState("salute")
    npcAnimator.addClip(this.salute)
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
    if (val > -1) {
      this._hp = val;
    }
  }

  showhpbar() {
    this.healthBar.visible = true;
  }

  hidehpbar() {
    this.healthBar.visible = false;
  }

  heal(amount: number) {
    this.hp += amount;
    this.healthBar.value  =  ((this.hp/this._startinghp)*100).toFixed(0).toString() + '%';
  }

  takedamage(amount: number) {
    this.hp -= amount;
    this.healthBar.value  = ((this.hp/this._startinghp)*100).toFixed(0).toString() + '%';
  }
}
