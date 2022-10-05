import React from "react"
import { Link } from "react-router-dom";
import "./style.css"
import { Icon } from '@iconify/react';
import Menu from "../menu/Menu"

const Navbar = (props) => {

    return ( 
        <div className="nav-bar">
            <div className="flex-row mid">
                <Link to="/" className="logo flex-row mid" style={{textDecoration: 'none' }}> 
                    <Icon icon="map:gym" color="white" width="24" height="24" />
                     <p className="logo-txt">GymScheduler</p>
                </Link>
                {
                    
                    props.user === undefined ?
                    <div className="profile-wrapper hide">
                        <p className="black">{props.user}</p>
                    </div>
                    :
                    <div className="profile-wrapper flex-row mid">
                        {/* Need to check why Icon is changing size */}
                        <Icon icon="bi:person-circle" width="24" height="24" style={{paddingRight: '5%'}} className="black"/>
                        <p className="black">{props.user}</p>
                    </div>

                }
                <Menu/>

            </div>

        </div>
    );
}

export default Navbar;