ECS.systems.animated = function systemAnimated(ent){
    for(var e in ent){
        if(ent[e].components.animated){
            if(ent[e].components.animated.walkCycle){
                if(!ent[e].components.animated.running){
                    ent[e].components.texture.offX = 0;
                    ent[e].components.texture.offY = 0;
                }
            }
            if(ent[e].components.animated.repeat == 0 || !ent[e].components.animated.running){
                if(ent[e].components.animated.stopRenderOnceDone){
                    ent[e].removeFromSystem("render","render");
                }
                ent[e].removeFromSystem("animated","animated");
                continue;
            }
            ent[e].components.animated.time -= ECS.timingEntity.components.timing.delta;
            if(ent[e].components.animated.time <= 0){
                //Do the logic
                ent[e].components.animated.time = ent[e].components.animated.delay;
                ent[e].components.animated.currentFrame++;
                ent[e].components.texture.offX =
                    ent[e].components.animated.currentFrame * ent[e].components.animated.offX -
                    Math.floor(ent[e].components.animated.currentFrame/ent[e].components.animated.horizFrames) *
                    ent[e].components.animated.horizFrames * ent[e].components.animated.offX;
                ent[e].components.texture.offY =
                    Math.floor(ent[e].components.animated.currentFrame/ent[e].components.animated.horizFrames) * ent[e].components.animated.offY;
                if(ent[e].components.animated.currentFrame == ent[e].components.animated.frames){
                    ent[e].components.animated.currentFrame = 0;
                    if(ent[e].components.animated.repeat > 0) ent[e].components.animated.repeat--;
                }

            }

        }
    }
};

ECS.systems.animated.family = {
    all : ["animated"]
};

ECS.systems.animated.members = {};