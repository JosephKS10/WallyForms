import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './CleanerAudit.css';



const MediaSummary = ({ images }) => {
    return (
        <div>
        <div className="mediaSummary">
            <div className="imageGrid">
                {images.map((image, index) => (
                    <div key={index} className="mediaImageBox">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="mediaPreviewImage" />
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};



function CleanerAuditScreen() {
    const [siteInfo, setSiteInfo] = useState({
        siteName: '',
        conductedOn: new Date().toISOString().split('T')[0],
        preparedBy: '',
        location: '',
        anyMoreBuildings: '',
        photosOfMoreBuilding: '',
    });
    console.log(siteInfo)
    const [entranceImages, setEntranceImages] = useState([]);
    const [receptionImages, setReceptionImages] = useState([]);
    const [kitchenImages, setKitchenImages] = useState([]);
    const [washroomImages, setWashroomImages] = useState([]);
    const [cleanerImages, setCleanerImages] = useState([]);

    const [notes, setNotes] = useState({
        entrance: '',
        reception: '',
        kitchen: '',
        washrooms: '',
        cleaner: '',
    });
    const [showNotes, setShowNotes] = useState({
        entrance: false,
        reception: false,
        kitchen: false,
        washrooms: false,
        cleaner: false,
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
                case 'entrance':
                    setEntranceImages(compressedImages);
                    break;
                case 'reception':
                    setReceptionImages(compressedImages);
                    break;
                case 'kitchen':
                    setKitchenImages(compressedImages);
                    break;
                case 'washroom':
                    setWashroomImages(compressedImages);
                    break;
                case 'cleaner':
                    setCleanerImages(compressedImages);
                    break;   
                default:
                    break;
            }
        });
    };
    

    const renderImagePreview = (sectionImages) => {
        return (
            <div>
            <div className="imageGrid">
                {sectionImages.map((image, index) => (
                    <div key={index} className="imageBox">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="previewImage" />
                    </div>
                ))}
            </div>
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
            <div>
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

    const [selectedButton, setSelectedButton] = useState(''); 
    const [selectedButton2, setSelectedButton2] = useState(''); 


    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        if (!siteInfo.siteName) {
            errors.siteName = 'Site name is required';
        }
        if (!siteInfo.preparedBy) {
            errors.preparedBy = "Cleaner's name is required";
        }
        if(!siteInfo.anyMoreBuildings){
            errors.anyMoreBuildings = 'This field is required';
        }
        if(siteInfo.anyMoreBuildings === 'Yes' && !siteInfo.photosOfMoreBuilding){
            errors.photosOfMoreBuilding = 'This field is required';
        }
        if(siteInfo.anyMoreBuildings === 'Yes' && siteInfo.photosOfMoreBuilding === "No"){
            errors.photosOfMoreBuilding = 'Please upload the photos of every building';
        }
        if(entranceImages.length === 0){
            errors.entranceImages = 'Entrance images are required';
        }
        if(receptionImages.length === 0){
            errors.receptionImages = 'Reception images are required';
        }
        if(kitchenImages.length === 0){
            errors.kitchenImages = 'Kitchen images are required';
        }
        
        if(washroomImages.length === 0){
            errors.washroomImages = 'Washroom images are required';
        }
        if(cleanerImages.length === 0){
            errors.cleanerImages = 'Cleaner images are required';
        }
        

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const [formErrors2, setFormErrors2] = useState({});

    const validateForm2 = () => {
        const errors = {};
        if(fileInputs.audit === "null"){
            errors.audit = 'Audit file is required';
        }

        setFormErrors2(errors);
        return Object.keys(errors).length === 0;
    };


    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
    // const [generatePDF, setGeneratePDF] = useState(false);
    // const [submitBtn, setSubmitBtn] = useState(true);
    // const [fileInputsSubmission, setFileInputsSubmission] = useState(false)

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

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Validate form
    //     if (validateForm2()) {
    //         setIsSubmitting(true); 
    //         console.log('Form submission started');
    //         handleSubmitAuditFile(e)
    //     }
    // };

    const scriptUrl = "https://script.google.com/macros/s/AKfycby980DOHGeb7Hns1GOC94EmNvsIOmbLYU6BGK-SkvEuVuRPTb18HodRUZKlf1g2hRZq/exec"

    const [formSubmitted, setFormSubmitted] = useState(false);

   

    const handleSubmitData = (e) => {
        e.preventDefault();
        console.log("submitting")
        if(formSubmitted){
            window.print();
            
        }
        else{
        if (validateForm()) {
            setIsSubmitting(true);
          const formData = {
            ...siteInfo,
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
              console.log('Form submitted successfully');
              
              setFormSubmitted(true);
              setIsSubmitting(false);
              window.print();
            } else {
              console.error('Form submission failed');
              setIsSubmitting(false);
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
    }
      };


    // const handleSubmitAuditFile = (e) => {
    //     e.preventDefault();
    //       setIsSubmitting(true); 
    //       setFileInputsSubmission(true)
    //       console.log("Uploading Files")
    //       const scriptUrl2 = "https://script.google.com/macros/s/AKfycbxZBXhjrUuMEC_G1pYYAUHCzNo0QhqkX3IPE_H4dlaY_1R01nzU23z0lZ100tnReVVv/exec"
    //       const formData = new FormData();
      
      
    //       formData.append("fullName", siteInfo.siteName+" "+siteInfo.conductedOn);
    //       formData.append("audit", fileInputs.audit);
      
      
    //       fetch(scriptUrl2, {
    //         method: "POST",
    //         body: formData,
    //       })
    //         .then((response) => {
    //           setIsSubmitting(false); 
    //          setSubmittedSuccessfully(true);
    //          console.log(response)
    //         })
    //         .catch((error) => {
    //           // Handle errors
    //           setIsSubmitting(false); 
    //           console.error("Error during file upload:", error);
    //         });

    //   }
    

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

    return (
        <React.Fragment>
            <Header heading="Cleaning Audit" subHeading="" visibility="visible" companyLogoVisibility={false}/>
            <div className='formHeading'></div>
            <form onSubmit={handleSubmitData}>
                <div className="boxContent">
                    <div className="lineContainer">
                        <div className="QuestionLine">Site Name</div>
                        <div>
                            <div className="answerLine">
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
                        <div className="QuestionLine">Conducted on</div>
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
                                    rows={5}
                                />
                            </div>
                            
                        </div>
                    </div>
                   
                </div>
                <br />
                <div className="boxContent">
                    <div className="sectionHeader"><b>Photos of Entrance And Reception</b> - (cobwebs, vacuuming of door mat, cleaning of glass doors, door sills, air vents and reception table)</div>
                    <div className="block">
                <div className="lineContainer">
                        <div>
                            <div className="answerLine">
                            <label htmlFor="fileInputEntrance" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputEntrance"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'entrance')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.entranceImages && <div className="error-message">{formErrors.entranceImages}</div>}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                        {entranceImages.length!==0 && renderImagePreview(entranceImages)}
                    </div>
                    <div>
                    {renderNotesInput('entrance')}
                    </div>
                </div>
                <br />
                <div className="boxContent">
                    <div className="sectionHeader"><b>Photos of Office Areas  and Administrative Areas</b> - (Tables, window sills, skirting boards, stairs hand railings and ledges, air vents, dusting and removal of cobwebs around corners and edges)
</div>
                    <div className="block">
                <div className="lineContainer">
                        <div>
                            <div className="answerLine">
                            <label htmlFor="fileInputReception" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputReception"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'reception')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.receptionImages && <div className="error-message">{formErrors.receptionImages}</div>}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                        {receptionImages.length!==0 && renderImagePreview(receptionImages)}
                        </div>
                        <div>
                    {renderNotesInput('reception')}
                    </div>
                </div>
                <br />
                <div className="boxContent">
                    <div className="sectionHeader"><b>Photos of Kitchen</b> - (Fridge exteriors, cabinet doors, air vents, cobwebs, under appliances, behind and top of bins, dusting and under dispensers)</div>
                <div className="block">
                <div className="lineContainer">
                        <div>
                            <div className="answerLine">
                            <label htmlFor="fileInputKitchen" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputKitchen"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'kitchen')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.kitchenImages && <div className="error-message">{formErrors.kitchenImages}</div>}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                        {kitchenImages.length !== 0 && renderImagePreview(kitchenImages)}
                        </div>
                        <div>
                    {renderNotesInput('kitchen')}
                    </div>
                </div>
                <br />
                <div className="boxContent">
                    <div className="sectionHeader"><b>Photos of Toilets</b> - (Walls, air vents, hand dryers, under dispensers, behind toilets and corners and edges)</div>
                    <div className="block">    
                <div className="lineContainer">
                        <div>
                            <div className="answerLine">
                            <label htmlFor="fileInputWashroom" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputWashroom"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'washroom')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.washroomImages && <div className="error-message">{formErrors.washroomImages}</div>}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                        {washroomImages.length !==0 && renderImagePreview(washroomImages)}
                        </div>
                        <div>
                    {renderNotesInput('washroom')}
                    </div>
                </div><br />
                <div className="boxContent">
                    <div className="sectionHeader"><b>Photos of Cleaner's Room</b></div>
                    <div className="block">    
                <div className="lineContainer">
                        <div>
                            <div className="answerLine">
                            <label htmlFor="fileInputCleaner" className="customFileInput">
                                Add Media
                            </label>
                            <input
                                id="fileInputCleaner"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, 'cleaner')}
                                className="fileInput"
                            />
                            </div>
                            <div>
                                {formErrors.cleanerImages && <div className="error-message">{formErrors.cleanerImages}</div>}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                        {cleanerImages.length !==0 && renderImagePreview(cleanerImages)}
                        </div>
                        <div>
                    {renderNotesInput('cleaner')}
                    </div>
                </div><br />
                <div className="boxContent">
                                <div className="container">
                <div className="QuestionLine">Are there any more building on the site?</div>
                <div className='text2'>{siteInfo.anyMoreBuildings}</div>
                <div>
                <div className='block'>
                <div className="ButtonContainer" style={{backgroundColor: "#FFF"}}>
                    <button
                    type="button"
                    className={selectedButton === 'Yes' ? 'active' : ''}
                    name="anyMoreBuildings"
                    value="Yes"
                    onClick={()=>{handleInputChange({ target: { name: 'anyMoreBuildings', value: 'Yes' } }); setSelectedButton("Yes")}}
                    >
                    Yes
                    </button>
                    <button
                    type="button"
                    className={selectedButton === 'No' ? 'active' : ''}
                    name="anyMoreBuildings"
                    value="No"
                    onClick={()=>{handleInputChange({ target: { name: 'anyMoreBuildings', value: 'No' } }); setSelectedButton("No"); }}>
                    No
                    </button>
                </div>
                </div>
                <div>
                    {formErrors.anyMoreBuildings && <div className="error-message">{formErrors.anyMoreBuildings}</div>}
                    </div>
                    </div>
                </div>
                    {siteInfo.anyMoreBuildings === 'Yes' &&
                    <div className="container" style={{marginTop:20}}>
                <div className="QuestionLine">Have you uploaded the photos of every building?</div>
                <div className='text2'>{siteInfo.photosOfMoreBuilding}</div>
                <div>
                    <div className='block'>
                <div className="ButtonContainer" style={{backgroundColor: "#FFF"}}>
                    <button
                    type="button"
                    className={selectedButton2 === 'Yes' ? 'active' : ''}
                    name="photosOfMoreBuilding"
                    value="Yes"
                    onClick={()=>{handleInputChange({ target: { name: 'photosOfMoreBuilding', value: 'Yes' } }); setSelectedButton2("Yes")}}>
                    Yes
                    </button>
                    <button
                    type="button"
                    className={selectedButton2 === 'No' ? 'active' : ''}
                    name="photosOfMoreBuilding"
                    value="No"
                    onClick={()=>{handleInputChange({ target: { name: 'photosOfMoreBuilding', value: 'No' } }); setSelectedButton2("No");}}>
                    No
                    </button>
                </div>
                </div>
                <div>
                    {formErrors.photosOfMoreBuilding && <div className="error-message">{formErrors.photosOfMoreBuilding}</div>}
                    </div>
                    </div>
                </div>
                }
                </div>
                
                <br />
                <div className="boxContent">
                    <div className="sectionHeader"><b>Media Summary</b></div>
                    <MediaSummary images={[...entranceImages, ...receptionImages, ...kitchenImages, ...washroomImages, ...cleanerImages]} />
                </div>
                <button
          type="submit"
          className="nextButton"
          disabled={isSubmitting}
          style={{ width: '70vw', backgroundColor: isSubmitting ? 'gray' : '#334D9C' }}
        >
          {isSubmitting ? 'Submitting...' : 'Download PDF'}
        </button><br /><br /><br /><br />
                {/* {generatePDF && (<div className='boxContent block'>

                 <label htmlFor="contractPDF" className='QuestionLine block'>Upload Cleaning Audit PDF</label>
                 <input type="file" name="audit" id="contract" className='answerline top block' onChange={(e)=>{handleFileChange(e, "audit")}}/>
                 {formErrors2.audit && <div className="error-message">{formErrors2.audit}</div>}
                 <button  type='submit' className='fileUploadBtn block'>Final Submission</button>

               
                    </div>)} */}

            </form>
        </React.Fragment>
    );
}

export default CleanerAuditScreen;
