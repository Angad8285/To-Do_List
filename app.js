const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date');
const mongoose = require('mongoose');
const _ = require('lodash');

const port = process.env.PORT || 1111;

const app = express();


///////////////////////////////////////////// CODE BEGINS HERE

//////////  LIST INPUTS
let toDoList = [];
let workList = [];

///////////////////////////////////////// SETTING EJS
app.set("view engine", 'ejs')
////////////////////////////////////// USING BODY PARSER    &    PUBLIC FOLDER
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))

///////////////////////////////////////////////// DATABASE

mongoose.connect('mongodb+srv://admin-angad:admin-singh@cluster0.ms3rf.mongodb.net/todolistDB', {
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  todo: String
})

const listSchema = new mongoose.Schema({
  title: String,
  content: [itemsSchema]
})

const Item = mongoose.model("item", itemsSchema);
const List = mongoose.model("list", listSchema);

const dItem1 = new Item({
  todo: "Welcome to your todolist!"
})
const dItem2 = new Item({
  todo: "Hit the + to add a new item."
})
const dItem3 = new Item({
  todo: "Hit this to delete an item -->"
})
const dItem4 = new Item({
  todo: "<-- Hit this to cancel an item."
})

const defaultItems = [dItem1, dItem2, dItem3, dItem4];

// Item.deleteMany({_id: "626d3d69f3f24fc84359d277"}, err => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Deleted one.");
//   }
// })




///////////////////////////////////////////////// HOME ROUTE

////////////////////////////////////////////////  GET HOME ROUTE
app.get("/", function(req, res) {

  Item.find({}, function(err, result) { // EMPTY CURLY BRACES, BASICALLY MEAN YOU ARE RANDERING COMPLETE DATA FORM THE MODEL.
    // RESULT IS AN 'ARRAY' OF THE DOCUMENTS IN THE MODEL.
    if (result.length === 0) {
      Item.insertMany(defaultItems, err => { // ADDING defaultItems IF THERE IS NO DOCUMENT IN THE MODEL.
        if (err) {
          console.log(err);
        }
        // else {
        //   console.log("Added buy, cook and eatFood in items collection.");
        // }
      })
      res.redirect("/");
    } else {
      res.render("lists", {
        listTitle: date,
        newListItem: result
      })
    }
  })
});

//////////////////////////////  POST HOME ROUTE
app.post("/", function(req, res) {

  const userTypedItem1 = req.body.item1
  const listName = req.body.list
  // console.log(listName);
  // console.log(date);ss
  // if (req.body.list === "Work List") {
  //   workList.push(userTypedItem1)
  //   res.redirect("/work")
  // } else {
  //   // ADD THE ADDED TODO TO THE MAIN MODEL.
  // }

  const userTypedItem = new Item({
    todo: userTypedItem1
  })

  if (listName === date) {
    Item.insertMany([userTypedItem]);
    res.redirect('/')
  } else {
    // console.log(List.content);
    List.findOne({
      title: listName
    }, function(err, document) {
      if (err) {
        console.log(err);
      } else {
        document.content.push(userTypedItem)
        document.save();
        res.redirect('/customlist/' + listName)
      }
    })
  }

  // Item.insertMany([userTypedItem]);
  // // console.log(userTypedItem);
  // // toDoList.push(" " + userTypedItem1)
  // res.redirect("/");

  // console.log(req.body)
})

/////////////////////////////////////////////////////  DELETE ITEM

app.post("/delete", function(req, res) {
  const completeData = req.body.deleteButton;
  const split = completeData.split('?')

  const toBeDeletedID = split[0];
  const toBeDeletedTitle = split[1];

  if (toBeDeletedTitle == date) {
    Item.findByIdAndRemove(toBeDeletedID, err => {
      if (err) {
        console.log(err);
      }
    })
    res.redirect("/")
  } else {
    List.findOne({
      title: toBeDeletedTitle
    }, function(err, aDocInLists) {
      if (err) {
        console.log(err);
      } else {
        // console.log((aDocInLists))
        aDocInLists.content.forEach(function(todoItem) {
          if (todoItem._id == toBeDeletedID) {
            // console.log(todoItem);
            const index = aDocInLists.content.indexOf(todoItem)
            // console.log(index);
            aDocInLists.content.splice(index, 1)
            // console.log(aDocInLists.content);
            aDocInLists.save();

          }
        })
      }
    })
    res.redirect('/customlist/' + toBeDeletedTitle)
  }

  // console.log(completeData);
  // console.log(typeof(completeData));
  //
  // console.log(split[0]);
  // console.log(typeof(split));
  // const array = JSON.parse("[" + req.body.deleteButton + "]");
})

///////////////////////////////////////////////////// CUSTOM ROUTE

app.get("/customlist/:paramName", function(req, res) {
  // res.send("<h1>" + req.params.paramName + "</h1>")
  const listTitle = _.capitalize(req.params.paramName)
  List.findOne({
    title: listTitle
  }, function(err, result) {
    if (!err) {
      if (result) { // THIS TRANSLATES TO- "IF RESULT EXITS."
        // Show an existing list
        res.render("lists", {
          listTitle: listTitle,
          newListItem: result.content
        })
      } else {
        // create and show a new list
        const list = new List({
          title: listTitle,
          content: defaultItems
        })
        List.insertMany([list]);
        res.redirect("/customlist/" + listTitle)
      }
    } else {
      console.log(err);
    }
  })
  // console.log(listTitle);
  // list.save();
})

// //////////////////////////////////////////////////  WORK ROUTE
//
//
// /////////////////  GET WORK ROUTE
// app.get("/work", function(req, res) {
//   res.render("lists", {
//     listTitle: "Work List",
//     newListItem: workList
//   })
// })
//
// ////////////////  POST WORK ROUTE
// app.post("/work", function(req, res) {
//   let item = req.body.item1;
//   workList.push(item);
//   res.redirect("/work")
// })









///////////////////    SERVER SETTING UP
app.listen(port, function() {
  console.log("The server is up and running on port " + port + ".")
})
