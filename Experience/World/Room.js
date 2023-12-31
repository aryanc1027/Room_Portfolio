import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.room = this.resources.items.room
        this.actualRoom = this.room.scene
        this.roomChildren = {}

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel()
        this.setAnimation()
        this.onMouseMove()
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true
            child.receiveShadow = true

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true
                    groupchild.receiveShadow = true
                });
            }

            if (child.name === "Computer") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

            if (child.name === "Mini_Floor") {
                child.position.x = -.289521
                child.position.z = 8.83572
            }
            //6: 18: 47

            if(child.name === "Light" ||
                child.name === "CarpetBig" ||
                child.name === "CarpetSmall1" ||
                child.name === "CarpetSmall2" ||
                child.name === "PlantFront") {

                child.scale.set(0,0,0)
            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 0.5;
        const height = 0.7;
        const intensity = 10;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        rectLight.position.set(-3, 10, 5)
        rectLight.rotation.x = -Math.PI / 2
        rectLight.rotation.z = Math.PI / 4
        this.actualRoom.add(rectLight)

        this.roomChildren["rectLight"] = rectLight

        //const helper = new RectAreaLightHelper(rectLight)
        //this.actualRoom.add(helper)
        this.scene.add(this.actualRoom)
        this.actualRoom.scale.set(0.11, 0.11, 0.11)
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.05;
        });
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current

        this.mixer.update(this.time.delta * 0.0009)
    }
}
