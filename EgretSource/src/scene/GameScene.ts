class GameScene extends egret.Sprite {

  private par: egret.DisplayObjectContainer;
  private initData: InitData;
  private startScene: StartScene;

  private hasAddMorale: boolean = false;

  constructor(par, initData: InitData, startScene: StartScene) {
    super();
    this.par = par;
    this.initData = initData;
    this.startScene = startScene;
    // 初始化网络
    this.initWebSocket();
    this.createMyGameScene();
  }

  private _upMorale: number;
  public get upMorale(): number {
    return this._upMorale;
  }
  public set upMorale(v: number) {
    if (this._upMorale !== v) {
      v = v < 0 ? 0 : v;
      this._upMorale = v;
      this.textUpMorale.text = String(this._upMorale);
    }

  }

  private _upWall: number;
  public get upWall(): number {
    return this._upWall;
  }
  public set upWall(v: number) {
    if (this._upWall !== v) {
      v = v < 0 ? 0 : v;
      this._upWall = v;
      this.textUpWall.text = String(this._upWall);
    }
  }

  private _downMorale: number;
  public get downMorale(): number {
    return this._downMorale;
  }
  public set downMorale(v: number) {
    if (this._downMorale !== v) {
      v = v < 0 ? 0 : v;
      this._downMorale = v;
      this.textDownMorale.text = String(this._downMorale);
    }
  }


  private _downWall: number;
  public get downWall(): number {
    return this._downWall;
  }
  public set downWall(v: number) {
    if (this._downWall !== v) {
      v = v < 0 ? 0 : v;
      this._downWall = v;
      this.textDownWall.text = String(this._downWall);
    }
  }

  private chessBoard: ChessBoard;
  private leftChessBoard: HurtedChessBoard;
  private rightChessBoard: HurtedChessBoard;
  private operatedIndex: number[];
  private targetIndex: number[];
  private playerCamp: number;
  private currentCamp: number;
  private upPower: string;
  private downPower: string;

  private createMyGameScene() {
    this.createBg();
    this.createTextFields();
    this.createHurtsArea();
    this.createBtns();
    this.createGeneralMenu();
    this.createAtkSkillMenu();
    this.createExtraSkillMenu();
    this.createGameOverView();
    this.initGameData();
    this.meiStuff();
    this.turnStartStuff();
  }

  private initGameData() {
    this.playerCamp = this.initData.playerCamp;
    this.currentCamp = this.initData.currentCamp;
    this.upWall = 50;
    this.upMorale = 0;
    this.downWall = 50;
    this.downMorale = 0;
    this.operatedIndex = [];
    this.targetIndex = [];
    this.btnTurnEnd.visible = this.playerCamp === this.currentCamp;
  }

  private meiStuff() {
    let chesses = this.chessBoard.chesses;
    for (let i = 0; i < 6; i++) {
      let upChess = chesses[0][i];
      if (upChess.general && upChess.general.mei) {
        this.upWall += 5;
      }
      let downChess = chesses[5][i];
      if (downChess.general && downChess.general.mei) {
        this.downWall += 5;
      }
    }
  }

  private onChessBoardTab(event) {
    let x = event.stageX;
    let y = event.stageY;
    x -= 94;
    y -= 280;
    if (x > 0 && y > 0) {
      let j = x / 94;
      let i = y / 95;
      j = Math.floor(j);
      i = Math.floor(i);
      let chess: Chess = this.chessBoard.chesses[i][j];
      let g: General = chess.general;
      switch (chess.status) {
        case "normal":
          if (this.playerCamp === this.currentCamp) {
            this.clearChessesStatus();
            chess.status = "normal_confirm";
          }
          if (g) {
            this.operatedIndex = [i, j];
            this.showGeneralDetail("chess");
          }
          break;
        case "normal_confirm":
          if (chess.camp === this.playerCamp && g && this.playerCamp === this.currentCamp) {
            this.operatedIndex = [i, j];
            this.showGeneralMenu();
          }
          break;
        case "moveable":
          this.colorMoveStuff();
          chess.status = "moveable_confirm";
          break;
        case "moveable_confirm":
          this.targetIndex = [i, j];
          this.requestMoveStuff();
          break;
        case "attackable":
          this.colorAttackStuff();
          chess.status = "attackable_confirm";
          break;
        case "attackable_confirm":
          this.targetIndex = [i, j];
          this.requestAttackStuff();
          break;
        case "revival":
          chess.status = "revival_confirm";
          break;
        case "revival_confirm":
          this.targetIndex = [i, j];
          this.requestRevivalStuff();
          break;
        case "skillable":
          chess.status = "skill_confirm";
          break;
        case "skillable_confirm":
          this.targetIndex = [i, j];
          this.requestSkillStuff();
          break;
      }
    }
  };

  private showGeneralMenu() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chess: Chess = this.chessBoard.chesses[i][j];
    let g: General = chess.general;
    this.moveBtn.touchEnabled = !g.hasMoved;
    this.moveBtn.clickable = !g.hasMoved;
    this.attackBtn.touchEnabled = !g.hasAttacked;
    this.attackBtn.clickable = !g.hasAttacked;
    let attackWallEnable = this.canAttackWall();
    this.attackWallBtn.touchEnabled = !g.hasAttacked && attackWallEnable;
    this.attackWallBtn.clickable = !g.hasAttacked && attackWallEnable;
    let skillEnable = !g.hasSkilled && g.skill.type !== "锁定" && !g.skill.onceUsed;
    let morale = 0;
    if (this.playerCamp === 1) {
      morale = this.downMorale;
    } else if (this.playerCamp === -1) {
      morale = this.upMorale;
    }
    skillEnable = skillEnable && (morale >= Number(g.skill.cost));
    if (g.skill.name === "天雷") {
      skillEnable = skillEnable && this.checkTianLeiAvailable();
    } else if (g.skill.name === "偷渡阴平") {
      skillEnable = skillEnable && this.checkTDYPAvailable();
    }
    this.skillBtn.touchEnabled = skillEnable;
    this.skillBtn.clickable = skillEnable;
    this.skillBtn.text = g.skill.name;
    this.generalMenu.visible = true;
  }

  private canAttackWall() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    if (this.playerCamp === 1 && i === 0) {
      return true;
    } else if (this.playerCamp === -1 && i === 5) {
      return true;
    }
    return false;
  }

  private hideGeneralMenu() {
    this.generalMenu.visible = false;
  }

  private showAtkSkillMenu() {
    if (this.playerCamp === this.currentCamp) {
      this.atkSkillMenu.visible = true;
    }
  }

  private hideAtkSkillMenu() {
    this.atkSkillMenu.visible = false;
  }

  private clearChessesStatus() {
    let customchesses = this.chessBoard.chesses;
    for (let i = 0, iLen = customchesses.length; i < iLen; i++) {
      let rc = customchesses[i];
      for (let j = 0, jLen = rc.length; j < jLen; j++) {
        let rcItem = rc[j];
        rcItem.status = "normal";
      }
    }
    let leftChesses = this.leftChessBoard.chesses;
    let rightChesses = this.rightChessBoard.chesses;
    for (let i = 0, len = leftChesses.length; i < len; i++) {
      if (leftChesses[i].general) {
        leftChesses[i].status = leftChesses[i].general.hurtTurns === 0 ?
          "recover" : "hurt";
      }
      if (rightChesses[i].general) {
        rightChesses[i].status = rightChesses[i].general.hurtTurns === 0 ?
          "recover" : "hurt";
      }
    }
  }

  private showGeneralDetail(type: string) {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chess = null;
    if (type === "chess") {
      chess = this.chessBoard.chesses[i][j];
    } else if (type === "hurted") {
      if (j === 0) {
        chess = this.leftChessBoard.chesses[i];
      } else if (j === 11) {
        chess = this.rightChessBoard.chesses[i - 2];
      }
    }
    let g = chess.general;
    if (!g) return;
    let detailText = "";
    if (type === "chess") {
      detailText =
        `武将数据
坐标：(${i + 1}, ${j + 1})
勇略: ${g.yl}+${g.extraYl}  智谋：${g.zm}+${g.extraZm}  体力：${g.tl}
技能：${g.skill.name} - ${g.skill.text}`;
    } else if (type === "hurted") {
      if (j === 0) {
        detailText =
          `武将数据
坐标：伤兵区第 ${4 - i} 位
勇略: ${g.yl}  智谋：${g.zm}  体力：${g.tl}
技能：${g.skill.name} - ${g.skill.text}`;
      } else if (j === 11) {
        detailText =
          `武将数据
坐标：伤兵区第 ${i - 2} 位
勇略: ${g.yl}  智谋：${g.zm}  体力：${g.tl}
技能：${g.skill.name} - ${g.skill.text}`;
      }
    }
    if (chess.camp === -1) {
      this.textUpDetail.text = detailText;
    } else {
      this.textDownDetail.text = detailText;
    }

  }

  private hideGeneralDetail(camp: number) {
    if (camp === -1) {
      this.textUpDetail.text = "武将数据";
    } else {
      this.textDownDetail.text = "武将数据";
    }
  }

  // 移动
  private requestColorMoveStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "colorMoveable",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
    });
    this.socket.writeUTF(data);
  }

  private beginColorMoveStuff() {
    this.hideGeneralMenu();
    this.colorMoveStuff();
  }

  private colorMoveStuff() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chess: Chess = this.chessBoard.chesses[i][j];
    let g: General = chess.general;
    chess.status = "mover";
    let armsInfo = g.armsInfo;
    let step = armsInfo.moveStep;
    let finalStep = step + g.extraMoveStep;
    this.colorMoveableChess(finalStep, i, j, null, armsInfo.ifStraight, g.canPenetrate);
  }

  private colorMoveableChess(step: number, i: number, j: number, ori: string, ifStraight: boolean, ifPenetrate: boolean) {
    if (step <= 0) return;
    let chesses = this.chessBoard.chesses;
    if (i + 1 < chesses.length) {
      if (chesses[i + 1][j].camp === 0) {
        if (!ifStraight || ori === "down" || !ori) {
          chesses[i + 1][j].status = "moveable";
          this.colorMoveableChess(step - 1, i + 1, j, "down", ifStraight, ifPenetrate);
        }
      } else if (chesses[i + 1][j].camp !== this.playerCamp && ifPenetrate) {
        this.colorMoveableChess(step - 1, i + 1, j, "down", ifStraight, ifPenetrate);
      }
    }
    if (i - 1 >= 0) {
      if (chesses[i - 1][j].camp === 0) {
        if (!ifStraight || ori === "up" || !ori) {
          chesses[i - 1][j].status = "moveable";
          this.colorMoveableChess(step - 1, i - 1, j, "up", ifStraight, ifPenetrate);
        }
      } else if (chesses[i - 1][j].camp !== this.playerCamp && ifPenetrate) {
        this.colorMoveableChess(step - 1, i - 1, j, "up", ifStraight, ifPenetrate);
      }
    }
    if (j + 1 < chesses[0].length) {
      if (chesses[i][j + 1].camp === 0) {
        if (!ifStraight || ori === "right" || !ori) {
          chesses[i][j + 1].status = "moveable";
          this.colorMoveableChess(step - 1, i, j + 1, "right", ifStraight, ifPenetrate);
        }
      } else if (chesses[i][j + 1].camp !== this.playerCamp && ifPenetrate) {
        this.colorMoveableChess(step - 1, i, j + 1, "right", ifStraight, ifPenetrate);
      }

    }
    if (j - 1 >= 0) {
      if (chesses[i][j - 1].camp === 0) {
        if (!ifStraight || ori === "left" || !ori) {
          chesses[i][j - 1].status = "moveable";
          this.colorMoveableChess(step - 1, i, j - 1, "left", ifStraight, ifPenetrate);
        }
      } else if (chesses[i][j - 1].camp !== this.playerCamp && ifPenetrate) {
        this.colorMoveableChess(step - 1, i, j - 1, "left", ifStraight, ifPenetrate);
      }
    }
  }

  private requestMoveStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "moveGeneral",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
    });
    this.socket.writeUTF(data);
  }

  private operateMoveStuff() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let m = this.targetIndex[0];
    let n = this.targetIndex[1];

    if (i === m && j === n) {
      return;
    }

    // 计算行走步数
    let deltaX = Math.abs(j - n);
    let deltaY = Math.abs(i - m);
    let usedMove = deltaX + deltaY;

    let operatedChess: Chess = this.chessBoard.chesses[i][j];
    let g: General = operatedChess.general;
    g.usedMoveStep = usedMove;
    g.hasMoved = true;
    let targetChess: Chess = this.chessBoard.chesses[m][n];
    let tG: General = targetChess.general;
    if (tG) {
      return;
    }

    targetChess.general = g;
    operatedChess.general = null;
    targetChess.camp = operatedChess.camp;
    operatedChess.camp = 0;

    this.clearChessesStatus();
  }

  // 攻击
  private requestColorAttackStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "colorAttackable",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
    });
    this.socket.writeUTF(data);
  }

  private beginColorAttackStuff() {
    this.hideGeneralMenu();
    this.colorAttackStuff();
  }

  private colorAttackStuff() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chess: Chess = this.chessBoard.chesses[i][j];
    let g: General = chess.general;
    chess.status = "attacker";
    let armsInfo = g.armsInfo;
    let range = armsInfo.attackRange;
    let finalRange = range + g.extraAtkRange;
    if (g.untilDieMessage["天弓"]) {
      this.colorAllAtkableChess();
    } else {
      this.colorAttackableChess(finalRange, i, j);
    }
  }

  private colorAttackableChess(range: number, i: number, j: number) {
    if (range <= 0) return;
    let chesses = this.chessBoard.chesses;
    if (i + 1 < chesses.length) {
      if (chesses[i + 1][j].camp !== this.playerCamp) {
        chesses[i + 1][j].status = "attackable";
      }
      this.colorAttackableChess(range - 1, i + 1, j);
    }
    if (i - 1 >= 0) {
      if (chesses[i - 1][j].camp !== this.playerCamp) {
        chesses[i - 1][j].status = "attackable";
      }
      this.colorAttackableChess(range - 1, i - 1, j);
    }
    if (j + 1 < chesses[0].length) {
      if (chesses[i][j + 1].camp !== this.playerCamp) {
        chesses[i][j + 1].status = "attackable";
      }
      this.colorAttackableChess(range - 1, i, j + 1);
    }
    if (j - 1 >= 0) {
      if (chesses[i][j - 1].camp !== this.playerCamp) {
        chesses[i][j - 1].status = "attackable";
      }
      this.colorAttackableChess(range - 1, i, j - 1);
    }
  }

  private colorAllAtkableChess() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;
    for (let m = 0; m < 6; m++) {
      for (let n = 0; n < 6; n++) {
        let chess = chesses[m][n];
        let camp = chess.camp;
        if (camp === targetCamp) {
          chess[m][n].status = "attackable";
        }
      }
    }
  }

  private requestAttackStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "attackGeneral",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
      "atkSkill": this.currentAtkSkill,
    });
    this.socket.writeUTF(data);
  }

  currentAtkSkill: Skill = new Skill();
  private operateAttackStuff() {
    let m = this.targetIndex[0];
    let n = this.targetIndex[1];
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];

    let targetChess: Chess = this.chessBoard.chesses[m][n];
    let targetG: General = targetChess.general;
    if (!targetG) {
      return;
    }
    let operatedChess: Chess = this.chessBoard.chesses[i][j];
    let operatedG: General = operatedChess.general;
    operatedG.hasAttacked = true;

    if (operatedG.skill.name === "天下无双" && (targetG.yl + targetG.extraYl) <= 4) {
      targetG.tl = 0;
      targetChess.general = targetG;
      this.checkAlive(m, n);
      this.clearChessesStatus();
      return;
    }

    // 攻击时相邻触发技能（暂时只有 勇）
    if ((this.currentAtkSkill.name === "No") && !this.atkSkillMenu.visible) {
      let ifAdjacent = Utils.is2dAdjacent(i, j, m, n);
      if (ifAdjacent && operatedG.yong) {
        this.showAtkSkillMenu();
        return;
      }
    }

    let atk = operatedG.yl;
    let finalAtk = atk + operatedG.extraYl;
    let targetTl = targetG.tl;
    let decreaseTl = finalAtk;

    // 伏 额外伤害处理
    let fuDecreaseTl = 0;
    if (operatedG.fu) {
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      dZm *= 2;
      dZm += 3;
      fuDecreaseTl = dZm;
      operatedG.fu = false;
      operatedChess.general = operatedG;
    }
    let finalDecrease = decreaseTl + fuDecreaseTl;
    // 伏兵 处理
    if (operatedG.extraMessage["伏兵"]) {
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      dZm *= 3;
      dZm += 10;
      finalDecrease += dZm;
    }
    // 武侯军阵 处理
    if (operatedG.extraMessage["武侯军阵"]) {
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      finalDecrease += dZm;
    }

    let finalTl = targetTl - finalDecrease;

    // 额外伤害
    if(operatedG.extraMessage["extraDamage"]) {
      finalTl -= operatedG.extraMessage["extraDamage"];
    }

    // 小霸王：攻击附带谋略差伤害
    if(operatedG.skill.name === "小霸王") {
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      finalTl -= dZm;
    }

    // 万弩齐张：骑兵额外伤害
    if(operatedG.extraMessage["extraDamageToQiBin"]) {
      if(targetG.arms === "骑") {
        finalTl -= 5;
      }
    }

    // 弑君：对敌部队攻击伤害+N（N为被攻击部队的COST值）
    if(operatedG.skill.name === "弑君") {
      let cost = targetG.cost;
      finalTl -= cost;
    }

    // 以逸待劳：对敌部队造成的伤害+3N（N为本部队剩余机动）
    if(operatedG.skill.name === "以逸待劳") {
      let remainStep = operatedG.extraMoveStep + operatedG.armsInfo.moveStep - operatedG.usedMoveStep;
      finalTl -= remainStep * 3;
    }

    finalTl = finalTl < 0 ? 0 : finalTl;
    targetG.tl = finalTl;
    targetChess.general = targetG;
    let alive = this.checkAlive(m, n);

    if (this.currentAtkSkill.name !== "No") {
      switch (this.currentAtkSkill.name) {
        case "勇":
          if (alive) {
            let dx = m - i;
            let dy = n - j;
            let hitX = m + dx;
            let hitY = n + dy;
            if (hitX < 0) hitX = 0;
            if (hitX > 5) hitX = 5;
            if (hitY < 0) hitY = 0;
            if (hitY > 5) hitY = 5;
            this.operatedIndex = [m, n];
            this.targetIndex = [hitX, hitY];
            this.operateMoveStuff();
            operatedG.yong = false;
            operatedChess.general = operatedG;
          }
          break;
      }
    }

    this.currentAtkSkill = new Skill();

    this.clearChessesStatus();
  }

  private operateAtkSkillCancel() {
    this.currentAtkSkill = new Skill(SkillTable.getSkillTable()["noUsed"]);
    this.operateAtkSkill();
  }

  private operateAtkSkillYong() {
    this.currentAtkSkill = new Skill(SkillTable.getSkillTable()["勇"]);
    this.operateAtkSkill();
  }

  private operateAtkSkill() {
    this.hideAtkSkillMenu();
    this.requestAttackStuff();
  }

  private colorFriendSkillableStuff(ifSelf: boolean = true) {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedCamp = chesses[i][j].camp;
    for (let m = 0; m < 6; m++) {
      for (let n = 0; n < 6; n++) {
        if (m === i && n === j && !ifSelf) {
          continue;
        }
        let chess = chesses[m][n];
        let camp = chess.camp;
        if (camp === operatedCamp) {
          chess[m][n].status = "skillable";
        }
      }
    }
  }

  private checkAlive(i: number, j: number, defeated: boolean = true): boolean {
    let chess: Chess = this.chessBoard.chesses[i][j];
    let g: General = chess.general;
    if (g.tl <= 0) {
      // 伏 死亡失效
      g.fu = false;
      // 默认伤兵计时为 3
      g.hurtTurns = 3;
      if (g.extraMessage["addHurtTurns"]) {
        g.hurtTurns += g.extraMessage["addHurtTurns"];
      }
      // 所有 extra 重置
      g.extraYl = 0;
      g.extraZm = 0;
      g.extraAtkRange = 0;
      g.extraMoveStep = 0;
      g.canPenetrate = false;
      g.extraMessage = {};
      g.untilDieMessage = {};
      let hurtedChessBoard: HurtedChessBoard = null;
      if (chess.camp === 1) {
        hurtedChessBoard = this.rightChessBoard;
        for (let i = 0; i < 4; i++) {
          let hurtedChess = hurtedChessBoard.chesses[i];
          if (!hurtedChess.general) {
            hurtedChess.general = g;
            chess.general = null;
            chess.camp = 0;
            break;
          }
        }
      } else {
        hurtedChessBoard = this.leftChessBoard;
        for (let i = 3; i >= 0; i--) {
          let hurtedChess = hurtedChessBoard.chesses[i];
          if (!hurtedChess.general) {
            hurtedChess.general = g;
            chess.general = null;
            chess.camp = 0;
            break;
          }
        }
      }
      // 被击败的话，对方增加士气，但一回合只能一次
      if(defeated && !this.hasAddMorale) {
        let addCamp = -chess.camp;
        if(addCamp === 1) {
          this.downMorale += 1;
        } else if(addCamp === -1) {
          this.upMorale += 1;
        }
        this.hasAddMorale = true;
      }
      return false;
    } else {
      return true;
    }
  }

  // 伤兵区
  private requestColorRevivalStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "colorRevival",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
    });
    this.socket.writeUTF(data);
  }

  private onHurtsAreaTab(event) {
    let x = event.stageX;
    let y = event.stageY;
    let leftX = x - 17;
    let leftY = y - 299;
    if (leftX > 0 && leftY > 0) {
      let j = leftX / 60;
      let i = leftY / 87;
      j = Math.floor(j);
      i = Math.floor(i);
      let chess: HurtedChess = null;
      if (j === 0) {
        chess = this.leftChessBoard.chesses[i];
      } else if (j === 11) {
        chess = this.rightChessBoard.chesses[i - 2];
      }
      if (chess.general) {
        switch (chess.status) {
          case "hurt":
            this.clearChessesStatus();
            this.operatedIndex = [i, j];
            this.showGeneralDetail("hurted");
            chess.status = "hurt_confirm";
            break;
          case "hurt_confirm":
            this.clearChessesStatus();
            chess.status = "hurt";
            break;
          case "recover":
            this.clearChessesStatus();
            this.operatedIndex = [i, j];
            if (this.playerCamp === this.currentCamp) {
              this.requestColorRevivalStuff();
              chess.status = "recover_confirm";
            }
            this.showGeneralDetail("hurted");
            break;
          case "recover_confirm":
            this.clearChessesStatus();
            chess.status = "recover";
            break;
        }
      } else {
        this.clearChessesStatus();
      }
    }
  }

  // 复活
  private colorRevivalStuff() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    if (j === 0 && this.playerCamp === -1) {
      let hurtChess = this.leftChessBoard.chesses[i];
      let aliveChesses = this.chessBoard.chesses;
      for (let k = 0, len = aliveChesses[0].length; k < len; k++) {
        let aliveChess = aliveChesses[0][k];
        if (aliveChess.camp === 0) {
          aliveChess.status = "revival";
        }
      }
    } else if (j === 11 && this.playerCamp === 1) {
      let hurtChess = this.rightChessBoard.chesses[i - 2];
      let aliveChesses = this.chessBoard.chesses;
      for (let k = 0, len = aliveChesses[5].length; k < len; k++) {
        let aliveChess = aliveChesses[5][k];
        if (aliveChess.camp === 0) {
          aliveChess.status = "revival";
        }
      }
    }
  }

  private requestRevivalStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "revivalGeneral",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
    });
    this.socket.writeUTF(data);
  }

  private operateRevivalStuff() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let operatedChess: HurtedChess = null;
    if (j === 0) {
      operatedChess = this.leftChessBoard.chesses[i];
    } else if (j === 11) {
      operatedChess = this.rightChessBoard.chesses[i - 2];
    }
    let g: General = operatedChess.general;
    let m = this.targetIndex[0];
    let n = this.targetIndex[1];
    let targetChess: Chess = this.chessBoard.chesses[m][n];

    g.tl = g.maxTl;
    g.hasMoved = false;
    g.hasAttacked = false;
    targetChess.general = g;
    operatedChess.general = null;
    targetChess.camp = operatedChess.camp;

    this.clearChessesStatus();
  }

  // 攻击城墙
  private requestAtkWallStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "atkWall",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
    });
    this.socket.writeUTF(data);
  }

  private operateAtkWallStuff() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let operatedChess: Chess = this.chessBoard.chesses[i][j];;
    let operatedG: General = operatedChess.general;
    let wallDecrease = operatedG.yl + operatedG.extraYl;
    if (operatedG.arms === "器") {
      wallDecrease += 10;
    }
    if (operatedG.skill.name === "陷阵营") {
      wallDecrease += 7;
    }
    if (operatedG.extraMessage["atkWall"]) {
      wallDecrease += operatedG.extraMessage["atkWall"];
    }
    let finalDecrease = wallDecrease;
    if (i === 0) {
      let lastValue = this.upWall - finalDecrease;
      this.upWall = lastValue < 0 ? 0 : lastValue;
    } else if (i === 5) {
      let lastValue = this.downWall - finalDecrease;
      this.downWall = lastValue < 0 ? 0 : lastValue;
    }
    this.checkWallAlive();
  }

  private checkWallAlive() {
    if (this.upWall === 0) {
      this.operateGameOverStuff(1);
    } else if (this.downWall === 0) {
      this.operateGameOverStuff(-1);
    }
  }

  extraSkillMessage: any = {};
  // 使用技能
  private requestSkillStuff() {
    if(this._waitingResponse) {
      return;
    }

    this.requestWaitStart();
    
    let m = this.targetIndex[0];
    let n = this.targetIndex[1];
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let operatedChess: Chess = this.chessBoard.chesses[i][j];
    let operatedG: General = operatedChess.general;
    let targetChess: Chess = this.chessBoard.chesses[m][n];
    let targetG: General = targetChess.general;
    let skill: Skill = operatedG.skill;

    if (!this.extraSkillMessage["name"]) {
      this.extraSkillMessage["name"] = skill.name;
      switch (skill.name) {
        case "落石":
          this.showExtraSkillMenu("落石");
          return;
        case "火烧赤壁":
          this.showExtraSkillMenu("火烧赤壁");
          return;
        case "发明":
          this.colorFriendSkillableStuff(false);
          return;
      }
    }

    let data = JSON.stringify({
      "reqStr": "postData",
      "action": "skill",
      "operatedIndex": this.operatedIndex,
      "targetIndex": this.targetIndex,
      "extraSkillMessage": this.extraSkillMessage,
    });
    this.socket.writeUTF(data);
  }

  private operateSkillStuff() {
    let m = this.targetIndex[0];
    let n = this.targetIndex[1];
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let operatedChess: Chess = this.chessBoard.chesses[i][j];
    let operatedG: General = operatedChess.general;
    let targetChess: Chess = this.chessBoard.chesses[m][n];
    let targetG: General = targetChess.general;
    let operatedCamp = operatedChess.camp;

    let skill: Skill = operatedG.skill;
    if (operatedCamp === this.currentCamp) {
      if (operatedCamp === 1) {
        this.downMorale -= Number(skill.cost);
      }
      else if (operatedCamp === -1) {
        this.upMorale -= Number(skill.cost);
      }
    } else {
      return;
    }
    let operatedWall = operatedCamp === 1 ? this.downWall : this.upWall;

    let btnText = "";
    switch (skill.name) {
      case "魏武挥鞭":
        this.changeExtraToGenerals(operatedCamp, "all", 6, 0, 0, 1, {});
        break;
      case "虎豹突击":
        this.changeExtraToGenerals(operatedCamp, "骑", 1, 0, 1, 0, {});
        break;
      case "虎豹骑":
        break;
      case "伏兵":
        operatedG.extraMessage["伏兵"] = true;
        break;
      case "武侯军阵":
        this.changeExtraToGenerals(
          operatedCamp, "all", 0, 0, 0, 0,
          { "武侯军阵": true, "addTl": 10 }
        );
        break;
      case "单骑救主":
        operatedG.extraMoveStep += 2;
        operatedG.extraYl += 4;
        operatedG.canPenetrate = true;
        break;
      case "无当飞军":
        break;
      case "落石":
        btnText = this.extraSkillMessage["btnText"];
        this.operateLuoShiSkill(btnText);
        break;
      case "火烧赤壁":
        btnText = this.extraSkillMessage["btnText"];
        this.operateHSCBSkill(btnText);
        break;
      case "天弓":
        operatedG.untilDieMessage["天弓"] = operatedG.untilDieMessage["天弓"] || { "times": 0 };
        operatedG.untilDieMessage["天弓"]["times"]++;
        operatedG.extraYl += 4;
        break;
      case "丹阳卫":
        break;
      case "弓腰之乐":
        operatedG.untilDieMessage["弓腰之乐"] = operatedG.untilDieMessage["弓腰之乐"] || { "times": 0 };
        operatedG.untilDieMessage["弓腰之乐"]["times"]++;
        this.changeExtraToGenerals(operatedCamp, "弓", 2, 0, 0, 0, {});
        break;
      case "天下无双":
        break;
      case "暴虐突击":
        this.changeExtraToGenerals(operatedCamp, "all", 8, 0, 0, 0, { "decreaseTl": 5 });
        break;
      case "陷阵营":
        break;
      case "天雷":
        this.operateTianLeiSkill();
        break;
      case "晋宣军略":
        operatedWall += 10;
        this.changeExtraToGenerals(operatedCamp, "all", 0, 0, 0, 1, { "atkWall": 10 });
        break;
      case "景王权术":
        this.changeExtraToGenerals(operatedCamp, "all", 3, 0, 0, 0, {});
        this.changeExtraToGenerals(-operatedCamp, "all", 0, 0, 0, 0, { "addHurtTurns": 1 });
        break;
      case "偷渡阴平":
        this.operateTDYPSkill();
        operatedG.skill.onceUsed = true;
        break;
      case "三分归晋":
        this.operateGameOverStuff(operatedCamp);
        break;
      case "万弩齐张":
        operatedG.extraYl += 8;
        operatedG.extraAtkRange += 1;
        if(operatedG.extraMessage["extraDamageToQiBin"]) {
          operatedG.extraMessage["extraDamageToQiBin"] += 5;
        } else {
          operatedG.extraMessage["extraDamageToQiBin"] = 5;
        }
        this.changeExtraToGenerals(-operatedCamp, "all", 0, 0, 0, 0, { "addHurtTurns": 1 });
        break;
      case "争功":
        targetG.hasMoved = true;
        targetG.hasAttacked = true;
        targetG.hasSkilled = true;
        operatedG.extraYl += targetG.yl + targetG.extraYl;
        operatedG.extraMoveStep += targetG.armsInfo.moveStep + targetG.extraMoveStep;
        break;
      case "发明":
        let originArms = targetG.arms;
        let originArmsInfo = ArmsInfo.getArmsInfoByName(originArms, targetG.yl);
        targetG.arms = "器";
        targetG.armsInfo = ArmsInfo.getArmsInfoByName("器", targetG.yl);
        targetG.armsInfo["maxTl"] = originArmsInfo["maxTl"];
        targetChess.general = targetG;
        break;
    }

    operatedG.hasSkilled = true;
    operatedChess.general = operatedG;

    this.extraSkillMessage = {};

    this.clearChessesStatus();
  }

  // 偷渡阴平 处理
  private operateTDYPSkill() {
    let a = this.operatedIndex[0];
    let b = this.operatedIndex[1];
    let operatedChess: Chess = this.chessBoard.chesses[a][b];
    let chesses = this.chessBoard.chesses;
    let targetCamp = -chesses[a][b].camp;
    let i = targetCamp === 1 ? 5 : 0;
    for (let j = 0; j < 6; j++) {
      if (chesses[i][j].camp === 0) {
        chesses[i][j].status = "moveable";
      }
    }
  }

  // 检测 偷渡阴平 可行性
  private checkTDYPAvailable(): boolean {
    let a = this.operatedIndex[0];
    let b = this.operatedIndex[1];
    let operatedChess: Chess = this.chessBoard.chesses[a][b];
    let chesses = this.chessBoard.chesses;
    let targetCamp = -chesses[a][b].camp;
    let i = targetCamp === 1 ? 5 : 0;
    for (let j = 0; j < 6; j++) {
      if (chesses[i][j].camp === 0) {
        return true;
      }
    }
    return false;
  }

  // 天雷 处理
  private operateTianLeiSkill() {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedG = chesses[i][j].general;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;

    let resultTarget = [];
    for (let m = 0; m < 6; m++) {
      if (chesses[m][j].camp === targetCamp) {
        resultTarget.push({ "i": m, "j": j })
      }
    }
    for (let n = 0; n < 6; n++) {
      if (chesses[i][n].camp === targetCamp) {
        resultTarget.push({ "i": i, "j": n })
      }
    }

    if (resultTarget.length === 1) {
      let targetI = resultTarget[0]["i"];
      let targetJ = resultTarget[0]["j"];
      let targetChess = chesses[targetI][targetJ];
      let targetG = targetChess.general;
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      dZm *= 2;
      dZm += 15;
      let finalTl = targetG.tl - dZm;

      // 额外伤害
      if(operatedG.extraMessage["extraDamage"]) {
        finalTl -= operatedG.extraMessage["extraDamage"];
      }

      finalTl = finalTl < 0 ? 0 : finalTl;
      targetG.tl = finalTl;
      targetChess.general = targetG;
      this.checkAlive(resultTarget[0]["i"], resultTarget[0]["j"]);
    } else {
      for (let k = 0; k < resultTarget.length; k++) {
        let targetI = resultTarget[k]["i"];
        let targetJ = resultTarget[k]["j"];
        let targetChess = chesses[targetI][targetJ];
        let targetG = targetChess.general;
        let dZm = operatedG.zm - targetG.zm;
        if (dZm < 0) dZm = 0;
        dZm *= 2;
        dZm += 10;
        let finalTl = targetG.tl - dZm;

        // 额外伤害
        if(operatedG.extraMessage["extraDamage"]) {
          finalTl -= operatedG.extraMessage["extraDamage"];
        }

        finalTl = finalTl < 0 ? 0 : finalTl;
        targetG.tl = finalTl;
        targetChess.general = targetG;
        this.checkAlive(resultTarget[k]["i"], resultTarget[k]["j"]);
      }
    }
  }

  // 检验 天雷 可行性
  private checkTianLeiAvailable(): boolean {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedG = chesses[i][j].general;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;
    for (let m = 0; m < 6; m++) {
      if (chesses[m][j].camp === targetCamp) {
        return true;
      }
    }
    for (let n = 0; n < 6; n++) {
      if (chesses[i][n].camp === targetCamp) {
        return true;
      }
    }
    return false;
  }

  // 火烧赤壁 技能
  private operateHSCBSkill(ori: string) {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedG = chesses[i][j].general;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;

    let resultTarget = [];
    switch (ori) {
      case "北半场":
        for (let m = 0; m < 3; m++) {
          for (let n = 0; n < 6; n++) {
            let camp = chesses[m][n].camp;
            if (camp === targetCamp) {
              resultTarget.push({ "i": m, "j": n });
            }
          }
        }
        break;
      case "南半场":
        for (let m = 3; m < 6; m++) {
          for (let n = 0; n < 6; n++) {
            let camp = chesses[m][n].camp;
            if (camp === targetCamp) {
              resultTarget.push({ "i": m, "j": n });
            }
          }
        }
        break;
    }

    for (let k = 0; k < resultTarget.length; k++) {
      let targetI = resultTarget[k]["i"];
      let targetJ = resultTarget[k]["j"];
      let targetChess = chesses[targetI][targetJ];
      let targetG = targetChess.general;
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      dZm *= 3;
      dZm += 5;
      let finalTl = targetG.tl - dZm;

      // 额外伤害
      if(operatedG.extraMessage["extraDamage"]) {
        finalTl -= operatedG.extraMessage["extraDamage"];
      }

      finalTl = finalTl < 0 ? 0 : finalTl;
      targetG.tl = finalTl;
      targetChess.general = targetG;
      this.checkAlive(resultTarget[k]["i"], resultTarget[k]["j"]);
    }
  }

  // 检测 火烧赤壁 各方向可行性
  private checkHSCBAvailable(): boolean[] {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;
    let resultOri = [];
    // 北半场检查
    for (let m = 0; m < 3; m++) {
      for (let n = 0; n < 6; n++) {
        let camp = chesses[m][n].camp;
        if (camp === targetCamp) {
          resultOri.push(true);
          break;
        }
      }
      if (resultOri.length === 1) {
        break;
      }
    }
    if (resultOri.length === 0) {
      resultOri.push(false);
    }
    // 南半场检查
    for (let m = 3; m < 6; m++) {
      for (let n = 0; n < 6; n++) {
        let camp = chesses[m][n].camp;
        if (camp === targetCamp) {
          resultOri.push(true);
          break;
        }
      }
      if (resultOri.length === 2) {
        break;
      }
    }
    if (resultOri.length === 1) {
      resultOri.push(false);
    }
    return resultOri;
  }

  // 落石 技能
  private operateLuoShiSkill(ori: string) {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedG = chesses[i][j].general;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;

    let resultTarget = [];
    switch (ori) {
      case "北方":
        for (let m = -1; m >= -3; m--) {
          if ((i + m) >= 0) {
            let mid = chesses[i + m][j];
            if (mid.camp === targetCamp) {
              resultTarget.push({ "i": i + m, "j": j });
            }
            if (j - 1 >= 0) {
              let left = chesses[i + m][j - 1];
              if (left.camp === targetCamp) {
                resultTarget.push({ "i": i + m, "j": j - 1 });
              }
            }
            if (j + 1 < 6) {
              let right = chesses[i + m][j + 1];
              if (right.camp === targetCamp) {
                resultTarget.push({ "i": i + m, "j": j + 1 });
              }
            }
          } else {
            break;
          }
        }
        break;
      case "南方":
        for (let m = 1; m <= 3; m++) {
          if ((i + m) < 6) {
            let mid = chesses[i + m][j];
            if (mid.camp === targetCamp) {
              resultTarget.push({ "i": i + m, "j": j });
            }
            if (j - 1 >= 0) {
              let left = chesses[i + m][j - 1];
              if (left.camp === targetCamp) {
                resultTarget.push({ "i": i + m, "j": j - 1 });
              }
            }
            if (j + 1 < 6) {
              let right = chesses[i + m][j + 1];
              if (right.camp === targetCamp) {
                resultTarget.push({ "i": i + m, "j": j + 1 });
              }
            }
          } else {
            break;
          }
        }
        break;
      case "东方":
        for (let m = 1; m <= 3; m++) {
          if ((j + m) < 6) {
            let mid = chesses[i][j + m];
            if (mid.camp === targetCamp) {
              resultTarget.push({ "i": i, "j": j + m });
            }
            if (i - 1 >= 0) {
              let up = chesses[i - 1][j + m];
              if (up.camp === targetCamp) {
                resultTarget.push({ "i": i - 1, "j": j + m });
              }
            }
            if (i + 1 < 6) {
              let down = chesses[i + 1][j + m];
              if (down.camp === targetCamp) {
                resultTarget.push({ "i": i + 1, "j": j + m });
              }
            }
          } else {
            break;
          }
        }
        break;
      case "西方":
        for (let m = -1; m >= -3; m--) {
          if ((j + m) >= 0) {
            let mid = chesses[i][j + m];
            if (mid.camp === targetCamp) {
              resultTarget.push({ "i": i, "j": j + m });
            }
            if (i - 1 >= 0) {
              let up = chesses[i - 1][j + m];
              if (up.camp === targetCamp) {
                resultTarget.push({ "i": i - 1, "j": j + m });
              }
            }
            if (i + 1 < 6) {
              let down = chesses[i + 1][j + m];
              if (down.camp === targetCamp) {
                resultTarget.push({ "i": i + 1, "j": j + m });
              }
            }
          } else {
            break;
          }
        }
        break;
    }

    for (let k = 0; k < resultTarget.length; k++) {
      let targetI = resultTarget[k]["i"];
      let targetJ = resultTarget[k]["j"];
      let targetChess = chesses[targetI][targetJ];
      let targetG = targetChess.general;
      let dZm = operatedG.zm - targetG.zm;
      if (dZm < 0) dZm = 0;
      dZm *= 2;
      dZm += 10;
      let finalTl = targetG.tl - dZm;
      
      // 额外伤害
      if(operatedG.extraMessage["extraDamage"]) {
        finalTl -= operatedG.extraMessage["extraDamage"];
      }

      finalTl = finalTl < 0 ? 0 : finalTl;
      targetG.tl = finalTl;
      targetChess.general = targetG;
      this.checkAlive(resultTarget[k]["i"], resultTarget[k]["j"]);
    }
  }

  // 检测 落石 各方向可行性
  private checkLuoShiAvailable(): boolean[] {
    let i = this.operatedIndex[0];
    let j = this.operatedIndex[1];
    let chesses = this.chessBoard.chesses;
    let operatedCamp = chesses[i][j].camp;
    let targetCamp = operatedCamp === 1 ? -1 : 1;
    let resultOri = [];
    // 北方检查
    for (let m = -1; m >= -3; m--) {
      if ((i + m) >= 0) {
        let mid = chesses[i + m][j];
        if (mid.camp === targetCamp) {
          resultOri.push(true);
          break;
        }
        if (j - 1 >= 0) {
          let left = chesses[i + m][j - 1];
          if (left.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
        if (j + 1 < 6) {
          let right = chesses[i + m][j + 1];
          if (right.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
      } else {
        break;
      }
    }
    if (resultOri.length === 0) {
      resultOri.push(false);
    }
    // 南方检查
    for (let m = 1; m <= 3; m++) {
      if ((i + m) < 6) {
        let mid = chesses[i + m][j];
        if (mid.camp === targetCamp) {
          resultOri.push(true);
          break;
        }
        if (j - 1 >= 0) {
          let left = chesses[i + m][j - 1];
          if (left.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
        if (j + 1 < 6) {
          let right = chesses[i + m][j + 1];
          if (right.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
      } else {
        break;
      }
    }
    if (resultOri.length === 1) {
      resultOri.push(false);
    }
    // 东方检查
    for (let m = 1; m <= 3; m++) {
      if ((j + m) < 6) {
        let mid = chesses[i][j + m];
        if (mid.camp === targetCamp) {
          resultOri.push(true);
          break;
        }
        if (i - 1 >= 0) {
          let up = chesses[i - 1][j + m];
          if (up.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
        if (i + 1 < 6) {
          let down = chesses[i + 1][j + m];
          if (down.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
      } else {
        break;
      }
    }
    if (resultOri.length === 2) {
      resultOri.push(false);
    }
    // 西方检查
    for (let m = -1; m >= -3; m--) {
      if ((j + m) >= 0) {
        let mid = chesses[i][j + m];
        if (mid.camp === targetCamp) {
          resultOri.push(true);
          break;
        }
        if (i - 1 >= 0) {
          let up = chesses[i - 1][j + m];
          if (up.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
        if (i + 1 < 6) {
          let down = chesses[i + 1][j + m];
          if (down.camp === targetCamp) {
            resultOri.push(true);
            break;
          }
        }
      } else {
        break;
      }
    }
    if (resultOri.length === 3) {
      resultOri.push(false);
    }
    return resultOri;
  }

  private changeExtraToGenerals(camp: number, arm: string, yl: number, zm: number, atkRange: number, moveStep: number, message: any) {
    let chesses = this.chessBoard.chesses;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let chess = chesses[i][j];
        if (chess.camp === camp) {
          let g = chess.general;
          let arms = g.arms;
          if (arm === "all" || arm === arms) {
            g.extraYl += yl;
            g.extraZm += zm;
            g.extraAtkRange += atkRange;
            g.extraMoveStep += moveStep;
            for (let key in message) {
              switch (key) {
                case "addTl":
                  g.tl += message[key];
                  break;
                case "decreaseTl":
                  g.tl -= message[key];
                default:
                  if(key in g.extraMessage) {
                    g.extraMessage[key] += message[key];
                  } else {
                    g.extraMessage[key] = message[key];
                  }
                  break;
              }
            }
            chess.general = g;
            this.checkAlive(i, j, false);
          }
        }
      }
    }
  }

  // 游戏结束
  private operateGameOverStuff(winCamp: number) {
    if (winCamp === 1) {
      this.gameOverText.text = "南方胜利";
    } else {
      this.gameOverText.text = "北方胜利";
    }
    this.gameOverView.visible = true;
  }

  private operateFinishGameStuff() {
    this.gameOverText.text = "请重启游戏";
  }

  private requestTurnEndStuff() {
    this.btnTurnEnd.visible = false;
    if (this.socket && this.socket.connected) {
      let data = JSON.stringify({
        "reqStr": "postData",
        "action": "turnEnd",
        "operatedIndex": this.operatedIndex,
        "targetIndex": this.targetIndex,
      });
      this.socket.writeUTF(data);
    } else {
      this.beginTurnEndStuff(-this.currentCamp);
      this.beginTurnStartStuff(this.currentCamp);
    }
  }

  private beginTurnStartStuff(currentCamp: number) {
    this.currentCamp = currentCamp;
    this.turnStartStuff();
  }

  private beginTurnEndStuff(currentCamp: number) {
    this.currentCamp = currentCamp;
    this.turnEndStuff();
  }

  private turnStartStuff() {
    // 伤兵区
    let hurtedChesses: HurtedChess[] = null;
    if (this.currentCamp === 1) {
      hurtedChesses = this.rightChessBoard.chesses;
    } else {
      hurtedChesses = this.leftChessBoard.chesses;
    }
    for (let i = 0, len = hurtedChesses.length; i < len; i++) {
      let chess = hurtedChesses[i];
      let g = chess.general;
      if (g) {
        g.hurtTurns = g.hurtTurns === 0 ? 0 : g.hurtTurns - 1;
        chess.general = g;
      }
    }
    // 扫描所有我方武将
    // 1. 重置行动能力
    // 2. 触发特定技能
    // 3. 争功
    let skillZhenggong = false;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let chess = this.chessBoard.chesses[i][j];
        if (chess.camp === this.currentCamp) {
          let g = chess.general;
          g.hasMoved = false;
          g.hasAttacked = false;
          switch(g.skill.name) {
            case "魏之元勋":
              this.changeExtraToGenerals(this.currentCamp, "all", 0, 0, 0, 0, { "extraDamage": 4 });
              break;
            case "武圣军魂":
              this.changeExtraToGenerals(this.currentCamp, "all", 0, 0, 0, 1, {});
              break;
            case "争功":
              skillZhenggong = true;
              break;
          }
        }
      }
    }
    // 增加士气，清除击败士气标记
    if (this.currentCamp === -1) {
      this.upMorale++;
    } else {
      this.downMorale++;
    }
    this.hasAddMorale = false;
    // 回合结束按钮可见
    if ((this.playerCamp === this.currentCamp)) {
      this.btnTurnEnd.visible = true;
    }
    // 争功处理
    if (skillZhenggong) {
      this.colorFriendSkillableStuff();
    }
  }

  private turnEndStuff() {
    // 清除棋子状态
    this.clearChessesStatus();
    // 清除武将本回合加成
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let chess = this.chessBoard.chesses[i][j];
        let g = chess.general;
        if (g) {
          g.extraYl = 0;
          g.extraZm = 0;
          g.extraMoveStep = 0;
          g.extraAtkRange = 0;
          g.hasMoved = false;
          g.hasAttacked = false;
          g.hasSkilled = false;
          g.canPenetrate = false;
          g.usedMoveStep = 0;
          g.extraMessage = {};
          let untilDieMessage = g.untilDieMessage;
          if (untilDieMessage["天弓"]) {
            g.extraYl += 4 * untilDieMessage["天弓"]["times"];
          }
          if (untilDieMessage["弓腰之乐"]) {
            this.changeExtraToGenerals(chess.camp, "弓", 2 * untilDieMessage["弓腰之乐"]["times"],
              0, 0, 0, {});
          }
          chess.general = g;
        }
      }
    }
  }

  private createBg() {
    let bg: egret.Bitmap = new egret.Bitmap(RES.getRes("bg_jpg"));
    this.addChild(bg);

    this.chessBoard = new ChessBoard(this.getChesses());
    this.chessBoard.x = 94;
    this.chessBoard.y = 280;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let chess = this.chessBoard.chesses[i][j];
        chess.touchEnabled = true;
        chess.addEventListener("touchTap", this.onChessBoardTab, this);
      }
    }
    this.addChild(this.chessBoard);

    let chessboardPartCutter: egret.Bitmap = new egret.Bitmap(RES.getRes("chessboard_part_cutter_png"));
    chessboardPartCutter.x = 91;
    chessboardPartCutter.y = 277;
    this.addChild(chessboardPartCutter);
    let hurtsArea: egret.Bitmap = new egret.Bitmap(RES.getRes("hurts_area_png"));
    hurtsArea.x = 0;
    hurtsArea.y = 230;
    this.addChild(hurtsArea);
    let hurtsAreaPart: egret.Bitmap = new egret.Bitmap(RES.getRes("hurts_area_part_png"));
    hurtsAreaPart.x = 17;
    hurtsAreaPart.y = 299;
    this.addChild(hurtsAreaPart);
    let powerBg: egret.Bitmap = new egret.Bitmap(RES.getRes("power_bg_png"));
    this.addChild(powerBg);
    let turnsBg: egret.Bitmap = new egret.Bitmap(RES.getRes("turns_bg_png"));
    turnsBg.anchorOffsetY = 75;
    turnsBg.y = 1200;
    this.addChild(turnsBg);
    let wallmoraleText: egret.Bitmap = new egret.Bitmap(RES.getRes("wall_morale_text_png"));
    wallmoraleText.x = 15;
    wallmoraleText.y = 80;
    this.addChild(wallmoraleText);
  }

  private getChesses(): Chess[][] {
    return this.initData.chesses;
  }

  private createHurtsArea() {
    let leftChesses = [];
    for (let i = 0; i < 4; i++) {
      let chess = this.initData.leftChesses[i];
      chess.addEventListener("touchTap", this.onHurtsAreaTab, this);
      chess.camp = -1;
      leftChesses.push(chess);
    }
    this.leftChessBoard = new HurtedChessBoard(this, leftChesses);
    this.leftChessBoard.x = 17;
    this.leftChessBoard.y = 299;
    this.leftChessBoard.layoutBgColorAlpha = 0;
    this.leftChessBoard.layoutSpacing = 2;
    this.addChild(this.leftChessBoard);

    let rightChesses = [];
    for (let i = 0; i < 4; i++) {
      let chess = this.initData.rightChesses[i];
      chess.addEventListener("touchTap", this.onHurtsAreaTab, this);
      chess.camp = 1;
      rightChesses.push(chess);
    }
    this.rightChessBoard = new HurtedChessBoard(this, rightChesses);
    this.rightChessBoard.x = 674;
    this.rightChessBoard.y = 473;
    this.rightChessBoard.layoutBgColorAlpha = 0;
    this.rightChessBoard.layoutSpacing = 2;
    this.addChild(this.rightChessBoard);
  }

  textUpPower: egret.TextField;
  textUpWall: egret.TextField;
  textUpMorale: egret.TextField;
  textUpDetail: egret.TextField;
  textDownPower: egret.TextField;
  textDownWall: egret.TextField;
  textDownMorale: egret.TextField;
  textDownDetail: egret.TextField;
  private createTextFields() {
    this.textUpPower = new egret.TextField();
    this.textUpPower.text = this.initData.upPower;
    this.textUpPower.x = 33;
    this.textUpPower.y = 20;
    this.textUpPower.fontFamily = "KaiTi";
    this.addChild(this.textUpPower);

    let wallMoralX = 114;
    let wallMoralSize = 34;
    let wallMoralYOffset = -5;

    this.textUpWall = new egret.TextField();
    this.textUpWall.text = "30";
    this.textUpWall.x = wallMoralX;
    this.textUpWall.y = 86 + wallMoralYOffset;
    this.textUpWall.size = wallMoralSize;
    this.textUpWall.fontFamily = "KaiTi";
    this.addChild(this.textUpWall);

    this.textUpMorale = new egret.TextField();
    this.textUpMorale.text = "0";
    this.textUpMorale.x = wallMoralX;
    this.textUpMorale.y = 130 + wallMoralYOffset;
    this.textUpMorale.size = wallMoralSize;
    this.textUpMorale.fontFamily = "KaiTi";
    this.addChild(this.textUpMorale);

    this.textUpDetail = new egret.TextField();
    this.textUpDetail.text = "武将数据"
    this.textUpDetail.x = 190;
    this.textUpDetail.y = 10;
    this.textUpDetail.width = 550;
    this.textUpDetail.height = 190;
    this.textUpDetail.fontFamily = "KaiTi";
    this.addChild(this.textUpDetail);

    this.textDownPower = new egret.TextField();
    this.textDownPower.text = this.initData.downPower;
    this.textDownPower.x = 33;
    this.textDownPower.y = 930;
    this.textDownPower.fontFamily = "KaiTi";
    this.addChild(this.textDownPower);

    this.textDownWall = new egret.TextField();
    this.textDownWall.text = "30";
    this.textDownWall.x = wallMoralX;
    this.textDownWall.y = 996 + wallMoralYOffset;
    this.textDownWall.size = wallMoralSize;
    this.textDownWall.fontFamily = "KaiTi";
    this.addChild(this.textDownWall);

    this.textDownMorale = new egret.TextField();
    this.textDownMorale.text = "0";
    this.textDownMorale.x = wallMoralX;
    this.textDownMorale.y = 1039 + wallMoralYOffset;
    this.textDownMorale.size = wallMoralSize;
    this.textDownMorale.fontFamily = "KaiTi";
    this.addChild(this.textDownMorale);

    this.textDownDetail = new egret.TextField();
    this.textDownDetail.text = "武将数据"
    this.textDownDetail.x = 190;
    this.textDownDetail.y = 955;
    this.textDownDetail.width = 550;
    this.textDownDetail.height = 190;
    this.textDownDetail.fontFamily = "KaiTi";
    this.addChild(this.textDownDetail);
  }

  btnTurnEnd: ImgBtn;
  private createBtns() {
    let btnTurnEndBg: egret.Bitmap = new egret.Bitmap(RES.getRes("btn_turnover_png"));
    this.btnTurnEnd = new ImgBtn(this, 143, 52);
    this.btnTurnEnd.img = btnTurnEndBg;
    this.btnTurnEnd.anchorOffsetX = 143;
    this.btnTurnEnd.anchorOffsetY = 52;
    this.btnTurnEnd.x = 746;
    this.btnTurnEnd.y = 1194;
    this.btnTurnEnd.btnBgColorAlpha = 0;
    this.btnTurnEnd.addEventListener("touchTap", this.requestTurnEndStuff, this);
    this.addChild(this.btnTurnEnd);
  }

  generalMenu: VerticalLayout;
  moveBtn: ImgBtn;
  attackBtn: ImgBtn;
  skillBtn: ImgBtn;
  attackWallBtn: ImgBtn;
  cancelBtn: ImgBtn;
  // 创建武将操作菜单
  private createGeneralMenu() {
    this.generalMenu = new VerticalLayout(this);
    this.moveBtn = new ImgBtn(this);
    this.moveBtn.text = "移动";
    this.moveBtn.addEventListener("touchTap", this.requestColorMoveStuff, this);
    this.attackBtn = new ImgBtn(this);
    this.attackBtn.text = "攻击";
    this.attackBtn.addEventListener("touchTap", this.requestColorAttackStuff, this);
    this.skillBtn = new ImgBtn(this);
    this.skillBtn.text = "技能";
    this.skillBtn.addEventListener("touchTap", this.requestSkillStuff, this);
    this.attackWallBtn = new ImgBtn(this);
    this.attackWallBtn.text = "攻击城墙";
    this.attackWallBtn.addEventListener("touchTap", this.requestAtkWallStuff, this);
    this.cancelBtn = new ImgBtn(this);
    this.cancelBtn.text = "取消";
    this.cancelBtn.addEventListener("touchTap", this.hideGeneralMenu, this);

    this.generalMenu.x = 86;
    this.generalMenu.y = 277;
    this.generalMenu.layoutPaddingLeft = 43;
    this.generalMenu.layoutPaddingTop = 53;
    this.generalMenu.layoutBgColorAlpha = 0.5;

    this.generalMenu.addLayoutChild(this.moveBtn);
    this.generalMenu.addLayoutChild(this.attackBtn);
    this.generalMenu.addLayoutChild(this.skillBtn);
    this.generalMenu.addLayoutChild(this.attackWallBtn);
    this.generalMenu.addLayoutChild(this.cancelBtn);

    this.generalMenu.touchEnabled = true;
    this.generalMenu.addEventListener("touchTap", this.hideGeneralMenu, this, true);
    this.generalMenu.visible = false;
    this.addChild(this.generalMenu);
  }

  atkSkillMenu: VerticalLayout;
  skillCancelBtn: ImgBtn;
  skillOneBtn: ImgBtn;
  private createAtkSkillMenu() {
    this.atkSkillMenu = new VerticalLayout(this);
    this.skillCancelBtn = new ImgBtn(this);
    this.skillCancelBtn.text = "不使用";
    this.skillCancelBtn.addEventListener("touchTap", this.operateAtkSkillCancel, this);
    this.skillOneBtn = new ImgBtn(this);
    this.skillOneBtn.text = "勇";
    this.skillOneBtn.addEventListener("touchTap", this.operateAtkSkillYong, this);

    this.atkSkillMenu.x = 86;
    this.atkSkillMenu.y = 277;
    this.atkSkillMenu.layoutPaddingLeft = 43;
    this.atkSkillMenu.layoutPaddingTop = 53;
    this.atkSkillMenu.layoutBgColorAlpha = 0.5;

    this.atkSkillMenu.addLayoutChild(this.skillCancelBtn);
    this.atkSkillMenu.addLayoutChild(this.skillOneBtn);

    this.atkSkillMenu.touchEnabled = true;
    this.atkSkillMenu.addEventListener("touchTap", this.hideAtkSkillMenu, this, true);
    this.atkSkillMenu.visible = false;
    this.addChild(this.atkSkillMenu);
  }

  extraSkillMenu: VerticalLayout;
  es1Btn: ImgBtn;
  es2Btn: ImgBtn;
  es3Btn: ImgBtn;
  es4Btn: ImgBtn;
  es5Btn: ImgBtn;
  private createExtraSkillMenu() {
    this.extraSkillMenu = new VerticalLayout(this);
    this.es1Btn = new ImgBtn(this);
    this.es1Btn.addEventListener("touchTap", this.onEs1BtnTap, this);
    this.es2Btn = new ImgBtn(this);
    this.es2Btn.addEventListener("touchTap", this.onEs2BtnTap, this);
    this.es3Btn = new ImgBtn(this);
    this.es3Btn.addEventListener("touchTap", this.onEs3BtnTap, this);
    this.es4Btn = new ImgBtn(this);
    this.es4Btn.addEventListener("touchTap", this.onEs4BtnTap, this);
    this.es5Btn = new ImgBtn(this);
    this.es5Btn.addEventListener("touchTap", this.onEs5BtnTap, this);

    this.extraSkillMenu.x = 86;
    this.extraSkillMenu.y = 277;
    this.extraSkillMenu.layoutPaddingLeft = 43;
    this.extraSkillMenu.layoutPaddingTop = 53;
    this.extraSkillMenu.layoutBgColorAlpha = 0.5;

    this.extraSkillMenu.addLayoutChild(this.es1Btn);
    this.extraSkillMenu.addLayoutChild(this.es2Btn);
    this.extraSkillMenu.addLayoutChild(this.es3Btn);
    this.extraSkillMenu.addLayoutChild(this.es4Btn);
    this.extraSkillMenu.addLayoutChild(this.es5Btn);

    this.extraSkillMenu.touchEnabled = true;
    this.extraSkillMenu.addEventListener("touchTap", this.hideAtkSkillMenu, this, true);
    this.extraSkillMenu.visible = false;
    this.addChild(this.extraSkillMenu);
  }

  private showExtraSkillMenu(str: string) {
    if (this.playerCamp === this.currentCamp) {
      this.extraSkillMenu.visible = true;
      switch (str) {
        case "落石":
          this.es1Btn.visible = true;
          this.es2Btn.visible = true;
          this.es3Btn.visible = true;
          this.es4Btn.visible = true;
          this.es5Btn.visible = true;
          this.es1Btn.text = "北方";
          this.es2Btn.text = "南方";
          this.es3Btn.text = "东方";
          this.es4Btn.text = "西方";
          this.es5Btn.text = "取消";
          let luoshiA = this.checkLuoShiAvailable();
          this.es1Btn.touchEnabled = luoshiA[0];
          this.es1Btn.clickable = luoshiA[0];
          this.es2Btn.touchEnabled = luoshiA[1];
          this.es2Btn.clickable = luoshiA[1];
          this.es3Btn.touchEnabled = luoshiA[2];
          this.es3Btn.clickable = luoshiA[2];
          this.es4Btn.touchEnabled = luoshiA[3];
          this.es4Btn.clickable = luoshiA[3];
          this.es5Btn.touchEnabled = true;
          this.es5Btn.clickable = true;
          break;
        case "火烧赤壁":
          this.es1Btn.visible = true;
          this.es2Btn.visible = true;
          this.es3Btn.visible = true;
          this.es4Btn.visible = false;
          this.es5Btn.visible = false;
          this.es1Btn.text = "北半场";
          this.es2Btn.text = "南半场";
          this.es3Btn.text = "取消";
          let hscbA = this.checkHSCBAvailable();
          this.es1Btn.touchEnabled = hscbA[0];
          this.es1Btn.clickable = hscbA[0];
          this.es2Btn.touchEnabled = hscbA[1];
          this.es2Btn.clickable = hscbA[1];
          this.es3Btn.touchEnabled = true;
          this.es3Btn.clickable = true;
      }
    }
  }

  private hideExtraSkillMenu() {
    this.extraSkillMenu.visible = false;
  }

  private onEsBtnTap(num: number) {
    this.hideExtraSkillMenu();
    let imgBtn: ImgBtn;
    switch (num) {
      case 1:
        imgBtn = this.es1Btn;
        break;
      case 2:
        imgBtn = this.es2Btn;
        break;
      case 3:
        imgBtn = this.es3Btn;
        break;
      case 4:
        imgBtn = this.es4Btn;
        break;
      case 5:
        imgBtn = this.es5Btn;
        break;
    }
    let text = imgBtn.text;
    if (text === "取消") {
      this.extraSkillMessage = {};
      return;
    }
    this.extraSkillMessage["btnText"] = [];
    this.extraSkillMessage["btnText"].push(text);
    this.requestSkillStuff();
  }

  private onEs1BtnTap() {
    this.onEsBtnTap(1);
  }

  private onEs2BtnTap() {
    this.onEsBtnTap(2);
  }

  private onEs3BtnTap() {
    this.onEsBtnTap(3);
  }

  private onEs4BtnTap() {
    this.onEsBtnTap(4);
  }

  private onEs5BtnTap() {
    this.onEsBtnTap(5);
  }

  gameOverView: egret.Sprite;
  gameOverText: egret.TextField;
  private createGameOverView() {
    this.gameOverView = new egret.Sprite();
    this.gameOverView.graphics.beginFill(0x000000, 0.5);
    this.gameOverView.graphics.drawRect(0, 0, 750, 1200);
    this.gameOverView.graphics.endFill();

    this.gameOverText = new egret.TextField();
    this.gameOverText.x = 20;
    this.gameOverText.y = 500;
    this.gameOverText.text = "南方胜利";
    this.gameOverText.width = 720;
    this.gameOverText.textAlign = "center";
    this.gameOverText.size = 40;
    this.gameOverText.fontFamily = "KaiTi";

    this.gameOverView.addChild(this.gameOverText);

    this.gameOverView.touchEnabled = true;
    this.gameOverView.addEventListener("touchTap", this.operateFinishGameStuff, this, true);
    this.gameOverView.visible = false;
    this.addChild(this.gameOverView);
  }

  socket: GameSocket;

  private initWebSocket(): void {
    this.socket = GameSocket.getInstance();
    //添加收到数据侦听，收到数据会调用此方法
    this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    //添加链接打开侦听，连接成功会调用此方法
    this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
    //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
    this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
    //添加异常侦听，出现异常会调用此方法
    this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
  }

  private onSocketOpen(evt: Event): void {
  }

  private onSocketClose(evt: Event): void {
    console.log("close");
    this.finish();
  }

  private onSocketError(evt: Event): void {
    console.log("error");
    this.finish();
  }

  private finish() {
    this.socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    this.socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
    this.socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
    this.socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    this.socket = null;

    this.startScene.addSocketListener();
    this.startScene.enableAllTouchable();

    this.par.removeChild(this);
  }

  private onReceiveMessage(e: any): void {
    this.requestWaitEnd();
    let data = this.socket.readUTF();
    data = JSON.parse(data);
    let status = data["status"];
    if (status === 2) {
      this.operatedIndex = data["operatedIndex"];
      this.targetIndex = data["targetIndex"];
      switch (data["action"]) {
        case "colorMoveable":
          this.beginColorMoveStuff();
          break;
        case "moveGeneral":
          this.operateMoveStuff();
          break;
        case "colorAttackable":
          this.beginColorAttackStuff();
          break;
        case "attackGeneral":
          this.currentAtkSkill = data["atkSkill"];
          this.operateAttackStuff();
          break;
        case "atkWall":
          this.operateAtkWallStuff();
          break;
        case "colorRevival":
          this.colorRevivalStuff();
          break;
        case "revivalGeneral":
          this.operateRevivalStuff();
          break;
        case "turnEnd":
          this.beginTurnEndStuff(-this.currentCamp);
          this.beginTurnStartStuff(this.currentCamp);
          break;
        case "turnStart":
          break;
        case "skill":
          this.extraSkillMessage = data["extraSkillMessage"];
          this.operateSkillStuff();
          break;
      }
    }
  }

  // 防止重复请求
  private _waitingResponse = false;
  private requestWaitStart() {
    // 这里添加一个 waitingView 吧 :)
    this._waitingResponse = true;
  }

  // 防止重复请求
  private requestWaitEnd() {
    this._waitingResponse = false;
  }
}