import { useEffect, useState } from 'react';
import './styles/App.css';
import { Campaign } from './models/campaign.model';
import Cookies from 'universal-cookie'
import ReactModal from 'react-modal';
ReactModal.setAppElement('#root');

function App() {

    const [campaignsList, setCampaignsList] = useState([])
    const [newCampaignIsOpen, setNewCampaignIsOpen] = useState(false)

    useEffect(()=>{
        const cookies = new Cookies()
        setCampaignsList(cookies.get('campaigns'))


        // cookies.set("campaigns", [1,2,3])
    },[])

    const closeNewCampaign = ()=>{
        setNewCampaignIsOpen(false)
    }

    return (
        <div id='structure'>
            <ReactModal 
                isOpen={newCampaignIsOpen}
                onRequestClose={closeNewCampaign}
                contentLabel="Example Modal">
                
                <button onClick={closeNewCampaign}>close</button>
                <div>I am a modal</div>

            </ReactModal>
        </div>
    );
}

export default App;
