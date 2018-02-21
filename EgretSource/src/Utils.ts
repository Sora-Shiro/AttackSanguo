class Utils {
  static is2dAdjacent(i: number, j: number, k: number, l: number) {
    let dx = Math.abs(k - i);
    let dy = Math.abs(l - j);
    let result = false;
    if (dx === 0 && dy === 1) {
      result = true;
    } else if (dx === 1 && dy === 0) {
      result = true;
    }
    return result;
  }
}