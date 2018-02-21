import json
import os

from game.model import ArmsInfo
from game.model.Skill import Skill

generals_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, 'data', 'generals.json'))
with open(generals_file_path, 'r') as load_f:
    GeneralTable = json.load(load_f)


class General:

    def __init__(self, general_num):
        g_data = GeneralTable[str(general_num)]
        self.number = g_data["number"]
        self.name = g_data["name"]
        self.power = g_data["power"]
        self.rare = g_data["rare"]
        self.yl = g_data["yl"]
        self.zm = g_data["zm"]
        self.arms = g_data["arms"]
        self.yong = g_data["yong"]
        self.fu = g_data["fu"]
        self.mei = g_data["mei"]
        self.skill = Skill(g_data["skill"])

        self.armsInfo = ArmsInfo.get_arms_info_by_name(self.arms, self.yl)
        self.maxTl = self.armsInfo.maxTl
        self.tl = self.maxTl

        self.hasMoved = False
        self.hasAttacked = False
        self.hasSkilled = False
        self.hurtTurns = 0

        self.extraYl = 0
        self.extraZm = 0
        self.extraAtkRange = 0
        self.extraMoveStep = 0
        self.canPenetrate = False





