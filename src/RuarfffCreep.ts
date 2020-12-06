type RuarfffCreepMemory = CreepMemory & {
    role?: string;
    home?: string;
    working?: boolean;
    targetSource?: Id<Source>;
    target?: unknown;
};

export default interface RuarfffCreep extends Omit<Creep, 'memory'> {
    memory: RuarfffCreepMemory;
}
