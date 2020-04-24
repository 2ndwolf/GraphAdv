ECS.systems.movement = function systemMovement(ent){
  for(var e in ent){
    if(ent[e].components.movesAround && ent[e].components.movesAround.astar){
      this.currentNode = this.currentNode || 0;
      if(ent[e].components.movesAround.astar === true){
        this.currentNode = 0;
        console.log("REW");
        let start = ECS.astarGrid.grid[Math.round(ent[e].components.movesAround.currX / 10)][Math.round(ent[e].components.movesAround.currY / 10)];
        if(ent[e].components.movesAround.dstX < 0){
          ent[e].components.movesAround.dstX = 0;
        } else if (ent[e].components.movesAround.dstX >= 790 ){
          ent[e].components.movesAround.dstX = 790;
        }
        if(ent[e].components.movesAround.dstY >= 590){
          ent[e].components.movesAround.dstY = 590;
        }
        let end = ECS.astarGrid.grid[Math.round(ent[e].components.movesAround.dstX / 10)][Math.round(ent[e].components.movesAround.dstY / 10)];
        ent[e].components.movesAround.astar = astar.search(ECS.astarGrid, start, end, { heuristic: astar.heuristics.diagonal });
      } else if(ent[e].components.movesAround.astar.length > 0){
        let dx = ent[e].components.movesAround.astar[this.currentNode].x * 10 - ent[e].components.movesAround.currX;
        let dy = ent[e].components.movesAround.astar[this.currentNode].y * 10 - ent[e].components.movesAround.currY;
  
        let dist =  Math.pow(dx, 2) + Math.pow(dy, 2);
        let dist2 = Math.sqrt(dist);

        if(dist2 > ent[e].components.movesAround.speed * ECS.timingEntity.components.timing.timeStep){
          // ent[e].components.position.lastX = ent[e].components.position.x;
          // ent[e].components.position.lastY = ent[e].components.position.y;
          ent[e].components.position.x = ent[e].components.movesAround.currX = ent[e].components.movesAround.currX+(dx/dist2)*ent[e].components.movesAround.speed * ECS.timingEntity.components.timing.timeStep;
          ent[e].components.position.y = ent[e].components.movesAround.currY = ent[e].components.movesAround.currY+(dy/dist2)*ent[e].components.movesAround.speed * ECS.timingEntity.components.timing.timeStep;
          //if standing on ground or something
          if(ent[e].components.isPlayer){
            ent[e].components.position.layer = ent[e].components.position.y + 20;
          } else {
            ent[e].components.position.layer = ent[e].components.position.y + ent[e].components.size.height;
          }

        } else if(this.currentNode == ent[e].components.movesAround.astar.length - 1){
          ent[e].components.animated.running = false;
          ent[e].components.position.x = ent[e].components.movesAround.astar[this.currentNode].x * 10;
          ent[e].components.position.y = ent[e].components.movesAround.astar[this.currentNode].y * 10;
          //if standing on ground or something
          if(ent[e].components.isPlayer){
            ent[e].components.position.layer = ent[e].components.position.y + 20;
          } else {
            ent[e].components.position.layer = ent[e].components.position.y + ent[e].components.size.height;
          }
          
          this.currentNode = 0;
          
          ent[e].removeFromSystem("movesAround","movement");

        } else {
          this.currentNode += 1;
        }
      }
    }else if(ent[e].components.movesAround){
      let dx = ent[e].components.movesAround.dstX - ent[e].components.movesAround.currX;
      let dy = ent[e].components.movesAround.dstY - ent[e].components.movesAround.currY;

      let dist =  Math.pow(dx, 2) + Math.pow(dy, 2);
      let dist2 = Math.sqrt(dist);

      if(dist2 > ent[e].components.movesAround.speed * ECS.timingEntity.components.timing.timeStep){
        // ent[e].components.position.lastX = ent[e].components.position.x;
        // ent[e].components.position.lastY = ent[e].components.position.y;
        ent[e].components.position.x = ent[e].components.movesAround.currX = ent[e].components.movesAround.currX+(dx/dist2)*ent[e].components.movesAround.speed * ECS.timingEntity.components.timing.timeStep;
        ent[e].components.position.y = ent[e].components.movesAround.currY = ent[e].components.movesAround.currY+(dy/dist2)*ent[e].components.movesAround.speed * ECS.timingEntity.components.timing.timeStep;
        //if standing on ground or something
        ent[e].components.position.layer = ent[e].components.position.y + ent[e].components.size.height;
      } else {
        ent[e].components.animated.running = false;
        ent[e].components.position.x = ent[e].components.movesAround.dstX;
        ent[e].components.position.y = ent[e].components.movesAround.dstY;
        //if standing on ground or something
        ent[e].components.position.layer = ent[e].components.position.y + ent[e].components.size.height;
        if(ent[e].components.movesAround.movesToTake){

        }
        ent[e].removeFromSystem("movesAround","movement");
      }

    }
  }
}


ECS.systems.movement.family = {
  one : ["movement"]
};

ECS.systems.movement.members = {

};