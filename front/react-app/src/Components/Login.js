import React, { useState } from 'react';
import '../CSS/Styles.css';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const LOGIN_MUTATION = gql`
  mutation Mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
      refreshExpiresIn
      refreshToken
      token
      }
  }
`;

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [login, { error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    },
    onError: (error) => {
      console.log("Error!", error);
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({
        variables: {
          username: username,
          password: password,
        },
      });
    } catch (error) {
      console.error("Błąd logowania", error)
    }
  };
  if(isLoggedIn){
    return navigate('/home'); 
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <h1>Sign In!</h1>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            placeholder='username'
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <div className="password-input">
            <Form.Control
              placeholder='password'
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
        </Form.Group>
        <Link to = "/resetPassword" className='links'>Forgot Password?</Link>
        <Button className="button" type="submit">
          Log In
        </Button>
        {error && <p>Błąd logowania, spróbuj ponownie.</p>}
        <p>
          You do not have an account? <Link to="/register" className='links'>Register now!</Link>
        </p>
      </Form>
    </div>
  );
}

export default Login;
