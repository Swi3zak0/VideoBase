import { Button, Form, FormGroup, FormCheck } from "react-bootstrap";
import '../CSS/Styles.css';
import { useState } from "react";
import { useMutation, gql} from "@apollo/client";
import PasswordStrengthBar from 'react-password-strength-bar';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';


const registerMutation = gql`
    mutation RegisterUser($username: String!, $password: String!, $email: String!){
        registerUser(username: $username, password: $password, email: $email){
            user{
                username
                email
            } 
        }
    }
`;

function Registration () {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [register,{error}] = useMutation(registerMutation,{
        onCompleted:() => {
            setIsRegister(true);
            resetFormFields();
        },
        onError: (error)=> {
            console.log("Błąd rejstracji", error);
        }
    });

    const handleSubmit = async (event) =>{
        event.preventDefault();
        try{
            await register({
                variables:{
                    username: username,
                    password: password,
                    email: email,
                },
            });
            setIsRegister(true)
            
        }catch(error){
            console.error("Error!",error)
        }
    };

    const handleTermsCheckboxChange = () => {
        setIsTermsChecked(!isTermsChecked);
    };

    const resetFormFields = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setIsTermsChecked(false);
    };

    return(
        <div className="Register">
            <Form onSubmit={handleSubmit}>
                <h1>Sign Up!</h1>
                <Form.Group controlId="username" size="lg">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                    autoFocus
                    placeholder="username" 
                    name="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="email" size="lg">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                    name="email" 
                    type="email"
                    placeholder="e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                    <Form.Label>Password</Form.Label>
                    <div className="password-input">
                        <Form.Control
                        placeholder="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />
                        <Button
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="light"
                        >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined /> }
                        </Button>
                    </div>
                    <PasswordStrengthBar password={password} />
                </Form.Group>
                <FormGroup>
                    <FormCheck
                        className="links"
                        type="checkbox"
                        label="Accept terms and conditions !"
                        checked={isTermsChecked}
                        onChange={handleTermsCheckboxChange}
                    />
                </FormGroup>
                <Button className="button" type="submit" disabled={!isTermsChecked}>Register</Button>
                {isRegister && !error && <p>Rejestracja zakończona sukcesem! Potwierdż konto na poczcie.</p>}
                {error && <p>Błąd rejstracju, spróbuj ponownie.</p>}
            </Form>
        </div>
    )
}

export default Registration;
