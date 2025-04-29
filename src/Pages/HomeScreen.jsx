import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import './HomeScreen.css';
import leftDesign1 from '../assets/elements/form-assets/leftWave.svg'
import bottomDesign from '../assets/elements/form-assets/Wave1.svg'
import bubble1 from '../assets/elements/form-assets/bubbles1.svg'
import bubble2 from '../assets/elements/form-assets/bubbles2.svg'
import bubble3 from '../assets/elements/form-assets/bubbles3.svg'
import bubble4 from '../assets/elements/form-assets/bubbles4.svg'
import bubble5 from '../assets/elements/form-assets/bubbles5.svg'
import companyLogo from '../assets/images/logo.svg'

const HomeScreen = () => {
  const navigate = useNavigate(); 

  const handleBeforeTrainingClick = () => {
    window.scrollTo(0, 0);
    navigate('/PersonalInfo');
  };

  const handleForm2Click = () => {
    window.scrollTo(0, 0);
    navigate('/Form2');
  };

  const handleAuditClick = () => {
    window.scrollTo(0, 0);
    navigate('/TWVkaWFVcGxvYWRMaW5r'); // Add actual path for the cleaning audit
  };

  const handleRectificationClick = () => {
    window.scrollTo(0, 0);
    navigate('/RectificationForm');
  };

  const handleSupervisorCleanerRemovalForm = () => {
    window.scrollTo(0, 0);
    navigate('/SupervisorFormCleanerRemoval');
  };

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  if (!isMobile()){
    return(
      <div className="error-message">
      <h1>Error: Access from desktop not allowed</h1>
      <p>Please access this website from a mobile device.</p>
    </div>
    )
  }
    


  return (
    <div className="home-container">
     
      <div className="top">
      <div className="leftDesignHome">
        <img src={leftDesign1} alt="leftWaves" />
      </div>
      <div className="bubbleContainer">
        <div className='upperBubbles'>
        <img src={bubble1} alt="bubbles" />
        <img src={bubble2} alt="bubbles" />
        </div>
        <div className='middleBubbles'>
        <img src={bubble4} alt="bubbles" />
        <img src={bubble5} alt="bubbles" />

        </div>
        <div className='lowerBubbles'>
        <img src={bubble5} alt="bubbles" />
        <img src={bubble3} alt="bubbles" />
        </div>
      </div>
      </div>
      <div className='companyLogo'>
        <img src={companyLogo} alt="logo" className='logo-home'/>
      </div>

      <div className='homeContent'>

        <div className="titleContainer">
            <p className='headingFirst'>Welcome to</p>
            <p className='headingSecond'>Wally Cleaning Company</p>
        </div>
      </div> 
      <div className="buttonContainer">
        <h4 className='distinct-heading'>Contractor Details and Contract</h4>
        <button className="btn" onClick={handleBeforeTrainingClick}>
        Contractor Detail
        </button>
        <button className="btn" onClick={handleForm2Click}>
        Independent Contract Agreement
        </button><br />
        <h4 className='distinct-heading'>Audit Forms</h4>
        <button className="btn" onClick={handleAuditClick}>
        Cleaning Audit
        </button>
        <button className="btn" onClick={handleRectificationClick}>
        Rectification Form
        </button><br />
        <h4 className='distinct-heading'>Supervisor Forms</h4>
        <button className="btn" onClick={handleSupervisorCleanerRemovalForm}>
        Supervisor Cleaner Removal Form
        </button>
      </div>

      <div className="bottomWavesContainer">
        <img src={bottomDesign} alt="bottomWaves" className='bottomWaves' />
      </div>
    
     
    </div>
  );
};

export default HomeScreen;
