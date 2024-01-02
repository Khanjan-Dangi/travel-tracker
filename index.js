import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "DB1",
  password: "11111",
  port: 5432,
});

db.connect();

let countries = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  let countries = await fetchCountries();

  res.render("index.ejs",{countries: countries,total: countries.length});
});

app.post("/add",async (req,res)=>{
  let newCountry = req.body.country;

  //console.log(req.body);
  try{
    let countryCode = await db.query("SELECT country_code FROM countries WHERE country_name='"+ newCountry +"'");
    console.log(countryCode.rows);
    countryCode = countryCode.rows[0].country_code.toUpperCase();

    try{
      await db.query("INSERT INTO visited_countries (country_code) VALUES ('"+ countryCode +"')");
      
      res.redirect("/");
    }catch(err){

      console.log(err);
      const countries = await fetchCountries();

      res.render("index.ejs",{
        countries: countries,
        total: countries.length,
        error: "Country already added, try again!"
      });
    }
  }catch(err){
    const countries = await fetchCountries();
    console.log(err);

      res.render("index.ejs",{
        countries: countries,
        total: countries.length,
        error: "No such country found, try again!"
      });
  }
});

async function fetchCountries(){
  let result = await db.query("SELECT country_code FROM visited_countries");

  result.rows.forEach((country)=>{
    countries.push(country.country_code);    
  });

  return countries;
};

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});