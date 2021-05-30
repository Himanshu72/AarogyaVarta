const csv = require('csv-parser')
const fs = require('fs')
module.exports={
    

        getFileData:()=>{
            let results=[];
            return new Promise((rej,res)=>{
                fs.createReadStream('./article.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                        res(results);
            });
            });
            
          

        }
}