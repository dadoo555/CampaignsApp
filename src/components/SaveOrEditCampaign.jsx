import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify'
import { Campaign } from '../models/campaign.model';
import '../styles/EditCampaign.css'

ReactModal.setAppElement('#root');

// Simulates async save operation (e.g. calling a backend) 
function delay(miliseconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, miliseconds);
    });
}

export default function SaveOrEditCampaign({isOpen, close, saveCampaign, selectedCampaign}){
    
    const [name, setName] = useState("")
    const [type, setType] = useState(1)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(()=>{
        // Load campaign data, if exists
        if (selectedCampaign){
            setName(selectedCampaign.name)
            setType(selectedCampaign.type)
            setStartTime(selectedCampaign.startTime)
            setEndTime(selectedCampaign.endTime)
        } else {
            clearForm();
        }
    },[selectedCampaign, isOpen])

    const handleSelectStartTime = (date)=>{
        // check date
        if (endTime && date > endTime){
            toast.warning("The starting day cannot be greater than the ending day")
            return
        }

        setStartTime(date)
    }
    
    const handleSelectEndTime = (date)=>{
        // check date
        if (startTime && date < startTime){
            toast.warning("The end day cannot be less than the start day")
            return
        }

        setEndTime(date)
    }

    const validateFields = () =>{
        const errorsList = []
        if (!name){errorsList.push(toast.warning("The name field is required"))}
        if (!type){errorsList.push(toast.warning("The type field is required"))}
        if (!startTime){errorsList.push(toast.warning("The start-time field is required"))}
        if (!endTime){errorsList.push(toast.warning("The end-time field is required"))}
        return errorsList
    }
    const handleSave = async ()=>{
        // check fields
        const errors = validateFields();
        if(errors.length) return;

        setIsProcessing(true);

        await delay(500) // fake call to backend (for)

        // save
        try {
            const campaign = new Campaign(undefined, name, type, startTime, endTime, 1)
            saveCampaign(campaign)
            toast.success("Saved successfully")
        } catch (error) {
            console.error(error);
            toast.error(error);
        } finally{
            // clear and close and display confirm box
            handleClose()
        }
    }
    const clearForm = () =>{
        setName("")
        setType(1)
        setStartTime("")
        setEndTime("")
        setIsProcessing(false);
    }

    const handleClose = ()=>{
        clearForm()
        close()
    }


    return (
        <ReactModal isOpen={isOpen}  parentSelector={() => document.querySelector('#structure')}>
            {isProcessing ? 
            <p>Loading...</p>
            : <>
                <button id='btn-close' onClick={handleClose}>x</button>
                <h2>{selectedCampaign ? 'Edit' : 'New'} Campaign</h2>

                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" maxLength={50} value={name} onChange={(e)=>{setName(e.target.value)}} autoComplete='off'/>
                
                <label htmlFor="name">Type</label>
                <select id='type' name='type' value={type} onChange={(e)=>{setType(e.target.value)}}>
                    <option value="1">Standart</option>
                    <option value="2">AB Test</option>
                    <option value="3">MV Test</option>
                </select>

                <label htmlFor="start-time">Start Time</label>
                <input type="date" name="start-time" id="start-time" value={startTime} onChange={(e)=>{handleSelectStartTime(e.target.value)}}/>

                <label htmlFor="end-time">End Time</label>
                <input type="date" name="end-time" id="end-time" value={endTime} onChange={(e)=>{handleSelectEndTime(e.target.value)}}/>

                <div id='container-btns'>
                    <button id='btn-cancel' onClick={handleClose}>Cancel</button>
                    <button id='btn-save' onClick={handleSave}>Save</button>
                </div>
            </>
            }
            

        </ReactModal>
    )
}
