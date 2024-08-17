export function makeRestart(k){
    return k.make(
        [
            k.sprite("restart"),
            k.scale(8),
            k.pos(k.center().x - 16*8, k.center().y),
            k.area(),
            k.anchor("center"),
            k.fixed()
        ]
    )
}

export function makeStart(k){
    return k.make(
        [
            k.sprite("start"),
            k.scale(8),
            k.pos(k.center().x + 16*8, k.center().y),
            k.area(),
            k.anchor("center"),
            k.fixed()
        ]
    )
}