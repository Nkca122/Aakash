import { randomChoice } from "./utils";

export function makeAsteroid(k, dest){
    return k.make(
        [
            k.sprite(randomChoice(
                "asteroid1", "asteroid2", "asteroid3"
            )),
            k.scale(2),
            k.pos(k.width() + 96, dest.y),
            k.area({shape: new k.Rect(k.vec2(0, 0), 48, 48)}),
            k.anchor("center"),
            k.rotate(Math.random() * 180),
            k.timer(),
            {
                speed: ((Math.random() - 0.5) * 2) + 5,
                dest: dest,
                curTween: null,

            },
            "asteroid"
        ]
    )
}