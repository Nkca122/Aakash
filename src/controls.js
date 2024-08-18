export function controls(k, pos){
    const container = k.make([
        k.rect(600, 500),
        k.pos(pos),
        k.color(k.Color.fromHex("#d7f2f7")),
        k.area(),
        k.anchor("center"),
        k.outline(4, k.Color.fromHex("#14638e")),
        k.opacity(1),
        k.z(10),
        k.fixed()
      ]);


  container.add([
    k.text(`Move Ship Up: w`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, -200),
  ]);

  container.add([
    k.text(`Move Ship Down: s`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, -150),
  ]);

  container.add([
    k.text(`Move astronaut left, right: a d`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, -100),
  ]);

  container.add([
    k.text(`Astronaut Jump: w`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, -50),
  ]);

  container.add([
    k.text(`Inspect Aliens: e OR space`, { size: 24 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-240, 0),
  ]);

  const nextBtn = container.add([
    k.rect(200, 50, { radius: 3 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(0, 200),
  ]);

  nextBtn.add(
    [
      k.text("Next", { size: 24 }),
      k.color(k.Color.fromHex("#d7f2f7")),
      k.area(),
      k.anchor("center"),
    ]
  )

  nextBtn.onClick(()=>{
    k.play("click", {
      speed: 1,
      volume: 0.2
  });
    k.go("main")
  })

  return container

    
}