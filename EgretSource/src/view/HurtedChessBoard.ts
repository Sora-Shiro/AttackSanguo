class HurtedChessBoard extends VerticalLayout {
  chesses: HurtedChess[];
  
  constructor(parent:any, chesses: HurtedChess[]) {
    super(parent);
    this.chesses = chesses;
    for(let i = 0, len = this.chesses.length; i < len; i++) {
      this.addLayoutChild(this.chesses[i]);
    }
  }

}