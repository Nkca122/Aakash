export function makePlayer(k){
    return k.make([
        k.sprite("spaceship"),
        k.pos(64*2, 64*2),
        k.area({shape: new k.Rect(k.vec2(0, 0), 40, 20)}),
        k.anchor("center"),
        k.scale(2),
        k.body(),
        k.timer(),
        {
            isDead: false,
            speed: 100,
            inputControllers: [],
            dir: null,
            curTween: null,
            setControls(){
                const moveLogicY = () => {
                        if(this.curTween) this.curTween.cancel()
                        this.curTween = k.tween(
                            this.pos,
                            k.vec2(this.pos.x, this.pos.y + this.speed*this.dir),
                            1,
                            (p)=>{
                                if(this.dir == 1){
                                    this.pos.y = Math.min(p.y, k.height()-64)
                                } else {
                                    this.pos.y = Math.max(p.y, 64)
                                }
                            },
                            k.easings.linear
                        );
                    
                };

                this.inputControllers.push(
                    k.onKeyPress("s", ()=>{
                            this.dir = 1
                            moveLogicY()
                    })
                );

                this.inputControllers.push(
                    k.onKeyPress("w", ()=>{
                        this.dir = -1
                        moveLogicY()
                    })
                )


            },
            disableControls(){
                if(this.curTween) this.curTween.cancel();
                this.inputControllers.forEach(input => {
                    input.cancel();
                });
            }
        }
    ])
}