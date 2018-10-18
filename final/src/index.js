var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017';
var app = require("express")();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

MongoClient.connect(url, (error, client) => {
    if (error) throw error;

    app.listen(3000, () => {
        console.log("  App is running at http://localhost:3000");
        console.log("  Press CTRL-C to stop\n");
    });

    var db = client.db("MediumTutorial");

    app.get(
        "/ping",
        (req, res) => {
            res.json({
                msg: "pong"
            });
        },
    );

    app.get(
        "/listUsers",
        (req, res) => {
            db.collection("users").find().toArray((err, result) => {
                if (err) return res.status(500).send(err.toString());
                res.status(200).send(result);
            });
        }
    );

    app.post(
        "/user",
        (req, res) => {
            db.collection("users").insertOne({
                _id: req.body.email,
                name: req.body.name,
                password: req.body.password
            }, (err, result) => {
                if (err) return res.status(500).send(err.toString());
                res.sendStatus(200);
            });
        },
    );

    app.post(
        "/login",
        (req, res) => {
            db.collection("users").findOne({
                _id: req.body.email
            }, (err, result) => {
                if (err) return res.status(500).send(err.toString());
                if (result) {
                    res.json({
                        isPasswordMatch: result.password === req.body.password
                    });
                } else {
                    res.json({
                        isPasswordMatch: false,
                    });
                }
            });
        },
    );

    app.patch(
        "/password",
        (req, res) => {
            db.collection("users").updateOne({
                _id: req.body.email
            }, {
                $set: {
                    password: req.body.password
                }
            }, (err, result) => {
                if (err) return res.status(500).send(err.toString());
                res.sendStatus(200);
            });
        },
    );

    app.delete(
        "/user",
        (req, res) => {
            db.collection("users").deleteOne({
                _id: req.body.email
            }, (err, result) => {
                if (err) return res.status(500).send(err.toString());
                res.sendStatus(200);
            });
        },
    );

});
