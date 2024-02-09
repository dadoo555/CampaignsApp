import { useEffect, useState } from 'react';
import './styles/App.css';
import Cookies from 'universal-cookie'
import EditCampaign from './components/EditCampaign';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [campaignsList, setCampaignsList] = useState([])
    const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false)
    
    useEffect(()=>{
        const db = new Cookies()
        const campaigns = db.get('campaigns')
        if (campaigns){
            console.log(campaigns)
            setCampaignsList(campaigns)
        }
    },[])

    const closeNewCampaign = ()=>{
        setIsNewCampaignOpen(false)
    }

    const saveCampaign = (newCampaign)=>{
        const newCampaignsList = [...campaignsList, newCampaign]
        setCampaignsList(newCampaignsList)

        const db = new Cookies()
        db.set("campaigns", JSON.stringify(newCampaignsList))
    }
    
    return (
        <div id='structure'>
            <ToastContainer />
            <EditCampaign isOpen={isNewCampaignOpen} close={closeNewCampaign} selectedCampaign={campaignsList} saveCampaign={saveCampaign}/>
            <button onClick={()=>{setIsNewCampaignOpen(true)}}>New Campaign</button>

            {campaignsList[0] && campaignsList.map((c, i)=>{
                return(
                    <ListIem key={i} id={i} name={c.name} type={c.type} startTime={c.start_time} endTime={c.end_time} status={c.status_id}/>
                )
            })}
            
        </div>
    );
}

const ListIem = ({id, name, type, startTime, endTime, status})=>{
    return (
        <div className='table-item'>
            <p>{name}</p>    
            <p>{type}</p>    
            <p>{startTime}</p>    
            <p>{endTime}</p>    
            <p>{status}</p>    
            <div>
                <button onClick={()=>{alert(id)}}>Edit</button>    
                <button>Change Status</button>    
            </div> 
        </div>
    )
}

export default App;
