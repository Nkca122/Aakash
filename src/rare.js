export function makeRare(k, i, n){

    return (
        k.make(
            [
                k.sprite("rare", {
                    anim: "elec"
                }),
                k.anchor("center"),
                k.scale(3),
                k.pos(((k.width() - 64)*(i/n) + 64), Math.random() * (k.height() - 32 - 42) + 48),
                k.area(),
                "rare"
            ]
        )
    )
}