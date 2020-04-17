import resources from "../resources";

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
    grassBase.addComponent(new AudioSource(resources.sounds.grobb));
    grassBase.getComponent(AudioSource).playOnce();

    const grassblades = new Entity("grassblades")
    const grassBladesShape = resources.models.grassblades;
    const grassBladesLoc = new Transform({
      position: new Vector3(16, 0, 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    grassblades.addComponentOrReplace(grassBladesLoc);
    grassblades.addComponentOrReplace(grassBladesShape)
    engine.addEntity(grassblades);



    
  }
}
