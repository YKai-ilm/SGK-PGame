// 字卡技能實裝資料；既有技能優先保留。
window.ADDITIONAL_HERO_SKILLS={
  "version": 1,
  "entries": [
    {
      "name": "曹仁",
      "faction": "魏",
      "role": "近戰盾衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "八門拒守",
      "effect1": "guard",
      "skill2": "突圍救軍",
      "effect2": "cleave",
      "skill1Overrides": {
        "duration": 4,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.5,
        "range": 2.5,
        "width": 1.4,
        "pushDistance": 0.4,
        "cd": 8
      },
      "abilities": {
        "str": 88,
        "int": 80,
        "lead": 94,
        "body": 96,
        "agi": 58,
        "charm": 72
      },
      "quality": "紅"
    },
    {
      "name": "周瑜",
      "faction": "吳",
      "role": "謀略火攻",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "赤焰連營",
      "effect1": "magicBlast",
      "skill2": "都督破策",
      "effect2": "areaBreak",
      "skill1Overrides": {
        "ratio": 1.8,
        "radius": 1.8,
        "cd": 9
      },
      "skill2Overrides": {
        "ratio": 0.8,
        "radius": 1.5,
        "duration": 2.5,
        "cd": 10
      },
      "abilities": {
        "str": 72,
        "int": 96,
        "lead": 97,
        "body": 73,
        "agi": 79,
        "charm": 94
      },
      "quality": "紫"
    },
    {
      "name": "呂蒙",
      "faction": "吳",
      "role": "近戰謀略",
      "archetype": "hybrid",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "白衣渡江",
      "effect1": "hybridStrike",
      "skill2": "士別三日",
      "effect2": "cleanseSelf",
      "skill1Overrides": {
        "ratio": 1.15,
        "magicRatio": 0.9,
        "cd": 8
      },
      "skill2Overrides": {
        "grantHaste": 0.15,
        "buffDuration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 84,
        "int": 90,
        "lead": 92,
        "body": 85,
        "agi": 78,
        "charm": 79
      },
      "quality": "紅"
    },
    {
      "name": "呂布",
      "faction": "群雄",
      "role": "近戰強攻",
      "archetype": "spear",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "方天畫戟",
      "skill1": "轅門破陣",
      "effect1": "cleave",
      "skill2": "無雙奮戟",
      "effect2": "stunBlast",
      "skill1Overrides": {
        "ratio": 2.3,
        "range": 3,
        "width": 1.6,
        "shieldDispel": 0.3,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 1.4,
        "radius": 1.2,
        "duration": 1.1,
        "cd": 11
      },
      "abilities": {
        "str": 99,
        "int": 60,
        "lead": 80,
        "body": 97,
        "agi": 94,
        "charm": 59
      },
      "quality": "紫"
    },
    {
      "name": "皇甫嵩",
      "faction": "東漢",
      "role": "統御防守",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "持陣待曉",
      "effect1": "guardArea",
      "skill2": "火攻破巾",
      "effect2": "magicBlast",
      "skill1Overrides": {
        "duration": 3,
        "radius": 1.5,
        "cd": 11
      },
      "skill2Overrides": {
        "ratio": 1.4,
        "radius": 1.5,
        "range": 3,
        "cd": 9
      },
      "abilities": {
        "str": 73,
        "int": 92,
        "lead": 95,
        "body": 78,
        "agi": 65,
        "charm": 87
      },
      "quality": "紅"
    },
    {
      "name": "朱儁",
      "faction": "東漢",
      "role": "近戰統御",
      "archetype": "spear",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "圍城突擊",
      "effect1": "cleave",
      "skill2": "整軍接應",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "ratio": 1.8,
        "range": 2.5,
        "width": 1.5,
        "cd": 7
      },
      "skill2Overrides": {
        "duration": 2.5,
        "grantBlocks": 1,
        "cd": 11
      },
      "abilities": {
        "str": 76,
        "int": 85,
        "lead": 91,
        "body": 82,
        "agi": 69,
        "charm": 81
      },
      "quality": "橘"
    },
    {
      "name": "曹操",
      "faction": "魏",
      "role": "統御調度",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "號令三軍",
      "effect1": "hasteArea",
      "skill2": "整軍再戰",
      "effect2": "cleanseArea",
      "skill1Overrides": {
        "grantHaste": 0.12,
        "buffDuration": 3,
        "radius": 1.5,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 0.7,
        "radius": 1.5,
        "cd": 11
      },
      "abilities": {
        "str": 84,
        "int": 96,
        "lead": 98,
        "body": 80,
        "agi": 73,
        "charm": 93
      },
      "quality": "紫"
    },
    {
      "name": "荀彧",
      "faction": "魏",
      "role": "謀略支援",
      "archetype": "supply",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "王佐安軍",
      "effect1": "regenArea",
      "skill2": "秉忠扶危",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "ratio": 0.5,
        "regenRatio": 0.15,
        "regenSeconds": 3,
        "radius": 1.5,
        "cd": 10
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 28,
        "int": 97,
        "lead": 85,
        "body": 54,
        "agi": 62,
        "charm": 95
      },
      "quality": "紫"
    },
    {
      "name": "荀攸",
      "faction": "魏",
      "role": "謀略破陣",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "奇策破陣",
      "effect1": "areaBreak",
      "skill2": "聲東擊西",
      "effect2": "rootStrike",
      "skill1Overrides": {
        "ratio": 1.15,
        "radius": 1.4,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 1.2,
        "duration": 1.4,
        "cd": 9
      },
      "abilities": {
        "str": 31,
        "int": 96,
        "lead": 80,
        "body": 57,
        "agi": 66,
        "charm": 80
      },
      "quality": "紅"
    },
    {
      "name": "賈詡",
      "faction": "魏",
      "role": "謀略削弱",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "亂武離間",
      "effect1": "confuse",
      "skill2": "毒士弱敵",
      "effect2": "weakenArea",
      "skill1Overrides": {
        "ratio": 0.8,
        "duration": 1.3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1,
        "radius": 1.4,
        "duration": 2.5,
        "cd": 10
      },
      "abilities": {
        "str": 36,
        "int": 97,
        "lead": 78,
        "body": 69,
        "agi": 74,
        "charm": 88
      },
      "quality": "紅"
    },
    {
      "name": "張遼",
      "faction": "魏",
      "role": "近戰突襲",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "威震逍遙",
      "effect1": "stunBlast",
      "skill2": "遼來破陣",
      "effect2": "strike",
      "skill1Overrides": {
        "ratio": 1.3,
        "radius": 1.2,
        "duration": 1,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.9,
        "shieldDispel": 0.3,
        "cd": 7
      },
      "abilities": {
        "str": 92,
        "int": 86,
        "lead": 94,
        "body": 89,
        "agi": 88,
        "charm": 82
      },
      "quality": "紫"
    },
    {
      "name": "樂進",
      "faction": "魏",
      "role": "近戰先登",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "先登斬",
      "effect1": "strike",
      "skill2": "奮勇追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.8,
        "shieldDispel": 0.25,
        "cd": 7
      },
      "skill2Overrides": {
        "ratio": 1.1,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 88,
        "int": 60,
        "lead": 84,
        "body": 84,
        "agi": 87,
        "charm": 65
      },
      "quality": "橘"
    },
    {
      "name": "于禁",
      "faction": "魏",
      "role": "近戰整軍",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "治軍有方",
      "effect1": "allyGuard",
      "skill2": "肅陣迎敵",
      "effect2": "physicalRoot",
      "skill1Overrides": {
        "duration": 3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.3,
        "duration": 1.2,
        "cd": 8
      },
      "abilities": {
        "str": 77,
        "int": 73,
        "lead": 90,
        "body": 83,
        "agi": 62,
        "charm": 57
      },
      "quality": "橘"
    },
    {
      "name": "張郃",
      "faction": "魏",
      "role": "近戰應變",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "巧變破勢",
      "effect1": "hybridStrike",
      "skill2": "應變解圍",
      "effect2": "cleanseSelf",
      "skill1Overrides": {
        "ratio": 1.3,
        "magicRatio": 0.5,
        "cd": 8
      },
      "skill2Overrides": {
        "grantHaste": 0.15,
        "buffDuration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 88,
        "int": 86,
        "lead": 91,
        "body": 86,
        "agi": 89,
        "charm": 75
      },
      "quality": "紅"
    },
    {
      "name": "徐晃",
      "faction": "魏",
      "role": "近戰破圍",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "大斧",
      "skill1": "長驅破圍",
      "effect1": "cleave",
      "skill2": "持斧穩陣",
      "effect2": "guard",
      "skill1Overrides": {
        "ratio": 1.8,
        "range": 2.5,
        "width": 1.4,
        "cd": 7
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 91,
        "int": 82,
        "lead": 91,
        "body": 93,
        "agi": 70,
        "charm": 75
      },
      "quality": "紫"
    },
    {
      "name": "孫堅",
      "faction": "吳",
      "role": "近戰先鋒",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "江東猛虎",
      "effect1": "cleave",
      "skill2": "討逆奮勇",
      "effect2": "healSelf",
      "skill1Overrides": {
        "ratio": 1.9,
        "range": 2.5,
        "width": 1.4,
        "cd": 7
      },
      "skill2Overrides": {
        "ratio": 1,
        "threshold": 0.5,
        "grantDamage": true,
        "buffDuration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 90,
        "int": 73,
        "lead": 91,
        "body": 90,
        "agi": 83,
        "charm": 86
      },
      "quality": "紫"
    },
    {
      "name": "孫策",
      "faction": "吳",
      "role": "近戰強襲",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "霸王突刺",
      "effect1": "strike",
      "skill2": "震軍雄威",
      "effect2": "stunBlast",
      "skill1Overrides": {
        "ratio": 2,
        "shieldDispel": 0.25,
        "cd": 7
      },
      "skill2Overrides": {
        "ratio": 1.2,
        "radius": 1.2,
        "duration": 1,
        "cd": 10
      },
      "abilities": {
        "str": 96,
        "int": 74,
        "lead": 93,
        "body": 93,
        "agi": 94,
        "charm": 92
      },
      "quality": "紫"
    },
    {
      "name": "孫權",
      "faction": "吳",
      "role": "統御支援",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "坐鎮江東",
      "effect1": "guardArea",
      "skill2": "勸學勵軍",
      "effect2": "hasteSupport",
      "skill1Overrides": {
        "duration": 3,
        "radius": 1.5,
        "cd": 11
      },
      "skill2Overrides": {
        "grantHaste": 0.18,
        "buffDuration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 67,
        "int": 83,
        "lead": 80,
        "body": 77,
        "agi": 68,
        "charm": 91
      },
      "quality": "橘"
    },
    {
      "name": "黃蓋",
      "faction": "吳",
      "role": "近戰火攻",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "烈火突擊",
      "effect1": "hybridStrike",
      "skill2": "苦肉堅忍",
      "effect2": "guard",
      "skill1Overrides": {
        "ratio": 1.2,
        "magicRatio": 0.7,
        "cd": 8
      },
      "skill2Overrides": {
        "duration": 4,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 83,
        "int": 82,
        "lead": 83,
        "body": 88,
        "agi": 62,
        "charm": 82
      },
      "quality": "橘"
    },
    {
      "name": "周泰",
      "faction": "吳",
      "role": "近戰護衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "不屈護主",
      "effect1": "allyGuard",
      "skill2": "傷痕奮起",
      "effect2": "healSelf",
      "skill1Overrides": {
        "duration": 3,
        "grantBlocks": 1,
        "cd": 11
      },
      "skill2Overrides": {
        "ratio": 1.3,
        "threshold": 0.4,
        "cd": 10
      },
      "abilities": {
        "str": 90,
        "int": 48,
        "lead": 72,
        "body": 97,
        "agi": 74,
        "charm": 76
      },
      "quality": "紅"
    },
    {
      "name": "甘寧",
      "faction": "吳",
      "role": "近戰奇襲",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "百騎劫營",
      "effect1": "cleave",
      "skill2": "錦帆追擊",
      "effect2": "strike",
      "skill1Overrides": {
        "ratio": 1.5,
        "width": 1,
        "range": 3,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 1.5,
        "targetMode": "weak",
        "threshold": 0.4,
        "executeBonus": 1.3,
        "cd": 7
      },
      "abilities": {
        "str": 93,
        "int": 80,
        "lead": 85,
        "body": 89,
        "agi": 94,
        "charm": 78
      },
      "quality": "紫"
    },
    {
      "name": "魯肅",
      "faction": "吳",
      "role": "謀略協作",
      "archetype": "supply",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "同盟接濟",
      "effect1": "chainHeal",
      "skill2": "合力護軍",
      "effect2": "areaShield",
      "skill1Overrides": {
        "ratio": 0.7,
        "hits": 3,
        "chainRange": 2,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "radius": 1.3,
        "cd": 11
      },
      "abilities": {
        "str": 72,
        "int": 93,
        "lead": 83,
        "body": 80,
        "agi": 65,
        "charm": 94
      },
      "quality": "紅"
    },
    {
      "name": "董卓",
      "faction": "群雄",
      "role": "近戰壓制",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "暴戾重斬",
      "effect1": "cleave",
      "skill2": "強徵自固",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.7,
        "range": 2.5,
        "width": 1.3,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 1,
        "threshold": 0.7,
        "cd": 10
      },
      "abilities": {
        "str": 88,
        "int": 72,
        "lead": 78,
        "body": 93,
        "agi": 65,
        "charm": 42
      },
      "quality": "橘"
    },
    {
      "name": "袁紹",
      "faction": "群雄",
      "role": "統御號召",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "四世號令",
      "effect1": "hasteArea",
      "skill2": "河北援軍",
      "effect2": "areaShield",
      "skill1Overrides": {
        "grantHaste": 0.12,
        "buffDuration": 3,
        "radius": 1.5,
        "cd": 11
      },
      "skill2Overrides": {
        "ratio": 0.8,
        "radius": 1.5,
        "cd": 11
      },
      "abilities": {
        "str": 68,
        "int": 72,
        "lead": 84,
        "body": 76,
        "agi": 60,
        "charm": 88
      },
      "quality": "橘"
    },
    {
      "name": "袁術",
      "faction": "群雄",
      "role": "統御資源",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "聚糧成勢",
      "effect1": "shield",
      "skill2": "僭號督戰",
      "effect2": "hasteSupport",
      "skill1Overrides": {
        "ratio": 0.9,
        "cd": 10
      },
      "skill2Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 61,
        "int": 50,
        "lead": 61,
        "body": 73,
        "agi": 53,
        "charm": 65
      },
      "quality": "青"
    },
    {
      "name": "劉表",
      "faction": "群雄",
      "role": "謀略守成",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 40,
        "int": 77,
        "lead": 76,
        "body": 61,
        "agi": 45,
        "charm": 85
      },
      "quality": "藍"
    },
    {
      "name": "夏侯惇",
      "faction": "魏",
      "role": "近戰堅守",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "獨目奮擊",
      "effect1": "strike",
      "skill2": "剛烈反擊",
      "effect2": "counterStance",
      "skill1Overrides": {
        "ratio": 1.8,
        "cd": 7
      },
      "skill2Overrides": {
        "ratio": 0.6,
        "range": 2,
        "duration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 90,
        "int": 64,
        "lead": 84,
        "body": 92,
        "agi": 74,
        "charm": 81
      },
      "quality": "紅"
    },
    {
      "name": "夏侯淵",
      "faction": "魏",
      "role": "遠攻急襲",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "疾行神射",
      "effect1": "multiStrike",
      "skill2": "千里奔襲",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "hits": 3,
        "ratio": 0.6,
        "range": 4,
        "cd": 8
      },
      "skill2Overrides": {
        "range": 4,
        "ratio": 1.3,
        "duration": 2.5,
        "cd": 9
      },
      "abilities": {
        "str": 88,
        "int": 66,
        "lead": 87,
        "body": 86,
        "agi": 91,
        "charm": 72
      },
      "quality": "紅"
    },
    {
      "name": "典韋",
      "faction": "魏",
      "role": "近戰護衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "雙鐵戟",
      "skill1": "惡來雙戟",
      "effect1": "cleave",
      "skill2": "死守營門",
      "effect2": "guard",
      "skill1Overrides": {
        "ratio": 1.9,
        "range": 2,
        "width": 1.5,
        "cd": 7
      },
      "skill2Overrides": {
        "duration": 3,
        "threshold": 0.7,
        "cd": 9
      },
      "abilities": {
        "str": 97,
        "int": 41,
        "lead": 66,
        "body": 98,
        "agi": 68,
        "charm": 74
      },
      "quality": "紫"
    },
    {
      "name": "許褚",
      "faction": "魏",
      "role": "近戰重衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "虎癡重擊",
      "effect1": "strike",
      "skill2": "裸衣奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "ratio": 2.2,
        "cd": 8
      },
      "skill2Overrides": {
        "threshold": 0.45,
        "ratio": 1.2,
        "grantDamage": true,
        "buffDuration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 98,
        "int": 42,
        "lead": 72,
        "body": 99,
        "agi": 57,
        "charm": 74
      },
      "quality": "紫"
    },
    {
      "name": "郭嘉",
      "faction": "魏",
      "role": "謀略預判",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "奇佐料敵",
      "effect1": "weakenArea",
      "skill2": "遺策追擊",
      "effect2": "magicStrike",
      "skill1Overrides": {
        "ratio": 0.8,
        "radius": 1.5,
        "duration": 3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.7,
        "controlledBonus": 0.25,
        "targetMode": "controlled",
        "cd": 8
      },
      "abilities": {
        "str": 24,
        "int": 98,
        "lead": 78,
        "body": 46,
        "agi": 78,
        "charm": 83
      },
      "quality": "紫"
    },
    {
      "name": "程昱",
      "faction": "魏",
      "role": "謀略守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 53,
        "int": 91,
        "lead": 79,
        "body": 75,
        "agi": 57,
        "charm": 86
      },
      "quality": "橘"
    },
    {
      "name": "司馬懿",
      "faction": "魏",
      "role": "謀略持守",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "鷹視破局",
      "effect1": "areaBreak",
      "skill2": "隱忍待變",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "radius": 1.5,
        "duration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "ratio": 1,
        "threshold": 0.7,
        "grantHaste": 0.12,
        "buffDuration": 3,
        "cd": 11
      },
      "abilities": {
        "str": 52,
        "int": 97,
        "lead": 96,
        "body": 82,
        "agi": 58,
        "charm": 88
      },
      "quality": "紫"
    },
    {
      "name": "太史慈",
      "faction": "吳",
      "role": "弓戟兼擅",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "篤烈連矢",
      "effect1": "multiStrike",
      "skill2": "信義援護",
      "effect2": "shield",
      "skill1Overrides": {
        "hits": 3,
        "ratio": 0.6,
        "range": 4,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "range": 3,
        "cd": 10
      },
      "abilities": {
        "str": 95,
        "int": 76,
        "lead": 80,
        "body": 91,
        "agi": 90,
        "charm": 84
      },
      "quality": "紫"
    },
    {
      "name": "陸遜",
      "faction": "吳",
      "role": "謀略持守火攻",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "火燒連營",
      "effect1": "magicBlast",
      "skill2": "持重待機",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.65,
        "radius": 2,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1,
        "threshold": 0.8,
        "cd": 10
      },
      "abilities": {
        "str": 75,
        "int": 96,
        "lead": 97,
        "body": 82,
        "agi": 73,
        "charm": 87
      },
      "quality": "紫"
    },
    {
      "name": "張昭",
      "faction": "吳",
      "role": "謀略安定",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 25,
        "int": 92,
        "lead": 75,
        "body": 54,
        "agi": 42,
        "charm": 94
      },
      "quality": "紅"
    },
    {
      "name": "諸葛瑾",
      "faction": "吳",
      "role": "謀略協調",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 33,
        "int": 84,
        "lead": 73,
        "body": 63,
        "agi": 53,
        "charm": 92
      },
      "quality": "橘"
    },
    {
      "name": "田豐",
      "faction": "群雄",
      "role": "謀略遠策",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "遠謀制敵",
      "effect1": "slow",
      "skill2": "直諫匡軍",
      "effect2": "cleanseHeal",
      "skill1Overrides": {
        "ratio": 0.9,
        "radius": 1.5,
        "duration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "ratio": 0.9,
        "cd": 9
      },
      "abilities": {
        "str": 28,
        "int": 94,
        "lead": 82,
        "body": 57,
        "agi": 47,
        "charm": 90
      },
      "quality": "紅"
    },
    {
      "name": "沮授",
      "faction": "群雄",
      "role": "謀略整軍",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "持重整軍",
      "effect1": "guardArea",
      "skill2": "軍議破計",
      "effect2": "break",
      "skill1Overrides": {
        "duration": 2.5,
        "radius": 1.3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.2,
        "range": 3,
        "duration": 2.5,
        "cd": 8
      },
      "abilities": {
        "str": 34,
        "int": 93,
        "lead": 82,
        "body": 62,
        "agi": 51,
        "charm": 76
      },
      "quality": "橘"
    },
    {
      "name": "張魯",
      "faction": "群雄",
      "role": "謀略聚眾",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "五斗施糧",
      "effect1": "regenArea",
      "skill2": "漢中護眾",
      "effect2": "areaShield",
      "skill1Overrides": {
        "ratio": 0.35,
        "regenRatio": 0.15,
        "regenSeconds": 3,
        "radius": 1.3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 0.7,
        "radius": 1.2,
        "cd": 11
      },
      "abilities": {
        "str": 31,
        "int": 76,
        "lead": 58,
        "body": 68,
        "agi": 44,
        "charm": 90
      },
      "quality": "橘"
    },
    {
      "name": "盧植",
      "faction": "東漢",
      "role": "統御教導",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "嚴整軍紀",
      "effect1": "cleanseArea",
      "skill2": "經略制敵",
      "effect2": "rootArea",
      "skill1Overrides": {
        "ratio": 0.7,
        "radius": 1.5,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1,
        "radius": 1.3,
        "range": 3,
        "duration": 1.2,
        "cd": 10
      },
      "abilities": {
        "str": 69,
        "int": 86,
        "lead": 90,
        "body": 78,
        "agi": 61,
        "charm": 91
      },
      "quality": "紅"
    },
    {
      "name": "李典",
      "faction": "魏",
      "role": "近戰策應",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 77,
        "int": 84,
        "lead": 83,
        "body": 76,
        "agi": 71,
        "charm": 82
      },
      "quality": "橘"
    },
    {
      "name": "文聘",
      "faction": "魏",
      "role": "近戰守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 82,
        "int": 74,
        "lead": 88,
        "body": 87,
        "agi": 62,
        "charm": 70
      },
      "quality": "橘"
    },
    {
      "name": "曹洪",
      "faction": "魏",
      "role": "近戰援護",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 80,
        "int": 48,
        "lead": 70,
        "body": 87,
        "agi": 65,
        "charm": 57
      },
      "quality": "藍"
    },
    {
      "name": "曹純",
      "faction": "魏",
      "role": "近戰精銳",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 80,
        "int": 74,
        "lead": 83,
        "body": 82,
        "agi": 86,
        "charm": 78
      },
      "quality": "橘"
    },
    {
      "name": "曹真",
      "faction": "魏",
      "role": "統御備禦",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 82,
        "int": 85,
        "lead": 90,
        "body": 85,
        "agi": 65,
        "charm": 84
      },
      "quality": "紅"
    },
    {
      "name": "張紘",
      "faction": "吳",
      "role": "謀略輔政",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 24,
        "int": 86,
        "lead": 57,
        "body": 52,
        "agi": 44,
        "charm": 84
      },
      "quality": "橘"
    },
    {
      "name": "程普",
      "faction": "吳",
      "role": "近戰宿將",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 85,
        "int": 79,
        "lead": 88,
        "body": 83,
        "agi": 62,
        "charm": 81
      },
      "quality": "橘"
    },
    {
      "name": "韓當",
      "faction": "吳",
      "role": "遠攻支援",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "穿楊",
      "effect1": "strike",
      "skill2": "阻行箭",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "range": 4,
        "ratio": 1.6
      },
      "skill2Overrides": {
        "range": 4,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 84,
        "int": 65,
        "lead": 82,
        "body": 86,
        "agi": 71,
        "charm": 70
      },
      "quality": "橘"
    },
    {
      "name": "高順",
      "faction": "群雄",
      "role": "近戰陷陣",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "陷陣破盾",
      "effect1": "cleave",
      "skill2": "整肅營陣",
      "effect2": "guardArea",
      "skill1Overrides": {
        "ratio": 1.6,
        "range": 2.5,
        "width": 1.2,
        "shieldDispel": 0.35,
        "cd": 8
      },
      "skill2Overrides": {
        "duration": 2,
        "radius": 1,
        "cd": 11
      },
      "abilities": {
        "str": 85,
        "int": 78,
        "lead": 91,
        "body": 89,
        "agi": 64,
        "charm": 68
      },
      "quality": "紅"
    },
    {
      "name": "何進",
      "faction": "東漢",
      "role": "統御徵集",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 57,
        "int": 42,
        "lead": 54,
        "body": 76,
        "agi": 43,
        "charm": 65
      },
      "quality": "綠"
    },
    {
      "name": "王允",
      "faction": "東漢",
      "role": "謀略策動",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 31,
        "int": 82,
        "lead": 61,
        "body": 53,
        "agi": 46,
        "charm": 71
      },
      "quality": "藍"
    },
    {
      "name": "孔融",
      "faction": "東漢",
      "role": "謀略聲援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 25,
        "int": 79,
        "lead": 43,
        "body": 51,
        "agi": 45,
        "charm": 86
      },
      "quality": "藍"
    },
    {
      "name": "鄭泰",
      "faction": "東漢",
      "role": "謀略審勢",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 35,
        "int": 85,
        "lead": 60,
        "body": 58,
        "agi": 55,
        "charm": 77
      },
      "quality": "藍"
    },
    {
      "name": "龐德",
      "faction": "魏",
      "role": "近戰強擊",
      "archetype": "spear",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "抬榇奮戰",
      "effect1": "strike",
      "skill2": "白馬拒敵",
      "effect2": "guard",
      "skill1Overrides": {
        "ratio": 2,
        "threshold": 0.4,
        "executeBonus": 1.2,
        "cd": 8
      },
      "skill2Overrides": {
        "threshold": 0.6,
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 92,
        "int": 64,
        "lead": 80,
        "body": 92,
        "agi": 79,
        "charm": 77
      },
      "quality": "紅"
    },
    {
      "name": "曹休",
      "faction": "魏",
      "role": "近戰策應",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 82,
        "int": 74,
        "lead": 82,
        "body": 82,
        "agi": 80,
        "charm": 70
      },
      "quality": "橘"
    },
    {
      "name": "曹丕",
      "faction": "魏",
      "role": "統御協作",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 68,
        "int": 82,
        "lead": 69,
        "body": 69,
        "agi": 67,
        "charm": 77
      },
      "quality": "藍"
    },
    {
      "name": "劉曄",
      "faction": "魏",
      "role": "謀略判勢",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 40,
        "int": 92,
        "lead": 72,
        "body": 59,
        "agi": 60,
        "charm": 72
      },
      "quality": "橘"
    },
    {
      "name": "滿寵",
      "faction": "魏",
      "role": "統御守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 64,
        "int": 85,
        "lead": 90,
        "body": 78,
        "agi": 58,
        "charm": 62
      },
      "quality": "橘"
    },
    {
      "name": "徐盛",
      "faction": "吳",
      "role": "近戰築防",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 83,
        "int": 84,
        "lead": 86,
        "body": 85,
        "agi": 73,
        "charm": 82
      },
      "quality": "紅"
    },
    {
      "name": "丁奉",
      "faction": "吳",
      "role": "近戰破陣",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 87,
        "int": 84,
        "lead": 88,
        "body": 88,
        "agi": 75,
        "charm": 71
      },
      "quality": "紅"
    },
    {
      "name": "公孫瓚",
      "faction": "群雄",
      "role": "遠攻騎射",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "白馬連射",
      "effect1": "multiStrike",
      "skill2": "義從援護",
      "effect2": "hasteSupport",
      "skill1Overrides": {
        "hits": 3,
        "ratio": 0.5,
        "range": 4,
        "cd": 8
      },
      "skill2Overrides": {
        "grantHaste": 0.12,
        "buffDuration": 3,
        "cd": 10
      },
      "abilities": {
        "str": 84,
        "int": 62,
        "lead": 82,
        "body": 84,
        "agi": 86,
        "charm": 63
      },
      "quality": "橘"
    },
    {
      "name": "劉璋",
      "faction": "群雄",
      "role": "統御安撫",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 27,
        "int": 46,
        "lead": 40,
        "body": 63,
        "agi": 35,
        "charm": 69
      },
      "quality": "青"
    },
    {
      "name": "陳登",
      "faction": "群雄",
      "role": "謀略應變",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 55,
        "int": 91,
        "lead": 88,
        "body": 67,
        "agi": 63,
        "charm": 86
      },
      "quality": "紅"
    },
    {
      "name": "曹彰",
      "faction": "魏",
      "role": "近戰奮擊",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 91,
        "int": 51,
        "lead": 78,
        "body": 93,
        "agi": 80,
        "charm": 68
      },
      "quality": "紅"
    },
    {
      "name": "夏侯尚",
      "faction": "魏",
      "role": "統御奇襲",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 78,
        "int": 79,
        "lead": 85,
        "body": 77,
        "agi": 71,
        "charm": 74
      },
      "quality": "橘"
    },
    {
      "name": "陳群",
      "faction": "魏",
      "role": "謀略整備",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 22,
        "int": 92,
        "lead": 57,
        "body": 50,
        "agi": 42,
        "charm": 91
      },
      "quality": "紅"
    },
    {
      "name": "鍾繇",
      "faction": "魏",
      "role": "統御協理",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 29,
        "int": 88,
        "lead": 81,
        "body": 57,
        "agi": 45,
        "charm": 80
      },
      "quality": "橘"
    },
    {
      "name": "呂虔",
      "faction": "魏",
      "role": "近戰鎮守",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 77,
        "int": 78,
        "lead": 83,
        "body": 79,
        "agi": 67,
        "charm": 74
      },
      "quality": "橘"
    },
    {
      "name": "李通",
      "faction": "魏",
      "role": "近戰解圍",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 85,
        "int": 60,
        "lead": 78,
        "body": 86,
        "agi": 78,
        "charm": 69
      },
      "quality": "橘"
    },
    {
      "name": "顏良",
      "faction": "群雄",
      "role": "近戰重斬",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "河北重斬",
      "effect1": "cleave",
      "skill2": "剛勇自持",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.9,
        "range": 2.5,
        "width": 1.3,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.8,
        "threshold": 0.6,
        "cd": 10
      },
      "abilities": {
        "str": 91,
        "int": 43,
        "lead": 73,
        "body": 91,
        "agi": 73,
        "charm": 58
      },
      "quality": "紅"
    },
    {
      "name": "文醜",
      "faction": "群雄",
      "role": "近戰追擊",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "河北追魂",
      "effect1": "strike",
      "skill2": "驍騎攔截",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.9,
        "targetMode": "weak",
        "cd": 7
      },
      "skill2Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 95,
        "int": 45,
        "lead": 74,
        "body": 91,
        "agi": 86,
        "charm": 57
      },
      "quality": "紅"
    },
    {
      "name": "蒯越",
      "faction": "群雄",
      "role": "謀略招撫",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 32,
        "int": 89,
        "lead": 67,
        "body": 54,
        "agi": 54,
        "charm": 78
      },
      "quality": "橘"
    },
    {
      "name": "韓遂",
      "faction": "群雄",
      "role": "統御聯軍",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 71,
        "int": 79,
        "lead": 82,
        "body": 76,
        "agi": 69,
        "charm": 74
      },
      "quality": "藍"
    },
    {
      "name": "劉焉",
      "faction": "群雄",
      "role": "統御經營",
      "archetype": "supply",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接濟",
      "effect1": "regenSupport",
      "skill2": "整備",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.35,
        "regenRatio": 0.15,
        "regenSeconds": 3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 0.7,
        "cd": 10
      },
      "abilities": {
        "str": 30,
        "int": 78,
        "lead": 60,
        "body": 61,
        "agi": 38,
        "charm": 72
      },
      "quality": "綠"
    },
    {
      "name": "蔣欽",
      "faction": "吳",
      "role": "近戰協防",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 83,
        "int": 74,
        "lead": 84,
        "body": 82,
        "agi": 74,
        "charm": 81
      },
      "quality": "橘"
    },
    {
      "name": "潘璋",
      "faction": "吳",
      "role": "近戰截擊",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 82,
        "int": 76,
        "lead": 84,
        "body": 84,
        "agi": 68,
        "charm": 46
      },
      "quality": "橘"
    },
    {
      "name": "陳武",
      "faction": "吳",
      "role": "近戰奮戰",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 85,
        "int": 54,
        "lead": 79,
        "body": 86,
        "agi": 77,
        "charm": 82
      },
      "quality": "橘"
    },
    {
      "name": "王粲",
      "faction": "魏",
      "role": "謀略文援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 24,
        "int": 87,
        "lead": 55,
        "body": 46,
        "agi": 54,
        "charm": 79
      },
      "quality": "藍"
    },
    {
      "name": "王朗",
      "faction": "魏",
      "role": "謀略輔議",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 27,
        "int": 86,
        "lead": 52,
        "body": 57,
        "agi": 43,
        "charm": 83
      },
      "quality": "橘"
    },
    {
      "name": "華歆",
      "faction": "魏",
      "role": "謀略協理",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 26,
        "int": 83,
        "lead": 56,
        "body": 55,
        "agi": 46,
        "charm": 84
      },
      "quality": "橘"
    },
    {
      "name": "毛玠",
      "faction": "魏",
      "role": "謀略整備",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 32,
        "int": 88,
        "lead": 61,
        "body": 62,
        "agi": 45,
        "charm": 79
      },
      "quality": "橘"
    },
    {
      "name": "陳矯",
      "faction": "魏",
      "role": "謀略應務",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 30,
        "int": 88,
        "lead": 58,
        "body": 57,
        "agi": 51,
        "charm": 76
      },
      "quality": "橘"
    },
    {
      "name": "辛毗",
      "faction": "魏",
      "role": "謀略諫議",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 35,
        "int": 85,
        "lead": 64,
        "body": 62,
        "agi": 50,
        "charm": 75
      },
      "quality": "藍"
    },
    {
      "name": "曹植",
      "faction": "魏",
      "role": "謀略鼓舞",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 38,
        "int": 88,
        "lead": 34,
        "body": 54,
        "agi": 58,
        "charm": 86
      },
      "quality": "橘"
    },
    {
      "name": "楊修",
      "faction": "魏",
      "role": "謀略辨析",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "破計",
      "effect1": "break",
      "skill2": "制勢",
      "effect2": "weaken",
      "skill1Overrides": {
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "duration": 2,
        "ratio": 0.9,
        "cd": 9
      },
      "abilities": {
        "str": 29,
        "int": 92,
        "lead": 39,
        "body": 52,
        "agi": 64,
        "charm": 82
      },
      "quality": "橘"
    },
    {
      "name": "孟達",
      "faction": "魏",
      "role": "近戰機變",
      "archetype": "hybrid",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "奇正擊",
      "effect1": "hybridStrike",
      "skill2": "解圍",
      "effect2": "cleanseSelf",
      "skill1Overrides": {
        "ratio": 0.8,
        "magicRatio": 0.6,
        "cd": 8
      },
      "skill2Overrides": {
        "grantHaste": 0.08,
        "buffDuration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 75,
        "int": 71,
        "lead": 74,
        "body": 76,
        "agi": 72,
        "charm": 52
      },
      "quality": "藍"
    },
    {
      "name": "郭圖",
      "faction": "群雄",
      "role": "謀略爭勢",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "破計",
      "effect1": "break",
      "skill2": "制勢",
      "effect2": "weaken",
      "skill1Overrides": {
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "duration": 2,
        "ratio": 0.9,
        "cd": 9
      },
      "abilities": {
        "str": 30,
        "int": 77,
        "lead": 57,
        "body": 53,
        "agi": 49,
        "charm": 44
      },
      "quality": "綠"
    },
    {
      "name": "黃祖",
      "faction": "群雄",
      "role": "近戰據守",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 73,
        "int": 58,
        "lead": 75,
        "body": 80,
        "agi": 55,
        "charm": 50
      },
      "quality": "藍"
    },
    {
      "name": "蔡瑁",
      "faction": "群雄",
      "role": "統御協防",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 65,
        "int": 70,
        "lead": 72,
        "body": 70,
        "agi": 57,
        "charm": 55
      },
      "quality": "藍"
    },
    {
      "name": "劉琦",
      "faction": "群雄",
      "role": "統御聲援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 39,
        "int": 62,
        "lead": 49,
        "body": 48,
        "agi": 44,
        "charm": 67
      },
      "quality": "青"
    },
    {
      "name": "李傕",
      "faction": "群雄",
      "role": "近戰壓陣",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 77,
        "int": 53,
        "lead": 76,
        "body": 84,
        "agi": 58,
        "charm": 31
      },
      "quality": "藍"
    },
    {
      "name": "郭汜",
      "faction": "群雄",
      "role": "近戰猛進",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 84,
        "int": 43,
        "lead": 69,
        "body": 83,
        "agi": 68,
        "charm": 28
      },
      "quality": "橘"
    },
    {
      "name": "張濟",
      "faction": "群雄",
      "role": "近戰部將",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 72,
        "int": 55,
        "lead": 68,
        "body": 77,
        "agi": 61,
        "charm": 48
      },
      "quality": "綠"
    },
    {
      "name": "閻圃",
      "faction": "群雄",
      "role": "謀略審局",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "破計",
      "effect1": "break",
      "skill2": "制勢",
      "effect2": "weaken",
      "skill1Overrides": {
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "duration": 2,
        "ratio": 0.9,
        "cd": 9
      },
      "abilities": {
        "str": 25,
        "int": 88,
        "lead": 55,
        "body": 54,
        "agi": 48,
        "charm": 74
      },
      "quality": "橘"
    },
    {
      "name": "韓浩",
      "faction": "魏",
      "role": "統御整軍",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 73,
        "int": 84,
        "lead": 82,
        "body": 76,
        "agi": 59,
        "charm": 72
      },
      "quality": "藍"
    },
    {
      "name": "曹昂",
      "faction": "魏",
      "role": "近戰護從",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 72,
        "int": 62,
        "lead": 55,
        "body": 76,
        "agi": 70,
        "charm": 79
      },
      "quality": "藍"
    },
    {
      "name": "牛金",
      "faction": "魏",
      "role": "近戰衝陣",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 81,
        "int": 45,
        "lead": 65,
        "body": 87,
        "agi": 60,
        "charm": 56
      },
      "quality": "藍"
    },
    {
      "name": "朱靈",
      "faction": "魏",
      "role": "近戰整陣",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 81,
        "int": 71,
        "lead": 83,
        "body": 80,
        "agi": 69,
        "charm": 76
      },
      "quality": "橘"
    },
    {
      "name": "杜襲",
      "faction": "魏",
      "role": "謀略協守",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 51,
        "int": 86,
        "lead": 81,
        "body": 65,
        "agi": 52,
        "charm": 84
      },
      "quality": "橘"
    },
    {
      "name": "郝昭",
      "faction": "魏",
      "role": "近戰固守",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "陳倉拒守",
      "effect1": "guard",
      "skill2": "扼道截擊",
      "effect2": "physicalRoot",
      "skill1Overrides": {
        "duration": 4,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.3,
        "duration": 1.5,
        "cd": 8
      },
      "abilities": {
        "str": 84,
        "int": 87,
        "lead": 92,
        "body": 88,
        "agi": 54,
        "charm": 85
      },
      "quality": "紅"
    },
    {
      "name": "夏侯威",
      "faction": "魏",
      "role": "近戰助陣",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 68,
        "int": 64,
        "lead": 62,
        "body": 73,
        "agi": 62,
        "charm": 65
      },
      "quality": "青"
    },
    {
      "name": "夏侯楙",
      "faction": "魏",
      "role": "統御籌務",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 38,
        "int": 49,
        "lead": 36,
        "body": 59,
        "agi": 39,
        "charm": 47
      },
      "quality": "青"
    },
    {
      "name": "司馬師",
      "faction": "魏",
      "role": "統御制勢",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 63,
        "int": 92,
        "lead": 90,
        "body": 71,
        "agi": 64,
        "charm": 66
      },
      "quality": "紅"
    },
    {
      "name": "司馬昭",
      "faction": "魏",
      "role": "統御調略",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 60,
        "int": 89,
        "lead": 87,
        "body": 73,
        "agi": 61,
        "charm": 68
      },
      "quality": "橘"
    },
    {
      "name": "劉繇",
      "faction": "群雄",
      "role": "統御聚眾",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 68,
        "int": 66,
        "lead": 70,
        "body": 65,
        "agi": 49,
        "charm": 73
      },
      "quality": "綠"
    },
    {
      "name": "紀靈",
      "faction": "群雄",
      "role": "近戰重擊",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 86,
        "int": 48,
        "lead": 70,
        "body": 84,
        "agi": 62,
        "charm": 55
      },
      "quality": "橘"
    },
    {
      "name": "張勳",
      "faction": "群雄",
      "role": "統御部將",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 70,
        "int": 55,
        "lead": 72,
        "body": 75,
        "agi": 53,
        "charm": 56
      },
      "quality": "藍"
    },
    {
      "name": "陳蘭",
      "faction": "群雄",
      "role": "近戰山陣",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 68,
        "int": 53,
        "lead": 61,
        "body": 74,
        "agi": 61,
        "charm": 40
      },
      "quality": "青"
    },
    {
      "name": "雷薄",
      "faction": "群雄",
      "role": "近戰強襲",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 72,
        "int": 38,
        "lead": 54,
        "body": 79,
        "agi": 57,
        "charm": 36
      },
      "quality": "綠"
    },
    {
      "name": "張松",
      "faction": "群雄",
      "role": "謀略通聯",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 21,
        "int": 87,
        "lead": 41,
        "body": 45,
        "agi": 55,
        "charm": 57
      },
      "quality": "藍"
    },
    {
      "name": "張任",
      "faction": "群雄",
      "role": "近戰拒守",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 84,
        "int": 68,
        "lead": 80,
        "body": 85,
        "agi": 66,
        "charm": 73
      },
      "quality": "橘"
    },
    {
      "name": "張衛",
      "faction": "群雄",
      "role": "近戰關隘",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 69,
        "int": 60,
        "lead": 78,
        "body": 77,
        "agi": 49,
        "charm": 51
      },
      "quality": "藍"
    },
    {
      "name": "伏完",
      "faction": "東漢",
      "role": "謀略內援",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 29,
        "int": 68,
        "lead": 38,
        "body": 55,
        "agi": 39,
        "charm": 68
      },
      "quality": "青"
    },
    {
      "name": "耿紀",
      "faction": "東漢",
      "role": "謀略策應",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 40,
        "int": 65,
        "lead": 43,
        "body": 59,
        "agi": 47,
        "charm": 64
      },
      "quality": "青"
    },
    {
      "name": "袁胤",
      "faction": "群雄",
      "role": "統御聯絡",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 39,
        "int": 61,
        "lead": 46,
        "body": 59,
        "agi": 44,
        "charm": 52
      },
      "quality": "青"
    },
    {
      "name": "梁剛",
      "faction": "群雄",
      "role": "近戰部將",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 69,
        "int": 38,
        "lead": 51,
        "body": 75,
        "agi": 52,
        "charm": 38
      },
      "quality": "綠"
    },
    {
      "name": "樂就",
      "faction": "群雄",
      "role": "近戰協擊",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 64,
        "int": 43,
        "lead": 55,
        "body": 69,
        "agi": 57,
        "charm": 45
      },
      "quality": "青"
    },
    {
      "name": "呂公",
      "faction": "群雄",
      "role": "近戰伏擊",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 65,
        "int": 57,
        "lead": 58,
        "body": 68,
        "agi": 59,
        "charm": 46
      },
      "quality": "青"
    },
    {
      "name": "張允",
      "faction": "群雄",
      "role": "統御協防",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 59,
        "int": 68,
        "lead": 76,
        "body": 65,
        "agi": 52,
        "charm": 45
      },
      "quality": "綠"
    },
    {
      "name": "趙範",
      "faction": "群雄",
      "role": "統御安撫",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 35,
        "int": 54,
        "lead": 42,
        "body": 54,
        "agi": 41,
        "charm": 50
      },
      "quality": "青"
    },
    {
      "name": "金旋",
      "faction": "群雄",
      "role": "統御守郡",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 46,
        "int": 48,
        "lead": 47,
        "body": 62,
        "agi": 42,
        "charm": 46
      },
      "quality": "青"
    },
    {
      "name": "李肅",
      "faction": "群雄",
      "role": "近戰策應",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 63,
        "int": 65,
        "lead": 52,
        "body": 66,
        "agi": 59,
        "charm": 41
      },
      "quality": "青"
    },
    {
      "name": "劉度",
      "faction": "群雄",
      "role": "統御後援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 28,
        "int": 51,
        "lead": 40,
        "body": 53,
        "agi": 37,
        "charm": 54
      },
      "quality": "青"
    },
    {
      "name": "魏續",
      "faction": "群雄",
      "role": "近戰部將",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 68,
        "int": 43,
        "lead": 55,
        "body": 72,
        "agi": 62,
        "charm": 39
      },
      "quality": "青"
    },
    {
      "name": "韓玄",
      "faction": "群雄",
      "role": "統御調配",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 34,
        "int": 44,
        "lead": 43,
        "body": 57,
        "agi": 38,
        "charm": 43
      },
      "quality": "青"
    },
    {
      "name": "王累",
      "faction": "群雄",
      "role": "謀略警戒",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 27,
        "int": 80,
        "lead": 38,
        "body": 52,
        "agi": 40,
        "charm": 67
      },
      "quality": "藍"
    },
    {
      "name": "鄧賢",
      "faction": "群雄",
      "role": "近戰協守",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 70,
        "int": 47,
        "lead": 59,
        "body": 74,
        "agi": 58,
        "charm": 49
      },
      "quality": "綠"
    },
    {
      "name": "楊懷",
      "faction": "群雄",
      "role": "近戰守關",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 71,
        "int": 65,
        "lead": 72,
        "body": 76,
        "agi": 55,
        "charm": 48
      },
      "quality": "藍"
    },
    {
      "name": "劉璝",
      "faction": "群雄",
      "role": "近戰拒守",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 70,
        "int": 67,
        "lead": 73,
        "body": 75,
        "agi": 53,
        "charm": 51
      },
      "quality": "藍"
    },
    {
      "name": "劉循",
      "faction": "群雄",
      "role": "統御城守",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 62,
        "int": 57,
        "lead": 78,
        "body": 72,
        "agi": 48,
        "charm": 65
      },
      "quality": "綠"
    },
    {
      "name": "張肅",
      "faction": "群雄",
      "role": "謀略交涉",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 32,
        "int": 70,
        "lead": 45,
        "body": 57,
        "agi": 42,
        "charm": 61
      },
      "quality": "青"
    },
    {
      "name": "冷苞",
      "faction": "群雄",
      "role": "近戰阻截",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 82,
        "int": 65,
        "lead": 73,
        "body": 77,
        "agi": 57,
        "charm": 45
      },
      "quality": "藍"
    },
    {
      "name": "侯成",
      "faction": "群雄",
      "role": "近戰接應",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 67,
        "int": 51,
        "lead": 57,
        "body": 71,
        "agi": 60,
        "charm": 48
      },
      "quality": "青"
    },
    {
      "name": "宋憲",
      "faction": "群雄",
      "role": "近戰助攻",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 65,
        "int": 44,
        "lead": 53,
        "body": 70,
        "agi": 63,
        "charm": 40
      },
      "quality": "青"
    },
    {
      "name": "王匡",
      "faction": "群雄",
      "role": "統御聚兵",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 44,
        "int": 61,
        "lead": 58,
        "body": 62,
        "agi": 44,
        "charm": 57
      },
      "quality": "青"
    },
    {
      "name": "楊秋",
      "faction": "群雄",
      "role": "近戰邊援",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 69,
        "int": 52,
        "lead": 64,
        "body": 73,
        "agi": 66,
        "charm": 49
      },
      "quality": "青"
    },
    {
      "name": "梁興",
      "faction": "群雄",
      "role": "近戰突襲",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 72,
        "int": 41,
        "lead": 58,
        "body": 78,
        "agi": 66,
        "charm": 40
      },
      "quality": "綠"
    },
    {
      "name": "高覽",
      "faction": "群雄",
      "role": "近戰勁攻",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 84,
        "int": 58,
        "lead": 77,
        "body": 84,
        "agi": 71,
        "charm": 64
      },
      "quality": "橘"
    },
    {
      "name": "丁斐",
      "faction": "魏",
      "role": "謀略應急",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 43,
        "int": 73,
        "lead": 49,
        "body": 58,
        "agi": 51,
        "charm": 59
      },
      "quality": "青"
    },
    {
      "name": "王必",
      "faction": "魏",
      "role": "近戰營衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 60,
        "int": 61,
        "lead": 61,
        "body": 68,
        "agi": 52,
        "charm": 54
      },
      "quality": "青"
    },
    {
      "name": "呂常",
      "faction": "魏",
      "role": "近戰據點",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 71,
        "int": 58,
        "lead": 73,
        "body": 77,
        "agi": 50,
        "charm": 55
      },
      "quality": "藍"
    },
    {
      "name": "傅干",
      "faction": "魏",
      "role": "謀略審勢",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 31,
        "int": 82,
        "lead": 52,
        "body": 56,
        "agi": 48,
        "charm": 68
      },
      "quality": "藍"
    },
    {
      "name": "典滿",
      "faction": "魏",
      "role": "近戰護衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 79,
        "int": 46,
        "lead": 45,
        "body": 79,
        "agi": 59,
        "charm": 60
      },
      "quality": "藍"
    },
    {
      "name": "郭奕",
      "faction": "魏",
      "role": "謀略輔務",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 24,
        "int": 70,
        "lead": 35,
        "body": 49,
        "agi": 46,
        "charm": 55
      },
      "quality": "青"
    },
    {
      "name": "韋晃",
      "faction": "東漢",
      "role": "謀略策動",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "策擊",
      "effect1": "magicStrike",
      "skill2": "緩兵",
      "effect2": "slow",
      "skill1Overrides": {},
      "skill2Overrides": {
        "ratio": 0.65,
        "duration": 2,
        "cd": 9,
        "radius": 1
      },
      "abilities": {
        "str": 41,
        "int": 58,
        "lead": 42,
        "body": 60,
        "agi": 48,
        "charm": 57
      },
      "quality": "青"
    },
    {
      "name": "邢道榮",
      "faction": "群雄",
      "role": "近戰重斧",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 73,
        "int": 43,
        "lead": 46,
        "body": 83,
        "agi": 46,
        "charm": 34
      },
      "quality": "藍"
    },
    {
      "name": "鮑龍",
      "faction": "群雄",
      "role": "遠攻獵射",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "穿楊",
      "effect1": "strike",
      "skill2": "阻行箭",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "range": 4,
        "ratio": 1.6
      },
      "skill2Overrides": {
        "range": 4,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 74,
        "int": 34,
        "lead": 41,
        "body": 71,
        "agi": 72,
        "charm": 35
      },
      "quality": "藍"
    },
    {
      "name": "陳應",
      "faction": "群雄",
      "role": "遠攻牽制",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "穿楊",
      "effect1": "strike",
      "skill2": "阻行箭",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "range": 4,
        "ratio": 1.6
      },
      "skill2Overrides": {
        "range": 4,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 72,
        "int": 39,
        "lead": 44,
        "body": 67,
        "agi": 74,
        "charm": 38
      },
      "quality": "綠"
    },
    {
      "name": "楊齡",
      "faction": "群雄",
      "role": "長槍前哨",
      "archetype": "spear",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "突槍",
      "effect1": "strike",
      "skill2": "拒敵",
      "effect2": "physicalRoot",
      "skill1Overrides": {
        "range": 2.5
      },
      "skill2Overrides": {
        "duration": 1,
        "ratio": 0.9,
        "cd": 8
      },
      "abilities": {
        "str": 62,
        "int": 31,
        "lead": 40,
        "body": 67,
        "agi": 58,
        "charm": 34
      },
      "quality": "青"
    },
    {
      "name": "孔秀",
      "faction": "魏",
      "role": "近戰關防",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 59,
        "int": 34,
        "lead": 42,
        "body": 66,
        "agi": 51,
        "charm": 37
      },
      "quality": "青"
    },
    {
      "name": "卞喜",
      "faction": "魏",
      "role": "近戰設伏",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 57,
        "int": 58,
        "lead": 39,
        "body": 61,
        "agi": 65,
        "charm": 30
      },
      "quality": "青"
    },
    {
      "name": "李豐",
      "faction": "群雄",
      "role": "近戰副將",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 67,
        "int": 44,
        "lead": 54,
        "body": 71,
        "agi": 52,
        "charm": 43
      },
      "quality": "青"
    },
    {
      "name": "梁紀",
      "faction": "群雄",
      "role": "聯絡支援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 40,
        "int": 59,
        "lead": 40,
        "body": 55,
        "agi": 44,
        "charm": 48
      },
      "quality": "青"
    },
    {
      "name": "蔡和",
      "faction": "魏",
      "role": "佯降牽制",
      "archetype": "hybrid",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "奇正擊",
      "effect1": "hybridStrike",
      "skill2": "解圍",
      "effect2": "cleanseSelf",
      "skill1Overrides": {
        "ratio": 0.8,
        "magicRatio": 0.6,
        "cd": 8
      },
      "skill2Overrides": {
        "grantHaste": 0.08,
        "buffDuration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 48,
        "int": 55,
        "lead": 41,
        "body": 57,
        "agi": 57,
        "charm": 36
      },
      "quality": "青"
    },
    {
      "name": "蔡仲",
      "faction": "魏",
      "role": "佯降支援",
      "archetype": "hybrid",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "奇正擊",
      "effect1": "hybridStrike",
      "skill2": "解圍",
      "effect2": "cleanseSelf",
      "skill1Overrides": {
        "ratio": 0.8,
        "magicRatio": 0.6,
        "cd": 8
      },
      "skill2Overrides": {
        "grantHaste": 0.08,
        "buffDuration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 50,
        "int": 51,
        "lead": 44,
        "body": 60,
        "agi": 54,
        "charm": 38
      },
      "quality": "青"
    },
    {
      "name": "蔡勳",
      "faction": "魏",
      "role": "水陣前哨",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 61,
        "int": 35,
        "lead": 46,
        "body": 66,
        "agi": 51,
        "charm": 36
      },
      "quality": "青"
    },
    {
      "name": "焦觸",
      "faction": "群雄",
      "role": "近戰領隊",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 63,
        "int": 61,
        "lead": 72,
        "body": 68,
        "agi": 57,
        "charm": 58
      },
      "quality": "青"
    },
    {
      "name": "張南",
      "faction": "群雄",
      "role": "近戰前衛",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 65,
        "int": 45,
        "lead": 55,
        "body": 70,
        "agi": 59,
        "charm": 43
      },
      "quality": "青"
    },
    {
      "name": "劉延",
      "faction": "魏",
      "role": "據點守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 57,
        "int": 50,
        "lead": 72,
        "body": 66,
        "agi": 48,
        "charm": 47
      },
      "quality": "青"
    },
    {
      "name": "高沛",
      "faction": "群雄",
      "role": "關隘守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 70,
        "int": 59,
        "lead": 70,
        "body": 75,
        "agi": 54,
        "charm": 47
      },
      "quality": "藍"
    },
    {
      "name": "楊松",
      "faction": "群雄",
      "role": "謀略游說",
      "archetype": "disrupt",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "破計",
      "effect1": "break",
      "skill2": "制勢",
      "effect2": "weaken",
      "skill1Overrides": {
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "duration": 2,
        "ratio": 0.9,
        "cd": 9
      },
      "abilities": {
        "str": 23,
        "int": 68,
        "lead": 30,
        "body": 46,
        "agi": 44,
        "charm": 28
      },
      "quality": "青"
    },
    {
      "name": "楊昂",
      "faction": "群雄",
      "role": "關隘突擊",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 73,
        "int": 55,
        "lead": 72,
        "body": 76,
        "agi": 57,
        "charm": 47
      },
      "quality": "藍"
    },
    {
      "name": "楊任",
      "faction": "群雄",
      "role": "關隘主戰",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 84,
        "int": 63,
        "lead": 67,
        "body": 81,
        "agi": 66,
        "charm": 52
      },
      "quality": "藍"
    },
    {
      "name": "楊平",
      "faction": "群雄",
      "role": "基礎守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 58,
        "int": 45,
        "lead": 46,
        "body": 64,
        "agi": 50,
        "charm": 42
      },
      "quality": "青"
    },
    {
      "name": "楊柏",
      "faction": "群雄",
      "role": "近戰牽制",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 62,
        "int": 46,
        "lead": 48,
        "body": 66,
        "agi": 55,
        "charm": 40
      },
      "quality": "青"
    },
    {
      "name": "程銀",
      "faction": "群雄",
      "role": "西涼前衛",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 67,
        "int": 46,
        "lead": 58,
        "body": 72,
        "agi": 64,
        "charm": 45
      },
      "quality": "青"
    },
    {
      "name": "侯選",
      "faction": "群雄",
      "role": "西涼協防",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 65,
        "int": 51,
        "lead": 57,
        "body": 70,
        "agi": 60,
        "charm": 48
      },
      "quality": "青"
    },
    {
      "name": "張橫",
      "faction": "群雄",
      "role": "西涼強攻",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 69,
        "int": 39,
        "lead": 53,
        "body": 74,
        "agi": 62,
        "charm": 40
      },
      "quality": "青"
    },
    {
      "name": "成宜",
      "faction": "群雄",
      "role": "西涼突擊",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 68,
        "int": 42,
        "lead": 56,
        "body": 73,
        "agi": 61,
        "charm": 43
      },
      "quality": "青"
    },
    {
      "name": "馬玩",
      "faction": "群雄",
      "role": "西涼快攻",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 66,
        "int": 46,
        "lead": 54,
        "body": 70,
        "agi": 66,
        "charm": 44
      },
      "quality": "青"
    },
    {
      "name": "韓福",
      "faction": "魏",
      "role": "遠攻設伏",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "穿楊",
      "effect1": "strike",
      "skill2": "阻行箭",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "range": 4,
        "ratio": 1.6
      },
      "skill2Overrides": {
        "range": 4,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 70,
        "int": 54,
        "lead": 45,
        "body": 59,
        "agi": 68,
        "charm": 37
      },
      "quality": "青"
    },
    {
      "name": "王植",
      "faction": "魏",
      "role": "關防設伏",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 48,
        "int": 59,
        "lead": 49,
        "body": 61,
        "agi": 49,
        "charm": 39
      },
      "quality": "青"
    },
    {
      "name": "秦琪",
      "faction": "魏",
      "role": "渡口前衛",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 61,
        "int": 32,
        "lead": 42,
        "body": 67,
        "agi": 52,
        "charm": 35
      },
      "quality": "青"
    },
    {
      "name": "金緯",
      "faction": "東漢",
      "role": "朝廷策應",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 29,
        "int": 66,
        "lead": 38,
        "body": 52,
        "agi": 43,
        "charm": 59
      },
      "quality": "青"
    },
    {
      "name": "呂翔",
      "faction": "群雄",
      "role": "近戰前衛",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 68,
        "int": 46,
        "lead": 56,
        "body": 72,
        "agi": 59,
        "charm": 44
      },
      "quality": "青"
    },
    {
      "name": "呂曠",
      "faction": "群雄",
      "role": "近戰重擊",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 70,
        "int": 43,
        "lead": 55,
        "body": 75,
        "agi": 56,
        "charm": 42
      },
      "quality": "綠"
    },
    {
      "name": "馬延",
      "faction": "群雄",
      "role": "步陣協防",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 63,
        "int": 49,
        "lead": 54,
        "body": 68,
        "agi": 57,
        "charm": 43
      },
      "quality": "青"
    },
    {
      "name": "張顗",
      "faction": "群雄",
      "role": "步陣守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 64,
        "int": 47,
        "lead": 56,
        "body": 69,
        "agi": 55,
        "charm": 44
      },
      "quality": "青"
    },
    {
      "name": "蔣義渠",
      "faction": "群雄",
      "role": "整軍支援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 61,
        "int": 62,
        "lead": 76,
        "body": 69,
        "agi": 48,
        "charm": 74
      },
      "quality": "綠"
    },
    {
      "name": "穆順",
      "faction": "群雄",
      "role": "長槍前衛",
      "archetype": "spear",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "突槍",
      "effect1": "strike",
      "skill2": "拒敵",
      "effect2": "physicalRoot",
      "skill1Overrides": {
        "range": 2.5
      },
      "skill2Overrides": {
        "duration": 1,
        "ratio": 0.9,
        "cd": 8
      },
      "abilities": {
        "str": 64,
        "int": 33,
        "lead": 42,
        "body": 70,
        "agi": 56,
        "charm": 39
      },
      "quality": "青"
    },
    {
      "name": "夏侯德",
      "faction": "魏",
      "role": "山寨守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 66,
        "int": 41,
        "lead": 54,
        "body": 73,
        "agi": 48,
        "charm": 42
      },
      "quality": "青"
    },
    {
      "name": "朱光",
      "faction": "魏",
      "role": "據點補給",
      "archetype": "supply",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接濟",
      "effect1": "regenSupport",
      "skill2": "整備",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.35,
        "regenRatio": 0.15,
        "regenSeconds": 3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 0.7,
        "cd": 10
      },
      "abilities": {
        "str": 48,
        "int": 74,
        "lead": 68,
        "body": 61,
        "agi": 43,
        "charm": 52
      },
      "quality": "青"
    },
    {
      "name": "董衡",
      "faction": "魏",
      "role": "近戰副將",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 63,
        "int": 45,
        "lead": 51,
        "body": 68,
        "agi": 52,
        "charm": 42
      },
      "quality": "青"
    },
    {
      "name": "露昭",
      "faction": "魏",
      "role": "前軍協同",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 62,
        "int": 48,
        "lead": 55,
        "body": 67,
        "agi": 57,
        "charm": 44
      },
      "quality": "青"
    },
    {
      "name": "車冑",
      "faction": "魏",
      "role": "城池守備",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 48,
        "int": 55,
        "lead": 53,
        "body": 62,
        "agi": 43,
        "charm": 46
      },
      "quality": "青"
    },
    {
      "name": "黃邵",
      "faction": "群雄",
      "role": "聚眾突襲",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 63,
        "int": 39,
        "lead": 56,
        "body": 70,
        "agi": 54,
        "charm": 50
      },
      "quality": "青"
    },
    {
      "name": "何儀",
      "faction": "群雄",
      "role": "聚眾支援",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 65,
        "int": 43,
        "lead": 59,
        "body": 72,
        "agi": 52,
        "charm": 55
      },
      "quality": "青"
    },
    {
      "name": "龔都",
      "faction": "群雄",
      "role": "游擊牽制",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 68,
        "int": 45,
        "lead": 58,
        "body": 73,
        "agi": 59,
        "charm": 52
      },
      "quality": "青"
    },
    {
      "name": "劉辟",
      "faction": "群雄",
      "role": "地方領隊",
      "archetype": "leader",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "劍",
      "skill1": "督陣",
      "effect1": "hasteSupport",
      "skill2": "援護",
      "effect2": "allyGuard",
      "skill1Overrides": {
        "grantHaste": 0.1,
        "buffDuration": 3,
        "cd": 9
      },
      "skill2Overrides": {
        "duration": 2,
        "cd": 10
      },
      "abilities": {
        "str": 66,
        "int": 49,
        "lead": 61,
        "body": 71,
        "agi": 55,
        "charm": 57
      },
      "quality": "青"
    },
    {
      "name": "蔡陽",
      "faction": "魏",
      "role": "近戰追擊",
      "archetype": "raid",
      "kind": "pierce",
      "range": 2,
      "group": "近戰",
      "weapon": "長槍",
      "skill1": "疾刺",
      "effect1": "strike",
      "skill2": "追擊",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "ratio": 1.45,
        "targetMode": "weak",
        "threshold": 0.35,
        "executeBonus": 1.2
      },
      "skill2Overrides": {
        "duration": 1.5,
        "ratio": 1.05,
        "cd": 8
      },
      "abilities": {
        "str": 73,
        "int": 42,
        "lead": 57,
        "body": 76,
        "agi": 56,
        "charm": 44
      },
      "quality": "綠"
    },
    {
      "name": "彭義",
      "faction": "群雄",
      "role": "謀略支援（暫擬）",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 35,
        "int": 64,
        "lead": 39,
        "body": 53,
        "agi": 44,
        "charm": 45
      },
      "quality": "青"
    },
    {
      "name": "李湛",
      "faction": "群雄",
      "role": "遠攻牽制（暫擬）",
      "archetype": "archer",
      "kind": "arrow",
      "range": 4,
      "group": "遠攻",
      "weapon": "弓",
      "skill1": "穿楊",
      "effect1": "strike",
      "skill2": "阻行箭",
      "effect2": "physicalSlow",
      "skill1Overrides": {
        "range": 4,
        "ratio": 1.6
      },
      "skill2Overrides": {
        "range": 4,
        "duration": 2,
        "cd": 8
      },
      "abilities": {
        "str": 61,
        "int": 45,
        "lead": 50,
        "body": 66,
        "agi": 59,
        "charm": 43
      },
      "quality": "青"
    },
    {
      "name": "恒楷",
      "faction": "魏",
      "role": "協調支援（暫擬）",
      "archetype": "support",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "接應",
      "effect1": "heal",
      "skill2": "護持",
      "effect2": "shield",
      "skill1Overrides": {
        "ratio": 0.85,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.75,
        "cd": 9
      },
      "abilities": {
        "str": 31,
        "int": 65,
        "lead": 42,
        "body": 54,
        "agi": 41,
        "charm": 55
      },
      "quality": "青"
    },
    {
      "name": "呂健",
      "faction": "魏",
      "role": "近戰協防（暫擬）",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵",
      "effect1": "physicalSlow",
      "skill2": "固守",
      "effect2": "guard",
      "skill1Overrides": {
        "duration": 2,
        "ratio": 1.1
      },
      "skill2Overrides": {
        "duration": 3,
        "cd": 9
      },
      "abilities": {
        "str": 63,
        "int": 48,
        "lead": 52,
        "body": 68,
        "agi": 54,
        "charm": 42
      },
      "quality": "青"
    },
    {
      "name": "陳嬉",
      "faction": "魏",
      "role": "近戰重擊（暫擬）",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "破陣斬",
      "effect1": "cleave",
      "skill2": "奮戰",
      "effect2": "healSelf",
      "skill1Overrides": {
        "range": 2.5,
        "width": 1.2
      },
      "skill2Overrides": {
        "threshold": 0.5,
        "ratio": 0.8,
        "cd": 9
      },
      "abilities": {
        "str": 66,
        "int": 32,
        "lead": 43,
        "body": 72,
        "agi": 49,
        "charm": 35
      },
      "quality": "青"
    },
    {
      "name": "張角",
      "faction": "群雄",
      "role": "天公將軍・術法號召",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "蒼天雷誡",
      "effect1": "chainBolt",
      "skill2": "太平符水",
      "effect2": "cleanseArea",
      "skill1Overrides": {
        "ratio": 1.5,
        "hits": 3,
        "chainRange": 2,
        "falloff": 0.65,
        "cd": 9
      },
      "skill2Overrides": {
        "ratio": 0.65,
        "radius": 1.5,
        "cd": 11
      },
      "abilities": {
        "str": 35,
        "int": 90,
        "lead": 86,
        "body": 61,
        "agi": 57,
        "charm": 98
      },
      "quality": "紫"
    },
    {
      "name": "張寶",
      "faction": "群雄",
      "role": "地公將軍・術策支援",
      "archetype": "advisor",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "地公迷陣",
      "effect1": "rootArea",
      "skill2": "黃巾妖術",
      "effect2": "areaBreak",
      "skill1Overrides": {
        "ratio": 0.85,
        "radius": 1.3,
        "duration": 1.4,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 1.1,
        "radius": 1.3,
        "duration": 2,
        "cd": 9
      },
      "abilities": {
        "str": 58,
        "int": 83,
        "lead": 79,
        "body": 72,
        "agi": 65,
        "charm": 88
      },
      "quality": "橘"
    },
    {
      "name": "張梁",
      "faction": "群雄",
      "role": "人公將軍・前線領眾",
      "archetype": "assault",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "人公奮擊",
      "effect1": "cleave",
      "skill2": "聚眾護軍",
      "effect2": "guardArea",
      "skill1Overrides": {
        "ratio": 1.8,
        "width": 1.5,
        "range": 2.5,
        "cd": 7
      },
      "skill2Overrides": {
        "duration": 2,
        "radius": 1.2,
        "cd": 10
      },
      "abilities": {
        "str": 79,
        "int": 65,
        "lead": 81,
        "body": 83,
        "agi": 73,
        "charm": 84
      },
      "quality": "橘"
    },
    {
      "name": "糜竺",
      "faction": "蜀",
      "role": "軍需協調",
      "archetype": "supply",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "策杖",
      "skill1": "傾資援軍",
      "effect1": "regenArea",
      "skill2": "周轉軍需",
      "effect2": "areaShield",
      "skill1Overrides": {
        "ratio": 0.4,
        "regenRatio": 0.15,
        "regenSeconds": 3,
        "radius": 1.3,
        "cd": 10
      },
      "skill2Overrides": {
        "ratio": 0.7,
        "radius": 1.3,
        "cd": 11
      },
      "abilities": {
        "str": 28,
        "int": 78,
        "lead": 61,
        "body": 53,
        "agi": 49,
        "charm": 86
      },
      "quality": "藍"
    },
    {
      "name": "糜芳",
      "faction": "蜀",
      "role": "守備護衛",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "守糧迎敵",
      "effect1": "physicalSlow",
      "skill2": "糧壘自守",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.25,
        "duration": 2,
        "cd": 7
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 9
      },
      "abilities": {
        "str": 64,
        "int": 43,
        "lead": 57,
        "body": 66,
        "agi": 58,
        "charm": 48
      },
      "quality": "青"
    },
    {
      "name": "鄧茂",
      "faction": "群雄",
      "role": "黃巾突擊副將",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "突陣連刺",
      "effect1": "physicalSlow",
      "skill2": "戍陣護身",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 68,
        "int": 35,
        "lead": 52,
        "body": 72,
        "agi": 60,
        "charm": 45
      },
      "quality": "青"
    },
    {
      "name": "程遠志",
      "faction": "群雄",
      "role": "黃巾領眾",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "聚眾斬擊",
      "effect1": "physicalSlow",
      "skill2": "黃巾固守",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 72,
        "int": 42,
        "lead": 66,
        "body": 76,
        "agi": 56,
        "charm": 58
      },
      "quality": "綠"
    },
    {
      "name": "韓忠",
      "faction": "群雄",
      "role": "宛城守將",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "迎敵重斬",
      "effect1": "physicalSlow",
      "skill2": "據壘自守",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 74,
        "int": 56,
        "lead": 68,
        "body": 76,
        "agi": 62,
        "charm": 60
      },
      "quality": "綠"
    },
    {
      "name": "張曼成",
      "faction": "群雄",
      "role": "南陽神上使",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "神上進擊",
      "effect1": "physicalSlow",
      "skill2": "聚眾護軍",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 78,
        "int": 67,
        "lead": 82,
        "body": 80,
        "agi": 65,
        "charm": 79
      },
      "quality": "橘"
    },
    {
      "name": "馬元義",
      "faction": "群雄",
      "role": "黃巾聯絡者",
      "archetype": "mage",
      "kind": "magic",
      "range": 3,
      "group": "遠攻",
      "weapon": "符",
      "skill1": "暗符擾陣",
      "effect1": "areaBreak",
      "skill2": "傳令護軍",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 58,
        "int": 78,
        "lead": 76,
        "body": 64,
        "agi": 66,
        "charm": 82
      },
      "quality": "藍"
    },
    {
      "name": "波才",
      "faction": "群雄",
      "role": "長社黃巾渠帥",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "圍城重擊",
      "effect1": "physicalSlow",
      "skill2": "結陣固守",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 74,
        "int": 65,
        "lead": 79,
        "body": 76,
        "agi": 62,
        "charm": 70
      },
      "quality": "藍"
    },
    {
      "name": "彭脫",
      "faction": "群雄",
      "role": "潁汝黃巾頭領",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "突圍猛擊",
      "effect1": "physicalSlow",
      "skill2": "困陣自守",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 69,
        "int": 46,
        "lead": 64,
        "body": 73,
        "agi": 64,
        "charm": 55
      },
      "quality": "青"
    },
    {
      "name": "趙弘",
      "faction": "群雄",
      "role": "南陽黃巾渠帥",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "聚眾猛斬",
      "effect1": "physicalSlow",
      "skill2": "宛下固守",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 76,
        "int": 60,
        "lead": 77,
        "body": 78,
        "agi": 61,
        "charm": 65
      },
      "quality": "藍"
    },
    {
      "name": "孫夏",
      "faction": "群雄",
      "role": "宛城黃巾餘帥",
      "archetype": "guard",
      "kind": "hit",
      "range": 1.5,
      "group": "近戰",
      "weapon": "刀",
      "skill1": "餘軍奮擊",
      "effect1": "physicalSlow",
      "skill2": "退陣護身",
      "effect2": "selfWard",
      "skill1Overrides": {
        "ratio": 1.3,
        "duration": 2,
        "cd": 8
      },
      "skill2Overrides": {
        "ratio": 0.85,
        "threshold": 0.65,
        "cd": 10
      },
      "abilities": {
        "str": 71,
        "int": 50,
        "lead": 66,
        "body": 74,
        "agi": 68,
        "charm": 58
      },
      "quality": "青"
    },
    {
      "name": "童淵",
      "faction": "特殊",
      "role": "槍術宗師",
      "archetype": "duelist",
      "kind": "hit",
      "range": 3,
      "group": "近戰",
      "weapon": "槍",
      "skill1": "百鳥朝鳳",
      "effect1": "multiStrike",
      "skill1Overrides": {
        "hits": 3,
        "ratio": 0.8,
        "cd": 6
      },
      "skill2": "盤蛇守勢",
      "effect2": "counterStance",
      "skill2Overrides": {
        "ratio": 0.9,
        "duration": 3,
        "cd": 8
      },
      "abilities": {
        "str": 98,
        "int": 74,
        "lead": 68,
        "body": 86,
        "agi": 94,
        "charm": 80
      },
      "quality": "紫"
    },
    {
      "name": "陸抗",
      "faction": "吳",
      "role": "戰線調度",
      "kind": "magic",
      "group": "遠攻",
      "range": 4,
      "weapon": "扇",
      "skill1": "西陵籌策",
      "effect1": "weakenArea",
      "skill1Overrides": {},
      "skill2": "協守江防",
      "effect2": "areaShield",
      "skill2Overrides": {},
      "abilities": {
        "str": 72,
        "int": 95,
        "lead": 97,
        "body": 79,
        "agi": 75,
        "charm": 88
      },
      "quality": "紫"
    },
    {
      "name": "鄧艾",
      "faction": "魏",
      "role": "險路進軍",
      "kind": "hit",
      "group": "近戰",
      "range": 2,
      "weapon": "刀",
      "skill1": "陰平奇襲",
      "effect1": "cleave",
      "skill1Overrides": {
        "armorBreakDuration": 3
      },
      "skill2": "屯田整軍",
      "effect2": "healSelf",
      "skill2Overrides": {
        "threshold": 0.6
      },
      "abilities": {
        "str": 87,
        "int": 95,
        "lead": 96,
        "body": 88,
        "agi": 83,
        "charm": 73
      },
      "quality": "紫"
    },
    {
      "name": "司馬徽",
      "faction": "特殊",
      "role": "水鏡・謀策支援",
      "weapon": "扇",
      "skill1": "水鏡洞察",
      "effect1": "break",
      "skill1Overrides": {
        "duration": 4,
        "cd": 6
      },
      "skill2": "授策護才",
      "effect2": "shield",
      "skill2Overrides": {
        "ratio": 1.5,
        "cd": 6
      },
      "kind": "magic",
      "range": 4,
      "group": "遠攻",
      "abilities": {
        "str": 28,
        "int": 97,
        "lead": 52,
        "body": 57,
        "agi": 48,
        "charm": 98
      },
      "quality": "紫"
    },
    {
      "name": "龐德公",
      "faction": "特殊",
      "role": "名士・護持啟發",
      "weapon": "杖",
      "skill1": "安邦護士",
      "effect1": "guardArea",
      "skill1Overrides": {
        "duration": 3,
        "cd": 7
      },
      "skill2": "清談解惑",
      "effect2": "cleanseHeal",
      "skill2Overrides": {
        "ratio": 1,
        "cd": 6
      },
      "kind": "magic",
      "range": 4,
      "group": "遠攻",
      "abilities": {
        "str": 30,
        "int": 96,
        "lead": 48,
        "body": 62,
        "agi": 45,
        "charm": 98
      },
      "quality": "紫"
    },
    {
      "name": "華佗",
      "faction": "特殊",
      "role": "神醫・治療淨化",
      "weapon": "杖",
      "skill1": "青囊濟世",
      "effect1": "heal",
      "skill1Overrides": {
        "ratio": 1.8,
        "cd": 4
      },
      "skill2": "祛疾回春",
      "effect2": "cleanseHeal",
      "skill2Overrides": {
        "ratio": 1.2,
        "cd": 7
      },
      "kind": "magic",
      "range": 4,
      "group": "遠攻",
      "abilities": {
        "str": 24,
        "int": 90,
        "lead": 35,
        "body": 80,
        "agi": 74,
        "charm": 98
      },
      "quality": "紫"
    }
  ]
};
