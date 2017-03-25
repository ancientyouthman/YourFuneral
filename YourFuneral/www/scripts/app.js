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



function generateMonster(gs) {

    var monster = new Monster();
    var results = $.grep(monstersRepository, function (n, i) {
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
    // roll for held item
    if ((getRandomArbitrary(0, 100) / 100) < monsterTemplate.heldItemChance) {
        monster.heldItem = generateItem(gs);
    }
    monster.bounty = 6;
    monster.dead = false;
    return monster;


}

function generateItem(gs) {
    var item = new Item();
    // roll to see how rare an item we get 
    var chance = getRandomArbitrary(1, 10) / 10;
    var results = $.grep(itemsRepository, function (n, i) {
        return (n.encounterCeiling >= gs.player.level && n.rarity > chance);
    });
    console.log(results);
    var itemTemplate = results[Math.floor(Math.random() * results.length)];
    var item;
    // if no item could be generated given current game state and roll, just generate money
    if (!itemTemplate) {
        var moneyPot = new MoneyPot();
        moneyPot.id = gameState.incrementId();
        moneyPot.name = "Money Pot";
        moneyPot.pos = getRandomArbitrary(1, 10);
        moneyPot.image = '<img src="img/b71bb760bc6f235.png" />';
        moneyPot.taken = false;
        moneyPot.bonanza = Math.ceil((chance * gs.player.level) * (getRandomArbitrary(1, gs.player.level)));
        return moneyPot;
    }
    switch (itemTemplate.type) {
        case "Useable":
            item = new UseableItem();
            item.modifiers = itemTemplate.modifiers;
            break;
        case "Food":
            item = new Food();
            item.modifiers = itemTemplate.modifiers;
            item.perishable = itemTemplate.perishable;
            item.nutrition = itemTemplate.nutrition;
            item.rotten = false;
            break;
        default:
            item = new Item();
            break;
    }
    // generic properties 
    item.id = gameState.incrementId();
    item.name = itemTemplate.name;
    item.pos = getRandomArbitrary(1, 10);
    item.value = itemTemplate.value;
    item.image = '<img src="img/b71bb760bc6f235.png" />';
    item.type = itemTemplate.type;
    item.taken = false;
    item.used = false;
    item.price = getRandomArbitrary(itemTemplate.priceFloor, itemTemplate.priceCeil);
    // properties of derived types 



    return item;

}

function generateItems(gs, amt) {
    var items = [];
    // this is for making an array of items, for example to set as a merchant's stock 
    for (var i = 0; i < amt; i++) {
        var itemAlreadyAdded = false;
        var tryAgain = true;
        var item = new Item();
        var results = $.grep(itemsRepository, function (n, i) {
            return (n.encounterCeiling >= gs.player.level);
        });


            tryAgain = false;
            var itemTemplate = results[Math.floor(Math.random() * results.length)];
            // if no item could be generated given current game state and roll, just generate money

            itemAlreadyAdded = $.grep(items, function (n, i) {
                return (n.name == itemTemplate.name);
            });

            if (!itemTemplate || itemAlreadyAdded) {
                continue;
            }
  

        switch (itemTemplate.type) {
            case "Useable":
                item = new UseableItem();
                item.modifiers = itemTemplate.modifiers;
                break;
            case "Food":
                item = new Food();
                item.modifiers = itemTemplate.modifiers;
                item.perishable = itemTemplate.perishable;
                item.nutrition = itemTemplate.nutrition;
                item.rotten = false;
                break;
            default:
                item = new Item();
                break;
        }
        // generic properties 
        item.id = gameState.incrementId();
        item.name = itemTemplate.name;
        item.pos = getRandomArbitrary(1, 10);
        item.value = itemTemplate.value;
        item.image = '<img src="img/b71bb760bc6f235.png" />';
        item.type = itemTemplate.type;
        item.taken = false;
        item.used = false;
        item.price = getRandomArbitrary(itemTemplate.priceFloor, itemTemplate.priceCeil);
        // properties of derived types 



        items.push(item);

    }

    return items;

}

function generateNPC(gs) {

    var npc = new Merchant();
    npc.id = gameState.incrementId();
    npc.pos = getRandomArbitrary(1, 10);
    npc.meanness = getRandomArbitrary(8, 12) / 10;
    npc.name = 'Merchant';
    npc.image = '<img src="img/merchant.png" />';

    // roll for number of items on sale 
    var itemsStocked = getRandomArbitrary(2, 6);
    npc.items = generateItems(gs, itemsStocked);




    return npc;


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
        monsters.push(generateMonster(gameState));
    }

    for (i = 0; i < itemCount; i++) {
        items.push(generateItem(gameState));
    }
    for (i = 0; i < npcCount; i++) {
        npcs.push(generateNPC(gameState));
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

    var torchesAvailable = false;
    var dark = false;
    for (i = 0; i < gameState.rooms.length; i++) {
        for (j = 0; j < gameState.rooms[i].items.length; j++) {
            if (gameState.rooms[i].items[j].name == 'Torch') {
                torchesAvailable = true;
                break;
            }
        }
    }
    if (torchesAvailable) {
        // roll to see if room is dark
        if (getRandomArbitrary(1, 3) == 2 && gameState.rooms.length > 1) {
            dark = true;
        }
    }

    return new Room(gameState.incrementId(), x, y, items, monsters, npcs, locked, dark)

}

function battleLog(message) {
    var log = $('.battle-console').html();
    log += '<br />';
    log += message;
    $('.battle-console').html(log);


}

function getMonsterById(id) {

}

function getQuantities(arr) {
    var prev = {};
    prev.name = '';
    var ret = arr;
    var counter = 1;
    // sort alphabetically by name
    ret.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    for (var i = 0; i < ret.length; i++) {
        ret[i].occurence = 0;
        ret[i].visible = true;
    }

    for (var i = 0; i < ret.length; i++) {
        ret[i].occurence = 1;
        if (ret[i].used == false) {
            if (ret[i].name == prev.name) {
                ret[i - 1].visible = false;
                counter++
            }
            else {
                counter = 1;
            }
            ret[i].occurence = counter;
            prev = ret[i];
        }
    }

    return ret;
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
        if (gameState.player.speed > monster.speed) {
            gameConsole.log(monster.type + ' ' + monster.name + ' attacked you first!');
            gameState.player.HP -= Math.ceil(monster.atk - (gameState.player.def * 0.5));
        }
        else {
            gameConsole.log('You struck the ' + monster.type + '!');
            monster.HP -= Math.ceil(gameState.player.atk - (monster.def * 0.5));
        }
        // slug it out 
        while (monster.HP > 0 && gameState.player.HP > 0) {
            var delay = 300;
            //      setInterval(function () {
            // player hit
            // check for crit
            var foeCrit = monster.critChance >= (getRandomArbitrary(1, 10) / 10)
            dmg = Math.ceil(monster.atk - (gameState.player.def * 0.5)) + getRandomArbitrary(monster.atk - Math.ceil(monster.atk * 0.5), monster.atk + Math.ceil(monster.atk * 0.5));
            if (foeCrit) {
                dmg = Math.ceil(dmg * 1.5);
                gameConsole.log('Critical hit!');
            }
            gameConsole.log(monster.type + ' ' + monster.name + ' hit you for ' + dmg);
            gameState.player.HP -= dmg;
            if (gameState.player.HP <= 0) gameOver();
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
            //  }, delay);
        }

        monster.dead = true;
        gameConsole.log('You killed the ' + monster.type);
        gameConsole.log('Gained $: ' + monster.bounty);
        gameConsole.log('Gained XP: ' + monster.xpReward());
        if (monster.heldItem) {
            gameConsole.log('The monster dropped a ' + monster.heldItem.name);
            gameState.player.items.push(monster.heldItem);
            gameConsole.log('Got the ' + monster.heldItem.name);

        }
        gameState.player.money += monster.bounty;
        setMoney(gameState.player.money);
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

    $('.inventory-list').html('<ul></ul>');

    var countedItems = getQuantities(items);

    for (i = 0; i < countedItems.length; i++) {
        if (!countedItems[i].used && countedItems[i].visible) {
            switch (countedItems[i].type) {
                case "Useable":
                    $('.useables-list').append('<li>'
                        + countedItems[i].occurence + 'x '
                        + countedItems[i].name
                        + '<div class="btn use-item" data-id="' + countedItems[i].id + '">Use</button>'
                        + '</li>');
                    break;
                case "Weapon":
                    $('.weapons-list').append('<li>' + countedItems[i].occurence + 'x ' + countedItems[i].name + '</li>');
                    break;
                case "Treasure":
                    $('.treasures-list').append('<li>' + countedItems[i].occurence + 'x ' + countedItems[i].name + '</li>');
                    break;
                case "Food":
                    $('.food-list').append('<li>' + countedItems[i].occurence + 'x '
                        + countedItems[i].name
                        + '<div class="btn eat-food" data-id="' + countedItems[i].id + '">Eat</button>'
                       + '</li>');
                    break;
                default:
                    break;
            }
        }
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

    // darkness check
    if (room.isDark) {
        $('.map').addClass('dark');
    }
    else {
        $('.map').removeClass('dark');
    }

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

    for (var i = 0; i < room.npcs.length; i++) {
        var npcPos = room.npcs[i].pos;

        $('*[data-position="' + npcPos + '"]').html('<div class="sprite npc" data-npc-id="' + room.npcs[i].id + '">' + room.npcs[0].image + '</div>');
    }
    $('body').fadeIn(100);
}

function gameOver() {
    document.write('<h1>GAME OVER NERD</h1>');
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

function setMoney(newVal) {
    var oldVal = parseInt($("#money-amount").html());
    $({ val: oldVal }).animate({ val: newVal }, {
        duration: 500,
        easing: 'swing', // can be anything
        step: function () { // called on every step
            // Update the element's text with rounded-up value:
            $("#money-amount").text(Math.round(this.val));
        }
    });
}

function setHunger(newVal) {
    $("#hunger").html(newVal);
}

// start#


var player = new Player(
    20, 20, 3, 3, 2, 2, 0.1, 2, 2, 20, [], 0,
    new Coordinates(0, 0), 20
);

var rooms = [];

var gameState = new GameState(player, rooms, 1);
gameState.player = player;
setHP(gameState.player.HP);
setHunger(gameState.player.hunger);
gameState.rooms.push(generateRoom(0, 0));

setInterval(function () {
    gameState.player.hunger -= 1;
    if (gameState.player.hunger <= 0) gameOver();
    setHunger(gameState.player.hunger);
}, 15000);

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
                //     gameConsole.log(gameState.player.position.output());
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
                //     gameConsole.log(gameState.player.position.output());
                return;
            }
            else {

                //     gameConsole.log(gameState.player.position.output());
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
            //      gameConsole.log(gameState.player.position.output());
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
            //   gameConsole.log(gameState.player.position.output());
            return;
        }
        else {
            gameConsole.log('This room is locked...');
            //       gameConsole.log(gameState.player.position.output());
            return;
        }
        //      gameConsole.log(gameState.player.position.output());

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

    $(document).on('click', '.npc', function () {
        var room = gameState.getRoomById($('.map').attr('data-room-id'));
        if (room.isDark) {
            gameConsole.log('It\'s too dark to see anything...');
            return;
        }
        var npc = room.getNpcById($(this).attr('data-npc-id'));
        // populate monster modal
        $('#npc-modal').modal('show');
    });


    $(document).on('click', '.monster', function () {

        var room = gameState.getRoomById($('.map').attr('data-room-id'));
        if (room.isDark) {
            gameConsole.log('It\'s too dark to see anything...');
            return;
        }
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
        if (room.isDark) {
            gameConsole.log('It\'s too dark to see anything...');
            return;
        }
        var item = room.getItemById($(this).attr('data-item-id'));

        if (item.name == "Money Pot") {
            gameConsole.log('You found $' + item.bonanza);
            gameState.player.money += item.bonanza;
            item.taken = true;
            $(this).fadeOut(100);
            return;
        }

        item.taken = true;
        item.used = false;
        gameState.player.items.push(item);
        $(this).fadeOut(100);
        gameConsole.log('Took the ' + item.name);

    });

    $(document).on('click', '.use-item', function () {
        var item = gameState.player.getItemById($(this).attr('data-id'));
        if (item.name == 'Torch') {
            gameState.player.useTorch(item);
        }
        else {
            gameState.player.useItem(item);
        }
    });

    $(document).on('click', '.eat-food', function () {
        var food = gameState.player.getItemById($(this).attr('data-id'));
        gameState.player.eatFood(food);
    });


});