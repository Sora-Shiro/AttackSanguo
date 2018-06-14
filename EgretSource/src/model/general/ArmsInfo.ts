
class ArmsInfo {
  moveStep: number;
  ifStraight: boolean;
  attackRange: number;
  maxTl: number;

  static getArmsInfoByName = function (arms: string, yl: number): ArmsInfo {
    let result = new ArmsInfo();
    switch (arms) {
      case "步":
        result = {
          moveStep: 2,
          ifStraight: false,
          attackRange: 1,
          maxTl: 25 + yl * 2,
        };
        break;
      case "骑":
        result = {
          moveStep: 3,
          ifStraight: false,
          attackRange: 1,
          maxTl: 20 + yl * 2,
        };
        break;
      case "弓":
        result = {
          moveStep: 2,
          ifStraight: false,
          attackRange: 2,
          maxTl: 15 + yl * 2,
        };
        break;
      case "器":
        result = {
          moveStep: 2,
          ifStraight: true,
          attackRange: 1,
          maxTl: 25 + yl * 2,
        };
        break;
    }
    return result;
  };
}

