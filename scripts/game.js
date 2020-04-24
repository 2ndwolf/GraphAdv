ECS.Game = function Game(){
    var self = this;

    var entities = {}; // object containing { id: entity  }
    var entity;
    let playerEntity;

    //Load textures accordingly to savegame

    //Timing
    entity = new ECS.Entity(true);
    entity.addComponent( new ECS.Components.Timing());
    entities[entity.id] = entity;
    ECS.timingEntity = entity;

    //character
    entity = new ECS.Entity();
    entity.addComponent(new ECS.Components.IsPlayer({
        charName: "dreamStateBob"
    }));


    playerEntity = entity;
    ECS.playerEntity = playerEntity;

    //mouse
    entity = new ECS.Entity(true);
    entity.addComponent(new ECS.Components.Position({x:50,y:50,layer:5000}));
    entity.addComponent( new ECS.Components.Size({width:48,height:48}));
    entity.addComponent(new ECS.Components.Mouse({}));
    entity.addComponent(new ECS.Components.Texture({
        texture: ECS.TextureHlp.getTextureByName("resources/mouseicons.png"),
        offX: entity.components.mouse.activeIcon*48,
        offsetWidth: 48,
        offsetHeight: 48}));
    entities[entity.id] = entity;
    for(var m in entity.components.mouse.mouseText){
        entities[entity.components.mouse.mouseText[m].id] = entity.components.mouse.mouseText[m];
    }

    //inventoryIcon
    entity = new ECS.Entity(true);
    entity.addComponent(new ECS.Components.Texture({
        texture: ECS.TextureHlp.getTextureByName("resources/inventoryIcon.png")
    }));
    entity.addComponent(new ECS.Components.Size({
        width: 48,
        height: 48
    }));
    entity.addComponent(new ECS.Components.Inventory({

    }));
    entity.addComponent(new ECS.Components.Position({
        x: 24,
        y: gameHeight - 72,
        layer: 1000
    }));
    entity.addComponent(new ECS.Components.Area({
        areaName: "inventory"
    }));




    //Some text
    // let cats = 
    // for(var c in cats){
    //     entities[cats[c].id] = cats[c];
    // }
    // console.log(ECS.systems.render.members);

    // store reference to entities
    //ECS.entities = entities;

    ECS.allSystems = [
        ECS.systems.mouse,
        ECS.systems.animated,
        ECS.systems.flashing,
        ECS.systems.movement,
        ECS.systems.actionLists,
        ECS.systems.conversation,
    ];

    ECS.families = [];
    var result = document.cookie.match(new RegExp("n=([^;]+)"));
    if(result) ECS.playerEntity.components.isPlayer.playerData = JSON.parse(result[1]);

    // this is where I load the cookie

    if(ECS.playerEntity.components.isPlayer.playerData){
        let currentCharacter = playerEntity.components.isPlayer.playerData.currentCharacter;
        let currentLevel = playerEntity.components.isPlayer.playerData[currentCharacter].currentLevel;
        ECS.Assemblages.Players[currentCharacter](playerEntity);
        ECS.currentLevel = ECS.Assemblages.Levels[currentLevel](playerEntity);
    } else {
        playerEntity.components.isPlayer.playerData = {dreamStateBob:{
            conversations:{

            },
            ownedItems:[

            ],
            position:{
                x: 50,
                y: 327,
            },
            currentLevel: "treeNAxe"
        },
        flags:[

        ],
        currentCharacter: "dreamStateBob",
        };
        let currentCharacter = playerEntity.components.isPlayer.playerData.currentCharacter;
        let currentLevel = playerEntity.components.isPlayer.playerData[currentCharacter].currentLevel;
        ECS.Assemblages.Players[currentCharacter](playerEntity);
        ECS.currentLevel = ECS.Assemblages.Levels[currentLevel](playerEntity);
    }

    function gameLoop (time){
        if(consoleOn){
            fpsDisplay.textContent = Math.round(ECS.timingEntity.components.timing.fps) + ' FPS';
            mousePos.textContent = "X: " + userInputPosition.x + ", Y: " + userInputPosition.y;
        }
        if(time < ECS.timingEntity.components.timing.frameTime + ECS.timingEntity.components.timing.timeStep){
            requestAnimationFrame(gameLoop);
            return;
        }

        ECS.timingEntity.components.timing.delta += time - ECS.timingEntity.components.timing.frameTime;
        ECS.timingEntity.components.timing.frameTime = time;

        if (time > ECS.timingEntity.components.timing.lastFpsUpdate + 1000) { // update every second
            ECS.timingEntity.components.timing.fps = 0.25 * ECS.timingEntity.components.timing.framesThisSecond + (1 - 0.25) * ECS.timingEntity.components.timing.fps; // compute the new FPS
     
            ECS.timingEntity.components.timing.lastFpsUpdate = time;
            ECS.timingEntity.components.timing.framesThisSecond = 0;
        }
        ECS.timingEntity.components.timing.framesThisSecond++;

        let numUpdateSteps = 0;
        // Simple game loop
        while(ECS.timingEntity.components.timing.delta >= ECS.timingEntity.components.timing.timeStep){
            for(var i=0,len=ECS.allSystems.length; i < len; i++){
                // Call the system and pass in entities
                // NOTE: One optimal solution would be to only pass in entities
                // that have the relevant components for the system, instead of 
                // forcing the system to iterate over all entities
                ECS.allSystems[i](ECS.allSystems[i].members);
            }
            ECS.timingEntity.components.timing.delta -= ECS.timingEntity.components.timing.timeStep;
                    // Sanity check
            if (++numUpdateSteps >= 240) {
                ECS.timingEntity.components.timing.delta = 0; // fix things
                //snap the player to the authoritative state
                break; // bail out
            }
        }
        
        ECS.systems.render(ECS.systems.render.members);
        // Run through the systems. 
        // continue the loop
        // if(self._running !== false){
            requestAnimationFrame(gameLoop);
        // }
    }
    // Kick off the game loop
    requestAnimationFrame(gameLoop);
}

ECS.Game.scriptsLoaded = function scriptsLoaded() {
    bScriptsLoaded = true;
    if (consoleOn) console.log("Scripts loaded");
    ECS.TextureHlp.loadTextures(["resources/axe.png",
                                "resources/background.png",
                                "resources/character.png",
                                "resources/tree.png",
                                "resources/treeStump.png",
                            "resources/mouseicons.png",
                            "resources/icons/axe1.png",
                            "resources/font1.png",
                            "resources/inventoryIcon.png",
                            "resources/inventoryBackgrounddreamStateBob.png"]);
}

ECS.Game.texturesReady = function texturesReady(){
    bTexturesReady = true;
    if (consoleOn) console.log("Textures ready");
    ECS.game = new ECS.Game();
}

/*
function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) {
        started = true;
        frameID = requestAnimationFrame(function(timestamp) {
            draw(1);
            running = true;
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
            frameID = requestAnimationFrame(mainLoop);
        });
    }
}
*/