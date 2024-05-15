import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import avatar from "../Images/avatar.jpg";

function Account() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  return (
    <div className="change-form">
      <Form>
        <h2>My Account</h2>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormControl
            name="username"
            type="text"
            placeholder={username}
            disabled="true"
          />
          <FormLabel>Email</FormLabel>
          <FormControl
            name="email"
            type="text"
            placeholder={email}
            disabled="true"
          />
          <FormLabel>Avatar</FormLabel>
          <div className="avatar">
            <img src={avatar} alt="avatar" />
          </div>
          <br />
          <Button variant="dark">Change</Button>
        </FormGroup>
      </Form>
    </div>
  );
}
export default Account;
