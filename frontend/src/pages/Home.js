import React, { useEffect } from "react"
import vector from "../vectors/Dumbbell.svg"


function Home () {
    useEffect(() => {document.body.style.overflow = "hidden";}, []);

    async function getStarted (event) {
        event.preventDefault();

        const response = await fetch("http://localhost:5005/api/v1/users/login", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        const data = await response.json();
        console.log(data);
        try{
            if (data.loggedIn === false) {
                console.log("User is not logged in");
                window.location.href = "/Login";
            } else{
                console.log("User is logged in");
                window.location.href = "/Schedule";
            }
        }catch{
            console.log("Error");
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