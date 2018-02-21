class VerticalLayout extends egret.Sprite {

  private _layoutWidth: number;
  public get layoutWidth(): number {
    return this._layoutWidth;
  }
  public set layoutWidth(v: number) {
    this._layoutWidth = v;
    this.reDraw();
  }


  private _layoutHeight: number;
  public get layoutHeight(): number {
    return this._layoutHeight;
  }
  public set layoutHeight(v: number) {
    this._layoutHeight = v;
    this.reDraw();
  }


  private _layoutBgColor: number;
  public get layoutBgColor(): number {
    return this._layoutBgColor;
  }
  public set layoutBgColor(v: number) {
    this._layoutBgColor = v;
    this.reDraw();
  }


  private _layoutBgColorAlpha: number;
  public get layoutBgColorAlpha(): number {
    return this._layoutBgColorAlpha;
  }
  public set layoutBgColorAlpha(v: number) {
    this._layoutBgColorAlpha = v;
    this.reDraw();
  }


  private _layoutPaddingTop: number;
  public get layoutPaddingTop(): number {
    return this._layoutPaddingTop;
  }
  public set layoutPaddingTop(v: number) {
    this._layoutPaddingTop = v;
    this.reDrawChildren();
  }


  private _layoutPaddingLeft: number;
  public get layoutPaddingLeft(): number {
    return this._layoutPaddingLeft;
  }
  public set layoutPaddingLeft(v: number) {
    this._layoutPaddingLeft = v;
    this.reDrawChildren();
  }

  private _layoutSpacing: number;
  public get layoutSpacing(): number {
    return this._layoutSpacing;
  }
  public set layoutSpacing(v: number) {
    this._layoutSpacing = v;
    this.reDrawChildren();
  }

  constructor(parent: any) {
    super();
    this._layoutWidth = 573;
    this._layoutHeight = 573;
    this._layoutBgColor = 0xeeeeee;
    this._layoutBgColorAlpha = 1;
    this._layoutSpacing = 20;
    this._layoutPaddingTop = 0;
    this._layoutPaddingLeft = 0;
    this.reDraw();
  }

  private reDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this._layoutBgColor, this._layoutBgColorAlpha);
    this.graphics.drawRect(0, 0, this._layoutWidth, this._layoutHeight);
    this.graphics.endFill();
  }

  private reDrawChildren() {
    let children = [];
    for(let i = 0, len = this.$children.length; i < len; i++) {
      children.push(this.$children[i]);
    }
    this.removeChildren();
    for (let i = 0, len = children.length; i < len; i++) {
      this.addLayoutChild(children[i]);
    }
  }

  public addLayoutChild(child: egret.DisplayObject, pos: number = this.$children.length - 1) {
    let len = this.$children.length;
    if (len === 0) {
      child.x = this._layoutPaddingLeft;
      child.y = this._layoutPaddingTop;
      this.addChild(child);
    } else {
      let sprite = this.getChildAt(len - 1);
      child.x = this._layoutPaddingLeft;
      child.y = sprite.y + sprite.height + this._layoutSpacing;
      this.addChild(child);
    }
  }

}