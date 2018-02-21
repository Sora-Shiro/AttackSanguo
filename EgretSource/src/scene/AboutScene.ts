class AboutScene extends egret.Sprite {

  private par: egret.DisplayObjectContainer;

  constructor(par) {
    super();
    this.par = par;
    this.createScene();
  }

  private createScene() {
    let bg = new egret.Sprite();
    bg.graphics.beginFill(0x000000);
    bg.graphics.drawRect(0, 0, 750, 1300);
    bg.graphics.endFill();
    this.addChild(bg);

    let text = new egret.TextField();
    let creatorDetail = `
游戏名称：攻三联机版

版本号：v1.0


美术设计：粉条
数据设计：基迈
程序设计：糊糊（github.com/SoraShiro）
    `;
    text.text = creatorDetail;
    text.textColor = 0xffffff;
    text.x = 80;
    text.y = 80;
    this.addChild(text);
    this.touchEnabled = true;
    this.addEventListener("touchTap", this.finish, this, true);
  }

  private finish() {
    this.par.removeChild(this);
  }
}