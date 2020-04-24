ECS.systems.render = function systemRender(entities){
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    keysSorted = Object.keys(entities).sort(function(a,b){
        if(entities[a].components.position && entities[a].components.position.layer != -1){
            if(entities[b].components.position && entities[b].components.position.layer != -1){
                return entities[a].components.position.layer-entities[b].components.position.layer;
            } else if (consoleOn){
                console.log("Missing layer attribute for entity " + entities[b].print());
            }
        } else if (consoleOn){
            console.log("Missing layer attribute for entity " + entities[a].print());
        }
    });

    for(var key in keysSorted){
        drawInfo = entities[keysSorted[key]];
    // }

    // entities.sort(function compareNumbers(a, b) {
    //     return a.components.position.layer - b.components.position.layer;
    //   }).forEach(function (drawInfo) {
        //Plain coordinates of the image
  
        if (drawInfo.components.texture) {
            if(!drawInfo.components.texture.hidden){
                if(drawInfo.components.position){
                    if(drawInfo.components.isPlayer){
                        var xPos = Math.round(drawInfo.components.position.x - drawInfo.components.texture.offsetWidth / 2);
                        var yPos = Math.round(drawInfo.components.position.y - (drawInfo.components.texture.offsetHeight - 20));
                    } else {
                        var xPos = drawInfo.components.position.x;//drawInfo.components.position.lastX + (drawInfo.components.position.x - drawInfo.components.position.lastX) * (ECS.timingEntity.components.timing.delta / ECS.timingEntity.components.timing.timeStep);
                        var yPos = drawInfo.components.position.y;//drawInfo.components.position.lastY + (drawInfo.components.position.y - drawInfo.components.position.lastY) * (ECS.timingEntity.components.timing.delta / ECS.timingEntity.components.timing.timeStep);
                    }
                } else if(consoleOn) {
                    console.log("Missing position component for entity " + drawInfo);
                }
                //Offset for spriting purpose
                var xOff = drawInfo.components.texture.offX * drawInfo.components.texture.xScale;
                var yOff = drawInfo.components.texture.offY * drawInfo.components.texture.yScale;
                var offWidth = drawInfo.components.texture.offsetWidth * drawInfo.components.texture.xScale;
                var offHeight = drawInfo.components.texture.offsetHeight * drawInfo.components.texture.yScale;
        
                //Size of the texture (if bigger than off values, it crops)
                var texWidth = drawInfo.components.texture.texture.width * drawInfo.components.texture.xScale;
                var texHeight = drawInfo.components.texture.texture.height * drawInfo.components.texture.yScale;
        
                //Not sure - offset is scaled to match the texture's new size
                var notSureX = drawInfo.components.texture.offsetWidth * drawInfo.components.texture.xScale;
                var notSureY = drawInfo.components.texture.offsetHeight * drawInfo.components.texture.yScale;
        
                
                let tex = drawInfo.components.texture.texture.texture;
                //let texWidth = texWidth;
                //let texHeight = texHeight;
                let srcX = xOff;
                let srcY = yOff;
                let srcWidth = notSureX;
                let srcHeight = notSureY;
                let dstX = xPos;
                let dstY = yPos;
                let dstWidth = offWidth;
                let dstHeight = offHeight; 

                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.useProgram(texProgram);
            
                //J'imagine qu'on load le vertex ici
                //et le fragment après
                gl.bindBuffer(gl.ARRAY_BUFFER, texPositionBuffer);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            
                //C'est la définition du fragment, ce qu'on fait pixel par pixel
                gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
                gl.enableVertexAttribArray(texcoordLocation);
                gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
            
                let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
            
                //these aren't in the right order (en rapport avec ce que j'ai lu:)
                //scale, rotate, then translate (mais apparement, c'est à l'envers?!)
                matrix = m4.translate(matrix, dstX, dstY, 0);
                //rotate
                matrix = m4.scale(matrix, dstWidth, dstHeight, 1);
                //the shape : matrix
                gl.uniformMatrix4fv(matrixLocation, false, matrix);
                //the pixels (texture) : texmatrix
                let texMatrix = m4.translation(srcX / texWidth, srcY / texHeight, 0);
                texMatrix = m4.scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);
                gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);
                gl.uniform1i(textureLocation, 0);
            
                //the above is specific to the drawImage implementation's
                //possible transformations
                gl.drawArrays(gl.TRIANGLES, 0, 6);      
            }
        } else {
          /**
           * Draw a polygon
           * 
           */
          let x = drawInfo.components.position.x;
          let y = drawInfo.components.position.y;

          //Make a size component????

          let width = drawInfo.components.size.width;
          let height = drawInfo.components.size.height;
          let r = 0;
          let g = 0;
          let b = 0;
          let color = [];
          if(drawInfo.components.area){
              if(drawInfo.components.area.blocking){
                  r = .3;
                  g = .3;
                  b = .3;
              }
              if(drawInfo.components.area.lookable){
                  r += .3;
              }
              if(drawInfo.components.area.takeable){
                  r = 0;
                  g = .3;
                  b = 0;
              }
              if(drawInfo.components.area.useable){
                  g = 0;
                  b = .3;
              }
              if(drawInfo.components.area.walkable){
                  r = .9 - r;
                  g = .9 - g;
                  b = .9 - b;
              }
            color = [r,g,b,.3];
          } else {
            color = [0,1.0,0,.3];
            if(consoleOn){
                console.log("Why am I drawing " + drawInfo.print() + " ?");
            }
          }
          let xScale = 1;
          let yScale = 1;
          let angleInRadians = 0;

          gl.useProgram(polyProgram)

          gl.enableVertexAttribArray(polyPositionLocation);
          gl.bindBuffer(gl.ARRAY_BUFFER, polyPositionBuffer);
          gl.vertexAttribPointer(polyPositionLocation, 2, gl.FLOAT, false, 0, 0);
      
          // set the color
          gl.uniform4fv(polyColorLocation, color);
      
          let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      
          matrix = m3.translate(matrix, x, y);
          matrix = m3.rotate(matrix, angleInRadians);
          matrix = m3.scale(matrix, width * xScale, height * yScale);
          //the shape : matrix

          gl.uniformMatrix3fv(polyMatrixLocation, false, matrix);
      
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }//);
};

ECS.systems.render.family = {
    one : ["texture"]
};

if(debugAreas){
    ECS.systems.render.family.one.push("area");
}

ECS.systems.render.members = {};
  
  
  