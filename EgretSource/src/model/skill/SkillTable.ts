class Skill {
  name: string;
  type: string;
  onceUsed: boolean;
  cost: string;
  text: string;
  public constructor(skill?: Skill) {
    if (skill) {
      this.name = skill.name;
      this.type = skill.type;
      this.cost = skill.cost;
      this.text = skill.text;
      this.onceUsed = false;
    } else {
      this.name = "No";
      this.type = "";
      this.cost = "";
      this.text = "";
      this.onceUsed = false;
    }
  }
}

class SkillTable {
  private static $SkillTable = SkillTable.createTable();

  static getSkillTable() {
    if (!SkillTable.$SkillTable) {
      SkillTable.$SkillTable = SkillTable.createTable();
    }
    return SkillTable.$SkillTable;
  }

  private static createTable() {
    let $SkillTable = RES.getRes("skills_json");
    return $SkillTable;
  };
}



