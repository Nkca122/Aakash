import { makeRestart } from "./buttons";
import { makeStart } from "./buttons";
export function makePlayer(k) {
    return k.make([
        k.sprite("spaceship"),
        k.pos(k.center().x - k.width() - 90, k.center().y),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 20) }),
        k.rotate(),
        k.anchor("center"),
        k.scale(2),
        k.body(),
        k.opacity(10),
        k.z(2),
        {
            isDead: false,
            won: false,
            speed: 2,
            down: false,
            up: false,
            inputControllers: [],
            exhaustInit() {
                this.add([
                    k.sprite("exhaust", {
                        anim: "burn"
                    }),
                    k.pos(-45, 0),
                    k.anchor("center"),
                    k.scale(k.vec2(-1, 1))
                ])
            },
            curTweenY: null,
            curTweenX: null,
            curTweenRot: null,

            dest: k.vec2(k.center().x + k.width(), k.center().y),
            rotation: null,

            setControls() {
                this.exhaustInit();
                const rotateLogic = () => {
                    if (this.curTweenRot) this.curTweenRot.cancel();
                    this.rotation = this.up ? -20 : this.down ? 20 : 0;
                    this.curTweenRot = k.tween(
                        this.angle,
                        this.rotation,
                        this.speed / 2,
                        (a) => {
                            this.angle = a
                        },
                        k.easings.linear
                    );

                }

                const moveLogicY = () => {
                    if (this.curTweenY) this.curTweenY.cancel();
                    this.curTweenY = k.tween(
                        this.pos.y,
                        this.dest.y,
                        this.speed,
                        (p) => {
                            this.pos.y = p;
                        },
                        k.easings.linear
                    );
                };

                const moveLogicX = () => {
                    if (this.curTweenX) this.curTweenX.cancel();
                    this.curTweenX = k.tween(
                        this.pos.x,
                        this.dest.x * (3/4),
                        30,
                        (p) => {
                            this.pos.x = p;
                            k.camPos(k.center().x, this.pos.y);
                        },
                        k.easings.linear
                    );
                };

                moveLogicX();

                this.inputControllers.push(
                    k.onKeyPress("s", () => {
                        if (!this.down) {
                            this.dir = 1;
                            this.down = true;
                            this.up = false;
                            this.dest.y = k.height() + 64;
                            moveLogicY();
                        }
                    })
                );

                this.inputControllers.push(
                    k.onKeyPress("w", () => {
                        if (!this.up) {
                            this.dir = -1;
                            this.down = false;
                            this.up = true;
                            this.dest.y = -64;
                            moveLogicY();

                        }
                    })
                )

                this.onUpdate(rotateLogic);

            },

            victory() {
                this.won = true;
                if (this.curTweenX) this.curTweenX.cancel();
                if (this.curTweenRot) this.curTweenRot.cancel();
                if (this.curTweenY) this.curTweenY.cancel();
                this.disableControls();
                this.dest.x = k.center().x + k.width() + 135;
                this.dest.y = k.center().y;
                this.rotation = 0;

                if (!this.curTweenCamPos) {
                    this.curTweenCamPos = k.tween(
                        k.vec2(k.center().x, this.pos.y),
                        k.center(),
                        3,
                        (p) => {
                            k.camPos(p)
                        },
                        k.easings.linear
                    )
                }



                this.curTweenRot = k.tween(
                    this.angle,
                    this.rotation,
                    3,
                    (a) => {
                        this.angle = a
                    },
                    k.easings.linear
                );

                this.curTweenX = k.tween(
                    this.pos.x,
                    this.dest.x,
                    5,
                    (p) => {
                        if (this.pos.x >= k.width() + k.center().x + 135) {
                            k.go("main2");
                        } else {
                            this.pos.x = p;
                        }
                    },
                    k.easings.linear
                );

                this.curTweenY = k.tween(
                    this.pos.y,
                    this.dest.y,
                    3,
                    (p) => {
                        this.pos.y = p;

                    },
                    k.easings.linear
                );
            },

            death(pos) {
                if (this.isDead) {
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
                                k.go("main");
                            });
                            start.onClick(() => {
                                k.go("start");
                            })
                        }
                    })


                }
            },

            disableControls() {
                if (this.curTween) this.curTween.cancel();
                this.inputControllers.forEach(input => {
                    input.cancel();
                });

                this.up = false;
                this.down = false;
            }
        }
    ])
}