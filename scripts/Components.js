ECS.Components.Position = function ComponentPosition ( params ){
    params = params || {};

    this.x = params.x || 0;
    this.y = params.y || 0;
    this.lastX = params.x || 0;
    this.lastY = params.y || 0;

    this.layer = params.layer || -1;

    return this;
};

ECS.Components.Position.prototype.name = 'position';

ECS.Components.Texture = function ComponentTexture (params){
    this.texture = params.texture;

    this.offX = params.offX || 0;
    this.offY = params.offY || 0;

    this.xScale = params.xScale || 1;
    this.yScale = params.yScale || 1;

    this.offsetWidth = params.offsetWidth || params.texture.width;
    this.offsetHeight = params.offsetHeight || params.texture.height;

    this.hidden = params.hidden || false;

    return this;
};

ECS.Components.Texture.prototype.name = "texture";

//Do I need a size component
ECS.Components.Size = function ComponentSize (params){
    this.width = params.width;
    this.height = params.height;
    this.sizes = params.sizes || false;
    // this.x = params.x || 0;
    // this.y = params.y || 0;
    // this.sizes = params.sizes || {};

    return this;
};

ECS.Components.Size.prototype.name = "size";

ECS.Components.Mouse = function ComponentMouse(params){
    params = params || {};

    this.down = [-1,-1];
    this.up = [-1,-1];
    this.right = [-1,-1];
    this.clickDown = false;
    this.clickUp = false;
    this.rightClick = false;
    this.activeIcon = 4;
    this.isActive = 0;
    this.currentItem = false; //expect an entity? or a texture? ex:ECS.TextureHlp.getTextureByName("resources/axe.png")
    this.texture = ECS.TextureHlp.getTextureByName("resources/mouseicons.png");
    this.mouseText = new ECS.Assemblages.text("Walk to",0,0);
    this.mouseOverText = [];
    this.previousArea = false;
    this.newItem = false;
    this.mode = params.mode || 0;
}

ECS.Components.Mouse.prototype.name = "mouse";

ECS.Components.MovesAround = function ComponentMovesAround(params){
    this.currX = params.currX;
    this.currY = params.currY;
    this.dstX = params.dstX;
    this.dstY = params.dstY;
    this.speed = params.speed;
    this.movesToTake = params.movesToTake || false; //expect an entity
    this.astar = params.astar || false;
}

ECS.Components.MovesAround.prototype.name = "movesAround";

ECS.Components.IsPlayer = function ComponentIsPlayer(params){
    params = params || {};

    this.isPlayer = true;
    this.ownedItems = params.ownedItems || [];
    this.currentSpeech = [];

    this.playerData = params.playerData || false;
    this.charName = params.charName || false;

}

ECS.Components.IsPlayer.prototype.name = "isPlayer";

ECS.Components.Area = function componentArea(params){
    params = params || {};
    this.blocking = params.blocking || false; //expect a boolean
    this.lookable = params.lookable || false; //expect a string
    this.takeable = params.takeable || false; //expect a string for the name of the takeable as posited in the takeable component
    this.useable = params.useable || false; //expect an array -> actionName for mouse, actionName for actionlists
    this.talkable = params.talkable || false; //expect an array -> convoName, actors
    this.walkable = params.walkable || false; //expect a boolean
    this.areaName = params.areaName || false; //expect a string
    this.intName = params.intName || "noName"; //expect a string
    this.itemReactions = params.itemReactions || false;
    this.takeX = params.takeX || false;
    this.takeY = params.takeY || false;
    this.talkX = params.talkX || 0;
    this.talkY = params.talkY || 0;
    this.inventoryItem = params.inventoryItem || false;
    this.actorSpeech = [];
}

ECS.Components.Area.prototype.name = "area";

ECS.Components.Inventory = function componentInventory(params){
    this.inventoryEntities = [];
};

ECS.Components.Inventory.prototype.name = "inventory";

ECS.Components.Timing = function componentTiming(){
    this.delta = 0;
    this.frameTime = 0;
    this.maxFPS = 60;
    this.timeStep = 1000/90;
    this.framesThisSecond = 0;
    this.lastFpsUpdate = 0;
    this.fps = 0;

}

ECS.Components.Timing.prototype.name = "timing";


ECS.Components.Animated = function componentAnimated(params){
    this.intName = params.intName || "noNameAnimation";
    this.time = params.delay || 100;
    this.delay = params.delay || 100;
    this.running = true;
    this.offX = params.offX || 0;
    this.offY = params.offY || 0;
    this.repeat = params.repeat || -1; // -1 = infinite loop
    this.horizFrames = params.entity ? (params.entity.components.texture.texture.width / (params.offX ? params.offX : 1)) : 1;
    this.vertFrames = params.entity ? (params.entity.components.texture.texture.height / (params.offY ? params.offY : 1)) : 1;
    this.frames =  params.frames || this.horizFrames * this.vertFrames;
    this.currentFrame = params.currentFrame || 0;
    this.walkCycle = params.walkCycle || false;
    this.stopRenderOnceDone = params.stopRenderOnceDone || false;
}

ECS.Components.Animated.prototype.name = "animated";

ECS.Components.Flashing = function componentFlashing(params){
    // this.linkedTo = ECS.entities[params.entity.id];
    this.time = params.delay || 100;
    this.delay = params.delay || 100;
    this.repeat = params.repeat || 0; // -1 = infinite loop
}

ECS.Components.Flashing.prototype.name = "flashing";

ECS.Components.Item = function componentItem(params){
    params = params || {};
    this.useWith = params.useWith || []; //array of strings
    this.defaultSay = params.defaultSay || "I'd rather not.";
}

ECS.Components.Item.prototype.name = "item";

ECS.Components.Useable = function componentUseable(params){
    params = params || {};
    this.actions = params.actions;// || consoleOn ? console.log("Missing action parameters") : false;
    this.entities = params.entities;// || consoleOn ? console.log("Missing entity parameters") : false;
    this.done = 0;
    this.doing = [];
    this.dstX = params.dstX || false;
    this.dstY = params.dstY || false;
    this.options = params.options || {
        //warpLevel:
        //warpLevelX:
        //warpLevelY:
    };
};

ECS.Components.Useable.prototype.name = "useable";

ECS.Components.Conversation = function componentConversation(params){
    if(params.playerEntity.components.isPlayer.playerData[params.playerEntity.components.isPlayer.charName].conversations[params.conversation]){
        this.conversation = params.conversation;
    } else {
        params.playerEntity.components.isPlayer.playerData[params.playerEntity.components.isPlayer.charName].conversations[params.conversation] = ECS.Assemblages.Conversations[params.conversation];
        this.conversation = params.conversation;
    }
    
    this.otherChars = params.otherChars;
    this.sayables = [];
    this.waitTime = 0;
    this.selected = -1;
    this.previousSelected = -1;
    this.currentPhrase = [-1,0,0];
};

ECS.Components.Conversation.prototype.name = "conversation";