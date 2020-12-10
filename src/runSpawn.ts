import Creep from './RuarfffCreep';

export default (room: Room, spawn: StructureSpawn): void => {
    const creepsInRoom = room.find(FIND_MY_CREEPS);
    const roleCounts = new Map<string, number>();

    creepsInRoom.forEach((creep: Creep) => {
        const role = creep.memory.role || '';
        const amount = roleCounts.has(role) ? roleCounts.get(role) || 0 : 0;
        roleCounts.set(role, amount + 1);
    });

    spawnCreepsByRole(spawn, 'harvester', 2);
    spawnUpgraders(spawn, 4);
    spawnCreepsByRole(spawn, 'repairer', 1);

    const sites = room.find(FIND_CONSTRUCTION_SITES);
    if (_.size(sites) > 0) {
        spawnCreepsByRole(spawn, 'builder', 1);
    }

    const sources = room.find(FIND_SOURCES);
    // iterate over all sources
    for (const source of sources) {
        // if the source has no miner
        if (
            !_.some(
                creepsInRoom,
                (c: { memory: { role: string; targetSource: Id<Source> } }) =>
                    c.memory.role == 'miner' && c.memory.targetSource == source.id,
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

    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if (hostiles && hostiles.length > 0) {
        console.log(JSON.stringify(hostiles));
        spawnDefender(spawn, 2);
        spawnToughDefender(spawn, 1);
    }
};

function spawnToughDefender(spawnPoint: StructureSpawn, max: number) {
    const role = 'defender';
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role === role);
    if (creeps.length < max) {
        const newName = role + '-' + Game.time;
        spawnPoint.spawnCreep([TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE], newName, {
            memory: { role },
        });
    }
}

function spawnDefender(spawnPoint: StructureSpawn, max: number) {
    const role = 'defender';
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role === role);
    if (creeps.length < max) {
        const newName = role + '-' + Game.time;
        spawnPoint.spawnCreep([TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], newName, {
            memory: { role },
        });
    }
}

function spawnMiner(spawnPoint: StructureSpawn, sourceId: Id<Source>) {
    spawnPoint.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'miner-' + Game.time, {
        memory: { role: 'miner', targetSource: sourceId },
    });
}

function spawnUpgraders(spawnPoint: StructureSpawn, max: number) {
    const role = 'upgrader';
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role === role);

    if (creeps.length < max) {
        const newName = role + '-' + Game.time;
        spawnPoint.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, {
            memory: { role },
        });
    }
}

function spawnCreepsByRole(spawnPoint: StructureSpawn, role: string, amount = 2) {
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role == role);

    if (creeps.length < amount) {
        const newName = role + '-' + Game.time;
        console.log('Spawning new creep:', newName);

        if (role === 'builder' || role === 'repairer') {
            spawnPoint.spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role },
            });
        } else {
            spawnPoint.spawnCreep([WORK, MOVE, CARRY], newName, {
                memory: { role },
            });
        }
    }
}
