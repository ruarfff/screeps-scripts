import Creep from './RuarfffCreep';
import upgrade from './role.upgrader';
import { harvestEnergy, setIsWorking } from './creeps';

export default (creep: Creep): void => {
    console.log(creep.name);
    console.log('Energy:', creep.carry.energy);
    console.log('Capacity:', creep.carryCapacity);
    setIsWorking(creep);
    if (!creep.memory.working) {
        harvestEnergy(creep, true, true);
        return;
    }

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
};
