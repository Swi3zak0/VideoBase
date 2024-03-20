import React, {useState} from "react";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import '../CSS/Styles.css';


const ChangePassword = () =>{


    // const [changePassword, {error}] = useMutation(NAZWA_MUTACJI,{
    //     onCopleted:() =>{

    //     },
    //     onError:(error) => {
    //         console.log("Hasła niezgadzają się.")
    //     }
    // });

    // const [password, setPassword] = useState('');

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     try{
    //         await password({
    //             variables:{
    //                 password: password
    //             }
    //         });
    //     }catch(error){
    //         console.log("Błąd", error)
    //     }
    // }

    return(
        <div>
            <Form>
                <h1>Change Your Password</h1>
                <FormGroup controlId="password">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        name="password"
                        type="password"
                        placeholder="password"
                        // value={password}
                        // onChange={(event)=>setPassword(event.target.value)}
                    />
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        name="password"
                        type="password"
                        placeholder="password"
                        // value={password}
                        // onChange={(event)=>setPassword(event.target.value)}
                    />
                    </FormGroup>
                    <Button className="button" type="submit">Change</Button>
            </Form>
        </div>
    );
}
export default ChangePassword;