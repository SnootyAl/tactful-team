import React from "react";
import TactfulIcon from "../Design Assets/Tactful.png";

import "../stylesheets/Header.css";

import HomeIcon from "../Design Assets/Header/iconHome.png"
import TestIcon from "../Design Assets/Header/iconTest.png"
import PersIcon from "../Design Assets/Header/iconPersonal.png"
import TeamIcon from "../Design Assets/Header/iconTeam.png"

/**
 * Basic component that handles the rendering of the header panel
 */
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
				<div className="divAllButtons">
					<div className="divBtnHome">
						<a className="btnHome" onClick={this.handleHomeClick}>
							<img src={HomeIcon} />					
						</a>
					</div>

					<div className="headerButtons">
						<div className="divBtn">
							<a className="headerButton btnTest" onClick={this.handleTestClick}>
								<img src={TestIcon} />
							</a>
						</div>

						<div className="divBtn">
							<a
								className="headerButton btnPersonal"
								onClick={this.handlePersonalClick}
							>
								<img src={PersIcon} />
							</a>
						</div>

						<div className="divBtn">
							<a className="headerButton btnTeam" onClick={this.handleTeamClick}>
								<img src={TeamIcon} />
							</a>
						</div>
					</div>
				</div>
				
			</div>
		);
	}
}

export default Header;
