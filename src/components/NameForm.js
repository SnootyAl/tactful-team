import React from "react";

// Component class to handle the input for personal results
class NameForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	/**
	 * Stores any updates to the input box in the state
	 * @param {event} event
	 */
	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	/**
	 * Passes the final entered value to the parent IndividualData component
	 * @param {event} event
	 */
	handleSubmit(event) {
		this.props.onInputHash(this.state.value);
		event.preventDefault();
	}

	render() {
		return (
			<form className="userInputForm" onSubmit={this.handleSubmit}>
				<input
					className="userInputBox"
					type="text"
					placeholder="Insert unique personality code here: "
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
