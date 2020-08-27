import React from "react";
import "./AnswerButton.css";

const AnswerButton = (props) => {
  return (
    <div class="btn-group">
      <button className="veryInaccurate" onClick={props.click} value={1}>
        Very Inaccurate
      </button>
      <button className="somewhatInaccurate" onClick={props.click} value={2}>
        Somewhat Inaccurate
      </button>
      <button className="neither" onClick={props.click} value={3}>
        Neither Accurate or Inaccurate
      </button>
      <button className="somewhatAccurate" onClick={props.click} value={4}>
        Somewhat Accurate
      </button>
      <button className="veryAccurate" onClick={props.click} value={5}>
        Very Accurate
      </button>
    </div>
  );
};

export default AnswerButton;
