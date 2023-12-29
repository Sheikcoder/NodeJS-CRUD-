const express = require('express');
const mongodb = require('mongodb');
const app = express();
const MongoClient = mongodb.MongoClient;
const PORT = process.env.PORT || 3000;


let db = null;


const dbconnection = "mongodb+srv://sheik:Sheik@007@cluster0.iux3ban.mongodb.net/abr?retryWrites=true&w=majority";
const dbName = "abr";
app.use(express.static('public'))

MongoClient.connect(dbconnection, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.error('Error in MongoDB connection:', err);
    } else {
        db = client.db(dbName);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

function passProcted(req, res, next){
  res.set('WWW-Authenticate', 'Basic realm="simple App"')
  if(req.headers.authorization == 'Basic U2hlaWtAMDA3OjEyMzQ1Ng=='){
    next()
  }else{
    res.status(401).send("please prove id password")
  }
  }
  
  app.use(passProcted)

app.get('/', passProcted , function(req, res) {
    db.collection('staff').find().toArray(function(err , item){
        console.log (item)
        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Staff Add Page</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-6 text-center py-1">Staff Add Page</h1>
    
            <div class="jumbotron p-3 shadow-sm">
              <form action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input name="name" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
          
          </div>
          <ul class="list-group pb-5">
          ${item.map(function(item){
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
               <span class="item-text">${item.name}</span>
               <div>
                 <button data-id= ${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
               </div>
             </li>`
           }).join('')}
           
           </ul>
           <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
           <script src="browser.js"></script>
        </body>
        </html>
        `);
    })
   
});

// Creating an item
app.post("/create-item", function(req, res) {
    if (!db) {
        res.status(500).send('Database not connected');
        return;
    }

    db.collection("staff").insertOne({ name: req.body.name }, function(err, result) {
        if (err) {
            console.error('Error while inserting:', err);
            res.status(500).send('Error while inserting data');
            return;
        }
        console.log(req.body.item);
        res.redirect('/')
    });
});

app.post('/update-item' , function (req ,res){
db.collection("staff").findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set:{name : req.body.name}}, function(){
  console.log("data update")
 
})

})

app.post('/delete-item',function(req, res){
  db.collection('staff').deleteOne({_id: new mongodb.ObjectId(req.body.id)},function(){
    res.send("data deleted")
  })
})
