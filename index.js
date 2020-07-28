const express = require("express");
//
const multer = require("multer");
const path = require("path");
// const { PythonShell } = require("python-shell");
const spawn = require("child_process").spawn;

const AVATAR_PATH = path.join("/uploads");

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, AVATAR_PATH));
	},
	// fieldname is the type of file being uploaded eg-avatar

	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now());
	},
});
const upload = multer({ storage: storage }).single("avatar");
const app = express();
const port = 8000;

app.use(express.urlencoded());

app.use("/uploads", express.static(__dirname + "/uploads"));

const homeController = require("./controllers/home_Controller");

app.get("/", homeController.home);
// app.post("/getCaption", homeController.getCaption);
let verdict;
let filePath;
app.post("/getCaption", function (req, res) {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			console.log(`Error In Multer :: ${err}`);
		} else {
			if (req.file) {
				const filePath = AVATAR_PATH + "/" + req.file.filename;

				// let options = {
				// 	mode: "text",
				// 	pythonPath:
				// 		"C:Users\\Hardik Gupta\\AppData\\Local\\Programs\\Python\\Python38-32\\Scripts",
				// 	pythonOptions: ["-u"], // get print results in real-time
				// 	scriptPath: "../image_caption/",
				// 	args: ["hello"],
				// };

				// PythonShell.run("hello.py", options, function (err, results) {
				// 	if (err) throw err;
				// 	// results is an array consisting of messages collected during execution
				// 	console.log("results: %j", results);
				// });
				// spawn new child process to call the python script

				const script = "./testig_single_image.py";
				const python = spawn("python", [script, filePath]);
				// collect data from script

				python.stdout.on("data", function (data) {
					verdict = data.toString("utf8");
					console.log(verdict);
				});
				python.stderr.on("data", (data) => {
					console.log(`error././././././././..................:${data}`);
				});
				res.render("home", {
					title: "Uploaded-Image",
					src: filePath,
					print: verdict,
				});
				return;
			}
		}
	});
});
app.get("/getText", function (req, res) {
	res.render("home", {
		title: "Uploaded-Image",
		src: filePath,
		print: verdict,
	});
});

//
//

/////

// Setting Up View Engine To ejs
app.set("view engine", "ejs");
//Setting up Directory To look For Ejs files
app.set("views", "./views");

//////////////////
const python = spawn("python", ["./hello.py"]);
// collect data from script
python.stdout.on("data", function (data) {
	console.log("Pipe data from python script ...", data);
	dataToSend = data.toString("utf8");
	console.log(dataToSend);
});
python.stderr.on("data", (data) => {
	console.log(`stderr: ${data}`);
});
// in close event we are sure that stream from child process is closed

python.on("close", (code) => {
	console.log(`child process close all stdio with code ${code}`);
	// send data to browser
});
app.listen(port, function (err) {
	if (err) {
		console.log(`Error in Running The Server : ${err}`);
	} else {
		console.log(`Server Is Live At Port: ${port}`);
	}
	return;
});
