import React, {useState} from "react";
import { Button, Form } from "react-bootstrap";  
import "../CSS/Styles.css"
  




function ResetPassword(){

    const [email, setEmail] = useState('');
    
    const handleSubmit = async (event) =>{
        event.preventDefault();
        try{
            await email({
                variables:{
                    email: email,
                },
            });
        }catch(error) {
            console.error("Błędny adress emial", error)
        }
    };

    return (
        <div className="ResetPassword">
            <Form className="box" onSubmit={handleSubmit}>
                <h1>Reset Your Password</h1>
                <p>Enter your email and we will send you a link to reset your password</p>
                <Form.Group controlId="email" size="lg">
                    <Form.Label className="email">Email</Form.Label>
                    <Form.Control
                        autoFocus
                        placeholder="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Form.Group>
                <Button className="button" type="submit">
                    Send
                </Button>
            </Form>
        </div>
    );
}   
export default ResetPassword;