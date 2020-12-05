// TODO

const tower: any = Game.getObjectById('eef6f0f2ac1133d1d0bbaed5');
if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure: { hits: number; hitsMax: number }) => structure.hits < structure.hitsMax,
    });
    if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        tower.attack(closestHostile);
    }
}
