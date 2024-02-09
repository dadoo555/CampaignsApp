import { useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify'
import { Campaign } from '../models/campaign.model';
import Cookies from 'universal-cookie'

ReactModal.setAppElement('#root');

export default function NewCampaign({isOpen, close, addCampaign}){
    
    const [name, setName] = useState("")
    const [type, setType] = useState(1)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")


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

    const handleSave = ()=>{
        // check fields
        const errorsList = []
        if (!name){errorsList.push(toast.warning("The name field is required"))}
        if (!type){errorsList.push(toast.warning("The type field is required"))}
        if (!startTime){errorsList.push(toast.warning("The start-time field is required"))}
        if (!endTime){errorsList.push(toast.warning("The end-time field is required"))}
        if (errorsList[0]){return}

        // save
        try {
            const campaign = new Campaign(name, type, startTime, endTime, 1)
            addCampaign(campaign)
        } catch (error) {
            alert(error)
        }


        // clear and close and display confirm box
        handleClose()
        toast.success("Saved successfully")
    }

    const handleClose = ()=>{
        setName("")
        setType(1)
        setStartTime("")
        setEndTime("")
        close()
    }

    return (
        <ReactModal isOpen={isOpen}>

            <button onClick={handleClose}>close</button>
            <h2>New Campaign</h2>

            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" maxLength={50} value={name} onChange={(e)=>{setName(e.target.value)}}/>
            
            <label htmlFor="name">Type</label>
            <select id='type' name='type' value={type} onChange={(e)=>{setType(e.target.value)}}>
                <option value="1">Standart</option>
                <option value="2">AB Test</option>
                <option value="3">MV Test</option>
            </select>

            <label htmlFor="start-time"></label>
            <input type="date" name="start-time" id="start-time" value={startTime} onChange={(e)=>{handleSelectStartTime(e.target.value)}}/>

            <label htmlFor="end-time"></label>
            <input type="date" name="end-time" id="end-time" value={endTime} onChange={(e)=>{handleSelectEndTime(e.target.value)}}/>

            <button onClick={handleClose}>Cancel</button>
            <button onClick={handleSave}>Save</button>

        </ReactModal>
    )
}
