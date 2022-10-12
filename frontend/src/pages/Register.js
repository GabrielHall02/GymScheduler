import React, {useEffect} from "react"
import "./style.css"
import { Link } from "react-router-dom";

function Register () {
    useEffect(() => {document.body.style.overflow = "hidden";}, []);
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    async function registerUser (event) {
        event.preventDefault();
        console.log(username);
        console.log(email);
        console.log(password);

        const response = await fetch(`http://localhost:5005/api/v1/pendingUsers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        })
        const data = await response.json();

        if (data.status === "success") {
            //window.location.href = "/Login";
            alert("check mail")
        }else {
            console.log("Error");
        }

        console.log(data);
    }
    
    return (
        <>
        <div className="container">
            <div className="top"></div>
            <div className="bottom"></div>
            <div className="center">
                <h2>Registar Conta</h2>
                <form onSubmit={registerUser}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

                    <input type="submit" className="btn-m" value="Register" />
                </form>
                
                <Link to="/Login" className="btn-m" style={{width:"100%", margin:"5px", backgroundImage: "linear-gradient(to right, #aaa 0%, #aaa 51%, #F8B716 100%)", textDecoration:"None"}}> Login </Link>
            </div>
        </div>
        </>
    )
    }

export default Register