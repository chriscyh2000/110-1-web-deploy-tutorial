import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { COMMENT_SUBSCRIPTION, POST_QUERY, CREATECOMMENT_MUTATION } from '../graphql';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import "../App.css"
import status from '../hook/status';
import { Comment, Avatar, Input, Button } from 'antd';
import Comments from './Comments';

const { TextArea } = Input;

const Post = (props) => {
    const { data, loading, subscribeToMore } = useQuery(POST_QUERY, {
        variables: {
            post_id: props.post_id
        }
    });

    const [createComment] = useMutation(CREATECOMMENT_MUTATION);
    const [text, setText] = useState('');

    const submitComment = async () => {
        // Something...

        if(!props.user_id) { // check log in
            status.display({
                type: "error",
                msg: "Please log in first."
            })
            return;
        }
        if(!text){
            status.display({
                type: "error",
                msg: "comment cannot be empty."
            })
            return;
        }
        const payload =  await createComment({
            variables: {
                sender: props.user_id,
                text: text,
                post: props.post_id
            }
        })

        status.display({
            type: "success",
            msg: "comment replied."
        })
        console.log("submit!");
        setText('');
    }

    useEffect(() => {
        try{
            subscribeToMore({
                document: COMMENT_SUBSCRIPTION,
                variables: {
                    post_id: props.post_id
                },
                updateQuery: (prev, { subscriptionData }) => {
                    if(!subscriptionData.data) return prev;

                    return {
                        post: {
                            ...prev.post,
                            comments: [...prev.post.comments, subscriptionData.data.comment.data]
                        }
                    }
                }
            })
        }
        catch(e){}
    }, [subscribeToMore]);

    if(loading && data === undefined){
        return(
            <div className="post">
                <LoadingOutlined style={{ fontSize: "70px" }}/>
            </div>
        )
    }


    return (
        <div className="post">
            <div className='postweebao'>
                <h2 className='postTitle'>{props.store}</h2>
                <h3 className='postTitle1'>{data.post.title}</h3>
                <Comment
                    className='postInner'
                    author={<a className='postMain'>{data.post.author+" · "+data.post.score+"⭐️"}</a>}
                    avatar={<Avatar icon={<UserOutlined />} />}
                    content={
                        <p className='postMain'>{data.post.body}</p>
                    }
                />
            </div>
            <div className='commentBox'>
                <h3 style={{ textAlign:"left" }}>{ data.post.comments.length + ((data.post.comments.length > 1)? " comments":" comment")}</h3>
                { data.post.comments.map((comment) => {
                    return (
                        <Comments c={comment}/>
                    )
                })}
                <Input.Search
                    autoSize
                    style={{ width: 'calc(100% - 10px)', textAlign: "left" }}
                    value={text}
                    onChange={(e) => { setText(e.target.value); }}
                    enterButton="reply"
                    placeholder="write down your comment..."
                    onSearch={submitComment}
                ></Input.Search>
                {/* <Input.Group compact>
                    <TextArea style={{ width: 'calc(100% - 85px)', textAlign: "left" }} defaultValue={text} placeholder="write a comment..." onChange={(value) => setText(value)} autoSize />
                    <Button type="primary" onClick={submitComment}>Submit</Button>
                </Input.Group>            */}
            </div>
            <br/>
            <br/>
        </div>
    )
}

export default Post;