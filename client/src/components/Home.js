import { useEffect, useState } from 'react'
import { Container, Pagination, Card } from 'react-bootstrap'
import Post from '../components/Post'

function Home(props){
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])

    const orderPosts = (array) => {
        let postsToOrder = array;
        for(let i = postsToOrder.length -1; i >  0; i++){
            const k = Math.floor(Math.random() * i)
            const temp = postsToOrder[i]
            postsToOrder[i] = postsToOrder[k]
            postsToOrder[k] = temp
        }
        return postsToOrder
    }

    const fetchData = async(displayName) => {
        console.log(displayName)
        await fetch('/users/'+displayName+'/memberships/posts/1/25', {
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
            const postArray = data.Sections.map(section => section.Posts).flat().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            setPosts(postArray)
            console.log(postArray)
            console.log(data)
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {
        const displayName = sessionStorage.getItem('displayName')
        if(displayName){         
            fetchData(displayName);
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