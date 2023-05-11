
import { useHistory, useParams } from 'react-router-dom';
import { createEvent } from '../../store/events';
import EventForm from './EventForm';

//TODO need to update the imageUrl to actually take in and make a fetch in our thunk to save the imageUrl
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
        <EventForm event={event} groupId={groupId} formTitle="Create" formSubmit="Create" submitAction={submitAction} hideForm={hideForm}/>
    );
}

export default CreateEventForm;
