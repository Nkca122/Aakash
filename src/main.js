import { appWindow } from "@tauri-apps/api/window";
import kaplay from "kaplay";
import { makePlayer } from "./player";
import { makeAsteroid } from "./asteroid";
import { makeRestart, makeStart } from "./buttons";
import { makeAstronaut } from "./astronaut";
import { progressBar } from "./progressbar";
import { barrier } from "./barrier";

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
k.loadSprite("asteroid1", "./asteroids/tile000.png");
k.loadSprite("asteroid2", "./asteroids/tile001.png");
k.loadSprite("asteroid3", "./asteroids/tile002.png");
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
            speed: 5
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

k.loadSprite("rock", "./rock.png");
k.loadSprite("barrier", "./barrier.png");

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
            k.scale(2),
            k.fixed()
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
                    k.fixed(),
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
            k.scale(4),
        ]
    );


    barrier(k);

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
    k.loop(1.5, () => {
        let maxAsteroidCt = 5;
        if (!player.isDead && survivalTime != 100) {
            let asteroidArray = map.get("asteroid");
            console.log(asteroidArray);
            if (asteroidArray.length < maxAsteroidCt) {
                map.add(makeAsteroid(k, k.vec2(-96, player.pos.y)));
            }
            asteroidArray.forEach(asteroid => {
                console.log(asteroid.pos)
                if (!asteroid.curTween) {
                    asteroid.curTween = k.tween(
                        asteroid.pos,
                        asteroid.dest,
                        asteroid.speed,
                        (p) => {
                            if (asteroid.pos.x <= -96) {
                                asteroid.destroy();
                            } else {
                                asteroid.pos = p;
                            }
                        },
                        k.easings.linear
                    );
                }
            })
        }

    });

    let bar = progressBar(k);

    k.loop(1, () => {
        if (!player.isDead && survivalTime < 100) {
            survivalTime += 1;
        } else if (!player.isDead && survivalTime == 100) {
            let asteroidArray = map.get("asteroid");
            if (asteroidArray.length) {
                asteroidArray.forEach(asteroid => {
                    asteroid.destroy();
                });
            }
            player.victory();
        }
        bar.tick(survivalTime);
    });


    player.onCollide("asteroid", () => {
        player.isDead = true;
        player.death(player.pos);
        let asteroidArray = map.get("asteroid");
        if (asteroidArray.length) {
            asteroidArray.forEach(asteroid => {
                if (asteroid && asteroid.curTween != null) {
                    asteroid.curTween.cancel();
                }
            });
        }
    });

    player.onCollide("barrier", () => {
        player.isDead = true;
        player.death(player.pos);
        let asteroidArray = map.get("asteroid");
        if (asteroidArray.length) {
            asteroidArray.forEach(asteroid => {
                if (asteroid && asteroid.curTween != null) {
                    asteroid.curTween.cancel();
                }
            });
        }
    });


});

k.scene("main2", () => {
    k.camScale(0.5)
    const map = k.add(
        makeBackgroundSpace(k)
    );

    map.add(
        [
            k.sprite("space"),
            k.scale(2),
            k.fixed()
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
                    k.fixed(),
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
            k.scale(4),
            k.fixed()
        ]
    );

    barrier(k);

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
    );

    const exhaust = rocket.add(
        [
            k.sprite("exhaust", {
                anim: "burn"
            }),
            k.pos(k.vec2(-45, 0)),
            k.anchor("center"),
            {
                curTween: null
            }
        ]
    )


    let astronaut;
    if (!rocket.curTween) {
        rocket.curTween = k.tween(
            rocket.pos,
            k.vec2(k.center().x, k.height() - 16 - 30),
            5,
            (p) => {
                if (rocket.pos.x >= k.center().x) {
                    astronaut = map.add(
                        makeAstronaut(k)
                    );

                    astronaut.setControls(map);

                } else {
                    rocket.pos = p;
                    k.camPos(k.center().x, p.y);
                }
            },
            k.easings.linear
        )
    }

    k.loop(1.5, () => {
        if (astronaut) {
            let maxAsteroidCt = 5;
            if (!astronaut.isDead) {
                let asteroidArray = map.get("asteroid");
                console.log(asteroidArray);
                if (asteroidArray.length < maxAsteroidCt) {
                    map.add(makeAsteroid(k, k.vec2(-(k.width()+96)/2, astronaut.pos.y >= 668 ? astronaut.pos.y - 32 : astronaut.pos.y <= 48 ? astronaut.pos.y + 32 : astronaut.pos.y), 0.5));
                }
                asteroidArray.forEach(asteroid => {
                    console.log(asteroid.pos)
                    if (!asteroid.curTween) {
                        asteroid.curTween = k.tween(
                            asteroid.pos,
                            asteroid.dest,
                            asteroid.speed,
                            (p) => {
                                if (asteroid.pos.x <= -(k.width()+96)/2) {
                                    asteroid.destroy();
                                } else {
                                    asteroid.pos = p;
                                }
                            },
                            k.easings.linear
                        );
                    }
                })
            }
        }
    });

    if (!exhaust.curTween) {
        exhaust.curTween = k.tween(
            k.vec2(1, 1),
            k.vec2(0, 0),
            5,
            (s) => {
                exhaust.scale = s
            },
            k.easings.linear
        )
    }








});







k.go("main");
