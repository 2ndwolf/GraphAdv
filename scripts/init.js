var consoleOn = true;
var debugAreas = true;
var bTexturesReady = false;
var bScriptsLoaded = false;
var texsLoaded = 0;
var textures = [];
var gameWidth = 800;
var gameHeight = 600;

/********************
        INIT
********************/

  document.querySelector("body").appendChild(
    elt("canvas", {
    width: gameWidth,
    height: gameHeight,
    // tabindex: "0"
  }));

var fpsDisplay;
if(consoleOn){
  fpsDisplay = elt("div", {
    id: "fpsDisplay"
    // tabindex: "0"
  });
  document.querySelector("body").appendChild(fpsDisplay);
}

var mousePos;
if(consoleOn){
  mousePos = elt("div", {
    id: "mousePos"
    // tabindex: "0"
  });
  document.querySelector("body").appendChild(mousePos);
}
  /********************
         UTILS
  ********************/
  
function elt(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    for (var attr in attributes)
      if (attributes.hasOwnProperty(attr))
        node.setAttribute(attr, attributes[attr]);
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

function objectLength(object) {
  var length = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      ++length;
    }
  }
  return length;
};

function createGrid(entities){
  let gridSize = 10;
  let grid = new Array(gameWidth / gridSize);
  for(var i = 0; i < grid.length; i++){
    grid[i] = new Array(gameHeight / gridSize);
  }
  let blockingAreas = entities.filter(ent => ent.components.area);
  blockingAreas = blockingAreas.filter(ent => ent.components.area.blocking);
  console.log(blockingAreas);

  for(var g = 0; g < grid.length; g++){
    blockloop:
    for(var f = 0; f < grid[g].length; f++){
      for(h in blockingAreas){
        if(blockingAreas[h].components.size.sizes){
          let sizes = blockingAreas[h].components.size.sizes;
          for(i in sizes){
            if(inBounds(
              blockingAreas[h].components.position.x + sizes[i].x,
              blockingAreas[h].components.position.y + sizes[i].y,
              sizes[i].width,
              sizes[i].height,
              g * gridSize + gridSize / 2,
              f * gridSize + gridSize / 2
            )){
              grid[g][f] = 0;
              continue blockloop;
            }
          }
        } else {
          if(inBounds(
            blockingAreas[h].components.position.x,
            blockingAreas[h].components.position.y,
            blockingAreas[h].components.size.width,
            blockingAreas[h].components.size.height,
            g * gridSize + gridSize / 2,
            f * gridSize + gridSize / 2
          )){
            grid[g][f] = 0;
            continue blockloop;
          }
        }
        grid[g][f] = 1;
      }
    }
  }
  console.log(grid);
  return grid;
}

  ///////////////////
  //Load everything

  window.ECS = {
      Components: {},

      timingEntity:{},

      allSystems: [],
      systems: {},
      Family: {},
      Texture: {},
      TextureHlp: {},
      entities: [],
      game: {},
      textures: [],
      conversations: {},
      currentLevel: [],
      playerEntity: {},
      astarGrid: []
  };

  loadJS(0);
  
  function loadJS(fileLoading) {
  
  
    var properLoadOrder = [
        "scripts/initWebGL.js",
        "scripts/Texture.js",
        "scripts/Family.js",
        "scripts/Entity.js",
        "scripts/Components.js",
        "scripts/Assemblages.js",
        "scripts/astar.js",
        "scripts/systems/conversation.js",
        "scripts/systems/actionLists.js",
        "scripts/systems/flashing.js",
        "scripts/systems/animated.js",
        "scripts/systems/mouse2.js",
        "scripts/systems/movement.js",
        "scripts/systems/render.js",
        "scripts/game.js"
    ];
  
    var script = document.createElement('script');
    document.body.appendChild(script);
    script.src = properLoadOrder[fileLoading];
  
    script.onload = function () {
      if (consoleOn)
        console.log(properLoadOrder[fileLoading]);
      fileLoading++;
      if (fileLoading < properLoadOrder.length) {
  
        loadJS(fileLoading);
      } else {
        ECS.Game.scriptsLoaded();
      }
    };
  
  }
  