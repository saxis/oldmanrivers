import { BaseScene } from "./gameObjects/baseScene";
import resources from "./resources";
import { PeasantDialog, SecondDialog } from "./ui/index";
import { Npc } from "./gameObjects/npc";
import { spawnEntity } from "./modules/SpawnerFunctions";
//import { TimeOut } from "./components/timeout";
import { WaitSystem } from "./gameObjects/waitSystem";
import { DerpData } from "./gameObjects/lerpData";
import { Walk } from "./gameObjects/riversWalk";
import { Battle } from "./gameObjects/battle";
import { SoundBox } from "./components/soundbox";

new BaseScene();

let clicked = false;
let dead = false;
let HIT_POINTS = 50;
let PLAYER_HP = 15;
let battle = true;

const gameCanvas = new UICanvas();
const text = new UIText(gameCanvas);

text.value = `HP: ${PLAYER_HP}    Brute HP: ${HIT_POINTS}`;
text.vAlign = "bottom";
text.positionX = -80;
text.visible = true;

const oldManCounter = new UIImage(gameCanvas, resources.textures.hpCounter)

oldManCounter.positionX = -600;
oldManCounter.positionY = 150;
oldManCounter.visible = true;

const dialog = new PeasantDialog(gameCanvas);
dialog.onDialogStarted = () => oldmanrivers.getComponent(OnPointerDown).showFeeback = false;
dialog.onDialogEnded = () => oldmanrivers.getComponent(OnPointerDown).showFeeback = true;

const seconddialog = new SecondDialog(gameCanvas)

const point1 = new Vector3(12, 0, 5);
const point2 = new Vector3(13, 0, 14);
const point3 = new Vector3(3, 0, 14);
const point4 = new Vector3(2, 0, 3);

function showHealthBar() {
  oldManCounter.visible = true;
}

const oldmanrivers = new Npc(
  resources.sounds.peasantunlock,
  resources.models.paladin,
  5,
  point1
);
oldmanrivers.addComponent(
  new OnPointerDown(
    e => {
      showHealthBar();
      dialog.run();
    },
    {
      button: ActionButton.PRIMARY,
      showFeeback: true,
      hoverText: "Speak to Old Man Rivers"
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
engine.addSystem(new Battle(oldmanrivers,TURN_TIME, oldmanrivers.riversWalkClip, oldmanrivers.talkingClip, oldmanrivers.turnLClip, oldmanrivers.boxing, battle, clicked, PUNCH_TIME, PLAYER_HP))