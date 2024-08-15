import { makeRestart } from "./buttons";
import { makeStart } from "./buttons";
export function makePlayer(k) {
    return k.make([
        k.sprite("spaceship"),
        k.pos(64 * 2, k.center().y),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 20) }),
        k.rotate(),
        k.anchor("center"),
        k.scale(2),
        k.body(),
        k.z(4),
        {
            isDead: false,
            speed: 2,
            down: false,
            up: false,
            left: false,
            right: false,
            inputControllers: [],
            dir: null,
            exhaustInit() {
                return this.add([
                    k.sprite("exhaust", {
                        anim: "burn"
                    }),
                    k.pos(-45, 0),
                    k.anchor("center"),
                    k.scale(k.vec2(-1, 1))
                ])
            },
            exhaust: null,
            curTweenY: null,
            curTweenX: null,
            curTweenRot: null,

            dest: k.vec2(k.center().x, k.center().y),
            rotation: null,
            setControls() {
                this.exhaust = this.exhaustInit();
                const rotateLogic = () => {
                    if(this.curTweenRot) this.curTweenRot.cancel();
                    if(this.pos.y <= 128  || this.pos.y >= k.height() - 128){
                        this.rotation = 0
                    } else {
                        this.rotation = this.up ? -45 : this.down ? 45 : 0;
                    }
                    this.curTweenRot = k.tween(
                        this.angle,
                        this.rotation,
                        this.speed/10,
                        (a)=>{
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
                        this.dest.x,
                        100,
                        (p) => {
                            this.pos.x = p;
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
                            this.dest.y = k.height() - 128;
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
                            this.dest.y = 128;
                            moveLogicY();

                        }
                    })
                )

                this.onUpdate(rotateLogic);

            },

            death(pos) {
                if (this.isDead) {
                    this.destroy();
                    k.add(
                        [
                            k.sprite("explosion", {
                                anim: "explode"
                            }),
                            k.pos(pos.x - 64, pos.y - 64),
                            k.scale(4)
                        ]
                    );

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

            },

            disableControls() {
                if (this.curTween) this.curTween.cancel();
                this.inputControllers.forEach(input => {
                    input.cancel();
                });
            }
        }
    ])
}