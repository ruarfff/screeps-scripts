import harvester from './role.harvester';
import upgrader from './role.upgrader';
import builder from './role.builder';
import repairer from './role.repairer';
import Creep from './RuarfffCreep';
import runTower from './runTower';

const roles: Map<string, (creep: Creep) => void> = new Map([
    ['harvester', harvester],
    ['upgrader', upgrader],
    ['builder', builder],
    ['repairer', repairer],
]);

export const loop = (): void => {
    const HOME = Game.spawns['Spawn1'];

    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing creep from memory:', name);
        }
    }

    // Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );

    spawnCreepsByRole(HOME, 'harvester');
    spawnCreepsByRole(HOME, 'upgrader');
    spawnCreepsByRole(HOME, 'repairer');

    if (HOME.spawning) {
        const spawningCreep: Creep = Game.creeps[HOME.spawning.name];
        HOME.room.visual.text('🏗️' + spawningCreep.memory.role, HOME.pos.x + 1, HOME.pos.y, {
            align: 'left',
            opacity: 0.8,
        });
    }

    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room && room.controller && room.controller.my) {
            console.log('Room with my controller:', roomName);
            console.log(JSON.stringify(room.memory, null, 2));

            const sites = room.find(FIND_CONSTRUCTION_SITES);
            if (_.size(sites) > 0) {
                spawnCreepsByRole(HOME, 'builder', 4);
            }
        }
    }

    for (const name in Game.creeps) {
        const creep: Creep = Game.creeps[name];
        if (creep.memory.role && !!roles.get(`${creep.memory.role}`)) {
            roles.get(`${creep.memory.role}`)?.(creep);
        }
    }

    const towers = _.filter(Game.structures, (s: { structureType: string }) => s.structureType == STRUCTURE_TOWER);
    for (const tower of towers) {
        console.log('TOWER:::', tower);
        runTower(tower);
    }
};

function spawnCreepsByRole(spawnPoint: StructureSpawn, role: string, amount = 2) {
    const creeps = _.filter(Game.creeps, (creep: { memory: { role: string } }) => creep.memory.role == role);
    console.log(role + 's:', creeps.length);

    if (creeps.length < amount) {
        const newName = role + '-' + Game.time;
        console.log('Spawning new creep:', newName);

        // Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        //     'HarvesterBig',
        //     { memory: { role: 'harvester' } } );
        spawnPoint.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role },
        });
    }
}
