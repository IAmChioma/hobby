export class Player {
    #_id!:string;
    #name!:string;
    #start_date!:Date;
    get _id(){
        return this.#_id;
    }
    get name(){
        return this.#name;
    }
    get start_date(){
        return this.#start_date;
    }
    set name(name){
         this.#name=name;
    }
    set start_date(date){
         this.#start_date=date;
    }
}
export class Team {
    #_id!:string
    #country!:string;
    #year!:number;
    #coordinates: number[]=[];
    #players!:Player[];

    get _id(){
        return this.#_id;
    }
    get country(){
        return this.#country;
    }

    get year(){
        return this.#year;
    }

    get latitude(){
        return this.#coordinates[0];
    }
    get longitude(){
        return this.#coordinates[1];
    }
    get coordinates(){
        return this.#coordinates;
    }

    get players(){
        return this.#players;
    }

    set _id(value){
        this.#_id=value;
    }
    set country(value){
        this.#country=value;
    }

    set year(val){
        this.#year=val;
    }

    set latitude(val){
        this.#coordinates[0] = val;
    }
    set longitude(val){
        this.#coordinates[1] = val;
    }

    set players(value){
        this.#players=value;
    }
}
