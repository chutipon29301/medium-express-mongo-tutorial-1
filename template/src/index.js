var bodyParser = require("body-parser");
var app = require("express")();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, () => {
    console.log("  App is running at http://localhost:3000");
    console.log("  Press CTRL-C to stop\n");
});

app.get(
    "/ping",
    (req, res) => {
        res.json({
            msg: "pong"
        });
    },
);
