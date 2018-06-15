class CheckBox extends egret.Sprite {

  private _selected: boolean;
  public get selected(): boolean {
    return this._selected;
  }
  public set selected(v: boolean) {
    this._selected = v;
    if (v) {
      this._text = "P";
    } else {
      this._text = "";
    }
    this.reDraw();
  }

  private _btnWidth: number;
  public get btnWidth(): number {
    return this._btnWidth;
  }
  public set btnWidth(v: number) {
    this._btnWidth = v;
    this.reDraw();
  }

  private _btnHeight: number;
  public get btnHeight(): number {
    return this._btnHeight;
  }
  public set btnHeight(v: number) {
    this._btnHeight = v;
    this.reDraw();
  }

  private _btnBgColor: number;
  public get btnBgColor(): number {
    return this._btnBgColor;
  }
  public set btnBgColor(v: number) {
    this._btnBgColor = v;
    this.reDraw();
  }

  private _btnBgColorAlpha: number;
  public get btnBgColorAlpha(): number {
    return this._btnBgColorAlpha;
  }
  public set btnBgColorAlpha(v: number) {
    this._btnBgColorAlpha = v;
    this.reDraw();
  }

  private _text: string;

  private _textY: number;
  public get textY(): number {
    return this._textY;
  }
  public set textY(v: number) {
    if (this._textY !== v) {
      this._textY = v;
      this.reDraw();
    }
  }

  private _textSize: number;
  public get textSize(): number {
    return this._textSize;
  }
  public set textSize(v: number) {
    if (this._textSize !== v) {
      this._textSize = v;
      this.reDraw();
    }
  }

  private _clickable: boolean;
  get clickable(): boolean {
    return this._clickable;
  };
  set clickable(clickable: boolean) {
    if (this._clickable !== clickable) {
      this._clickable = clickable;
      this.reDraw();
    }
  };

  private _img: egret.Bitmap;
  get img(): egret.Bitmap {
    return this._img;
  };
  set img(img: egret.Bitmap) {
    if (this._img !== img) {
      this._img = img;
      this.reDraw();
    }
  };

  textView: egret.TextField;
  onClick: Function;

  constructor(parent: any, btnWidth: number = 491, btnHeight: number = 76) {
    super();
    this._btnWidth = btnWidth;
    this._btnHeight = btnHeight;
    this._btnBgColor = 0x737373;
    this._btnBgColorAlpha = 1;
    this._text = "";
    this._textY = 24;
    this._textSize = 28;
    this._clickable = true;
    this.touchEnabled = true;
    this._selected = false;
    this.reDraw();
    this.addEventListener("touchBegin", function () {
      this.alpha = 0.5;
    }, this);
    this.addEventListener("touchReleaseOutside", function () {
      this.alpha = this.clickable ? 1 : 0.5;
    }, this);
    this.addEventListener("touchEnd", function () {
      this.alpha = this.clickable ? 1 : 0.5;
    }, this);

  }

  public reDraw() {
    this.graphics.clear();
    this.removeChildren();

    this.graphics.beginFill(this._btnBgColor, this._btnBgColorAlpha);
    this.graphics.drawRect(0, 0, this._btnWidth, this._btnHeight);
    this.graphics.endFill();

    if (this.img) {
      this.addChild(this.img);
    }

    this.textView = new egret.TextField();
    this.textView.textColor = 0xffffff;
    this.textView.size = this._textSize;
    this.textView.fontFamily = "KaiTi";
    this.textView.text = this._text;
    this.textView.width = this.width;
    this.textView.textAlign = "center";
    this.textView.y = this._textY;

    this.alpha = this.clickable ? 1 : 0.5;
    this.addChild(this.textView);
  }

}