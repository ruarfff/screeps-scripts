export default (room: Room, spawn: StructureSpawn): void => {
    spawnCreepsByRole(spawn, 'harvester', 1);
    spawnCreepsByRole(spawn, 'upgrader', 1);
    spawnCreepsByRole(spawn, 'repairer', 1);

    const sites = room.find(FIND_CONSTRUCTION_SITES);
    if (_.size(sites) > 0) {
        spawnCreepsByRole(spawn, 'builder', 4);
    }

    const sources = room.find(FIND_SOURCES);
    const creepsInRoom = room.find(FIND_MY_CREEPS);
    // iterate over all sources
    for (const source of sources) {
        // if the source has no miner
        if (
            !_.some(
                creepsInRoom,
                (c: { memory: { role: string; sourceId: Id<Source> } }) =>
                    c.memory.role == 'miner' && c.memory.sourceId == source.id,
            )
        ) {
            // check whether or not the source has a container
            const containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER,
            });
            // if there is a container next to the source
            if (containers.length > 0) {
                spawnMiner(spawn, source.id);
                break;
            }
        }
    }
};

function spawnMiner(spawnPoint: StructureSpawn, sourceId: Id<Source>) {
    spawnPoint.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'miner-' + Game.time, {
        memory: { role: 'miner', targetSource: sourceId },
    });
}

function spawnCreepsByRole(spawnPoint: StructureSpawn, role: string, amount = 2) {
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role == role);

    if (creeps.length < amount) {
        const newName = role + '-' + Game.time;
        console.log('Spawning new creep:', newName);

        if (role === 'builder' || role === 'repairer') {
            spawnPoint.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName, {
                memory: { role },
            });
        } else {
            spawnPoint.spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role },
            });
        }
    }
}
