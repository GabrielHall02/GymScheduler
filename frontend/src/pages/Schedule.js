import React, {useState, useEffect} from "react"
import ScheduleCard from "../components/scheduleCard/ScheduleCard"
import Modal from "react-modal"
import { Icon } from '@iconify/react';
import "./style.css"


function Schedule () {

    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("60");
    const [success, setSuccess] = useState("");
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
                    }else{
                        window.location.href = "/Login"
                    }
                }catch{
                    console.log("Error");
                }
            })
        }else{
            window.location.href = "/Login"
        }
        
    },[])

    async function newSchedule(event) {
        event.preventDefault();

        // If no user is logged in, redirect to login page
        if (loggedUser === "") {
            window.location.href = "/Login"
        }

        console.log (date, duration);
        // Create new date with date and time
        const newDate = new Date(date);
        const response = await fetch("https://guysauceperformance.herokuapp.com/api/v1/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: newDate,
                duration: duration,
                username: loggedUser.username,
            })
        })
        if (response.ok) {
            setSuccess(response.status);
            window.location.href = "/Schedule";
        }
        else {
            console.log("Error");
            setSuccess(response.status);
        }
    }


    let subtitle
    Modal.setAppElement('#root');

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        // Check if user is logged in
        if (loggedUser === "") { 
            window.location.href = "/Login"
            return
        }
        setIsOpen(true);
      }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#231F20';
      }
    
      function closeModal() {
        setIsOpen(false);
      }

    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        fetch("https://guysauceperformance.herokuapp.com/api/v1/schedule", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            try{

                setSchedules(data.schedule)

            }catch{
                console.log("Error");
            }
        }
        )
    }, [])

    

    return (
        <div className="flex-row-center">
        <div className="container-m">
            <div className="schedule-top">
                <p className="black" style={{fontWeight:"500"}}>SCHEDULE</p>
                <div className="btn-xs" onClick={openModal}>Adicionar novo</div>
            </div>
            <div className="schedule-table">
                {
                    schedules.map((schedule) => {
                    // Transform date into a more readable format
                        const date = new Date(schedule.date)
                        const dateFormatted = date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
                        // Sum startTime with duration to get endTime
                        const endTime = new Date(date.getTime() + schedule.duration*60000)
                        const timeFormatted = date.getHours() + ":" + String(date.getMinutes()).padStart(2, '0') + "-" + endTime.getHours() + ":" + String(endTime.getMinutes()).padStart(2, '0')

                        return (
                            <ScheduleCard key={schedule._id} id={schedule._id} date={dateFormatted} time={timeFormatted} user={schedule.username} />
                        )
                    })
                }
            </div>
            <div className="schedule-bottom">
                <div className="btn-add" onClick={openModal}></div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                className="modal"
                contentLabel="Modal"
            >
                <div className="modal-header">
                    <h2 ref={_subtitle => (subtitle = _subtitle)} className="black" style={{fontWeight:"500"}}>Adicionar Horário</h2>
                    <div className="btn-close" onClick={closeModal}><Icon  icon="carbon:close-filled" color="black" /></div>
                </div>
                <form className="modal-body" onSubmit={newSchedule}>
                    <div className="flex-row" style={{height:"100%"}}>
                        <div className="flex-column">
                            <label className="black" style={{fontWeight:"500"}}>Data</label>
                            <input type="datetime-local" name="date" id="date" className="input" value={date} onChange={(e) => setDate(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex-row" style={{height:"100%"}}>
                        <div className="flex-column">
                            <label className="black" style={{fontWeight:"500"}}>Duração (minutos)</label>
                            <input type="number" name="duration" id="duration" className="input" placeholder="60" value={duration} onChange={(e) => setDuration(e.target.value)}/>
                        </div>
                    </div>
                    <div className="modal-bottom">
                        <input type="submit" value="Adicionar" className="btn-xs" />
                        <p className={success === true ? "success-txt" : "error-txt"}></p>
                    </div>

                </form>
            </Modal>
        </div>
        </div>
    )
    }

export default Schedule