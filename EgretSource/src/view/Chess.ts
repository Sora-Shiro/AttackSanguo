class Chess extends egret.Sprite {

  private _status: string;
  get status(): string {
    return this._status;
  };
  set status(status: string) {
    if (this._status !== status) {
      this._status = status;
      this.reDrawBg();
    }
  };

  private _general: General;
  get general(): General {
    return this._general;
  };
  set general(general: General) {
    this._general = general;
    this.drawTextFields();
  };

  powerText: egret.TextField;
  armsText: egret.TextField;
  nameText: egret.TextField;
  yongText: egret.TextField;
  fuText: egret.TextField;
  tlText: egret.TextField;

  camp: number;

  constructor(status: string = "normal", general: General = null) {
    super();
    this._status = status;
    this._general = general;
    this.camp = 0;
    this.createTextFields();
    this.reDraw();
  }

  private reDraw() {
    this.reDrawBg();
    this.drawTextFields();
  }

  private reDrawBg() {
    this.graphics.clear();
    let bgColor = 0xffffff;
    switch (this.status) {
      case "normal":
        bgColor = 0xffffff;
        break;
      case "normal_confirm":
        bgColor = 0x999999;
        break;
      case "mover":
        bgColor = 0xF0F8FF;
        break;
      case "moveable":
        bgColor = 0xB0C4DE;
        break;
      case "moveable_confirm":
        bgColor = 0xcfe1f7;
        break;
      case "attacker":
        bgColor = 0xFFF0F5;
        break;
      case "attackable":
        bgColor = 0xFFC0CB;
        break;
      case "attackable_confirm":
        bgColor = 0xffcdd6;
        break;
      case "revival":
        bgColor = 0xfff17a;
        break;
      case "revival_confirm":
        bgColor = 0xfff5a2;
        break;
      case "skillable":
        bgColor = 0x7FFFAA;
        break;
      case "skillable_confirm":
        bgColor = 0x00FA9A;
        break;
    }
    this.graphics.beginFill(bgColor);
    this.graphics.drawRect(0, 0, 91, 92);
    this.graphics.endFill();
  }

  static defaultTextColor: number = 0x000000;

  private createTextFields() {
    this.powerText = new egret.TextField();
    this.powerText.x = 3;
    this.powerText.y = 5;
    this.powerText.textColor = Chess.defaultTextColor;
    this.powerText.size = 28;
    this.powerText.fontFamily = "KaiTi";

    this.armsText = new egret.TextField();
    this.armsText.x = 6;
    this.armsText.y = 64;
    this.armsText.textColor = Chess.defaultTextColor;
    this.armsText.size = 20;
    this.armsText.fontFamily = "KaiTi";

    this.nameText = new egret.TextField();
    this.nameText.x = 34;
    this.nameText.y = 23;
    this.nameText.width = 30;
    this.nameText.textColor = Chess.defaultTextColor;
    this.nameText.size = 20;
    this.nameText.fontFamily = "KaiTi";
    this.nameText.wordWrap = true;
    this.nameText.lineSpacing = 0;

    this.yongText = new egret.TextField();
    this.yongText.x = 65;
    this.yongText.y = 8;
    this.yongText.textColor = Chess.defaultTextColor;
    this.yongText.size = 20;
    this.yongText.fontFamily = "KaiTi";

    this.fuText = new egret.TextField();
    this.fuText.x = 65;
    this.fuText.y = 36;
    this.fuText.textColor = Chess.defaultTextColor;
    this.fuText.size = 20;
    this.fuText.fontFamily = "KaiTi";

    this.tlText = new egret.TextField();
    this.tlText.x = 60;
    this.tlText.y = 63;
    this.tlText.textColor = Chess.defaultTextColor;
    this.tlText.size = 26;
    this.tlText.fontFamily = "KaiTi";
    this.tlText.textAlign = "right";

    this.addChild(this.powerText);
    this.addChild(this.armsText);
    this.addChild(this.nameText);
    this.addChild(this.yongText);
    this.addChild(this.fuText);
    this.addChild(this.tlText);
  }

  private drawTextFields() {
    let g = this._general;
    if (g) {
      this.powerText.text = g.power;
      this.armsText.text = g.arms;
      this.nameText.text = g.name;
      this.yongText.text = g.yong ? "勇" : "";
      this.fuText.text = g.fu ? "伏" : "";
      this.tlText.text = g.tl.toString();
    } else {
      this.powerText.text = "";
      this.armsText.text = "";
      this.nameText.text = "";
      this.yongText.text = "";
      this.fuText.text = "";
      this.tlText.text = "";
    }
  }

}