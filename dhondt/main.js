import chalk from 'chalk';
//import mathjs from 'mathjs';
import enquirer from 'enquirer';
import figlet from 'figlet';
import path from 'node:path';
import fs from 'node:fs';
import url from 'url';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let CSVdata = [];

const tst = readCSV('partydata.csv');

function readCSV(pathname) {
  console.time('readCSV');
  fs.createReadStream(path.join(__dirname, pathname))
  .pipe(csv({
      mapValues: ({ header, index, value })=>{
        if (!isNaN(Number(value))) {
          return Number(value);
        };
        return value
      } 
    }))
  .on('data', (data)=>{
    console.time();
    if (Object.keys(data).length !== 0) {
      CSVdata.push(data);
      console.log(data);
    };
    console.timeEnd();
  })
  .on('error', (err)=>{
      return err;
      console.error(err); 
  })
  .on('end', ()=>{
      console.log(CSVdata);
      console.log("end of reading CSV") 
  });
  console.timeEnd('readCSV')
}

function writeCSV(method, data) {
  try {
    method.writeRecords(data);
  } catch (err) {
    console.log(err);
  } finally {
    console.log('end writeCSV')
  }
}

function dhontMethod(dataArray) {
  console.log(dataArray)
  let sum = 0;
  let headerResult = [{id:'name',title:'NAME'},
                    {id:'1',title:'1'}];
  let result = [];
  for (let i = 0; i < dataArray.length; i++) {
    sum = sum + dataArray[i].VOTES;
  }

  writeCSV(createObjectCsvWriter({
    path: 'result.csv',
    header: headerResult
  }), result)

}

dhontMethod(CSVdata);

/*
function handleCallbackError(callback) {
  return function (err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  };
}

function readJSON(filePath, callback) {
  fs.readFile(path.join(__dirname, filePath), 'utf8', handleCallbackError((err, data) => {
    let processedData;
    try {
      processedData = JSON.parse(data); // Example processing
    } catch (parseErr) {
      return callback(parseErr);
    } finally {
      console.log("end reading file process")
    }
    callback(null, processedData);
  }));
}

const partydata = readJSON('data_0.json', (err, data) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Processed Data:', data);
    return data;
  }
});
*/

/*
async function readJSON(name) {
  try {
    console.log("reading file");
    let data = await fs.readFile(path.join(__dirname, name), { encoding: "utf8" });
    //console.log(__dirname, name);
    console.log("parsing JSON");
    return JSON.parse(data);
  } catch(err) {
    console.error("error reading JSON file", err);
    return err;
  } finally {
    console.log("end of process")
  }
}
*/

//console.log(await readJSON('data_0.json'));


