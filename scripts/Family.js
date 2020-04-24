ECS.Family.getEntities = function getEntities(comps,sys){
    let ents = Object.keys(ECS.entities);
    let familyMembers = [];
    for(var i =0; i < ents.length; i++){
        if(ECS.Family.matches(ECS.entities[ents[i]],comps)){
            ECS.entities[ents[i]].memberOf.push(sys.name);
            familyMembers[ECS.entities[ents[i]].id] = ECS.entities[ents[i]];
        }
    }
    return familyMembers;
};

ECS.Family.matches = function matches(entity,comps){
    let entityComponents = Object.keys(entity.components);
    let allPassed = comps.all ? comps.all.every(function (comp){return entityComponents.includes(comp);}) : true;
    let onePassed = comps.one ? comps.one.some(function(comp){return entityComponents.includes(comp);}) : true;
    let nonePassed = comps.none ? entityComponents.every(function (comp){return comps.none.includes(comp)}) : true;
    return allPassed && onePassed && nonePassed;
};

ECS.Family.remove = function remove(entity){
    for(var i = 0; i<ECS.entities[entity].memberOf.length; i++){
        delete ECS.entities[entity].memberOf[i].members[entity];
    }
    delete ECS.entities[entity];
}

ECS.Family.add = function add(entity){
    console.log(ECS.allSystems.length);
    for(var i = 0 ; i < ECS.allSystems.length; i++){
        if(ECS.Family.matches(entity,ECS.allSystems[i].family) && !ECS.allSystems[i].members[entity.id]){
            entity.memberOf.push(ECS.allSystems[i].name);
            ECS.allSystems[i].members[entity.id] = entity;
        }
    }
    ECS.entities[entity.id] = entity;
    for(ent in ECS.allSystems){
        console.log(ECS.allSystems[ent].members);
    }
}

//TODO
ECS.Family.removeFromSystem = function removeFromSystem(entity,system){
    delete system.members[entity];
}