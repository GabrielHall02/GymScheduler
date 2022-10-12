import React, {useState, useRef, useEffect} from "react"
import "./style.css"
import { Link } from "react-router-dom"


function Menu() {

    const [isActive, setIsActive] = useState(false);

    
    
    const useOutsideClick = (callback) => {
        const ref = useRef();
      
        useEffect(() => {
          const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
          };
      
          document.addEventListener('click', handleClick);

      
          return () => {
            document.removeEventListener('click', handleClick);
          };
        }, [ref]);
      
        return ref;
      };

      const handleClick = event => {
        setIsActive(!isActive);
        //ref.current = !isActive;
        event.preventDefault();
    };

      const handleClickOutside = () => {
        // console.log("clicked outside");
        if (!isActive) {
            return;
            // setIsActive(false);
        }
      };

      const ref = useOutsideClick(handleClickOutside);

    return(
        <>
        <div className='menu-btn-mid' onClick={handleClick} >
            <p >menu</p>
        </div>

        <div ref={ref} className={isActive ? 'menuWrapper' : 'menuWrapper-hide'}>

            <div className="menu-btn loc" onClick={handleClick} >
                <p >Close</p>
            </div>
            
            <div className="menuContainer">

              <Link to='/Schedule' style={{ textDecoration: 'none' }} className="menu-item-wrapper" onClick={() =>{setIsActive(false)}}>
                <p className="menu-item">Horário</p>
              </Link>

              <Link to='/Profile' style={{ textDecoration: 'none' }} className="menu-item-wrapper" onClick={() =>{setIsActive(false)}} >
                <p className="menu-item">Perfil</p>
              </Link>

            </div>

        </div>
        </>
    )}

export default Menu