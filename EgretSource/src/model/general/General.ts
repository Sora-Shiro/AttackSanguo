class General {
  number: number;
  power: string;
  name: string;
  rare: string;
  arms: string;
  yl: number;
  armsInfo: ArmsInfo;
  zm: number;
  maxTl: number;
  tl: number;
  yong: boolean;
  fu: boolean;
  mei: boolean;
  cost: number;

  skill: Skill;

  hasMoved: boolean;
  hasAttacked: boolean;
  hasSkilled: boolean;
  hurtTurns: number;
  usedMoveStep: number;

  extraYl: number;
  extraZm: number;
  extraAtkRange: number;
  extraMoveStep: number;
  canPenetrate: boolean;
  extraMessage: any;
  untilDieMessage: any;
  lockedMessage: any;
  public constructor() {
    this.number = 1;
    this.power = "蜀";
    this.name = "白板";
    this.rare = "SR";
    this.arms = "弓";
    this.yl = 1;
    this.armsInfo = ArmsInfo.getArmsInfoByName("弓", this.yl);
    this.zm = 10;
    this.maxTl = this.armsInfo.maxTl;
    this.tl = this.armsInfo.maxTl;
    this.yong = false;
    this.fu = true;
    this.mei = true;
    this.cost = 0;
    this.skill = SkillTable.getSkillTable()["白板"];

    this.hasMoved = false;
    this.hasAttacked = false;
    this.hasSkilled = false;
    this.hurtTurns = 0;

    this.extraYl = 0;
    this.extraZm = 0;
    this.extraAtkRange = 0;
    this.extraMoveStep = 0;
    this.canPenetrate = false;

    this.extraMessage = {};
    this.untilDieMessage = {};
    this.lockedMessage = {};
  }

  static getRandomGeneral = function () {
    let g = new General();
    g.number = 1;
    g.power = "蜀";
    g.name = "白\n板";
    g.rare = "SR";
    let randomArm = getRandomNum(0, 3);
    switch (randomArm) {
      case 0:
        g.arms = "弓";
        break;
      case 1:
        g.arms = "骑";
        break;
      case 2:
        g.arms = "步";
        break;
      case 3:
        g.arms = "器";
        break;
    }
    g.yl = getRandomNum(1, 10);
    let armsInfo = ArmsInfo.getArmsInfoByName(g.arms, g.yl);
    g.armsInfo = armsInfo;
    g.zm = getRandomNum(1, 10);
    g.maxTl = armsInfo.maxTl;
    g.tl = armsInfo.maxTl;
    g.yong = getRandomNum(0, 2) === 1 ? true : false;
    g.fu = getRandomNum(0, 2) === 1 ? true : false;
    g.mei = getRandomNum(0, 2) === 1 ? true : false;
    g.cost = getRandomNum(0, 10);
    return g;
  };

  static parseGeneralByJson(g: any):General {
    let general = new General();
    general.number = g["number"];
    general.power = g["power"];
    general.name = g["name"];
    general.rare = g["rare"];
    general.arms = g["arms"];
    general.yl = Number(g["yl"]);
    general.armsInfo = ArmsInfo.getArmsInfoByName(general.arms, general.yl);
    general.zm = Number(g["zm"]);
    general.maxTl = general.armsInfo.maxTl;
    general.tl = general.armsInfo.maxTl;
    general.yong = g["yong"];
    general.fu = g["fu"];
    general.mei = g["mei"];
    general.skill = SkillTable.getSkillTable()[g["skill"]];
    general.cost = g["cost"];
    return general;
  }
}

function getRandomNum(Min, Max) {
  let Range = Max - Min;
  let Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}
