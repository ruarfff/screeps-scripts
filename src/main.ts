import harvester from './role.harvester';
import upgrader from './role.upgrader';
import builder from './role.builder';
import repairer from './role.repairer';
import miner from './role.miner';
import Creep from './RuarfffCreep';
import runTower from './runTower';
import runSpawn from './runSpawn';

const roles: Map<string, (creep: Creep) => void> = new Map([
    ['harvester', harvester],
    ['upgrader', upgrader],
    ['builder', builder],
    ['repairer', repairer],
    ['miner', miner],
]);

export const loop = (): void => {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room && room.controller && room.controller.my) {
            runRoomLogic(room);
        }
    }
};

function runRoomLogic(room: Room): void {
    const HOME = Game.spawns['Spawn1'];

    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing creep from memory:', name);
        }
    }

    runSpawn(room, HOME);

    for (const name in Game.creeps) {
        const creep: Creep = Game.creeps[name];
        if (creep.memory.role && !!roles.get(`${creep.memory.role}`)) {
            roles.get(`${creep.memory.role}`)?.(creep);
        }
    }

    const towers = _.filter(Game.structures, (s: { structureType: string }) => s.structureType == STRUCTURE_TOWER);
    for (const tower of towers) {
        runTower(tower);
    }

    for (const roomName in Game.rooms) {
        const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
        }
    }
}
