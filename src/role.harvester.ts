import Creep from './RuarfffCreep';
import { harvestEnergy, setIsWorking } from './creeps';

export default (creep: Creep): void => {
    setIsWorking(creep);
    if (!creep.memory.working) {
        harvestEnergy(creep, false, true);
        return;
    }

    // find closest spawn, extension or tower which is not full
    let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: (s) =>
            (s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_TOWER) &&
            s.energy < s.energyCapacity,
    });

    if (!structure && creep.room.storage) {
        structure = creep.room.storage;
    }

    // if we found one
    if (structure) {
        console.log('Going ot structure:', structure);
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            // move towards it
            creep.moveTo(structure, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};
