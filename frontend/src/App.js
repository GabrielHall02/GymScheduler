import React, {useEffect} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";

import "./App.css";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from "./components/navbar/Navbar"
import Activate from "./pages/ActivateUser";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";


function App() {
    

    const [user, setUser] = React.useState("");

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

    
    return ( 
        <div>
            <BrowserRouter>
                <Navbar user={user.username}/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile user={user}/>}/>
                    <Route path="/activate/:token" element={<Activate/>}/>
                    <Route path="/schedule" element={<Schedule/>}/>
                </Routes>
            </BrowserRouter>
            
        </div>
    );
}

export default App;