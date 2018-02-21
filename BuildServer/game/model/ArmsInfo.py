# coding=utf-8
class ArmsInfo:

    def __init__(self):
        self.moveStep = 1
        self.ifStraight = False
        self.attackRange = 1
        self.maxTl = 1


def get_arms_info_by_name(arms, yl):
    result = ArmsInfo()
    if arms == u"步":
        result.moveStep = 2
        result.ifStraight = False
        result.attackRange = 1
        result.maxTl = 25 + yl * 2
    elif arms == u"骑":
        result.moveStep = 3
        result.ifStraight = True
        result.attackRange = 1
        result.maxTl = 20 + yl * 2
    elif arms == u"弓":
        result.moveStep = 2
        result.ifStraight = False
        result.attackRange = 2
        result.maxTl = 17 + yl * 2
    elif arms == u"器":
        result.moveStep = 2
        result.ifStraight = True
        result.attackRange = 1
        result.maxTl = 25 + yl * 2

    return result
