import React, {useEffect, useState} from "react";
import "./style.css"
import { Icon } from '@iconify/react';

const ScheduleCard = (props) => {

    const key = props._key
    const value = props.value
    const id = props.id

    return(
        <div className="card-profile" id={id}  onClick={props.onPress}>
            <div className="text-box">
                <p className="black" style={{fontFamily:"Roboto Condensed", fontWeight:"700", fontSize:"25px", marginBlockStart:"15px"}}>{key}</p>
                <p className="black" style={{fontFamily:"Roboto Mono", fontWeight:"300", fontSize:"22px", marginBlockStart:"0", letterSpacing:"-1.3px"}}>{value}</p>
            </div>
            <div className="edit-box" >
                <Icon icon="bxs:edit" color="#231f20" width="35" height="35" />
            </div>
        </div>
    )
}

export default ScheduleCard;