import { v4 as uuidv4 } from 'uuid';

const TYPES = {
    1: "Standart",
    2: "AB Test",
    3: "MV Test"
};

export class Campaign {

    static fromRecord(record){
        return new Campaign(record.id, record.name, record.type, record.start_time, record.end_time, record.status_id);
    }

    constructor(id, name, type, startTime, endTime, statusId){
        this.id = id ? id : uuidv4();
        this.name = name
        this.type = type
        this.startTime = startTime
        this.endTime= endTime
        this.statusId = statusId
    }

    get typeDescription(){
        return TYPES[this.type];
    }

    get status(){
        return this.statusId ? 'aktiv' : 'gelöscht'
    }

    toRecord(){
        return {
            id: this.id,
            name: this.name, 
            type: this.type, 
            start_time: this.startTime, 
            end_time: this.endTime, 
            status_id: this.statusId,
        };
    }
}
