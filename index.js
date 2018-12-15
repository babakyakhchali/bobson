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
        alltomp3.downloadTrack(req.body.track,'./download',(r,e)=>{
            console.log(r,e);
        },true);
        res.json({url:''});
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