var monstersRepository = [
  {
    "type": "Goblin",
    "atkModifier": 0.9,
    "defModifier": 0.5,
    "hpModifier": 2.5,
    "spdModifier": 0.4,
    "aglModifier": 0.4,
    "critChance": 0.15,
    "encounterCeiling": 7,
    "image": "<img src=\"img/orc_attack2.gif\" />",
    "heldItemChance": 0.4,
    "heldItemIds": [1, 2]
  },
  {
    "type": "Skeleton",
    "atkModifier": 0.3,
    "defModifier": 1.6,
    "hpModifier": 5,
    "spdModifier": 1.2,
        "heldItemChance": 0.2,
    "aglModifier": 0.7,
    "critChance": 0.15,
    "encounterCeiling": 8,
    "image": "<img src=\"img/skeleton.png\" />",
    "heldItemIds": [1, 2]
  },
    {
        "type": "Wicked Wicca Weirdo",
        "atkModifier": 0.2,
        "defModifier": 1.7,
        "hpModifier": 2,
        "spdModifier": 1.6,
        "heldItemChance": 0.5,
        "aglModifier": 0.9,
        "critChance": 0.6,
        "encounterCeiling": 8,
        "image": "<img src=\"img/witch.gif\" />",
        "heldItemIds": [1, 2],
        "knowsCurses": [{
            "name": "Enfeeblement",
            "modifiers": [{
                "stat": "def",
                "amountFixed": 1
            }],
        }],
        "curseProficiency" : 0.5
    }
];
