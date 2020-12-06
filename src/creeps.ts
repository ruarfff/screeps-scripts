import Creep from './RuarfffCreep';
// Copied from https://github.com/thPion/Screeps-Nooby-Guide/blob/master/prototype.creep.js
export const harvestEnergy = (creep: Creep, useContainer: boolean, useSource: boolean): void => {
    let container;
    // if the Creep should look for containers
    if (useContainer) {
        // find closest container
        container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > 0,
        });
        // if one was found
        if (container != undefined) {
            // try to withdraw energy, if the container is not in range
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards it
                creep.moveTo(container);
            }
        }
    }
    // if no container was found and the Creep should look for Sources
    if (!container && useSource) {
        // find closest source
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        if (source) {
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards it
                creep.moveTo(source);
            }
        }
    }
};

export const setIsWorking = (creep: Creep): void => {
    // if creep is trying to complete a constructionSite but has no energy left
    if (creep.memory.working && creep.carry.energy === 0) {
        // switch state
        creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
        // switch state
        creep.memory.working = true;
    }
};
