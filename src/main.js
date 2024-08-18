import { appWindow } from "@tauri-apps/api/window";
import kaplay from "kaplay";
import { makePlayer } from "./player";
import { makeAsteroid } from "./asteroid";
import { makeAstronaut } from "./astronaut";
import { progressBar } from "./progressbar";
import { barrier } from "./barrier";
import { makeAlien } from "./alien";
import { makeRare } from "./rare";
import { saveSystem } from "./save";
import { makeScoreBox } from "./scoreBox";
import { controls } from "./controls";
const k = kaplay({
    global: true,
    width: 1280,
    height: 720,
    letterbox: true,
    
});

k.loadSprite("ocean", "./Ocean/ocean.png");
k.loadSprite("cloud0", "./Clouds/cloud0.png");
k.loadSprite("cloud1", "./Clouds/cloud1.png");
k.loadSprite("cloud2", "./Clouds/cloud2.png");
k.loadSprite("cloud3", "./Clouds/cloud3.png");
k.loadSprite("spaceship", "./Ship1.png");
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
k.loadSprite("surface", "./surface.png");
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
k.loadSprite("mountain", "./Mountains.png");
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
k.loadSprite("stalactite", "./stalactite.png");
k.loadSprite("alien", "./alien.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
        "walk": {
            from: 0,
            to: 3,
            speed: 10,
            loop: true
        },
        "idle": {
            from: 0,
            to: 0,
            loop: true
        }
    }
});
k.loadSprite("rare", "./rare.png", {
    sliceX: 7,
    sliceY: 1,
    anims: {
        "elec": {
            from: 0,
            to: 6,
            loop: true
        }
    }
});

k.loadSprite("scaffold", "./scaffold.png");
k.loadSound("background", "./back.mp3");
k.play("background")

let rareScore = 0;
let alienScore = 0;

function makeBackgroundEarth(k) {
    const background = k.make(
        [
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#FA5F55")),

        ]
    )

    return background;
}

function makeBackgroundSpace(k) {
    const background = k.make(
        [
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#000000")),

        ]
    )

    return background;
}



k.scene("start", async () => {

    await saveSystem.load();
    if (!saveSystem.data.maxScore) {
        saveSystem.data.maxScore = 0;
        await saveSystem.save();
    }

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

    map.add(
        [
            k.sprite("ocean"),
            k.scale(k.vec2(0.56, 0.56)),
            k.fixed()

        ]
    );

    map.add([
        k.sprite("scaffold"),
        k.scale(2),
        k.pos(0, k.height() - 96),
        k.fixed()
    ])

    const rocket = map.add(
        [
            k.sprite("spaceship"),
            k.pos(0, k.height() - 48 - 45),
            k.scale(2),
            k.rotate(-90),
            {
                curTween: null
            }
        ]
    )

    const astronaut = rocket.add(
        [
            k.sprite("astronaut", {
                anim: "idle"
            }),
            k.anchor("center"),
            k.pos(18, 20),
            k.rotate(90),
            k.scale(2)
        ]
    )

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
        playBtn.destroy();
        astronaut.destroy();
        k.wait(0.5, () => {
            const exhaust = rocket.add(
                [
                    k.sprite("exhaust", {
                        anim: "burn"
                    }),
                    k.anchor("center"),
                    k.pos(-35, 32),
                    k.scale(2),
                ]
            );

            rocket.curTween = k.tween(
                rocket.pos,
                k.vec2(0, -122),
                5,
                (p) => {
                    if (rocket.pos.y <= -122) {
                        k.go("controls");
                    }
                    rocket.pos = p
                },
                k.easings.linear
            )
        })

    })

});

k.scene("controls", ()=>{
    k.setGravity(0);
    const map = k.add(
        makeBackgroundEarth(k)
    );

    map.add(
        [
            k.sprite("ocean"),
            k.scale(k.vec2(0.56, 0.56)),

        ]
    );

    map.add([
        k.sprite("scaffold"),
        k.scale(2),
        k.pos(0, k.height() - 96)
    ])

    k.onKeyPress("f11", async (key) => {
        if (await appWindow.isFullscreen()) {
            await appWindow.setFullscreen(false);
            return;
        }
        appWindow.setFullscreen(true);
    });




   
    k.wait(1, ()=>{
        map.add(
            controls(k, k.center())
        )
    })
    
})




k.scene("main", () => {
    k.setGravity(0);
    k.camScale(0.5);
    rareScore = 0;
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
    );

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
        if (!player.isDead && survivalTime != 30) {
            let asteroidArray = map.get("asteroid");
            if (asteroidArray.length < maxAsteroidCt) {
                map.add(makeAsteroid(k, k.vec2((-k.width() + 64) / 2, player.pos.y), 0.5));
            }
            asteroidArray.forEach(asteroid => {
                if (!asteroid.curTween) {
                    asteroid.curTween = k.tween(
                        asteroid.pos,
                        asteroid.dest,
                        asteroid.speed,
                        (p) => {
                            if (asteroid.pos.x <= (-k.width() + 64) / 2) {
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
        if (!player.isDead && survivalTime != 30) {
            survivalTime += 1;
        } else if (!player.isDead && survivalTime == 30 && !player.won) {
            let asteroidArray = map.get("asteroid");
            if (asteroidArray.length) {
                asteroidArray.forEach(asteroid => {
                    asteroid.destroy();
                });
            }
            player.victory();
        }
        bar.tick(survivalTime, 30);
    });


    if (!player.isDead) {
        for (let i = 0; i < 5; i++) {
            map.add(
                makeRare(k, i, 5)
            );
        }

    }

    player.onCollide("rare", (rare) => {
        rareScore += 50;
        map.add(
            [
                k.text("+50", { size: 32 }),
                k.anchor("center"),
                k.pos(rare.pos),
                k.opacity(),
                k.lifespan(0.5)
            ]
        );
        rare.destroy();
    })


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
    k.camScale(0.5);
    alienScore = 0;
    let survivalTime = 0;
    const map = k.add(
        makeBackgroundSpace(k)
    );

    let bar;

    map.add(
        [
            k.sprite("space"),
            k.scale(2),
            k.fixed()
        ]
    )




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

    k.onKeyPress("f11", async (key) => {
        if (await appWindow.isFullscreen()) {
            await appWindow.setFullscreen(false);
            return;
        }
        appWindow.setFullscreen(true);
    });


    barrier(k);


    let astronaut;


    const rocket = map.add(
        [
            k.sprite("spaceship"),
            k.pos(k.center().x - k.width() - 45, k.center().y),
            k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 20) }),
            k.anchor("center"),
            (3),
            k.scale(k.vec2(2, 2)),
            k.offscreen({ destroy: false }),
            {
                curTween: null,
                curTweenScale: null
            }
        ]
    );

    const exhaust = rocket.add(
        [
            k.sprite("exhaust", {
                anim: "burn"
            }),
            k.pos(k.vec2(-50, 0)),
            k.anchor("center"),
            {
                curTween: null
            }
        ]
    )


    if (!rocket.curTween) {
        rocket.curTween = k.tween(
            rocket.pos,
            k.vec2(k.center().x, k.height() - 16 - 28),
            5,
            (p) => {
                if (rocket.pos.x >= k.center().x) {
                    astronaut = map.add(
                        makeAstronaut(k)
                    );

                    bar = progressBar(k);
                    k.loop(1, () => {
                        if (!astronaut.isDead && survivalTime != 30) {
                            survivalTime += 1;
                        } else if (!astronaut.isDead && survivalTime == 30 && !astronaut.won) {
                            astronaut.victory();

                            map.get("asteroid").forEach(asteroid => {
                                asteroid.destroy();
                            });
                            map.get("alien", alien => {
                                alien.destroy();
                            })
                            k.wait(4, () => {
                                if (rocket.curTween) rocket.curTween.cancel();
                                rocket.curTween = k.tween(
                                    rocket.pos,
                                    k.vec2((k.center().x + k.width()) + 135, k.center().y),
                                    2,
                                    (p) => {
                                        if (rocket.pos.x >= k.center().x + k.width() + 135) {
                                            k.go("end");
                                        } else {
                                            rocket.pos = p
                                        }
                                    },
                                    k.easings.linear
                                )
                            })

                        }

                        if (!astronaut.isDead && survivalTime == 25) {
                            if (rocket.curTween) rocket.curTween.cancel();
                            rocket.curTween = k.tween(
                                rocket.pos,
                                k.vec2((k.center().x + k.width()) * (3 / 4), k.center().y),
                                10,
                                (p) => {
                                    rocket.pos = p
                                },
                                k.easings.linear
                            )

                            if (exhaust.curTween) exhaust.curTween.cancel();
                            exhaust.curTween = k.tween(
                                0,
                                1,
                                10,
                                (s) => {
                                    exhaust.scale = s
                                },
                                k.easings.linear
                            )
                        }
                        bar.tick(survivalTime, 30);
                    })

                    k.loop(5, () => {
                        if (!astronaut.isDead && !astronaut.won) {
                            map.add(
                                makeAlien(k)
                            );
                            map.get("alien").forEach(alien => {
                                alien.moves();
                            })
                        }
                    })

                    astronaut.setControls(map);
                    astronaut.onCollide("asteroid", () => {
                        astronaut.isDead = true;
                        astronaut.death(astronaut.pos);
                        let asteroidArray = map.get("asteroid");
                        if (asteroidArray.length) {
                            asteroidArray.forEach(asteroid => {
                                if (asteroid && asteroid.curTween != null) {
                                    asteroid.curTween.cancel();
                                }
                            });
                            if (rocket.curTween) rocket.curTween.cancel();
                            if (exhaust.curTween) exhaust.curTween.cancel();
                        }

                        map.get("alien").forEach(alien => {
                            alien.curTween.cancel();
                            alien.play("idle")
                        })
                    });

                    astronaut.onCollideUpdate("alien", (alien) => {
                        if (k.isKeyPressed(["e", "space"]) && !alien.isInspected) {
                            alien.isInspected = true;
                            alienScore += 100;
                            map.add(
                                [
                                    k.text("+100", { size: 32 }),
                                    k.anchor("center"),
                                    k.pos(alien.pos),
                                    k.opacity(),
                                    k.lifespan(1)
                                ]
                            );
                            k.wait(1, () => {
                                alien.isInspected = false;
                            })
                        }
                    })

                } else {
                    rocket.pos = p;
                    k.camPos(k.center().x, p.y);
                }
            },
            k.easings.linear
        )
    }

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



    k.loop(1, () => {
        if (astronaut) {
            let maxAsteroidCt = 5;
            if (!astronaut.isDead && !astronaut.won) {
                let asteroidArray = map.get("asteroid");
                if (asteroidArray.length < maxAsteroidCt) {
                    map.add(makeAsteroid(k, k.vec2(-(k.width() + 64) / 2, astronaut.pos.y >= 668 ? astronaut.pos.y - 32 : astronaut.pos.y <= 48 ? astronaut.pos.y + 32 : astronaut.pos.y), 0.5));
                }
                asteroidArray.forEach(asteroid => {
                    if (!asteroid.curTween) {
                        asteroid.curTween = k.tween(
                            asteroid.pos,
                            asteroid.dest,
                            asteroid.speed,
                            (p) => {
                                if (asteroid.pos.x <= -(k.width() + 64) / 2) {
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
});

k.scene("end", async () => {
    const map = k.add(
        makeBackgroundEarth(k)
    );


    k.onKeyPress("f11", async (key) => {
        if (await appWindow.isFullscreen()) {
            await appWindow.setFullscreen(false);
            return;
        }
        appWindow.setFullscreen(true);
    });

    map.add(
        [
            k.sprite("ocean"),
            k.scale(k.vec2(0.56, 0.56)),

        ]
    );

    const rocket = map.add(
        [
            k.sprite("spaceship"),
            k.pos(0, -122),
            k.scale(2),
            k.rotate(-90),
            {
                curTween: null
            }
        ]
    )

    rocket.curTween = k.tween(
        rocket.pos,
        k.vec2(rocket.pos.x, k.height() - 48 - 45),
        5,
        (p) => {
            if (rocket.pos.y >= k.height() - 48 - 45) {
                k.wait(0.5, () => {
                    exhaust.destroy();
                    rocket.add(
                        [
                            k.sprite("astronaut", {
                                anim: "idle"
                            }),
                            k.anchor("center"),
                            k.pos(18, 20),
                            k.rotate(90),
                            k.scale(2)
                        ]
                    )
                })
            }
            rocket.pos = p
        },
        k.easings.linear
    )

    const exhaust = rocket.add(
        [
            k.sprite("exhaust", {
                anim: "burn"
            }),
            k.anchor("center"),
            k.pos(-35, 32),
            k.scale(2),
        ]
    )

    map.add([
        k.sprite("scaffold"),
        k.scale(2),
        k.pos(0, k.height() - 96)
    ])

    k.add(await makeScoreBox(k, k.center(), alienScore + rareScore));
})







k.go("start");
