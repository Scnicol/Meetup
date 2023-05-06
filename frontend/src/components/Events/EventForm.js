import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getVenues } from '../../store/venues';
import CurrencyInput from 'react-currency-input-field';


function EventForm({ event, formType, submitAction, hideForm, groupId }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const [venueId, setVenueId] = useState('');
    const [name, setName] = useState(event.name);
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('')


    const updateName = (e) => setName(e.target.value);
    const updateVenueId = (e) => {setVenueId(e.target.value)};
    const updateType = (e) => {setType(e.target.value)};
    const updateCapacity = (e) => setCapacity(e.target.value);
    const updatePrice = (value) => setPrice(value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updateStartDate = (e) => setStartDate(e.target.value);
    const updateEndDate = (e) => setEndDate(e.target.value);
    const updateImageUrl = (e) => setImageUrl(e.target.value);

    useEffect(() => {
        dispatch(getVenues(groupId));
    }, [dispatch])

    const currentUser = useSelector(state => state.session.user)
    const venues = Object.values(useSelector(state => state.venues));
    console.log(type)
    if (!currentUser) return null;

    const organizerId = currentUser.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
        };

        let event;
        event = await dispatch(submitAction(payload));

        if (event) {
            history.push(`/events/${event.id}`);
            hideForm();
        }
    };

    return (
        <>
            <h1>Create an event for </h1>
            <form onSubmit={handleSubmit}>
                <p>what is the name of your event?</p>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={updateName} />
                <p>is this an in person or online event?</p>
                <select
                    value={type}
                    onChange={updateType}>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                <p>How many people can come?</p>
                <input
                type="number"
                placeholder="Capacity"
                min="0"
                max="100"
                value={capacity}
                onChange={updateCapacity}/>
                <p>Please select a venue for the event</p>
                <select
                    value={venueId}
                    onChange={updateVenueId}>
                    {venues.map(venue =>
                        <option key={venue.id} value={venue.id}>{venue.address}</option>
                    )};
                </select>
                <p>What is the price for your event?</p>
                <CurrencyInput
                    prefix="$"
                    id="input-example"
                    name="input-name"
                    placeholder='$0'
                    decimalsLimit={2}
                    onValueChange={updatePrice} />
                <p>When does your event start?</p>
                <input
                    type="date"
                    onChange={updateStartDate} />
                <p>When does your event end?</p>
                <input
                    type="date"
                    onChange={updateEndDate} />
                <p>Please add an image url for your event below:</p>
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={updateImageUrl} />
                <p>Please describe your event:</p>
                <input
                    type="textarea"
                    placeholder="Please include at least 50 characters"
                    value={description}
                    onChange={updateDescription} />
                <h2>
                    <button type="submit">{formType} Event</button>
                </h2>
            </form>
        </>

    )
}

export default EventForm;
