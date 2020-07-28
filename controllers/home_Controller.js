/////////////////////////////////////////////////////////////////

module.exports.home = function (req, res) {
	res.render("home", {
		title: "Home",
		src: "https://bulma.io/images/placeholders/256x256.png",
		print: "Here Goes Verdict",
	});
	return;
};
