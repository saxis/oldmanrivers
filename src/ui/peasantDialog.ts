import resources from "../resources";
import { SimpleDialog } from "../modules/simpleDialog";
//import { DoorState } from "../gameObjects/doorState";
import utils from "../../node_modules/decentraland-ecs-utils/index";

function selectRandom(options: string[]): string {
  return options[Math.floor(Math.random() * (options.length - 1))];
}

export class PeasantDialog extends SimpleDialog {
  private dialogTree: SimpleDialog.DialogTree;

  public onCorrectAnswer: (questionId: number) => void;
  public onSequenceComplete: () => void;
  public onPoorChoiceMade: () => void;

  constructor(gameCanvas: UICanvas) {
    // Create a new SimpleDialog to manage the dialog tree
    super({
      canvas: gameCanvas,
      leftPortrait: {
        width: 256,
        height: 256,
        sourceWidth: 256,
        sourceHeight: 256,
        positionX: "-17%"
      },
      rightPortrait: {
        width: 256,
        height: 256,
        sourceWidth: 256,
        sourceHeight: 256,
        positionX: "15%"
      },
      dialogText: {
        width: "25%",
        height: "25%",
        textSpeed: 15,
        textIdleTime: 1,
        textConfig: { fontSize: 16, paddingLeft: 25, paddingRight: 25 },
        background: resources.textures.textContainer,
        backgroundConfig: { sourceWidth: 512, sourceHeight: 257 }
      },
      optionsContainer: {
        stackOrientation: UIStackOrientation.VERTICAL,
        spacing: 0,
        width: "40%",
        height: "12%",
        vAlign: "top",
        hAlign: "center",
        positionY: "-65%",
        background: resources.textures.optionsContainer,
        backgroundConfig: { sourceWidth: 512, sourceHeight: 79 },
        optionsTextConfig: { fontSize: 20, paddingLeft: 20, positionY: "-35%" }
      }
    });

    // Variables used in the dialog tree
    let firstTimeDialog = true;
    let unlockDoor = false;

    // Dialog text colors
    const npcColor = Color4.White();
    const playerColor = Color4.White();

    // const bottomFloorDoor = new Entity();
    // bottomFloorDoor.addComponentOrReplace(resources.models.woodenDoor);
    // const firstFloorDoorLoc = new Transform({
    //   position: new Vector3(20.25, 1.63, 19.42)
    // });
    // bottomFloorDoor.addComponentOrReplace(firstFloorDoorLoc);
    // bottomFloorDoor.addComponent(
    //   new AudioSource(resources.sounds.doorIsLocked)
    //   //new AudioSource(resources.sounds.peasantunlock)
    // );
    // engine.addEntity(bottomFloorDoor);

    // const bottomDoorPivot = new Entity();
    // bottomDoorPivot.addComponent(
    //   new Transform({
    //     //position: new Vector3(20.25, 1.6, 19.42)
    //     position: new Vector3(19.75, 1.6, 19.42)
    //     //position: new Vector3(19.71, 2, 19.42)
    //   })
    // );
    // bottomDoorPivot.addComponent(new DoorState());
    // engine.addEntity(bottomDoorPivot);
    // bottomFloorDoor.setParent(bottomDoorPivot);
    // bottomFloorDoor.addComponent(
    //   new OnClick(e => {
    //     bottomFloorDoor.getComponent(AudioSource).playOnce();
    //     if (unlockDoor) {
    //       // let state = bottomFloorDoor.getParent().getComponent(DoorState);
    //       // state.closed = !state.closed;
    //       //bottomFloorDoor.removeComponent(AudioSource);
    //     }
    //   })
    // );

    // const trigger = new Entity();
    // engine.addEntity(trigger);
    // trigger.addComponent(
    //   new Transform({
    //     position: new Vector3(20.255, 1.6, 21)
    //   })
    // );
    // trigger.addComponent(
    //   new utils.TriggerComponent(
    //     new utils.TriggerBoxShape(new Vector3(4.2, 3.8), Vector3.Zero()),
    //     //new utils.TriggerBoxShape(new Vector3(4.2, 3.8), Vector3.Zero()),
    //     0,
    //     0,
    //     null,
    //     null,
    //     (): void => {
    //       if (unlockDoor) {
    //         //engine.removeEntity(bottomFloorDoor);
    //       }
    //     },
    //     (): void => {
    //       if (unlockDoor) {
    //         //engine.addEntity(bottomFloorDoor);
    //       }
    //     }
    //   )
    // );

    this.dialogTree = new SimpleDialog.DialogTree()
      .if(() => firstTimeDialog)
        .call(() => (firstTimeDialog = false))
        .say(
          () =>
          "Old Man Rivers says, \"Hail traveler. Been some time since I've seen [visitors] around these parts. How can I help you? \"",
          { color: npcColor }
        )
          .beginOptionsGroup()
            .option(() => "What kind of visitors?")
              .say(() => 'You say, "What kind of visitors?"', { color: playerColor })
            .endOption()
          .endOptionsGroup()
        .say(
          () =>
          'Old Man Rivers says, "Adventurers like yourself. Anyway, I\'m relaxing since the incident with [Agatha]."',
          { color: npcColor }
        )
          .beginOptionsGroup()
            .option(() => "Who is Agatha?")
              .say(() => 'You say, "Who is Agatha? What are you talking about Old Man?"', {
                color: playerColor
              })
            .endOption()
          .endOptionsGroup()
        .say(
          () =>
          "Old Man Rivers says, \"Agatha is a mean old sorceress. A real piece or work. Me and the [council] had to imprison her.\"",
          { color: npcColor }
        )
          .beginOptionsGroup()
            .option(() => "Why did you have to do that?")
              .say(() => 'You say, "Why did you have to imprison her?"', { color: playerColor })
              .say(
                () =>
                'Old Man Rivers says, "Sometimes its the only choice lad. We did what we thought was best"',
                { color: npcColor }
              )
              .say(() => 
                'Old Man Rivers says, "She is out to the East if you want to get a good look at her."', { color: npcColor})
              .say(() => "Over by the magic castle where maybe the king can keep an eye on her", {color:npcColor})
              .say(() => "She may try to talk to you.. don't believe her lies", {color: npcColor})
              .call(() => this.onSequenceComplete())
            .endOption()
            .option(() => "Sometimes you have to do what you have to do")
              .say(() => "Sometimes you have to do what you have to do Old Man", {color: playerColor})
              .say(
                () =>
                'Old Man Rivers says, "Indeed. Fare thee well adventurer. Safe travels"',
                { color: npcColor }
              )
            .endOption()
          .endOptionsGroup()
      .else()
      .if(() => !unlockDoor)
      .say(() => 'Old Man Rivers says, "Did that old witch send you back herer?"')
      .beginOptionsGroup()
      .option(() => "She did. I want to free her, she said she would rewward me!")
        .say(() => 'You say, "She promised me some treasure. How do I get past the crystals Old Man?"', { color: playerColor })
        .say(
          () =>
          'Old Man Rivers says, "Its your funeral. "',
          { color: npcColor }
        )
        .say(() => "You will have to kill me to make me talk", {color: npcColor})
        .call(() =>  this.onPoorChoiceMade())
      .endOption()

      .option(() => "No just wanted to say hello again.")
      .say(
        () =>
          'Old Man Rivers says, "Ah. I understand. Good to see you as well adventurer"',
        { color: npcColor }
      )
      .endOption()
      .endOptionsGroup()
      .else()
      .say(() => 'Old Man Rivers says, "Hello adventurer."')
      .endif()
      .endif();
  }

  public run(): void {
    if (!this.isDialogTreeRunning()) {
      this.runDialogTree(this.dialogTree);
    }
  }
}
