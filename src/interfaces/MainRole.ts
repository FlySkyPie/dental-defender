import Direction from '../utils/Direction';

interface MainRole {
    attack(target: [number, number]): void;
    getSpeed():number;
    setVelocity(value: [number, number]): void;
    setDirection(value: Direction): void;
    getPosition(): [number, number];
    heal(point: number): void;
}

export default MainRole;