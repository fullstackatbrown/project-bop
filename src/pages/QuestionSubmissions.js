import React, { useState } from 'react';

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

  return (
    <div className="flex justify-center items-start mt-48 space-x-16">
      {/* Left Div */}
      <div className="w-1/4 p-4 self-start bg-cyan-200">
        <p className="text-4xl font-bold leading-relaxed">What questions do you want answered?</p>
      </div>
      {/* Right Div */}
      <div className="w-1/3 p-4 bg-cyan-200">
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
        <button className="w-1/3 mt-4 p-2 bg-black text-white rounded">
          Submit
        </button>
      </div>
    </div>
  );
}

export default QuestionSubmissionPage;
