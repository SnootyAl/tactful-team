import React from "react";

const Question = (props) => {
  console.log(props.question);
  return (
    <div className="Question">
      <h1>{props.question}</h1>
    </div>
  );
};

export default Question;
