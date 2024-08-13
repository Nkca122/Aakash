import { appWindow } from "@tauri-apps/api/window";
import kaplay from "kaplay";
import { makePlayer } from "./player";

const k = kaplay({
    global:false,
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

k.loadSound("confirm", "./confirm.wav");

function makeBackgroundEarth(k){
    const background = k.make(
        [
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#FA5F55")),
            k.z(-1)
        ]
    )

    return background;
}

function makeBackgroundSpace(k){
    const background = k.make(
        [
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#000000")),
            k.z(-1)
        ]
    )

    return background;
}



k.scene("start", async()=>{
    
    const map = k.add(
        makeBackgroundEarth(k)
    )

    k.onKeyPress("f11", async (key) => {
        if(await appWindow.isFullscreen()){
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
            k.pos(-45*4, 21*2 + 100),
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
            k.pos(45*2 + 100, 21*2 + 200),
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
            k.pos(45, 21*2 + 200),
            k.anchor("center"), 
            {
                speed: 60
            }
        ],
    );

    cloud1.onUpdate(()=>{
        cloud1.move(cloud1.speed, 0);
        if(cloud1.pos.x > k.width() + 45*4){
            cloud1.pos.x = -45*4;
        }
    });

    cloud2.onUpdate(()=>{
        cloud2.move(cloud2.speed, 0);
        if(cloud2.pos.x > k.width() + 45*2){
            cloud2.pos.x = -45*2;
        }
    });

    cloud3.onUpdate(()=>{
        cloud3.move(cloud3.speed, 0);
        if(cloud3.pos.x > k.width() + 45*2){
            cloud3.pos.x = -45*2;
        }
    });

   

    const playBtn = map.add(
        [
            k.rect(250, 50, {radius: 3}),
            k.pos(k.center()),
            k.anchor("center"),
            k.area(),
            k.color(k.Color.fromHex("#000000")),
            k.outline(5, k.color(k.Color.fromHex("#ffffff")))
        ]
    );

    playBtn.add([
        k.text("Play", {size: 26}),
        k.pos(),
        k.anchor("center"),
        k.area()
    ]);

    playBtn.onClick(()=>{
        k.play("confirm", {   //Fix Sounds
            volume: 10
        });
        k.go("main");
    })

});




k.scene("main", ()=>{
    const map = k.add(
        makeBackgroundSpace(k)
    )

    k.onKeyPress("f11", async (key) => {
        if(await appWindow.isFullscreen()){
            await appWindow.setFullscreen(false);
            return;
    }
    appWindow.setFullscreen(true);
    });

    const player = map.add(
     makePlayer(k)   
    );

    player.setControls();







})



k.go("start");
