# coding=utf-8
import json
import os

from channels import Group
from channels.sessions import channel_session

from game.model.General import General, GeneralTable

'''
Server status code:
-1: request error (key: msg, resStr)
0: ok response (key: msg, resStr)
1: broadcast message (key: msg, reqStr)
2: broadcast game data (key: gameData)
'''


# Connected to websocket.connect
@channel_session
def ws_connect(message):
    # Accept connection
    message.reply_channel.send({"accept": True})
    # Parse the query string
    # params = urlparse.parse_qs(message.content["query_string"])


# Connected to websocket.receive
@channel_session
def ws_message(message):
    receive_text = message["text"]
    data = json.loads(receive_text)

    req_str = data["reqStr"]

    if req_str == "enterRoom":
        user_name = data["userName"]
        room_name = data["roomName"]
        g_detail = data["gDetail"]
        enter_room(message, user_name, room_name, g_detail)
    elif req_str == "getRoom":
        user_name = data["userName"]
        room_name = data["roomName"]
        get_game_data(message, user_name, room_name)
    elif req_str == "postData":
        handle_game_data(message, data)


# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message):
    if ("room_name" in message.channel_session) and ("username" in message.channel_session):
        room_name = message.channel_session["room_name"]
        user_name = message.channel_session["username"]
        if room_name in RoomDetail:
            room = RoomDetail[room_name]
            up_player = room["upPlayer"]
            down_player = room["downPlayer"]
            if_begin = room["ifBegin"]
            if user_name == up_player:
                if if_begin:
                    Group("game-room-%s" % room_name).send({
                        "text": json.dumps({
                            "status": 1,
                            "reqStr": "upLeaveGame",
                            "msg": u"北方玩家 %s 离线，游戏结束" % user_name,
                        }),
                        "close": True
                    })
                    del room
                else:
                    Group("game-room-%s" % room_name).send({
                        "text": json.dumps({
                            "status": 1,
                            "reqStr": "upLeaveRoom",
                            "msg": u"北方玩家 %s 离开房间" % user_name,
                        }),
                    })
                    room["upPlayer"] = ""
            elif user_name == down_player:
                if if_begin:
                    Group("game-room-%s" % room_name).send({
                        "text": json.dumps({
                            "status": 1,
                            "reqStr": "downLeaveGame",
                            "msg": u"南方玩家 %s 离线，游戏结束" % user_name,
                        }),
                        "close": True
                    })
                    del room
                else:
                    Group("game-room-%s" % room_name).send({
                        "text": json.dumps({
                            "status": 1,
                            "reqStr": "downLeaveRoom",
                            "msg": u"南方玩家 %s 离开房间" % user_name,
                        }),
                    })
                    room["downPlayer"] = ""
            elif user_name in room["otherPlayers"]:
                room["otherPlayers"].remove(user_name)
                Group("game-room-%s" % room_name).send({
                    "text": json.dumps({
                        "status": 1,
                        "reqStr": "otherLeaveRoom",
                        "msg": u"观战玩家 %s 离开房间" % user_name,
                    }),
                })
        Group("game-room-%s" % room_name).discard(message.reply_channel)


RoomDetail = {}

def enter_room(message, user_name, room_name, g_detail):
    # Check if room exist
    if room_name not in RoomDetail:
        RoomDetail[room_name] = {}
        RoomDetail[room_name]["ifBegin"] = False
        RoomDetail[room_name]["upPlayer"] = ""
        RoomDetail[room_name]["downPlayer"] = ""
        RoomDetail[room_name]["otherPlayers"] = []

    room = RoomDetail[room_name]

    # Handle exceptions
    if user_name == room["upPlayer"] or user_name == room["downPlayer"]:
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "sameName",
                "msg": u"同一房间不能有相同名字",
            }),
            "close": True
        })
        return
    if (user_name and user_name == '') or not user_name:
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "nullPlayerName",
                "msg": u"玩家名不能为空",
            }),
            "close": True
        })
        return
    if (room_name and room_name == '') or not room_name:
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "nullRoomName",
                "msg": u"房间名不能为空",
            }),
            "close": True
        })
        return
    pos1 = g_detail["g1"]["pos"]
    pos2 = g_detail["g2"]["pos"]
    pos3 = g_detail["g3"]["pos"]
    pos4 = g_detail["g4"]["pos"]
    pos_set = {pos1, pos2, pos3, pos4}
    if len(pos_set) != 4:
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "wrongPos",
                "msg": u"武将位置应该两两不同",
            }),
            "close": True
        })
        return
    # Check if generals are same power
    n1 = str(g_detail["g1"]["num"])
    n2 = str(g_detail["g2"]["num"])
    n3 = str(g_detail["g3"]["num"])
    n4 = str(g_detail["g4"]["num"])
    in1 = n1 in GeneralTable
    in2 = n2 in GeneralTable
    in3 = n3 in GeneralTable
    in4 = n4 in GeneralTable
    if not (in1 and in2 and in3 and in4):
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "nonExistG",
                "msg": u"不存在的武将",
            }),
            "close": True
        })
        return
    p1 = GeneralTable[n1]["power"]
    p2 = GeneralTable[n2]["power"]
    p3 = GeneralTable[n3]["power"]
    p4 = GeneralTable[n4]["power"]
    if not (p1 == p2 == p3 == p4):
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "msg": "diffPower",
                "resStr": u"武将国籍不统一",
            }),
            "close": True
        })
        return

    # Handle enter room
    # Set the username in the session
    message.channel_session["room_name"] = room_name
    message.channel_session["username"] = user_name
    if len(room["downPlayer"]) == 0:
        room["downPlayer"] = user_name
        room["downGenerals"] = g_detail
        room["downPower"] = p1
        message.reply_channel.send({
            "text": json.dumps({
                "status": 0,
                "resStr": "enterSucceed",
                "msg": u"进入 %s 房间成功，你是南方玩家" % (room_name),
                "camp": 1,
            }),
        })
        Group("game-room-%s" % room_name).send({
            "text": json.dumps({
                "status": 1,
                "reqStr": "upEnterRoom",
                "msg": u"南方玩家 %s 加入" % (user_name),
            }),
        })
    elif len(room["upPlayer"]) == 0:
        room["upPlayer"] = user_name
        room["upGenerals"] = g_detail
        room["upPower"] = p1
        message.reply_channel.send({
            "text": json.dumps({
                "status": 0,
                "resStr": "enterSucceed",
                "msg": u"进入 %s 房间成功，你是北方玩家" % (room_name),
                "camp": -1,
            }),
        })
        Group("game-room-%s" % room_name).send({
            "text": json.dumps({
                "status": 1,
                "reqStr": "downEnterRoom",
                "msg": u"北方玩家 %s 加入，游戏即将开始" % (user_name),
            }),
        })
    else:
        room["otherPlayers"].append(user_name)
        message.reply_channel.send({
            "text": json.dumps({
                "status": 0,
                "resStr": "enterSucceed",
                "msg": u"进入 %s 房间成功，你是观战者" % (room_name),
                "camp": 0,
            }),
        })
        Group("game-room-%s" % room_name).send({
            "text": json.dumps({
                "status": 1,
                "reqStr": "otherEnterRoom",
                "msg": u"观战者 %s 加入" % (user_name),
            }),
        })

    Group("game-room-%s" % room_name).add(message.reply_channel)

    start_game(room_name)


def start_game(room_name):
    room = RoomDetail[room_name]
    # Handle game start
    if_begin = room["ifBegin"]
    if_down = len(room["downPlayer"]) != 0
    if_up = len(room["upPlayer"]) != 0
    if (not if_begin) and if_down and if_up:
        room["ifBegin"] = True
        room["currentCamp"] = 1
        # Init game data
        room["upMorale"] = 0
        room["downMorale"] = 1
        room["upWall"] = 50
        room["downWall"] = 50
        room["leftChesses"] = [
            {"g": None, "camp": -1},
            {"g": None, "camp": -1},
            {"g": None, "camp": -1},
            {"g": None, "camp": -1},
        ]
        room["rightChesses"] = [
            {"g": None, "camp": 1},
            {"g": None, "camp": 1},
            {"g": None, "camp": 1},
            {"g": None, "camp": 1},
        ]
        room["chesses"] = []
        up_chesses = [
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0}
        ]
        for key, value in room["upGenerals"].items():
            num = value["num"]
            pos = int(value["pos"])
            g = GeneralTable[str(num)]
            if g["mei"]:
                room["upWall"] += 5
            up_chesses.pop(pos - 1)
            up_chesses.insert(pos - 1, {"g": g, "camp": -1})
        down_chesses = [
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0},
            {"g": None, "camp": 0}
        ]
        for key, value in room["downGenerals"].items():
            num = value["num"]
            pos = int(value["pos"])
            g = GeneralTable[str(num)]
            if g["mei"]:
                room["downWall"] += 5
            down_chesses.pop(pos - 1)
            down_chesses.insert(pos - 1, {"g": g, "camp": 1})
        room["chesses"].append(up_chesses)
        for i in range(4):
            room["chesses"].append([
                {"g": None, "camp": 0},
                {"g": None, "camp": 0},
                {"g": None, "camp": 0},
                {"g": None, "camp": 0},
                {"g": None, "camp": 0},
                {"g": None, "camp": 0}
            ])
        room["chesses"].append(down_chesses)

        # Implement game chessboard
        room["chessBoard"] = []
        for i in range(6):
            chess_row = []
            for j in range(6):
                chess = room["chesses"][i][j]
                camp = chess["camp"]
                real_g = None
                if chess["g"]:
                    virtual_g_num = chess["g"]["number"]
                    real_g = General(virtual_g_num)
                real_chess = {"g": real_g, "camp": camp}
                chess_row.append(real_chess)
            room["chessBoard"].append(chess_row)

        # Broadcast start game
        open_data = get_room_open_data(room)
        del open_data["chessBoard"]
        broadcast_data = {
            "status": 1,
            "msg": u"游戏开始",
            "reqStr": "startGame",
        }
        final_start_data = dict(open_data, **broadcast_data)
        Group("game-room-%s" % room_name).send({
            "text": json.dumps(final_start_data),
        })


def get_game_data(message, room_name, username):
    if room_name not in RoomDetail:
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "noRoom",
                "msg": u"房间不存在",
            }),
            "close": True,
        })
        return
    room = RoomDetail[room_name]
    if_begin = room["ifBegin"]
    if not if_begin:
        message.reply_channel.send({
            "text": json.dumps({
                "status": 0,
                "resStr": "notBegin",
                "msg": u"游戏尚未开始",
            }),
        })
        return
    result = get_room_open_data(room)
    message.reply_channel.send({
        "status": 0,
        "resStr": "otherLoadSucceed",
        "msg": u"读取游戏数据成功",
        "text": json.dumps(result),
    })


def get_room_open_data(room):
    u_m = room["upMorale"]
    d_m = room["downMorale"]
    u_w = room["upWall"]
    d_w = room["downWall"]
    l_c = room["leftChesses"]
    r_c = room["rightChesses"]
    c = room["chesses"]
    u_p = room["upPlayer"]
    d_p = room["downPlayer"]
    o_p = room["otherPlayers"]
    u_pow = room["upPower"]
    d_pow = room["downPower"]
    c_camp = room["currentCamp"]
    chess_board = room["chessBoard"]
    result = {
        "upMorale": u_m,
        "downMorale": d_m,
        "upWall": u_w,
        "downWall": d_w,
        "leftChesses": l_c,
        "rightChesses": r_c,
        "chesses": c,
        "upPlayer": u_p,
        "downPlayer": d_p,
        "otherPlayers": o_p,
        "upPower": u_pow,
        "downPower": d_pow,
        "currentCamp": c_camp,
        "chessBoard": chess_board,
    }
    return result


def handle_game_data(message, data):
    room_name = message.channel_session["room_name"]
    user_name = message.channel_session["username"]
    room = RoomDetail[room_name]
    c_camp = room["currentCamp"]
    u_p = room["upPlayer"]
    d_p = room["downPlayer"]
    can_post_player = ""
    if c_camp == 1:
        can_post_player = d_p
    elif c_camp == -1:
        can_post_player = u_p
    if not user_name == can_post_player:
        message.reply_channel.send({
            "text": json.dumps({
                "status": -1,
                "resStr": "noAuthority",
                "msg": u"你不是当前回合玩家，无权限操作",
            }),
            "close": True
        })
    action = data["action"]
    operated_index = data["operatedIndex"]
    target_index = data["targetIndex"]

    broadcast_data = {
        "status": 2,
        "action": action,
        "operatedIndex": operated_index,
        "targetIndex": target_index,
    }

    chess_board = room["chessBoard"]

    # Check if possible
    if action == "colorMoveable":
        pass
    elif action == "moveGeneral":
        pass
    elif action == "colorAttackable":
        pass
    elif action == "attackGeneral":
        atk_skill = data["atkSkill"]
        broadcast_data["atkSkill"] = atk_skill
    elif action == "atkWall":
        pass
    elif action == "colorRevival":
        pass
    elif action == "revivalGeneral":
        pass
    elif action == "turnEnd":
        room["currentCamp"] = -room["currentCamp"]
        if room["currentCamp"] == 1:
            room["downMorale"] += 1
        else:
            room["upMorale"] += 1
    elif action == "skill":
        extra_skill_message = data["extraSkillMessage"]
        broadcast_data["extraSkillMessage"] = extra_skill_message

    Group("game-room-%s" % room_name).send({
        "text": json.dumps(broadcast_data),
    })
