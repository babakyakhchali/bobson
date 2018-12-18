const str = '[download] Destination: Madonna_-_La_Isla_Bonita-zpzdgmqIHOQ.webm\n\
[download]   0.0% of 3.85MiB at  6.66KiB/s ETA 09:51\n\
[download]   0.1% of 3.85MiB at 19.86KiB/s ETA 03:18\n\
[download]   0.2% of 3.85MiB at 46.33KiB/s ETA 01:24\n\
[download]   0.4% of 3.85MiB at 98.63KiB/s ETA 00:39\n';


const r = /\[(.*)\] (.*)/g;
const destinationRegex = /Destination: (.*)/g;
const progressRegex =  /(.+)\% of (.+) at (.+) ETA (.+)/g;
function parseMsg(msg) {
    if(msg.type == 'download'){
        let rr = destinationRegex.exec(msg.body);
        if (rr && rr.index >=0){
            msg.fileName = rr[1].trim();
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
    let lines = str.split('\n');
    let result = [];
    for (const l of lines) {
        if (l == '') {
            continue;
        }
        let arr = r.exec(l);
        let newMsg = {type:arr[1],body:arr[2].trim()};
        parseMsg(newMsg);
        result.push(newMsg);          
        r.lastIndex = 0;     
    }
    return result;
}

console.log(parse(str));
