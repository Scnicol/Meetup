import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateGroup } from '../../store/groups';
import { getGroupDetails } from '../../store/groups';
import GroupForm from './GroupForm';


function UpdateGroupForm({ hideForm }) {

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupDetails(id))
    }, [dispatch])

    const group = useSelector(state => state.groups[id])

    if (!group) return null;

    function submitAction(group) {
        const newGroup = {...group, id: id}
        console.log(newGroup, 'newgroup inside submitAction')
        return updateGroup(newGroup);
    }
    // const dispatch = useDispatch();
    // const history = useHistory();
    // const [name, setName] = useState('');
    // const [about, setAbout] = useState('');
    // const [type, setType] = useState("In person");
    // const [isPrivate, setIsPrivate] = useState(true);
    // const [city, setCity] = useState('');
    // const [state, setState] = useState('');

    // const updateName = (e) => setName(e.target.value);
    // const updateAbout = (e) => setAbout(e.target.value);
    // const updateType = (e) => setType(e.target.value);
    // const updateIsPrivate = (e) => setIsPrivate(e.target.value);
    // const updateCity = (e) => setCity(e.target.value);
    // const updateState = (e) => setState(e.taget.value);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const payload = {
    //         name,
    //         about,
    //         type,
    //         isPrivate,
    //         city,
    //         state,
    //     };

    //     let updatedGroup;
    //     updatedGroup = await dispatch(updateGroup(payload));

    //     if (updatedGroup) {
    //         history.push(`/api/groups/${updatedGroup.id}`);
    //         hideForm();
    //     }
    // };

    return (
        <GroupForm group={group} formType="Update" submitAction={submitAction} hideForm={hideForm}/>
    );
}

export default UpdateGroupForm;
