import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Pagination, Card, Row, Col } from 'react-bootstrap'
import Shit from './Shit'

function Home(props){
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])

    const fetchData = async(displayName) => {
        console.log(displayName)
        if(displayName != null){
            await fetch('/api/users/'+displayName+'/memberships/posts/0/25', {
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
                setUser(data)
                const postArray = data.memberships.map(section => section.Posts).flat().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                setPosts(postArray)
                if(postArray.length == 0){
                    props.onFocusChange({type: 'menu', name: 'Top Posts'})
                }
            })
            .catch(error => {
                console.error('Error! ', error);
            })

        }
        else {
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
                const postArray = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                setPosts(postArray)
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }

    }

    useEffect(() => {
        const displayName = sessionStorage.getItem('displayName')
        if(displayName){         
            fetchData(displayName)
        }
        else {
            fetchData(null)
        }

    }, [props.isLoggedIn, props.viewFocus])
    
    const pageCount = () => {
        const pageCount = Math.ceil(props.memberSections.length/25)
        return pageCount
    }

    let active = 1;
    let items = [];
    for (let number = 1; number <= pageCount(); number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
            {number}
            </Pagination.Item>,
        );
    }

    return(
        <Container>
        <h2>Recent Updates</h2>
            {(posts.length > 0) &&
               posts.map(post =>
                <Card key={post.id+post.title}>
                <Card.Body>
                    <Row>
                        <Col xs={2} sm={2} md={1} lg={1} xl={1} className="p-0">
                            <Shit shitFor={{type: 'post', id: post.id.toString()}} />
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
                )
            }
        </Container>
    );
}

export default Home