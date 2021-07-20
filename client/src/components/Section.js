import { useEffect, useState } from 'react'
import { Card, Row, Col, Image, Container, Button } from 'react-bootstrap'
import editIcon from '../images/icons8-edit-48.png'

function Section(props) {
    const [section, setSection] = useState({})
    const [posts, setPosts] = useState([])
    const [userId, setUserId] = useState()

    useEffect(() => {
        const fetchData = async() => {
            await fetch('/sections/'+props.viewFocus.name, {
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
                setSection(data)
                setPosts(data.Posts)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }
        
        fetchData();

    }, [props.viewFocus])

    return(
    <Row>
        <Row className="justify-content-start">
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <h1>{section.title}</h1>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                <Button>
                    Join
                </Button>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
            {section.UserId == userId && 
                <Image className="edit"
                width={25}
                height={25}
                src={editIcon}
                alt="Edit"
                />
            }
            </Col>
        </Row>
        <Row>
        <p>{section.description}</p>
        </Row>
        <Container>
            {(posts.length > 0 ) &&
            posts.map( post => 
                <Card  onClick={event => props.onFocusChange({type: 'post', name: post.title})}>
                    <Card.Body>
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
                    </Card.Body>
                </Card> 
            )}
        </Container>
    </Row>
    );
}

export default Section