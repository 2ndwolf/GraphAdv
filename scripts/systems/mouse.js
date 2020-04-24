ECS.systems.mouse = function systemMouse(entities){
    let mouseEntity;  //Maybe add support for multiple mouseEntities for a puzzle later on
    let playerEntity;
    let hoveringArea;
    let areas = [];
    let canDo = false;
    let mouseEntityPos;
    this.inventoryOpened = this.inventoryOpened || false;
    this.itself = this.itself || false;

    for(var ent in entities){
        if(entities[ent].components.mouse){
            if(entities[ent].components.mouse.hijacked){
                break;
            } else mouseEntity = entities[ent];
        }
        if(entities[ent].components.isPlayer){
            playerEntity = entities[ent];
        }
        if(entities[ent].components.area){
            areas.push(entities[ent]);
        }
        if(entities[ent].components.inventory){
            inventoryEntity = entities[ent];
        }
    }

    if(mouseEntity){
        // mouseEntity.components.position.lastX = mouseEntity.components.position.x;
        // mouseEntity.components.position.lastY = mouseEntity.components.position.y;
        if(mouseEntity.components.mouse.activeIcon == 5){
            mouseEntity.components.mouse.currentItem.components.position.x = userInputPosition.x - 24;
            mouseEntity.components.mouse.currentItem.components.position.y = userInputPosition.y - 24;
            mouseEntityPos = mouseEntity.components.mouse.currentItem.components.position;
        } else {
            mouseEntity.components.position.x = userInputPosition.x - 24;
            mouseEntity.components.position.y = userInputPosition.y - 24;
            mouseEntityPos = mouseEntity.components.position;
        }
        
        if(!this.inventoryOpened && userInputPosition.right[0] == -1 &&
            inBounds(
                inventoryEntity.components.position.x,
                inventoryEntity.components.position.y,
                inventoryEntity.components.size.width,
                inventoryEntity.components.size.height,
                userInputPosition.up[0],
                userInputPosition.up[1])){
                    this.inventoryOpened = true;
                    inventoryEntity.components.texture.hidden = true;
                    inventoryEntity.components.inventory.inventoryEntities = ECS.Assemblages.inventory(playerEntity);
                    hoveringArea = inventoryEntity;
        } else {
            if(this.inventoryOpened && userInputPosition.up[0] != -1 && userInputPosition.right[0] == -1 &&
                !inBounds(
                30,
                30,
                740,
                540,
                userInputPosition.up[0],
                userInputPosition.up[1])){
                    for(e in inventoryEntity.components.inventory.inventoryEntities){
                        inventoryEntity.components.inventory.inventoryEntities[e].garbageEntity(inventoryEntity.components.inventory.inventoryEntities[e]);
                    }
                    this.inventoryOpened = false;
                    inventoryEntity.components.texture.hidden = false;
            }
            areas = areas.sort(function(a,b){
                return b.components.position.layer - a.components.position.layer;
            });

            areasforloop:
            for(var a in areas){
                if(areas[a].components.size.sizes){
                    for(var s in areas[a].components.size.sizes){
                        if(inBounds(
                            areas[a].components.position.x + areas[a].components.size.sizes[s].x,
                            areas[a].components.position.y + areas[a].components.size.sizes[s].y,
                            areas[a].components.size.sizes[s].width,
                            areas[a].components.size.sizes[s].height,
                            mouseEntityPos.x + 24,
                            mouseEntityPos.y + 24
                        )){
                            hoveringArea = areas[a];
                            break areasforloop;
                        }
                    }
                } else if(inBounds(
                    areas[a].components.position.x,
                    areas[a].components.position.y,
                    areas[a].components.size.width,
                    areas[a].components.size.height,
                    mouseEntityPos.x + 24,
                    mouseEntityPos.y + 24)){
                    hoveringArea = areas[a];
                    break;
                }
                hoveringArea = false;
            }   
        }

        if((hoveringArea != mouseEntity.components.mouse.previousArea) ||
           (mouseEntity.components.mouse.activeIcon == 0 && this.itself) ||
           (mouseEntity.components.mouse.activeIcon == 0 && this.itself) ||
           (mouseEntity.components.mouse.activeIcon == 5 && !this.itself && 
           ((hoveringArea && mouseEntity.components.mouse.currentItem) &&
           hoveringArea.components.area.intName == mouseEntity.components.mouse.currentItem.components.area.intName))){
               
            for(var m in mouseEntity.components.mouse.mouseOverText){
                delete ECS.systems.render.members[mouseEntity.components.mouse.mouseOverText[m].id];
            }
        }


        //Activate or deactivate mouseIcon accordingly

        if(hoveringArea){
            if(hoveringArea.components.inventory){
                canDo = false;
            } else {
                switch(mouseEntity.components.mouse.activeIcon) {
                    case 5: //itemInHand
                        if(hoveringArea.components.area.areaName){
                            canDo = true;
                        } else {
                            canDo = false;
                        }
                        break;
                    case 4: //walkIcon
                        if(hoveringArea.components.area.blocking){
                            mouseEntity.components.texture.offY = 0;
                            canDo = false;
                        } else {
                            mouseEntity.components.texture.offY = 48;
                            canDo = true;
                        }
                        break;
                    case 3: //takeIcon
                        if(hoveringArea.components.area.takeable){
                            mouseEntity.components.texture.offY = 48;
                            canDo = true;
                        } else {
                            mouseEntity.components.texture.offY = 0;
                            canDo = false;
                        }
                        break;
                    case 2: //useIcon
                        if(hoveringArea.components.area.useable){
                            mouseEntity.components.texture.offY = 48;
                            canDo = true;
                        } else {
                            mouseEntity.components.texture.offY = 0;
                            canDo = false;
                        }
                        break;
                    case 1: //talkIcon
                        if(hoveringArea.components.area.talkable){
                            mouseEntity.components.texture.offY = 48;
                            canDo = true;
                        } else {
                            mouseEntity.components.texture.offY = 0;
                            canDo = false;
                        }
                        break;
                    case 0: //lookIcon
                        if(hoveringArea.components.area.lookable){
                            mouseEntity.components.texture.offY = 48;
                            canDo = true;
                        } else {
                            mouseEntity.components.texture.offY = 0;
                            canDo = false;
                        }
                        break;
                    default:
                    if(consoleOn) console.log("MouseIcon off limits");
                    break;
                }
            }
            textunder:
            if(((canDo || hoveringArea.components.inventory) && mouseEntity.components.mouse.previousArea != hoveringArea) || 
                (mouseEntity.components.mouse.activeIcon == 0 && this.itself) || 
                (mouseEntity.components.mouse.activeIcon == 5 && !this.itself && ((hoveringArea && mouseEntity.components.mouse.currentItem) && hoveringArea.components.area.intName == mouseEntity.components.mouse.currentItem.components.area.intName))){
                if(mouseEntity.components.mouse.currentItem){
                    if(hoveringArea.components.area.intName == mouseEntity.components.mouse.currentItem.components.area.intName && mouseEntity.components.mouse.activeIcon == 5){
                        mouseEntity.components.mouse.mouseOverText = new ECS.Assemblages.text("itself",0,15);
                        this.itself = true;
                        break textunder;
                    }
                }
                if(hoveringArea && mouseEntity.components.mouse.currentItem) console.log(hoveringArea.components.area.intName == mouseEntity.components.mouse.currentItem.components.area.intName);
                mouseEntity.components.mouse.mouseOverText = new ECS.Assemblages.text(hoveringArea.components.area.areaName,0,15);
                this.itself = false;
            }
        } else if(mouseEntity.components.mouse.activeIcon == 4){
            mouseEntity.components.texture.offY = 48;
            canDo = true;
        } else {
            mouseEntity.components.texture.offY = 0;
        }

        mouseEntity.components.mouse.previousArea = hoveringArea;

        if(userInputPosition.down[0] >= 0 && userInputPosition.down[1] >= 0 && mouseEntity.components.mouse.clickDown == false){
                mouseEntity.components.mouse.down[0] = userInputPosition.down[0];
                mouseEntity.components.mouse.down[1] = userInputPosition.down[1];
                mouseEntity.components.mouse.clickDown = true;
        }

        if((userInputPosition.right[0] >= 0 && userInputPosition.right[1] >= 0) || mouseEntity.components.mouse.currentItem === 0 || mouseEntity.components.mouse.newItem){
            if(mouseEntity.components.mouse.newItem){
                mouseEntity.components.mouse.activeIcon = 5;
                mouseEntity.components.mouse.newItem = false;
            } else {
                mouseEntity.components.mouse.activeIcon = (mouseEntity.components.mouse.activeIcon + 1) %
                (mouseEntity.components.mouse.currentItem ? 6 : 5);
                mouseEntity.components.mouse.clickDown = false;
            }
            //Is this at the right place?
            if(mouseEntity.components.mouse.activeIcon == 5){
                mouseEntity.components.texture.texture = mouseEntity.components.mouse.currentItem.components.texture.texture;
                ECS.systems.render.members[mouseEntity.components.mouse.currentItem.id] =  mouseEntity.components.mouse.currentItem;
                mouseEntity.components.mouse.currentItem.components.position.x = userInputPosition.x - 24;
                mouseEntity.components.mouse.currentItem.components.position.y = userInputPosition.y - 24;
            } else {
                if(mouseEntity.components.mouse.currentItem){
                    if(ECS.systems.render.members[mouseEntity.components.mouse.currentItem.id]){
                        delete ECS.systems.render.members[mouseEntity.components.mouse.currentItem.id];
                        mouseEntity.components.position.x = userInputPosition.x - 24;
                        mouseEntity.components.position.y = userInputPosition.y - 24;
                    }
                }
                mouseEntity.components.texture.texture = mouseEntity.components.mouse.texture;
                mouseEntity.components.texture.offX = mouseEntity.components.mouse.activeIcon * 48;

            }
            if(mouseEntity.components.mouse.currentItem === 0){
                mouseEntity.components.mouse.currentItem = false;
            }
            for(var m in mouseEntity.components.mouse.mouseText){
                delete ECS.systems.render.members[mouseEntity.components.mouse.mouseText[m].id];
            }
            switch(mouseEntity.components.mouse.activeIcon) {
                case 5: //itemInHand
                    mouseEntity.components.mouse.mouseText = new ECS.Assemblages.text("Use " + mouseEntity.components.mouse.currentItem.components.area.areaName + " with",0,0);
                    break;
                case 4: //walkIcon
                    console.log(ECS.systems.render.members);
                    mouseEntity.components.mouse.mouseText = new ECS.Assemblages.text("Walk to",0,0);
                    break;
                case 3: //takeIcon
                    mouseEntity.components.mouse.mouseText = new ECS.Assemblages.text("Take",0,0);
                    break;
                case 2: //useIcon
                    mouseEntity.components.mouse.mouseText = new ECS.Assemblages.text("Use",0,0);
                    break;
                case 1: //talkIcon
                    mouseEntity.components.mouse.mouseText = new ECS.Assemblages.text("Talk to",0,0);
                    break;
                case 0: //lookIcon
                    mouseEntity.components.mouse.mouseText = new ECS.Assemblages.text("Look at",0,0);
                    break;
                default:
                    if(consoleOn) console.log("MouseIcon off limits");
                    break;
            }
        } else {
            if(userInputPosition.up[0] >= 0 && userInputPosition.up[1] >= 0 && mouseEntity.components.mouse.clickDown == true){
                mouseEntity.components.mouse.up[0] = userInputPosition.up[0];
                mouseEntity.components.mouse.up[1] = userInputPosition.up[1];
                if(canDo &&
                    //make a closeEnough function so a tad of movement still works
                    //no, just make sure up is in the same area as down...
                    userInputPosition.up[0] == mouseEntity.components.mouse.down[0] &&
                    userInputPosition.up[1] == mouseEntity.components.mouse.down[1]
                ){
                        /////
                        //Action on mouse click
                        ////
                    switch(mouseEntity.components.mouse.activeIcon) {
                        case 5: //itemInHand
                            if(mouseEntity.components.mouse.currentItem.components.item.useWith.includes(hoveringArea.components.area.intName)){
                                hoveringArea.addComponent(new ECS.Components.Useable({
                                    actions: hoveringArea.components.area.intName+mouseEntity.components.mouse.currentItem.components.area.intName,
                                    entities: {
                                        playerEntity: playerEntity,
                                        hoveringArea: hoveringArea,
                                        itemEntity: mouseEntity.components.mouse.currentItem,
                                        mouseEntity: mouseEntity
                                    }
                                }));
                                ECS.systems.actionLists.members[hoveringArea.id] = hoveringArea;
                                hoveringArea.memberOf.push(ECS.systems.actionLists.name);                           
                            } else {
                                if(hoveringArea.components.area.itemReactions){
                                    if(hoveringArea.components.area.itemReactions[mouseEntity.components.mouse.currentItem.components.area.intName]){
                                        deletePlayerSpeech(playerEntity);
                                        playerEntity.components.isPlayer.currentSpeech = new ECS.Assemblages.text(hoveringArea.components.area.itemReactions[mouseEntity.components.mouse.currentItem.components.area.intName],0,0,playerEntity);
                                    } else {
                                        deletePlayerSpeech(playerEntity);
                                        playerEntity.components.isPlayer.currentSpeech = new ECS.Assemblages.text(mouseEntity.components.mouse.currentItem.components.item.defaultSay,0,0,playerEntity);
                                    }
                                } else {
                                    deletePlayerSpeech(playerEntity);
                                    playerEntity.components.isPlayer.currentSpeech = new ECS.Assemblages.text(mouseEntity.components.mouse.currentItem.components.item.defaultSay,0,0,playerEntity);
                                }
                            }
                            break;
                        case 4: //iconWalk
                            if(hoveringArea && hoveringArea.components.area){
                                if(hoveringArea.components.area.walkable){
                                    hoveringArea.addComponent(new ECS.Components.Useable({
                                        actions: "walkWarp",
                                        dstX: mouseEntity.components.mouse.up[0],
                                        dstY: mouseEntity.components.mouse.up[1],
                                        options: {
                                            warpLevel: hoveringArea.components.area.walkable.warpLevel,
                                            warpLevelX: hoveringArea.components.area.walkable.warpLevelX === false ? mouseEntity.components.mouse.up[0] : hoveringArea.components.area.walkable.warpLevelX,
                                            warpLevelY: hoveringArea.components.area.walkable.warpLevelY === false ? mouseEntity.components.mouse.up[1] : hoveringArea.components.area.walkable.warpLevelY,
                                        },
                                        entities: {
                                            playerEntity: playerEntity,
                                            hoveringArea: hoveringArea,
                                            itemEntity: mouseEntity.components.mouse.currentItem,
                                            mouseEntity: mouseEntity
                                        }
                                    }));
                                    ECS.systems.actionLists.members[hoveringArea.id] = hoveringArea;
                                    hoveringArea.memberOf.push(ECS.systems.actionLists.name);
                                }
                            } else {
                                playerEntity.addComponent(new ECS.Components.MovesAround({
                                    currX: playerEntity.components.position.x,
                                    currY: playerEntity.components.position.y,
                                    dstX: mouseEntity.components.mouse.up[0],
                                    dstY: mouseEntity.components.mouse.up[1],
                                    speed: .15,
                                    astar: true
                                }));
                                ECS.systems.movement.members[playerEntity.id] = playerEntity;
                                playerEntity.memberOf.push(ECS.systems.movement.name);
                                playerEntity.addComponent(new ECS.Components.Animated({
                                    intName: "walkCyclePlayer1",
                                    delay: 400,
                                    offX: 215,
                                    entity: playerEntity,
                                    frames: 4,
                                    walkCycle: true
                                }));
                                ECS.systems.animated.members[playerEntity.id] = playerEntity;
                                playerEntity.memberOf.push(ECS.systems.animated.name);
                            }
                            break;
                        case 3: //iconTake
                            if(hoveringArea.components.area.inventoryItem){
                                hoveringArea.addComponent(new ECS.Components.Useable({
                                    actions: "takeInventory",
                                    entities: {
                                        playerEntity: playerEntity,
                                        hoveringArea: hoveringArea,
                                        itemEntity: mouseEntity.components.mouse.currentItem,
                                        mouseEntity: mouseEntity
                                    }
                                }));
                            } else {   
                                hoveringArea.addComponent(new ECS.Components.Useable({
                                    actions: "take",
                                    entities: {
                                        playerEntity: playerEntity,
                                        hoveringArea: hoveringArea,
                                        itemEntity: mouseEntity.components.mouse.currentItem,
                                        mouseEntity: mouseEntity
                                    }
                                }));
                            }
                            ECS.systems.actionLists.members[hoveringArea.id] = hoveringArea;
                            hoveringArea.memberOf.push(ECS.systems.actionLists.name);
                            break;
                        case 2: //iconUse
                            console.log("Using the thing");
                            break;
                        case 1: //iconTalk
                            deletePlayerSpeech(playerEntity);
                            entity = new ECS.Entity();
                            let talk = hoveringArea.components.area.talkable.slice(0);
                            entity.addComponent(new ECS.Components.Conversation({
                                conversation: talk.shift()+playerEntity.components.isPlayer.charName,
                                otherChars: talk,
                                playerEntity: playerEntity
                            }));
                            mouseEntity.components.mouse.mode = 1;
                            mouseEntity.components.texture.offX = 5 * 48;
                            mouseEntity.components.texture.offY = 0;
                            ECS.systems.conversation.members[entity.id] = entity;
                            ECS.systems.conversation.members[mouseEntity.id] = mouseEntity;
                            ECS.systems.conversation.members[playerEntity.id] = playerEntity;

                            break;
                        case 0: //iconLook
                            deletePlayerSpeech(playerEntity);
                            playerEntity.components.isPlayer.currentSpeech = new ECS.Assemblages.text(hoveringArea.components.area.lookable,0,0,playerEntity);
                            break;
                        default:
                            console.log("MouseIcon off limits");
                            break;
                    }
                }
                mouseEntity.components.mouse.clickDown = false;
            }
            
            
        }
        
        userInputPosition.up[0] = -1;
        userInputPosition.up[1] = -1;
        userInputPosition.down[0] = -1;
        userInputPosition.down[1] = -1;
        userInputPosition.right[0] = -1;
        userInputPosition.right[1] = -1;
    }
}

ECS.systems.mouse.family = {
    one : ["mouse","isPlayer","area","inventory"]
};

ECS.systems.mouse.members = {};

var userInputPosition = {
    x : 0,
    y : 0,
    down : [-1,-1],
    up : [-1,-1],
    right : [-1,-1],
};

function updateMousePosition(evt){
    let rect = canvas.getBoundingClientRect();
    userInputPosition.x = evt.clientX - rect.left;
    userInputPosition.y = evt.clientY - rect.top;
}

function mouseDown(evt){
    let rect = canvas.getBoundingClientRect();
    if(inBounds(rect.left,rect.top,gameWidth,gameHeight,evt.clientX,evt.clientY)){
        userInputPosition.down[0] = evt.clientX - rect.left;
        userInputPosition.down[1] = evt.clientY - rect.top;
    }
}

function mouseUp(evt){
    let rect = canvas.getBoundingClientRect();
    if(inBounds(rect.left,rect.top,gameWidth,gameHeight,evt.clientX,evt.clientY)){
        userInputPosition.up[0] = evt.clientX - rect.left;
        userInputPosition.up[1] = evt.clientY - rect.top;
    }
}

function rightClick(evt){
    evt.preventDefault();
    let rect = canvas.getBoundingClientRect();
    if(inBounds(rect.left,rect.top,gameWidth,gameHeight,evt.clientX,evt.clientY)){
        userInputPosition.right[0] = evt.clientX - rect.left;
        userInputPosition.right[1] = evt.clientY - rect.top;
    }
}

document.addEventListener("mousemove", updateMousePosition);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
// document.addEventListener("dblclick", Input.doubleClick);
document.addEventListener('contextmenu', rightClick, false);

function inBounds(x, y, width, height, touchX, touchY) {
    if (touchX > x &&
        touchX < x + width &&
        touchY > y &&
        touchY < y + height) {
        return true;
    }
    return false;
}

function deletePlayerSpeech(playerEntity){
    if(playerEntity.components.isPlayer){
        if(playerEntity.components.isPlayer.currentSpeech.length != 0){
            if(ECS.systems.render.members[playerEntity.components.isPlayer.currentSpeech[0].id]){
                for(var m in playerEntity.components.isPlayer.currentSpeech){
                    playerEntity.components.isPlayer.currentSpeech[m].garbageEntity(playerEntity.components.isPlayer.currentSpeech[m]);
                }
            }
        }
    }else if(playerEntity.components.area.actorSpeech.length != 0){
        if(ECS.systems.render.members[playerEntity.components.area.actorSpeech[0].id]){
            for(var m in playerEntity.components.area.actorSpeech){
                playerEntity.components.area.actorSpeech[m].garbageEntity(playerEntity.components.area.actorSpeech[m]);
            }
        }
    } 
}