var path = require('path');
var conf = {
	defaultBaseUrl: process.env.BASEURL,
	db: process.env.DB_CSTR,
    port: 3300,
	tempDir:process.env.TEMP_DIR,
	downloadDir:process.env.DOWNLOAD_DIR || './downloads',
	youtubeDlPath: process.env.YOUTUBE_DL_PATH || 'youtube-dl',
	mailer: {
		host: process.env.MAILER_HOST,
		account: process.env.MAILER_ACCOUNT,
		pass: process.env.MAILER_PASS
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_DAYS * 24 * 3600
	}
	, apn: {
		options: {
			token: {
				key: process.env.APN_KEY_PATH,
				keyId: process.env.APN_KEY_ID,
				teamId: process.env.APN_TEAM_ID
			},
			production: process.env.APN_PRODUCTION == 'true'
		}
		, bundleId: process.env.APN_BUNDLE_ID
	}
	, fcm: {
		dburl: ''
	}
	, secret: process.env.API_SECRET
};
if(!path.isAbsolute(conf.downloadDir)){
	conf.downloadDir = path.join(__dirname,conf.downloadDir);
}
module.exports = conf;