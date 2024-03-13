import React, {useState} from 'react'
import Canvas from './SignatureDrawComponent';
import { useNavigate } from 'react-router-dom'; 
import companyLogo from '../assets/images/logo.svg'
import OptionsButtonGroup from './OptionsButtonGroup';
import Header from './Header';
import './Form3.css'

function Form3() {
  const navigate = useNavigate(); 

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

  const [Info, setInfo] = useState({
    siteName: '',
    conductedOn: '',
    supervisorName: '',
    location: '',
    trainer: '',
    cleaner: '',
  });

  const currentDate = new Date().toISOString().split('T')[0]; 

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setInfo({ ...Info, [name]: value });
  };

  const [answers, setAnswers] = useState({});

  const handleOptionChange = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const handleSubmit = () => {
    // Do something with answers and info
    console.log('Answers:', answers);
    console.log('Info:', Info);
  };


  const questions = [
    { question: 'Keys/Swipe cards/token provided?', key: 'keyProvided' },
    { question: 'Alarm codes provided & practiced?', key: 'AlarmCodeProvided' },
    { question: 'Have consumable dispensers keys provided?', key: 'dispenserKeyProvided' },
    { question: 'Have keys, fobs, swipe cards, etc been handed to cleaner? If so, please provide photo.', key: 'swipeCardPhotoProvided' },
    { question: 'Has the cleaner been given a copy of the Scope of Work?.', key: 'scopeCopyProvided' },
    { question: 'Have all items in the Scope of Work been fully explained to the cleaner?', key: 'scopeCopyExplained' },
    { question: 'Have Fire Exits/Equipment/Site Evacuation Plan identified with cleaner?', key: 'fireExitIdentified' },
    { question: 'Has the Communications Book location been advised?', key: 'communicationBookLocationAdvised' },
    { question: 'Has the importance of communication been to the cleaner?', key: 'importanceCommunication' },
    { question: 'Light switch locations identified?', key: 'lightSwitchLocation' },
    { question: 'Consumable orders. Discuss with the cleaner how & when to order for the site, if cleaning company is providing consumables.', key: 'consumableOrders' },
    { question: 'Cleaning Inspection Reports. Explain/discuss the requirements, including send rectification photos.', key: 'cleaningInspectionReports' },
    { question: 'Chemical application. Ensure the cleaner understands that ALL cleaning bottles MUST have a label, and only the corresponding chemical contained within.', key: 'chemicalApplication' },
    { question: 'Chemical application. Discuss each chemicals usage and correct dilution rate.', key: 'chemicalUsage' },
    { question: "'Safety Data Sheets. Explain/discuss the importance of SDS' and how to read them correctly. Also the importance of keeping the SDS's close to the chemicals at ALL times.", key: 'sdsImportance' },
    { question: 'Personal Protective Equipment (PPE). Has the importance and use of correct PPE been explained?', key: 'ppeImportance' },
    { question: 'Presentation. Discuss the required standard of presentation. NO short pants, enclosed shoes at ALL times, wearing cleaning company uniform.', key: 'presentationUniform' },
    { question: 'Have AEC high visibility vests been provided to cleaner/s?', key: 'vestProvided' },
    { question: "Personal hygiene. Discuss the expectations regarding personal hygiene.", key: 'personalHygiene' },
    { question: 'Does the cleaner know who to call in an emergency?', key: 'emergencyContactProvided' },
  ];

  const trainerQuestions = [
    { question: 'Emptying Waste & Recycling Bins', key: 'binEmptied' },
    { question: 'Correct disposal of waste & recycling', key: 'wasteDisposed' },
    { question: 'Do the waste or recycling bins need to be taken out for collection? Explained to cleaner if so?', key: 'binTakenOut' },
    { question: 'Dusting', key: 'dusting' },
    { question: 'Sweeping', key: 'sweeping' },
    { question: 'Wet Mopping', key: 'wetMopping' },
    { question: 'Dry Mopping', key: 'dryMopping' },
    { question: 'Spot Mopping', key: 'spotMopping' },
    { question: 'Spot Cleaning', key: 'spotCleaning' },
    { question: 'Toilet Cleaning and Basin Cleaning', key: 'toiletCleaning' },
    { question: 'Stair Cleaning', key: 'stairCleaning' },
    { question: 'Spot Cleaning of Glass', key: 'spotGlassCleaning' },
    { question: 'Cleaners Room to be kept clean and tidy', key: 'cleanerRoom' },
    { question: 'Proper Care of Cleaning Equipment', key: 'cleaningEquipmentCare' },
    { question: 'Comprehension - Does the cleaner understand the instructions?', key: 'Comprehension' },
    { question: 'Trainer stayed with cleaner until Alarms set and ALL doors & windows locked', key: 'trainerStayed'},
  ]

  const options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
    { value: 'N/A', label: 'N/A' }
  ];

  return (
    <React.Fragment>
      <Header heading="WCC Site Start Up Training and Induction"/>
      <div className="boxContent">
      <div className="container">
      <div className="Question">Site Name</div>
      <div className="answerLine">
      <input
              type="text"
              name="siteName"
              value={Info.siteName}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
      </div>

      <div className="container">
          <div className="Question">Conducted on</div>
          <div className="answerLine">
          <input
              type="date"
              name="ABN"
              value={currentDate}
              onChange={handleInputChange}
              disabled
              className='dateLine'
            />
          </div>
        </div>

        <div className="container">
          <div className="Question">Prepared by</div>
          <div className="answerLine">
      <input
              type="text"
              name="supervisorName"
              value={Info.supervisorName}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
        </div>

        <div className="container">
          <div className="Question">Location</div>
          <div className="answerLine">
      <input
              type="text"
              name="location"
              value={Info.location}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
        </div>

      </div>


      <br />
      <div>
      {questions.map(({ question, key }) => (
        <>
        <div className="boxContent" key={key}>
          <div className="QuestionOptions">{question}</div>
          <OptionsButtonGroup
            selectedValue={answers[key] || ''}
            options={options}
            onChange={(value) => handleOptionChange(key, value)}
          />
        </div>
        <br />
        </>
      ))}
      
    </div>

    <div className="boxContent">

      <div className="container">
      <div className="Question">Trainer Name</div>
      <div className="answerLine">
      <input
              type="text"
              name="trainer"
              value={Info.trainer}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
      </div>
      </div><br />

      <div>
      {trainerQuestions.map(({ question, key }) => (
        <>
        <div className="boxContent" key={key}>
          <div className="QuestionOptions">{question}</div>
          <OptionsButtonGroup
            selectedValue={answers[key] || ''}
            options={options}
            onChange={(value) => handleOptionChange(key, value)}
          />
        </div>
        <br />
        </>
      ))}
    </div>

    <div className="boxContent">

      <div className="container">
      <div className="Question">Cleaner Name</div>
      <div className="answerLine">
      <input
              type="text"
              name="cleaner"
              value={Info.cleaner}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
      </div>
      <div className="Question">Signature</div>
      <Canvas/>
      </div><br />

      <button onClick={handleSubmit} className='nextButton'>Submit</button>
    </React.Fragment>
  )
}

export default Form3
