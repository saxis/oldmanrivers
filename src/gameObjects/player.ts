export class Player  {
    private _hp: number;

    constructor(hp:number) {
        this._hp = hp;
    }

    get hp() {
        return this._hp
    }

    set hp(val:number){
        if (val > 0) {
            this._hp = val;
        }
    }

    heal(amount:number){
        if(amount > 0){
            this._hp += amount;
        }
    }

    damage(amount:number){
        if(amount > 0) {
            this._hp -= amount;
            log('in damage, np should now be ', this._hp)
        }
    }

}