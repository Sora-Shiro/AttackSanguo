class StartScene extends egret.Sprite {

  private par: egret.DisplayObjectContainer;

  constructor(par) {
    super();
    this.par = par;
    this.createScene();
  }

  textRoom: egret.TextField;
  inputRoom: egret.TextField;
  textName: egret.TextField;
  inputName: egret.TextField;
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
  generalSortLayout: HorizontalLayout;
  g1Name: egret.TextField;
  g1Pos: egret.TextField;
  g2Name: egret.TextField;
  g2Pos: egret.TextField;
  g3Name: egret.TextField;
  g3Pos: egret.TextField;
  g4Name: egret.TextField;
  g4Pos: egret.TextField;

  textLog: egret.TextField;

  private createScene() {
    this.textRoom = new egret.TextField();
    this.textRoom.x = 60;
    this.textRoom.y = 120;
    this.textRoom.text = "房间号码";
    this.addChild(this.textRoom);

    this.inputRoom = new egret.TextField();
    this.inputRoom.width = 300;
    this.inputRoom.height = 80;
    this.inputRoom.restrict = "0-9 A-Z_a-z";
    this.inputRoom.multiline = false;
    this.inputRoom.type = egret.TextFieldType.INPUT;
    this.inputRoom.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.inputRoom.x = 200;
    this.inputRoom.y = 100;
    this.inputRoom.background = true;
    this.inputRoom.backgroundColor = 0xffffff;
    this.inputRoom.textColor = 0x000000;
    this.inputRoom.addEventListener(egret.Event.CHANGE, this.inputRoomListen, this);
    this.addChild(this.inputRoom);

    this.textName = new egret.TextField();
    this.textName.x = 60;
    this.textName.y = 220;
    this.textName.text = "玩家名字";
    this.addChild(this.textName);

    this.inputName = new egret.TextField();
    this.inputName.width = 300;
    this.inputName.height = 80;
    this.inputName.restrict = "0-9 A-Z_a-z";
    this.inputName.multiline = false;
    this.inputName.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.inputName.type = egret.TextFieldType.INPUT;
    this.inputName.x = 200;
    this.inputName.y = 200;
    this.inputName.background = true;
    this.inputName.backgroundColor = 0xffffff;
    this.inputName.textColor = 0x000000;
    this.inputName.addEventListener(egret.Event.CHANGE, this.inputNameListen, this);
    this.addChild(this.inputName);

    let powerLayout = new HorizontalLayout(this.par);
    powerLayout.x = 60;
    powerLayout.y = 310;
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
    this.textPower.y = 390;
    this.textPower.text = "当前选择势力：" + this.chosenPower + "\n"
      + "请安排武将的位置(1-6号)";
    this.addChild(this.textPower);

    this.chosenGenerals = GeneralTable.getBaiGenerals();

    this.generalSortLayout = new HorizontalLayout(this.par);
    this.generalSortLayout.x = 60;
    this.generalSortLayout.y = 460;
    this.generalSortLayout.layoutWidth = 400;
    this.generalSortLayout.layoutHeight = 100;
    this.generalSortLayout.layoutBgColorAlpha = 0;
    this.generalSortLayout.layoutSpacing = 8;
    this.addChild(this.generalSortLayout);

    this.g1Name = new egret.TextField();
    this.generalSortLayout.addLayoutChild(this.g1Name);
    this.g1Pos = new egret.TextField();
    this.g1Pos.width = 50;
    this.g1Pos.restrict = "1-6";
    this.g1Pos.text = "1";
    this.g1Pos.multiline = false;
    this.g1Pos.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.g1Pos.type = egret.TextFieldType.INPUT;
    this.g1Pos.background = true;
    this.g1Pos.backgroundColor = 0xffffff;
    this.g1Pos.textColor = 0x000000;
    this.g1Pos.addEventListener(egret.Event.CHANGE, this.inputPosListen, this);
    this.generalSortLayout.addLayoutChild(this.g1Pos);
    this.g2Name = new egret.TextField();
    this.generalSortLayout.addLayoutChild(this.g2Name);
    this.g2Pos = new egret.TextField();
    this.g2Pos.width = 50;
    this.g2Pos.restrict = "1-6";
    this.g2Pos.text = "2";
    this.g2Pos.multiline = false;
    this.g2Pos.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.g2Pos.type = egret.TextFieldType.INPUT;
    this.g2Pos.background = true;
    this.g2Pos.backgroundColor = 0xffffff;
    this.g2Pos.textColor = 0x000000;
    this.g2Pos.addEventListener(egret.Event.CHANGE, this.inputPosListen, this);
    this.generalSortLayout.addLayoutChild(this.g2Pos);
    this.g3Name = new egret.TextField();
    this.generalSortLayout.addLayoutChild(this.g3Name);
    this.g3Pos = new egret.TextField();
    this.g3Pos.width = 50;
    this.g3Pos.restrict = "1-6";
    this.g3Pos.text = "3";
    this.g3Pos.multiline = false;
    this.g3Pos.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.g3Pos.type = egret.TextFieldType.INPUT;
    this.g3Pos.background = true;
    this.g3Pos.backgroundColor = 0xffffff;
    this.g3Pos.textColor = 0x000000;
    this.g3Pos.addEventListener(egret.Event.CHANGE, this.inputPosListen, this);
    this.generalSortLayout.addLayoutChild(this.g3Pos);
    this.g4Name = new egret.TextField();
    this.generalSortLayout.addLayoutChild(this.g4Name);
    this.g4Pos = new egret.TextField();
    this.g4Pos.width = 50;
    this.g4Pos.restrict = "0-9";
    this.g4Pos.text = "4";
    this.g4Pos.multiline = false;
    this.g4Pos.verticalAlign = egret.VerticalAlign.MIDDLE;
    this.g4Pos.type = egret.TextFieldType.INPUT;
    this.g4Pos.background = true;
    this.g4Pos.backgroundColor = 0xffffff;
    this.g4Pos.textColor = 0x000000;
    this.g4Pos.addEventListener(egret.Event.CHANGE, this.inputPosListen, this);
    this.generalSortLayout.addLayoutChild(this.g4Pos);
    this.setGeneralSortLayout();

    this.btnConnect = new ImgBtn(this, 600, 120);
    this.btnConnect.text = "连接";
    this.btnConnect.anchorOffsetX = 300;
    this.btnConnect.x = 750 / 2;
    this.btnConnect.y = 530;
    this.btnConnect.textY = 35;
    this.btnConnect.textSize = 35;
    this.btnConnect.addEventListener("touchTap", this.onBtnConnectTap, this);
    this.addChild(this.btnConnect);

    this.btnAbout = new ImgBtn(this, 600, 120);
    this.btnAbout.text = "关于本游戏";
    this.btnAbout.anchorOffsetX = this.btnAbout.btnWidth / 2;
    this.btnAbout.x = 750 / 2;
    this.btnAbout.y = 680;
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

  private inputPosListen(evt: egret.Event) {
    console.log(evt);
    let target: egret.TextField = evt.target;
    if (target.text.length > 1) {
      let str = target.text;
      let after = str.slice(0, 1);
      target.text = after;
    }
  }

  private setGeneralSortLayout() {
    let generals = this.chosenGenerals;
    this.g1Name.text = generals[0].name;
    this.g2Name.text = generals[1].name;
    this.g3Name.text = generals[2].name;
    this.g4Name.text = generals[3].name;
    this.generalSortLayout.reDrawChildren();
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
    this.setGeneralSortLayout();
  }

  public socket: egret.WebSocket;
  private onBtnConnectTap() {
    this.disableAllTouchable();
    this.appendLog("连接服务器中");
    // let url = `127.168.0.1`;
    let url = `23.83.226.192`;
    if (this.socket && this.socket.connected) {
      this.socket.close();
    }
    this.socket = GameSocket.getInstance();
    this.addSocketListener();
    this.socket.connect(url, 8000);
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
    this.g1Pos.type = egret.TextFieldType.DYNAMIC;
    this.g2Pos.type = egret.TextFieldType.DYNAMIC;
    this.g3Pos.type = egret.TextFieldType.DYNAMIC;
    this.g4Pos.type = egret.TextFieldType.DYNAMIC;
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
    this.g1Pos.type = egret.TextFieldType.INPUT;
    this.g2Pos.type = egret.TextFieldType.INPUT;
    this.g3Pos.type = egret.TextFieldType.INPUT;
    this.g4Pos.type = egret.TextFieldType.INPUT;
  }

  private onSocketOpen(): void {
    console.log("open");
    this.sendChosenData();
  }

  private sendChosenData() {
    let roomName = this.inputRoom.text;
    let userName = this.inputName.text;
    let g1Num = this.chosenGenerals[0].number;
    let g2Num = this.chosenGenerals[1].number;
    let g3Num = this.chosenGenerals[2].number;
    let g4Num = this.chosenGenerals[3].number;
    let gDetail = {
      g1: {
        "num": g1Num,
        "pos": this.g1Pos.text,
      },
      g2: {
        "num": g2Num,
        "pos": this.g2Pos.text,
      },
      g3: {
        "num": g3Num,
        "pos": this.g3Pos.text,
      },
      g4: {
        "num": g4Num,
        "pos": this.g4Pos.text,
      },
    };
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