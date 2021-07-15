import { useEffect, useState } from 'react'
import { Container, Row, Col, Media, Image } from 'react-bootstrap'
import editIcon from '../images/icons8-edit-48.png'

function Section(props) {
    const [section, setSection] = useState({})

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
                setSection(data)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }
        fetchData();

    }, [props.viewFocus])

    return(
        <Row className="justify-content-start">
        <Col xs={11} sm={11} md={10} lg={9} xl={8}>
            <h1>{section.title}</h1>
            <p>{section.description}</p>
        </Col>
        <Col xs={1} sm={1} md={1} lg={1} xl={1}>
        <Image className="edit"
        width={25}
        height={25}
        src={editIcon}
        alt="Edit"
        />
        </Col>
    </Row>
    );
}

export default Section