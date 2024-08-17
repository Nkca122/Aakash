export function progressBar(k) {
    return k.add(
        [
            k.rect(k.width() * 0.8, 10, {
                radius: 16
            }),
            k.outline(2, k.Color.fromHex("#000000")),
            k.pos(k.center().x, 20),
            k.anchor("center"),
            k.area(),
            k.color(k.RED),
            k.fixed(),
            k.z(4),
            {
                tick(survivalTime) {
                    this.width = (100 - survivalTime) / 100 * k.width() * 0.8;
                    this.height = 10;
                    this.color = (survivalTime < 33 ? k.RED : survivalTime < 66 ? k.YELLOW : survivalTime <= 100 ? k.Color.fromHex("#008000") : null)
                }
            }
        ]
    );
} 