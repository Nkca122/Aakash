export function makeAsteroid(k, pos){
    return k.make(
        [
            k.sprite("asteroid"),
            k.scale(4),
            k.pos(pos),
            k.area({shape: new k.Rect(k.vec2(0, 0), 25, 25)}),
            k.anchor("center"),
            k.timer(),
            {
                speed: -100,
                curTween: null
            },
            "asteroid"
        ]
    )
}