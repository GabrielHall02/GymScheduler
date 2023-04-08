import React, {useEffect} from "react"
import "./style.css"
import ProfileCard from "../components/profileCard/ProfileCard"
import Modal from "react-modal"
import { Icon } from '@iconify/react';

function Profile () {


    const [modalProps, setModalProps] = React.useState({});
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userId, setUserId] = React.useState("");

    const [value, setValue] = React.useState("");

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
            console.log(data)
            try{
                if (data.loggedIn === true) {
                    setUsername(data.user.username);
                    setEmail(data.user.email);
                    setPassword('********');
                    setUserId(data.user._id);

                } else {
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


    function logout () {
        // Clear local storage
        localStorage.clear();
        // Redirect to login page
        window.location.href = "/";
        
    }

    async function changeUser (event, key, value) {
        event.preventDefault();

        key = key.toLowerCase();
        console.log(key +":" + value);
        // Send the request to the backend
        const response = await fetch("https://guysauceperformance.herokuapp.com/api/v1/users/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                _id : userId,
                [key] : value
            })
        })
        
        if (response.status === 200){
            console.log("Success")
            // Logout
            logout();
        }

    }


    let subtitle

    Modal.setAppElement('#root');

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        // Check if user is logged in
        setIsOpen(true);
        console.log(modalProps)
      }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#231F20';
      }
    
      function closeModal() {
        setIsOpen(false);
      }


    return (
        <div className="flex-row-center">
        <div className="container-m">
            <div className="schedule-top">
                <p className="black" style={{fontWeight:"500"}}>PERFIL</p>
                <div className="btn-xs" onClick={logout}>Terminar Sessão</div>
            </div>
            <div className="schedule-table">
                <div className="profile-flex" style={{height: "100%"}}>
                <ProfileCard _key={"Username"} value={username} onPress={() => {openModal(); setModalProps({"key":"Username", "value":username})}}/>
                <ProfileCard _key={"Email"} value={email} onPress={() => {openModal(); setModalProps({"key":"Email", "value":email})}}/>
                </div>
                
                <div className="profile-flex" >
                <ProfileCard _key={"Password"} value={password} onPress={() => {openModal(); setModalProps({"key":"Password", "value":password})}}/>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                className="modal"
                contentLabel="Modal"
            >
                <div className="modal-header">
                    <h2 ref={_subtitle => (subtitle = _subtitle)} className="black" style={{fontWeight:"500"}}>Alterar {modalProps.key}</h2>
                    <div className="btn-close" onClick={closeModal}><Icon  icon="carbon:close-filled" color="black" /></div>
                </div>
                <form className="modal-body" onSubmit={(e) => changeUser(e, modalProps.key,value)}>
                    <div className="flex-row" style={{height:"100%"}}>
                        <div className="flex-column">
                            <label className="black" style={{fontWeight:"500"}}>{modalProps.key}</label>
                            <div className="readonly-box"><p>{modalProps.value}</p></div>
                        </div>
                    </div>
                    <div className="flex-row" style={{height:"100%"}}>
                        <div className="flex-column">
                            <label className="black" style={{fontWeight:"500"}}>New {modalProps.key}</label>
                            <input type={modalProps.key === "Password" ? "password" : "text"} name="value" id="value" className="input" placeholder={modalProps.key} value={value} onChange={(e) => setValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="modal-bottom">
                        <input type="submit" value="Alterar" className="btn-xs" />
                        <p className="success-txt"></p>
                    </div>

                </form>
            </Modal>
        
        </div>
        </div>
    )
    }

export default Profile