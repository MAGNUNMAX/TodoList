import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde el archivo .env


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* Database Connection  */

const db = new pg.Client({
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

db.connect();


let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {                         /* Render DataBase */
  try{
    const response = await db.query('select * from items order by id asc');
    items = response.rows;
    
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
  }); 
  }catch(error){
    console.log(Error);
  }
  
});

app.post("/add", async(req, res) => {                     /*  Add item to DataBase */
  try{
    const item = req.body.newItem;
 /* items.push({ title: item }); */
    
    await db.query('insert into items (title) values ($1)',[item]);
    res.redirect("/");
  }catch(error){
    console.log(Error);
  }
 
});

app.post("/edit", async (req, res) => {                     /* Edit item from DataBase */
  try{
    let id = req.body.updatedItemId;
    let infodata = req.body.updatedItemTitle;
    await db.query('update items  set title = ($1) where id = ($2)',[infodata, id]);
    res.redirect("/");
  }catch(error){
    console.log(Error);
  }
  

});

app.post("/delete", async (req, res) => {                   /* Delete item from DataBase */
try {
  let id = req.body.deleteItemId;
  await db.query('delete from items where id = ($1)',[id]);
  res.redirect("/");
} catch (error) {
   console.log(Error);
}

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
