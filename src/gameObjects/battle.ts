import { Npc } from "./npc";
import { DerpData } from "./lerpData";
import { TimeOut } from "../components/timeout";
import { SoundBox } from "../components/soundbox";
import resources from "../resources";
import { Player } from "./player";

const soundbox2 = new SoundBox(new Transform({position: new Vector3(7,0,8)}), resources.sounds.evillaugh)
const soundbox3 = new SoundBox(new Transform({position: new Vector3(7, 0, 8) }), resources.sounds.playerHit2)
const soundbox4 = new SoundBox(new Transform({position: new Vector3(7,0,8)}), resources.sounds.playerHit)

export class Battle {
    private _player: Player;
    private _npc: Npc;
    private _turntime: number;
    private _walk: AnimationState;
    private _talk: AnimationState;
    private _turn: AnimationState;
    private _fight: AnimationState;
    private _hit: AnimationState;
    private _death: AnimationState;
    //private _battle = true;
    private _clicked = false;
    private _battlepause: number;
    private _playerhp: number;
    private dead = false;
    private _startfight: boolean = false;

    constructor(player: Player, npc: Npc, turntime: number, walk:AnimationState, talk:AnimationState, turn:AnimationState, fight:AnimationState, hit:AnimationState,death:AnimationState, clicked:boolean, battlepause:number, playerhp: number ) {
        this._player = player;
        this._npc = npc;
        this._turntime = turntime;
        this._walk = walk;
        this._talk = talk;
        this._turn = turn;
        this._fight = fight;
        this._hit = hit;
        this._death = death;
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
        if(this._npc.battle){
          if(!this._startfight){
            this._npc.addComponentOrReplace(
               new OnPointerDown(
                  e => {
                    this._clicked = true;
                  },{
                    button: ActionButton.PRIMARY,
                    showFeedback: true,
                    hoverText: "Raaaarr!!!!!" 
                  }
              )
            )
            this._startfight = true;
          }
          if (!this.dead && !this._clicked) {
            if (!this._npc.hasComponent(TimeOut)) {
              this._walk.playing = false;
              this._turn.playing = false;
              this._talk.playing = false;
              this._hit.playing = false;
              this._fight.play()
              soundbox3.play()
              this._player.damage(1)
              if(this._player.hp == 0) {
                soundbox2.play()
                this.dead = true;
                this._npc.battle = false;
              }
              this._npc.addComponentOrReplace(new TimeOut(this._battlepause)); 
            } 
          } else if (!this.dead && this._clicked) {
            this._walk.playing = false;
            this._turn.playing = false;
            this._talk.playing = false;
            this._fight.playing = false;
            this._hit.play()
            soundbox4.play()
            this._npc.takedamage(1)
            this._npc.addComponentOrReplace(new TimeOut(this._battlepause));
            this._clicked = false;
          }  
        } else {
          this._walk.playing = false;
          this._turn.playing = false;
          this._talk.play();
          this._npc.addComponentOrReplace(new TimeOut(this._battlepause));  
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

  // brute.addComponent(
  //   new OnPointerDown(
  //     e => {
  //       if (!dead) {
  //         log("fighter was clicked");
  //         clicked = true;

  //         asyncCall();
  //         //fighter.addComponent(new TimeOut(HIT_TIME));
  //         spinAttack.stop();
  //         hitInFace.play();
  //         bruteWalkClip.playing = false;
  //         spinAttack.playing = false;
  //         turnRClip.playing = false;
  //         deathFromFront.playing = false;
  //         hitInFace.looping = false;
  //         brute.getComponent(AudioSource).playOnce();

  //         HIT_POINTS = HIT_POINTS - 1;
  //         log("hit points is now: ", HIT_POINTS);
  //         text.value = `HP: ${PLAYER_HP}    Brute HP: ${HIT_POINTS}`;

  //         if (HIT_POINTS == 0) {
  //           log("play death animation");
  //           brutedead = true
  //           spinAttack.stop();
  //           hitInFace.stop();
  //           bruteWalkClip.stop();
  //           dead = true;
  //           deathFromFront.play();
  //           //deathFromFront.playing = true;
  //           deathFromFront.looping = false;
  //           //lantern_lit3.getComponent(utils.ToggleComponent).toggle();
  //           brute.addComponentOrReplace(
  //             new OnPointerDown(
  //               e => {
  //                 //soundbox2.getComponent(AudioSource).playOnce()
  //                 //text.value = "I have lost?"
  //                 spawnLoot();
  //                 respawnRivers();
  //               },
  //               {
  //                 button: ActionButton.PRIMARY,
  //                 showFeeback: true,
  //                 hoverText: "Locate the loot chest key"
  //               }
  //             )
  //           );
  //         }
  //       } else {
  //         log("grab the key from the corpse");
  //       }
  //     },
  //     {
  //       button: ActionButton.PRIMARY,
  //       showFeeback: true,
  //       hoverText: "Raaaarr!!!!!"
  //     }
  //   )
  // );