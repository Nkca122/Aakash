export function barrier(k) {
    k.add(
        [
            k.pos(0, -704),
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 720) }),
            k.body({isStatic: true}),
            k.opacity(),
            k.z(1),
            "barrier",
            "ground"
        ]
    );

    k.add(
        [
            k.pos(0, k.height() - 16),
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 720) }),
            k.body({isStatic: true}),
            k.opacity(),
            k.z(1),
            "barrier",
            "ground"
        ]
    );

    k.add(
        [
            k.sprite("barrier"),
            k.pos(0, 16),
            k.scale(k.vec2(3.33, -3.33)),
            k.opacity(),
            k.z(1),
        ]
    );

    k.add(
        [
            k.sprite("barrier"),
            k.pos(0, k.height() - 16),
            k.scale(k.vec2(3.33, 3.33)),
            k.opacity(),
            k.z(1),
        ]
    );
}