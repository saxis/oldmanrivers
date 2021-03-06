import { BaseScene } from "./gameObjects/baseScene";
import resources from "./resources";
import { PeasantDialog, SecondDialog, NpcWinDialog } from "./ui/index";
import { Npc } from "./gameObjects/npc";
import { WaitSystem } from "./gameObjects/waitSystem";
import { DerpData } from "./gameObjects/lerpData";
import { Walk } from "./gameObjects/riversWalk";
import { Battle } from "./gameObjects/battle";
import { Player } from "./gameObjects/player";
import { HpCounter } from "./gameObjects/hpCounter";
import { Orc } from "./gameObjects/orc";
import { OrcBattle } from "./gameObjects/orcbattle";

new BaseScene();

let clicked = false;
const TURN_TIME = 0.3;
const PUNCH_TIME = 2.2;


const gameCanvas = new UICanvas();
const oldManCounter = new HpCounter(gameCanvas,resources.textures.hpCounter,'npc')

const player = new Player(40,gameCanvas)
//const playerHpBar = new HpCounter(gameCanvas, resources.textures.playerCounter,'player')
//playerHpBar.show()

const rect = new UIContainerRect(gameCanvas)
rect.width = "13.75%"
rect.height = "6.25%"
rect.vAlign = "center"
rect.hAlign = "right"
rect.positionY = 180;
rect.color = Color4.Gray();
rect.opacity = 0.7

rect.visible = true;
player.showhpbar();

const seconddialog = new SecondDialog(gameCanvas);
seconddialog.onSecondDialogStarted = () => {
  oldmanrivers.talk.play();
  oldmanrivers.getComponent(OnPointerDown).showFeedback = false;
}
seconddialog.onSecondDialogEnded = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = true 
seconddialog.onSecondSequenceComplete = () => {
  log("in onSecondSequenceComplete")
  log("load a new click event now. New story or something")
}

const npcwindialog = new NpcWinDialog(gameCanvas);
npcwindialog.onSecondDialogStarted = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = false;
npcwindialog.onSecondDialogEnded = () => oldmanrivers.getComponent(OnPointerDown).showFeedback = true 
npcwindialog.onSecondSequenceComplete = () => {
  log("in npcwin onSecondSequenceComplete")
  log("load a new click event now. New story or something")
}

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
}

dialog.npcWon = () => {
  oldmanrivers.addComponentOrReplace(
    new OnPointerDown(
      e => {
        npcwindialog.run();
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Apologize to Old Man Rivers",
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

const orcgrunt1 = new Orc(
  resources.sounds.peasantunlock,
  resources.models.orcgrunt,
  5,
  new Vector3(10, 0, -10),
  Quaternion.Euler(0, -90, 0),
  gameCanvas
)

const orcgrunt2 = new Orc(
  resources.sounds.peasantunlock,
  resources.models.orcgrunt,
  7,
  new Vector3(9, 0, -8),
  Quaternion.Euler(180, -20, 180),
  gameCanvas
)

const orcgrunt3 = new Orc(
  resources.sounds.peasantunlock,
  resources.models.orcgrunt,
  7,
  new Vector3(7, 0, -9),
  Quaternion.Euler(-180, 60, -180),
  gameCanvas
)



const oldmanrivers = new Npc(
  resources.sounds.peasantunlock,
  resources.models.paladin,
  20,
  new Vector3(12, 0, 5),
  Quaternion.Euler(0, 0, 0),
  gameCanvas
);
oldmanrivers.addComponent(
  new OnPointerDown(
    e => {
      oldManCounter.show()
      rect.visible = true;
      oldmanrivers.showhpbar();
      player.showhpbar();
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
engine.addSystem(new Walk(oldmanrivers, TURN_TIME));
engine.addSystem(new WaitSystem());
engine.addSystem(new Battle(gameCanvas, player,oldmanrivers,TURN_TIME, clicked, PUNCH_TIME, dialog))
engine.addSystem(new OrcBattle(gameCanvas,player,orcgrunt1, new Vector3(10, 0, -10), Quaternion.Euler(0, -90, 0), clicked, PUNCH_TIME, dialog))
engine.addSystem(new OrcBattle(gameCanvas,player,orcgrunt2, new Vector3(9, 0, -8),Quaternion.Euler(180, -20, 180), clicked, PUNCH_TIME, dialog))
engine.addSystem(new OrcBattle(gameCanvas,player,orcgrunt3, new Vector3(7, 0, -9),Quaternion.Euler(-180, 60, -180), clicked, PUNCH_TIME, dialog))

oldmanrivers.walking.play()

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