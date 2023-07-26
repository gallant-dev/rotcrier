import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Shit from '../components/Shit'

function TopPosts(props){
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])

    const fetchData = async() => {
        await fetch('/api/posts/unauth/0/25', {
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
            const postArray = data.sort((a, b) => b.Shits.length - a.Shits.length)
            setPosts(postArray)
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {
        fetchData()

    }, [props.isLoggedIn, props.viewFocus])
    


    return(
        <>

        <Container>
        <h2>Top Posts</h2>
            {(posts.length > 0) &&          
               posts.map((post, index) =>
               <Row key={post.id+post.title} className="row align-items-center">
                   <Col xs={1} sm={1} md={1} lg={1} xl={1} >
                        <h6 className=" float-end">{index+1}</h6>
                   </Col>
                   <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xs={2} sm={2} md={1} lg={1} xl={1} className="p-0">
                                        <Shit shitFor={{type: 'post', id: post.id}} />
                                    </Col>
                                    <Col xs={10} sm={10} md={11} lg={11} xl={11} onClick={() => props.onFocusChange({type: 'post', name: post.title})}>
                                        <Link to={`/post/${post.id}`} style={{all: 'unset'}}>
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
                                        </Link>                      
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card> 
                   </Col>
               </Row>
                )
            }
        </Container>
        </>
    );
}

export default TopPosts