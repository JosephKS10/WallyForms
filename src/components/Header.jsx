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
        <button className='menuButton' onClick={toggleMenu} style={{ visibility: props.visibility }}>
          <i className="fa-solid fa-bars"></i>
        </button>
        {props.companyLogoVisibility && <img src={companyLogo} alt="logo" className='logo' />}
      </div>
      <h2 className='boxHeading'>{props.heading}</h2>
      <p className="boxSubHeading">{props.subHeading}</p>

      {showMenu && (
        <div className="dropdownMenu">
          <div className='menuHeader'>
            <button className='menuButton' onClick={toggleMenu}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          {/* For Cleaners */}
          <h3 className="menuSectionHeading">For Cleaners</h3>
          <ul>
            <li>
              <Link to="/PersonalInfo" className={location.pathname === '/PersonalInfo' ? 'active' : ''}>Contractor Detail</Link>
            </li>
            <li>
              <Link to="/Form2" className={location.pathname === '/Form2' ? 'active' : ''}>Independent Contract Agreement</Link>
            </li>
            <li>
              <Link to="/TWVkaWFVcGxvYWRMaW5r" className={location.pathname === '/TWVkaWFVcGxvYWRMaW5r' ? 'active' : ''}>Cleaning Audit</Link>
            </li>
            <li>
              <Link to="/RectificationForm" className={location.pathname === '/RectificationForm' ? 'active' : ''}>Rectification Form</Link>
            </li>
          </ul>

          {/* For Supervisors */}
          <h3 className="menuSectionHeading">For Supervisors</h3>
          <ul>
            <li>
              <Link to="/SupervisorFormCleanerRemoval" className={location.pathname === '/SupervisorFormCleanerRemoval' ? 'active' : ''}>Supervisor Cleaner Removal Form</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
