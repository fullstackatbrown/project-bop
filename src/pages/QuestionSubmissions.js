import React, { useState, useEffect } from 'react';
import { db } from './Firebase';
import { updateDoc, doc, getDoc } from "firebase/firestore";

function QuestionSubmissionPage() {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleFocus = () => {
    setHasError(false);
  };

  const handleBlur = () => {
    if (inputValue.trim() === '') {
      setHasError(true);
    }
  };

  const handleSubmission = async () => {
    if (inputValue.trim() === '') return;
    setSubmitted(true);
    setInputValue('');
    try {
      const docRef = doc(db, "bop-questions", "questions");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const fieldCount = Object.keys(data).length;
        const id = "question-" + fieldCount;
        const newField = { [id]: inputValue };
        await updateDoc(docRef, newField);
      }
    } catch (error) {
      console.error("Error updating doc: ", error);
    }
  };

  return (
    <div className="flex flex-col ml-10 md:ml-0 md:flex-row justify-center mt-12 space-x-0 md:space-x-8 lg:space-x-16">
      {/* Left Div */}
      <div className="w-4/5 md:w-1/3 p-4 flex pb-2 justify-end items-end">
        <p style={{ lineHeight: '1.3' }} className="text-3xl md:text-4xl lg:text-5xl">
          What questions do you want answered?
        </p>
      </div>
      {/* Right Div */}
      <div className="w-4/5 md:w-1/3 p-4 relative">
        <div className="flex flex-col justify-end h-48 md:h-64 space-y-6">
          <p>Enter your question idea here:</p>
          <input
            type="text"
            placeholder="Question"
            value={inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmission(); }}
            className={`w-full p-2 border-b-2 ${hasError ? 'border-red-500' : 'border-black'} outline-none`}
          />
          <button
            className="w-1/3 p-2 bg-black text-white hover:bg-[rgb(133,133,126)] transition-colors duration-300"
            onClick={handleSubmission}
          >
            Submit
          </button>
        </div>
        {submitted && (
          <p
            className="absolute left-4 w-full text-left text-gray-600"
            style={{ bottom: -30 }}
          >
            Thanks for submitting!
          </p>
        )}
      </div>
    </div>
  );
}

export default QuestionSubmissionPage;