import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation hook
import companyLogo from '../assets/images/logo.svg';
import './Header.css';

function Header(props) {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="leftDesign">
      <div className="mainHeader">
        <button className='menuButton' onClick={toggleMenu}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <img src={companyLogo} alt="logo" className='logo'/>
      </div>
      <h2 className='boxHeading'>{props.heading}</h2>
      <p className="boxSubHeading">{props.subHeading}</p>

      {showMenu && (
        <div className="dropdownMenu">
          <ul>
            <li>
              <Link to="/PersonalInfo" className={location.pathname === '/PersonalInfo' ? 'active' : ''}>Contractor Detail</Link>
            </li>
            <li>
              <Link to="/Form2" className={location.pathname === '/Form2' ? 'active' : ''}>Independent Contract Agreement</Link>
            </li>
            <li>
              <Link to="/Form3" className={location.pathname === '/Form3' ? 'active' : ''}>WCC Site Start Up Training and Induction</Link>
            </li>
            <li>
              <Link to="/Form4" className={location.pathname === '/Form4' ? 'active' : ''}>AECFM Basic Induction Questionnaire</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
