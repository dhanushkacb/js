'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

async function getTeams(year, k) {
    // write your code here
    // API endpoint template: https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=<YEAR>&page=<PAGE_NUMBER>
    //Reading on the task
    //2011-15 palyes fb matches
    //year,k => use API (names of teams, played k matches by given year) in the compettionn (UEFA Champions League)
    //return as an array (asc order)
    //API by pages
    
    //1st call get no of pages
    //get all records by year
    //filter data array by k (team1 has k times, team2 has k times)
    //retrun ordered array of team names
    let pageNumber = 1;
    let uri = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&page=${pageNumber}`;
    let totalPages = 1;
    var teamMap = new Map();
    let teamsResult = ["a"];
    fetch(uri)
    .then(response => response.json())
    .then(result => {
        totalPages = result.total_pages;
        //extrat data
        let dataArray=result.data;
        for(let m=0; m<dataArray.length;m++){
            addTeam(result.data[m].team1);
            addTeam(result.data[m].team2);            
        }       
    });
    
    if(totalPages>1){        
        for(let i=2; i<=totalPages; i++){
            uri = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&page=${i}`;
            
            fetch(uri)
            .then(response => response.json())
            .then(result => {
                //extract data
                //addTeams(result.data);
                let dataArray=result.data;
                for(let m=0; m<dataArray.length;m++){
                    addTeam(result.data[m].team1);
                    addTeam(result.data[m].team2);            
                }  
            });
        }
    }
    
    console.log(teamMap);
    return teamsResult;
}

async function addTeams(dataArray){
    for(let m=0; m<dataArray.length;m++){
        addTeam(result.data[m].team1);
        addTeam(result.data[m].team2);            
    }
}

async function addTeam(teamName){
    let teamCount = teamMap.get(teamName);
    if(team !== undefined){
        teamCount++;
        teamMap.delete(teamName);                
    } else{
        teamCount=1;
    }
    teamMap.set(teamName, teamCount);
}

async function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const year = parseInt(readLine().trim());
  const k = parseInt(readLine().trim());

  const teams = await getTeams(year, k);

  for (const team of teams) {
    ws.write(`${team}\n`);
  }
}
