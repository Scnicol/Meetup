import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGroup } from '../../store/groups';


function CreateGroupForm({ hideForm }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState("In person");
    const [isPrivate, setIsPrivate] = useState(true);
    const [location, setLocation] = useState('');
    const [imageUrl, setImageUrl] = useState('');


    const updateName = (e) => setName(e.target.value);
    const updateAbout = (e) => setAbout(e.target.value);
    const updateType = (e) => setType(e.target.value);
    const updateIsPrivate = (e) => {
        console.log(e.target.value)
        if (e.target.value === 'Private') setIsPrivate(true);
        if (e.target.value === 'Public') setIsPrivate(false)
    };
    const updateLocation = (e) => setLocation(e.target.value);
    const updateImageUrl = (e) => setImageUrl(e.target.value);

    const currentUser = useSelector(state => state.session.user)

    if (!currentUser) return null;
    
    const organizerId = currentUser.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let splitCityState = location.split(',');
        const [city, state] = splitCityState;
        console.log(organizerId, "name:", name, "about:", about, "type:", type, "isPrivate:", isPrivate, "city:", city, "state:", state, "---------------")
        const payload = {
            organizerId,
            name,
            about,
            type,
            isPrivate,
            city,
            state,
            imageUrl,
        };

        let createdGroup;
        createdGroup = await dispatch(createGroup(payload));

        if (createdGroup) {
            history.push(`/groups/${createdGroup.id}`);
            hideForm();
        }
    };

    return (
        <>
            <h1>Create Group</h1>
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
                <h2>
                    Now describe what your group will be about
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
                    value={type}
                    onChange={updateIsPrivate}>
                    <option>Private</option>
                    <option>Public</option>
                </select>
                <p>Please add an image url for your group below:</p>
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={updateImageUrl} />
                <h2>
                    <button type="submit">Create new Group</button>
                </h2>
            </form>
        </>

    )
}

export default CreateGroupForm;
