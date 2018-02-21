import json
import os

generals_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, 'data', 'skills.json'))
with open(generals_file_path, 'r') as load_f:
    SkillTable = json.load(load_f)


class Skill:

    def __init__(self, skill_name):
        data = SkillTable[skill_name]
        self.name = data["name"]
        self.type = data["type"]
        self.cost = data["cost"]
        self.text = data["text"]
        self.onceUsed = data["onceUsed"]
