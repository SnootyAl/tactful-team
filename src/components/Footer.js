import React from "react";

import "../stylesheets/Footer.css";
import Twitter from "../Design Assets/Twitter.png";
import Facebook from "../Design Assets/F.png";
import LinkedIn from "../Design Assets/LinkedIn.png";
import Email from "../Design Assets/Email.png";

/**
 * Basic class that renders the footer of each page
 */
class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="footerPanel">
				<div className="footerIcons">
					<a href="https://twitter.com/TactfulTeam" target="_blank">
						<img className="footerImage twitter" src={Twitter} alt="twitter" />
					</a>		
					<img className="footerImage facebook" src={Facebook} alt="facebook" />
					<img className="footerImage linkedin" src={LinkedIn} alt="linkedIn" />
					<img className="footerImage email" src={Email} alt="email" />
				</div>
				<div className="footerText">
					&#169; 2020 - Tactful - all rights reserved
				</div>
			</div>
		);
	}
}

export default Footer;
