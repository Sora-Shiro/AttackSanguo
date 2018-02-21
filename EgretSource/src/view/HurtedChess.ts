class HurtedChess extends egret.Sprite {

  private _status: string;
  public get status(): string {
    return this._status;
  }
  public set status(v: string) {
    if (this._status !== status) {
      this._status = v;
      this.setTextFieldsColor();
    }
  }

  private _general: General;
  public get general(): General {
    return this._general;
  }
  public set general(v: General) {
    this._general = v;
    this.drawTextFields();
  }


  private _bgColorAlpha: number;
  public get bgColorAlpha(): number {
    return this._bgColorAlpha;
  }
  public set bgColorAlpha(v: number) {
    this._bgColorAlpha = v;
    this.reDrawBg();
  }

  camp: number;

  nameText: egret.TextField;
  hurtTurnsText: egret.TextField;
  constructor(g: General = null) {
    super();
    this._general = g;
    this._bgColorAlpha = 0;
    if (this._general) {
      this._status = g.hurtTurns === 0 ? "recover" : "hurt";
    }
    this.camp = 0;
    this.touchEnabled = true;
    this.reDraw();
    this.addEventListener("touchBegin", function () {
      this.bgColorAlpha = 0.5;
    }, this);
    this.addEventListener("touchReleaseOutside", function () {
      this.bgColorAlpha = 0;
    }, this);
    this.addEventListener("touchEnd", function () {
      this.bgColorAlpha = 0;
    }, this);
  }

  private reDraw() {
    this.removeChildren();
    this.reDrawBg();
    this.createTextFields();
    this.drawTextFields();
  }

  private reDrawBg() {
    this.graphics.clear();
    let bgColor = 0xeeeeee;
    this.graphics.beginFill(bgColor, this._bgColorAlpha);
    this.graphics.drawRect(0, 0, 60, 87);
    this.graphics.endFill();
  }

  private createTextFields() {
    this.nameText = new egret.TextField();
    this.nameText.x = 12;
    this.nameText.y = 25;
    this.nameText.size = 25;
    this.nameText.width = 30;
    this.nameText.fontFamily = "KaiTi";
    this.nameText.wordWrap = true;
    this.nameText.lineSpacing = 0;

    this.hurtTurnsText = new egret.TextField();
    this.hurtTurnsText.x = 38;
    this.hurtTurnsText.y = 7;
    this.hurtTurnsText.size = 25;
    this.hurtTurnsText.fontFamily = "KaiTi";
    this.hurtTurnsText.wordWrap = true;
    this.hurtTurnsText.lineSpacing = 0;

    this.addChild(this.nameText);
    this.addChild(this.hurtTurnsText);
  }

  private drawTextFields() {
    let g = this._general;
    if (g) {
      this.nameText.text = g.name;
      this.hurtTurnsText.text = String(g.hurtTurns);
      this._status = g.hurtTurns === 0 ? "recover" : "hurt";
      this.setTextFieldsColor();
    } else {
      this.nameText.text = "";
      this.hurtTurnsText.text = "";
    }
  }

  private setTextFieldsColor() {
    let textColor = 0xffffff;
    switch (this._status) {
      case "hurt":
        textColor = 0xcccccc;
        break;
      case "hurt_confirm":
        textColor = 0xffffff;
        break;
      case "recover":
        textColor = 0xa5c1d8;
        break;
      case "recover_confirm":
        textColor = 0xc6e5ff;
        break;
    }
    this.nameText.textColor = textColor;
    this.hurtTurnsText.textColor = textColor;
  }
}