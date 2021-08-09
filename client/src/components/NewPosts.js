import { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Shit from './Shit'

function NewPosts(props){
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])

    const fetchData = async() => {
        await fetch('/posts/unauth/0/25', {
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
            console.log(data)
            const postArray = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            console.log(postArray)
            setPosts(data)
            console.log(data)
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {
        fetchData()

    }, [props.isLoggedIn, props.viewFocus])
    

    return(
        <Container>
        <h2>New Posts</h2>
            {(posts.length > 0) &&
            
               posts.map(post =>
                    <Card key={post.id+post.title}>
                    <Card.Body>
                        <Row>
                            <Col xs={2} sm={2} md={1} lg={1} xl={1} className="p-0">
                                <Shit shitFor={{type: 'post', id: post.id.toString()}} />
                            </Col>
                            <Col xs={10} sm={10} md={11} lg={11} xl={11} onClick={() => props.onFocusChange({type: 'post', name: post.title})}>
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
                )
            }
        </Container>
    );
}

export default NewPosts