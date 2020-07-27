interface BalanceMonitor {
    
    updateMoney(value: number): void;

    updateStock(amounts: [number, number, number]): void;
}

export default BalanceMonitor;