const request = require('request-promise');
const alltomp3 = require('alltomp3');
var fs = require('fs');
var youtubedl = require('youtube-dl');
const yt = require('./yt');
exports.searchDeezerForSongs = (query, limit) => {
    if (!limit) {
        limit = 5;
    }
    return request({
        uri: 'https://api.deezer.com/search?limit=' + limit + '&q=' + encodeURIComponent(query),
        json: true,
    }).then((results) => {
        return results.data.map((r) => {
            return {
                title: r.title,
                artistName: r.artist.name,
                duration: r.duration,
                cover: r.album.cover_medium,
                deezerId: r.id,
            };
        });
    });
}

exports.searchYouTube = (artistName,title) => {
    return alltomp3.findVideoForSong({artistName,title});
}

exports.downloadFromYouTube = (url,dir) => {

    // var video = youtubedl(url,['-f', 'bestaudio'], {});
    // video.pipe(fs.createWriteStream('./.tmp/myvideo.mp3'));

    // return new Promise((res, rej) => {
    //     video.on('end', info => {
    //         console.log('completed',info);
    //         res(info);
    //     });
    //     video.on('info', info => {
    //         console.log('Download started');
    //         console.log('filename: ' + info._filename);
    //         console.log('size: ' + info.size);

    //     });
    //     video.on('error', e => {
    //         rej(e);
    //     })
    // });
    return yt.download(url,dir);

}
