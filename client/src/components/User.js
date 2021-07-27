import { useEffect, useState } from 'react'
import { Card, Row, Col, Image, Container, Button, Form } from 'react-bootstrap'
import Shit from './Shit'

function User(props){
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [sections, setSections] = useState([])
    const [comments, setComments] = useState([])

    const fetchData = async() => {
        console.log(props.viewFocus.name)
        await fetch('/users/'+props.viewFocus.name, {
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
                window.alert(error)
                return Promise.reject(error);
            }
            console.log(data)
            setUser(data)
            setPosts(data.Posts)
            setSections(data.Sections)
            setComments(data.Comments)
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }



    useEffect(() => {  
        fetchData();

    }, [props.viewFocus])
    
    return(
        <Container>
            <h1>{user.displayName}'s Profile</h1>
            <Row>
                <Col xs={12} sm={12} md={12} lg={6} xl={5}>
                    <h2>Posts</h2>
                    {(posts.length > 0 ) ?
                        posts.map( post => 
                            <Card key={post.id+post.title} onClick={event => props.onFocusChange({type: 'post', name: post.title})}>
                                <Card.Body>
                                    <Row>
                                            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                                <Shit shitFor={{type: 'post', id: post.id}} />
                                            </Col>
                                            <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                                                <Card.Title>{
                                                    post.title.length > 125 ?
                                                    post.title.substring(0, 125)+'...' :
                                                    post.title
                                                    }
                                                </Card.Title>
                                                <Card.Text>
                                                {
                                                    post.body.length > 125 ?
                                                    post.body.substring(0, 125)+'...' :
                                                    post.body
                                                    }
                                                </Card.Text>
                                            </Col>
                                        </Row>

                                </Card.Body>
                            </Card> 
                        ) : "0 found"}
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={4} className="pt-2">
                <h2>Comments</h2>
                            {(comments.length > 0 ) ?
                    comments.map( comment => 
                        <Card key={comment.id+user.displayName} onClick={event => props.onFocusChange({type: 'post', name: comment.Post.title})}>
                            <Card.Body>
                                <Row>
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                        <Shit shitFor={{type: 'comment', id: comment.id}} />
                                    </Col>
                                    <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                                        <Card.Title>{
                                            user.displayName.length > 125 ?
                                            user.displayName.substring(0, 125)+'...' :
                                            user.displayName
                                            } on 
                                            "{comment.Post?
                                                (comment.Post.title.length > 125) ?
                                                comment.Post.title.substring(0, 125)+'...' :
                                                comment.Post.title
                                                : ""}
                                            {comment.parent ?
                                                (comment.parent.body.length > 125) ?
                                                comment.parent.body.substring(0, 125)+'...' :
                                                comment.parent.body
                                                : ""}"
                                        </Card.Title>
                                        <Card.Text>
                                            {comment.body}
                                        </Card.Text>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card> 
                ) : "0 found"}
                    </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={3} className="pt-2">
                    <h2>Sections</h2>
                    {(sections.length > 0 ) ?
                sections.map( section => 
                <Card key={section.id+section.title} onClick={event => props.onFocusChange({type: 'section', name: section.title})}>
                    <Card.Body>
                        <Card.Title>{
                            section.title.length > 125 ?
                            section.title.substring(0, 125)+'...' :
                            section.title
                            }
                        </Card.Title>
                        <Card.Text>
                        {
                            section.description.length > 125 ?
                            section.description.substring(0, 125)+'...' :
                            section.description
                            }
                        </Card.Text>
                        </Card.Body>
                    </Card> 
                    ) : "0 found" }      
                </Col>
            </Row>
        </Container>
    );
}

export default User