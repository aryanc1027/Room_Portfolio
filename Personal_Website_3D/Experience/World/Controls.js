import * as THREE from "three";
import Experience from "../Experience.js"
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ASScroll from '@ashthornton/asscroll';

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.room = this.experience.world.room.actualRoom
        this.room.children.forEach(child => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;
        GSAP.registerPlugin(ScrollTrigger)

        document.querySelector(".page").style.overflow = "visible";

        this.setSmoothScroll();
        this.setScrollTrigger();

    }

    setupASScroll() {
        const asscroll = new ASScroll({
            disableRaf: true,
            ease: .1,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight}
            },
            fixedMarkers: true
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]")
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();

    }

    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            //Desk
            "(min-width: 969px)": () => {
                this.room.scale.set(.11, .11, .11);
                this.rectLight.width = .5;
                this.rectLight.height = .7;
                //First
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });
                this.firstMoveTimeline.fromTo(
                    this.room.position,
                    {x: 0, y: 0, z: 0},
                    {
                        x: () => {
                            return this.sizes.width * 0.0014
                        },
                    })

                //Second ------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });
                this.secondMoveTimeline.to(this.room.position, {
                        x: () => {
                            return 1;
                        },
                        z: () => {
                            return this.sizes.height * 0.0032;
                        },
                    },
                    "same"
                );
                this.secondMoveTimeline.to(this.room.scale, {
                        x: 0.4,
                        y: 0.4,
                        z: 0.4,
                    },
                    "same"
                );
                this.secondMoveTimeline.to(this.rectLight, {
                        width: .5 * 4,
                        height: .7 * 4,

                    },
                    "same"
                );

                //Third--------------------------------------------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: .6,
                        invalidateOnRefresh: true,
                    },
                });
                this.thirdMoveTimeline.to(this.camera.orthographicCamera.position, {
                    y: 1.5,
                    x: -4.1,
                });
            },

            //Mobile
            "(max-width: 968px)": () => {
                //Resets
                this.room.scale.set(0.07, 0.07, 0.07);
                this.room.position.set(0, 0, 0)
                this.rectLight.width = 0.3
                this.rectLight.height = 0.4
                this.camera.orthographicCamera.position.set(0, 6.5, 10)
                //First
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });

                this.firstMoveTimeline.to(this.room.scale, {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1
                }, "same");

                //Second
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: .25,
                    y: .25,
                    z: .25,
                }, "same").to(this.rectLight, {
                    width: .3 * 3.4,
                    height: .4 * 3.4,
                }, "same").to(this.room.position, {
                    x: 1.5,
                }, "same");
                //Third
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position, {
                    z: -4.5,

                });
            },

            all: () => {
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach(section => {
                    this.progressWrapper = section.querySelector(".progress-wrapper");
                    this.progressBar = section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    })
                });

                //All animations
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3
                })
                //Second ------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleSecond.scale, {
                    x: 3,
                    y: 3,
                    z: 3
                }, "same").to(this.room.position, {
                    y: 0.7,
                }, "same");
                //Third--------------------------------------------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: .6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3
                });
                //Platform Stuff--------------------------------------
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    },
                });

                this.room.children.forEach(child => {
                    if(child.name === "Mini_Floor"){
                        this.first = GSAP.to(child.position, {
                            x: -5.44055 ,
                            z: 13.6135,
                            duration: 0.3
                        })
                    }
                    if(child.name === "Light"){  //The Light
                        this.second = GSAP.to(child.scale, {
                            x: 2,
                            y: 1,
                            z: 4,
                            duration: 0.3,
                        })
                    }
                    if(child.name === "CarpetBig"){
                        this.fifth = GSAP.to(child.scale, {
                            x: 2,
                            y: 1,
                            z: 4,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                    if(child.name === "CarpetSmall1"){
                        this.forth = GSAP.to(child.scale, {
                            x: 1.5,
                            y: .75,
                            z: 3,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                    if(child.name === "CarpetSmall2"){
                        this.third = GSAP.to(child.scale, {
                            x: 1.5,
                            y: .75,
                            z: 3,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                    if(child.name === "PlantFront"){
                        this.sixth = GSAP.to(child.scale, {
                            x: 2,
                            y: 1,
                            z: 4,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }

                });
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third);
                this.secondPartTimeline.add(this.forth);
                this.secondPartTimeline.add(this.fifth);
                this.secondPartTimeline.add(this.sixth);

            },

        });
    }

    resize() {
    }

    update() {
    }
}

