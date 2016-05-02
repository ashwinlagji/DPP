//All cofiguration paramets should be defined here
var config = {
	local: {
		mode: 'local',
		port: 8080,
		mysql: {
			host: 'localhost',
			port: 3306,
			user: 'root',
			password: '',
			db_name:'dp_portal'
		},
		paginationCount:8
	},
	staging: {
		mode: 'staging',
		port: 8080,
		mysql: {
			host: '127.0.0.1',
			port: 3306,
			user: 'root',
			password: '',
			db_name:'dp_portal'
		},
		paginationCount:3
	},
	production: {
		mode: 'production',
		port: 8080,
		mysql: {
			host: '127.0.0.1',
			port: 3306,
			user: 'root',
			password: '',
			db_name:'dp_portal'
		},
		paginationCount:3
	}
}
module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
}