import React, {useEffect} from "react";
import "./style.css"

const ScheduleCard = (props) => {


    const [loggedUser, setUser] = React.useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch ("https://guysauceperformance.herokuapp.com/api/v1/users/login", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                credentials: "include",
            })
            .then((res) => res.json())
            .then((data) => {
                try{
                    console.log(data)
                    if (data.loggedIn === true) {
                        setUser(data.user)
                    }
                }catch{
                    console.log("Error");
                }
            })
        }
        
    },[])

    async function removeSchedule () {
        // Get username from logged in user
        const username = loggedUser.username

        // Get all inputs from doc and check which one is checked
        const inputs = document.querySelectorAll("input")
        let checked = []
        inputs.forEach(input => {
            if (input.checked) {
                checked.push(input)
            }
        })
        // Get value from checked input
        const scheduleId = checked[0].value

        console.log(scheduleId)

        const response = await fetch("https://guysauceperformance.herokuapp.com/api/v1/schedule/?id=" + scheduleId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
            }),
        })
        if (response.ok) {
            // wait 1 sec
            setTimeout(() => {
                window.location.reload()
            }, 500)
        }
        else {
            checked[0].checked = false
            alert("You can't delete this schedule - You might not be logged in or you might not be the owner of this schedule")
        }

    }

    const date = props.date
    const time = props.time
    const user = props.user
    const id = props.id

    return(
        <div className="card-schedule" id={id}>
            <div className="text-box">
                <p className="black schedule-title">{date}</p>
                <p className="black schedule-description">{time}</p>
            </div>
            <div className="text-box">
                <p className="black schedule-title">USER</p>
                <p className="black schedule-description">{user}</p>
            </div>
            <form className="checkbox-container" onChange={removeSchedule}>
                <input className="checkbox" type="checkbox" id="check" name="check" value={id}/>
            </form>
        </div>
    )
}

export default ScheduleCard;