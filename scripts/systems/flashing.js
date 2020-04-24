ECS.systems.flashing = function systemFlashing(ent){
    for(var e in ent){
        if(ent[e].components.flashing){
            ent[e].components.flashing.time -= ECS.timingEntity.components.timing.delta;
            if(ent[e].components.flashing.time <= 0){
                ent[e].components.flashing.time = ent[e].components.flashing.delay;
                if(ent[e].components.flashing.repeat > 0) ent[e].components.flashing.repeat--;
                ent[e].components.texture.hidden = !ent[e].components.texture.hidden;
            }
            if(ent[e].components.flashing.repeat == 0){
                ent[e].components.texture.hidden = false;
                ent[e].removeFromSystem("flashing","flashing");
            }
        }
    }
};

ECS.systems.flashing.family = {
    all : ["flashing"]
};

ECS.systems.flashing.members = {};