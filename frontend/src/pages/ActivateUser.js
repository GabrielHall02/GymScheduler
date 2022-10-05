import React, {useEffect} from "react";

function ActivateUser () {

    const [activateStatus, setActivateStatus] = React.useState("");
// Send get request to activate
// If user is activated, redirect to login

    useEffect(() => {
        console.log("Activating user");
        // Get token from url
        const token = window.location.pathname.split("/")[2].slice(1);
        console.log(token)

        fetch(`http://localhost:5005/api/v1/pendingUsers/activate/?id=${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === "success") {
                setActivateStatus("User activated");
                window.location.href = "/login";
            }else{
                setActivateStatus("Error activating user");
            }
        })
        

    },[])

    return (
        <>
        <div className="container">
            <p>{activateStatus}</p>
        </div>
        </>
    )
}

export default ActivateUser