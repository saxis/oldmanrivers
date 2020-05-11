import { BaseScene } from "./gameObjects/baseScene";
import resources from "./resources";
import { PeasantDialog, SecondDialog } from "./ui/index";
import { Npc } from "./gameObjects/npc";
import { WaitSystem } from "./gameObjects/waitSystem";
import { DerpData } from "./gameObjects/lerpData";
import { Walk } from "./gameObjects/riversWalk";
import { Battle } from "./gameObjects/battle";
import { Player } from "./gameObjects/player";
import { HpCounter } from "./gameObjects/hpCounter";

new BaseScene();

let clicked = false;
//let PLAYER_HP = 15;
//let battle = true;
const TURN_TIME = 0.3;
const PUNCH_TIME = 2.2;


const gameCanvas = new UICanvas();
const oldManCounter = new HpCounter(gameCanvas,resources.textures.hpCounter,'npc')
const player = new Player(25,gameCanvas)
const playerHpBar = new HpCounter(gameCanvas, resources.textures.playerCounter,'player')
//playerHpBar.show()

const seconddialog = new SecondDialog(gameCanvas);
seconddialog.onSecondDialogStarted = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = false;
seconddialog.onSecondDialogStarted = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = true 

const dialog = new PeasantDialog(gameCanvas);
dialog.onDialogStarted = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = false;
dialog.onDialogEnded = () => {
  oldManCounter.hide()
  oldmanrivers.getComponent(OnPointerDown).showFeedback = true
}
dialog.onSequenceComplete = () => {
  log("in onSequenceCompleted");
}
dialog.onPoorChoiceMade = () => {
  oldmanrivers.battle = true;
  oldmanrivers.showhpbar();
  player.showhpbar();
}

dialog.npcWon = () => {
  oldmanrivers.addComponentOrReplace(
    new OnPointerDown(
      e => {
        seconddialog.run();
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Talk to Old Man Rivers",
        showFeedback:true
      }
    )
  );
}

dialog.playerWon = () => {
  oldmanrivers.addComponentOrReplace(
    new OnPointerDown(
      e => {
        seconddialog.run();
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Talk to Old Man Rivers",
        showFeedback:true
      }
    )
  );
}

const oldmanrivers = new Npc(
  resources.sounds.peasantunlock,
  resources.models.paladin,
  25,
  new Vector3(12, 0, 5),
  gameCanvas
);
oldmanrivers.addComponent(
  new OnPointerDown(
    e => {
      oldManCounter.show()
      //playerHpBar.show()
      dialog.run();
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: "Speak to Old Man Rivers",
      showFeedback:true
    }
  )
);

oldmanrivers.addComponentOrReplace(new DerpData([new Vector3(12, 0, 5),new Vector3(13, 0, 14),new Vector3(3, 0, 14), new Vector3(2, 0, 3)]))
engine.addSystem(new Walk(oldmanrivers, TURN_TIME, oldmanrivers.riversWalkClip, oldmanrivers.turnLClip));
engine.addSystem(new WaitSystem());
engine.addSystem(new Battle(player,oldmanrivers,TURN_TIME, oldmanrivers.riversWalkClip, oldmanrivers.talkingClip, oldmanrivers.turnLClip, oldmanrivers.boxing, oldmanrivers.hit, oldmanrivers.death, clicked, PUNCH_TIME, dialog))

oldmanrivers.riversWalkClip.play()

export function secondRound() {
  log('in secondRound')
  const seconddialog = new SecondDialog(gameCanvas)
  oldmanrivers.addComponentOrReplace(
    new OnPointerDown(
      e => {
        seconddialog.run();
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Chat",
        showFeedback:true
      }
    )
  );
}