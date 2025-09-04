import React, { useState } from 'react';
import './PersonalInfoForm.css';
import Canvas from './SignatureDrawComponent';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import Modal from './Modal';


function PersonalInfoForm() {
  // personalInfo state
  const [personalInfo, setPersonalInfo] = useState({
    title: '',
    gender: '',
    surname: '',
    firstName: '',
    dob: '',
    address: '',
    suburb: '',
    postcode: '',
    contactNumber: '',
    email: '',
    emergencyContactName: '',
    relationship: '',
    emergencyContactNumber: '',
    citizenChecked: '',
    residencyChecked: '',
    visaStatus: '',
    abnName: '',
    abn: '',
    taxFileNumber: '',
    bankName: '',
    accountName: '',
    bsbNumber: '',
    accountNumber: '',
    fullName: '',
    signature: '',
    isSiteAllocated: '',
    siteName: '',
  });


  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  // PreCheckList state
  const [checklist, setChecklist] = useState({
    passport: false,
    visa: false,
    driversLicence: false,
    policeCheckCertificate: false,
    workingWithChildrenCertificate: false
  });

  const [fileInputs, setFileInputs] = useState({
    passport: "null",
    visa: "null",
    driversLicence: "null",
    policeCheckCertificate: "null",
    workingWithChildrenCertificate: "null"
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(name, checked)
    setChecklist((prevChecklist) => ({ ...prevChecklist, [name]: checked }));
  };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    
    // Read the file data
    const reader = new FileReader();
    reader.onload = () => {
        // Encode the file data in base64
        const base64Data = reader.result.split(',')[1]; // Extracting base64 data from Data URL
        setFileInputs({ ...fileInputs, [name]: base64Data });
    };
    reader.readAsDataURL(file);
};



    let allStates = {
      personalInfo,
      checklist,
      fileInputs
    };

    const [selectedButton, setSelectedButton] = useState(''); 

  const [siteSelectedButton, setSiteSelectedButton] = useState('');

  const [formErrors, setFormErrors] = useState({});

 

  const validateForm = () => {
    const errors = {};
  
    if (!personalInfo.title) {
      errors.title = 'Title is required';
    }
  
    if (!personalInfo.gender) {
      errors.gender = 'Gender is required';
    }
  
    if (!personalInfo.surname) {
      errors.surname = 'Surname is required';
    }
  
    if (!personalInfo.firstName) {
      errors.firstName = 'First name is required';
    }
  
    if (!personalInfo.dob) {
      errors.dob = 'Date of birth is required';
    }
  
    if (!personalInfo.address) {
      errors.address = 'Address is required';
    }
  
    if (!personalInfo.suburb) {
      errors.suburb = 'Suburb is required';
    }
  
    if (!personalInfo.postcode) {
      errors.postcode = 'Postcode is required';
    }
    
    if (!personalInfo.contactNumber) {
      errors.contactNumber = 'Contact number is required';
    }
    if (!personalInfo.email) {
      errors.email = 'Email is required';
    }
    if (!personalInfo.emergencyContactName) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }
  
    if (!personalInfo.relationship) {
      errors.relationship = 'Relationship is required';
    }
  
    if (!personalInfo.emergencyContactNumber) {
      errors.emergencyContactNumber = 'Emergency contact number is required';
    }
  
    if (!personalInfo.citizenChecked) {
      errors.citizenChecked = 'Citizenship status is required';
    }
  
    if (personalInfo.citizenChecked==="No" && !personalInfo.residencyChecked) {
      errors.residencyChecked = 'Residency status is required';
    }
  
    if (personalInfo.citizenChecked==="No" && !personalInfo.visaStatus) {
      errors.visaStatus = 'Visa status is required';
    }
    if (!personalInfo.abnName) {
      errors.abnName = 'ABN name is required';
    }
    if (!personalInfo.abn) {
      errors.abn = 'ABN is required';
    }
    if (!personalInfo.taxFileNumber) {
      errors.taxFileNumber = 'Tax file number is required';
    }
    if (!personalInfo.bankName) {
      errors.bankName = 'Bank Name is required';
    }
    if (!personalInfo.accountName) {
      errors.accountName = 'Account Name is required';
    }
    if (!personalInfo.bsbNumber) {
      errors.bsbNumber = 'BSB Number is required';
    }
    if (!personalInfo.accountNumber) {
      errors.accountNumber = 'Account Number is required';
    }

    // Validate document uploads
  if (!checklist.passport && fileInputs.passport === null) {
    errors.passport = 'Passport copy is required';
  }

  if (!checklist.visa && fileInputs.visa === null) {
    errors.visa = 'Visa copy is required';
  }

  if (!personalInfo.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const scriptUrl = "https://script.google.com/macros/s/AKfycby0A6VYSp3z0pWGdBpBw6k-b-E-kjfF1h1wHB1PhoYP8vC_ExNKWAzfUx0ENqyP3EzH/exec"

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setsubmittedSuccessfully] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting")
    if (validateForm()) {
      setIsSubmitting(true); 
      const formData = {
        ...personalInfo,
        ...checklist,
      };
  
      const formDataToSubmit = new FormData();
  
      // Append each key-value pair from formData to formDataToSubmit
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }

      // Perform form submission using fetch
      fetch(scriptUrl, {
        method: 'POST',
        body: formDataToSubmit
      })
      .then(response => {
        
        if (response.ok) {
          handleFileUpload(e);
          console.log('Form submitted successfully');
        } else {
          console.error('Form submission failed');
          setsubmittedSuccessfully(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error cases
      });
    } else {
      
      const firstErrorKey = Object.keys(formErrors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  function handleFileUpload(e) {
    e.preventDefault();
    console.log("Uploading Files")
    const scriptUrl2 = "https://script.google.com/macros/s/AKfycbxAVjOLgslNda4L9BW851riaR6I-qXWIAS8_0coc7JwNsakr3uiGZslYRFS-0vXj5dM/exec"
    const formData = new FormData();


    formData.append("fullName", personalInfo.fullName);
    formData.append("passport", fileInputs.passport);
    formData.append("visa", fileInputs.visa);
    formData.append("driversLicence", fileInputs.driversLicence);
    formData.append("policeCheckCertificate", fileInputs.policeCheckCertificate);
    formData.append("workingWithChildrenCertificate", fileInputs.workingWithChildrenCertificate);

    fetch(scriptUrl2, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setIsSubmitting(false); 
       setsubmittedSuccessfully(true);
       console.log(response)
      })
      .catch((error) => {
        // Handle errors
        console.error("Error during file upload:", error);
      });
  }
  
  const handleExportedImage = (data, canvasType) => {
    if (canvasType === 'signature') {
      setPersonalInfo(prevState => ({
        ...prevState,
        signature: data
      }));
    }
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
    <React.Fragment>
        <Header heading="Contractor Detail Form" subHeading="Please fill in your details below" companyLogoVisibility={true}/>
      <form onSubmit={handleSubmit}>

      <div className="boxContent">

      <div className="container">
      <div className="Question">Title</div>
      <div className="answer">
        <select
          name="title"
          value={personalInfo.title}
          onChange={handleInputChange}
          className='dropdown'>
          <option value="" disabled>Please select...</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Ms">Ms</option>
        </select>
        <div>
        {formErrors.title && <div className="error-message">{formErrors.title}</div>}
        </div>
      </div>
      </div>
      
      <div className="container">
      <div className="Question">Gender</div>
      <div>
      <div className="ButtonContainer">
        <button
         type="button"
          className={selectedButton === 'Male' ? 'active' : ''}
          name="gender"
          value="Male"
          onClick={()=>{handleInputChange({ target: { name: 'gender', value: 'Male' } }); setSelectedButton("Male")}}
        >
          Male
        </button>
        <button
         type="button"
          className={selectedButton === 'Female' ? 'active' : ''}
          name="gender"
          value="Female"
          onClick={()=>{handleInputChange({ target: { name: 'gender', value: 'Female' } }); setSelectedButton("Female")}}
        >
          Female
        </button>
        <button
         type="button"
          className={selectedButton === 'Others' ? 'active' : ''}
          name="gender"
          value="Others"
          onClick={()=>{handleInputChange({ target: { name: 'gender', value: 'Others' } }); setSelectedButton("Others")}}
        >
          Others
        </button>
      </div>
      <div>
        {formErrors.gender && <div className="error-message">{formErrors.gender}</div>}
        </div>
        </div>
    </div>
      
        <div className="lineContainer">
          <div className="QuestionLine">Surname</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="surname"
              value={personalInfo.surname}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter surname...'
            />
          </div>
          <div>
          {formErrors.surname && <div className="error-message">{formErrors.surname}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">First name</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter first name...'

            />
          </div>
          <div>
          {formErrors.firstName&& <div className="error-message">{formErrors.firstName}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Date of Birth</div>
          <div>
          <div className="answerLine">
            <input
              type="date"
              name="dob"
              value={personalInfo.dob}
              onChange={handleInputChange}
              className='dateLine'
            />
          </div>
          <div>
          {formErrors.dob && <div className="error-message">{formErrors.dob}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Address</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="address"
              value={personalInfo.address}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter address...'
            />
          </div>
          <div>
          {formErrors.address && <div className="error-message">{formErrors.address}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Suburb</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="suburb"
              value={personalInfo.suburb}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter suburb...'
            />
          </div>
          <div>
          {formErrors.suburb && <div className="error-message">{formErrors.suburb}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Postcode</div>
          <div>
          <div className="answerLine">
            <input
              type="number"
              name="postcode"
              value={personalInfo.postcode}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter postcode...'
            />
          </div>
          <div>
          {formErrors.postcode && <div className="error-message">{formErrors.postcode}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Contact Number</div>
          <div>
          <div className="answerLine">
            <input
              type="number"
              name="contactNumber"
              value={personalInfo.contactNumber}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter contact number...'

            />
          </div>
          <div>
          {formErrors.contactNumber && <div className="error-message">{formErrors.contactNumber}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Email</div>
          <div>
          <div className="answerLine">
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter email...'

            />
          </div>
          <div>
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Emergency Contact Name</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="emergencyContactName"
              value={personalInfo.emergencyContactName}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter name...'
            />
          </div>
          <div>
          {formErrors.emergencyContactName && <div className="error-message">{formErrors.emergencyContactName}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Relationship</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="relationship"
              value={personalInfo.relationship}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter relationship...'
            />
          </div>
          <div>
          {formErrors.relationship && <div className="error-message">{formErrors.relationship}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">Emergency Contact Number</div>
          <div>
          <div className="answerLine">
            <input
              type="number"
              name="emergencyContactNumber"
              value={personalInfo.emergencyContactNumber}
              onChange={handleInputChange}
              className='inputLine'
              placeholder='Enter contact number...'
            />
          </div>
          <div>
          {formErrors.emergencyContactNumber && <div className="error-message">{formErrors.emergencyContactNumber}</div>}
        </div>
        </div>
        </div>
        
        <div className="lineContainer">
          <div className="QuestionLine">Are you an Australian Citizen?</div>
          <div>
          <div className="answerLine">
            <label className='answerText'> <input type="checkbox" name="citizenChecked" value="Yes" checked={personalInfo.citizenChecked === 'Yes'} onChange={handleInputChange} className='checkbox'/>Yes</label>
            <label className='answerText'> <input type="checkbox" name="citizenChecked" value="No" checked={personalInfo.citizenChecked === 'No'} onChange={handleInputChange} className='checkbox'/>No</label>
          </div>
          <div>
          {formErrors.citizenChecked && <div className="error-message">{formErrors.citizenChecked}</div>}
        </div>
        </div>
        </div>

        {personalInfo.citizenChecked==="No" && (<div className="lineContainer">
          <div className="QuestionLine">If no, do you have Residency Status?</div>
          <div>
          <div className="answerLine">
            <label className='answerText'> <input type="checkbox" name="residencyChecked" value="Yes" checked={personalInfo.residencyChecked === 'Yes'} onChange={handleInputChange} className='checkbox'/>Yes</label>
            <label className='answerText'> <input type="checkbox" name="residencyChecked" value="No" checked={personalInfo.residencyChecked === 'No'} onChange={handleInputChange} className='checkbox'/>No</label>
          </div>
          <div>
          {formErrors.residencyChecked && <div className="error-message">{formErrors.residencyChecked}</div>}
        </div>
        </div>
        </div>)}

        {personalInfo.citizenChecked==="No" && (<div className="lineContainer">
          <div className="QuestionLine"><b>Visa Status</b></div>
          <div>
          <div className="answerLineCheckBox">
            <label className='answerText'>
              <input
                type="checkbox"
                name="visaStatus"
                value="Work Visa"
                checked={personalInfo.visaStatus === 'Work Visa'}
                onChange={handleInputChange}
                className='checkbox'
              />
              Work Visa
            </label>
            <label className='answerText'>
              <input
                type="checkbox"
                name="visaStatus"
                value="Student Visa"
                checked={personalInfo.visaStatus === 'Student Visa'}
                onChange={handleInputChange}
                className='checkbox'
              />
              Student Visa
            </label>
            <label className='answerText'>
              <input
                type="checkbox"
                name="visaStatus"
                value="Other"
                checked={personalInfo.visaStatus === 'Other'}
                onChange={handleInputChange}
                className='checkbox'
              />
              Other
            </label>
          </div>
          <div>
          {formErrors.visaStatus && <div className="error-message" style={{textAlign:"center"}}>{formErrors.visaStatus}</div>}
        </div>
        </div>
        </div>)}

        <div className="subHeading"><h3>NOTE: YOU MUST PROVIDE A COPY OF YOUR VISA</h3></div>


        <div className="VisaDetailsContainer">
          <div className="lineContainer">
            <div className="QuestionLine"><b>ABN</b> Name: </div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="abnName"
                value={personalInfo.abnName}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter ABN name...'

              />
            </div>
            <div>
            {formErrors.abnName && <div className="error-message">{formErrors.abnName}</div>}
            </div>
            </div>
          </div>
          <div className="lineContainer">
            <div className="QuestionLine"><b>ABN:</b></div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="abn"
                value={personalInfo.abn}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter ABN...'

              />
            </div>
            <div>
            {formErrors.abn && <div className="error-message">{formErrors.abn}</div>}
            </div>
            </div>
          </div>
          <div className="lineContainer">
            <div className="QuestionLine"><b>Tax File Number:</b></div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="taxFileNumber"
                value={personalInfo.taxFileNumber}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter tax file number...'

              />
            </div>
            <div>
            {formErrors.taxFileNumber && <div className="error-message">{formErrors.taxFileNumber}</div>}
            </div>
            </div>
          </div>
        </div>
<br />
        <div className="subHeading"><h3>BANKING DETAILS</h3></div>

        <div className="VisaDetailsContainer">
          <div className="lineContainer">
            <div className="QuestionLine"><b>Bank</b> Name</div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="bankName"
                value={personalInfo.bankName}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter Bank name...'

              />
            </div>
            <div>
            {formErrors.bankName && <div className="error-message">{formErrors.bankName}</div>}
            </div>
            </div>
          </div>
          <div className="lineContainer">
            <div className="QuestionLine"><b>Account Name</b></div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="accountName"
                value={personalInfo.accountName}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter Account Name...'

              />
            </div>
            <div>
            {formErrors.accountName && <div className="error-message">{formErrors.accountName}</div>}
            </div>
            </div>
          </div>
          <div className="lineContainer">
            <div className="QuestionLine"><b>BSB Number</b></div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="bsbNumber"
                value={personalInfo.bsbNumber}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter BSB number...'

              />
            </div>
            <div>
            {formErrors.bsbNumber && <div className="error-message">{formErrors.bsbNumber}</div>}
            </div>
            </div>
          </div>
          <div className="lineContainer">
            <div className="QuestionLine"><b>Account Number</b></div>
            <div>
            <div className="answerLine">
              <input
                type="text"
                name="accountNumber"
                value={personalInfo.accountNumber}
                onChange={handleInputChange}
                className='inputLine'
                placeholder='Enter Account number...'

              />
            </div>
            <div>
            {formErrors.accountNumber && <div className="error-message">{formErrors.accountNumber}</div>}
            </div>
            </div>
          </div>
        </div>
      </div>

<br /><br />

<div className="boxContent">
      <div className="heading"><h3>Pre Start Check List</h3></div>
      <div className="subHeading"><h4>We require the following information to be provided prior to commencement:</h4></div>
      <div className='answerCheckbox'>
        <label className='answerLineCheckBox'>
          <input
            type="checkbox"
            name="passport"
            checked={checklist.passport}
            onChange={handleCheckboxChange}
            className='checkbox'
          />
          A copy of your Passport*
        </label>
        {checklist.passport && 
          <input
            type="file"
            name="passport"
            className='FileInput'
            onChange={(e) => handleFileChange(e, "passport")}
          />
        }
        <div>
          {formErrors.passport && <div className="error-message">{formErrors.passport}</div>}
        </div>
        <br />
        <label className='answerLineCheckBox'>
          <input
            type="checkbox"
            name="visa"
            checked={checklist.visa}
            onChange={handleCheckboxChange}
            className='checkbox'
          />
          A copy of your Visa*
        </label>
        {checklist.visa && (
          <input
            type="file"
            name="visa"
            className='FileInput'
            onChange={(e) => handleFileChange(e, "visa")}
          />
        )}
        <div>
          {formErrors.visa && <div className="error-message">{formErrors.visa}</div>}
        </div>
        <br />
        <label className='answerLineCheckBox'>
          <input
            type="checkbox"
            name="driversLicence"
            checked={checklist.driversLicence}
            onChange={handleCheckboxChange}
            className='checkbox'
          />
          A copy of your Drivers Licence (Please provide if available)
        </label>
        {checklist.driversLicence && (
          <input
            type="file"
            name="driversLicence"
            className='FileInput'
            onChange={(e) => handleFileChange(e, "driversLicence")}
          />
        )}
        <div></div>
        <br />
        <label className='answerLineCheckBox'>
          <input
            type="checkbox"
            name="policeCheckCertificate"
            checked={checklist.policeCheckCertificate}
            onChange={handleCheckboxChange}
            className='checkbox'
          />
          A copy of your National Police Check Certificate (Please provide if available)
        </label>
        {checklist.policeCheckCertificate && (
          <input
            type="file"
            name="policeCheckCertificate"
            className='FileInput'
            onChange={(e) => handleFileChange(e, "policeCheckCertificate")}
          />
        )}
        <div></div>
        <br />
        <label className='answerLineCheckBox'>
          <input
            type="checkbox"
            name="workingWithChildrenCertificate"
            checked={checklist.workingWithChildrenCertificate}
            onChange={handleCheckboxChange}
            className='checkbox'
          />
          A copy of your Working with Children Certificate (if requested)
        </label>
        {checklist.workingWithChildrenCertificate && (
          <input
            type="file"
            name="workingWithChildrenCertificate"
            className='FileInput'
            onChange={(e) => handleFileChange(e, "workingWithChildrenCertificate")}
          />
        )}
        <div></div>
        <br />
      </div>
    </div>
      <br /><br />

    <div className="boxContent">
      <div className="heading"><u>CONTRACTOR AGREEMENT</u></div>
      <br />
      <label className='answerText'>I, </label>
      <input 
        type="text" 
        name="fullName" 
        placeholder="Your full name" 
        value={personalInfo.fullName}
        onChange={handleInputChange}
        className={formErrors.fullName ? 'inputLine error' : 'inputLine'}
      />
      <label className='answerText'>declare that the information provided is true and current.</label><br />
      
      <br /><br />
      
      <br />

      <div>
        <Canvas onExport={(data) => handleExportedImage(data, 'signature')} />
      </div>
    </div>
<br /><br />


 

{/*       
      <div className="boxContent">
      <div className="lineContainer">
        <div className="QuestionLine">How many hours are you permitted to work each week?</div>
        <div>
        <div className="answerLine">
          <input 
            type="number" 
            name="permittedHours" 
            value={availability.permittedHours} 
            onChange={handleAvailabilityInputChange} 
            className='inputLine'
            placeholder='Enter number of hours...'

          />
        </div>
        <div>
              {formErrors.permittedHours && <div className="error-message">{formErrors.permittedHours}</div>}
          </div>
          </div>
      </div>
      <div className="lineContainer">
        <div className="QuestionLine">How many hours are available to work each week?</div>
        <div>
        <div className="answerLine">
          <input 
            type="number" 
            name="availableHours" 
            value={availability.availableHours} 
            onChange={handleAvailabilityInputChange} 
            className='inputLine'
            placeholder='Enter number of hours...'

          />
        </div>
        <div>
              {formErrors.availableHours && <div className="error-message">{formErrors.availableHours}</div>}
          </div>
          </div>
      </div>
      <div className="lineContainer">
          <div className="QuestionLine">What is your availability? (PLEASE TICK) </div>
          <div>
          <div className="answerLineCheckBox">
            <label className='answerCheckbox'>
              <input
                type="checkbox"
                name="availableTime"
                value="Morning"
                checked={availability.availableTime === 'Morning'}
                onChange={handleAvailabilityInputChange}
              />
              Morning
            </label>
            <label className='answerText'>
              <input
                type="checkbox"
                name="availableTime"
                value="During the day"
                checked={availability.availableTime === 'During the day'}
                onChange={handleAvailabilityInputChange}
              />
              During the day
            </label>
            <label className='answerText'>
              <input
                type="checkbox"
                name="availableTime"
                value="Evening"
                checked={availability.availableTime === 'Evening'}
                onChange={handleAvailabilityInputChange}
              />
              Evening
            </label>
          </div>
          <div>
              {formErrors.availableTime && <div className="error-message" style={{textAlign:"center"}}>{formErrors.availableTime}</div>}
          </div>
          </div>
        </div>
      <div className='lineContainer'>
      <div className="QuestionLine">What times are you available to work (between what hours)? </div>
      <div>
        <div className="timeLine">
        <input 
          type="time" 
          name="startTime" 
          value={availability.startTime} 
          onChange={handleAvailabilityInputChange} 
          className='timeInput'
        />&nbsp; TO &nbsp;
        <input 
          type="time" 
          name="endTime" 
          value={availability.endTime} 
          onChange={handleAvailabilityInputChange} 
          className='timeInput'
        />
        </div>
        <div>
        {formErrors.startTime && <div className="error-message" style={{textAlign:"center"}}>{formErrors.startTime}</div>}
        </div>
        </div>
      </div>
    </div>
<br /><br />

    <div className="boxContent">
      <div className="lineContainer1">
        <div className="Question">Which days are you available to work?</div>
        <div>
        <div className="answerLineVerticalCheckBox">
          <label  className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="monday" 
            checked={availabilityDay.monday} 
            onChange={handleAvailabilityDayChange}
            className='checkbox' 
          />Mondays</label>
          <label  className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="tuesday" 
            checked={availabilityDay.tuesday} 
            onChange={handleAvailabilityDayChange} 
            className='checkbox' 
          />Tuesdays</label>
          <label  className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="wednesday" 
            checked={availabilityDay.wednesday} 
            onChange={handleAvailabilityDayChange} 
            className='checkbox' 
          />Wednesdays</label>
          <label  className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="thursday" 
            checked={availabilityDay.thursday} 
            onChange={handleAvailabilityDayChange} 
            className='checkbox' 

          />Thursdays</label>
          <label  className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="friday" 
            checked={availabilityDay.friday} 
            onChange={handleAvailabilityDayChange} 
            className='checkbox' 

          />Fridays</label>
          <label  className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="saturday" 
            checked={availabilityDay.saturday} 
            onChange={handleAvailabilityDayChange} 
            className='checkbox' 
          />Saturdays</label>
          <label className='answerCheckboxVertical'><input 
            type="checkbox" 
            name="sunday" 
            checked={availabilityDay.sunday} 
            onChange={handleAvailabilityDayChange} 
            className='checkbox' 
          />Sundays</label>
        </div>
        <div>
              {formErrors.availabilityDay && <div className="error-message" style={{textAlign:"center"}}>{formErrors.availabilityDay}</div>}
          </div>
          </div>
      </div>
    </div> */}

    <button  type='submit' className="nextButton" disabled={isSubmitting}>Submit</button>
    {isSubmitting && <Modal heading="Loading" subHeading="Please wait while your form is being submitted" buttonPresent="false" />}
    {submittedSuccessfully && <Modal heading="Success" subHeading="Your Form has been submitted successfully" buttonPresent="true" close={setsubmittedSuccessfully} refresh={()=>{ window.location.reload()}} pdfbutton={()=>{}} submitDisable={()=>{}}/>}

    </form>


    </React.Fragment>
  )
}

export default PersonalInfoForm;
