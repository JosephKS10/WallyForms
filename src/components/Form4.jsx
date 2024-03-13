import React, {useState} from 'react'
import Canvas from './SignatureDrawComponent';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import OptionsButtonGroup from './OptionsButtonGroup'; // Import the OptionsButtonGroup component


import './Form4.css'

function Form4() {

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
  const currentDate = new Date().toISOString().split('T')[0]; 
  const [Form4Info, setForm4Info] = useState({
    date: currentDate,
    name: '',
    supervisorName: '',
    signature: '',
    supervisorSignature: '',
  });

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setForm4Info({ ...Form4Info, [name]: value });
  };

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0); // State to store the score

  const handleOptionChange = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const handleSubmit = () => {
    let currentScore = 0;
    questionaire.forEach((question) => {
      if (answers[question.key] === question.actual_answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    // Show popup with score
  };

  const handleOkClick = () => {
    // Reset all states
    setForm4Info({
      date: currentDate,
      name: '',
      supervisorName: '',
      signature: '',
      supervisorSignature: '',
    });
    setAnswers({});
    setScore(0);
    navigate('/');
  };

  const questionaire = [
    {
      "question": "If I find a vacuum or other machinery faulty, what do I do?",
      "key": "vacuumFaulty",
      "actual_answer": "B",
      "options": [
        { "label": "Keep using appliance until it stops", "value": "A" },
        { "label": "Report to my Leading Hand", "value": "B" },
        { "label": "Switch appliance off", "value": "C" },
        { "label": "Put a warning sticker on appliance", "value": "D" }
      ]
    },
    {
      "question": "When should I display 'cleaning in progress' or other warning signs?",
      "key": "displayWarningSigns",
      "actual_answer": "B",
      "options": [
        { "label": "When cleaning toilets", "value": "A" },
        { "label": "When vacuuming or using machinery", "value": "B" },
        { "label": "When mopping floors", "value": "C" },
        { "label": "When dusting", "value": "D" }
      ]
    },
    {
      "question": "When can I use a ladder?",
      "key": "useLadder",
      "actual_answer": "D",
      "options": [
        { "label": "When cleaning glass", "value": "A" },
        { "label": "When doing high dusting", "value": "C" },
        { "label": "Whenever I need to", "value": "B" },
        { "label": "Never unless certified", "value": "D" }
      ]
    },
    {
      "question": "What is an SDS or MSDS?",
      "key": "sdsOrMsds",
      "actual_answer": "B",
      "options": [
        { "label": "A communication record", "value": "A" },
        { "label": "A sheet explaining the hazards of chemicals and their use", "value": "B" },
        { "label": "A timesheet", "value": "C" },
        { "label": "A sheet explaining the treatment in the event of chemical spills", "value": "D" }
      ]
    },
    {
      "question": "If I spill chemical on myself, what should I do?",
      "key": "spillChemical",
      "actual_answer": "B",
      "options": [
        { "label": "Wash it off", "value": "A" },
        { "label": "Read the chemical safety data sheet (SDS) for instructions", "value": "B" },
        { "label": "Report it to my Leading Hand", "value": "C" },
        { "label": "Wipe off the chemical and continue working", "value": "D" }
      ]
    },
    {
      "question": "What colour mops and cloths should I use for cleaning toilets?",
      "key": "mopsAndClothsToilets",
      "actual_answer": "A",
      "options": [
        { "label": "Blue", "value": "A" },
        { "label": "Red", "value": "B" },
        { "label": "Green", "value": "C" },
        { "label": "Does not matter", "value": "D" }
      ]
    },
    {
      "question": "Where can I smoke on the clients property?",
      "key": "smokingLocation",
      "actual_answer": "C",
      "options": [
        { "label": "In the offices", "value": "A" },
        { "label": "In the lunch rooms", "value": "B" },
        { "label": "In designated smoking areas", "value": "C" },
        { "label": "Nowhere", "value": "D" }
      ]
    },
    {
      "question": "What clothes/shoes should I wear at work?",
      "key": "workAttire",
      "actual_answer": "A",
      "options": [
        { "label": "Clean AECFM high visibility uniform", "value": "A" },
        { "label": "Covered shoes", "value": "B" },
        { "label": "Uniform requested by client", "value": "C" },
        { "label": "Thongs/sandals", "value": "D" }
      ]
    },
    {
      "question": "When MUST I wear protective gloves?",
      "key": "wearGloves",
      "actual_answer": "A",
      "options": [
        { "label": "When mixing chemicals", "value": "A" },
        { "label": "When dusting", "value": "B" },
        { "label": "When cleaning toilets", "value": "C" },
        { "label": "When vacuuming", "value": "D" }
      ]
    },
    {
      "question": "How should I mix chemicals with water for mopping the floors?",
      "key": "mixChemicalsWater",
      "actual_answer": "B",
      "options": [
        { "label": "Pour chemicals from bottles into bucket and add water.", "value": "A" },
        { "label": "Put water into bucket and add pre-measured amount of chemical", "value": "B" }
      ]
    },
    {
      "question": "If I am unwell and cannot go to work, what should I do?",
      "key": "unwellAtWork",
      "actual_answer": "B",
      "options": [
        { "label": "Send a friend to do my work", "value": "A" },
        { "label": "Contact my supervisor, giving as much notice as possible", "value": "B" },
        { "label": "Phone client", "value": "C" },
        { "label": "Go to the doctor when I am able to and request a certificate", "value": "D" }
      ]
    }
  ]
  
  return (
    <div>
      <Header heading="AECFM Basic Induction Questionnaire"/>
      <div className="boxContent">

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
      <div className="Question">Name</div>
      <div className="answerLine">
      <input
              type="text"
              name="name"
              value={Form4Info.name}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
      </div>
      <div><Canvas/></div>
        <div className="container">
          <div className="Question">Supervisor Name</div>
          <div className="answerLine">
      <input
              type="text"
              name="supervisorName"
              value={Form4Info.supervisorName}
              onChange={handleInputChange}
              className='inputLine'
            />
      </div>
        </div>
        <div><Canvas/></div>

      

      </div><br />
{/* Render questions and options using OptionsButtonGroup */}
        {questionaire.map(({ question, key, options }) => (
          <>
          <div className="boxContent" key={key}>
            <div className="QuestionOptions">{question}</div>

              <OptionsButtonGroup
                selectedValue={answers[key] || ''}
                options={options}
                onChange={(value) => handleOptionChange(key, value)}
              />

          </div><br />
          </>
        ))}

        <button onClick={handleSubmit} className='nextButton'>Submit</button>
        
        {score !== 0 && (
        <div className="popup">
          <div className="popup-content">
            <p>Your score is: {score}</p>
            <button onClick={handleOkClick}>Ok</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Form4
