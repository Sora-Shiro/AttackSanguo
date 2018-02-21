class GeneralTable {
  private static $GeneralTable;

  static getGeneralTable() {
    if (!GeneralTable.$GeneralTable) {
      GeneralTable.$GeneralTable = GeneralTable.createTable();
    }
    return GeneralTable.$GeneralTable;
  }

  private static createTable() {
    let json = RES.getRes("generals_json");
    let resultTable = {};
    for (let key in json) {
      let g = General.parseGeneralByJson(json[key]);
      let skill = g.skill;
      switch (skill.name) {
        case "虎豹骑":
          g.armsInfo.attackRange += 1;
          g.armsInfo.moveStep += 1;
          g.yl += 1;
          break;
        case "无当飞军":
          g.tl += 5;
          g.maxTl += 5;
          g.armsInfo.attackRange += 1;
          g.armsInfo.moveStep += 1;
          break;
        case "丹阳卫":
          g.tl += 5;
          g.maxTl += 5;
          g.yl += 1;
          g.armsInfo.moveStep += 1;
          break;
        case "陷阵营":
          g.armsInfo.moveStep += 1;
          g.tl += 5;
          g.maxTl += 5;
          break;
      }
      resultTable[key] = g;
    }
    return resultTable;
  };

  public static getGeneralsByPower(powerName: string): General[] {
    switch (powerName) {
      case "白":
        return GeneralTable.getBaiGenerals();
      case "魏":
        return GeneralTable.getWeiGenerals();
      case "蜀":
        return GeneralTable.getShuGenerals();
      case "吴":
        return GeneralTable.getWuGenerals();
      case "群":
        return GeneralTable.getQunGenerals();
      case "晋":
        return GeneralTable.getJinGenerals();
    }
  }

  public static getGeneralsByKey(nums: string[]): General[] {
    let gs = [];
    for (let i = 0; i < nums.length; i++) {
      let g = GeneralTable.getGeneralTable()[nums[i]];
      gs.push(g);
    }
    return gs;
  }

  public static getBaiGenerals(): General[] {
    return this.getGeneralsByKey(["1", "2", "3", "4"]);
  }

  public static getWeiGenerals(): General[] {
    return this.getGeneralsByKey(["5", "6", "7", "8"]);
  }

  public static getShuGenerals(): General[] {
    return this.getGeneralsByKey(["9", "10", "11", "12"]);
  }

  public static getWuGenerals(): General[] {
    return this.getGeneralsByKey(["13", "14", "15", "16"]);
  }

  public static getQunGenerals(): General[] {
    return this.getGeneralsByKey(["17", "18", "19", "20"]);
  }

  public static getJinGenerals(): General[] {
    return this.getGeneralsByKey(["21", "22", "23", "24"]);
  }

}