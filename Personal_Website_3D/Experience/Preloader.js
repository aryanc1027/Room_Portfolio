import { EventEmitter } from "events";
import Experience from "./Experience.js";

export default class Preloader extends EventEmitter{
    constructor() {
        super()

        this.experience = new Experience();
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.world = this.experience.world;

        this.world.on("worldready", () => {
            this.playIntro();
        });
    }

    playIntro() {

    }







}