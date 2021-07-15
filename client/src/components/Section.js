function Section(props) {
    useEffect(() => {
        if(props.isLoggedIn){
            const displayName = sessionStorage.getItem('displayName')
            const fetchData = async() => {
                await fetch('/sections/'+props.viewFocus, {
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
                    const memberships = data.map(section => section.title)
                    setMemberSections(memberships)
                    console.log(memberships);
                })
                .catch(error => {
                    console.error('Error! ', error);
                })
            }
            fetchData();
        }
        setMemberSections([])
    }, [props.isLoggedIn, props.viewFocus])
    return(
        
    );
}

export default Section