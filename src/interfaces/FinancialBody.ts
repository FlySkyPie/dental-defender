import ItemType from '../utils/Item';

interface FinancialBody {
    earn(money: number): void;

    /**
     * buy item, return false if do not have money enough.
     */
    buy(item: ItemType): boolean;
}

export default FinancialBody; 