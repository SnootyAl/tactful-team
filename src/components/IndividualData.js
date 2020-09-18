import React, { useState, useEffect } from "react";
import NameForm from "./NameForm";

class IndividualData extends React.Component {
	constructor(props) {
		super(props);
		this.state = { inputValue: "", title: props.title };

		// this.handleChange = this.handleChange.bind(this);
		// this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInput = (tempInputValue) => {
		this.setState({ inputValue: tempInputValue }, () => {
			alert(`Hello, ${this.state.inputValue}`);
		});
	};

	render() {
		return (
			<div className="showHome">
				<h1 className="Home">{this.title}</h1>
				<NameForm onInputHash={this.handleInput} />
			</div>
		);
	}
}

// const IndividualData = (props) => {
// 	const [inputValue, setInputValue] = useState("");

// 	function handleInput(localInputValue) {
// 		setInputValue(localInputValue);
// 	}

// 	return (
// 		<div className="showHome">
// 			<h1 className="Home">{props.title}</h1>
// 			<NameForm onInputHash={this.handleInput} />
// 		</div>
// 	);
// };

export default IndividualData;
