class ChessBoard extends egret.Sprite {
  chesses: Chess[][];
  
  constructor(chesses: Chess[][]) {
    super();
    this.chesses = chesses;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let y = 0 + i * 95;
        let x = 0 + j * 94;
        let chess = chesses[i][j];
        chess.x = x;
        chess.y = y;
        this.addChild(chess);
      }
    }
  }

}