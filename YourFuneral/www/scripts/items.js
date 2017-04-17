var itemsRepository = [
  {
      "type": "Useable",
      "name": "Key",
      "value": 0,
      "rarity": 0.9,
      "encounterCeiling": 100000000,
      "priceFloor": 3,
      "priceCeil": 6,
      "description": "A magical key that will open any locked door once."
  },
    {
        "type": "Useable",
        "name": "Torch",
        "value": 0,
        "rarity": 0.9,
        "encounterCeiling": 100000000,
        "priceFloor": 3,
        "priceCeil": 6,
        "description": "A torch that will illuminate a dark room."
    },
  {
      "type": "Useable",
      "name": "Indigo Potion",
      "value": 10,
      "modifiers": [{
          "stat": "HP",
          "amountPercentage": 0.2
      }],
      "encounterCeiling": 100,
      "rarity": 0.7,
      "priceFloor": 6,
      "priceCeil": 10,
      "description": "A potion that will restore a small percentage of health."
  },
    {
        "type": "Useable",
        "name": "Mauve Potion",
        "value": 7,
        "modifiers": [{
            "stat": "HP",
            "amountFixed": 10
        }],
        "encounterCeiling": 5,
        "rarity": 0.3,
        "priceFloor": 2,
        "priceCeil": 6,
        "description": "A potion that will restore a small, fixed amount of health."
    },
    {
        "type": "Useable",
        "name": "Crimson Elixir",
        "value": 20,
        "modifiers": [{
            "stat": "atk",
            "amountPercentage": 0.1
        }],
        "encounterCeiling": 7,
        "rarity": 0.4,
        "priceFloor": 10,
        "priceCeil": 20,
        "description": "An elixir that gives strength to those who imbibe it."
    },
    {
        "type": "Useable",
        "name": "Blue Elixir",
        "value": 25,
        "modifiers": [{
            "stat": "def",
            "amountPercentage": 0.1
        }],
        "encounterCeiling": 7,
        "rarity": 0.4,
        "priceFloor": 35,
        "priceCeil": 50,
        "description": "An elixir that gives robustness to those who imbibe it."

    },
  {
      "type": "Treasure",
      "name": "Bronze ring",
      "value": 35,
      "encounterCeiling": 7,
      "rarity": 0.2,
      "priceFloor": 50,
      "priceCeil": 60,
      "description": "A nondescript bronze ring."
  },
    {
        "type": "Treasure",
        "name": "Studded Codpiece",
        "value": 48,
        "encounterCeiling": 7,
        "rarity": 0.16,
        "priceFloor": 30,
        "priceCeil": 50,
    },
  {
      "type": "Treasure",
      "name": "Tiny amulet",
      "value": 55,
      "encounterCeiling": 7,
      "rarity": 0.1,
      "priceFloor": 70,
      "priceCeil": 80,
  },
  {
      "type": "Food",
      "name": "Potato",
      "value": 1,
      "encounterCeiling": 10,
      "rarity": 0.6,
      "perishable": true,
      "nutrition": 1,
      "priceFloor": 1,
      "priceCeil": 2,
      "description": "An abundant crop, yet rather devoid of nutrients."
  },
    {
        "type": "Equipment",
        "name": "Wooden Sword",
        "equipmentType" : "Weapon",
        "value": 15,
        "rarity": 0.4,
        "encounterCeiling": 5,
        "priceFloor": 23,
        "priceCeil": 28,
        "description": "A quite ineffective wooden sword.",
        "modifiers": [{
            "stat": "atk",
            "amountFixed": 1
        }],
        "robustness": 10,
        "weight": 1
    },
        {
            "type": "Equipment",
            "name": "Wooden Shield",
            "equipmentType" : "Shield",
            "value": 15,
            "rarity": 0.4,
            "encounterCeiling": 5,
            "priceFloor": 23,
            "priceCeil": 28,
            "description": "A quite ineffective wooden shield.",
            "modifiers": [{
                "stat": "def",
                "amountFixed": 1
            }],
            "robustness": 10,
            "weight": 1
    }

];
