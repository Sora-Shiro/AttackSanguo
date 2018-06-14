class GeneralSingleLayout extends egret.Sprite {

  private chosenView: eui.CheckBox;
  private gName: egret.TextField;
  private gPos: egret.TextField;

  private _chosenEventHandler: ChosenEventHandler;
  public get eventHandler(): ChosenEventHandler {
    return this._chosenEventHandler;
  }
  public set eventHandler(v: ChosenEventHandler) {
    this._chosenEventHandler = v;
  }

  private _general: General;
  public get general(): General {
    return this._general;
  }

  private _pos: string;
  public get pos(): string {
    return this._pos;
  }
  public set pos(v: string) {
    this._pos = v;
    this.gPos.text = this._pos;
  }

  private _chosen: boolean;
  public get chosen(): boolean {
    return this._chosen;
  }
  public set chosen(v: boolean) {
    this._chosen = v;
    this.chosenView.selected = this._chosen;
  }

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

  constructor(parent: any, general: General, pos: string) {
    super();
    this._layoutWidth = 573;
    this._layoutHeight = 573;
    this._layoutBgColor = 0xeeeeee;
    this._layoutBgColorAlpha = 1;
    this._layoutSpacing = 20;
    this._layoutPaddingTop = 0;
    this._layoutPaddingLeft = 0;
    this._general = general;
    this._chosen = false;
    this._pos = pos;
    this.reDraw();
  }

  private reDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this._layoutBgColor, this._layoutBgColorAlpha);
    this.graphics.drawRect(0, 0, this._layoutWidth, this._layoutHeight);
    this.graphics.endFill();
    this.chosenView = new eui.CheckBox();
    this.chosenView.addEventListener(
      eui.UIEvent.CHANGE,
      this.chosenEvent,
      this
    );
    this.addLayoutChild(this.chosenView);
    this.gName = new egret.TextField();
    this.gName.text = this.general.name;
    this.addLayoutChild(this.gName);
    this.gPos = new egret.TextField();
    this.gPos.width = 50;
    this.gPos.restrict = "1-6";
    this.gPos.text = this._pos;
    this.gPos.multiline = false;
    this.gPos.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.gPos.type = egret.TextFieldType.INPUT;
    this.gPos.background = true;
    this.gPos.backgroundColor = 0xffffff;
    this.gPos.textColor = 0x000000;
    this.gPos.addEventListener(egret.Event.CHANGE, this.inputPosListen, this);
  }

  private chosenEvent(evt: eui.UIEvent) {
    if(this._chosenEventHandler) {
      this._chosenEventHandler.handleChosenEvent(this.chosenView.selected);
    }
  }

  private inputPosListen(evt: egret.Event) {
    let target: egret.TextField = evt.target;
    if (target.text.length > 1) {
      let str = target.text;
      let after = str.slice(0, 1);
      target.text = after;
    }
  }

  public enableAllTouchable() {
    this.gPos.type = egret.TextFieldType.INPUT;
  }

  public disableAllTouchable() {
    this.gPos.type = egret.TextFieldType.DYNAMIC;
  }

  public reDrawChildren() {
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
      child.x = sprite.x + sprite.width + this._layoutSpacing;
      child.y = this._layoutPaddingTop;
      this.addChild(child);
    }
  }

}