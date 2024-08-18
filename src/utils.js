export function randomChoice() {
    return arguments[
        Math.floor(Math.random() * arguments.length)
    ];
}   

export function computeRank(score) {
    if (score > 600) {
      return "S";
    }
  
    if (score > 400) {
      return "A";
    }
  
    if (score > 200) {
      return "B";
    }
  
    if (score > 50) {
      return "C";
    }
  
    return "D";
  }