function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var gameConsole = {
    log: function (val) {
        var console = $('.console');
        var log = console.html();
        log = log + '<br />' + val;
        console.html(log).animate({ scrollTop: console.prop("scrollHeight") - console.height() }, 0);

    },
    clear: function () {
        $('.console').html();
    }
};



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

function Player(HP, maxHP, level, atk, def, speed, critChance, luck, agile, hunger, items, money, position) {
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
    }
}

function Room(roomId, xPos, yPos, items, monsters, npcs, isLocked) {
    this.roomId = roomId;
    this.xPos = xPos;
    this.yPos = yPos;
    this.items = items;
    this.monsters = monsters;
    this.npcs = npcs;
    this.isLocked = isLocked;
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
}

function Item(pos, name, value, image, type, taken, used) {
    GameObject.apply(this, arguments);
    this.pos = pos;
    this.name = name;
    this.value = value;
    this.image = image;
    this.type = type;
    this.taken = taken;
    this.used = used;
}

function Monster(pos, name, HP, atk, def, speed, agility, critChance, image, type, dead, bounty) {
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
}


function GameObject(id) {
    this.id = id;
}

function generateMonster(gs, fn) {
    $.getJSON("scripts/monsters.json", function (json) {
        var monster = new Monster();
        console.log(json);
        var results = $.grep(json, function (n, i) {
            return (n.encounterCeiling >= gs.player.level);
        });
        console.log(results);
        var monsterTemplate = results[Math.floor(Math.random() * results.length)];
        console.log(monsterTemplate);
        monster.id = gameState.incrementId();
        monster.type = monsterTemplate.type;
        monster.name = generateName(getRandomArbitrary(3, 7));
        monster.pos = getRandomArbitrary(1, 10);
        monster.HP = Math.ceil(gs.player.level * monsterTemplate.hpModifier);
        monster.atk = Math.ceil(gs.player.level * monsterTemplate.atkModifier);
        monster.def = Math.ceil(gs.player.level * monsterTemplate.defModifier);
        monster.speed = Math.ceil(gs.player.level * monsterTemplate.spdModifier);
        monster.agility = Math.ceil(gs.player.level * monsterTemplate.aglModifier);
        monster.critChance = monsterTemplate.critChance;
        monster.image = monsterTemplate.image;
        monster.bounty = 6;
        monster.dead = false;
        fn(monster);
    });

}

function generateItem(gs, fn) {
    $.getJSON("scripts/items.json", function (json) {
        var item = new Item();
        console.log(json);
        // roll to see how rare an item we get 
        var chance =  getRandomArbitrary(1, 10) / 10; 
        var results = $.grep(json, function (n, i) {
            return (n.encounterCeiling >= gs.player.level && n.rarity > chance);
        });
        console.log(results);
        var itemTemplate = results[Math.floor(Math.random() * results.length)];
        var item = new Item();
        item.id = gameState.incrementId();
        item.name = itemTemplate.name;
        item.pos = getRandomArbitrary(1, 10);
        item.value = itemTemplate.value;
        item.image = '<img src="img/b71bb760bc6f235.png" />';
        item.type = itemTemplate.type;
        item.taken = false;

        fn(item);
    });

}

function generateRoom(x, y) {

    var items = [];
    var monsters = [];
    var npcs = [];

    // roll for monster amount
    var monsterCount = getRandomArbitrary(0, 3);
    // roll for items
    var itemCount = getRandomArbitrary(0, 3);
    // roll for npc 
    var npcCount = getRandomArbitrary(0, 8) == 5 ? getRandomArbitrary(1, 2) : 0;

    for (var i = 0; i < monsterCount; i++) {
        generateMonster(gameState, function (monster) {
            monsters.push(monster);
        });  
    }

    for (i = 0; i < itemCount; i++) {
        generateItem(gameState, function (item) {
            items.push(item);
        });
    }
    for (i = 0; i < npcCount; i++) {
        npcs.push({
            name: "merchant"
        });
    }

    var keysAvailable = false;
    var locked = false;
    for (i = 0; i < gameState.rooms.length; i++) {
        for (j = 0; j < gameState.rooms[i].items.length; j++) {
            if (gameState.rooms[i].items[j].name == 'Key') {
                keysAvailable = true;
                break;
            }
        }
    }
    if (keysAvailable) {
        // roll to see if room is locked
        if (getRandomArbitrary(1, 3) == 2 && gameState.rooms.length > 1) {
            locked = true;
        }
    }

    return new Room(gameState.incrementId(), x, y, items, monsters, npcs, locked)

}

function battleLog(message) {
    var log = $('.battle-console').html();
    log += '<br />';
    log += message;
    $('.battle-console').html(log);


}

function getMonsterById(id) {

}

function fightMonster(roomId, monsterId) {
    //	debugger;
    $('#monster-modal').modal('hide')
    var room = gameState.getRoomById(roomId);
    if (room) {
        var monster = room.getMonsterById(monsterId);
        if (monster.dead) return;
        // start combat
        var dmg = 0;
        // see who strikes first
        if (player.speed > monster.speed) {
            gameConsole.log(monster.type + ' ' + monster.name + ' attacked you first!');
            gameState.player.HP -= Math.ceil(monster.atk - (gameState.player.def * 0.5));
        }
        else {
            gameConsole.log('You struck the ' + monster.type + '!');
            monster.HP -= Math.ceil(gameState.player.atk - (monster.def * 0.5));
        }
        // slug it out 
        while (monster.HP > 0 && gameState.player.HP > 0) {
            // player hit
            // check for crit
            var foeCrit = monster.critChance >= (getRandomArbitrary(1, 10) / 10)
            dmg = Math.ceil(monster.atk - (gameState.player.def * 0.5)) + getRandomArbitrary(monster.atk - Math.ceil(monster.atk * 0.5), monster.atk + Math.ceil(monster.atk * 0.5));
            if(foeCrit) {
                dmg = Math.ceil(dmg * 1.5);
                gameConsole.log('Critical hit!');
            }
            gameConsole.log(monster.type + ' ' + monster.name + ' hit you for ' + dmg);
            gameState.player.HP -= dmg;
            setHP(gameState.player.HP);
                // foe hit 
            var playerCrit = player.critChance >= (getRandomArbitrary(1, 10) / 10)
            dmg = Math.ceil(gameState.player.atk - (monster.def * 0.5)) + getRandomArbitrary(gameState.player.atk - Math.ceil(gameState.player.atk * 0.5), gameState.player.atk + Math.ceil(gameState.player.atk * 0.5));
            if (playerCrit) {
                dmg = Math.ceil(dmg * 1.5);
                gameConsole.log('Critical hit!');
            }
            gameConsole.log('You struck the ' + monster.type + ' for ' + dmg);
            monster.HP -= dmg;
        }
        monster.dead = true;
        gameConsole.log('You killed the ' + monster.type);
        gameConsole.log('Gained $: ' + monster.bounty);
        gameConsole.log('Gained XP: ' + monster.xpReward());

        invalidate(room);
    }

}

function fightPrediction(roomId, monsterId) {

    var testHP = gameState.player.HP;

    var room = gameState.getRoomById(roomId);
    if (room) {
        var monster = room.getMonsterById(monsterId);
        var testMonsterHP = monster.HP;
        // start combat
        var dmg = 0;
        // see who strikes first
        if (player.speed > monster.speed) {
            testHP -= Math.ceil(monster.atk - (gameState.player.def * 0.5));
        }
        else {

            testMonsterHP -= Math.ceil(gameState.player.atk - (monster.def * 0.5));
        }
        // slug it out 
        while (testMonsterHP > 0 && testHP > 0) {
            // player hit
            dmg = Math.ceil(monster.atk - (gameState.player.def * 0.5)) + getRandomArbitrary(monster.atk - Math.ceil(monster.atk * 0.5), monster.atk + Math.ceil(monster.atk * 0.5));

            testHP -= dmg;
            if (testHP <= 0) {
                return false;
            }

            // foe hit 
            dmg = Math.ceil(gameState.player.atk - (monster.def * 0.5)) + getRandomArbitrary(gameState.player.atk - Math.ceil(gameState.player.atk * 0.5), gameState.player.atk + Math.ceil(gameState.player.atk * 0.5));

            testMonsterHP -= dmg;
        }
        return true;

    }

}

function renderInventory(items) {
    var useables = $.grep(items, function (n, i) {
        return (n.type == 'Useable');
    });
    var treasures = $.grep(items, function (n, i) {
        return (n.type == 'Treasure');
    });
    var weapons = $.grep(items, function (n, i) {
        return (n.type == 'Weapon');
    });
    var food = $.grep(items, function (n, i) {
        return (n.type == 'Food');
    });
    $('.useables-list').html('<ul></ul>');
    for (i = 0; i < useables.length; i++) {
        $('.useables-list').append('<li>' + useables[i].name + '</li>')
    }
    for (i = 0; i < treasures.length; i++) {
        $('.treasures-list').append('<li>' + treasures[i].name + '</li>')
    }
    for (i = 0; i < weapons.length; i++) {
        $('.weapons-list').append('<li>' + weapons[i].name + '</li>')
    }
    for (i = 0; i < food.length; i++) {
        $('.food-list').append('<li>' + food[i].name + '</li>')
    }
}


function renderMap(rooms) {

    // get the x length
    var mapWidth = Math.max.apply(Math, rooms.map(function (o) { return o.xPos; }))
    // get x starting pos 
    var xStart = Math.min.apply(Math, rooms.map(function (o) { return o.xPos; }))

    // get the y length
    var mapHeight = Math.max.apply(Math, rooms.map(function (o) { return o.yPos; }))
    // get y starting pos 
    var yStart = Math.min.apply(Math, rooms.map(function (o) { return o.yPos; }))

    var blankSquare = '<div style="float: left; display: block; border: 1px solid black; min-height: ' + 20 + 'px; min-width: ' + 20 + 'px" />';

    var filledSquare = '<div style="background-color:black; float: left; display: block; border: 1px solid black; min-height: ' + 20 + 'px; min-width: ' + 20 + 'px" />';

    var lockedSquare = '<div style="background-color:red; float: left; display: block; border: 1px solid black; min-height: ' + 20 + 'px; min-width: ' + 20 + 'px" />';

    var currentSquare = '<div style="background-color:green; float: left; display: block; border: 1px solid black; min-height: ' + 20 + 'px; min-width: ' + 20 + 'px" />';


    var output = '';

    for (y = mapHeight; y >= yStart; y--) {
        for (x = xStart; x <= mapWidth; x++) {
            var room = gameState.findRoomAtCoords(x, y);
            if (gameState.player.position.x == x && gameState.player.position.y == y) {
                output += currentSquare;
            }
            else if (room && !room.isLocked) {
                output += filledSquare;
            }
            else if (room && room.isLocked) {
                output += lockedSquare;
            }
            else {
                output += blankSquare;
            }
        }
        output += '<br />';
    }
    $('.map-modal-body').html(output);
}



function generateName(len) {
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    var consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
    var ret = '';
    for (i = 0; i < len; i++) {
        if (i % 2) {
            ret += vowels[getRandomArbitrary(0, 4)];
        } else {
            ret += consonants[getRandomArbitrary(0, 19)];
        }
    }
    return ret.charAt(0).toUpperCase() + ret.slice(1);

}

function invalidate(room) {
    $('body').fadeOut(100)
    $('.map').attr('data-room-id', room.roomId);
    // clear the board
    $('.sprite').each(function () {
        $(this).remove();
    });

    for (var i = 0; i < room.items.length; i++) {
        var itemPos = room.items[i].pos;
        if (!room.items[i].taken) {
            $('*[data-position="' + itemPos + '"]').html('<div class="sprite item" data-item-id="' + room.items[i].id + '">' + room.items[0].image + '</div>');
        }
    }

    for (i = 0; i < room.monsters.length; i++) {
        if (!room.monsters[i].dead) {
            // draw monster sprites 
            var monsterPos = room.monsters[i].pos;
            $('*[data-position="' + monsterPos + '"]').html(
                '<div class="sprite monster" data-monster-id="' + room.monsters[i].id + '">' +
                room.monsters[i].image +
                '</div>'
            );

            var prediction = fightPrediction(room.roomId, room.monsters[i].id) ? "You will probably win this fight" : "You will probably be killed in this fight";
            $('.monster-info-prediction').html(prediction);

        }

    }
    $('body').fadeIn(100);
}

// HP Bar functions

function getGreenToRed(percent) {
    r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
    g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
    return 'rgb(' + r + ',' + g + ',0)';
}

function setHP(amt) {
    $("#HP").css('width', (amt / gameState.player.maxHP * 100) + '%');
    $("#HP").css('background-color', getGreenToRed((amt / gameState.player.maxHP * 100)));
    $("#hp-amount").html(amt);
}

// start#


var player = new Player(
    20, 20, 3, 3, 2, 2, 0.1, 2, 2, 2, [], 0,
    new Coordinates(0, 0)
);

var rooms = [];

var gameState = new GameState(player, rooms, 1);
setHP(player.HP);
gameState.rooms.push(generateRoom(0, 0));

var monstersRepository = {};
$.getJSON('http://localhost:4400/scripts/test.json', function (json) {
    monstersRepository = json;
});



$(function () {

    //initialise
    invalidate(rooms[0]);
    // player movement event 
    $('.directional').on('click', function () {
        // put attempted coords in a temp variable 
        var direction = $(this).attr("data-direction");
        var tempCoords = new Coordinates(gameState.player.position.x, gameState.player.position.y);
        switch (direction) {
            case "up":
                tempCoords.y += 1;
                break;
            case "left":
                tempCoords.x -= 1;
                break;
            case "right":
                tempCoords.x += 1;
                break;
            case "down":
                tempCoords.y -= 1;
                break;
        }

        // if the room has been discovered

        var room = gameState.findRoomAtCoords(tempCoords.x, tempCoords.y);

        if (room) {
            if (!room.isLocked) {
                // actually move the player 

                // TODO: put the movement switch in its own function
                switch (direction) {
                    case "up":
                        gameState.player.position.y += 1;
                        break;
                    case "left":
                        gameState.player.position.x -= 1;
                        break;
                    case "right":
                        gameState.player.position.x += 1;
                        break;
                    case "down":
                        gameState.player.position.y -= 1;
                        break;
                }
                invalidate(room);
                gameConsole.log(gameState.player.position.output());
                return;
            }
            else if (gameState.player.hasKey()) {
                room.isLocked = false;
                gameConsole.log('Used a key');
                gameState.player.useKey();
                switch (direction) {
                    case "up":
                        gameState.player.position.y += 1;
                        break;
                    case "left":
                        gameState.player.position.x -= 1;
                        break;
                    case "right":
                        gameState.player.position.x += 1;
                        break;
                    case "down":
                        gameState.player.position.y -= 1;
                        break;
                }
                invalidate(room);
                gameConsole.log(gameState.player.position.output());
                return;
            }
            else {

                gameConsole.log(gameState.player.position.output());
                gameConsole.log('This room is locked...');
                return;
            }
        }

        var newRoom = generateRoom(tempCoords.x, tempCoords.y);
        gameState.rooms.push(newRoom);


        if (!newRoom.isLocked) {
            switch (direction) {
                case "up":
                    gameState.player.position.y += 1;
                    break;
                case "left":
                    gameState.player.position.x -= 1;
                    break;
                case "right":
                    gameState.player.position.x += 1;
                    break;
                case "down":
                    gameState.player.position.y -= 1;
                    break;
            }

            invalidate(newRoom);
            gameConsole.log(gameState.player.position.output());
            return;
        }
        else if (gameState.player.hasKey()) {
            newRoom.isLocked = false;
            gameState.player.useKey();
            gameConsole.log('Used a key');
            switch (direction) {
                case "up":
                    gameState.player.position.y += 1;
                    break;
                case "left":
                    gameState.player.position.x -= 1;
                    break;
                case "right":
                    gameState.player.position.x += 1;
                    break;
                case "down":
                    gameState.player.position.y -= 1;
                    break;
            }
            invalidate(newRoom);
            gameConsole.log(gameState.player.position.output());
            return;
        }
        else {
            gameConsole.log('This room is locked...');
            gameConsole.log(gameState.player.position.output());
            return;
        }
        gameConsole.log(gameState.player.position.output());

    });

    $('.fight-monster').on('click', function () {
        fightMonster($('.map').attr('data-room-id'), $(this).attr('data-monster-id'));
    });

    $('.show-map').on('click', function () {
        renderMap(gameState.rooms);
    });

    $('.show-inventory').on('click', function () {
        renderInventory(gameState.player.items);
    });


    $(document).on('click', '.monster', function () {

        var room = gameState.getRoomById($('.map').attr('data-room-id'));
        var monster = room.getMonsterById($(this).attr('data-monster-id'));
        // populate monster modal
        $('.monster-info-id').html(monster.id);
        $('.monster-info-name').html(monster.name);
        $('.monster-info-type').html(monster.type);
        $('.monster-info-hp').html(monster.HP);
        $('.monster-info-atk').html(monster.atk);
        $('.monster-info-def').html(monster.def);
        $('.fight-monster').attr("data-monster-id", monster.id);
        $('#monster-modal').modal('show');
    });

    $(document).on('click', '.item', function () {

        var room = gameState.getRoomById($('.map').attr('data-room-id'));
        var item = room.getItemById($(this).attr('data-item-id'));
        item.taken = true;
        item.used = false;
        gameState.player.items.push(item);
        $(this).fadeOut(100);
        gameConsole.log('Took the ' + item.name);

    });

});