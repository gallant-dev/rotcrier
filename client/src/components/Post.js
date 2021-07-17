import { useEffect, useState } from 'react'
import { Card, Row, Col, Image } from 'react-bootstrap'
import editIcon from '../images/icons8-edit-48.png'

function Post(props) {
    const [post, setPost] = useState({})
    //Had to set state of section seperately because react is returning null when I access
    //the section title through the render component on first load only. If the code is edited
    //and the same code is pasted during run the section title is obtained correctly. Also if I
    //define the section here seperately from the post it renders correctly. It is almost as if 
    //in react it starts rendering prior to getting the nested section data.
    const [section, setSection] = useState({})
    const [userId, setUserId] = useState()

    useEffect(() => {
        console.log(props.viewFocus.name)
        const fetchData = async() => {
            await fetch('/posts/'+props.viewFocus.name, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
    
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status 
                    const error = (data && data.message) || response.status;
                    console.log(error)
                    return Promise.reject(error);
                }

                setUserId(sessionStorage.getItem('id'))
                setPost(data)
                setSection(data.Section)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }
        fetchData();

    }, [props.viewFocus])

    return(
    <Row className="justify-content-start">
        <Col xs={11} sm={11} md={10} lg={9} xl={8}>
        <h2 onClick={event => props.onFocusChange({type: "section", name: section.title})} value={section.title}>/{section.title}/</h2>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </Col>
        <Col xs={1} sm={1} md={1} lg={1} xl={1}>
        {post.UserId == userId && 
            <Image className="edit"
            width={25}
            height={25}
            src={editIcon}
            alt="Edit"
            />
        }
        </Col>
    </Row>
    );
}

export default Post