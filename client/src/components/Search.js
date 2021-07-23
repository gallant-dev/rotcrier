import { useEffect, useState } from 'react'
import { Card, Row, Col, Image, Container, Button, Form } from 'react-bootstrap'
import Shit from './Shit'


function Search(props){
    console.log(props.search)
    const [userId, setUserId] = useState()
    const [sections, setSections] = useState([])
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const url = '/search/'+encodeURIComponent(props.search)
            await fetch(url, {
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
                    return Promise.reject(error);
                }

                setUserId(sessionStorage.getItem('id'))
                setSections(data.Sections)
                setPosts(data.Posts)
                setUsers(data.Users)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }
        
        fetchData();

    }, [props.viewFocus])

    return(
        <Container>
            <Row>
                <Col xs={12} sm={12} md={12} lg={7} xl={6}>
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
                <Col xs={12} sm={12} md={6} lg={5} xl={3} className="pt-2">
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
            ) : "0 found"}
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={3} className="pt-2">
                    <h2>Users</h2>
                            {(users.length > 0 ) ?
                    users.map( user => 
                        <Card key={user.id+user.displayName} onClick={event => props.onFocusChange({type: 'user', name: user.displayName})}>
                            <Card.Body>
                                <Card.Title>{
                                    user.displayName.length > 125 ?
                                    user.displayName.substring(0, 125)+'...' :
                                    user.displayName
                                    }
                                </Card.Title>
                            </Card.Body>
                        </Card> 
                    ) : "0 found" }      
                </Col>
            </Row>
        </Container>
    );
}

export default Search