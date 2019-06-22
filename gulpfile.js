let gulp = require('gulp')
let ftp = require('gulp-ftp')

gulp.task('upload-ftp', function() {
  return gulp.src('./dist/**')
    .pipe(ftp({
      host: '192.168.0.11', // FTP主机地址
      user: 'files',
      pass: 'hw123',
      port: '21',
      remotePath: '/data/api' // FTP服务器位置
    }));
});
