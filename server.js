
// importing/requiring the use of modules
const mongoose = require("mongoose");
const express = require('express');
const session = require('express-session')
const Question = require("./QuestionModel");
const User = require("./UserModel");

const app = express();
app.use( session( {secret: "go get a secret"} ) );

// home page url
const homeLink = "http://localhost:3000/";

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());


// routes that servers handles from user url requests
app.get('/' , homePage);
app.get("/users" , getUsers);
app.get("/users/:userID" , auth, getUserId);

app.get("/loginPage" , loginPage);
app.get("/login" , login);
app.get("/logout" , logout);

app.get("/quiz", getRandQuestions);

app.put("/users/:userID" , saveUpdate);

app.post("/quiz" , postQuiz);


function auth(req, res, next) {

	// the person on our page is not logged in at the moment
	if(!req.session.loggedin){
		res.redirect("http://localhost:3000/loginPage");
		return;
	}
	next(); // move on to the next page
};


function homePage(req, res, next){
	// if the req.session.userId exist then that id is sent to the rednered page
	// for the Profile link in the header

	// else no req.session.userId is sent and the value will be null
 	if (req.session.userId){
		res.render("pages/index" , {id:req.session.userId});
	} else {
		res.render("pages/index");
	}
	return;
}


/*
	Gets the users for the from the Mongoose server
	*/
function getUsers(req, res, next){

	User.find()
	.where({privacy: false})
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error Getting all the users that have a private set to false => " + err);
			return;
		}
		console.log("Found " + results.length + " matching people on the mongoose.");
		res.status(200).render("pages/getUsers", {users: results , id:req.session.userId});
		return;
	});

}


// Gets a single user based on the id parameter passed in
function getUserId(req, res, next){
	let send;

	User.findOne()
	.where({_id:req.params.userID})
	.exec(function(err, result){
		if(err){
			res.status(500).send("No such person exist Maybe try logging in on the home page! and error => " + err);
			return;
		}

		// if the privacy is true then the user can not see the page and is exited from the program
		if (req.session.username != result.username && result.privacy == true){
			res.status(403).send("YOU CAN NOT ACCESS DUE TO PRIVACY REASON!! BY THE PROFILE OWNER!");
			return;
		}

		// display the result for testing and confirmation
		// console.log(result);
		// building response object to be rendered
		send = result;
		// now we made a place where we can access the this all overa gain elsewhere
		req.session.user = result;
		send.sessionName = req.session.username;

		// display the session username for testing and confirmation
		console.log("send.username " + send.sessionName);

		// renders the page
		res.render("pages/userProfile" , {result:send , id:req.session.userId})
	})
}


// app.get("/loginPage", loginPage);
function loginPage(req, res, next){
	res.render("pages/login" , {id:req.session.userId});
}

function login(req, res, next){
	// if the person is aready logged in then it is ok they can just leave
	if(req.session.loggedin){
		res.status(200).send("Already logged in.");
		return;
	}

	console.log("You entered for the username " + req.query.username);
	console.log("You entered for the password " + req.query.password);
	// gets the values of username and password
	let username = req.query.username;
	let password = req.query.password;

	// finds an object that is the person we are looking for
	User.findOne()
	.where({username: username})
	.exec(function(err, result){
		if(err){
			res.status(500).send(`Error finding this particular user :=> ${username}. Are you sure the name is correct! and err = ${err}`);
			return;
		}

		// if result exists
		if(result){

			// checks if the password is correct then gives access
			if(result.password === password){
				// they are now logged in
				req.session.loggedin = true;
				req.session.username = username;
				req.session.userId = result._id;
				console.log("We are being redirected to " + result._id);
				res.redirect(`http://localhost:3000/users/${result._id}`);
				return;
			} else {
				// else the password was wrong so go home
				res.redirect(homeLink);
				return;
			}

		} else {
			// overall there was an error so the user name didn't exist
			// so go home
			res.redirect(homeLink);
			return;
		}

	});

}

// app.get("/logout", logout);
function logout(req, res, next){
	if(req.session.loggedin){
		// console.log("We are logged out on the server");
		// resets the values for the next this user logs in or someone else
		req.session.loggedin = false;
		req.session.username = "You_Are_Not_Logged_In_ATM";
		req.session.userId = "No_Session_User_Id_As_You_Are_Not_Logged_In";
		req.session.user = null;
		res.status(200).send();
		return;
	} else {
		res.status(403).send("Nah man you ain't even logged in so you can't log out DUH!");
	}
}

function saveUpdate(req, res, next){

	// if the user is logged in then we update the privacy
	if (req.session.loggedin){
		let id = req.session.userId;
		let privacy = req.body.privacyChangeValue;
		// console.log("privacy change is " + privacy);
		User.findByIdAndUpdate(id, {"privacy":privacy}, {new: false} , function(err , result){
			if (err) return res.status(500).send(err);
			// console.log("We were able to update the privacy value of the user.");
		});
		return;
	}

}


//The quiz page posts the results here
//Extracts the JSON containing quiz IDs/answers
//Calculates the correct answers and replies
// app.post("/quiz", postQuiz);
function postQuiz(req, res, next){
	let ids = [];
	try {
		// Try to build an array of ObjectIds
		for(id in req.body){
			ids.push(new mongoose.Types.ObjectId(id));
		}

		let questionCount;
		let link;
		// Find all questions with Ids in the array
		Question.findIDArray(ids, function(err, results){
			if(err) throw err; //will be caught by catch below

			// Count up the correct answers
			let correct = 0;
			for(let i = 0; i < results.length; i++){
				if(req.body[results[i]._id] === results[i].correct_answer){
					correct++;
				}
			}

			questionCount = correct;

			// Send response to quiz.js who made the call in the first place
			// we are sending back value of the # of correct answers they got
			link = "/";

			// the user is logged in then we update their details
			// that is total_score and total_quizzes
			if (req.session.loggedin){

				var total = req.session.user.total_score + questionCount;
				var totalQuizzes = req.session.user.total_quizzes + 1;

				let id = req.session.userId;

				// this is depreciated but works fine actually
				User.findByIdAndUpdate(id , {total_score:total, total_quizzes:totalQuizzes} , {new: false} , function(error , result){
					if (error){
						// console.log("Posting but there was an error!");
						res.status(500).send(error);
						return;
					}

					// console.log("findByIdAndUpdate has updated the user's values for total_score => " + total + " & total_quizzes => " + totalQuizzes);

				});
				// this is the link the user should go to after they completed the quiz
				link = `http://localhost:3000/users/${id}`;
			} // end session.loggedin

			res.json({url: link, correct: correct, id:req.session.userId});
			return;
		}); //

	} catch(err) {
		// If any error is thrown (casting Ids or reading database), send 500 status
		res.status(500).send("Error processing quiz data => " + err);
		return;
	}
}
// end of postQuiz(req, res, next)

// Returns a page with a new quiz of 10 random questions
// app.get("/quiz", auth , getRandQuestions);
function getRandQuestions(req, res, next){
	Question.getRandomQuestions(function(err, results){
		if(err) throw err;
		res.status(200).render("pages/quiz", {questions: results , id:req.session.userId});
		return;
	});
}

//Connect to database
mongoose.connect('mongodb://localhost/quiztracker', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	app.listen(3000);
	console.log("Server listening on port 3000");
});
