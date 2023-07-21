const ol = document.querySelector(".right-div ol");
ol.className ="olstyle";
const input =  document.getElementById("todo");
const userName = prompt("Enter your name");
const btn  = document.getElementById("btn");

function renederList(arr){
      console.log(arr);
      ol.innerHTML = '';
      arr.map((item)=>{
            const li = document.createElement("li");
            const div  =document.createElement("div");
            const btn  = document.createElement("button");
            const input  = document.createElement("input");
            input.setAttribute("type", "checkbox");
            btn.innerText = "Delete";
            
            btn.className = "deletebtn";
            li.className = "listclass";
            input.classList = "inputClass";
            if(item.completed) li.className="strike"
            const desc = item.description;
            const capital = desc.charAt(0).toUpperCase() + desc.slice(1);

            li.innerHTML = `${capital} `;
            div.appendChild(input);
            div.appendChild(btn);
            li.appendChild(div);
            ol.appendChild(li);

            input.addEventListener('change', () => {
                  
                  
                    updateCompleted(item)
                  
            }); 
            btn.addEventListener("click", ()=>{
                  deleteList(item);
            })
      })
}

getData();

btn.addEventListener("click", (event)=>{
      event.preventDefault();

      const data ={
            username: userName,
            description: input.value,
            completed: false
      }

      fetch("/todo", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)          
      }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        ol.innerHTML = '';
        getData()
      })


})


async function getData() {
      try {
        const response = await fetch("/todos?name=" + userName);
        const data = await response.json();
        renederList(data);
            
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}
async function deleteList(item) {
     
            try {
              fetch("/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
              }).then((res) =>{
                  if(res.ok) getData()
              })
          
            }
            catch(err) {console.log(err)}
}

async function updateCompleted(item){
      try {
            fetch("/completed", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            }).then((res) =>{
                if(res.ok) getData()
            })      
          }
          catch(err) {console.log(err)}
}

