import Creep from './RuarfffCreep';
import upgrade from './role.upgrader';
import { harvestEnergy } from './creeps';

export default (creep: Creep): void => {
    // if creep is trying to complete a constructionSite but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
        // switch state
        creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
        // switch state
        creep.memory.working = true;
    }

    // if creep is supposed to complete a constructionSite
    if (creep.memory.working == true) {
        // find closest constructionSite
        const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        // if one is found
        if (constructionSite != undefined) {
            // try to build, if the constructionSite is not in range
            if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                // move towards the constructionSite
                creep.moveTo(constructionSite);
            }
        }
        // if no constructionSite is found
        else {
            // go upgrading the controller
            upgrade(creep);
        }
    }
    // if creep is supposed to get energy
    else {
        harvestEnergy(creep, true, true);
    }
};
