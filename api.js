
let jsonData = [];

async function loadData(){
    fetch('https://localhost:7119/api/User')
    .then(respose => respose.json())
    .then(data => {
        setData(data);    
        console.log(data);
    }).catch(error => {
        console.log('Error: ',error);
    });
}

function getData(){    
    fetch('https://localhost:7119/api/User')
    .then(respose => respose.json())
    .then(data => { 
        setData(data);
        jsonData=data;
    });
    return jsonData;
}

setData(getData());


document.addEventListener('DOMContentLoaded', () => {
   // document.querySelector('#resultID').innerHTML=usersList;
});


function setData(list){
    var table = document.createElement('table');
    var tr = table.insertRow(-1);
     
    var cols = [];             
    for (var i = 0; i < 1; i++) {
        for (var k in list[i]) {
            if (cols.indexOf(k) === -1) {
                cols.push(k);
            }
        }
        
    }

    for (var i = 0; i < cols.length; i++) {
        var theader = document.createElement('th');
        theader.innerHTML = cols[i];
        tr.appendChild(theader);
    }
    

    for (var i = 0; i < list.length; i++) {
        trow = table.insertRow(-1);
        for (var j = 0; j < cols.length; j++) {
            var cell = trow.insertCell(-1);
            if(j === 0)
                cell.innerHTML = '<button onclick="display('+list[i][cols[j]]+')">'+list[i][cols[j]]+'</button>';
            else 
                cell.innerHTML = list[i][cols[j]];
        }
    }

    var el = document.getElementById('resultID');
    el.innerHTML = "";
    el.appendChild(table);
}

async function addItem(){
    let data = {
        name : document.querySelector('#name').value,
        age : document.querySelector('#age').value
    };
    fetch('https://localhost:7119/api/User', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then(loadData());
}


async function editItem(){
    
    const id = document.querySelector('#edit-id').value;
    let data = {
        id: id,
        name : document.querySelector('#edit-name').value,
        age : document.querySelector('#edit-age').value
    };
    const uri = 'https://localhost:7119/api/User/'+id;
    fetch(uri, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then(loadData());
}

async function deleteItem(){
    
    const id = document.querySelector('#delete-id').value;
    const uri = 'https://localhost:7119/api/User/'+id;
    fetch(uri, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then(loadData());
}

function display(id){
  let user =  jsonData.find(u => u.id === id);
  document.querySelector('#edit-id').value=user.id;
  document.querySelector('#edit-name').value=user.name;
  document.querySelector('#edit-age').value=user.age;
  document.querySelector('#delete-id').value=id;
}

function sortByName(){
    let age= document.querySelector('#sort-age').value;
    if(age === undefined || age === '')
        age = 0;
    let users =  jsonData.filter(u => u.age > age).sort((a,b)=>{ 
       const n1 = a.name.toUpperCase(); 
       const n2 = b.name.toUpperCase();
       if(n1<n2){return -1;}
       if(n1>n2){return 1;}
       return 0;
    });
    setData(users);
}

function reset(){
    document.querySelector('#sort-age').value = '';
    setData(jsonData);
}