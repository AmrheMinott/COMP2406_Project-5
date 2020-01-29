# Project5

Done by Amrhe Minott
Student Number:		101107093


What Project is about:
  This is a quiz generator that only supplies you with quizzes if you are logged into the server where your information is saved in a server


Necessary Files Given inside the zip folder after being unzipped to run program
1.	P5-BaseCode (folder)&nbsp;&nbsp;-> this where you choose to downlaod and run your files from
2.	public (folder)
3.	P5-data (folder)           –>  this is where you will hold your wt fils after doing mongod -—dbpath=P5-data
4.	views (folder)             –>  where the pug files are located
5.	database-initializer.js    –>  sets up the database with the users and questions documents
6.	server.js                  –>  this is the server that will handle url events
7.	QuestionModel.js           –>  this the schema for the questions
8.	UserModel.js               –>  this the schema for the users


Setup
1.	Open terminal/cmd then Navigate to file P5-BaseCode/location of downloaded files
2.	Do npm install – by doing this you should see a package-lock.json and node_modules appear


How to run File
1.	Open terminal/cmd then Navigate to file P5-BaseCode
2.	Run mongod -—dbpath=P5-data
3.	Open a second terminal/cmd do mongo
4.	Open a third terminal/cmd navigate to P5-BaseCode runs node database-initializer.js
5.	on the same terminal/cmd runs node server.js



Sessions
For the sessions I used a session model that does not rely on a timer… So your inactivity won’t result in you being “timed out”. However if the server is shut down or the browser is closed then the session is gone.

How to login
By clicking the profile page that makes you able to login if you are not logged in at the moment. There you can procvide your credentials

// end of ReadMe
