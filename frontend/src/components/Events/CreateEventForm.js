
import { useHistory, useParams } from 'react-router-dom';
import { createEvent } from '../../store/events';
import EventForm from './EventForm';


function CreateEventForm({ hideForm }) {
const {groupId} = useParams();
    const event = {
        name: '',
        description: '',
        type: 'In person',
        price: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
    }

    function submitAction(event) {
        const newEvent = {...event}
        return createEvent(newEvent, groupId);
    }

    return (
        <EventForm event={event} groupId={groupId} formType="Create" submitAction={submitAction} hideForm={hideForm}/>
    );
}

export default CreateEventForm;
