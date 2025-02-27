import React, { useState } from 'react';
import { db } from './Firebase';
import { updateDoc, doc, getDoc } from "firebase/firestore";

function QuestionSubmissionPage() {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleFocus = () => {
    setHasError(false); // Reset error state when focus is on the input
  };

  const handleBlur = () => {
    if (inputValue.trim() === '') {
      setHasError(true); // Set error state if the input is empty when unfocused
    }
  };

  const handleSubmission = async () => {
    try {
      const docRef = doc(db, "bop-questions", "questions");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && inputValue) {
        const data = docSnap.data();
        const fieldCount = Object.keys(data).length;
        const id = "question-" + fieldCount;

        const newField = {
          [id]: inputValue
        };
    
        await updateDoc(docRef, newField);
      }
    } catch (error) {
      console.error("Error updating doc: ", error);
    }
  };

  return (
    <div className="flex justify-center mt-48 space-x-8">
      {/* Left Div */}
      <div className="w-1/4 p-4">
        <p className="text-4xl font-bold leading-relaxed">What questions do you want answered?</p>
      </div>
      {/* Right Div */}
      <div className="w-1/3 p-4">
        <p>Enter your question idea here:</p>
        <input
          type="text"
          placeholder="Question"
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-full p-2 mt-4 border-b-2 ${hasError ? 'border-red-500' : 'border-black'} outline-none`}
        />
        <button
          className="w-1/3 mt-4 p-2 bg-black text-white rounded"
          onClick={handleSubmission}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default QuestionSubmissionPage;
