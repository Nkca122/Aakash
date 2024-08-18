import { makeRestart } from "./buttons";
import { makeStart } from "./buttons";
export function makeAstronaut(k, map) {
    return k.make(
        [
            k.sprite("astronaut", {
                anim: "idle"
            }),
            k.scale(4),
            k.pos(k.center().x, k.height() - 20 - 16 * 2),
            k.area({ shape: new k.Rect(k.vec2(0, 0), 10, 16) }),
            k.body(),
            k.anchor("center"),
            k.opacity(1),
            k.z(6),
            {
                isDead: false,
                speed: 100,
                inputControllers: [],
                dir: null,
                curTweenX: null,
                curTweenY: null,
                curTweenRot: null,
                planted: false,
                text: null,
                progress: 0,
                isDigging: false,
                isFloating: false,
                dest: k.vec2(k.center().x, k.height() - 20 - 16 * 2),
                won: false,
                setControls() {
                    const moveLogicX = () => {
                        if (this.curTweenX) this.curTweenX.cancel()
                        this.curTweenX = k.tween(
                            this.pos,
                            k.vec2(this.pos.x + this.speed * this.dir, this.pos.y),
                            0.5,
                            (p) => {
                                this.scale.x = this.dir * 4 * (this.angle > 0 ? -1 : 1)
                                if (this.curAnim() != "run") this.play("run");
                                if (this.dir == 1) {
                                    this.pos.x = Math.min(p.x, k.width() - 64)
                                } else {
                                    this.pos.x = Math.max(p.x, 64)
                                }
                            },
                            k.easings.linear
                        );
                    }

                    const moveLogicY = () => {
                        if (this.curTweenY) this.curTweenY.cancel();
                        this.curTweenY = k.tween(
                            this.pos.y,
                            this.dest.y,
                            3,
                            (p) => {
                                if (this.pos.y != this.dest.y) {
                                    this.pos.y = p;
                                    k.camPos(k.center().x, p);
                                } else {
                                    this.isFloating = false;
                                }

                            },
                            k.easings.linear
                        );


                    }


                    this.inputControllers.push(
                        k.onKeyDown("d", () => {
                            this.dir = 1
                            moveLogicX()
                        })
                    );

                    this.inputControllers.push(
                        k.onKeyDown("a", () => {
                            this.dir = -1
                            moveLogicX()
                        })
                    );

                    this.inputControllers.push(
                        k.onKeyPress("w", () => {
                            if (!this.isFloating) {
                                if (this.pos.y >= 668) {
                                    this.dest.y = 48;
                                    this.isFloating = true;
                                    if (this.curTweenRot) this.curTweenRot.cancel();
                                    this.curTweenRot = k.tween(
                                        0,
                                        180,
                                        3,
                                        (a) => {
                                            this.angle = a
                                        },
                                        k.easings.linear
                                    )
                                } else if (this.pos.y <= 48) {
                                    this.dest.y = 668;
                                    this.isFloating = true;
                                    if (this.curTweenRot) this.curTweenRot.cancel();
                                    this.curTweenRot = k.tween(
                                        180,
                                        0,
                                        3,
                                        (a) => {
                                            this.angle = a
                                        },
                                        k.easings.linear
                                    )
                                }
                                moveLogicY();
                            }
                        })
                    );

                    this.inputControllers.push(
                        k.onKeyRelease(["d", "a"], () => {
                            if (this.curTweenX) this.curTweenX.cancel();
                            if (this.curAnim() != "idle") {
                                this.play("idle");
                            }
                        })
                    )

                },

                disableControls() {
                    this.inputControllers.forEach(input => {
                        input.cancel();
                    });
                },

                death(pos) {
                    if (this.isDead) {
                        this.disableControls();
                        if (this.curTweenX) this.curTweenX.cancel();
                        if (this.curTweenRot) this.curTweenRot.cancel();
                        if (this.curTweenY) this.curTweenY.cancel();
                        this.destroy();
                        const explosion = k.add(
                            [
                                k.sprite("explosion", {
                                    anim: "explode"
                                }),
                                k.anchor("center"),
                                k.pos(pos.x, pos.y),
                                k.scale(4),
                            ]
                        );

                        k.wait(2, () => {
                            if (explosion.curAnim() != "explode") {
                                const restart = k.add(
                                    makeRestart(k),
                                );
                                const start = k.add(
                                    makeStart(k)
                                );
                                restart.onClick(() => {
                                    k.go("main2");
                                });
                                start.onClick(() => {
                                    k.go("start");
                                })
                            }
                        })

                    }
                },

                victory() {
                    this.won = true
                    this.scale = k.vec2(4)
                    this.disableControls();
                    if (this.curTweenX) this.curTweenX.cancel();
                    if (this.curTweenY) this.curTweenY.cancel();
                    if (this.curTweenRot) this.curTweenRot.cancel();
                    if(this.curAnim() != "run") this.play("run");
                    this.add(
                        [
                            k.sprite("exhaust", {
                                anim: "burn"
                            }),
                            k.scale(0.25),
                            k.anchor("center"),
                            k.pos(-10, 0),
                            k.rotate(180)
                        ]
                    )



                    this.curTweenRot = k.tween(
                        this.angle,
                        0,
                        4,
                        (a) => {
                            this.angle = a;
                        },
                        k.easings.linear
                    );

                    this.curTweenX = k.tween(
                        this.pos.x,
                        (k.center().x + k.width()) * 3 / 4 + 10,
                        4,
                        (p) => {
                            this.pos.x = p;
                        },
                        k.easings.linear
                    );

                    this.curTweenY = k.tween(
                        this.pos.y,
                        k.center().y,
                        4,
                        (p) => {
                            this.pos.y = p;
                        },
                        k.easings.linear
                    );

                    k.wait(4, () => {
                        this.destroy();
                    })



                }
            },

            "astronaut"



        ]
    )
}