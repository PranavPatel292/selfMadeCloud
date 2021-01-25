/////////////////////////////////////*****************************************************/////////////////////////////////
//................MAKE SURE YOU HAVE A CHANGE THE FILE PATH TO POINT AT THE CORRECT PATH...................................
/////////////////////////////////////*****************************************************/////////////////////////////////

const mongooose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const fs = require("fs")
let cur_files = [];
app.use(bodyParser.json());
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

//repalce this line with your home directory

let default_dir = "" 

//chnage the below line to set your default Download part (although it can be changed)

let downloadPath = default_dir+"node_Download/";
let location = default_dir
let main_uri = ""

//port on which the service is running
const port = 7474;
const os = require('os'); 

//to upload the file!
const fileUpload = require('express-fileupload');

let counter = 0;
let prev_location = ""
const mime = require('mime-types')
var collection;

//MongoDB database URL

//Remmber the database here is only use for the authentication purpose
var uri = '';

//'mongodb://myTester1:xyz123@localhost/test_user'
var promise = mongooose.connect(uri, {
    useMongoClient: true,
});
let session = false;


promise.openUri(uri, function(errr, db) {
    if (errr) {
    	if(errr.name == "MongoError" && errr.code == 18){
    		console.log("Monogo DB authentication error...!!")
    	}else{
        throw errr.name;
    	}
    } else {
        console.log("Connection Successfull");
        collection = db.collection("user_master")
   
    }
});


//to get the login_server file (Home page of the webserver)
app.get("/", function(req, res){
	res.render("login_server.ejs")
})


app.post("/login", function(req, res){
	let username = req.body.email;
	let password = req.body.pass;
	let issuer = req.body.issuer;
	collection.find({user_name : username, user_password : password}).toArray(function(err, data){
		if(err) throw err
		else{
			if(data.length > 0){
				session = true;
				res.end("data")
			}else{
				res.end("wrong")
			}
		}	
	})
})

//after the successfull login we will redirect to this particular page!

app.get("/dirFind", function(req, res){
	if(session){
		res.render("dirSelect.ejs")
		res.end();
	}else{
		res.redirect("/")
	}
})


//to get the required file the below function / method is executed

app.get("/s_file/:files(*)", function(req, res){
	let dir_name = req.params.files;
	location = location+dir_name+"/";
	if(fs.existsSync(location)){
		fs.stat(location, function(err, stats){
			if(stats.isDirectory()){
				fs.readdir(location, function(err, files){
					if(err) throw err;
					else{					
						for(let i =0; i< files.length; i++){
							let temp_location = location+files[i]
							fs.stat(temp_location, function(err, stats){
								let file_type =mime.lookup(temp_location)
								if(stats.isDirectory()){
									cur_files.push({
										name : files[i],
										type : "directory",
										location : location,
										file_type : file_type
									})
								}else{
									cur_files.push({
										name : files[i],
										type : "files",
										location : location,
										file_type : file_type
									})
								}	
							})
						}
						res.redirect("/list_dir")
					}
				})
			}else{
				res.download(location, dir_name)
				console.log("Download Completed..!")

			}
		})
	}else{
		//console.log("Invalid Path..!!!")
		location = default_dir;
		res.end("Not found any directory..!")
	}
})

//to delete the specific file the below code is excuted

app.post("/deleteDir", function(req, res){
	if(location != "/home/rootpranav/"){
	let newLoc = location.split("/")
	let temp_location = "/"
	let temp_dir = ""
	for(let i = 1; i < newLoc.length - 3; i++){
		//console.log(newLoc[i])
		temp_location += newLoc[i] + "/"
	}
	temp_dir = newLoc[newLoc.length - 3]
	location = temp_location;
	res.end(temp_dir)
	//console.log(location)
	}else if(location == "/home/rootpranav/"){
		res.end("root")
	}
})


// to list down all the directories in the specific folder
app.get("/list_dir", function(req, res){
	if(session){
		res.render("list_dir.ejs")
	}else{
		res.redirect("/")
	}
})

app.get("/send", function(req, res){
	if(session){
		res.send(cur_files)
		cur_files = [] // This is to remove all the elements of array
	}
})


app.get("/folder_link/:files(*)", function(req, res){
	if(session){
		let dir_name = req.params.files;
		let temp_location = location+"/"+dir_name;
		res.download(temp_location, dir_name) //this is actually the source of the file......
		//location = "/home/rootpranav/"
	}else{
		res.redirect("/")
	}
})


app.get("/getThum/:files(*)", function(req, res){
	let file_name = req.params.files;
	let temp_location = location + file_name;
	let fileToSend = fs.readFileSync(temp_location)
	res.writeHead(200, { 'Content-Type': 'image/jpeg' });
	res.end(fileToSend, 'binary');
		
})


// The following method is copy fro m this url :- https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload

app.use(fileUpload());


app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  downloadPath = downloadPath+sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(downloadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});


app.post("/logout", function(req, res){

	//serssion varible is set to false
	session = false;
	res.end("logged_out")

	//set this to the home directory of your system
	location = ""
})


//this particular code, gethers your IP address and host the sever on that IP address with given port number
let network = (os.networkInterfaces())
	for(let k in network){
		for( let i in network[k]){
			if(network[k][i].family === "IPv4" && !network[k][i].internal){
				main_uri = network[k][i].address
			}
		}
		}
	console.log(main_uri)

app.listen(port, main_uri)
console.log("See the link ", main_uri, ":", port);

const mongooose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const fs = require("fs")
let cur_files = [];
app.use(bodyParser.json());
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

//repalce this line with your home directory

let default_dir = "" 

//chnage the below line to set your default Download part (although it can be changed)

let downloadPath = default_dir+"node_Download/";
let location = default_dir
let main_uri = ""

//port on which the service is running
const port = 7474;
const os = require('os'); 

//to upload the file!
const fileUpload = require('express-fileupload');

let counter = 0;
let prev_location = ""
const mime = require('mime-types')
var collection;

//MongoDB database URL

//Remmber the database here is only use for the authentication purpose
var uri = '';

//'mongodb://myTester1:xyz123@localhost/test_user'
var promise = mongooose.connect(uri, {
    useMongoClient: true,
});
let session = false;


promise.openUri(uri, function(errr, db) {
    if (errr) {
    	if(errr.name == "MongoError" && errr.code == 18){
    		console.log("Monogo DB authentication error...!!")
    	}else{
        throw errr.name;
    	}
    } else {
        console.log("Connection Successfull");
        collection = db.collection("user_master")
   
    }
});


//to get the login_server file (Home page of the webserver)
app.get("/", function(req, res){
	res.render("login_server.ejs")
})


app.post("/login", function(req, res){
	let username = req.body.email;
	let password = req.body.pass;
	let issuer = req.body.issuer;
	collection.find({user_name : username, user_password : password}).toArray(function(err, data){
		if(err) throw err
		else{
			if(data.length > 0){
				session = true;
				res.end("data")
			}else{
				res.end("wrong")
			}
		}	
	})
})

//after the successfull login we will redirect to this particular page!

app.get("/dirFind", function(req, res){
	if(session){
		res.render("dirSelect.ejs")
		res.end();
	}else{
		res.redirect("/")
	}
})


//to get the required file the below function / method is executed

app.get("/s_file/:files(*)", function(req, res){
	let dir_name = req.params.files;
	location = location+dir_name+"/";
	if(fs.existsSync(location)){
		fs.stat(location, function(err, stats){
			if(stats.isDirectory()){
				fs.readdir(location, function(err, files){
					if(err) throw err;
					else{					
						for(let i =0; i< files.length; i++){
							let temp_location = location+files[i]
							fs.stat(temp_location, function(err, stats){
								let file_type =mime.lookup(temp_location)
								if(stats.isDirectory()){
									cur_files.push({
										name : files[i],
										type : "directory",
										location : location,
										file_type : file_type
									})
								}else{
									cur_files.push({
										name : files[i],
										type : "files",
										location : location,
										file_type : file_type
									})
								}	
							})
						}
						res.redirect("/list_dir")
					}
				})
			}else{
				res.download(location, dir_name)
				console.log("Download Completed..!")

			}
		})
	}else{
		//console.log("Invalid Path..!!!")
		location = default_dir;
		res.end("Not found any directory..!")
	}
})

//to delete the specific file the below code is excuted

app.post("/deleteDir", function(req, res){
	if(location != "/home/rootpranav/"){
	let newLoc = location.split("/")
	let temp_location = "/"
	let temp_dir = ""
	for(let i = 1; i < newLoc.length - 3; i++){
		//console.log(newLoc[i])
		temp_location += newLoc[i] + "/"
	}
	temp_dir = newLoc[newLoc.length - 3]
	location = temp_location;
	res.end(temp_dir)
	//console.log(location)
	}else if(location == "/home/rootpranav/"){
		res.end("root")
	}
})


// to list down all the directories in the specific folder
app.get("/list_dir", function(req, res){
	if(session){
		res.render("list_dir.ejs")
	}else{
		res.redirect("/")
	}
})

app.get("/send", function(req, res){
	if(session){
		res.send(cur_files)
		cur_files = [] // This is to remove all the elements of array
	}
})


app.get("/folder_link/:files(*)", function(req, res){
	if(session){
		let dir_name = req.params.files;
		let temp_location = location+"/"+dir_name;
		res.download(temp_location, dir_name) //this is actually the source of the file......
		//location = "/home/rootpranav/"
	}else{
		res.redirect("/")
	}
})


app.get("/getThum/:files(*)", function(req, res){
	let file_name = req.params.files;
	let temp_location = location + file_name;
	let fileToSend = fs.readFileSync(temp_location)
	res.writeHead(200, { 'Content-Type': 'image/jpeg' });
	res.end(fileToSend, 'binary');
		
})


// The following method is copy fro m this url :- https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload

app.use(fileUpload());


app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  downloadPath = downloadPath+sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(downloadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});


app.post("/logout", function(req, res){

	//serssion varible is set to false
	session = false;
	res.end("logged_out")

	//set this to the home directory of your system
	location = ""
})


//this particular code, gethers your IP address and host the sever on that IP address with given port number
let network = (os.networkInterfaces())
	for(let k in network){
		for( let i in network[k]){
			if(network[k][i].family === "IPv4" && !network[k][i].internal){
				main_uri = network[k][i].address
			}
		}
		}
	console.log(main_uri)

app.listen(port, main_uri)
console.log("See the link ", main_uri, ":", port);