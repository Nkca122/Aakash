import { randomChoice } from "./utils";

export function makeAsteroid(k, pos){
    return k.make(
        [
            k.sprite(randomChoice(
                "asteroid1", "asteroid2", "asteroid3"
            )),
            k.scale(2),
            k.pos(pos),
            k.area({shape: new k.Rect(k.vec2(0, 0), 48, 48)}),
            k.anchor("center"),
            k.rotate(Math.random() * 180),
            k.timer(),
            {
                speed: ((Math.random() - 0.5) * 2) + 5,
                curTween: null,

            },
            "asteroid"
        ]
    )
}