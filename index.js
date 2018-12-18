
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const r = require('dotenv').config({ path:  '.env.'+ process.env.NODE_ENV});
if(r.error){
	console.log(r);
}
const conf = require('./conf');
const express = require('express');
const bodyParser = require('body-parser');
const alltomp3 = require('alltomp3');
const app = express();
const router = express.Router();
const fs = require('fs-extra')
var path = require('path');




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const api = require('./api');

router.post('/suggestion', async (req, res) => {
    try {
        let q = req.body.query;
        let limit = req.body.limit || 5;
        res.json(await api.searchDeezerForSongs(q,limit));
    } catch (error) {
        res.status(500).json(error);
    }
})
router.post('/searchTube',async (req,res)=>{
    try {        
        res.json(await api.searchYouTube(req.body.artistName,req.body.title));
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/downloadTube',async (req,res)=>{
    try {
        let d = await api.downloadFromYouTube(req.body.url,__dirname+'/downloads');
        if(d.error != ''){
            throw d.error;
        }
        res.sendFile(__dirname+'/'+d.fileName);
    } catch (error) {
        res.status(500).json(error);
    }
})
/**
 {
            "title": "La Isla Bonita",
            "artistName": "Madonna",
            "duration": 327,
            "cover": "https://e-cdns-images.dzcdn.net/images/cover/43a8e2b1b035391f58b0927cf1040bc4/250x250-000000-80-0-0.jpg",
            "deezerId": 678372
        }
 */
router.post('/download',async (req,res)=>{
    try {
        let dir = path.join(conf.downloadDir,req.body.artistName);       
        let videos = await api.searchYouTube(req.body.artistName,req.body.title);
        if(videos.length>0){    //prevent trash dirs
            fs.ensureDirSync(dir);
        }
        for (const video of videos) {
            let d = await api.downloadFromYouTube(video.url,dir);   //TODO: use caching to prevent duplicate downloads
            if(d.error == ''){
                return res.sendFile(path.join(dir,d.fileName));                
            }
        }   
        throw 'nothing could be downloaded :(';  
    } catch (error) {
        res.status(500).json(error);
    }
})
app.use('/api', router);
app.set('port', process.env.PORT || 2999);
const server = app.listen(app.get('port'), () => {
    //logger.info('running in %s mode \n %j', process.env.NODE_ENV,conf);
    console.log(`Express running → PORT ${server.address().port} node:${process.versions.node}`);
});