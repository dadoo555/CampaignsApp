import { useEffect, useState } from 'react';
import './styles/App.css';
import Cookies from 'universal-cookie'
import SaveOrEditCampaign from './components/SaveOrEditCampaign';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Campaign } from './models/campaign.model';
import LoadingModal from './components/LoadingModal';


function App() {
    const [campaigns, setCampaigns] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(undefined)
    const [isSaveOrEditCampaignOpen, setIsSaveOrEditCampaignOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [filterValue, setFilterValue] = useState('')
    const [filterField, setFilterField] = useState('name')
    const [sortDirection, setSortDirection] = useState(0)
    const [sortField, setSortField] = useState('')

    useEffect(()=>{
        const db = new Cookies()
        const campaignTable = db.get('campaigns')
        const campaigns = campaignTable?.map(r => Campaign.fromRecord(r));
        if (campaigns){
            setCampaigns(campaigns)
        }
    },[])

    const closeNewCampaign = ()=>{
        setIsSaveOrEditCampaignOpen(false)
    }

    const saveCampaign = (newCampaign)=>{
        const newCampaigns = [...campaigns]
        if (selectedCampaign){
            // edit campaign
            const index = newCampaigns.indexOf(selectedCampaign)
            newCampaigns[index] = newCampaign
        } else {
            // new campaign
            newCampaigns.push(newCampaign)
        }
        const db = new Cookies()
        const allRecords = newCampaigns.map(c => c.toRecord());
        db.set("campaigns", JSON.stringify(allRecords))

        setCampaigns(newCampaigns)
    }

    const handleEditCampaign = (campaign)=>{
        setSelectedCampaign(campaign)
        setIsSaveOrEditCampaignOpen(true)
    }

    const handleNewCampaign = ()=>{
        setSelectedCampaign(undefined)
        setIsSaveOrEditCampaignOpen(true) 
    }

    function delay(miliseconds) {
        return new Promise(function(resolve) {
            setTimeout(resolve, miliseconds);
        });
    }

    const handleChangeStatus = async(campaign)=>{
        setIsLoading(true)
        
        await delay(500)

        // copy c. list
        const oldStatusId = campaign.statusId
        const newCampaigns = [...campaigns]
        const index = campaigns.indexOf(campaign)
        
        // actual campaign to change
        campaign.statusId = campaign.statusId === 1 ? 0 : 1

        // change
        newCampaigns[index] = campaign

        // apply
        const db = new Cookies()
        const allRecords = newCampaigns.map(c => c.toRecord());
        db.set("campaigns", JSON.stringify(allRecords))
        setCampaigns(newCampaigns)
        
        // clear
        setIsLoading(false)
        const message = oldStatusId === 1 ? 'Successfully removed!' : 'Activated successfully!'
        toast.success(message)
    }

    const handleSetNewFilterValue = (value)=>{
        setFilterValue(value)
    } 

    const handleSetNewFilterField = (value)=>{
        setFilterField(value)
    }

    const updateSortField = (field)=>{
        if (sortField === field){
            const newDirection = sortDirection === 0 ? 1 : sortDirection === 1 ? 2 : 0
            setSortDirection(newDirection)
        } else {
            setSortField(field)
            setSortDirection(1)
        }

    }

    // Filter ............
    const handleFilter = (elem)=>{
        if (filterField === 'startTime' || filterField === 'endTime'){
            return elem[filterField].includes(filterValue) 
        }
        return elem[filterField].toLowerCase().includes(filterValue.toLowerCase()) 
    }

    let campaignsList = campaigns.filter(handleFilter) 

    // Sort ..........
    const handleSort = (a, b)=>{
        const [c1, c2] = sortDirection === 1 ? [a,b] : [b,a];
        return c1[sortField].localeCompare(c2[sortField])
    }

    if (sortField && (sortDirection > 0)){
        campaignsList.sort(handleSort)
    }

    return (
        <>
        <ToastContainer />
        <div id='structure'>
            <LoadingModal isOpen={isLoading}/>

            <SaveOrEditCampaign isOpen={isSaveOrEditCampaignOpen} close={closeNewCampaign} saveCampaign={saveCampaign} 
                        selectedCampaign={selectedCampaign} />
            
            
            <button id='btn-new' onClick={handleNewCampaign}>New Campaign</button>

            <SearchBox  setNewFilterValue={handleSetNewFilterValue} 
                        filterValue={filterValue}
                        filterField={filterField}
                        setNewFilterField={handleSetNewFilterField}/>

            <div id='table-container'>
                <TableHeader    sortDirection={sortDirection} 
                                updateSortField={updateSortField} 
                                sortField={sortField}/>
                {campaignsList && campaignsList.map((c, i)=>{
                    return(
                        <ListIem key={c.id} campaign={c} editCampaign={handleEditCampaign} changeStatus={handleChangeStatus}/>
                    )
                })}

                {filterValue && campaignsList.length === 0 && <div id='no-results'>No results found...</div>}

                {campaigns.length === 0 && 
                    <div id='no-campaigns'>
                        No registered campaigns...
                    </div>
                }
            </div>
        </div>
        </> 
    );
}


const TableHeader = ({sortDirection, sortField, updateSortField})=>{

    const IconSort = ({field})=>{
        
        let src = '' 
        if (sortField === field){
            src = sortDirection === 0 ? 'swap_vert' : sortDirection === 1 ? 'south' : 'north'
        } else {
            src = 'swap_vert'
        }

        return <Icon src={src} optionalClass={'icon-sort'} onClick={()=>{updateSortField(field)}}/>
    }

    return (
        <div id='table-header'>
            <div className='name'>
                <p>Name</p>
                <IconSort field={'name'}/>
            </div>
            <div className='type'>
                <p>Type</p>
                <IconSort field={'typeDescription'}/>
            </div>
            <div className='s-time'>
                <p>Start Date</p>
                <IconSort field={'startTime'}/>
            </div>
            <div className='e-time'>
                <p>End Date</p>
                <IconSort field={'endTime'}/>
            </div>
            <div className='status'>
                <p>Status</p>
                <IconSort field={'status'}/>
            </div>
            <div className='actions'>
                <p>Actions</p>
            </div>
        </div>
    )
}


const ListIem = ({campaign, editCampaign, changeStatus})=>{
    
    const {name, typeDescription, startTime, endTime, status} = campaign;

    return (
        <div className='table-item'>
            <p className='name'>{name}</p>    
            <p className='type'>{typeDescription}</p>    
            <p className='s-time'>{startTime}</p>    
            <p className='e-time'>{endTime}</p>    
            <p className='status'>{status}</p>    
            <div className='actions'>
                {status !== 'aktiv' ? 
                    <button className='btn-active' onClick={()=>{changeStatus(campaign)}}>
                        <Icon src={'history'} optionalClass={'icon-btn-changestatus'}/>
                        Activate
                        <ToolTip text={'This action will reactivate the campaign'}/>
                    </button> 
                    :
                    <button className='btn-delete' onClick={()=>{changeStatus(campaign)}}>
                        <Icon src={'delete'} optionalClass={'icon-btn-changestatus'}/>
                        Remove
                        <ToolTip text={'This action will deactivate the campaign'}/>
                    </button>    
                }
                <button className='btn-edit-campaign' onClick={()=>{editCampaign(campaign)}}>
                    <Icon src={'edit_note'} optionalClass={'icon-btn-changestatus'}/>
                    Edit
                </button>    
            </div> 
        </div>
    )
}

const Icon = ({src, optionalClass, onClick})=>{
    return <span style={{userSelect: 'none'}} onClick={onClick} className={"material-symbols-outlined " + optionalClass}>{src}</span>
}

const ToolTip = ({text})=>{
    return (
        <div className='tooltip'>
            <p style={{margin: '0'}}>{text}</p>
        </div>
    )
}

const SearchBox = ({filterValue, setNewFilterValue, filterField, setNewFilterField})=>{
    return (
    <div id='search-container'>
        <select id="dropdown-search" value={filterField} onChange={(e)=>{setNewFilterField(e.target.value)}}>
            <option value="name">Name</option>
            <option value="typeDescription">Type</option>
            <option value="startTime">Start Date</option>
            <option value="endTime">End Date</option>
            <option value="status">Status</option>
        </select>
        <div id='text-search-container'>
            <input value={filterValue} onChange={(e)=>{setNewFilterValue(e.target.value)}} type="text" placeholder='Search...'/>
            {filterValue && <Icon onClick={()=>{setNewFilterValue('')}} src={'close'} optionalClass={'clear-button'}/>}
        </div>
        <Icon src={'search'} optionalClass={'search-icon'}/>
    </div>
    )
}


export default App;
