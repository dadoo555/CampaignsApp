export class Campaign {
    constructor(name, type, start_time, end_time, status_id){
        this.name = name
        this.type = new CampaignType(type)
        this.start_time = start_time
        this.end_time = end_time
        this.status_id = new CampaignStatus(status_id)
    }

}

class CampaignStatus {
    constructor(value){
        
        this.validNumbers = [0,1]
        if (!this.validNumbers.includes(value)){
            throw new Error('Invalid Campaign Status')
        }
        
        this.value = value
    }

    getDescription(){
        switch (this.value){
            case 0: 
                return "gelöscht";
            case 1:
                return "aktiv";
            default:
                return "Not Found";
        }
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