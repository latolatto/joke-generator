import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app= express();
const port=3000;
const API_URL = " https://v2.jokeapi.dev/joke/";
const format= "format=txt";
const safemode="safe-mode";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get ("/", (req,res) =>{
    res.render("index.ejs", {joke:""});
})


app.post ("/get-joke",async (req, res)=>{
        try{
            let category = req.body.categories;
    if (category === "Custom") {
      const customCategories = req.body.customCategories;
      if (customCategories) {
        if (Array.isArray(customCategories)) {
          category = customCategories.join(',');
        } else {
          category = customCategories; // In case only one custom category is selected
        }
      } else {
        category = "Any"; // Default to Any if no custom category is selected
      }
    }

    let blacklist = req.body.blacklist;
    if (blacklist) {
      if (Array.isArray(blacklist)) {
        blacklist = blacklist.join(',');
      } else {
        blacklist = blacklist;
      }
    } else {
      blacklist = '';
    }
            let jokeType = req.body.jokeType;
    if (jokeType) {
      if (Array.isArray(jokeType)) {
        jokeType = jokeType.join(',');
      } else {
        jokeType = jokeType;
      }
    } else {
      jokeType = '';
    }

    if (jokeType === "single,twopart") {
      jokeType = ''; // Both selected means no specific type filter
    }

            const url = `${API_URL}${category}?${blacklist ? `blacklistFlags=${blacklist}&` : ''}${jokeType ? `type=${jokeType}&` : ''}${format}&${safemode}`;
            console.log(`Category: ${category}`);
            console.log(`Blacklist: ${blacklist}`);
            console.log(`Joke Type: ${jokeType}`);
            console.log(`Constructed URL: ${url}`); // Debugging line to see the constructed URL
            const result = await axios.get(url);
            res.render("index.ejs", {joke: result.data});
            console.log("Joke was generated!");
            console.log(result.data);
        }catch(error){
                    res.render("index.ejs", {joke:"There is no joke for you today :( !"});
                    console.log("error with joke");
                    console.log("Error with joke generation:", error);
                    if (error.response) {
                        console.log("Response status:", error.response.status);
                        console.log("Response data:", error.response.data);
                      }

                };
            });
    



app.listen(port, () =>{
    console.log (`Server is running on port ${port}.`);
})
