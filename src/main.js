import { appWindow } from "@tauri-apps/api/window";
import kaplay from "kaplay";
import { makePlayer } from "./player";
import { makeAsteroid } from "./asteroid";
import { makeRestart, makeStart } from "./buttons";
import { makeAstronaut } from "./astronaut";

const k = kaplay({
    global: false,
    width: 1280,
    height: 720,
    letterbox: true,
    backgroundAudio: true,
    
    
});

k.loadSprite("ocean", "./Ocean/ocean.png");
k.loadSprite("cloud0", "./Clouds/cloud0.png");
k.loadSprite("cloud1", "./Clouds/cloud1.png");
k.loadSprite("cloud2", "./Clouds/cloud2.png");
k.loadSprite("cloud3", "./Clouds/cloud3.png");
k.loadSprite("spaceship", "./Ship1.png");
k.loadSprite("star", "./Stars/Stars.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
        "twinkle": {
            from: 0,
            to: 1,
            loop: true,
            speed: 1
        }
    }
});
k.loadSprite("space", "./Stars/Background.png");
k.loadSprite("planet", "./Stars/planet.png", {
    sliceX: 77,
    sliceY: 1,
    anims: {
        "revolution": {
            from: 0,
            to: 76,
            loop: true
        }
    }
});
k.loadSprite("asteroid", "./Asteroid.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
        "destroy": {
            from: 0,
            to: 7,
            speed: 2
        }
    }
});
k.loadSprite("exhaust", "./Exhaust.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
        "burn": {
            from: 0,
            to: 3,
            loop: true,
            speed: 5,

        }
    }
});
k.loadSprite("explosion", "./Explosion.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
        "explode": {
            from: 0,
            to: 7,
            speed: 2
        }
    },
});
k.loadSprite("restart", "./Buttons/restart.png");
k.loadSprite("start", "./Buttons/start.png");
k.loadSprite("moon", "./MoonSurface.png");
k.loadSprite("mountain", "./Mountains.png");
k.loadSprite("flag", "./flags.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
        "wave": {
            from: 0,
            to: 1,
            loop: true,
            speed: 2
        }
    }
});

k.loadSprite("astronaut", "./astronaut.png", {
    sliceX: 14,
    sliceY: 4,
    anims: {
        "idle": {
            from: 0,
            to: 3,
            loop: true,
            speed: 5
        },
        "run": {
            from: 14,
            to: 27,
            speed: 10
        },
        "jump": {
            from: 28,
            to: 36,
            speed: 5
        },
        "fix": {
            from: 42,
            to: 48,
            speed: 5
        }
    }
});

k.loadSprite("lunarLander", "./Spaceships.png", {
    sliceX: 5,
    sliceY: 3,
    anims: {
        "select": {
            from: 4,
            to: 4,
            loop: true
        }
    }
});

k.loadSprite("rock", "./rock.png");


k.loadSound("confirm", "./confirm.wav");

function makeBackgroundEarth(k) {
    const background = k.make(
        [
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#FA5F55")),
            k.z(-1)
        ]
    )

    return background;
}

function makeBackgroundSpace(k) {
    const background = k.make(
        [
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#000000")),
            k.z(-1)
        ]
    )

    return background;
}



k.scene("start", async () => {

    const map = k.add(
        makeBackgroundEarth(k)
    )

    k.onKeyPress("f11", async (key) => {
        if (await appWindow.isFullscreen()) {
            await appWindow.setFullscreen(false);
            return;
        }
        appWindow.setFullscreen(true);
    });
    //Background
    map.add(
        [
            k.sprite("ocean"),
            k.scale(k.vec2(0.56, 0.56)),
            k.z(-1)
        ]
    );

    //Clouds
    const cloud1 = map.add(
        [
            k.sprite("cloud0"),
            k.scale(2),
            k.pos(-45 * 4, 21 * 2 + 100),
            k.anchor("center"),
            {
                speed: 60
            }
        ],
    );

    const cloud2 = map.add(
        [
            k.sprite("cloud1"),
            k.scale(1),
            k.pos(45 * 2 + 100, 21 * 2 + 200),
            k.anchor("center"),
            {
                speed: 60
            }
        ],
    );

    const cloud3 = map.add(
        [
            k.sprite("cloud3"),
            k.scale(1.5),
            k.pos(45, 21 * 2 + 200),
            k.anchor("center"),
            {
                speed: 60
            }
        ],
    );

    cloud1.onUpdate(() => {
        cloud1.move(cloud1.speed, 0);
        if (cloud1.pos.x > k.width() + 45 * 4) {
            cloud1.pos.x = -45 * 4;
        }
    });

    cloud2.onUpdate(() => {
        cloud2.move(cloud2.speed, 0);
        if (cloud2.pos.x > k.width() + 45 * 2) {
            cloud2.pos.x = -45 * 2;
        }
    });

    cloud3.onUpdate(() => {
        cloud3.move(cloud3.speed, 0);
        if (cloud3.pos.x > k.width() + 45 * 2) {
            cloud3.pos.x = -45 * 2;
        }
    });



    const playBtn = map.add(
        [
            k.rect(250, 50, { radius: 3 }),
            k.pos(k.center()),
            k.anchor("center"),
            k.area(),
            k.color(k.Color.fromHex("#000000")),
            k.outline(5, k.color(k.Color.fromHex("#ffffff")))
        ]
    );

    playBtn.add([
        k.text("Play", { size: 26 }),
        k.pos(),
        k.anchor("center"),
        k.area()
    ]);

    playBtn.onClick(() => {
        k.play("confirm");
        k.go("main");
    })

});




k.scene("main", () => {
    k.setGravity(0)
    let survivalTime = 0;

    const map = k.add(
        makeBackgroundSpace(k)
    );

    map.add(
        [
            k.sprite("space"),
            k.scale(2)
        ]
    )

    let starArray = [];
    for (let i = 0; i < 2; i++) {
        starArray.push(
            map.add(
                [
                    k.sprite("star", {
                        anim: "twinkle"
                    }),
                    k.scale(0.5),
                    k.area(),
                    k.pos(k.vec2(i == 0 ? 0 : k.width(), k.center().y + (Math.random() - 0.5) * (360 * 0.5 + 48))),
                    k.anchor("center"),
                    k.timer(),
                    {
                        curTween: null
                    }
                ]
            )
        );
    }


    k.loop(5, () => {
        starArray.forEach(star => {
            if (star.curTween) star.curTween.cancel();
            star.curTween = k.tween(
                star.pos,
                k.vec2(star.pos.x, k.center().y + (Math.random() - 0.5) * (360 * 0.5 + 48)),
                4.99,
                (p) => {
                    star.pos = p
                },
                k.easings.linear
            );
        })

    })

    map.add(
        [
            k.sprite("planet", {
                anim: "revolution",
            }),
            k.pos(k.center()),
            k.anchor("center"),
            k.scale(4)
        ]
    );

    k.onKeyPress("f11", async (key) => {
        if (await appWindow.isFullscreen()) {
            await appWindow.setFullscreen(false);
            return;
        }
        appWindow.setFullscreen(true);
    });

    const player = map.add(
        makePlayer(k)
    );

    player.setControls();



    let asteroidArray = [];
    let asteroidDestArray = [];
    let asteroidCt = 0;
    let maxAsteroidCt = 5;

    k.loop(2.5, () => {
        if (!player.isDead && survivalTime != 100) {
            if (asteroidCt < maxAsteroidCt) {
                asteroidArray[asteroidCt] = map.add(makeAsteroid(k, k.vec2(k.width(), Math.random() * (k.height() - 96 * 2) + 96)));
                asteroidDestArray[asteroidCt] = player.pos
                asteroidCt++;
            }
            for (let i = 0; i < asteroidArray.length; i++) {
                const asteroid = asteroidArray[i];
                if (asteroid) {
                    if (!asteroid.curTween) {
                        asteroid.curTween = k.tween(
                            asteroid.pos,
                            k.vec2(-96, asteroidDestArray[i].y),
                            5,
                            (p) => {
                                if (asteroid.pos.x <= -96) {
                                    asteroid.destroy();
                                    asteroidCt = (asteroidCt + 1) % maxAsteroidCt;
                                } else {
                                    asteroid.pos = p
                                }
                            },
                            k.easings.linear
                        );
                    }

                }

            }
        }

    });

    let progressBar = map.add(
        [
            k.rect((100 - survivalTime) / 100 * k.width() * 0.8, 10, {
                radius: 16
            }),
            k.outline(2, k.Color.fromHex("#000000")),
            k.pos(k.center().x, 20),
            k.anchor("center"),
            k.area(),
            k.color(survivalTime < 33 ? k.RED : survivalTime < 66 ? k.YELLOW : survivalTime <= 100 ? k.Color.fromHex("#008000") : null)

        ]
    )

    k.loop(1, () => {
        if (!player.isDead && survivalTime < 100) {
            survivalTime += 1;
            progressBar.destroy();
            progressBar = map.add(
                [
                    k.rect((100 - survivalTime) / 100 * k.width() * 0.8, 10, {
                        radius: 16
                    }),
                    k.outline(2, k.Color.fromHex("#000000")),
                    k.pos(k.center().x, 20),
                    k.anchor("center"),
                    k.area(),
                    k.color(survivalTime < 33 ? k.RED : survivalTime < 66 ? k.YELLOW : survivalTime <= 100 ? k.Color.fromHex("#008000") : null)
                ]
            )
        } else if (!player.isDead && survivalTime == 100) {
            asteroidArray.forEach(asteroid => {
                asteroid.destroy();
            });
            player.disableControls();
            if (player.curTween) player.curTween.cancel();
            player.curTween = k.tween(
                player.pos,
                k.vec2(k.width() + 64 * 2.5, k.center().y),
                5,
                (p) => {
                    player.pos = p
                    if (player.pos.x >= k.width() + 64 * 2) {
                        k.go("main2");
                    }
                },
                k.easings.linear
            );
        }
    });

    const exhaust = player.add([
        k.sprite("exhaust", {
            anim: "burn"
        }),
        k.pos(k.vec2(-45, 0)),
        k.anchor("center")
    ]);


    player.onCollide("asteroid", (asteroid) => {
        player.isDead = true;
        player.sprite = "explosion";
        player.scale = k.vec2(4, 4);
        player.play("explode");
        asteroid.play("destroy");

        exhaust.destroy();

        const restart = map.add(
            makeRestart(k),
        );

        const start = map.add(
            makeStart(k)
        );

        restart.onClick(() => {
            k.go("main");
        });

        start.onClick(() => {
            k.go("start");
        })

        player.disableControls();
        asteroidArray.forEach(asteroid => {
            if (asteroid && asteroid.curTween != null) {
                asteroid.curTween.cancel();
            }
        });

    });

});

k.scene("main2", () => {
    k.setGravity(1200);

    let survivalTime = 0;
    let asteroidArray = [];
    let asteroidDestArray = [];
    let asteroidCt = 0;
    let maxAsteroidCt = 3;

    const map = k.add(
        makeBackgroundSpace(k)
    );

    map.add(
        [
            k.sprite("space"),
            k.scale(2)
        ]
    )

    let starArray = [];
    for (let i = 0; i < 2; i++) {
        starArray.push(
            map.add(
                [
                    k.sprite("star", {
                        anim: "twinkle"
                    }),
                    k.scale(0.5),
                    k.area(),
                    k.pos(k.vec2(i == 0 ? 0 : k.width(), k.center().y + (Math.random() - 0.5) * (360 * 0.5 + 48))),
                    k.anchor("center"),
                    k.timer(),
                    {
                        curTween: null
                    }
                ]
            )
        );
    }


    k.loop(5, () => {
        starArray.forEach(star => {
            if (star.curTween) star.curTween.cancel();
            star.curTween = k.tween(
                star.pos,
                k.vec2(star.pos.x, k.center().y + (Math.random() - 0.5) * (360 * 0.5 + 48)),
                4.99,
                (p) => {
                    star.pos = p
                },
                k.easings.linear
            );
        })

    })

    map.add(
        [
            k.sprite("planet", {
                anim: "revolution",
            }),
            k.pos(k.center()),
            k.anchor("center"),
            k.scale(4)
        ]
    );

    const surface = map.add(
        [
            k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), 40) }),
            k.pos(k.center().x, k.height() - 20),
            k.anchor("center"),
            k.body({ isStatic: true }),
            "ground"

        ]
    );

    map.add(
        [
            k.sprite("mountain"),
            k.scale(k.vec2(1, 1)),
            k.pos(k.width() - 384, k.height() - 216),
        ]
    );

    map.add(
        [
            k.sprite("mountain"),
            k.scale(k.vec2(1, 1)),
            k.pos(k.width() - 2 * 384, k.height() - 216),
        ]
    );

    map.add(
        [
            k.sprite("mountain"),
            k.scale(k.vec2(1, 1)),
            k.pos(k.width() - 3 * 384, k.height() - 216),
        ]
    );
    map.add(
        [
            k.sprite("mountain"),
            k.scale(k.vec2(1, 1)),
            k.pos(k.width() - 4 * 384, k.height() - 216),
        ]
    )
    map.add(
        [
            k.sprite("moon"),
            k.scale(k.vec2(3.33, 3.33)),
            k.pos(0, 0),
            k.area(),
            k.opacity(0.5),
        ]
    );
    map.add(
        [
            k.sprite("rock"),
            k.scale(k.vec2(2, 2)),
            k.pos(k.width() - 128, k.height() - 40 - 40),
            k.area(),
            "rock"
        ]
    )



    k.onKeyPress("f11", async (key) => {
        if (await appWindow.isFullscreen()) {
            await appWindow.setFullscreen(false);
            return;
        }
        appWindow.setFullscreen(true);
    });

    const rocket = map.add(
        [
            k.sprite("spaceship"),
            k.pos(-64 * 2, k.center().y),
            k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 20) }),
            k.anchor("center"),
            k.z(3),
            k.scale(k.vec2(2, 2)),
            k.offscreen({ destroy: false }),
            {
                curTween: null
            }
        ]
    )

    rocket.add(
        [
            k.sprite("exhaust", {
                anim: "burn"
            }),
            k.pos(k.vec2(-45, 0)),
            k.anchor("center")
        ]
    )


    let astronaut;
    let lunarLander;
    rocket.onUpdate(() => {
        if (!rocket.curTween) {
            rocket.curTween = k.tween(
                rocket.pos,
                k.vec2(k.width() + 64 * 2.5, k.center().y),
                15,
                (p) => {
                    if (rocket.pos.x >= 64 * 2 && !lunarLander) {
                        lunarLander = map.add(
                            [
                                k.sprite("lunarLander", {
                                    anim: "select"
                                }),
                                k.scale(0.5),
                                k.pos(64 * 2, k.center().y),
                                k.anchor("center"),
                                k.z(2),
                                k.rotate(-90),
                                {
                                    curTween: null,
                                    curScaleTween: null,
                                    speed: 30,
                                    init() {
                                        if (lunarLander) {
                                            lunarLander.onUpdate(() => {
                                                if (!lunarLander.curScaleTween) {
                                                    lunarLander.curScaleTween = k.tween(
                                                        k.vec2(1, 1),
                                                        k.vec2(3, 3),
                                                        10,
                                                        (s) => {
                                                            lunarLander.scale = s;
                                                        },
                                                        k.easings.easeInSine
                                                    )
                                                }

                                                if (!lunarLander.curTween) {
                                                    lunarLander.curTween = k.tween(
                                                        lunarLander.pos,
                                                        k.vec2(lunarLander.pos.x, k.height() - 60),
                                                        10,
                                                        (p) => {
                                                            lunarLander.pos = p
                                                        },
                                                        k.easings.linear
                                                    )
                                                }
                                            })
                                        }

                                    }
                                }
                            ]
                        )

                        lunarLander.init()
                        k.wait(10, () => {
                            astronaut = map.add(
                                makeAstronaut(k, map)
                            );
                            astronaut.setControls();
                            k.loop(2.5, () => {
                                if (!astronaut.isDead && astronaut.progress != 100) {
                                    if (asteroidCt < maxAsteroidCt) {
                                        asteroidArray[asteroidCt] = map.add(makeAsteroid(k, k.vec2(k.center().x + (Math.random() - 0.5) * 192, -96)));
                                        asteroidDestArray[asteroidCt] = astronaut.pos
                                        asteroidCt++;
                                    }
                                    for (let i = 0; i < asteroidArray.length; i++) {
                                        const asteroid = asteroidArray[i];
                                        if (asteroid) {
                                            if (!asteroid.curTween) {
                                                asteroid.curTween = k.tween(
                                                    asteroid.pos,
                                                    k.vec2(asteroidDestArray[i].x, k.height() + 96),
                                                    5,
                                                    (p) => {
                                                        if (asteroid.pos.y >= k.height() + 96) {
                                                            asteroid.destroy();
                                                            asteroidCt = (asteroidCt + 1) % maxAsteroidCt;
                                                        } else {
                                                            asteroid.pos = p
                                                        }
                                                    },
                                                    k.easings.linear
                                                );
                                            }

                                        }

                                    }
                                }
                            });

                            let progressBar = map.add(
                                [
                                    k.text(`${astronaut.progress}%`, { size: 24 }),
                                    k.pos(k.center().x, 20),
                                    k.anchor("center"),
                                    k.area(),
                                    k.color(astronaut.progress < 33 ? k.RED : astronaut.progress < 66 ? k.YELLOW : astronaut.progress <= 100 ? k.Color.fromHex("#008000") : null),
                                    k.z(4)

                                ]
                            );

                            k.loop(1, () => {
                                if (!astronaut.isDead && astronaut.progress < 100) {
                                    progressBar.destroy();
                                    progressBar = map.add(
                                        [
                                            k.text(`${astronaut.progress}%`, { size: 24 }),
                                            k.pos(k.center().x, 20),
                                            k.pos(k.center().x, 20),
                                            k.anchor("center"),
                                            k.area(),
                                            k.color(astronaut.progress < 33 ? k.RED : astronaut.progress < 66 ? k.YELLOW : astronaut.progress <= 100 ? k.Color.fromHex("#008000") : null),
                                            k.z(4)
                                        ]
                                    )
                                } else if (!astronaut.isDead && astronaut.progress == 100) {
                                    progressBar.destroy()
                                    asteroidArray.forEach(asteroid => {
                                        asteroid.destroy();
                                    });
                                    astronaut.disableControls();
                                    if (astronaut.curTween) astronaut.curTween.cancel();
                                    astronaut.scale = k.vec2(-4, 4);
                                    astronaut.curTween = k.tween(
                                        astronaut.pos,
                                        k.vec2(64 * 2, astronaut.pos.y),
                                        5,
                                        (p) => {
                                            if (astronaut.curAnim() != "run") astronaut.play("run");
                                            if (astronaut.pos.x <= 64 * 2.1) {
                                                astronaut.destroy();
                                                rocket.scale = k.vec2(-2, 2)
                                                rocket.curTween = k.tween(
                                                    rocket.pos,
                                                    k.vec2(64 * 2, k.center().y),
                                                    5,
                                                    (p) => {
                                                        rocket.pos = p
                                                    },
                                                    k.easings.linear
                                                );
                                                lunarLander.curScaleTween.cancel();
                                                lunarLander.curScaleTween = null;

                                                lunarLander.curTween.cancel();
                                                lunarLander.curTween = null;

                                                const exhaust = lunarLander.add(
                                                    [
                                                        k.sprite("exhaust"),
                                                        k.scale(2, 2),
                                                        k.pos(k.vec2(-45, 0)),
                                                        k.anchor("center")
                                                    ]
                                                );


                                                if (!lunarLander.curScaleTween) {
                                                    lunarLander.curScaleTween = k.tween(
                                                        lunarLander.scale,
                                                        k.vec2(1, 1),
                                                        5,
                                                        (s) => {
                                                            lunarLander.scale = s
                                                        },
                                                        k.easings.linear
                                                    );
                                                }

                                                if (!lunarLander.curTween) {
                                                    lunarLander.curTween = k.tween(
                                                        lunarLander.pos,
                                                        k.vec2(lunarLander.pos.x, k.center().y - 10),
                                                        5,
                                                        (p) => {
                                                            if (lunarLander.pos.y <= k.center().y) {
                                                                lunarLander.destroy()
                                                                rocket.curTween.cancel();
                                                                rocket.curTween = null;

                                                                rocket.curTween = k.tween(
                                                                    rocket.pos,
                                                                    k.vec2(-64 * 5, rocket.pos.y),
                                                                    5,
                                                                    (p) => {
                                                                        if (rocket.pos.x <= -64 * 4.9) {
                                                                            rocket.destroy();
                                                                            k.go("start");
                                                                        } else {
                                                                            rocket.pos = p;
                                                                        }
                                                                    },
                                                                    k.easings.linear
                                                                )
                                                            } else {
                                                                lunarLander.pos = p;
                                                                if (exhaust.curAnim() != "burn") exhaust.play("burn");
                                                            }

                                                        },
                                                        k.easings.linear
                                                    );
                                                }




                                            } else {
                                                astronaut.pos = p;
                                            }
                                        },
                                        k.easings.linear
                                    );
                                }
                            });

                            astronaut.onCollide("asteroid", (asteroid) => {
                                astronaut.isDead = true;
                                asteroid.play("destroy");
                                astronaut.destroy()


                                const restart = map.add(
                                    makeRestart(k),
                                );

                                const start = map.add(
                                    makeStart(k)
                                );

                                restart.onClick(() => {
                                    k.go("main2");
                                });

                                start.onClick(() => {
                                    k.go("start");
                                })

                                astronaut.disableControls();
                                asteroidArray.forEach(asteroid => {
                                    if (asteroid && asteroid.curTween != null) {
                                        asteroid.curTween.cancel();
                                    }
                                });

                            });

                        })

                    } else {
                        rocket.pos = p
                    }
                },
                k.easings.linear
            )
        }
    });











});





k.go("start");
