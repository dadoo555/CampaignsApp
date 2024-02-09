export class Campaign {
    constructor(name, type, start_time, end_time, status_id){
        this.name = name
        this.type = type
        this.start_time = start_time
        this.end_time = end_time
        this.status_id = status_id
    }

}

class CampaignType {
    constructor(value){
        
        this.validNumbers = [1,2,3]
        if (!this.validNumbers.includes(value)){
            throw new Error('Invalid Campaign Type')
        }
        
        this.value = value
    }

    getDescription(){
        switch (this.value){
            case 1: 
                return "Standart";
            case 2:
                return "AB Test";
            case 3:
                return "MV Test";
            default:
                return "Not Found";
        }
    }
}