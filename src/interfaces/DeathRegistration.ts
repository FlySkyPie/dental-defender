import Monster from '../entities/Monster';

interface DeathRegistration {
    reportDestroyed(monster: Monster):void;
}

export default DeathRegistration;