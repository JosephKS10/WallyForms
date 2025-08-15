import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import "./SupervisorFormCleanerRemoval.css";


function SupervisorFormCleanerRemoval() {
  const [selectedButton, setSelectedButton] = useState(''); // To track New Cleaner or Old Cleaner
  const PUBLIC_KEY = 'KXRncuNTnshAREN68';

  const [siteInfo, setSiteInfo] = useState({
    siteName: '',
    cleanerName: '',
    conductedOn: '', 
    startingDate: '',
    // hours: '',
    // pay: '',
    cleaner: '',
  });

  const [notes, setNotes] = useState({
    cleanerNotes: '',

});
const [showNotes, setShowNotes] = useState({
    CleanerNotes: false,
});

  const handleNotesChange = (e, section) => {
    const { value } = e.target;
    // Update notes state for the corresponding section
    setNotes((prevNotes) => ({
        ...prevNotes,
        [section]: value,
    }));
};
const toggleNotesVisibility = (section) => {
    setShowNotes((prevShowNotes) => ({
        ...prevShowNotes,
        [section]: !prevShowNotes[section],
    }));
};

const renderNotesInput = (section) => {
    return (
        <div>
            <button onClick={() => toggleNotesVisibility(section)} className='addNotesButton block' type='button'>Add Notes</button>
            <p className='text down'>NOTES</p>
            {showNotes[section] && (
                <div className='area'>
                <textarea
                    value={notes[section]}
                    onChange={(e) => handleNotesChange(e, section)}
                    placeholder="Enter notes..."
                    rows={4}
                    className='notesTextarea'
                />
                </div>
            )}
        </div>
    );
};

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(notes)
  // Function to validate form fields
  const validateForm = () => {
    const errors = {};

    if (!siteInfo.siteName) {
      errors.siteName = 'Site name is required';
    }
    if (!siteInfo.cleanerName) {
      errors.cleanerName = "Cleaner's name is required";
    }
    // if (!siteInfo.hours || isNaN(siteInfo.hours) || siteInfo.hours < 1 || siteInfo.hours > 12) {
    //   errors.hours = "Please enter valid hours (1-12)";
    // }
    // if (!siteInfo.pay || isNaN(siteInfo.pay)) {
    //   errors.pay = "Please enter a valid pay amount";
    // }
    if (!siteInfo.startingDate) {
        errors.startingDate = "Starting date is required";
    }
    if (!siteInfo.cleaner) {
        errors.cleaner = "Please select a cleaner type (New or Old)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to handle form submission
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL_SITE_CHANGING;

    const [formSubmitted, setFormSubmitted] = useState(false);


const handleSubmitData = async (e) => {
  e.preventDefault();
  console.log("Submitting data...");

  if (formSubmitted) {
    window.print();
    return;
  }

  if (!validateForm()) {
    // Scroll to the first error field
    const firstErrorKey = Object.keys(formErrors)[0];
    const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`);
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  setIsSubmitting(true);
  
  try {
    // Prepare the data
    const formData = {
      ...siteInfo,
      ...notes,
    };

    // First submit to Google Sheets
    const googleSheetsResponse = await submitToGoogleSheets(formData);
    if (!googleSheetsResponse.ok) {
      throw new Error('Google Sheets submission failed');
    }

    // Then submit to your backend API for email
    const apiResponse = await submitToBackendAPI(formData);
    if (!apiResponse.ok) {
      throw new Error('Email submission failed');
    }

    // If both successful
    setFormSubmitted(true);
    window.print();
    
  } catch (error) {
    console.error('Error during submission:', error);
    // You might want to show an error message to the user here
  } finally {
    setIsSubmitting(false);
  }
};

// Helper function to submit to Google Sheets
const submitToGoogleSheets = async (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  return await fetch(scriptUrl, {
    method: 'POST',
    body: formData,
  });
};

// Helper function to submit to your backend API
const submitToBackendAPI = async (data) => {
  return await fetch('https://stock-management-backend-jqdz.onrender.com/api/wally-forms/site-changing-form-email-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
      


  return (
    <div>
      <Header heading="Site Changing Form" subHeading="" visibility="visible" companyLogoVisibility={true}/>
      <div className='formHeading'></div>
      <form onSubmit={handleSubmitData}>
        <div className="boxContent">
        <div className="lineContainer">
          <div className="QuestionLine">Cleaner's Name</div>
          <div>
            <input
              type="text"
              name="cleanerName"
              value={siteInfo.cleanerName}
              onChange={(e) => setSiteInfo({ ...siteInfo, cleanerName: e.target.value })}
              className="inputLine"
              placeholder="Enter cleaner's name..."
            />
            {formErrors.cleanerName && <div className="error-message">{formErrors.cleanerName}</div>}
          </div>
        </div>

        {/* Site Name */}
        <div className="lineContainer">
          <div className="QuestionLine">Site Name</div>
          <div>
            <input
              type="text"
              name="siteName"
              value={siteInfo.siteName}
              onChange={(e) => setSiteInfo({ ...siteInfo, siteName: e.target.value })}
              className="inputLine"
              placeholder="Enter site name..."
            />
            {formErrors.siteName && <div className="error-message">{formErrors.siteName}</div>}
          </div>
        </div>

        {/* Hours Input */}
        {/* <div className="lineContainer">
          <div className="QuestionLine">Hours</div>
          <div>
            <input
              type="number"
              name="hours"
              min={1}
              max={12}
              value={siteInfo.hours}
              onChange={(e) => setSiteInfo({ ...siteInfo, hours: e.target.value })}
              className="inputLine"
              placeholder="Enter hours (1-12)"
            />
            {formErrors.hours && <div className="error-message">{formErrors.hours}</div>}
          </div>
        </div> */}

        {/* Pay Input */}
        {/* <div className="lineContainer">
        <div className="QuestionLine">Pay</div>
        <div style={{display:"flex", flexDirection:"column"}}>
        <div className="inputWrapper"> 
            <input
            type="number"
            name="pay"
            value={siteInfo.pay}
            onChange={(e) => setSiteInfo({ ...siteInfo, pay: e.target.value})}
            className="inputLine"
            placeholder="Enter pay (e.g., 15.50)"
            />
            <span className="dollarSign">$</span>
        </div>
        <div>
        {formErrors.pay && <div className="error-message">{formErrors.pay}</div>}
        </div>
        </div>
        
        </div> */}

        {/* Starting Date */}
        <div className="lineContainer">
          <div className="QuestionLine">Starting Date</div>
          <div>
            <input
              type="date"
              name="startingDate"
              value={siteInfo.startingDate}
              onChange={(e) => setSiteInfo({ ...siteInfo, startingDate: e.target.value })}
              className="inputLine"
              placeholder="Select starting date..."
            />
            {formErrors.startingDate && <div className="error-message">{formErrors.startingDate}</div>}
          </div>
        </div>
        </div>
        <br />

        {/* Cleaner Buttons */}
        <div className="boxContent">
        <div className="QuestionLine">Cleaner Status</div><br />
        <div className='text2'>{siteInfo.cleaner}</div>
      <div>
      <div className='block'>
        <div className="ButtonContainer" style={{ backgroundColor: "#FFF", marginRight: "auto", marginLeft: "auto", width: "80vw"}}>
          <button
            type="button"
            className={selectedButton === 'New Cleaner' ? 'active' : ''}
            name="newOldCleaner"
            value="New Cleaner"
            onClick={() => {
              setSelectedButton('New Cleaner');
              setSiteInfo({ ...siteInfo, cleaner: 'New Cleaner' }); // Update siteInfo with cleaner type
            }}
            style={{width:"35vw", height: "5vh"}}
          >
            New Cleaner
          </button>
          <button
            type="button"
            className={selectedButton === 'Old Cleaner' ? 'active' : ''}
            name="newOldCleaner"
            value="Old Cleaner"
            onClick={() => {
              setSelectedButton('Old Cleaner');
              setSiteInfo({ ...siteInfo, cleaner: 'Old Cleaner' }); // Update siteInfo with cleaner type
            }}
            style={{width:"35vw", height: "5vh"}}
          >
            Old Cleaner
          </button>
        </div>
        </div>
        <br />
        <div>
            {renderNotesInput('CleanerNotes')}
        </div>
        </div>
       <div>
       {formErrors.cleaner && <div className="error-message">{formErrors.cleaner}</div>}
       </div>
        </div>
        
        <button
          type="submit"
          className="nextButton"
          disabled={isSubmitting}
          style={{ width: '70vw', backgroundColor: isSubmitting ? 'gray' : '#334D9C' }}
        >
          {isSubmitting ? 'Submitting...' : 'Download PDF'}
        </button><br /><br /><br /><br />
      </form>
    </div>
  );
}

export default SupervisorFormCleanerRemoval;
