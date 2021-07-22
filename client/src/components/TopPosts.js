import { useEffect, useState } from 'react'
import { Container, Pagination, Card } from 'react-bootstrap'

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

export default TopPosts