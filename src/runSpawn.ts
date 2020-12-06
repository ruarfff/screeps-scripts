export default (spawn: StructureSpawn): void => {
    spawnCreepsByRole(spawn, 'harvester');
    spawnCreepsByRole(spawn, 'upgrader');
    spawnCreepsByRole(spawn, 'repairer');

    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room && room.controller && room.controller.my) {
            const sites = room.find(FIND_CONSTRUCTION_SITES);
            if (_.size(sites) > 0) {
                spawnCreepsByRole(spawn, 'builder');
            }
        }
    }
};

function spawnCreepsByRole(spawnPoint: StructureSpawn, role: string, amount = 2) {
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role == role);

    if (creeps.length < amount) {
        const newName = role + '-' + Game.time;
        console.log('Spawning new creep:', newName);

        // Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        //     'HarvesterBig',
        //     { memory: { role: 'harvester' } } );

        if (role === 'builder' || role === 'repairer') {
            spawnPoint.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName, {
                memory: { role },
            });
        } else {
            spawnPoint.spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], newName, {
                memory: { role },
            });
        }
    }
}
