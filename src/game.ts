import { BaseScene } from "./gameObjects/baseScene";
import resources from "./resources";
import { PeasantDialog } from "./ui/index";
import { Npc } from "./gameObjects/npc";
import { BuilderHUD } from "./modules/BuilderHUD";
import { CreateOutside } from "./gameObjects/outside";
import utils from "../node_modules/decentraland-ecs-utils/index";

let baseScene = new BaseScene();
let outside = new CreateOutside();

const gameCanvas = new UICanvas();

const dialog = new PeasantDialog(gameCanvas);
let clicked = false;
let dead = false;
let HIT_POINTS = 5;
let PLAYER_HP = 10;



const oldmanrivers = new Npc(
  resources.sounds.peasantunlock,
  resources.models.peasant,
  5
);
oldmanrivers.addComponent(
  new OnPointerDown(
    e => {
      dialog.run();
    },
    {
      button: ActionButton.PRIMARY,
      showFeeback: true,
      hoverText: "Speak to Old Man Rivers"
    }
  )
);

const tree_Dead_04 = new Entity();
    const gltfShape_4 = new GLTFShape("models/Tree_Dead_04.glb");
    tree_Dead_04.addComponentOrReplace(gltfShape_4);
    const transform_5 = new Transform({
      position: new Vector3(10.5, 0, 12.51),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    });
    tree_Dead_04.addComponentOrReplace(transform_5);
    engine.addEntity(tree_Dead_04);
    tree_Dead_04.addComponent(new AudioSource(resources.sounds.lava))


// //model stuff
const point1 = new Vector3(12, 0, 5);
const point2 = new Vector3(13, 0, 14);
const point3 = new Vector3(3, 0, 14);
const point4 = new Vector3(2, 0, 3);
//const point5 = new Vector3(13, 0, 3);

const path: Vector3[] = [point1, point2, point3, point4];
const TURN_TIME = 0.9;

@Component("timeOut")
export class TimeOut {
  timeLeft: number;
  constructor(time: number) {
    this.timeLeft = time;
  }
}

export const paused = engine.getComponentGroup(TimeOut);

// LerpData component
@Component("lerpData")
export class LerpData {
  array: Vector3[] = path;
  origin: number = 0;
  target: number = 1;
  fraction: number = 0;
}

let oldmanriversAnimator = new Animator();
oldmanrivers.addComponent(oldmanriversAnimator);

//Add walk animation
const walkClip = new AnimationState("walk");
oldmanriversAnimator.addClip(walkClip);
const turnRClip = new AnimationState("turnLeft");
turnRClip.looping = false;
oldmanriversAnimator.addClip(turnRClip);
const raiseDeadClip = new AnimationState("talking");
oldmanriversAnimator.addClip(raiseDeadClip);
const unlockSpell = new AnimationState("unlockSpell");
oldmanriversAnimator.addClip(unlockSpell);
const salute = new AnimationState("salute");
oldmanriversAnimator.addClip(salute);

oldmanrivers.addComponent(new LerpData());

dialog.onPoorChoiceMade = () => {
  log("In on Poor choice made");
  engine.removeEntity(oldmanrivers);
  tree_Dead_04.getComponent(AudioSource).playOnce()

  const brute = new Npc(resources.sounds.fighterhit, resources.models.brute, 5);
  let fighterAnimator = new Animator();
  brute.addComponent(fighterAnimator);

  //Add walk animation
  const walkClip = new AnimationState("walk");
  fighterAnimator.addClip(walkClip);
  const turnRClip = new AnimationState("turnRight");
  turnRClip.looping = false;
  fighterAnimator.addClip(turnRClip);
  const spinAttack = new AnimationState("swipeAttack");
  fighterAnimator.addClip(spinAttack);
  const hitInFace = new AnimationState("hitInHead");
  fighterAnimator.addClip(hitInFace);
  const deathFromFront = new AnimationState("deathFromFront");
  fighterAnimator.addClip(deathFromFront);
  const taunt = new AnimationState("taunt");
  fighterAnimator.addClip(taunt);
  

  class BruteWalk {
    update(dt: number) {
      if (!brute.hasComponent(TimeOut) && !spinAttack.playing && !dead) {
        let transform = brute.getComponent(Transform);
        let path = brute.getComponent(LerpData);
        walkClip.playing = true;
        turnRClip.playing = false;
        if (path.fraction < 1) {
          path.fraction += dt / 12;
          transform.position = Vector3.Lerp(
            path.array[path.origin],
            path.array[path.target],
            path.fraction
          );
        } else {
          path.origin = path.target;
          path.target += 1;
          if (path.target >= path.array.length) {
            path.target = 0;
          }
          path.fraction = 0;
          transform.lookAt(path.array[path.target]);
          walkClip.pause();
          turnRClip.play();
          turnRClip.looping = false;
          brute.addComponent(new TimeOut(TURN_TIME));
        }
      }
    }
  }

  class BruteBattleCry {
    update() {
      let transform = brute.getComponent(Transform);
      let path = brute.getComponent(LerpData);
      let dist = distance(transform.position, camera.position);
      if (dist < 16) {
        if (!dead && !clicked) {
          if (spinAttack.playing == false) {
            spinAttack.reset();
            spinAttack.play();
            spinAttack.playing = true;
            walkClip.playing = false;
            turnRClip.playing = false;
            hitInFace.playing = false;
            PLAYER_HP--;
            log("PLAYER HP is now: ", PLAYER_HP);
            if (PLAYER_HP == 0) {
              log("play dead music.. Kick player out of the scene");
            }
          }
        }
        let playerPos = new Vector3(camera.position.x, 0, camera.position.z);
        transform.lookAt(playerPos);
      } else if (spinAttack.playing) {
        spinAttack.stop();
        transform.lookAt(path.array[path.target]);
      }
    }
  }
  
  engine.addSystem(new BruteBattleCry());

  walkClip.play()

  brute.addComponent(new LerpData());
  brute.addComponent(
    new OnPointerDown(
      e => {
        if (!dead) {
          log("fighter was clicked");
          clicked = true;

          asyncCall();
          //fighter.addComponent(new TimeOut(HIT_TIME));
          spinAttack.stop();
          hitInFace.play();
          walkClip.playing = false;
          spinAttack.playing = false;
          turnRClip.playing = false;
          deathFromFront.playing = false;
          hitInFace.looping = false;
          brute.getComponent(AudioSource).playOnce();

          HIT_POINTS = HIT_POINTS - 1;
          log("hit points is now: ", HIT_POINTS);

          if (HIT_POINTS == 0) {
            log("play death animation");
            spinAttack.stop();
            hitInFace.stop();
            walkClip.stop();
            dead = true;
            deathFromFront.play();
            //deathFromFront.playing = true;
            deathFromFront.looping = false;
            //lantern_lit3.getComponent(utils.ToggleComponent).toggle();
          }

          //   if (dead == false && hitInFace.playing == false) {
          //     log("play hit in face looping false");
          //     hitInFace.reset();
          //     //hitInFace.playing = true;
          //     hitInFace.play();
          //     hitInFace.looping = false;
          //   }
        } else {
          log("grab the key from the corpse");
        }
      },
      {
        button: ActionButton.PRIMARY,
        showFeeback: true,
        hoverText: "Speak to Old Man Rivers"
      }
    )
  );

  function resolveAfter2Seconds() {
    return new Promise(resolve => {
      brute.addComponentOrReplace(
        new utils.Delay(2000, () => {
          resolve("resolved")
        })
      );
    });
  }
  
  async function asyncCall() {
    log("calling");
    var result = await resolveAfter2Seconds();
    clicked = false;
    log("clicked is false");
    log(result);
    // expected output: 'resolved'
  }
  
};

dialog.onSequenceComplete = () => {
  walkClip.pause();
  log("in onSequenceCompleted");
  // log("trying to play unlock Spell animation");
  // unlockSpell.play();
  // unlockSpell.looping = false;
  log("trying to play salute animation");
  salute.play();
  salute.looping = false;
};

walkClip.play();

// Walk System
export class GnarkWalk {
  update(dt: number) {
    if (!oldmanrivers.hasComponent(TimeOut) && !raiseDeadClip.playing) {
      let transform = oldmanrivers.getComponent(Transform);
      let path = oldmanrivers.getComponent(LerpData);
      walkClip.playing = true;
      turnRClip.playing = false;
      if (path.fraction < 1) {
        path.fraction += dt / 12;
        transform.position = Vector3.Lerp(
          path.array[path.origin],
          path.array[path.target],
          path.fraction
        );
      } else {
        path.origin = path.target;
        path.target += 1;
        if (path.target >= path.array.length) {
          path.target = 0;
        }
        path.fraction = 0;
        transform.lookAt(path.array[path.target]);
        walkClip.pause();
        turnRClip.play();
        turnRClip.looping = false;
        oldmanrivers.addComponent(new TimeOut(TURN_TIME));
      }
    }
  }
}

engine.addSystem(new GnarkWalk());

export class WaitSystem {
  update(dt: number) {
    for (let ent of paused.entities) {
      let time = ent.getComponentOrNull(TimeOut);
      if (time) {
        if (time.timeLeft > 0) {
          time.timeLeft -= dt;
        } else {
          ent.removeComponent(TimeOut);
        }
      }
    }
  }
}

engine.addSystem(new WaitSystem());

export class BattleCry {
  update() {
    let transform = oldmanrivers.getComponent(Transform);
    let path = oldmanrivers.getComponent(LerpData);
    let dist = distance(transform.position, camera.position);
    if (dist < 16) {
      if (raiseDeadClip.playing == false) {
        raiseDeadClip.reset();
        raiseDeadClip.playing = true;
        walkClip.playing = false;
        turnRClip.playing = false;
      }
      let playerPos = new Vector3(camera.position.x, 0, camera.position.z);
      transform.lookAt(playerPos);
    } else if (raiseDeadClip.playing) {
      raiseDeadClip.stop();
      transform.lookAt(path.array[path.target]);
    }
  }
}

engine.addSystem(new BattleCry());

const camera = Camera.instance;

function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x;
  const b = pos1.z - pos2.z;
  return a * a + b * b;
}

//const hud: BuilderHUD = new BuilderHUD();
// hud.attachToEntity(grassPatchSmall_04)
