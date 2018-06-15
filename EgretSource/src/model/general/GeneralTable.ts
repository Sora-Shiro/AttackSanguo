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

  public static getGeneralsByPower(p: string): General[] {
    let result = [];
    for (let gNum in this.getGeneralTable()) {
      let g = this.getGeneralTable()[gNum];
      if (g["power"] === p) {
        result.push(g);
      }
    }
    return result;
  }

  public static getGeneralsByKey(nums: string[]): General[] {
    let gs = [];
    for (let i = 0; i < nums.length; i++) {
      let g = this.getGeneralTable()[nums[i]];
      gs.push(g);
    }
    return gs;
  }

}