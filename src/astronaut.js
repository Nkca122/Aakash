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
            {
                isDead: false,
                speed: 100,
                inputControllers: [],
                dir: null,
                curTweenX: null,
                curTweenY: null,
                planted: false,
                text: null,
                progress: 0,
                isDigging: false,
                isFloating: false,
                dest: k.vec2(k.center().x, k.height() - 20 - 16 * 2),
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
                                if(this.pos.y != this.dest.y){
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
                        k.onKeyPress(["w", "space"], () => {
                            if (!this.isFloating) {
                                if (this.pos.y >= 668) {
                                    this.dest.y = 16;
                                    this.angle = 180;
                                    this.isFloating = true;
                                } else if (this.pos.y <= 48) {
                                    this.dest.y = k.height() - 16;
                                    this.isFloating = true;
                                    this.angle = 0;
                                }
                                moveLogicY();
                            }
                        })
                    );

                    this.inputControllers.push(
                        k.onKeyPress("f", () => {
                            if (this.pos.x >= 128 + 80 && this.pos.x <= k.width() - 128 - 80 && !this.planted) {
                                k.add(
                                    [
                                        k.sprite("flag", {
                                            anim: "wave"
                                        }),
                                        k.pos(k.vec2(this.pos.x + (!this.dir ? 1 : this.dir) * 20, k.height() - 40 - 16)),
                                        k.anchor("center"),
                                        k.scale(4)

                                    ]
                                )
                                this.planted = true;
                            }

                        })
                    );

                    this.inputControllers.push(
                        k.onKeyPress("e", () => {
                            if (this.pos.x <= k.width() && this.pos.x >= k.width() - 128 - 34 && !this.isDigging && this.progress < 100) {
                                this.isDigging = true;
                                this.play("fix");
                                if (!this.text) {
                                    this.text = this.add(
                                        [
                                            k.text("Digging...", { size: 6 }),
                                            k.pos(k.vec2(0, -10)),
                                            k.anchor("center"),
                                            k.scale(1),
                                            "status"
                                        ]
                                    )
                                }
                                k.wait(2, () => {
                                    this.progress += 10;
                                    this.play("idle");
                                    if (this.text) {
                                        this.text.destroy();
                                    }
                                    this.text = null;
                                    this.isDigging = false;
                                })
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
                }
            },



        ]
    )
}