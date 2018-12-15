
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



router.post('/suggestion', async (req, res) => {
    try {
        let q = req.body.query;
        let limit = req.body.limit || 5;
        let suggestions = await Promise.all([
            alltomp3.suggestedSongs(q, limit),
            alltomp3.suggestedAlbums(q, limit),
        ]);
        res.json({ songs: suggestions[0], albums: suggestions[1] });
    } catch (error) {
        res.status(500).json(error);
    }

})
router.post('/download',async (req,res)=>{
    try {
        const emitter = alltomp3.downloadTrack(req.body.track,conf.tempDir,(r,e)=>{
            if(e){
                res.status(500).json(e);
            }else{
                res.json(r);
            }            
            console.log(r,e);
        },true);
        emitter.once('error',(e)=>{
            console.error('emitter error',e);
        })
        download
        emitter.once('download',infos=>{
            console.log('download',infos);            
        })
        emitter.once('end',infos=>{
            console.log('end',infos);            
        })
        emitter.once('convert',infos=>{
            console.log('convert',infos);            
        })
        emitter.once('download-end',()=>{
            console.log('download-end');            
        })
        emitter.once('convert-end',()=>{
            console.log('convert-end');            
        })
        
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