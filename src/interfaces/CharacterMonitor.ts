
interface CharacterMonitor {
    updateHealth(health: number, healthMax: number): void;
    updateSelectedItem(index: number): void;
}

export default CharacterMonitor;