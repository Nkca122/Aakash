export function barrier(k) {
    k.add(
        [
            k.pos(k.center().x, -704),
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 720) }),
            "barrier",
            "ground"
        ]
    );

    k.add(
        [
            k.pos(k.center().x, k.height() - 16),
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 720) }),
            "barrier",
            "ground"
        ]
    );

    k.add(
        [
            k.pos(k.center().x - k.width(), -704),
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 720) }),
            "barrier",
            "ground"
        ]
    );

    k.add(
        [
            k.pos(k.center().x - k.width(), k.height() - 16),
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 720) }),
            "barrier",
            "ground"
        ]
    );

    k.add(
        [
            k.sprite("stalactite"),
            k.pos(k.center().x - k.width() - 460, 800),
            k.scale(3, -5),

        ]
    )

    k.add(
        [
            k.sprite("stalactite"),
            k.pos(k.center().x - k.width() - 460, k.height() - 800),
            k.scale(3, 5),

        ]
    )

    k.add(
        [
            k.sprite("stalactite"),
            k.pos(k.center().x + k.width() + 460, 800),
            k.scale(-3, -5),

        ]
    )

    k.add(
        [
            k.sprite("stalactite"),
            k.pos(k.center().x + k.width() + 460, k.height() - 800),
            k.scale(-3, 5),

        ]
    )

    k.add(
        [
            k.sprite("surface"),
            k.pos(k.center().x - k.width(), k.center().y + 352),
            k.scale(3.33, -3.33),
        ]
    )

    k.add(
        [
            k.sprite("surface"),
            k.pos(k.center().x - 2, k.height() - 712),
            k.scale(3.33),
        ]
    ),

        k.add(
            [
                k.sprite("surface"),
                k.pos(k.center().x - k.width(), k.height() - 712),
                k.scale(3.33),
            ]
        )

    k.add(
        [
            k.sprite("surface"),
            k.pos(k.center().x - 2, k.center().y + 352),
            k.scale(3.33, -3.33),
        ]
    )

    k.add(
        [
            k.sprite("barrier"),
            k.pos(k.center().x - k.width(), 16),
            k.scale(k.vec2(3.34, -3.33)),
        ]
    );
    k.add(
        [
            k.sprite("barrier"),
            k.pos(k.center().x + k.width(), 16),
            k.scale(k.vec2(-3.34, -3.33)),
        ]
    );

    k.add(
        [
            k.sprite("barrier"),
            k.pos(k.center().x - k.width(), k.height() - 16),
            k.scale(k.vec2(3.34, 3.33)),
        ]
    );
    k.add(
        [
            k.sprite("barrier"),
            k.pos(k.center().x + k.width(), k.height() - 16),
            k.scale(k.vec2(-3.34, 3.33)),
        ]
    );

}