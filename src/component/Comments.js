import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COMMENT_SUBSCRIPTION, POST_QUERY } from '../graphql';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import "../App.css"
import { Comment, Avatar, Input } from 'antd';

const Comments = (props) => {

    const { c } = props;
    return (
        <Comment
            className='comment'
            author={<a className='postMain'>{c.sender}</a>}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={<p className='postMain'>{c.text}</p>}
        />
    )
}

export default Comments;