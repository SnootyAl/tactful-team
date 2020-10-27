import React from "react";
import TactfulIcon from "../Design Assets/Tactful.png";

import "../stylesheets/Header.css";

// Basic component to render the footer on each page
class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleHomeClick = (event) => {
		this.props.handleHomeClick(event);
	};

	handleTestClick = (event) => {
		this.props.handleTestClick(event);
	};

	handlePersonalClick = (event) => {
		this.props.handlePersonalClick(event);
	};

	handleTeamClick = (event) => {
		this.props.handleTeamClick(event);
	};

	render() {
		return (
			<div className="headerPanel">
				<div className="divBtnHome">
					<a className="btnHome" onClick={this.handleHomeClick}>
						Tactful Team
						{/* <div className="divTactfulIcon">
							<img className="tactfulIcon" src={TactfulIcon} />
						</div> */}
						
					</a>
				</div>

				<div className="headerButtons">
					<div className="divBtn">
						<a className="headerButton btnTest" onClick={this.handleTestClick}>
							Personality Test
						</a>
					</div>

					<div className="divBtn">
						<a
							className="headerButton btnPersonal"
							onClick={this.handlePersonalClick}
						>
							Personal
						</a>
					</div>

					<div className="divBtn">
						<a className="headerButton btnTeam" onClick={this.handleTeamClick}>
							Team
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;
