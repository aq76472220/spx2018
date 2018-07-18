 
 
/*
* 不带图标提示框
* @param text  文本
* @param time  时间
*/
function toastFn(text, time) {
    var dialog = window.YDUI.dialog;
    dialog.toast(text, 'none', time);
}


// 模态框
function confirmFn(title, text, callback){
    var dialog = window.YDUI.dialog;
    dialog.confirm(title, text, function () {
        callback && callback()
    });
}

// alert
function alertFn(text){
    var dialog = window.YDUI.dialog;
    dialog.alert(text);
}



// 成功提示
function toastSuccessFn( text , time ) {
    var dialog = window.YDUI.dialog;
    dialog.toast(text, 'success', time);
}        
         


/*
* 滚动加载更多
* @param fatherContainer  
* @param ulContainer  
* @param tepContent
* @param callbacfn    
*/
function scrollmore(url,fatherContainer,ulContainer,tepContent, callbacfn){ 
    // 根据实际情况自定义获取数据方法
    var page = 1, pageSize = 10;
    var loadMore = function (callback) {
        $.ajax({
            url: url,
            dataType: 'json',
            data: {
                page: page,
                pagesize: pageSize
            },
            success: function (ret) { 
                typeof callback == 'function' && callback(ret);
            }
        });
    };


    $('#'+fatherContainer).infiniteScroll({
        binder: '#'+fatherContainer,
        pageSize: pageSize,
        initLoad: true,
        loadingHtml: '<img src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg"/>',
        loadListFn: function () {
            var def = $.Deferred();

            loadMore(function (listArr) {
                    
              if (listArr.list.length>0) { 
                var html = template(tepContent, {list: listArr.list});
                $('#'+ulContainer).append(html)

                def.resolve(listArr.list); 
                ++page; 
                callbacfn && callbacfn(listArr.list)
               } else {
                def.resolve(listArr.list); 
               }

            })
             return def.promise();
            
        }
    });
}


// 侧边栏菜单
$.fn.extend({
    sideSlipRight:function(){
        if(!$(this).hasClass('moved')){
            $(this).addClass('moved');
            $(this).parent().css({
                'overflow':'hidden',
                'position':'relative',
                'z-index':'0'
            })
        }else{
            $(this).removeClass('moved') 
           

            var _this= this;
            setTimeout(function(){
                 $(_this).parent().css({
                    'overflow':'auto',
                    'position':'static',
                    'z-index':''
                });
            },250)
        }   
    },
    sideSlipLeft:function(){
        if($(this).hasClass('moved')){
            $(this).removeClass('moved') 
            var _this= this;
            setTimeout(function(){
                 $(_this).parent().css({
                    'overflow':'auto'
                });
            },250)
        }  
    }
})




// 登录框
$.fn.extend({
    loginClose: function(){
        $(this).find('.ss-popup-modal').css({
            'transform':'translateY(100%)'
        }); 
        $('.ss-popup-mask').css('opacity','0')

        var _this = this

        setTimeout(function(){
             //$('.ss-popup-mask').css('opacity','0')
            $(_this).removeClass('ss-popup-container-visible')
        },200) 
    },
     loginOpen:function(){ 
        $(this).addClass('ss-popup-container-visible') 
        var _this = this 
        setTimeout(function(){
           $(_this).find('.ss-popup-modal').css({
                'transform':'translateY(0)'
           }); 
           $('.ss-popup-mask').css('opacity','1')
        },100) 
     }
});


/*tab 切换*/
$.fn.extend({ 
    Tab:function (opt) {
        var config={
            ev:'click',//触发事件
            header:'.tab-nav-item',//触发元素
            content:'.tab-cont-item',//显示隐藏内容
            cur:'active' //当前选中的元素添加样式
        };

        $.extend(config,opt);
        var _this=$(this);
        var navItem=_this.find(config.header);
        var conItem=_this.find(config.content);
        navItem.on(config.ev,function(){
            navItem.removeClass(config.cur).eq(navItem.index(this)).addClass(config.cur);
            conItem.hide().eq(navItem.index(this)).show();
        })
    }
})



/*
* 上传图片
* @param url  上传图片地址
* @param faCont  添加图片的位置
* @param upBtn  添加图片的按钮
* @param callback  添加成功的回调
* @param fileNum  限制上传数量
*/
function WebUploaderImg (url, faCont, upBtn , deletBtn, deletURL, callback, fileNum){ 
        // 初始化Web Uploader
    var $list=$("#"+faCont);
    var thumbnailWidth = 100;   //缩略图高度和宽度 （单位是像素），当宽高度是0~1的时候，是按照百分比计算，具体可以看api文档  
    var thumbnailHeight = 100;
    // 添加的文件数量
    var fileCount = 0;
    var uploader = WebUploader.create({ 
        // 选完文件后，是否自动上传。
        auto: true, 
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#'+upBtn, 
        server: url, 
        fileSizeLimit: 200 * 1024 * 1024,    // 200 M 验证文件总大小是否超出限制, 超出则不允许加入队列。
        fileSingleSizeLimit: 50 * 1024 * 1024,    // 50 M 验证单个文件大小是否超出限制, 超出则不允许加入队
        // 限制图片的数量
        fileNumLimit: fileNum ? fileNum : '',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        compress :{
                width: 720,   
                // 图片质量，只有type为`image/jpeg`的时候才有效。  
                quality: 90,   
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.  
                allowMagnify: false,  
                // 是否允许裁剪。  
                crop: false,   
                // 是否保留头部meta信息。  
                preserveHeaders: true,   
                // 如果发现压缩后文件大小比原来还大，则使用原来图片  
                // 此属性可能会影响图片自动纠正功能  
                noCompressIfLarger: false,  
                // 单位字节，如果图片大小小于此值，不会采用压缩。  
                compressSize: 0   
           },
           method:'POST'
    });


    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<li>'+
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                '</div>'+
                '</li>'
                ),
        $img = $li.find('img'); 

        // $list为容器jQuery实例
        $list.append( $li );

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            } 
            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );

    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) { 
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>').appendTo( $li ).find('span');
        } 
        $percent.css( 'width', percentage * 100 + '%' ); 
    });

    // *************文件上传成功，给item添加成功class, 用样式标记上传成功 *************。
    uploader.on( 'uploadSuccess', function( file,response) {  //response这里可以得到后台返回的数据 
        $( '#'+file.id ).append( '<div class="file-item-delet '+deletBtn +'" data-objimg = "'+ response.obj  +'"  ></div>'); 
        $( '#'+file.id ).addClass('upload-state-done'); 
        callback && callback(response)
    });

    // 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li ); 
        } 
        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });

    uploader.onError = function( code ) {
        console.log(code)
        if(code=='F_DUPLICATE'){ 
            toastFn('不能上传同一张图片',1000)
        } 
     };

     //每插入一个图片加 1
     uploader.onFileQueued = function( file ) {
         fileCount++;
         var $html = $('.js-Imgnum'); 
         if($html){
            $html.html(fileCount)
        } 
         console.log(fileCount)
      };

      // 删除当前图片
        $('body').on('click','.'+deletBtn,function(){  
            var objImg = $(this).data('objimg');
            console.log(objImg)
            $.ajax({
                url: deletURL, 
                data: {objImg: objImg},
            })
            .done(function(data) {
                console.log(data);
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })

            var id=$(this).closest('.file-item').attr('id')  
            uploader.removeFile(uploader.getFile(id));
            uploader.reset();
            $(this).closest('li').remove();
        })
    // 如果默认不自动上传可采用手动上传
    // $('#ctlBtn').click(function(){
    //    uploader.upload()
    // })
}


// 底部向上弹框
$.fn.actionSheetToggle = function (opt) {
    var _this =this;
    if(opt=='open'){
        if(!$(_this).hasClass('toggle')){
            $(_this).addClass('toggle')
        }else{
            $(_this).removeClass('toggle')
        } 
    }else if(opt=='close'){
        if($(_this).hasClass('toggle')){
            $(_this).removeClass('toggle')
        }
    } 
    $(_this).on('click',function(e){
        e.stopPropagation()
    }) 
    $(document).on('click',function(e){
         $(_this).removeClass('toggle')
    })
}


/*
* 发送验证码
* @param obj  按钮
* @param s  时间 
* @param callback 回调
*/
function sedCode(obj, s, callback){
    // 发送验证码
     var $getCode = $('#'+obj); 
    /* 定义参数 */
    $getCode.sendCode({
        disClass: 'btn-disabled',
        secs: s,
        run: false,
        runStr: '{%s}秒',
        resetStr: '重新获取'
    });

    $getCode.on('click', function () {
        /* ajax 成功发送验证码后调用【start】 */
        YDUI.dialog.loading.open('发送中'); 
        callback && callback($getCode)
        
    });
}


// 下拉展开收缩菜单
$.fn.extend({
    toggleFn: function(btn,child,li){
       if($(this).hasClass('active')){
          $(child).hide() 
          $(this).removeClass('active') 
       }else{
          $(child).hide()
          $(this).closest(li).find(child).show();
          $(this).addClass('active');
          $(this).closest(li).siblings().find(child).hide()
          $(this).closest(li).siblings().find(btn).removeClass('active')
       }
    }
});

  

/*
* 购物车加减
* @param value  默认值
* @param min  最小值 
* @param max 最大值
*/
$.fn.Spinner = function (opts, callback) {  
    var defaults = {value:1, min:1, max:99, type:''}
    var options = $.extend(defaults, opts)
    return this.each(function() { 
        var a = $(' <a class="numlbtn DisDe" href="javascript:void(0)"></a>');  
        var c = $(' <a class="numrbtn Increase" href="javascript:void(0)"><i></i></a>'); 
        var b = $(' <input type="tel" class="nummce" readonly="readonly   value="" autocomplete="off">');
        cv(options.value);//值 
        $(this).append(a).append(b).append(c);
        a.click(function(){cv(-1)}); 
        c.click(function(){cv(+1)}); 
        function cv(n){
            b.val(b.val().replace(/[^\d]/g,''));
            bv=parseInt(b.val()||options.min)+n; 
            bv>=options.min&&bv<=options.max&&b.val(options.type+bv); 
            if(bv<options.min){
                b.val(options.type+options.min);
                toastFn('不能小于'+ options.min)
            } 
            if(bv>options.max){
                b.val(options.type+options.max);
                toastFn('不能大于'+ options.max)
            }
            callback && callback(b.val())
        } 
    })
}

 
//只有tab 选择的
$.fn.tabNav = function (opts, callback) {  
    var defaults = {child:'li', on: 'active'}
    var options = $.extend(defaults, opts) 
    return this.each(function(){
        var _this =this 
        $(this).find(options.child).on('click', function(){ 
        var _type= $(_this).data('type') 
            var _index = $(this).index()
            if(!$(this).hasClass(options.on)){
                $(this).siblings().removeClass(options.on)
                $(this).addClass(options.on);  
                callback && callback(_index,_type)
            }
        }) 
    })  
}