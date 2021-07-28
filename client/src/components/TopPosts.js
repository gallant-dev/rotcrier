import { useEffect, useState } from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Shit from './Shit'

function TopPosts(props){
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
            const postArray = data.sort((a, b) => b.Shits.length - a.Shits.length)
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
        <>

        <Container>
        <h2>Top Posts</h2>
            {(posts.length > 0) &&          
               posts.map((post, index) =>
               <Row>
                   <Col xs={1} sm={1} md={1} lg={1} xl={1} >
                       <Row className="justify-content-end">
                           <Col className="align-middle">
                                <h6>{index+1}</h6>
                           </Col>
                       </Row>
                   </Col>
                   <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                        <Card key={post.id+post.title}>
                            <Card.Body>
                                <Row>
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                        <Shit shitFor={{type: 'post', id: post.id.toString()}} />
                                    </Col>
                                    <Col xs={10} sm={10} md={10} lg={9} xl={8} onClick={event => props.onFocusChange({type: 'post', name: post.title})}>
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
                   </Col>
               </Row>
                )
            }
        </Container>
        </>
    );
}

export default TopPosts