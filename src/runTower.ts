export default (tower: StructureTower): void => {
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
};
