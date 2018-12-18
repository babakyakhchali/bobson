const { spawn } = require('child_process');
const fs = require("fs");
const path = require('path');
const conf = require('./conf')
const msgDataRegex = /\[(.*)\] (.*)/g;
const destinationRegex = /Destination: (.*)/g;
const progressRegex =  /(.+)\% of (.+) at (.+) ETA (.+)/g;
const alreadyDownloadedRegex = /(.+) has already been downloaded/;

function parseMsg(msg) {
    if(msg.type == 'download'){
        let rr = destinationRegex.exec(msg.body);
        if (rr && rr.index >=0){
            msg.fileName = rr[1].trim();
            rr.lastIndex = 0;
        }
        rr = alreadyDownloadedRegex.exec(msg.body);
        if (rr && rr.index >=0){
            msg.percent = 100;
            msg.fileName = rr[1].trim();            
            msg.speed = 0;
            msg.eta =0;
            msg.alreadyDownloaded = true;
            rr.lastIndex = 0;
        }
        rr = progressRegex.exec(msg.body);
        if (rr && rr.index >=0){
            msg.percent = rr[1];
            msg.size = rr[2];
            msg.speed = rr[3];
            msg.eta = rr[4];
            rr.lastIndex = 0;
        }
       
    }
}
function parse(s) {
    let lines = s.split('\n');
    let result = [];
    for (const line of lines) {
        if (line == '') {
            continue;
        }
        let parts = msgDataRegex.exec(line);
        let newMsg = {type:parts[1],body:parts[2].trim()};
        parseMsg(newMsg);
        result.push(newMsg);          
        msgDataRegex.lastIndex = 0;     
    }
    return result;
}

exports.download = (url,dir) => {
    dir = dir || __dirname;
    let result = {
        error:'',
        fileName:'',
        size:'',
        code:0
    }
    cmd = spawn(conf.youtubeDlPath, ['--restrict-filenames','-f', 'bestaudio', url],{cwd :dir});
    return new Promise((res,rej)=>{
        cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data} >>`);
            let parsed = parse(data.toString());
            for (const msg of parsed) {                
                if(msg.alreadyDownloaded){
                    msg.size = fs.statSync(path.join(dir,msg.fileName)).size+'B';
                }else{
                    result.size = msg.size;
                } 
                if(msg.fileName){
                    result.fileName = msg.fileName;
                }
            }
        });
    
        cmd.stderr.on('data', (data) => {
            console.error(`stderr: ${data} >>`);
            let str = data.toString();
            if(/ERROR:/.test(str)){
                result.error = str.trim();
                rej(result);
            }            
        });
    
        cmd.on('close', (code) => {
            console.error(`code: ${code} >>`);
            result.code = code;
            res(result);
        });
    })
    
}