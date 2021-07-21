import { useEffect, useState } from 'react'
import { Container, Pagination, Card } from 'react-bootstrap'

function Home(props){
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])

    const fetchData = async(displayName) => {
        console.log(displayName)
        if(displayName != null){
            await fetch('/users/'+displayName+'/memberships/posts/0/25', {
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
                setUser(data)
                const postArray = data.Sections.map(section => section.Posts).flat().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                setPosts(postArray)
                console.log(postArray)
                console.log(data)
            })
            .catch(error => {
                console.error('Error! ', error);
            })

        }
        else {
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
                const postArray = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                setPosts(postArray)
                console.log(postArray)
                console.log(data)
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
        <>

        <Container>
        <h2>Recent Updates</h2>
            {(posts.length > 0) &&
            
               posts.map(post =>
                    <Card key={post.id+post.title} onClick={event => props.onFocusChange({type: 'post', name: post.title})}>
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
                )
            }
        </Container>
        </>
    );
}

export default Home