import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UserOutlined } from '@ant-design/icons';
import { EDITPROFILE_MUTATION } from '../graphql';
import status from '../hook/status'
import { Avatar, Descriptions, Button, Modal, Input } from 'antd';
const Profile = (props) => {
    const [value, setValue] = useState('');
    const [toRefetch, setToRefetch] = useState(false);
    const { TextArea } = Input;
    const [biography, setBiography] = useState((props.user === null) ? '' : props.user.biography); 

    if(toRefetch){
        // props.refetch();
        setToRefetch(false);
    }

    const [visible, setVisible] = useState(false);
    const [editProfile] = useMutation(EDITPROFILE_MUTATION);
    const requireSubmit = async (bio) => {
        const payload = await editProfile({
            variables: {
                userId: props.user.id,
                bio: bio
            }
        })
        if(payload === null) {
            status.display({
                type: 'error',
                msg: 'Error: edit profile error.'
            })
        }
        status.display({
            type: 'success',
            msg: 'Successfully edited your profile.'
        })
        setBiography(bio);
        setVisible(false);

        const newData = JSON.parse(JSON.stringify(props.user));
        newData.biography = bio;
        props.setUser(newData);
        props.refetch()
    }
    const handleSubmit = () => {
        const bio = value;
        setValue('');
        if(bio === ''){
            status.display({
                type: 'error',
                msg: 'Input your bio first!'
            })
            return;
        }
        requireSubmit(bio);
    }

    if(props.user === null){
        return <p>Please log in first</p>
    }
    return (
        <div>
            <Avatar size={64} icon={<UserOutlined />}/>
            <br></br>
            <br></br>
            <Descriptions title="Profile:" column={1}>
                <Descriptions.Item label="User Name">{props.user.name}</Descriptions.Item>
                <Descriptions.Item label="About Me">{biography}</Descriptions.Item>
            </Descriptions>
            <Button onClick={() => {setVisible(true)}} >Edit Profile</Button>
            <Modal visible={visible} onCancel={() => {setVisible(false)}} onOk={handleSubmit} closable={false}>
                <TextArea rows={10} 
                    placeholder="Introduce yourself..." 
                    showCount 
                    maxLength={300} 
                    onChange={(e) => { setValue(e.target.value) }} 
                    value={value}>
                </TextArea>
            </Modal>
        </div>
    )
}

export default Profile;