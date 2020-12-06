import Creep from './RuarfffCreep';
import { harvestEnergy, setIsWorking } from './creeps';

export default (creep: Creep): void => {
    setIsWorking(creep);
    if (!creep.memory.working) {
        harvestEnergy(creep, true, true);
        return;
    }

    // if creep is supposed to transfer energy to the controller
    // instead of upgraderController we could also use:
    // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

    // try to upgrade the controller
    if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            // if not in range, move towards the controller
            creep.moveTo(creep.room.controller);
        }
    }
};
