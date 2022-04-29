const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date');


const port = process.env.PORT || 1111;

const app = express();


/////////////////////////////////////////////CODE BEGINS HERE

//////////  LIST INPUTS
let toDoList = [];
let workList = [];

/////////////////////////////////////////SETTING EJS
app.set("view engine", 'ejs')
//////////////////////////////////////USING BODY PARSER    &    PUBLIC FOLDER
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))


///////////////////////////////////////////////// HOME ROUTE

////////////////  GET HOME ROUTE
app.get("/", function(req, res) {

  let formatedtoday = date;

  res.render("lists", {
    listTitle: formatedtoday,
    newListItem: toDoList
  })
});

//////////////////////////////  POST HOME ROUTE
app.post("/", function(req, res) {
  userTypedItem1 = req.body.item1
  if (req.body.list === "Work List") {
    workList.push(userTypedItem1)
    res.redirect("/work")
  } else {
    toDoList.push(" " + userTypedItem1)
    res.redirect("/");
  }

  console.log(req.body)
})

//////////////////////////////////////////////////  WORK ROUTE


/////////////////  GET WORK ROUTE
app.get("/work", function(req, res) {
  res.render("lists", {
    listTitle: "Work List",
    newListItem: workList
  })
})

////////////////  POST WORK ROUTE
app.post("/work", function(req, res) {
  let item = req.body.item1;
  workList.push(item);
  res.redirect("/work")
})









///////////////////    SERVER SETTING UP
app.listen(port, function() {
  console.log("The server is up and running on port " + port + ".")
})
