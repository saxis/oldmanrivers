import { BaseScene } from "./gameObjects/baseScene";
import resources from "./resources";
import { PeasantDialog, SecondDialog } from "./ui/index";
import { Npc } from "./gameObjects/npc";
//import { BuilderHUD } from "./modules/BuilderHUD";
import { spawnEntity } from "./modules/SpawnerFunctions";
//import { CreateOutside } from "./gameObjects/outside";
import utils from "../node_modules/decentraland-ecs-utils/index";
import { createChannel } from "../node_modules/decentraland-builder-scripts/channel";
import { createInventory } from "../node_modules/decentraland-builder-scripts/inventory";
import Script1 from "../ff9257ec-9d62-404f-97c7-cf19c4035761/src/item";
import Script2 from "../7402ef02-fc7f-4e19-b44a-4613ee2526c5/src/item";
import Script3 from "../df8d742f-045c-4fe3-8c70-adfb47d22baf/src/item";
import Script4 from "../swordScript/src/item";
//import { getUserData } from "@decentraland/Identity";

let baseScene = new BaseScene();
//let outside = new CreateOutside();

let clicked = false;
let dead = false;
let HIT_POINTS = 50;
let PLAYER_HP = 50;
let brutedead = false;
let playerdead = false;

const gameCanvas = new UICanvas();
const text = new UIText(gameCanvas);
const instructions = new UIText(gameCanvas);

text.value = `HP: ${PLAYER_HP}    Brute HP: ${HIT_POINTS}`;
text.vAlign = "bottom";
text.positionX = -80;
text.visible = false;

instructions.value =
  "The Brute has defeated you. Seek out the sorceress Mehetra in her abode to the far North.";
instructions.fontSize = 20;
instructions.hAlign = "left";
instructions.positionX = 200;
instructions.vAlign = "center";
instructions.visible = false;

const dialog = new PeasantDialog(gameCanvas);
const seconddialog = new SecondDialog(gameCanvas)

const soundbox2 = new Entity();
soundbox2.addComponent(new Transform());
soundbox2.getComponent(Transform).position.set(7, 0, 8);
soundbox2.addComponent(new AudioSource(resources.sounds.evillaugh));
engine.addEntity(soundbox2);

const soundbox3 = new Entity();
soundbox3.addComponent(new Transform());
soundbox3.getComponent(Transform).position.set(7,1,8);
soundbox3.addComponent(new AudioSource(resources.sounds.playerHit2));
engine.addEntity(soundbox3);

const grassBase = new Entity("grass");
    const grassShape = new GLTFShape(
      "models/FloorBaseGrass_01/FloorBaseGrass_01.glb"
    );
    grassBase.addComponentOrReplace(grassShape);
    const grassLoc = new Transform({
      position: new Vector3(8, 0, 8),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    grassBase.addComponentOrReplace(grassLoc);
    engine.addEntity(grassBase);
    grassBase.addComponent(new AudioSource(resources.sounds.birdsong));
    grassBase.getComponent(AudioSource).playOnce();
    grassBase.addComponent(
      new utils.Delay(80000, () => {
        log("After 3 minute delay playing song again")
        grassBase.getComponent(AudioSource).playOnce();
      })
    )


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




// //model stuff
const point1 = new Vector3(12, 0, 5);
const point2 = new Vector3(13, 0, 14);
const point3 = new Vector3(3, 0, 14);
const point4 = new Vector3(2, 0, 3);
//const point5 = new Vector3(13, 0, 3);

const path: Vector3[] = [point1, point2, point3, point4];
const TURN_TIME = 0.9;

const lantern = spawnEntity(5.6,2.2,8.82,  0,-90,0,  1,1,1)
lantern.addComponentOrReplace(resources.models.lantern)
lantern.addComponent(new AudioSource(resources.sounds.lava))

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
const riversWalkClip = new AnimationState("walk");
oldmanriversAnimator.addClip(riversWalkClip);
const turnRClip = new AnimationState("turnLeft");
turnRClip.looping = false;
oldmanriversAnimator.addClip(turnRClip);
const raiseDeadClip = new AnimationState("salute");
oldmanriversAnimator.addClip(raiseDeadClip);
const unlockSpell = new AnimationState("unlockSpell");
oldmanriversAnimator.addClip(unlockSpell);
const salute = new AnimationState("salute");
oldmanriversAnimator.addClip(salute);

oldmanrivers.addComponent(new LerpData());

dialog.onDialogStarted = () => {
  oldmanrivers.getComponent(OnPointerDown).showFeeback = false;
}

dialog.onDialogEnded = () => {
  oldmanrivers.getComponent(OnPointerDown).showFeeback = true;
}

dialog.onPoorChoiceMade = () => {
  log("In on Poor choice made");
  engine.removeEntity(oldmanrivers);
  grassBase.getComponent(AudioSource).volume = 0;
  lantern.getComponent(AudioSource).playOnce();

  const brute = new Npc(resources.sounds.fighterhit, resources.models.brute, 5);
  let fighterAnimator = new Animator();
  brute.addComponent(fighterAnimator);
  text.visible = true;

  //Add walk animation
  const bruteWalkClip = new AnimationState("walk");
  fighterAnimator.addClip(bruteWalkClip);
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
  brute.addComponent(new LerpData());

  bruteWalkClip.play();

  class BruteWalk {
    update(dt: number) {
      if (!brute.hasComponent(TimeOut) && !spinAttack.playing && !dead) {
        let transform = brute.getComponent(Transform);
        let path = brute.getComponent(LerpData);
        bruteWalkClip.playing = true;
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
          bruteWalkClip.pause();
          turnRClip.play();
          turnRClip.looping = false;
          brute.addComponent(new TimeOut(TURN_TIME));
        }
      }
    }
  }

  engine.addSystem(new BruteWalk());

  class BruteBattleCry {
    update() {
      let transform = brute.getComponent(Transform);
      let path = brute.getComponent(LerpData);
      let dist = distance(transform.position, camera.position);
      if (dist < 16) {
        if (!dead && !clicked) {
          if (spinAttack.playing == false) {
            spinAttack.reset();
            log('Starting to play the spinAttack')
            spinAttack.play();
            //spinAttack.playing = true;
            bruteWalkClip.playing = false;
            turnRClip.playing = false;
            hitInFace.playing = false;

            longAsyncCall();
            log('stopping spinattack after long asyncall')
            //spinAttack.stop();

            soundbox3.getComponent(AudioSource).playOnce()
            PLAYER_HP--;
            text.value = `HP: ${PLAYER_HP}    Brute HP: ${HIT_POINTS}`;
            log("PLAYER HP is now: ", PLAYER_HP);
            
            if (PLAYER_HP == 0) {
              log("play dead music.. Kick player out of the scene");
              soundbox2.getComponent(AudioSource).playOnce();

              text.visible = false;
              instructions.visible = true;

              brute.addComponentOrReplace(
                new utils.Delay(2000, () => {
                  playerdead = true;
                  engine.removeEntity(brute);
                })
              );
            }
          } else {
            log('spinAttack is playing already')
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
          bruteWalkClip.playing = false;
          spinAttack.playing = false;
          turnRClip.playing = false;
          deathFromFront.playing = false;
          hitInFace.looping = false;
          brute.getComponent(AudioSource).playOnce();

          HIT_POINTS = HIT_POINTS - 1;
          log("hit points is now: ", HIT_POINTS);
          text.value = `HP: ${PLAYER_HP}    Brute HP: ${HIT_POINTS}`;

          if (HIT_POINTS == 0) {
            log("play death animation");
            brutedead = true
            spinAttack.stop();
            hitInFace.stop();
            bruteWalkClip.stop();
            dead = true;
            deathFromFront.play();
            //deathFromFront.playing = true;
            deathFromFront.looping = false;
            //lantern_lit3.getComponent(utils.ToggleComponent).toggle();
            brute.addComponentOrReplace(
              new OnPointerDown(
                e => {
                  //soundbox2.getComponent(AudioSource).playOnce()
                  //text.value = "I have lost?"
                  spawnLoot();
                  respawnRivers();
                },
                {
                  button: ActionButton.PRIMARY,
                  showFeeback: true,
                  hoverText: "Locate the loot chest key"
                }
              )
            );
          }
        } else {
          log("grab the key from the corpse");
        }
      },
      {
        button: ActionButton.PRIMARY,
        showFeeback: true,
        hoverText: "Raaaarr!!!!!"
      }
    )
  );

  function resolveAfter2Seconds() {
    return new Promise(resolve => {
      brute.addComponentOrReplace(
        new utils.Delay(2000, () => {
          resolve("resolved");
        })
      );
    });
  }

  function resolveAfter10Seconds() {
    return new Promise(resolve => {
      brute.addComponentOrReplace(
        new utils.Delay(100000, () => {
          resolve("resolved after ten");
        })
      );
    });
  }

  async function asyncCall() {
    log("calling asyncCall to kill time");
    var result = await resolveAfter2Seconds();
    clicked = false;
    log("clicked is now false");
    log(result);
    // expected output: 'resolved'
  }

  async function longAsyncCall() {
    log("calling long asyncCall to kill time");
    var result = await resolveAfter10Seconds();
    //clicked = false;
    spinAttack.stop();
    log("spinAttack is now sopped");
    log(result);
    // expected output: 'resolved'
  }

};

dialog.onSequenceComplete = () => {
  riversWalkClip.pause();
  log("in onSequenceCompleted");
  log("trying to play unlock Spell animation");
  unlockSpell.play();
  unlockSpell.looping = false;
  log("trying to play salute animation");
  salute.play();
  salute.looping = false;
};

riversWalkClip.play();

// Walk System
export class GnarkWalk {
  update(dt: number) {
    if (!oldmanrivers.hasComponent(TimeOut) && !raiseDeadClip.playing) {
      let transform = oldmanrivers.getComponent(Transform);
      let path = oldmanrivers.getComponent(LerpData);
      riversWalkClip.playing = true;
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
        riversWalkClip.pause();
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
        riversWalkClip.playing = false;
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

function respawnRivers() {
  engine.addEntity(oldmanrivers);
  riversWalkClip.play();
  oldmanrivers.addComponent(
    new OnPointerDown(
      e => {
        seconddialog.run();
      },
      {
        button: ActionButton.PRIMARY,
        showFeeback: true,
        hoverText: "Speak to Old Man Rivers"
      }
    )
  );

}

function spawnLoot() {
  const fantasyChest = new Entity("fantasyChest");
  engine.addEntity(fantasyChest);
  const transform3 = new Transform({
    position: new Vector3(6, 0, 6.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  });
  fantasyChest.addComponentOrReplace(transform3);

  const fantasyIronKey = new Entity("fantasyIronKey");
  engine.addEntity(fantasyIronKey);
  const transform4 = new Transform({
    position: new Vector3(6, 0.4, 7.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  });
  fantasyIronKey.addComponentOrReplace(transform4);

  const scroll = new Entity("scroll");
  engine.addEntity(scroll);
  const transform5 = new Transform({
    position: new Vector3(6.5, 0.2, 6.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  });
  scroll.addComponentOrReplace(transform5);

  const oldIronSword = new Entity("oldIronSword");
  engine.addEntity(oldIronSword);
  oldIronSword.setParent(baseScene);
  const transform6 = new Transform({
    position: new Vector3(6, 0.3, 6.5),
    rotation: new Quaternion(
      -7.781870092739773e-16,
      0.7071068286895752,
      -8.429368136830817e-8,
      -0.7071068286895752
    ),
    scale: new Vector3(1.000008225440979, 1, 0.5000041127204895)
  });
  oldIronSword.addComponentOrReplace(transform6);
  

  const channelId = Math.random()
    .toString(16)
    .slice(2);
  const channelBus = new MessageBus();
  const inventory = createInventory(UICanvas, UIContainerStack, UIImage);
  const options = { inventory };

  const script1 = new Script1();
  const script2 = new Script2();
  const script3 = new Script3();
  const script4 = new Script4();
  script1.init();
  script2.init(options);
  script3.init();
  script4.init(options);

  script1.spawn(
    fantasyChest,
    { onClickText: "Use the Key", onClick: [], onOpen: [], onClose: [] },
    createChannel(channelId, fantasyChest, channelBus)
  );

  script2.spawn(
    fantasyIronKey,
    {
      target: "fantasyChest",
      respawns: false,
      onEquip: [],
      onUse: [{ entityName: "fantasyChest", actionId: "toggle", values: {} }]
    },
    createChannel(channelId, fantasyIronKey, channelBus)
  );


  script3.spawn(
    scroll,
    { "text": "You have received Scroll of Weak Fireball", "fontSize": 24 },
    createChannel(channelId, scroll, channelBus)
  );

  script4.spawn(
    oldIronSword,
    {
      target: "fantasyChest",
      respawns: false,
      onEquip: [],
      onUse: [{entityName: "fantasyChest", actionId: "toggle", values: {}}]
    },
    createChannel(channelId, oldIronSword, channelBus)
  )
}


const leaves = spawnEntity(16,0,0,  0,0,0,  1,1,1)
leaves.addComponentOrReplace(resources.models.animatedleaves)

//const hud: BuilderHUD = new BuilderHUD();
//hud.attachToEntity(leaves)