import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { spawnEntity } from "../modules/SpawnerFunctions";

export class BaseScene extends Entity {
  constructor() {
    super();
    engine.addEntity(this);
    const staticObjects = new Entity();
    staticObjects.setParent(this);
    const gltfShape = resources.models.staticobjects;
    staticObjects.addComponentOrReplace(gltfShape);
    const transform_2 = new Transform({
      position: new Vector3(16, 0, 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    staticObjects.addComponentOrReplace(transform_2);
    engine.addEntity(staticObjects);

    const grassblades = new Entity("grassblades");
    const grassBladesShape = resources.models.grassblades;
    const grassBladesLoc = new Transform({
      position: new Vector3(16, 0, 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    grassblades.addComponentOrReplace(grassBladesLoc);
    grassblades.addComponentOrReplace(grassBladesShape);
    engine.addEntity(grassblades);

    const grassblades2 = new Entity("grassblades2");
    const grassBlades2Loc = new Transform({
      position: new Vector3(16, 0, -16),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    grassblades2.addComponentOrReplace(grassBlades2Loc);
    grassblades2.addComponentOrReplace(grassBladesShape);
    engine.addEntity(grassblades2);

    const grassBase = new Entity("grass");
    const grassBase2 = new Entity("grass2");
    const grassShape = new GLTFShape(
      "models/FloorBaseGrass_01/FloorBaseGrass_01.glb"
    );
    grassBase.addComponentOrReplace(grassShape);
    grassBase2.addComponentOrReplace(grassShape);
    const grassLoc = new Transform({
      position: new Vector3(8, 0, 8),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    const grassLoc2 = new Transform({
      position: new Vector3(8, 0, -8),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    grassBase.addComponentOrReplace(grassLoc);
    grassBase2.addComponentOrReplace(grassLoc2);
    engine.addEntity(grassBase);
    engine.addEntity(grassBase2);
    grassBase.addComponent(new AudioSource(resources.sounds.birdsong));
    grassBase.getComponent(AudioSource).playOnce();

    const leaves = spawnEntity(16,0,0,  0,0,0,  1,1,1)
leaves.addComponentOrReplace(resources.models.animatedleaves)

// const soundbox3 = new Entity();
// soundbox3.addComponent(new Transform());
// soundbox3.getComponent(Transform).position.set(7,1,8);
// soundbox3.addComponent(new AudioSource(resources.sounds.playerHit2));
// engine.addEntity(soundbox3);


    
  }
}
