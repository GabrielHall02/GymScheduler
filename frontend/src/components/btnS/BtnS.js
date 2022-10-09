import React from "react";
import "./style.css";

/*
    <button className="btn-s" type="submit" onClick={onPress} style={{border: 'none'}} >
    <p className="btn-txt">{props.text}</p>
    </button>
    */

export default function BtnS(props, {onPress}) {
    return(
        <form onSubmit={onPress}>
        <input type="submit" value={props.text}  className="btn-s"/>
        </form>
    
)
}