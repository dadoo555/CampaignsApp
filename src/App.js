import { useEffect, useState } from 'react';
import './styles/App.css';
import Cookies from 'universal-cookie'
import NewCampaign from './components/NewCampaign';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [campaignsList, setCampaignsList] = useState([])
    const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false)
    
    

    useEffect(()=>{
        const db = new Cookies()
        const campaigns = db.get('campaigns')
        if (campaigns){
            setCampaignsList(JSON.parse())
        }


        // cookies.set("campaigns", [1,2,3])
    },[])

    const closeNewCampaign = ()=>{
        setIsNewCampaignOpen(false)
    }

    const addCampaign = (newCampaign)=>{
        const newCampaignsList = [...campaignsList, newCampaign]
        setCampaignsList(newCampaignsList)

        const db = new Cookies()
        db.set("campaigns", JSON.stringify(newCampaignsList))
    }
    


    return (
        <div id='structure'>
            <ToastContainer />
            <NewCampaign isOpen={isNewCampaignOpen} close={closeNewCampaign} campaigns={campaignsList} addCampaign={addCampaign}/>
            <button onClick={()=>{setIsNewCampaignOpen(true)}}>New Campaign</button>

            {campaignsList[0] && campaignsList.map((campaign)=>{
                return(
                    <div>{campaign.name}</div>
                )
            })}
            
        </div>
    );
}

export default App;
