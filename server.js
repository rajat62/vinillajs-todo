const express = require("express");
const fs= require("fs");
const app = express();
app.use(express.json())
app.get("/", (req, res)=>{
      res.sendFile(__dirname + "/index.html")
})
app.get("/index.css", (req, res)=>{
      res.sendFile(__dirname + "/index.css")
})
app.get("/index.js", (req, res)=>{
      res.sendFile(__dirname + "/index.js")
})


app.post("/todo", async (req, res) => {
      
      const newEntry = {
        username: req.body.username,
        description: req.body.description,
        completed: req.body.completed
      };
      const path = "./output.txt";
    
      try {
        let abc = await fs.promises.readFile(path, "utf-8");
    
        let todos;
        if (abc.length === 0) {
          todos = [];
        } else {
          todos = JSON.parse(abc);
        }
    
        todos.push(newEntry);
    
        await fs.promises.writeFile(path, JSON.stringify(todos));
    
        res.status(200).json({ message: "New entry added successfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add new entry" });
      }
    });

app.get("/todos", async (req, res)=>{
      const username = req.query.name;

      try{
            const data = await fs.promises.readFile("./output.txt", "utf-8")
            
            if(data.length ===0 ) return res.send([]);
            let fileData = JSON.parse(data);
            
            const filteredData = fileData.filter((item)=>{
                  return item.username === username;
            })
            
            res.send(filteredData);
      }catch(err){
            console.log(err);
            res.status(500).json({ message: "Error occured while fetching the data" });
      }
})

app.delete("/delete", (req, res) => {
      const username = req.body.username;
      const description = req.body.description;
    
      fs.readFile("./output.txt", "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error occurred while reading the file" });
          return;
        }
    
        try {
          const parsedData = JSON.parse(data);
    
          const updatedData = parsedData.filter((item) => {
            return item.username !== username || item.description !== description;
          });
    
          const path = "./output.txt";
          fs.writeFile(path, JSON.stringify(updatedData), (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "Error occurred while writing the file" });
              return;
            }
    
            res.json({ message: "Todo entry deleted successfully" });
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error occurred while parsing JSON" });
        }
      });
    });
    
app.patch("/completed", async(req, res)=>{

      const username = req.body.username;
      const description = req.body.description;
      const completed = req.body.completed;

      const newEntry = {
            username: req.body.username,
            description: req.body.description,
            completed: !completed
      };

      fs.readFile("./output.txt", "utf-8", (err, data) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "Error occurred while reading the file" });
              return;
            }
        
            try {
              const parsedData = JSON.parse(data);
        
              const updatedData = parsedData.filter((item) => {
                return item.username !== username || item.description !== description;
              });
              updatedData.push(newEntry)
              const path = "./output.txt";
              fs.writeFile(path, JSON.stringify(updatedData), (err) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ message: "Error occurred while writing the file" });
                  return;
                }
        
                res.json({ message: "Todo entry deleted successfully" });
              });
            } catch (err) {
              console.log(err);
              res.status(500).json({ message: "Error occurred while parsing JSON" });
            }
          });

})
app.listen(9000, ()=>{
      console.log("serve running on port 9000");
})
