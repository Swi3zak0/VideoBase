import '../CSS/Styles.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';


export function Search() {


    const [search, setSearch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <Form className='Search' onSubmit={handleSubmit}>
            <Form.Control 
                type='text'
                className='search-input' 
                placeholder='Search...'
                onChange={(e) => setSearch(e.target.value)}
            ></Form.Control>
            <Button>
                Search
            </Button>
        </Form>
    )

}
