import "./Register.css"
import { useEffect, useRef, useState } from "react"

//mathias braucht den post request auf port 3000
function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userName, setUserName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            userName
        });
        
    }

    return (
        <>
            <div>
                <a>Register site</a>
            </div>
            <form onSubmit={handleSubmit}>
                <a>Username</a><br/>
                <input onChange={(e) => setUserName(e.target.value)}/>
                <br/>
                <a>First Name</a><br/>
                <input onChange={(e) => setFirstName(e.target.value)}/>
                <br/>
                <a>Last Name</a><br/>
                <input onChange={(e) => setLastName(e.target.value)}/>
                <br/>
                <a>Email</a><br/>
                <input onChange={(e) => setEmail(e.target.value)}/>
                <br/>
                <a>Password</a><br/>
                <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                <br/>
                <a>Confirm Password</a><br/>
                <input type="password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                <br/>
                <button type="submit" value="submit"> Submit </button>

            </form>
        </>
    )
}

export default Register