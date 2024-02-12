import ReactModal from "react-modal"
import Loading from "./Loading"


export default function LoadingModal({isOpen}){
    return <ReactModal isOpen={isOpen} parentSelector={() => document.querySelector('#structure')}>
                <Loading/>
            </ReactModal>
}