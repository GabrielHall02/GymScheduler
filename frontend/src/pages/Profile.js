import React, {useEffect} from "react"
import "./style.css"
import ProfileCard from "../components/profileCard/ProfileCard"
import Modal from "react-modal"

function Profile () {

    const [loggedUser, setUser] = React.useState("");
    const [modalProps, setModalProps] = React.useState({});
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    useEffect(() => {
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
                    setUser(data.user);
                    setUsername(data.user.username);
                    setEmail(data.user.email);
                    setPassword('********');

                } else {
                    window.location.href = "/Login"
                }
            }catch{
                console.log("Error");
            }
        }
        )
    },[])


    function logout () {
        // Clear the cookie
        fetch("http://localhost:5005/api/v1/users/logout", {
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
                window.location.href = "/"
            }
        }
        )

    }


    let subtitle
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.5s ease',
          borderRadius: '22px',
          width: '500px',
          height: '400px'
        },
        ReactModal__Overlay: {
            
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
    };

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
                <div className="flex-row" style={{height: "100%"}}>
                <ProfileCard _key={"Name"} value={username} onPress={() => {openModal(); setModalProps({"key":"Nome", "value":username})}}/>
                <ProfileCard _key={"email"} value={email} onPress={() => {openModal(); setModalProps({"key":"Email", "value":email})}}/>
                </div>
                <div className="flex-row">
                <ProfileCard _key={"Password"} value={password} onPress={() => {openModal(); setModalProps({"key":"Password", "value":password})}}/>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Modal"
            >
                <div className="modal-header">
                    <h2 ref={_subtitle => (subtitle = _subtitle)} className="black" style={{fontWeight:"500"}}>Alterar {modalProps.key}</h2>
                    <div className="btn-close" onClick={closeModal}></div>
                </div>
                <form className="modal-body" >
                    <div className="flex-row" style={{height:"100%"}}>
                        <div className="flex-column">
                            <label className="black" style={{fontWeight:"500"}}>{modalProps.key}</label>
                            <div className="readonly-box"><p>{modalProps.value}</p></div>
                        </div>
                    </div>
                    <div className="flex-row" style={{height:"100%"}}>
                        <div className="flex-column">
                            <label className="black" style={{fontWeight:"500"}}>New {modalProps.key}</label>
                            <input type="text" name="username" id="username" className="input" placeholder={modalProps.key} />
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