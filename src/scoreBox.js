import { saveSystem } from "./save";
import { computeRank } from "./utils";

export async function makeScoreBox(k, pos, score) {
  await saveSystem.load();

  if (score > saveSystem.data.maxScore) {
    saveSystem.data.maxScore = score;
    await saveSystem.save();
  }

  const container = k.make([
    k.rect(600, 500),
    k.pos(pos),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.area(),
    k.anchor("center"),
    k.outline(4, k.Color.fromHex("#14638e")),
  ]);

  container.add([
    k.text(`Previous best score : ${saveSystem.data.maxScore}`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, -200),
  ]);

  container.add([
    k.text(`Current score: ${score}`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, -150),
  ]);

  container.add([
    k.text(`Current rank : ${computeRank(score)}`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, 50),
  ]);

  container.add([
    k.text(`Previous best rank : ${computeRank(saveSystem.data.maxScore)}`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, 0),
  ]);

  const restartBtn = container.add([
    k.rect(200, 50, { radius: 3 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(-120, 200),
  ]);

  const homeBtn = container.add([
    k.rect(200, 50, { radius: 3 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(120, 200),
  ]);

  homeBtn.add(
    [
      k.text("Home", { size: 24 }),
      k.color(k.Color.fromHex("#d7f2f7")),
      k.area(),
      k.anchor("center"),
    ]
  )

  restartBtn.add([
    k.text("Play again", { size: 24 }),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.area(),
    k.anchor("center"),
  ]);



  function goToGame() {
    k.go("main");
  }

  restartBtn.onClick(goToGame);
  homeBtn.onClick(()=>{
    k.go("start")
  })

  return container;
}