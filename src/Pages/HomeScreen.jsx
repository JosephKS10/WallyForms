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
import line from '../assets/elements/form-assets/line.svg'

const HomeScreen = () => {
  const navigate = useNavigate(); 

  const handleBeforeTrainingClick = () => {
    window.scrollTo(0, 0);
    navigate('/PersonalInfo');
  };

  const handleAfterTrainingClick = () => {
    window.scrollTo(0, 0);
    navigate('/Form3');
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
        <div className="contentContainer">
          <p className='text'>Providing the highest level of service is always a matter of effectively and efficiently managing your people and this is one area we pride ourselves on. 
            <br /><br />
            We are, after all, in the people business.</p>
        </div>
      </div> 
      <div className="buttonContainer">
        <button className="btn" onClick={handleBeforeTrainingClick}>
          Before Training 
        </button><br />
        <button className="btn" onClick={handleAfterTrainingClick}>After Training </button>
      </div>

      <div className="bottomWavesContainer">
        <img src={bottomDesign} alt="bottomWaves" className='bottomWaves' />
      </div>
    
     
    </div>
  );
};

export default HomeScreen;
