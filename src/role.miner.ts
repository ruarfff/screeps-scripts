import Creep from './RuarfffCreep';

export default (creep: Creep): void => {
    // get source
    if (creep.memory.targetSource) {
        const source: Source | null = Game.getObjectById(creep.memory.targetSource);

        if (source) {
            // find container next to source
            const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER,
            })[0];

            // if creep is on top of the container
            if (creep.pos.isEqualTo(container.pos)) {
                // harvest source
                creep.harvest(source);
            }
            // if creep is not on top of the container
            else {
                // move towards it
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
