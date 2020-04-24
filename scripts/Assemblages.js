/* =========================================================================
 *
 * Assemblages.js
 *  Contains assemblages. Assemblages are essentially entity "templates"
 *
 * ========================================================================= */



ECS.Assemblages = {
    text: function text(str,x,y,talkingEntity){
        if(str.length != 0){
            let horizChars = 32;
            let startOffX = 4;
            let startOffY = 35;
            let entities = [];

            let unicode = [];
            let charCode;
            let width = 0;
            let letterWidth = 0;
            let letterHeight = 16;
            let entity;
            let startX = 0;
            let lastLetterWidth = 0;
            let startY = 0;


            for(var i = 0; i<str.length; i++){
                charCode = str.charCodeAt(i);
                unicode.push(charCode);
                if([77,87,88,89,90,109,119,120].includes(charCode)){
                    width += 10;
                } else if ([108,105,73].includes(charCode)){
                    width += 6;
                } else width += 9;
            }

            if(talkingEntity){
                if(talkingEntity.components.area){
                    if(talkingEntity.components.area.talkX){
                        startX = Math.round(talkingEntity.components.area.talkX + talkingEntity.components.texture.offsetWidth / 2 - width / 2);
                        x = 0;
                    } else startX = talkingEntity.components.isPlayer ? Math.round(talkingEntity.components.position.x - width / 2) : Math.round(talkingEntity.components.position.x + talkingEntity.components.texture.offsetWidth / 2 - width / 2);
                    if(talkingEntity.components.area.talkY){
                        startY = Math.round(talkingEntity.components.area.talkY - 15);
                        y = 0;
                    } else startY = talkingEntity.components.isPlayer ? Math.round(talkingEntity.components.position.y - talkingEntity.components.size.height)  : Math.round(talkingEntity.components.position.y - 15);
                } else {
                    startX = talkingEntity.components.isPlayer ? Math.round(talkingEntity.components.position.x - width / 2) : Math.round(talkingEntity.components.position.x + talkingEntity.components.texture.offsetWidth / 2 - width / 2);
                    startY = talkingEntity.components.isPlayer ? Math.round(talkingEntity.components.position.y - talkingEntity.components.size.height)  : Math.round(talkingEntity.components.position.y - 15);
                }
            } else {
                startX = Math.round((gameWidth - width) / 2);
                startY = 0;
            }
            
            if(startX + width > gameWidth){
                startX -= startX + width - gameWidth; 
            }
            if(startX < 0) startX = 0;

            for(var u in unicode){
                entity = new ECS.Entity();
                if([77,87,88,89,90,109,119,120].includes(unicode[u])){
                    letterWidth = 9;
                } else if ([108,105,73].includes(unicode[u])){
                    letterWidth = 6;
                } else letterWidth = 9;
                if([103,106,112,113,121].includes(unicode[u])){
                    letterHeight = 16;
                } else letterHeight = 15;

                entity.addComponent(new ECS.Components.Texture({
                    texture: ECS.TextureHlp.getTextureByName("resources/font1.png"),
                    offsetWidth: letterWidth,
                    offsetHeight: letterHeight,
                    offX : startOffX + unicode[u] * 9 - Math.floor(unicode[u]/horizChars) * horizChars * 9 - 9 + (letterWidth == 6 ? 3: 0),
                    offY: startOffY + (Math.floor(unicode[u]/horizChars) - 1) * 16,
                }));

                startX += lastLetterWidth;
                
                entity.addComponent(new ECS.Components.Position({
                    x: startX+x,
                    y: startY + y,
                    layer: 3000
                }));

                lastLetterWidth = letterWidth;

                if(talkingEntity){
                    entity.addComponent(new ECS.Components.Animated({
                        delay: 6000,
                        repeat: 1,
                        stopRenderOnceDone: true
                    }));
                }

                ECS.systems.render.members[entity.id] = entity;
                entity.memberOf.push(ECS.systems.render.name);

                if(talkingEntity){
                    ECS.systems.animated.members[entity.id] = entity;
                    entity.memberOf.push(ECS.systems.animated.name);
                }

                entities.push(entity);
            }
            console.log(entities);
            return entities;
        }
    },
    inventory: function inventory(playerEntity){
        let entities = [];
        let entity;

        //Area that will block everything
        entity = new ECS.Entity(true);
        entity.addComponent(new ECS.Components.Position({
            layer: 2500
        }));
        entity.addComponent(new ECS.Components.Size({
            width: gameWidth,
            height: gameHeight
        }))
        entity.addComponent(new ECS.Components.Area({

        }));
        ECS.systems.mouse.members[entity.id] = entity;
        entity.memberOf.push(ECS.systems.mouse.name);
        entities.push(entity);

        entity = new ECS.Entity(true);
        entity.addComponent(new ECS.Components.Position({
            x: 30,
            y: 30,
            layer: 2501
        }));
        entity.addComponent(new ECS.Components.Size({
            width: 740,
            height: 540
        }))
        entity.addComponent(new ECS.Components.Area({

        }));
        entity.addComponent(new ECS.Components.Texture({
            texture: ECS.TextureHlp.getTextureByName("resources/inventoryBackgrounddreamStateBob.png")
        }));
        ECS.systems.mouse.members[entity.id] = entity;
        entity.memberOf.push(ECS.systems.mouse.name);
        ECS.systems.render.members[entity.id] = entity;
        entity.memberOf.push(ECS.systems.render.name);
        entities.push(entity);

        let items = playerEntity.components.isPlayer.playerData[playerEntity.components.isPlayer.charName].ownedItems;

        for(var i = 0; i < items.length; i++){
            entity = new ECS.Assemblages.Items[items[i]](2502);
            let iPosX = -((Math.floor(i / 11) * 11) * 60);
            let iPosY = Math.floor(i / 11) * 60;
            entity.components.position.x = iPosX + (gameWidth - (11*48+10*12))/2 + i * 48 + (i > 0 ? i * 12 : 0);
            entity.components.position.y = iPosY + (gameHeight - (8*48+7*12))/2;
            ECS.systems.mouse.members[entity.id] = entity;
            entity.memberOf.push(ECS.systems.mouse.name);
            ECS.systems.render.members[entity.id] = entity;
            entity.memberOf.push(ECS.systems.render.name);
            entities.push(entity);
        }

        return entities;
    },

};
//new ECS.Assemblages.CollisionRect();

ECS.Assemblages.Items = {
    // Each assemblage creates an entity then returns it. The entity can 
    // then have components added or removed - this is just like a helper
    // factory to create objects which can still be modified

    axe1: function axe1(layer){
        entity = new ECS.Entity(true);
        entity.addComponent(new ECS.Components.Texture({
            texture: ECS.TextureHlp.getTextureByName("resources/iconAxe.png")
        }));
        entity.addComponent(new ECS.Components.Size({width:48,height:48}));
        entity.addComponent(new ECS.Components.Position({layer:layer}));
        entity.addComponent(new ECS.Components.Area({
            lookable: "Could cut trees!",
            areaName: "axe",
            intName: "axe1",
            takeable: "axe1",
            inventoryItem: true
        }));
        entity.addComponent(new ECS.Components.Item({
            useWith: ["blockingTree"],
            defaultSay: "Can't cut this."
        }));
        return entity;
    }

};

ECS.Assemblages.Conversations = {
    blockingTreedreamStateBob:{
        isNew: true,
        start: [[["player","Hi"],["blockingTree","Hello!","axe1","how you?"],[0,"b1","remove thisLine"]]],
        b1: [
            [["axe1","Oh, doing fine!"],["blockingTree","Great!","blockingTree","Tell me about your day"],[0,"myDay","remove b1"]],
            [["axe1","Not so great..."],["blockingTree","Oh, what's wrong?"],[0,"wrong","remove b1"]]
            ],

        myDay:[
            [["player","Today is the day!","player","Today I'm getting out of here!"],["blockingTree","..."],[0,"none","remove thisLine"]],
            [["player","The sky is gray, it's great!"],["axe1","Yeah sure..."],[0,"none","remove thisLine"]]
            ],

        wrong:[
            [["player","I don't care about you"],["blockingTree","Screw you too"],[0,"none","remove thisLine"]]
            ],

        end:[[["player","Noice!"],["blockingTree","Totally"],[0,"none","over"]]],
        main: []
    }
}

ECS.Assemblages.Levels = {
    treeNAxe: function treeNAxe(playerEntity,warpX,warpY){
        console.log("Loading");
        let entity;
        let entities = [];
        if(warpX && warpY){
            playerEntity.components.position.x = warpX;
            playerEntity.components.position.y = warpY;
        }
        //Background
        entity = new ECS.Entity();
        entity.addComponent( new ECS.Components.Texture({texture:ECS.TextureHlp.getTextureByName("resources/background.png")}));
        entity.addComponent( new ECS.Components.Position({layer:1}));
        entity.addComponent( new ECS.Components.Size({width:800,height:600}));
        entities.push(entity);

        //Blocking sky
        entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Position({layer:1}));
        entity.addComponent(new ECS.Components.Size({width:800,height:300}));
        entity.addComponent(new ECS.Components.Area({
            blocking: true,
            lookable: "Gray sky today...",
            areaName: "sky",
            itemReactions: {
                axe1: "It's the sky! I know it's thick but come on!"
            }
        }));
        entities.push(entity);

        //Axe on ground
        if(playerEntity.components.isPlayer.playerData.flags.indexOf("axe1Taken") == -1){
            entity = new ECS.Entity();
            entity.addComponent(new ECS.Components.Texture({
                texture: ECS.TextureHlp.getTextureByName("resources/axe.png")
            }));
            entity.addComponent(new ECS.Components.Size({width:140,height:100}));
            entity.addComponent(new ECS.Components.Position({x:50,y:450,layer:entity.components.size.height+450}));
            entity.addComponent(new ECS.Components.Area({
                blocking: false,
                lookable: "That is hell of an axe!",
                takeable: "axe1",
                walkable: false,
                areaName: "axe",
                intName: "axe1",
                takeX: 220,
                takeY: 560
            }));
            entities.push(entity);
        }

        //blockingTree
        if(playerEntity.components.isPlayer.playerData.flags.indexOf("treeCut") == -1){
            entity = new ECS.Entity();
            entity.addComponent(new ECS.Components.Texture({
                texture: ECS.TextureHlp.getTextureByName("resources/tree.png")
            }));
            entity.addComponent(new ECS.Components.Size({
                width: 350,
                height: 440,
                sizes: {1:{x:0,y:0,width:350,height:160},2:{x:30,y:160,width:320,height:110},3:{x:140,y:270,width:90,height:170}}
            }));
            entity.addComponent(new ECS.Components.Position({
                x: 450,
                y: 0,
                layer: entity.components.size.height
            }));
            entity.addComponent(new ECS.Components.Area({
                blocking: true,
                lookable: "That tree's blocking my way!",
                walkable: false,
                areaName: "tree",
                useable: ["Hug", "hugBlockingTree"],
                intName: "blockingTree",
                talkable: ["blockingTree","blockingTree","axe1"],
                itemReactions: {
                    axe1: "Yeah sure. But it's not implemented yet."
                },
                talkX: 300,
                talkY: 150,
            }));
            entities.push(entity);
        //Tree stump
        } else {
            entity = new ECS.Entity();
            entity.addComponent(new ECS.Components.Texture({
                texture: ECS.TextureHlp.getTextureByName("resources/treeStump.png")
            }));
            entity.addComponent(new ECS.Components.Size({
                width: 350,
                height: 440,
                sizes: {1:{x:140,y:350,width:100,height:90}}

            }));
            entity.addComponent(new ECS.Components.Position({
                x: 450,
                y: 0,
                layer: entity.components.texture.texture.height
            }));
            entity.addComponent(new ECS.Components.Area({
                blocking: false,
                lookable: "Blocking my way no more!",
                walkable: false,
                areaName: "tree stump",
                intName: "treeStump",
                itemReactions: {
                    axe1: "I think I did enough."
                }
            }));
            entities.push(entity);
        }

        //Blocking thing to test A*
        entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Size({
            width: 30,
            height: 200
        }));
        entity.addComponent(new ECS.Components.Position({
            x: 310,
            y: 350,
            layer: 600
        }));
        entity.addComponent(new ECS.Components.Area({
            blocking: true
            }
        ));
        entities.push(entity);

        //Warp to beach
        entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Size({
            width: 30,
            height: 300
        }));
        entity.addComponent(new ECS.Components.Position({
            x: 0,
            y: 300,
            layer: 600
        }));
        entity.addComponent(new ECS.Components.Area({
            areaName: "beach",
            walkable: {
                warpLevel: "dreamBeach",
                warpLevelX: 750,
                warpLevelY: false
            }
        }));
        entities.push(entity);

        ECS.astarGrid = new Graph(createGrid(entities), { diagonal: true });

        ECS.allSystems.forEach(function(system) {system.members = ECS.Family.getEntities(system.family,system);});
        ECS.systems.render.members = ECS.Family.getEntities(ECS.systems.render.family,ECS.systems.render);

        return entities;
    },
    dreamBeach: function dreamBeach(playerEntity,warpX,warpY){
        let entity;
        let entities = [];
        // playerEntity.components.isPlayer.playerData[playerEntity.components.isPlayer.playerData.currentCharacter].currentLevel = "dreamBeach";
        if(warpX && warpY){
            playerEntity.components.position.x = warpX;
            playerEntity.components.position.y = warpY;
        }
        //Background
        entity = new ECS.Entity();
        entity.addComponent( new ECS.Components.Texture({texture:ECS.TextureHlp.getTextureByName("resources/background.png")}));
        entity.addComponent( new ECS.Components.Position({layer:1}));
        entity.addComponent( new ECS.Components.Size({width:800,height:600}));
        entities.push(entity);

        //Blocking sky
        entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Position({layer:1}));
        entity.addComponent(new ECS.Components.Size({width:800,height:300}));
        entity.addComponent(new ECS.Components.Area({
            blocking: true,
            lookable: "Gray sky today...",
            areaName: "sky",
            itemReactions: {
                axe1: "It's the sky! I know it's thick but come on!"
            }
        }));
        entities.push(entity);

        //Warp to tree
        entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Size({
            width: 30,
            height: 300
        }));
        entity.addComponent(new ECS.Components.Position({
            x: 770,
            y: 300,
            layer: 600
        }));
        entity.addComponent(new ECS.Components.Area({
            walkable: {
                warpLevel: "treeNAxe",
                warpLevelX: 30,
                warpLevelY: false
            }
        }));
        entities.push(entity);

        ECS.astarGrid = new Graph(createGrid(entities), { diagonal: true });

        ECS.allSystems.forEach(function(system) {system.members = ECS.Family.getEntities(system.family,system);});
        ECS.systems.render.members = ECS.Family.getEntities(ECS.systems.render.family,ECS.systems.render);

        return entities;
    },
    bedroom: function bedroom(playerEntity,warpX,warpY){
        let entity;
        let entities = [];
        // playerEntity.components.isPlayer.playerData[playerEntity.components.isPlayer.playerData.currentCharacter].currentLevel = "dreamBeach";
        if(warpX && warpY){
            playerEntity.components.position.x = warpX;
            playerEntity.components.position.y = warpY;
        }
        //Background
        

    }
}

ECS.Assemblages.Players = {
    dreamStateBob: function dreamStateBob(playerEntity){
        playerEntity.components.isPlayer.charName = "dreamStateBob";

        playerEntity.addComponent(new ECS.Components.Texture({
            texture:ECS.TextureHlp.getTextureByName("resources/character.png"),
            offsetWidth: 215
        }));

        playerEntity.addComponent(new ECS.Components.Size({
            width:215,
            height:287}));

        playerEntity.addComponent(new ECS.Components.Position({
            x:playerEntity.components.isPlayer.playerData.dreamStateBob.position.x,
            y:playerEntity.components.isPlayer.playerData.dreamStateBob.position.y,
            layer:playerEntity.components.size.height+playerEntity.components.isPlayer.playerData.dreamStateBob.position.y}));
    }
};

ECS.Assemblages.Textures = {
    bedroom: [
        "resouces/bedroom/bedroomBackground.png",
        "resouces/bedroom/bedroomBed.png",
        "resouces/bedroom/bedroomCarpet1.png",
        "resouces/bedroom/bedroomClock.png",
        "resouces/bedroom/bedroomDoor.png",
        "resouces/bedroom/bedroomForefront.png",
        "resouces/bedroom/bedroomLamp.png",
        "resouces/bedroom/bedroomTable1.png",
        "resouces/bedroom/bedroomTable2.png",
    ],
    dreamBeach: [],
    dreamCavernEntrance: [],
}