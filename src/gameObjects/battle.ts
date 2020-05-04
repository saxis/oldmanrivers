import { Npc } from "./npc";
import { DerpData } from "./lerpData";
import { TimeOut } from "../components/timeout";
import { SoundBox } from "../components/soundbox";
import resources from "../resources";

const soundbox2 = new SoundBox(new Transform({position: new Vector3(7,0,8)}), resources.sounds.evillaugh)
const soundbox3 = new SoundBox(new Transform({position: new Vector3(7, 0, 8) }), resources.sounds.playerHit2)

export class Battle {
    private _npc: Npc;
    private _turntime: number;
    private _walk: AnimationState;
    private _talk: AnimationState;
    private _turn: AnimationState;
    private _fight: AnimationState;
    private _battle = true;
    private _clicked = false;
    private _battlepause: number;
    private _playerhp: number;
    private dead = false;

    constructor(npc: Npc, turntime: number, walk:AnimationState, talk:AnimationState, turn:AnimationState, fight:AnimationState, battle:boolean, clicked:boolean, battlepause:number, playerhp: number ) {
        this._npc = npc;
        this._turntime = turntime;
        this._walk = walk;
        this._talk = talk;
        this._turn = turn;
        this._fight = fight;
        this._battle = battle;
        this._clicked = clicked;
        this._playerhp = playerhp;
        this._battlepause = battlepause;
    }

    update() {
      let transform = this._npc.getComponent(Transform);
      let path = this._npc.getComponent(DerpData); 
      let dist = distance(transform.position, camera.position);
      if (dist < 8) {
        let playerPos = new Vector3(camera.position.x, 0, camera.position.z);
        transform.lookAt(playerPos);
        if(this._battle){
          if (!this.dead && !this._clicked) {
            if (!this._npc.hasComponent(TimeOut)) {
              this._walk.playing = false;
              this._turn.playing = false;
              //fightIdle.playing = false;
              this._fight.play()
              soundbox3.play()
              this._playerhp--; 
              //text.value = `HP: ${PLAYER_HP}    Rivers HP: ${HIT_POINTS}`;
              if (this._playerhp == 0) {
                soundbox2.play()
                //text.visible = false;
                //instructions.visible = true;
                this.dead = true;
                this._battle = false;
              }
              this._npc.addComponent(new TimeOut(this._battlepause)); 
            } 
          } 
        } else {
          this._walk.playing = false;
          this._turn.playing = false;
          this._talk.play();
          this._npc.addComponent(new TimeOut(this._battlepause));  
        } 
      } else {
          this._fight.stop()
          transform.lookAt(path.array[path.target]);
      }
    }
  }

  function distance(pos1: Vector3, pos2: Vector3): number {
    const a = pos1.x - pos2.x;
    const b = pos1.z - pos2.z;
    return a * a + b * b;
  }

  const camera = Camera.instance;