import React, { useState, useEffect } from "react";

class NameForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
		//console.log(event);
	}

	handleSubmit(event) {
		//alert("A hash was submitted: " + this.state.value);
		this.props.onInputHash(this.state.value);
		event.preventDefault();
	}

	render() {
		return (
			<form className="userInputForm" onSubmit={this.handleSubmit}>
				<input
					className="userInputBox"
					type="text"
					placeholder="Insert unique hash here: "
					id="userInput"
					autoComplete="off"
					value={this.state.value}
					onChange={this.handleChange}
				/>
				<input type="submit" value="Generate" />
			</form>
		);
	}
}

export default NameForm;
