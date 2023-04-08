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

        const response = await fetch(`https://guysauceperformance.herokuapp.com/api/v1/users/login/?email=${email}&password=${password}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        const data = await response.json();
        console.log(data);

        if (data.user) {
            // Store token
            localStorage.setItem("token", data.user);
            setLoginStatus("Success")
            window.location.href = "/Schedule";
        }else {
            setLoginStatus("Invalid email or password")
        }
    }
    
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
            <Link to="/Register" className="help-text"> <p>Ainda não tens conta? </p><p style={{color:"#446DD9",paddingLeft:"10px"}}>Criar agora → </p> </Link>
            </div>
        </div>
        </>
    )
    }

export default Login