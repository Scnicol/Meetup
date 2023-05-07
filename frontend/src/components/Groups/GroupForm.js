import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGroup } from '../../store/groups';


function GroupForm({ group, formTitle, formSubmit, submitAction, hideForm }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState(group.name);
    const [about, setAbout] = useState(group.about);
    const [type, setType] = useState(group.type);
    const [isPrivate, setIsPrivate] = useState(group.private);
    let spot;
    if (group.city && group.state) { spot = `${group.city}, ${group.state}` }
    const [location, setLocation] = useState(spot);
    //todo update the useState with the current groups Image url
    const [imageUrl, setImageUrl] = useState('');

    const [errors, setErrors] = useState({ name: [], about: [] });
    useEffect(() => {
        const validationErrors = { name: [], about: [] };
        if (name.length === 0) validationErrors.name.push('Name field is required');
        if (about.length < 30) validationErrors.about.push('Description needs 30 or more characters');
        setErrors(validationErrors);
    }, [name, about])


    const updateName = (e) => setName(e.target.value);
    const updateAbout = (e) => setAbout(e.target.value);
    const updateType = (e) => setType(e.target.value);
    const updateIsPrivate = (e) => setIsPrivate(e.target.value);
    const updateLocation = (e) => setLocation(e.target.value);
    const updateImageUrl = (e) => setImageUrl(e.target.value);

    const currentUser = useSelector(state => state.session.user)

    if (!currentUser) return null;

    const organizerId = currentUser.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let splitCityState = location.split(',').map((e) => e.trim());
        const [city, state] = splitCityState;
        const payload = {
            ...group,
            organizerId,
            name,
            about,
            type,
            isPrivate,
            city,
            state,
            imageUrl,
        };


        let submittedGroup;
        submittedGroup = await dispatch(submitAction(payload));

        if (submittedGroup) {
            history.push(`/groups/${group.id}`);
            hideForm();
        }
    };
    console.log(formTitle, organizerId, group.organizerId)

    if (formTitle == 'Update your' && organizerId !== group.organizerId) history.push(`/`);

    return (
        <>
            <h1>{formTitle} Group</h1>
            <form onSubmit={handleSubmit}>
                <h2>
                    First, set your group's location
                </h2>
                <p>
                    Meetup groups meet locally, in person and online. We'll connect you with people
                    in your area, and more can join you online.
                </p>
                <input
                    type="text"
                    placeholder="City, STATE"
                    value={location}
                    onChange={updateLocation} />
                <h2>
                    What will your group's name be?
                </h2>
                <p>
                    Choose a name that will give people a clear idea of what the group is about.
                    Feel free to get creative! You can edit this later if you change your mind.
                </p>
                <input
                    type="text"
                    placeholder="what is your group name?"
                    value={name}
                    onChange={updateName} />
                <ul className='errors'>
                    {errors.name.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
                <h2>
                    Describe the purpose of your group
                </h2>
                <p>
                    People will see this when we promote your group, but you'll be able to add to it later, too.
                    <p>1. What's the purpose of the group?</p>
                    <p>2. Who should join?</p>
                    <p>3. What will you do at your events?</p>
                </p>
                <input
                    type="textarea"
                    placeholder="Please write at least 30 characters"
                    value={about}
                    onChange={updateAbout} />
                    <ul className='errors'>
                    {errors.about.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
                <h2>
                    Final steps...
                </h2>
                <p>Is this an in person or online group?</p>
                <select
                    value={type}
                    onChange={updateType}>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                <p>Is this group private or public?</p>
                <select
                    value={isPrivate}
                    onChange={updateIsPrivate}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <p>Please add an image url for your group below:</p>
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={updateImageUrl} />
                <h2>
                    <button type="submit" disabled={errors.name.length > 0 || errors.about.length > 0}>{formSubmit} Group</button>
                </h2>
            </form>
        </>

    )
}

export default GroupForm;
