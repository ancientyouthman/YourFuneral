

// classes

function GameState(player, rooms, latestId) {
    this.player = player;
    this.rooms = rooms;
    this.latestId = latestId;
    this.findRoomAtCoords = function (x, y) {
        for (i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].xPos == x && this.rooms[i].yPos == y) return rooms[i];
        }
    }
    this.getRoomById = function (id) {
        for (i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].roomId == id) return rooms[i];

        }
    }
    this.incrementId = function () {
        this.latestId += 1;
        return this.latestId;
    }
}

function Coordinates(x, y, toOutput) {
    this.x = x;
    this.y = y;
    this.output = function () {
        return 'Position: X: ' + this.x + ' Y: ' + this.y;
    }
}

function Player(HP, maxHP, level, atk, def, speed, critChance, luck, agile, hunger, items, money, position, maxHunger) {
    this.HP = HP;
    this.maxHP = maxHP;
    this.level = level;
    this.atk = atk;
    this.def = def;
    this.speed = speed;
    this.critChance = critChance;
    this.luck = luck;
    this.agile = agile;
    this.hunger = hunger;
    this.maxHunger = maxHunger;
    this.items = items;
    this.money = money;
    this.position = position;
    this.hasKey = function () {
        for (i = 0; i < this.items.length; i++) {
            if (this.items[i].name == 'Key') {
                if (!this.items[i].used) {
                    return true;
                }
            }
        }
        return false;
    };
    this.useKey = function () {
        for (i = 0; i < this.items.length; i++) {
            if (this.items[i].name == 'Key') {
                if (!this.items[i].used) {
                    this.items[i].used = true;
                    return;
                }
            }
        };
    };
    this.useTorch = function (torch) {
        torch.used = true;
        var room = gameState.findRoomAtCoords(this.position.x, this.position.y);
        room.isDark = false;
        console.log(room);
        renderInventory(this.items);
        invalidate(room);
        gameConsole.log('The room was illuminated');
    };
    this.getItemById = function (id) {
        for (i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                if (!this.items[i].used) {
                    return items[i];
                }
            }
        }
        return false;
    };
    this.useItem = function (item) {
        for (var i = 0; i < item.modifiers.length; i++) {
            if (item.modifiers[i].stat == 'HP') {
                this.HP += Math.ceil(this.maxHP * item.modifiers[i].amountPercentage);
                if (this.HP > this.maxHP) this.HP = this.maxHP;
                setHP(gameState.player.HP);
            }
        }
        item.used = true;
        renderInventory(this.items);
    };
    this.eatFood = function (food) {
        if (!food.rotten) {
            if (food.modifiers) {
                for (var i = 0; i < food.modifiers.length; i++) {
                    if (item.modifiers[i].stat == 'HP') {
                        this.HP += Math.ceil(this.maxHP * item.modifiers[i].amountPercentage);
                        if (this.HP > this.maxHP) this.HP = this.maxHP;
                        setHP(gameState.player.HP);
                    }
                }
            }
            this.hunger += food.nutrition;
            setHunger(this.hunger);
        }
        food.used = true;
        renderInventory(this.items);
    };
}

function Room(roomId, xPos, yPos, items, monsters, npcs, isLocked, isDark) {
    this.roomId = roomId;
    this.xPos = xPos;
    this.yPos = yPos;
    this.items = items;
    this.monsters = monsters;
    this.npcs = npcs;
    this.isLocked = isLocked;
    this.isDark = isDark;
    this.getMonsterById = function (id) {
        for (i = 0; i < this.monsters.length; i++) {
            if (this.monsters[i].id == id) return this.monsters[i];
        }
    };
    this.getItemById = function (id) {
        for (i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) return this.items[i];
        }
    };
    this.getNpcById = function (id) {
        for (i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].id == id) return this.npcs[i];
        }
    };
}

function Item(pos, name, value, image, type, taken, used, curses, price) {
    GameObject.apply(this, arguments);
    this.pos = pos;
    this.name = name;
    this.value = value;
    this.image = image;
    this.type = type;
    this.taken = taken;
    this.used = used;
    this.curses = curses;
    this.price = price;
}

function NPC (pos, name, type, image) {
    GameObject.apply(this, arguments);
    this.pos = pos;
    this.name = name;
    this.type = type;
    this.image = image;
}

function Merchant(items, speciality, meanness) {
    NPC.apply(this, arguments);
    this.items = items;
    this.speciality = speciality;
    this.meanness = meanness;

}

function MoneyPot(bonanza) {
    Item.apply(this, arguments);
    this.bonanza = bonanza;
}

function Trap(damage) {
    Item.apply(this, arguments);
    this.damage = damage;
}

function UseableItem(modifiers) {
    Item.apply(this, arguments);
    this.modifiers = modifiers;
}

function Food(perishable, rotten, nutrition, modifiers) {
    Item.apply(this, arguments);
    this.perishable = perishable;
    this.rotten = rotten;
    this.nutrition = nutrition;
    this.modifiers = modifiers;
}

function Monster(pos, name, HP, atk, def, speed, agility, critChance, image, type, dead, bounty, heldItem) {
    GameObject.apply(this, arguments);
    this.pos = pos;
    this.name = name;
    this.HP = HP;
    this.atk = atk;
    this.def = def;
    this.speed = speed;
    this.agility = agility;
    this.critChance = critChance;
    this.image = image;
    this.type = type;
    this.dead = dead;
    this.bounty = bounty;
    this.xpReward = function () {
        return Math.ceil((this.HP + this.atk + this.def) * 1.4);
    }
    this.heldItem = heldItem;
}


function GameObject(id) {
    this.id = id;
}