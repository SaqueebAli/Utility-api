const express=require("express");
const bodyParser=require("body-parser");
const cors = require('cors');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');




var corsOptions = {
    origin: 'http://localhost:3000',
}



var uploadDir = path.join(__dirname, "public", "files");
const app=express();
app.use(cors(corsOptions),express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/uniqueFieldsName1', (req, res) => {


  if(fs.existsSync("public\\files\\Keygen\\Keygen.json")){
    var Keygen=JSON.parse(fs.readFileSync("public\\files\\Keygen\\Keygen.json",{encoding:'utf8', flag:'r'}))
    
    
  }
  else{
    Keygen="Keygen.json not found"
    res.status(404);
  }

  var uniqueJson={}
  for (let i = 0; i <(Keygen["File1ColumnName"]).length; i++) {
    
      uniqueJson[(Keygen["File1ColumnName"])[i]]="#24a0ed";
      
    
  }
  
  
  res.status(200).send(JSON.stringify(uniqueJson)); 
});
app.get('/uniqueFieldsName2', (req, res) => {
  if(fs.existsSync("public\\files\\Keygen\\Keygen.json")){
    var Keygen=JSON.parse(fs.readFileSync("public\\files\\Keygen\\Keygen.json",{encoding:'utf8', flag:'r'}))
    
    
  }
  else{
    Keygen="Keygen.json not found"
    res.status(404);
  }

  var uniqueJson={}
  for (let i = 0; i < (Keygen["File2ColumnName"]).length; i++) {
    
      uniqueJson[(Keygen["File2ColumnName"])[i]]="#24a0ed";
      
    
  }
  
  res.status(200).send(JSON.stringify(uniqueJson)); 
});
app.post('/upload',(req,res) => {
     var form = new formidable.IncomingForm();
    
     
     

     form.parse(req, function (err, fields, files) {
         const file=files.myFile; 
             
        var filename=file.originalFilename.split("/");
        var uploadFolder=path.join(uploadDir, filename[1]);
      
        if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder)
      }
        form.uploadDir = uploadFolder;
         try {
            // renames the file in the directory
            fs.renameSync(file.filepath, path.join(uploadFolder, filename[0]))
          } catch (error) {
            console.log(error);
            res.status(404);
          }  

        res.status(201).send({file:"file uploaded successfully"}) 
     });
});

app.post('/uploadKeygen',(req,res)=>{
  console.log(req.body)
  var Keygen=req.body;
  var uploadKeygen=path.join(uploadDir, "Keygen");
  if (!fs.existsSync(uploadKeygen)) {
    fs.mkdirSync(uploadKeygen)
  }
  fs.writeFile(uploadKeygen +"/Keygen.json", JSON.stringify(Keygen), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        res.status(404);
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});

  res.status(201).send({msg:"successfully posted Keygen"}) 
});

app.listen(3500,function(){
console.log("server started on port 3500");
});





app.get('/primaryKey', (req, res) => {
  let file1 ;
  let file2 ;
  
  try{
    try{

      file1 = fs.readdirSync("public\\files\\File1");
    }catch{
file1="none"
    }
    try{

      file2 = fs.readdirSync("public\\files\\File2");
    }catch{
      file2="none"
    }
        
  }
  catch (e){
    
  }
  if(fs.existsSync("public\\files\\File1\\"+file1[0])){
    var data1=JSON.parse(fs.readFileSync("public\\files\\File1\\"+file1[0],{encoding:'utf8', flag:'r'}))
    
    
  }
  else{
    data1="File 1 not found"
  }
  if(fs.existsSync("public\\files\\File2\\"+file2[0])){
    var data2=JSON.parse(fs.readFileSync("public\\files\\File2\\"+file2[0],{encoding:'utf8', flag:'r'}))
    // combined.push(...Object.keys(JSON.parse(data2)[0]))
    
  }else{
    data2="File 2 not found"
  }

if(fs.existsSync("public\\files\\Keygen\\Keygen.json")){
  var Keygen=JSON.parse(fs.readFileSync("public\\files\\Keygen\\Keygen.json",{encoding:'utf8', flag:'r'}))
  
  
}
else{
  Keygen="Keygen.json not found"
}

var resred={}
var resgreen={}
var KeygenFile1=Keygen["File1"]
var File1ColumnName=Keygen["File1ColumnName"]
var File2ColumnName=Keygen["File2ColumnName"]

for(let k=0;k<data1.length;k++){
  var pk=(data1[k])[KeygenFile1]
  function renameKey(obj, old_key, new_key) {
    // check if old key = new key  
    if (old_key !== new_key) {
        Object.defineProperty(obj, new_key, // modify old key
            // fetch description from object
            Object.getOwnPropertyDescriptor(obj, old_key));
        delete obj[old_key];                // delete old key
    }
}
  for(let m=0;m<File1ColumnName.length;m++){
   
    data2.forEach(obj => renameKey(obj, File1ColumnName[m], File2ColumnName[m]));
  }
 
  const d2=data2.filter(d=>d[KeygenFile1]===pk )
  const d1=data1[k]
  
    if(_.isEqual(d1,d2[0])){

      resgreen[pk]="green"
    }
    else{
      resred[pk]="red"

    }
  }
 var result={...resred,...resgreen}

  res.status(200).send(JSON.stringify(result)); 
});

app.get('/:recordID', (req, res) => {
  let file1 ;
  let file2 ;
  
  try{
    try{

      file1 = fs.readdirSync("public\\files\\File1");
    }catch{
file1="none"
res.status(404);
    }
    try{

      file2 = fs.readdirSync("public\\files\\File2");
    }catch{
      file2="none"
      res.status(404);
    }
    
  }
  catch (e){
    
  }
  if(fs.existsSync("public\\files\\File1\\"+file1[0])){
    var data1=JSON.parse(fs.readFileSync("public\\files\\File1\\"+file1[0],{encoding:'utf8', flag:'r'}))
    
    
  }
  else{
    data1="File 1 not found"
    res.status(404);
  }
  if(fs.existsSync("public\\files\\File2\\"+file2[0])){
    var data2=JSON.parse(fs.readFileSync("public\\files\\File2\\"+file2[0],{encoding:'utf8', flag:'r'}))
    
    
  }else{
    data2="File 2 not found"
    res.status(404);
  }
  if(fs.existsSync("public\\files\\Keygen\\Keygen.json")){
    var Keygen=JSON.parse(fs.readFileSync("public\\files\\Keygen\\Keygen.json",{encoding:'utf8', flag:'r'}))
    
    
  }
  else{
    data1="File 1 not found"
    res.status(404);
  }
  var result={}
  var KeygenFile1=Keygen["File1"]
  var KeygenFile2=Keygen["File2"]
  var File1ColumnName=Keygen["File1ColumnName"]
  var File2ColumnName=Keygen["File2ColumnName"]
  var keys1=File1ColumnName
  var keys2=File2ColumnName
  function renameKey(obj, old_key, new_key) {
    // check if old key = new key  
    if (old_key !== new_key) {
        Object.defineProperty(obj, new_key, // modify old key
            // fetch description from object
            Object.getOwnPropertyDescriptor(obj, old_key));
        delete obj[old_key];                // delete old key
    }
}
for(let m=0;m<File1ColumnName.length;m++){
  var r=(File2ColumnName.filter(d=>d===File1ColumnName[m])).length>0 ? (File2ColumnName.filter(d=>d===File1ColumnName[m])):(File2ColumnName[m])
  data2.forEach(obj => renameKey(obj, File1ColumnName[m], r[0]));
}
  let fl1={}
   let fl2={}
   const id=req.params.recordID
  // for(let i=0;i<data1.length;i++){
  //    console.log(data1[i][key])
     var datavar2=data2.filter(d2=>d2[KeygenFile1]===id )
     var datavar1=data1.filter(d1=>d1[KeygenFile2]===id )
     
  
    for(let i=0;i<keys1.length;i++){
if(String(datavar2[0][keys2[i]])!=String(datavar1[0][keys1[i]])){
fl1["@"+(datavar1[0])[keys1[i]]]="#990f02"
fl2["@"+(datavar2[0])[keys2[i]]]="#990f02"

}else{
  fl1["@"+(datavar1[0])[keys1[i]]]="#3CB043"
  fl2["@"+(datavar2[0])[keys2[i]]]="#3CB043"
  }
}

result={"File1":fl1,"File2":fl2}
// console.log(fl1)
// console.log(JSON.stringify(fl1))

  


// var arrayToString = JSON.stringify(fl1);  // convert array to string
// var stringToJsonObject = JSON.parse(arrayToString);
// console.log(stringToJsonObject)
 
  res.status(200).send(JSON.stringify(result)); 
});