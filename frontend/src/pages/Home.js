import React, { useEffect } from "react"

function Home () {


    useEffect(() => {
        console.log("Checking if user is logged in");

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
                if (data.loggedIn === false) {
                    window.location.href = "/Login";
                }

            }catch{
                console.log("Error");
                window.location.href = "/Login";
            }

        }
        
        )
    },[])

    return (
        <>
        <div className="container">
            <p className="black">Hello</p>
        </div>
        </>
    )
    }

export default Home