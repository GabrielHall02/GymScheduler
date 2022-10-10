import React, { useEffect } from "react"
import "./style.css"
import { Link } from "react-router-dom";

function Login () {
    useEffect(() => {document.body.style.overflow = "hidden";}, []);
    const [loginStatus, setLoginStatus] = React.useState("");

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");



    async function login (event) {
        event.preventDefault();

        const response = await fetch(`http://localhost:5005/api/v1/users/login/?email=${email}&password=${password}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        const data = await response.json();
        console.log(data);

        if (data.email === email) {
            setLoginStatus("Success")
            window.location.href = "/Schedule";
        }else {
            setLoginStatus("Invalid email or password")
        }
    }

    useEffect(()=>{
        fetch("http://localhost:5005/api/v1/users/login", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            try{
                if (data.loggedIn === true) {
                    window.location.href = "/Schedule";
                }
            }catch{
                console.log("Error");
                setLoginStatus("Internal error")
            }
        }
        )
    },[])
    
    return (
        <>
        <div className="container">
            <div className="top"></div>
            <div className="bottom"></div>
            <div className="center">
                <h2>Iniciar Sessão</h2>
                <form onSubmit={login}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                    <p className={loginStatus === "Success" ? "success-txt" : "error-txt"}>{loginStatus}</p>
                    <input type="submit" className="btn-m" value="Login" />
                </form>
                
                <Link className="btn-m" style={{width:"100%", margin:"5px", backgroundImage: "linear-gradient(to right, #aaa 0%, #aaa 51%, #F8B716 100%)", textDecoration:"None"}} to="/Register"> Register </Link>
            </div>
        </div>
        </>
    )
    }

export default Login