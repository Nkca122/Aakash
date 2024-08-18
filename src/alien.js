export function makeAlien(k) {
    let randomChoice = Math.random() - 0.5 > 0
    return k.make(
        [
            k.sprite("alien", {
                anim: "walk"
            }),
            k.pos(k.center().x - k.width(), randomChoice ? 16 + 96 : k.height() - 16 - 96),
            k.scale(3, randomChoice ? -3 : 3),
            k.area(),
            {
                curTween: null,
                isInspected: false,
                moves() {
                    if (!this.isInspected) {
                        if (this.curTween) this.curTween.cancel();
                        this.curTween = k.tween(
                            this.pos,
                            k.vec2(k.center().x + k.width(), this.pos.y),
                            5,
                            (p) => {
                                if(this.pos.x >= k.center().x + k.width()){
                                    this.destroy();
                                }
                                this.pos = p;
                            },
                            k.easings.linear
                        )


                    }
                }
            },
            "alien"

        ]
    )
}