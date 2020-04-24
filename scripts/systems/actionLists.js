ECS.systems.actionLists = function systemActionLists(ent){
    for(var e in ent){
        if(ent[e].components.useable){
            if(ent[e].components.useable.doing.length > 0){
                for(var i = ent[e].components.useable.doing.length/2 - 1; i >= 0; i--){
                    if(!ECS.systems[ent[e].components.useable.doing[i*2]].members[ent[e].components.useable.doing[i*2+1]]){
                        ent[e].components.useable.doing.splice(i*2, 2);
                    }
                }
            }
            // console.log(ent[e].components.useable.doing);
            if(ent[e].components.useable.actions == "take"){
                if(ent[e].components.useable.done === 0){
                    ent[e].components.useable.entities.playerEntity.addComponent(new ECS.Components.MovesAround({
                        currX: ent[e].components.useable.entities.playerEntity.components.position.x,
                        currY: ent[e].components.useable.entities.playerEntity.components.position.y,
                        dstX: ent[e].components.useable.entities.hoveringArea.components.area.takeX ? ent[e].components.useable.entities.hoveringArea.components.area.takeX : ent[e].components.useable.entities.playerEntity.components.position.x,
                        dstY: ent[e].components.useable.entities.hoveringArea.components.area.takeY ? ent[e].components.useable.entities.hoveringArea.components.area.takeY : ent[e].components.useable.entities.playerEntity.components.position.y,
                        speed: .15,
                        astar: true,
                    }));
                    ECS.systems.movement.members[ent[e].components.useable.entities.playerEntity.id] = ent[e].components.useable.entities.playerEntity;
                    ent[e].components.useable.doing.push("movement");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.playerEntity.id);

                    ent[e].components.useable.entities.playerEntity.addComponent(new ECS.Components.Animated({
                        intName: "walkCyclePlayer1",
                        delay: 400,
                        offX: 215,
                        entity: ent[e].components.useable.entities.playerEntity,
                        frames: 4,
                        walkCycle: true
                    }));
                    ECS.systems.animated.members[ent[e].components.useable.entities.playerEntity.id] = ent[e].components.useable.entities.playerEntity;
                    ent[e].components.useable.doing.push("animated");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.playerEntity.id);

                    ent[e].components.useable.done++;
                } else if(ent[e].components.useable.done == 1 && ent[e].components.useable.doing.length == 0){
                    let item = new ECS.Assemblages.Items[ent[e].components.useable.entities.hoveringArea.components.area.takeable](5000);
                    ent[e].components.useable.entities.playerEntity.components.isPlayer.playerData[ent[e].components.useable.entities.playerEntity.components.isPlayer.charName].ownedItems.push(ent[e].components.useable.entities.hoveringArea.components.area.takeable);
                    ent[e].components.useable.entities.mouseEntity.components.mouse.currentItem = item;
                    ent[e].components.useable.entities.mouseEntity.components.mouse.newItem = true;
                    ent[e].components.useable.entities.playerEntity.components.isPlayer.playerData.flags.push(item.components.area.intName + "Taken");

                    ent[e].components.useable.entities.hoveringArea.garbageEntity(ent[e].components.useable.entities.hoveringArea);
                }
            }
            //Taking from the inventory
            else if (ent[e].components.useable.actions == "takeInventory"){
                let item = new ECS.Assemblages.Items[ent[e].components.useable.entities.hoveringArea.components.area.takeable](5000);
                ent[e].components.useable.entities.mouseEntity.components.mouse.currentItem = item;
                ent[e].components.useable.entities.mouseEntity.components.mouse.newItem = true;

                delete ECS.systems.actionLists.members[ent[e].components.useable.entities.hoveringArea.id];
            }
            //handling warping
            else if(ent[e].components.useable.actions == "walkWarp"){
                if(ent[e].components.useable.done === 0){
                    ent[e].components.useable.entities.playerEntity.addComponent(new ECS.Components.MovesAround({
                        currX: ent[e].components.useable.entities.playerEntity.components.position.x,
                        currY: ent[e].components.useable.entities.playerEntity.components.position.y,
                        dstX: ent[e].components.useable.dstX,
                        dstY: ent[e].components.useable.dstY,
                        speed: .15,
                        astar: true
                    }));
                    ECS.systems.movement.members[ent[e].components.useable.entities.playerEntity.id] = ent[e].components.useable.entities.playerEntity;
                    ent[e].components.useable.doing.push("movement");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.playerEntity.id);

                    ent[e].components.useable.entities.playerEntity.addComponent(new ECS.Components.Animated({
                        intName: "walkCyclePlayer1",
                        delay: 400,
                        offX: 215,
                        entity: ent[e].components.useable.entities.playerEntity,
                        frames: 4,
                        walkCycle: true
                    }));
                    ECS.systems.animated.members[ent[e].components.useable.entities.playerEntity.id] = ent[e].components.useable.entities.playerEntity;
                    ent[e].components.useable.doing.push("animated");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.playerEntity.id);

                    ent[e].components.useable.done++;

                } else if(ent[e].components.useable.done == 1 && ent[e].components.useable.doing.length == 0){
                    let keepers = ent[e];
                    console.log(ECS.textures);
                    for(var i = ECS.currentLevel.length - 1; i >= 0; i--){
                        // if(ECS.currentLevel[i].id != ent[e].id){
                            if(ECS.currentLevel[i].components.texture){
                                ECS.TextureHlp.deleteTextureByName(ECS.currentLevel[i].components.texture.texture.name);
                            }
                            ECS.currentLevel[i].garbageEntity(ECS.currentLevel[i]);
                            // delete ECS.currentLevel[i];
                        // }
                            
                    }
                    console.log(ECS.textures);
                    ent[e] = keepers;
                    ECS.currentLevel = [];
                    ECS.currentLevel = ECS.Assemblages.Levels[ent[e].components.useable.options.warpLevel](ent[e].components.useable.entities.playerEntity,ent[e].components.useable.options.warpLevelX,ent[e].components.useable.options.warpLevelY);
                    ent[e].garbageEntity(ent[e]);
                }
            }
            //Actions for cutting the tree with the axe
            else if(ent[e].components.useable.actions == "blockingTreeaxe1"){
                if(ent[e].components.useable.done === 0){

                    ent[e].components.useable.entities.playerEntity.addComponent(new ECS.Components.MovesAround({
                        currX: ent[e].components.useable.entities.playerEntity.components.position.x,
                        currY: ent[e].components.useable.entities.playerEntity.components.position.y,
                        dstX: 550,
                        dstY: 440,
                        speed: .15,
                        astar: true,
                    }));
                    ECS.systems.movement.members[ent[e].components.useable.entities.playerEntity.id] = ent[e].components.useable.entities.playerEntity;
                    ent[e].components.useable.doing.push("movement");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.playerEntity.id);

                    ent[e].components.useable.entities.playerEntity.addComponent(new ECS.Components.Animated({
                        intName: "walkCyclePlayer1",
                        delay: 400,
                        offX: 215,
                        entity: ent[e].components.useable.entities.playerEntity,
                        frames: 4,
                        walkCycle: true
                    }));
                    ECS.systems.animated.members[ent[e].components.useable.entities.playerEntity.id] = ent[e].components.useable.entities.playerEntity;
                    ent[e].components.useable.doing.push("animated");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.playerEntity.id);

                    ent[e].components.useable.done++;

                } else if (ent[e].components.useable.done == 1 && ent[e].components.useable.doing.length == 0){
                    ent[e].components.useable.entities.hoveringArea.addComponent(new ECS.Components.Flashing({
                        delay: 300,
                        repeat: 20
                    }))
                    ECS.systems.flashing.members[ent[e].components.useable.entities.hoveringArea.id] = ent[e].components.useable.entities.hoveringArea;
                    ent[e].components.useable.doing.push("flashing");
                    ent[e].components.useable.doing.push(ent[e].components.useable.entities.hoveringArea.id);

                    let entity = new ECS.Entity();
                    entity.addComponent(new ECS.Components.Texture({
                        texture: ECS.TextureHlp.getTextureByName("resources/treeStump.png")
                    }));
                    entity.addComponent(new ECS.Components.Size({
                        width: 347,
                        height: 441,
                        sizes: {1:{x:140,y:350,width:100,height:90}}
                    }));
                    entity.addComponent(new ECS.Components.Position({
                        x: 453,
                        y: 0,
                        layer: ent[e].components.useable.entities.hoveringArea.components.size.height - 1
                    }));
                    entity.addComponent(new ECS.Components.Area({
                        blocking: true,
                        lookable: "Blocking my way no more!",
                        walkable: false,
                        areaName: "tree stump",
                        intName: "treeStump",
                        itemReactions: {
                            axe1: "I think I did enough."
                        }
                    }));
                    ECS.systems.render.members[entity.id] = entity;
                    ECS.systems.mouse.members[entity.id] = entity;
                

                    ent[e].components.useable.done++;

                } else if (ent[e].components.useable.done == 2 && ent[e].components.useable.doing.length == 0){
                    // ent[e].components.useable.entities.itemEntity.garbageEntity(ent[e].components.useable.entities.itemEntity,ent[e].components.useable.entities.mouseEntity)
                    ent[e].components.useable.entities.playerEntity.components.isPlayer.playerData.flags.push("treeCut");
                    ent[e].components.useable.entities.hoveringArea.garbageEntity(ent[e].components.useable.entities.hoveringArea);
                }
        

            } else if (ent[e].components.useable.actions == "hugBlockingTree"){
                console.log("Hugging tree");
                delete ECS.systems.actionLists.members[ent[e].components.useable.entities.hoveringArea.id];
            } else if (ent[e].components.useable.actions == "somethingelse"){
                //do something else
            }
        }
    }
};

ECS.systems.actionLists.family = {
    all : ["useable"]
};

ECS.systems.actionLists.members = {};