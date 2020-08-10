const getTemplate = require("./lib/get-template");
const generateResult = require("./lib/generate-result");
const languages = require("./lib/data/languages.json");

module.exports = (data) => {
	if (!data) {
		throw new Error("Missing required input");
	}

	// Template here determines which language template to use
	const template = getTemplate(data.lang || "en");

	if (!data.scores) {
		throw new Error("Missing required input data.scores");
	}

	if (!template) {
		throw new Error("Template not found. Try another data.lang input.");
	}

	// Returns JSON object
	return generateResult(data.scores, template);
};

module.exports.getInfo = () => ({ languages });

module.exports.getTemplate = (language = "en") => getTemplate(language);

module.exports.getDomain = require("./lib/get-domain");

module.exports.getFacet = require("./lib/get-facet");
