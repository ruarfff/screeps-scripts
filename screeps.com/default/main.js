const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function () {

    const HOME = Game.spawns['Spawn1'];

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing creep from memory:', name)
        }
    }

    // Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );

    spawnCreepsByRole(HOME, 'harvester');
    spawnCreepsByRole(HOME, 'upgrader');


    if(HOME.spawning) {
        const spawningCreep = Game.creeps[HOME.spawning.name];
        HOME.room.visual.text(
            '🏗️' + spawningCreep.memory.role,
            HOME.pos.x + 1,
            HOME.pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(roomName in Game.rooms) {
        console.log(roomName)
        const room = Game.rooms[roomName];
        if(room && room.controller && room.controller.my) {
            console.log('Room with my controller:', roomName)
            console.log(JSON.stringify(room.memory, null, 2))

            const sites = room.find(FIND_CONSTRUCTION_SITES)
            if(_.size(sites) > 0) {
                spawnCreepsByRole(HOME, 'builder');
            }

        }
    };

    var tower = Game.getObjectById('eef6f0f2ac1133d1d0bbaed5');
    if(tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

function spawnCreepsByRole(spawnPoint, role, amount = 2) {
    const creeps = _.filter(Game.creeps, (creep) =>creep.memory.role == role)
    console.log(role + 's:', creeps.length)

    if(creeps.length < amount){
        const newName = role + '-' + Game.time
        console.log('Spawning new creep:', newName)

        // Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        //     'HarvesterBig',
        //     { memory: { role: 'harvester' } } );
        spawnPoint.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {role}
        });
    }
}
