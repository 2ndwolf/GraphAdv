/* =========================================================================
 *
 * Entity.js
 *  Definition of our "Entity". Abstractly, an entity is basically an ID. 
 *  Here we implement an entity as a container of data (container of components)
 *
 * ========================================================================= */
ECS.Entity = function Entity(initThing = false){
    // Generate a pseudo random ID
    this.id = (+new Date()).toString(16) + 
        (Math.random() * 100000000 | 0).toString(16) +
        ECS.Entity.prototype._count;

    // increment counter
    ECS.Entity.prototype._count++;

    // The component data will live in this object
    this.components = {};
    this.memberOf = [];

    ECS.entities[this.id] = this;
    if(!initThing){
        ECS.currentLevel.push(this);
    }

    return this;
};
// keep track of entities created
ECS.Entity.prototype._count = 0;

ECS.Entity.prototype.addComponent = function addComponent ( component ){
    // Add component data to the entity
    this.components[component.name] = component;
    return this;
};
ECS.Entity.prototype.removeComponent = function removeComponent ( componentName ){
    // Remove component data by removing the reference to it.
    // Allows either a component function or a string of a component name to be
    // passed in
    var name = componentName; // assume a string was passed in

    if(typeof componentName === 'function'){ 
        // get the name from the prototype of the passed component function
        name = componentName.prototype.name;
    }

    delete this.components[name];
    return this;
};

ECS.Entity.prototype.print = function print () {
    // Function to print / log information about the entity
    console.log(JSON.stringify(this, null, 4));
    return this;
};

ECS.Entity.prototype.removeFromSystem = function removeFromSystem(compName,sysName){
    this.removeComponent(compName);
    let index = this.memberOf.indexOf(sysName);    // <-- Not supported in <IE9
    if (index !== -1) {
      this.memberOf.splice(index, 1);
    }
    delete ECS.systems[sysName].members[this.id];
}

ECS.Entity.prototype.garbageEntity = function garbageEntity(ent,mouseEnt){
    for(sys in ECS.allSystems){
        if(ECS.allSystems[sys].members){
            if(ECS.allSystems[sys].members[ent.id]){
                delete ECS.allSystems[sys].members[ent.id];
            }
        }
    }
    if(ECS.systems.render.members[ent.id]){
        delete ECS.systems.render.members[ent.id];
    }
    if(ECS.entities[ent.id]){
        delete ECS.entities[ent.id];
    }
    if(mouseEnt){
        mouseEnt.components.mouse.currentItem = 0;
        mouseEnt.components.mouse.activeIcon = 4;
    }
}