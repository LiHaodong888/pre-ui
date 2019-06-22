'use strict';
var parents = require('parents');

function mkdirp(dir, cb) {
	if (typeof dir !== 'string') {
		throw new Error('`path` is required.');
	}

	cb = cb || function () {};

	var dirs = parents(dir);

	// skip root as it's always there
	if (dirs[dirs.length - 1] === '/') {
		dirs.pop();
	}

	if (dirs.length === 0) {
		return cb();
	}

	var mkdir = function (dir) {
		dir = dir.replace(/\\/g, '/');
		this.raw.mkd(dir, function (err) {
			if (err && err.code === 550) {
				if (dirs.length > 0) {
					return mkdir(dirs.pop());
				}

				return cb();
			}

			if (err) {
				err.message += ' - mkd: ' + dir;
				return cb(err);
			}

			if (dirs.length > 0) {
				return mkdir(dirs.pop());
			}

			cb();
		});
	}.bind(this);

	mkdir(dirs.pop());
}

module.exports = function (JSFtp) {
	JSFtp.prototype = Object.create(JSFtp.prototype, {
		mkdirp: {
			value: mkdirp
		}
	});

	return JSFtp;
};
