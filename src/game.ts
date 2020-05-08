import { BaseScene } from "./gameObjects/baseScene";
import resources from "./resources";
import { PeasantDialog, SecondDialog } from "./ui/index";
import { Npc } from "./gameObjects/npc";
import { spawnEntity } from "./modules/SpawnerFunctions";
import { WaitSystem } from "./gameObjects/waitSystem";
import { DerpData } from "./gameObjects/lerpData";
import { Walk } from "./gameObjects/riversWalk";
import { Battle } from "./gameObjects/battle";
import { Player } from "./gameObjects/player";

new BaseScene();

let clicked = false;
let dead = false;
let HIT_POINTS = 50;
let PLAYER_HP = 15;
let battle = true;

const player = new Player(5)

const gameCanvas = new UICanvas();

const oldManCounter = new UIImage(gameCanvas, resources.textures.hpCounter)
oldManCounter.hAlign = 'left';
oldManCounter.vAlign = 'top';
oldManCounter.height = 20;
oldManCounter.positionY = -200;
oldManCounter.paddingLeft = 20;
oldManCounter.visible = true;

const dialog = new PeasantDialog(gameCanvas);
dialog.onDialogStarted = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = false;
dialog.onDialogEnded = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = true;

const seconddialog = new SecondDialog(gameCanvas)

const point1 = new Vector3(12, 0, 5);
const point2 = new Vector3(13, 0, 14);
const point3 = new Vector3(3, 0, 14);
const point4 = new Vector3(2, 0, 3);

// function showHealthBar() {
//   oldManCounter.visible = true;
// }

const oldmanrivers = new Npc(
  resources.sounds.peasantunlock,
  resources.models.paladin,
  5,
  point1
);
oldmanrivers.addComponent(
  new OnPointerDown(
    e => {
      //showHealthBar();
      dialog.run();
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: "Speak to Old Man Rivers",
      showFeedback:true
    }
  )
);

const path: Vector3[] = [point1, point2, point3, point4];
const TURN_TIME = 0.3;
const PUNCH_TIME = 2.2;

const lantern = spawnEntity(5.6,2.2,8.82,  0,-90,0,  1,1,1)
lantern.addComponentOrReplace(resources.models.lantern)
lantern.addComponent(new AudioSource(resources.sounds.lava))

oldmanrivers.addComponent(new DerpData(path));

oldmanrivers.riversWalkClip.play()

engine.addSystem(new Walk(oldmanrivers, TURN_TIME, oldmanrivers.riversWalkClip, oldmanrivers.turnLClip));
engine.addSystem(new WaitSystem());
engine.addSystem(new Battle(player,oldmanrivers,TURN_TIME, oldmanrivers.riversWalkClip, oldmanrivers.talkingClip, oldmanrivers.turnLClip, oldmanrivers.boxing, battle, clicked, PUNCH_TIME, PLAYER_HP))