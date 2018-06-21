class Card extends egret.Sprite {

  private _general: General;
  get general(): General {
    return this._general;
  }
  set general(v: General) {
    this._general = v;
    this.reDrawGeneralDetail();
  }

  private _clickable: boolean;
  get clickable(): boolean {
    return this._clickable;
  };
  set clickable(clickable: boolean) {
    if (this._clickable !== clickable) {
      this._clickable = clickable;
    }
  };

  constructor(g: General, width: number, height: number) {
    super();
    this._general = g;
    this.width = width;
    this.height = height;
    this.drawBg();
    this.reDrawGeneralDetail();
    
    this._clickable = true;
    this.touchEnabled = true;
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

   private drawBg() {
    this.graphics.beginFill(0x999999);
    this.graphics.drawRect(0, 0, this.width, this.height);
    this.graphics.endFill();

    
  }

  private reDrawGeneralDetail() {
    this.removeChildren();

    let nameText = new egret.TextField();
    nameText.x = 10;
    nameText.y = 10;
    nameText.textColor = 0xffffff;
    nameText.width = 200;
    nameText.height = 100;
    nameText.size = 35;
    nameText.text = this._general.name;
    this.addChild(nameText);

    let ylzmText = new egret.TextField();
    ylzmText.x = 150;
    ylzmText.y = 10;
    ylzmText.width = 100;
    ylzmText.height = 100;
    ylzmText.size = 35;
    ylzmText.text = this._general.yl + " : " + this._general.zm;
    this.addChild(ylzmText);

    let costText = new egret.TextField();
    costText.x = 350;
    costText.y = 10;
    costText.width = 100;
    costText.height = 100;
    costText.size = 35;
    costText.text = this._general.cost.toString();
    this.addChild(costText);

    let detailText = new egret.TextField();
    detailText.x = 25;
    detailText.y = 100;
    detailText.width = 360;
    detailText.height = 400;
    detailText.size = 35;
    detailText.text = this._general.skill.name + "\n" + this._general.skill.text;
    this.addChild(detailText);
  }
}