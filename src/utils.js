export function randomChoice() {
    return arguments[
        Math.floor(Math.random() * arguments.length)
    ];
}   