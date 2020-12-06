import Creep from './RuarfffCreep';
import roleBuilder from './role.builder';
import { harvestEnergy, setIsWorking } from './creeps';

export default (creep: Creep): void => {
    setIsWorking(creep);
    if (!creep.memory.working) {
        harvestEnergy(creep, true, true);
        return;
    }

    // find closest structure with less than max hits
    // Exclude walls because they have way too many max hits and would keep
    // our repairers busy forever. We have to find a solution for that later.
    const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL,
    });

    // if we find one
    if (structure != undefined) {
        // try to repair it, if it is out of range
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
            // move towards it
            creep.moveTo(structure);
        }
    }
    // if we can't fine one
    else {
        // look for construction sites
        roleBuilder(creep);
    }
};
