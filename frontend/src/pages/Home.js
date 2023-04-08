import React, { useEffect } from "react"
import vector from "../vectors/Dumbbell.svg"


function Home () {
    useEffect(() => {document.body.style.overflow = "hidden";}, []);

    async function getStarted (event) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch("https://guysauceperformance.herokuapp.com/api/v1/users/login/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                credentials: "include",
            })
            const data = await response.json();
            console.log(data);
            try{
                if (data.loggedIn === true) {
                    console.log("User is logged in");
                    window.location.href = "/Schedule";
                    
                } else{
                    console.log("User is not logged in");
                    window.location.href = "/Login";
                }
            }catch{
                console.log("Error");
                window.location.href = "/Login";
            }
        }else{
            window.location.href = "/Login";
        }
        
    }
    
    
    return (
        <>
        <div className="hero_section flex-col-center">
            <div className="hero-text">
                <p className="title">GUY SAUCE<i className="yellow"> PERFORMANCE</i></p>
                <p className="yellow subtitle">PERSONAL TRAINING</p>
            </div>
            <form onSubmit={getStarted}>
                <input type="submit" value={"COMEÇAR"}  className="btn-s"/>
            </form>
        </div>
        <div className="vector-wrapper">
            <img src={vector} alt="Vector" className="vector"/>
        </div>

        </>
    )
    }

export default Home