
import { useHistory, useParams } from 'react-router-dom';
import { createGroup } from '../../store/groups';
import GroupForm from './GroupForm';


function CreateGroupForm({ hideForm }) {

    const group = {
        name: '',
        about: '',
        type: 'In person',
        isPrivate: true,
        city: '',
        state: '',
        imageUrl: '',
    }

    function submitAction(group) {
        const newGroup = {...group}
        return createGroup(newGroup);
    }

    return (
        <GroupForm group={group} formType="Start a New" submitAction={submitAction} hideForm={hideForm}/>
    );

}

export default CreateGroupForm;
