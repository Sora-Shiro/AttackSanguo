class CardPool extends egret.Sprite {

  public cardTapHandler: CardTapHandler;

  public currentCard: Card;
  private cards: Card[];
  public leftBtn: ImgBtn;
  public rightBtn: ImgBtn;

  private _generalList: General[];
  get generalList(): General[] {
    return this._generalList;
  }
  set generalList(v: General[]) {
    this._generalList = v;
    this.reDraw();
    this.checkBtnEnabled();
  }

  private _cardIndex: number;
  get cardIndex(): number {
    return this._cardIndex;
  }
  set cardIndex(v: number) {
    this._cardIndex = v;
    this.drawCard();
    this.checkBtnEnabled();
  }

  constructor(generalList: General[]) {
    super();
    this.width = 600;
    this.height = 500;
    this._generalList = generalList;
    this.reDraw();
  }

  private reDraw() {
    this.removeChildren();
    this.drawLRBtns();
    this.prepareCards();
    this.drawCard();
  }

  private drawBg() {
    this.graphics.beginFill(0xeeeeeeee);
    this.graphics.drawRect(0, 0, this.width, this.height);
    this.graphics.endFill();
  }

  private drawLRBtns() {
    let btnHeight = 80;
    let btnWidth = 80;

    this.leftBtn = new ImgBtn(this, btnWidth, btnHeight);
    this.leftBtn.x = 5;
    this.leftBtn.y = (this.height - btnHeight) / 2;
    this.leftBtn.addEventListener("touchTap", this.onLeftBtnTap, this);
    this.addChild(this.leftBtn);

    this.rightBtn = new ImgBtn(this, btnWidth, btnHeight);
    this.rightBtn.x = this.width - 5 - btnWidth;
    this.rightBtn.y = (this.height - btnHeight) / 2;
    this.rightBtn.addEventListener("touchTap", this.onRightBtnTap, this);
    this.addChild(this.rightBtn);
  }

  private prepareCards() {
    this.cards = [];
    this._cardIndex = 0;
    for (let i = 0; i < this._generalList.length; i++) {
      let g = this._generalList[i];
      let card = new Card(g, 400, this.height);
      this.cards.push(card);
    }
  }

  public generateCard(g: General) {
    return new Card(g, 400, this.height);
  }

  private checkBtnEnabled() {
    if (this._cardIndex <= 0) {
      this.leftBtn.touchEnabled = false;
      this.leftBtn.clickable = false;
    } else {
      this.leftBtn.touchEnabled = true;
      this.leftBtn.clickable = true;
    }
    if (this._cardIndex >= this.cards.length - 1) {
      this.rightBtn.touchEnabled = false;
      this.rightBtn.clickable = false;
    } else {
      this.rightBtn.touchEnabled = true;
      this.rightBtn.clickable = true;
    }
  }

  private drawCard() {
    if (this.$children.indexOf(this.currentCard) != -1) {
      this.removeChild(this.currentCard);
    }
    let index = this._cardIndex;
    if (this.cards.length > 0) {
      this.currentCard = this.cards[index];
      this.currentCard.x = 100;
      this.currentCard.y = 0;
      this.addChild(this.currentCard);
      this.currentCard.addEventListener("touchTap", this.onCardTap, this);
    } else {
      
    }

  }

  private onCardTap() {
    if (this.cardTapHandler) {
      this.cardTapHandler.handleCardTapEvent(this.currentCard);
    }
  }

  private onLeftBtnTap(e: egret.Event) {
    this.cardIndex -= 1;
    this.checkBtnEnabled();
  }

  private onRightBtnTap(e: egret.Event) {
    this.cardIndex += 1;
    this.checkBtnEnabled();
  }

}