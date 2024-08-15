import { makeRestart } from "./buttons";
import { makeStart } from "./buttons";
export function makePlayer(k) {
    return k.make([
        k.sprite("spaceship"),
        k.pos(64 * 2, k.center().y),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 20) }),
        k.anchor("center"),
        k.scale(2),
        k.body(),
        k.z(4),
        {
            isDead: false,
            speed: 5,
            down: false,
            up: false,
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
            curTween: null,
            dest: 64 * 2,
            setControls() {
                this.exhaust = this.exhaustInit();
                const moveLogicY = () => {

                    if (this.down) {
                        this.dest = k.height() - 64
                    } else if (this.up) {
                        this.dest = 64
                    }

                    if (this.curTween) this.curTween.cancel();

                    this.curTween = k.tween(
                        this.pos,
                        k.vec2(this.pos.x, this.dest),
                        this.speed,
                        (p) => {
                            if (this.dir == 1) {

                            } else {

                            }

                            this.pos = p;
                        },
                        k.easings.linear
                    );


                };

                this.inputControllers.push(
                    k.onKeyPress("s", () => {
                        if (!this.down) {
                            this.exhaust.angle = 225;
                            this.exhaust.pos = k.vec2(-40, -10);
                            this.dir = 1;
                            this.down = true;
                            this.up = false;
                            moveLogicY();
                        }
                    })
                );

                this.inputControllers.push(
                    k.onKeyPress("w", () => {
                        if (!this.up) {
                            this.exhaust.angle = -225;
                            this.exhaust.pos = k.vec2(-40, 10)
                            this.dir = -1;
                            this.down = false;
                            this.up = true;
                            moveLogicY();
                        }
                    })
                )


            },

            death(pos){
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