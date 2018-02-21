class LoadingScene extends egret.Sprite {

  private par: egret.DisplayObjectContainer;

  constructor(par) {
    super();
    this.par = par;
    this.createScene();
  }

  
  private _mainText : string;
  public get mainText() : string {
    return this._mainText;
  }
  public set mainText(v : string) {
    this._mainText = v;
  }
  
  bg: egret.Sprite;
  textMain: egret.TextField;

  private createScene() {
    this.bg = new egret.Sprite();
    this.bg.graphics.beginFill(0xffffff, 0.5);
    this.bg.addEventListener("touchTap", this.onBgTap, this, true);
  }

  private onBgTap() {
    
  }
}