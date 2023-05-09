
import { useHistory, useParams } from 'react-router-dom';
import { createGroup } from '../../store/groups';
import GroupForm from './GroupForm';


function CreateGroupForm({ hideForm }) {

    const group = {
        name: '',
        about: '',
        type: 'In person',
        private: true,
        city: '',
        state: '',
        imageUrl: '',
    }

    function submitAction(group, imageUrl) {
        return createGroup(group, imageUrl);
    }

    return (
        <GroupForm group={group} formTitle="Start a New" formSubmit="Create" submitAction={submitAction} hideForm={hideForm}/>
    );

}

export default CreateGroupForm;
