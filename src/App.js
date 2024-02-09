import { useEffect, useState } from 'react';
import './styles/App.css';
import Cookies from 'universal-cookie'
import EditCampaign from './components/EditCampaign';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [campaignsList, setCampaignsList] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(undefined)
    const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false)
    
    useEffect(()=>{
        const db = new Cookies()
        const campaigns = db.get('campaigns')
        if (campaigns){
            setCampaignsList(campaigns)
        }
    },[])

    const closeNewCampaign = ()=>{
        setIsNewCampaignOpen(false)
    }

    const saveCampaign = (newCampaign)=>{
        
        let newCampaignsList = []
        if (selectedCampaign || selectedCampaign === 0){
            // edit campaign
            newCampaignsList = campaignsList
            newCampaignsList[selectedCampaign] = newCampaign
        } else {
            // new campaign
            newCampaignsList = [...campaignsList, newCampaign]
        }
        
        setCampaignsList(newCampaignsList)
        const db = new Cookies()
        db.set("campaigns", JSON.stringify(newCampaignsList))
    }

    const handleEditCampaign = (id)=>{
        setSelectedCampaign(id)
        setIsNewCampaignOpen(true)
    }

    const handleNewCampaign = ()=>{
        setSelectedCampaign(undefined)
        setIsNewCampaignOpen(true) 
    }

    const handleChangeStatus = ()=>{

    }

    
    
    return (
        <div id='structure'>
            <ToastContainer />
            <EditCampaign isOpen={isNewCampaignOpen} close={closeNewCampaign} saveCampaign={saveCampaign} 
                        selectedCampaign={selectedCampaign} campaignsList={campaignsList}/>
            
            <button onClick={handleNewCampaign}>New Campaign</button>

            <div id='table-container'>
                {campaignsList[0] && campaignsList.map((c, i)=>{
                    return(
                        <ListIem key={i} id={i} name={c.name} type={c.type} 
                                startTime={c.start_time} endTime={c.end_time} 
                                status={c.status_id} editCampaign={handleEditCampaign} changeStatus={handleChangeStatus}/>
                    )
                })}

                {!campaignsList[0] && 
                    <div>
                        No registered campaigns...
                    </div>
                }
            </div>
        </div>
    );
}

const ListIem = ({id, name, type, startTime, endTime, status, editCampaign, changeStatus})=>{
    return (
        <div className='table-item'>
            <p>{name}</p>    
            <p>{type}</p>    
            <p>{startTime}</p>    
            <p>{endTime}</p>    
            <p>{status}</p>    
            <div>
                <button onClick={()=>{editCampaign(id)}}>Edit</button>    
                <button onClick={changeStatus}>Change Status</button>    
            </div> 
        </div>
    )
}

export default App;
