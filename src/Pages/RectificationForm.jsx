import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './RectificationForm.css';



const MediaSummary = ({ images }) => {
    return (
        <div className="mediaSummary">
            <div className="imageGrid">
                {images.map((image, index) => (
                    <div key={index} className="mediaImageBox">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="mediaPreviewImage" />
                    </div>
                ))}
            </div>
        </div>
    );
};

function RectificationForm() {
    const [siteInfo, setSiteInfo] = useState({
        siteName: '',
        conductedOn: new Date().toISOString().split('T')[0],
        preparedBy: '',
        location: '',
    });

    const [beforeImages, setBeforeImages] = useState([]);
    const [afterImages, setAfterImages] = useState([]);

    const [notes, setNotes] = useState({
        entrance: '',
        reception: '',
    });
    const [showNotes, setShowNotes] = useState({
        entrance: false,
        reception: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSiteInfo({ ...siteInfo, [name]: value });
    };

    const handleImageChange = (e, section) => {
        const files = Array.from(e.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more if needed
        const selectedImages = files.filter((file) => allowedTypes.includes(file.type));
    
        const promises = selectedImages.map((image) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
    
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = 800; // Adjust as needed
                        canvas.height = canvas.width * (img.height / img.width);
    
                        // Draw image on canvas
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                        // Convert canvas to blob
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, 'image/jpeg', 0.5); // Adjust quality as needed
                    };
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(image);
            });
        });
    
        Promise.all(promises).then((compressedImages) => {
            switch (section) {
                case 'before':
                    setBeforeImages(compressedImages);
                    break;
                case 'after':
                    setAfterImages(compressedImages);
                    break;
                default:
                    break;
            }
        });
    };
    

    const renderImagePreview = (sectionImages) => {
        return (
            <div className="imageGrid">
                {sectionImages.map((image, index) => (
                    <div key={index} className="imageBox">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="previewImage" />
                    </div>
                ))}
            </div>
        );
    };
    
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
            <div><br />
                <button onClick={() => toggleNotesVisibility(section)} className='addNotesButton block'>Add Notes</button>
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

    const validateForm = () => {
        const errors = {};

        if (!siteInfo.siteName) {
            errors.siteName = 'Site name is required';
        }
        if (!siteInfo.clientName) {
            errors.clientName = 'Client name is required';
        }
        if (!siteInfo.preparedBy) {
            errors.preparedBy = "Cleaner's name is required";
        }
        if(beforeImages.length === 0){
            errors.entranceImages = 'Entrance images are required';
        }
        if(afterImages.length === 0){
            errors.receptionImages = 'Reception images are required';
        }
        if(fileInputs.audit === "null"){
            errors.audit = 'Audit file is required';

        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
    const [generatePDF, setGeneratePDF] = useState(false);
    const [submitBtn, setSubmitBtn] = useState(true);
    const [fileInputsSubmission, setFileInputsSubmission] = useState(false)

    const [fileInputs, setFileInputs] = useState({
        audit: "null",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form
        if (validateForm()) {
            setIsSubmitting(true); 
            console.log('Form submission started');
            handleSubmitAuditFile(e)
        }
    };



    const handleSubmitAuditFile = (e) => {
        e.preventDefault();
          setIsSubmitting(true); 
          setFileInputsSubmission(true)
          console.log("Uploading Files")
          const scriptUrl2 = "https://script.google.com/macros/s/AKfycbwqN2ZNJ9jWMY_fPN2hOJDOBemMAEL5ggvvwoiyDZBSd9zGigbu81YkwybPs5iuW26EdQ/exec"
          const formData = new FormData();
      
      
          formData.append("fullName", siteInfo.siteName+" "+siteInfo.conductedOn);
          formData.append("Rectification Report", fileInputs.audit);
      
      
          fetch(scriptUrl2, {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              setIsSubmitting(false); 
             setSubmittedSuccessfully(true);
             console.log(response)
            })
            .catch((error) => {
              // Handle errors
              setIsSubmitting(false); 
              console.error("Error during file upload:", error);
            });

      }
    

    useEffect(() => {
        window.scrollTo(0, 0);
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchLocationName(latitude, longitude);
            },
            error => {
                console.error("Error fetching GPS location:", error);
            }
        );
    }, []);

    const fetchLocationName = (latitude, longitude) => {
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1b5dc54a766844e1a83de0721020a21e`)
            .then(response => response.json())
            .then(data => {
                const addressComponents = data.results[0].formatted.split(','); // Split address by commas
                // Remove the first component (company name)
                addressComponents.shift();
                // Join the remaining components back into a string
                const placeName = addressComponents.join(',').trim();
                // Update the location state with the modified address
                setSiteInfo(prevState => ({ ...prevState, location: placeName }));
                console.log(placeName);
            })
            .catch(error => {
                console.error("Error fetching location name:", error);
            });
    };

    console.log(fileInputs.audit)
    return (
        <React.Fragment>

            <Header heading="Rectification Form" subHeading="" visibility="collapse"/>
            <br />
            <form onSubmit={handleSubmit}>
                <div className="boxContent">
                    <div className="lineContainer">
                        <div className="QuestionLine">Site Conducted</div>
                        <div>
                            <div className="answerLine ">
                                <input
                                    type="text"
                                    name="siteName"
                                    value={siteInfo.siteName}
                                    onChange={handleInputChange}
                                    className="inputLine"
                                    placeholder="Enter site name..."
                                />
                            </div>
                            <div>
                                {formErrors.siteName && <div className="error-message">{formErrors.siteName}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="lineContainer">
                        <div className="QuestionLine">Location</div>
                        <div>
                            <div className="answerLine">
                                <textarea
                                    type="text"
                                    name="location"
                                    value={siteInfo.location}
                                    className="inputLine bold"
                                    placeholder="Enter Location"
                                    disabled
                                    rows={3}
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div className="lineContainer">
                        <div className="QuestionLine">Prepared by</div>
                        <div>
                            <div className="answerLine">
                                <input
                                    type="text"
                                    name="preparedBy"
                                    value={siteInfo.preparedBy}
                                    onChange={handleInputChange}
                                    className="inputLine"
                                    placeholder="Enter your name..."
                                />
                            </div>
                            <div>
                                {formErrors.siteName && <div className="error-message">{formErrors.preparedBy}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="lineContainer">
                        <div className="QuestionLine">Prepared on</div>
                        <div>
                            <div className="answerLine">
                                <input
                                    type="date"
                                    name="conductedOn"
                                    value={siteInfo.conductedOn}
                                    className="inputLine bold"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="boxContent">
                    <div className="sectionHeader">BEFORE PHOTOS - Taken prior to work commencing</div><br />
                <div className="block">
                <div className="lineContainer">
                        <div className='center'>
                            <div className="block">
                            <label htmlFor="fileInputBefore" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputBefore"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'before')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.entranceImages && <div className="error-message">{formErrors.images}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                    <div>
                        {beforeImages.length!==0 && renderImagePreview(beforeImages)}
                    </div>
                    <div>
                    {renderNotesInput('entrance')}
                    </div>
                </div>
                <br />
                <div className="boxContent">
                    <div className="sectionHeader">AFTER PHOTOS - Taken after work has been completed</div><br />
                    <div className="block">
                <div className="lineContainer">
                        <div className='center'>
                            <div className="block">
                            <label htmlFor="fileInputAfter" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputAfter"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'after')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.receptionImages && <div className="error-message">{formErrors.images}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                    <div>
                        {afterImages.length!==0 && renderImagePreview(afterImages)}
                        </div>
                        <div>
                    {renderNotesInput('reception')}
                    </div>
                </div>
                <br />
                
                <div className="boxContent">
                    <div className="sectionHeader"><b>Media Summary</b></div><br />
                    <MediaSummary images={[...beforeImages, ...afterImages,]} />
                </div>
                <button  type='button' className="nextButton" disabled={isSubmitting} onClick={()=>{window.print();setGeneratePDF(true)}} style={{width:"70vw"}}>Download PDF</button><br /><br /><br /><br />
                {generatePDF && (<div className='boxContent block'>

                 <label htmlFor="contractPDF" className='QuestionLine block'>Upload Rectification Report PDF</label>
                 <input type="file" name="audit" id="contract" className='answerline top block' onChange={(e)=>{handleFileChange(e, "audit")}}/>
                 {formErrors.audit && <div className="error-message">{formErrors.audit}</div>}
                 <button  type='submit' className='fileUploadBtn block'>Final Submission</button>

                 {isSubmitting && fileInputsSubmission && <Modal heading="Loading" subHeading="Please wait while your rectification report is being submitted" buttonPresent="false" />}
                 {submittedSuccessfully && fileInputsSubmission && <Modal heading="Success" subHeading="Your rectification report has been submitted successfully finally." subHeading1="Have a good day." buttonPresent="true" close={setSubmittedSuccessfully} pdfbutton={()=>{}} refresh={()=>{window.location.reload()}} submitDisable={setSubmitBtn}/>}
                    </div>)}
            </form>
        </React.Fragment>
    );
}

export default RectificationForm;
