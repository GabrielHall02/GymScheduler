import React from "react";
import "./style.css"
import { Icon } from '@iconify/react';

const ScheduleCard = (props) => {

    const key = props._key
    const value = props.value
    const id = props.id

    return(
        <div className="card-profile" id={id}  onClick={props.onPress}>
            <div className="text-box">
                <p className="black profile-title">{key}</p>
                <p className="black .profile-description">{value}</p>
            </div>
            <div className="edit-box" >
                <Icon icon="bxs:edit" color="#231f20" width="35" height="35" />
            </div>
        </div>
    )
}

export default ScheduleCard;