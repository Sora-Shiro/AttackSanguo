class StartScene extends egret.Sprite implements ChosenEventHandler, CardTapHandler {

  private par: egret.DisplayObjectContainer;

  constructor(par) {
    super();
    this.par = par;
    this.createScene();
  }

  private totalCost = 16;
  private _remainCost: number = this.totalCost;
  public get remainCost(): number {
    return this._remainCost;
  }
  public set remainCost(v: number) {
    this._remainCost = v;
    if (this.textCost) {
      if (this._remainCost < 0) {
        this.textCost.text = "你用了太多 Cost 了，节制一下 :)\n剩余 Cost：" + this._remainCost.toString();
      } else {
        this.textCost.text = "剩余 Cost：" + this._remainCost.toString();
      }
    }
  }

  textRoom: egret.TextField;
  inputRoom: egret.TextField;
  textName: egret.TextField;
  inputName: egret.TextField;
  textCost: egret.TextField;
  btnConnect: ImgBtn;
  btnAbout: ImgBtn;

  btnBai: ImgBtn;
  btnWei: ImgBtn;
  btnShu: ImgBtn;
  btnWu: ImgBtn;
  btnQun: ImgBtn;
  btnJin: ImgBtn;
  textPower: egret.TextField;
  chosenPower: string;
  chosenGenerals: General[];
  generalSortLayout: VerticalLayout;
  generalSingleLayouts: GeneralSingleLayout[];
  cardPool: CardPool;

  textLog: egret.TextField;

  private createScene() {
    this.textRoom = new egret.TextField();
    this.textRoom.x = 60;
    this.textRoom.y = 30;
    this.textRoom.text = "房间号码";
    this.addChild(this.textRoom);

    this.inputRoom = new egret.TextField();
    this.inputRoom.width = 200;
    this.inputRoom.height = 60;
    this.inputRoom.restrict = "0-9 A-Z_a-z";
    this.inputRoom.multiline = false;
    this.inputRoom.type = egret.TextFieldType.INPUT;
    this.inputRoom.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.inputRoom.x = 200;
    this.inputRoom.y = this.textRoom.y - 20;
    this.inputRoom.background = true;
    this.inputRoom.backgroundColor = 0xffffff;
    this.inputRoom.textColor = 0x000000;
    this.inputRoom.addEventListener(egret.Event.CHANGE, this.inputRoomListen, this);
    this.addChild(this.inputRoom);

    this.textName = new egret.TextField();
    this.textName.x = 60;
    this.textName.y = this.textRoom.y + 80;
    this.textName.text = "玩家名字";
    this.addChild(this.textName);

    this.inputName = new egret.TextField();
    this.inputName.width = 200;
    this.inputName.height = 60;
    this.inputName.restrict = "0-9 A-Z_a-z";
    this.inputName.multiline = false;
    this.inputName.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.inputName.type = egret.TextFieldType.INPUT;
    this.inputName.x = 200;
    this.inputName.y = this.textName.y - 20;
    this.inputName.background = true;
    this.inputName.backgroundColor = 0xffffff;
    this.inputName.textColor = 0x000000;
    this.inputName.addEventListener(egret.Event.CHANGE, this.inputNameListen, this);
    this.addChild(this.inputName);

    let powerLayout = new HorizontalLayout(this.par);
    powerLayout.x = 60;
    powerLayout.y = this.textName.y + 60;
    powerLayout.layoutWidth = 400;
    powerLayout.layoutHeight = 50;
    powerLayout.layoutBgColorAlpha = 0;
    this.addChild(powerLayout);

    this.btnBai = new ImgBtn(this.par, 50, 50);
    this.btnBai.text = "白";
    this.btnBai.textY = 10;
    powerLayout.addLayoutChild(this.btnBai);
    this.btnWei = new ImgBtn(this.par, 50, 50);
    this.btnWei.text = "魏";
    this.btnWei.textY = 10;
    powerLayout.addLayoutChild(this.btnWei);
    this.btnShu = new ImgBtn(this.par, 50, 50);
    this.btnShu.text = "蜀";
    this.btnShu.textY = 10;
    powerLayout.addLayoutChild(this.btnShu);
    this.btnWu = new ImgBtn(this.par, 50, 50);
    this.btnWu.text = "吴";
    this.btnWu.textY = 10;
    powerLayout.addLayoutChild(this.btnWu);
    this.btnQun = new ImgBtn(this.par, 50, 50);
    this.btnQun.text = "群";
    this.btnQun.textY = 10;
    powerLayout.addLayoutChild(this.btnQun);
    this.btnJin = new ImgBtn(this.par, 50, 50);
    this.btnJin.text = "晋";
    this.btnJin.textY = 10;
    powerLayout.addLayoutChild(this.btnJin);

    this.btnBai.addEventListener("touchTap", this.onBtnBaiTap, this);
    this.btnWei.addEventListener("touchTap", this.onBtnWeiTap, this);
    this.btnShu.addEventListener("touchTap", this.onBtnShuTap, this);
    this.btnWu.addEventListener("touchTap", this.onBtnWuTap, this);
    this.btnQun.addEventListener("touchTap", this.onBtnQunTap, this);
    this.btnJin.addEventListener("touchTap", this.onBtnJinTap, this);

    this.chosenPower = "白";
    this.textPower = new egret.TextField();
    this.textPower.x = 60;
    this.textPower.y = powerLayout.y + 70;
    this.textPower.text = "当前选择势力：" + this.chosenPower + "\n"
      + "请安排武将的位置(1-6号)";
    this.addChild(this.textPower);

    this.textCost = new egret.TextField();
    this.textCost.x = 60;
    this.textCost.y = this.textPower.y + 60;
    this.textCost.text = "剩余 Cost：" + this._remainCost;
    this.addChild(this.textCost);

    this.chosenGenerals = GeneralTable.getGeneralsByPower("白");

    this.cardPool = new CardPool(this.chosenGenerals);
    this.cardPool.x = 50;
    this.cardPool.y = this.textCost.y + 60;
    this.cardPool.cardTapHandler = this;
    this.addChild(this.cardPool);

    this.generalSortLayout = new VerticalLayout(this.par);
    this.generalSortLayout.x = 60;
    this.generalSortLayout.y = this.cardPool.y + 60;
    this.generalSortLayout.layoutWidth = 400;
    this.generalSortLayout.layoutHeight = 100;
    this.generalSortLayout.layoutBgColorAlpha = 0;
    this.generalSortLayout.layoutSpacing = 8;
    this.addChild(this.generalSortLayout);
    this.setGeneralSortLayout();



    this.btnConnect = new ImgBtn(this, 350, 120);
    this.btnConnect.text = "连接";
    this.btnConnect.anchorOffsetX = 300;
    this.btnConnect.x = 600;
    this.btnConnect.y = 850;
    this.btnConnect.textY = 35;
    this.btnConnect.textSize = 35;
    this.btnConnect.addEventListener("touchTap", this.onBtnConnectTap, this);
    this.addChild(this.btnConnect);

    this.btnAbout = new ImgBtn(this, 350, 120);
    this.btnAbout.text = "关于本游戏";
    this.btnAbout.anchorOffsetX = 300;
    this.btnAbout.x = 600;
    this.btnAbout.y = this.btnConnect.y + 150;
    this.btnAbout.textY = 35;
    this.btnAbout.textSize = 35;
    this.btnAbout.addEventListener("touchTap", this.onBtnAboutTap, this);
    this.addChild(this.btnAbout);

    this.textLog = new egret.TextField();
    this.textLog.x = 60;
    this.textLog.y = 850;
    this.textLog.text = "";
    this.textLog.width = 650;
    this.textLog.height = 350;
    this.addChild(this.textLog);
  }

  private inputRoomListen() {
    if (this.inputRoom.text.length > 8) {
      let str = this.inputRoom.text;
      let after = str.slice(0, 8);
      this.inputRoom.text = after;
    }
  }

  private inputNameListen() {
    if (this.inputName.text.length > 8) {
      let str = this.inputName.text;
      let after = str.slice(0, 8);
      this.inputName.text = after;
    }
  }

  public handleCardTapEvent(card: Card) {
    let gSL = new GeneralSingleLayout(this, card.general, "0");
    gSL.eventHandler = this;
    this.generalSingleLayouts.push(gSL);
    this.generalSortLayout.addLayoutChild(gSL);

    this.checkCost();

    let left = this.cardPool.generalList.slice(0, this.cardPool.cardIndex);
    let right = this.cardPool.generalList.slice(this.cardPool.cardIndex + 1, this.cardPool.generalList.length);
    let total = left.concat(right);
    let index = this.cardPool.cardIndex;
    this.cardPool.generalList = total;
    this.cardPool.cardIndex = index - 1 < 0 ? index : index - 1;
  }

  private 

  private setGeneralSortLayout() {
    let generals = this.chosenGenerals;
    this.generalSingleLayouts = [];
    this.generalSortLayout.removeChildren();

    this.cardPool.generalList = generals;
  }

  public handleChosenEvent(g: General) {
    this.removeChosenGeneral(g);
  }

  private removeChosenGeneral(g: General) {
    for(let i = 0; i < this.generalSingleLayouts.length; i++) {
      if(g.number === this.generalSingleLayouts[i].general.number) {
        let left = this.generalSingleLayouts.slice(0, i);
        let right = this.generalSingleLayouts.slice(i + 1, this.cardPool.generalList.length);
        let giveUp = this.generalSingleLayouts[i];
        let total = left.concat(right);
        this.generalSingleLayouts = total;
        this.generalSortLayout.removeChild(giveUp);
        this.generalSortLayout.reDrawChildren();

        this.checkCost();

        let index = this.cardPool.cardIndex;
        let l = this.cardPool.generalList.slice(0, index);
        let r = this.cardPool.generalList.slice(index, this.cardPool.generalList.length);
        let m = [giveUp.general];
        let t = l.concat(m, r);
        console.log(l, r, m, t);
        this.cardPool.generalList = t;
        this.cardPool.cardIndex = index;
      }
    }
  }

  private checkCost() {
    let usedCost = 0;
    for (let i = 0; i < this.generalSingleLayouts.length; i++) {
      let gSL = this.generalSingleLayouts[i];
      usedCost += gSL.general.cost;
    }
    this.remainCost = this.totalCost - usedCost;
    if (this.remainCost < 0) {
      this.btnConnect.touchEnabled = false;
      this.btnConnect.clickable = false;
    } else {
      this.btnConnect.touchEnabled = true;
      this.btnConnect.clickable = true;
    }
  }


  private onBtnBaiTap() {
    this.onBtnPowerTap("白");
  }

  private onBtnWeiTap() {
    this.onBtnPowerTap("魏");
  }

  private onBtnShuTap() {
    this.onBtnPowerTap("蜀");
  }

  private onBtnWuTap() {
    this.onBtnPowerTap("吴");
  }

  private onBtnQunTap() {
    this.onBtnPowerTap("群");
  }

  private onBtnJinTap() {
    this.onBtnPowerTap("晋");
  }

  private onBtnPowerTap(power: string) {
    this.chosenPower = power;
    this.chosenGenerals = GeneralTable.getGeneralsByPower(power);
    this.textPower.text = "当前选择势力：" + this.chosenPower + "\n"
      + "请安排武将的位置(1-6号)";
    // Refresh cost
    this.remainCost = 16;
    this.setGeneralSortLayout();
  }

  public socket: egret.WebSocket;
  private onBtnConnectTap() {
    this.disableAllTouchable();
    this.appendLog("连接服务器中");
    let url = Constant.REMOTE_SERVER_IP;
    let port = Constant.REMOTE_SERVER_PORT;
    if (this.socket && this.socket.connected) {
      this.socket.close();
    }
    this.socket = GameSocket.getInstance();
    this.addSocketListener();
    this.socket.connect(url, 7231);
  }

  private appendLog(text: string) {
    let preLog = this.textLog.text;
    let newLog = text + "\n" + preLog;
    this.textLog.text = newLog;
  }

  private loading: boolean;
  public disableAllTouchable() {
    this.loading = true;
    this.btnAbout.touchEnabled = false;
    this.btnAbout.clickable = false;
    this.btnConnect.touchEnabled = false;
    this.btnConnect.clickable = false;
    this.btnBai.touchEnabled = false;
    this.btnBai.clickable = false;
    this.btnWei.touchEnabled = false;
    this.btnWei.clickable = false;
    this.btnShu.touchEnabled = false;
    this.btnShu.clickable = false;
    this.btnWu.touchEnabled = false;
    this.btnWu.clickable = false;
    this.btnQun.touchEnabled = false;
    this.btnQun.clickable = false;
    this.btnJin.touchEnabled = false;
    this.btnJin.clickable = false;
    this.inputRoom.type = egret.TextFieldType.DYNAMIC;
    this.inputName.type = egret.TextFieldType.DYNAMIC;
    for (let i = 0; i < this.generalSingleLayouts.length; i++) {
      let gSL = this.generalSingleLayouts[i];
      gSL.disableAllTouchable();
    }
  }

  public enableAllTouchable() {
    this.loading = false;
    this.btnAbout.touchEnabled = true;
    this.btnAbout.clickable = true;
    this.btnConnect.touchEnabled = true;
    this.btnConnect.clickable = true;
    this.btnBai.touchEnabled = true;
    this.btnBai.clickable = true;
    this.btnWei.touchEnabled = true;
    this.btnWei.clickable = true;
    this.btnShu.touchEnabled = true;
    this.btnShu.clickable = true;
    this.btnWu.touchEnabled = true;
    this.btnWu.clickable = true;
    this.btnQun.touchEnabled = true;
    this.btnQun.clickable = true;
    this.btnJin.touchEnabled = true;
    this.btnJin.clickable = true;
    this.inputRoom.type = egret.TextFieldType.INPUT;
    this.inputName.type = egret.TextFieldType.INPUT;
    for (let i = 0; i < this.generalSingleLayouts.length; i++) {
      let gSL = this.generalSingleLayouts[i];
      gSL.enableAllTouchable();
    }
  }

  private onSocketOpen(): void {
    console.log("open");
    this.sendChosenData();
  }

  
  private sendChosenData() {
    let roomName = this.inputRoom.text;
    let userName = this.inputName.text;

    let gDetail = [];
    for (let i = 0; i < this.generalSingleLayouts.length; i++) {
      let gSL = this.generalSingleLayouts[i];
      let data = {
        "num": gSL.general.number,
        "pos": gSL.pos
      };
      gDetail.push(data);
    }

    let data = JSON.stringify({
      "reqStr": "enterRoom",
      "roomName": roomName,
      "userName": userName,
      "gDetail": gDetail,
    });
    this.socket.writeUTF(data);
  }

  private onSocketClose(): void {
    console.log("close");
    this.enableAllTouchable();
  }

  private onSocketError(): void {
    console.log("error");
    this.enableAllTouchable();
  }

  private onReceiveMessage(e: egret.Event): void {
    let data = this.socket.readUTF();
    data = JSON.parse(data);
    console.log(data);
    if (data["msg"]) {
      this.appendLog(data["msg"]);
    }
    let status = data["status"];
    if (status === 1) {
      let reqStr = data["reqStr"];
      switch (reqStr) {
        case "startGame":
          this.startGame(data);
      }
    }
  }

  private startGame(data) {
    let msg = data["msg"];

    let upPlayer = data["upPlayer"];
    let downPlayer = data["downPlayer"];
    let otherPlayers = data["otherPlayers"];
    let camp = 0;
    if (upPlayer === this.inputName.text) {
      camp = -1;
    } else if (downPlayer === this.inputName.text) {
      camp = 1;
    }
    let currentCamp = data["currentCamp"];

    let leftChesses = data["leftChesses"];
    let rightChesses = data["rightChesses"];
    let chesses = data["chesses"];
    let finalLeft: HurtedChess[] = [];
    let finalRight: HurtedChess[] = [];
    let finalC: Chess[][] = [];
    for (let i = 0; i < leftChesses.length; i++) {
      let chess = leftChesses[i];
      let g = leftChesses[i]["g"];
      let general = null;
      if (g) {
        general = GeneralTable.getGeneralTable()[g["number"]];
      }
      finalLeft.push(new HurtedChess(general));
    }
    for (let i = 0; i < rightChesses.length; i++) {
      let chess = rightChesses[i];
      let g = rightChesses[i]["g"];
      let general = null;
      if (g) {
        general = GeneralTable.getGeneralTable()[g["number"]];
      }
      finalRight.push(new HurtedChess(general));
    }
    for (let i = 0; i < 6; i++) {
      let chessrow = [];
      for (let j = 0; j < 6; j++) {
        let chessData = chesses[i][j];
        let g = chessData["g"];
        let general = null;
        if (g) {
          general = GeneralTable.getGeneralTable()[g["number"]];
        }
        let camp = chessData["camp"];
        let chess = new Chess("normal", general);
        chess.camp = camp;
        chessrow.push(chess);
      }
      finalC.push(chessrow);
    }

    let initData = new InitData();
    initData.playerCamp = camp;
    initData.currentCamp = currentCamp;
    initData.leftChesses = finalLeft;
    initData.rightChesses = finalRight;
    initData.chesses = finalC;
    initData.upPower = data["upPower"];
    initData.downPower = data["downPower"];

    this.removeSocketListener();
    let gameScene = new GameScene(this.par, initData, this);
    this.par.addChild(gameScene);
  }

  private onBtnAboutTap() {
    let aboutScene = new AboutScene(this.par);
    aboutScene.x = 0;
    aboutScene.y = 0;
    this.par.addChild(aboutScene);
  }

  private getChesses(): Chess[][] {
    let chesses: Chess[][] = [];
    for (let i = 0; i < 6; i++) {
      let chessrow = [];
      for (let j = 0; j < 6; j++) {
        let g = General.getRandomGeneral();
        let chess = new Chess("normal", ((i === 0 || i === 5) && j < 4) ?
          g : null);
        let camp = 0;
        if (i === 0 && j < 4) {
          camp = -1;
        } else if (i === 5 && j < 4) {
          camp = 1;
        }
        chess.camp = camp;
        chessrow.push(chess);
      }
      chesses.push(chessrow);
    }
    return chesses;
  }

  public removeSocketListener() {
    this.socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    this.socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
    this.socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
    this.socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
  }

  public addSocketListener() {
    this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
    this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
    this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
  }

}