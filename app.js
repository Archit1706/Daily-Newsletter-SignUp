const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    // console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/f0edb55766";
    const options = {
        method: "POST",
        auth: "archit:62edd0a37a179e51f71340a952f64a7c-us9"
    };

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            // res.send("Successfully Subscribed!")
            res.sendFile(__dirname + "/success.html");
        }
        else {
            // res.send("There was an error with signing up. Please try again!")
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});

// app.listen(3000, function(){
//     console.log("Server is running on port 3000");
// })

// API Key
// 62edd0a37a179e51f71340a952f64a7c-us9

// List Id
// f0edb55766

