ECS.systems.conversation = function systemConversation(ent){
    let mouseEntity, convoEntity, playerEntity;
    this.actor = this.actor || 0;
    let thisIsOver = false;
    for(var e in ent){
        if(ent[e].components.mouse){
            mouseEntity = ent[e];
        }
        if(ent[e].components.conversation){
            convoEntity = ent[e];
        }
        if(ent[e].components.isPlayer){
            playerEntity = ent[e];
        }
    }

    if(convoEntity && mouseEntity){
        if(!convoEntity.components.conversation.actors){
            convoEntity.components.conversation.actors = {};
            for(var e in ECS.entities){
                if(ECS.entities[e].components.area){
                    if(convoEntity.components.conversation.otherChars.includes(ECS.entities[e].components.area.intName)){
                        convoEntity.components.conversation.actors[ECS.entities[e].components.area.intName] = ECS.entities[e];
                    }
                }
            }
            console.log(convoEntity.components.conversation.otherChars);
        }
        let convo = playerEntity.components.isPlayer.playerData[playerEntity.components.isPlayer.charName].conversations[convoEntity.components.conversation.conversation];
        if(convo.isNew){
            convo.main.push(...convo.start)
            convo.main.push(...convo.end);
            convo.isNew = false;
            convoEntity.components.conversation.waitTime = 0;
        }
        if(convoEntity.components.conversation.sayables.length == 0){
            for(var i = 0; i < convo.main.length; i++){
                let sayXPos = gameHeight-(convo.main.length+1)*16+i*16;
                convoEntity.components.conversation.sayables.push(sayXPos);
                convoEntity.components.conversation.sayables.push(new ECS.Assemblages.text(convo.main[i][0][1],0,sayXPos));
            }
        }

        if(mouseEntity.components.mouse.mode == 1){
            mouseEntity.components.position.x = userInputPosition.x - 24;
            mouseEntity.components.position.y = userInputPosition.y - 24;
            mouseEntityPos = mouseEntity.components.position;
            if(convoEntity.components.conversation.currentPhrase[0] == -1){
                for(var i = 0; i < convoEntity.components.conversation.sayables.length/2; i++){
                    if(inBounds(0,convoEntity.components.conversation.sayables[i*2],gameWidth,16,mouseEntityPos.x+24,mouseEntityPos.y+24)){
                        let ce = convoEntity.components.conversation.sayables[i*2+1];
                        for(var e in ce){
                                if((i+1)*2 == convoEntity.components.conversation.sayables.length){
                                    if(ce[e].components.texture.offY < 304) ce[e].components.texture.offY += 304;
                                    convoEntity.components.conversation.selected = i;
                                    selected = true;

                                } else {
                                    convoEntity.components.conversation.selected = i;
                                    selected = true;
                                    if(ce[e].components.texture.offY < 152) ce[e].components.texture.offY += 152;
                                }
                        }
                        break;
                    }
                    convoEntity.components.conversation.selected = -1;
                }
                if(convoEntity.components.conversation.previousSelected != convoEntity.components.conversation.selected){
                    let ce = convoEntity.components.conversation.sayables[convoEntity.components.conversation.previousSelected*2+1];
                    for(var e in ce){
                        if((convoEntity.components.conversation.previousSelected+1)*2 == convoEntity.components.conversation.sayables.length){
                            ce[e].components.texture.offY -= 304;
                        } else {
                            ce[e].components.texture.offY -= 152;
                        }
                    }
                }
                convoEntity.components.conversation.previousSelected = convoEntity.components.conversation.selected;

                if(userInputPosition.up[0] >= 0 && userInputPosition.up[1] >= 0 && convoEntity.components.conversation.selected != -1){
                    convoEntity.components.conversation.currentPhrase[0] = convoEntity.components.conversation.selected;
                }
            } else if(userInputPosition.up[0] >= 0 && userInputPosition.up[1] >= 0){
                console.log(actor);
                deletePlayerSpeech(actor == "player" ? playerEntity : convoEntity.components.conversation.actors[actor]);
                convoEntity.components.conversation.waitTime = 0;
            }else if(convoEntity.components.conversation.waitTime <= 0){
                actor = convo.main[convoEntity.components.conversation.currentPhrase[0]][convoEntity.components.conversation.currentPhrase[1]][convoEntity.components.conversation.currentPhrase[2]*2];
                console.log(convo.main);
                console.log(actor);
                if(typeof actor === 'string'){
                    if(actor == "player"){
                        playerEntity.components.isPlayer.currentSpeech = 
                            new ECS.Assemblages.text(
                                convo.main[convoEntity.components.conversation.currentPhrase[0]]
                                [convoEntity.components.conversation.currentPhrase[1]]
                                [convoEntity.components.conversation.currentPhrase[2]*2+1],
                                0,
                                0,
                                playerEntity);
                    } else {
                        convoEntity.components.conversation.actors[actor].components.area.actorSpeech = 
                            new ECS.Assemblages.text(
                                convo.main[convoEntity.components.conversation.currentPhrase[0]]
                                [convoEntity.components.conversation.currentPhrase[1]]
                                [convoEntity.components.conversation.currentPhrase[2]*2+1],
                                convoEntity.components.conversation.actors[actor].components.area.talkX,
                                convoEntity.components.conversation.actors[actor].components.area.talkY,
                                convoEntity.components.conversation.actors[actor]);
                    }
                }
                    
                    
                    convoEntity.components.conversation.waitTime = 6000;
                    convoEntity.components.conversation.currentPhrase[2]++;

                if(convoEntity.components.conversation.currentPhrase[2] <
                    convo.main[convoEntity.components.conversation.currentPhrase[0]]
                    [convoEntity.components.conversation.currentPhrase[1]].length/2){
                    //Do nothing    
                }else if(convoEntity.components.conversation.currentPhrase[1] < convo.main[convoEntity.components.conversation.currentPhrase[0]].length - 2){
                    convoEntity.components.conversation.currentPhrase[1]++;
                    convoEntity.components.conversation.currentPhrase[2] = 0;
                } else if(convoEntity.components.conversation.currentPhrase[2] >
                    convo.main[convoEntity.components.conversation.currentPhrase[0]]
                    [convoEntity.components.conversation.currentPhrase[1]].length/2){
                    convoEntity.components.conversation.currentPhrase[1] = convo.main[convoEntity.components.conversation.currentPhrase[0]].length - 1;
                    let thisLine = convo.main[convoEntity.components.conversation.currentPhrase[0]][0][1];
                    
                    if(convo.main[convoEntity.components.conversation.currentPhrase[0]][convoEntity.components.conversation.currentPhrase[1]][0] === 0){
                        if(convo.main[convoEntity.components.conversation.currentPhrase[0]][convoEntity.components.conversation.currentPhrase[1]][1] != "none"){
                            convo.main.pop();
                            convo.main.push(...convo[convo.main[convoEntity.components.conversation.currentPhrase[0]][convoEntity.components.conversation.currentPhrase[1]][1]]);
                            convo.main.push(...convo.end);
                        }
                        let action = convo.main[convoEntity.components.conversation.currentPhrase[0]][convoEntity.components.conversation.currentPhrase[1]][2].split(" ");
                        if(action[0]=="remove"){
                            if(action[1] == "thisLine"){
                                for(var j = convo.main.length - 1; j >= 0 ; j--){
                                    if(convo.main[j][0][1] === thisLine){
                                        convo.main.splice(j,1);
                                    }
                                }
                            } else {
                                for(var i = 0; i < convo[action[1]].length; i++){
                                    for(var j = convo.main.length - 1; j >= 0 ; j--){
                                        if(convo.main[j][0][1] === convo[action[1]][i][0][1]){
                                            convo.main.splice(j,1);
                                        }
                                    }
                                }
                            }
                        } else if(action[0] == "over"){
                            thisIsOver = true;
                        }
                    } else if (convo.main[convoEntity.components.conversation.currentPhrase[0]][convoEntity.components.conversation.currentPhrase[1]][0] === 1){
                        //do an actionlist
                    }
                    for(var i = 0; i < convoEntity.components.conversation.sayables.length/2; i++){
                        for(ce in convoEntity.components.conversation.sayables[i*2+1]){
                            convoEntity.components.conversation.sayables[i*2+1][ce].garbageEntity(convoEntity.components.conversation.sayables[i*2+1][ce]);
                        }
                    }
                    convoEntity.components.conversation.previousSelected = -1;
                    convoEntity.components.conversation.sayables = [];
                    convoEntity.components.conversation.currentPhrase[0] = -1;
                    convoEntity.components.conversation.currentPhrase[1] = 0;
                    convoEntity.components.conversation.currentPhrase[2] = 0;
                    convoEntity.components.conversation.waitTime = 0;
                }


            } else if(convoEntity.components.conversation.waitTime > 0){
                convoEntity.components.conversation.waitTime -= ECS.timingEntity.components.timing.delta;
            }
            userInputPosition.up[0] = -1;
            userInputPosition.up[1] = -1;
            userInputPosition.down[0] = -1;
            userInputPosition.down[1] = -1;
            userInputPosition.right[0] = -1;
            userInputPosition.right[1] = -1;
        }
    }
    if(thisIsOver){
        mouseEntity.components.mouse.mode = 0;
        mouseEntity.components.texture.offX = 1*48;
        mouseEntity.components.texture.offY = 0;
        
        mouseEntity.removeFromSystem("conversation","conversation");
        playerEntity.removeFromSystem("conversation","conversation");
        convoEntity.garbageEntity(convoEntity);
    }
}

ECS.systems.conversation.family = {
    all : ["conversation"]
};

ECS.systems.conversation.members = {};

// ECS.systems.text.parse = function parse(str){
//     let unicode = [];
//     let charCode;
//     let width = 0;
//     for(var i = 0; i<str.length; i++){
//         charCode = str.charCodeAt(i);
//         unicode.push(charCode);
//         if([77,87,88,89,90,109,119,120].includes(charCode)){
//             width += 10;
//         } else if ([108,105,73].includes(charCode)){
//             width += 6;
//         } else width += 9;
//     }
//     return unicode.push(width);
// }