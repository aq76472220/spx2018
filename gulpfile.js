var gulp = require('gulp');
var connect = require('gulp-connect'); // 热加载和搭建服务器 
var fileinclude  = require('gulp-file-include');//模板复用功能 
var smushit = require('gulp-smushit'); //压缩图片
var uglify = require('gulp-uglify');//压缩js
var minify = require('gulp-minify-css');//CSS压缩
var debug = require('gulp-debug');//查看编译管道   
var changed = require('gulp-changed');// 增量编译

var opn=require('opn') // 打开浏览器 
var port=8080 // 端口
 

// 说明 
gulp.task('help',function () { 
  console.log(' gulp build      文件打包'); 
  console.log(' gulp watch      文件监控打包'); 
  console.log(' gulp help     gulp参数说明'); 
  console.log(' gulp server     测试server'); 
  console.log(' gulp -p       生产环境（默认生产环境）'); 
  console.log(' gulp -d       开发环境'); 
  console.log(' gulp -m <module>    部分模块打包（默认全部打包）'); 
});

   
gulp.task('connect', function() {
  connect.server({// 热加载和搭建服务器 
    root: 'dist',
    livereload: true,
    port:port
  });
});

var uri = 'http://localhost:'+ port
// opn(uri)

gulp.task('fileInclude', function() {
    gulp.src(['page/**/*.html','!page/include/*.html'])
        .pipe(fileinclude({//模板复用功能 
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload())//热更新
});

 

gulp.task('smushit', function () {//压缩图片
     gulp.src('page/images/*') 
        .pipe(changed('dist/images'))//增量编译
        .pipe(smushit({//压缩图片
            verbose: true
        })) 
        .pipe(debug({title: '编译图片:'}))
        .pipe(gulp.dest('dist/images')) 
        .pipe(connect.reload())
});


gulp.task('scripts',function() {
      gulp.src(['page/js/*.js','!page/js/*min.js']) 
      //.pipe(uglify())//压缩js
      .pipe(gulp.dest('dist/js'))
      .pipe(debug({title: '编译没有压缩的JS:'}))
      .pipe(connect.reload())//热更新
});

gulp.task('scriptsMin',function() {//不压缩的js要打包过去 
      gulp.src(['page/js/*min.js']) 
      .pipe(debug({title: '编译压缩的JS:'}))
      .pipe(gulp.dest('dist/js'))
});

gulp.task('cssmini', function () {//要压缩的css
    gulp.src(['page/css/*.css'])  
    .pipe(minify())
    .pipe(debug({title: '编译CSS:'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())//热更新
});


gulp.task('ydui',function() {// 初始化 ydui文件
      gulp.src(['page/build/**'])  
      .pipe(gulp.dest('dist/build'))
      .pipe(debug({title: '编译ydui'})) 
});
 
//观察更新
gulp.task('watch',function(){
    gulp.watch('page/**/*.html',['fileInclude']);
    gulp.watch('page/images/*',['smushit']);
    gulp.watch('page/js/*.js',['scripts']);
    gulp.watch('page/css/*.css',['cssmini']);
})

// gulp命令
gulp.task('default', [ 'watch','connect','smushit','fileInclude','scripts','scriptsMin','cssmini','ydui']);