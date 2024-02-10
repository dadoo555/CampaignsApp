import { useEffect, useState } from 'react';
import './styles/App.css';
import Cookies from 'universal-cookie'
import SaveOrEditCampaign from './components/SaveOrEditCampaign';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Campaign } from './models/campaign.model';


function App() {
    const [campaignsList, setCampaignsList] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(undefined)
    const [isSaveOrEditCampaignOpen, setIsSaveOrEditCampaignOpen] = useState(false)
    
    useEffect(()=>{
        const db = new Cookies()
        const campaignTable = db.get('campaigns')
        const campaigns = campaignTable?.map(r => Campaign.fromRecord(r));
        if (campaigns){
            setCampaignsList(campaigns)
        }
    },[])

    const closeNewCampaign = ()=>{
        setIsSaveOrEditCampaignOpen(false)
    }

    const saveCampaign = (newCampaign)=>{
        const newCampaignsList = [...campaignsList]
        if (selectedCampaign){
            // edit campaign
            const index = newCampaignsList.indexOf(selectedCampaign)
            newCampaignsList[index] = newCampaign
        } else {
            // new campaign
            newCampaignsList.push(newCampaign)
        }
        const db = new Cookies()
        const allRecords = newCampaignsList.map(c => c.toRecord());
        db.set("campaigns", JSON.stringify(allRecords))

        setCampaignsList(newCampaignsList)
    }

    const handleEditCampaign = (campaign)=>{
        setSelectedCampaign(campaign)
        setIsSaveOrEditCampaignOpen(true)
    }

    const handleNewCampaign = ()=>{
        setSelectedCampaign(undefined)
        setIsSaveOrEditCampaignOpen(true) 
    }

    const handleChangeStatus = ()=>{
        
    }

    
    
    return (
        <>
        <ToastContainer />
        <div id='structure'>
            <SaveOrEditCampaign isOpen={isSaveOrEditCampaignOpen} close={closeNewCampaign} saveCampaign={saveCampaign} 
                        selectedCampaign={selectedCampaign} />
            
            <button id='btn-new' onClick={handleNewCampaign}>New Campaign</button>

            <div id='table-container'>
                <TableHeader/>
                {campaignsList && campaignsList.map((c, i)=>{
                    return(
                        <ListIem campaign={c} editCampaign={handleEditCampaign} changeStatus={handleChangeStatus}/>
                    )
                })}

                {campaignsList.length === 0 && 
                    <div id='no-campaigns'>
                        No registered campaigns...
                    </div>
                }
            </div>
        </div>
        </> 
    );
}


const TableHeader = ()=>{
    return (
        <div id='table-header'>
            <p className='name'>Name</p>
            <p className='type'>Type</p>
            <p className='s-time'>Start Date</p>
            <p className='e-time'>End Date</p>
            <p className='status'>Status</p>
            <p className='actions'>Actions</p>
        </div>
    )
}


const ListIem = ({campaign, editCampaign, changeStatus})=>{
    
    const {id, name, typeDescription, startTime, endTime, status} = campaign;
    
    return (
        <div key={id} className='table-item'>
            <p className='name'>{name}</p>    
            <p className='type'>{typeDescription}</p>    
            <p className='s-time'>{startTime}</p>    
            <p className='e-time'>{endTime}</p>    
            <p className='status'>{status}</p>    
            <div className='actions'>
                <button onClick={()=>{editCampaign(campaign)}}>Edit</button>    
                <button onClick={changeStatus}>Change Status</button>    
            </div> 
        </div>
    )
}

export default App;
