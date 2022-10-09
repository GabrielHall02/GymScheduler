import React from "react"
import "./profile.css"

const Profile = (props) => {

    const user = props.user;
    console.log(user);

    return (
        <>
        <div className="container">
            <div className="card">
                <div className="ds-top"></div>
                <div className="avatar-holder">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg?1533058950" alt="Albert Einstein"></img>
                </div>
                <div className="name">
                    <h6>
                        {user.username}
                    </h6>
                </div>
                <div className="ds-mid">
                    <div className="info">
                    <div className="flex-row">
                        <p className="label">Username:</p> 
                        <p className="value">{user.username}</p>
                        </div>
                        <button className="btn btn-primary">Edit</button>
                        
                    </div>
                    <div className="info">
                        <div className="flex-row">
                            <p className="label">Email:</p> 
                            <p className="value">{user.email}</p>
                        </div>
                        <button className="btn btn-primary">Edit</button>
                    </div>
                    <div className="info">
                    <div className="flex-row">
                        <p className="label">Password:</p> 
                        <p className="value">********</p>
                        </div>
                        <button className="btn btn-primary">Edit</button>
                    </div>

                    

                </div>
            </div>
        </div>
        </>
    )
    }

export default Profile