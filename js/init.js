var cursorImg = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png'];
var rnd = 0;
var brush = 'images/1.png';
var brushSize = 10;
var startPointX = 0;
var startPointY = 0;
var actionCount = 0;
var highActionCount = 0;
var undoFlg = 0;

function fieldArea(){
    var wh = $(window).height() - 60;
    $('#toolBox,#field').css({
        'height':wh
    });
}
function startBrush(){
    $('#brush1').addClass('active');
    $('#field').css({
        'cursor':'url('+ brush +'),auto'
    });
    brushSize = $('#brushSize').val();
}
function bomb(){
    rnd = Math.floor(Math.random()*9);
    $('#field').css({
        'cursor':'url(images/'+ cursorImg[rnd] +'),auto'
    });
    setTimeout(bomb,100);
}
function afterImage(e){
    var pw = e.clientX - Math.floor(brushSize/2);
    var ph = e.clientY - Math.floor(brushSize/2);
    if(e.shiftKey){
        if(undoFlg==1){
            $('#field').find('img').each(function(){
                if($(this).hasClass('undo')){
                    $(this).remove();
                }
            });
            undoFlg = 0;
        }
        $('#field').append('<img src="'+ brush +'" class="afterImage action'+ actionCount +'" style="left: '+ pw +'px;top: '+ ph +'px" width=" ' + brushSize + ' " height=" ' + brushSize + '" />');
    }
}
function brushSelect(target){
    brush = target.find('img').attr('src');
    $('#brush').find('li').each(function(){
        $(this).removeClass('active');
    });
    target.addClass('active');
    $('#field').css({
        'cursor':'url('+ brush +'),auto'
    });
}
function addBrush(url){
    $('#brush').find('ul').append('<li id="brush9"><img src="'+url+'" /></li>');
}
function undo(){
    undoFlg = 1;
    var count = 0;
    $('#field').find('img').each(function(){
        if($(this).hasClass('action'+(actionCount-1))){
            $(this).css({
                'visibility':'hidden'
            });
            $(this).addClass('undo');
            count++;
        }
    });
    actionCount--;
    console.log(count);
    if(count==0&&actionCount>0){
        setTimeout(undo,100);
    }
}
function redo(){
    if(undoFlg==1){
        var count = 0;
        $('#field').find('img').each(function(){
            if($(this).hasClass('action'+(actionCount))){
                $(this).css({
                    'visibility':''
                });
                $(this).removeClass('undo');
                count++;
            }
        });
        actionCount++;
        if(count==0&&actionCount<highActionCount){
            setTimeout(redo,100);
        }
    }
}

$(function(){
    fieldArea();
    startBrush();
    var timer = false;
    $(window).resize(function(){
        if(timer!==false){
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            fieldArea();
        },200);
    });
    $('#field').mousemove(function(e){
        afterImage(e);
        brushSizing(e);
    });
    $('#brush').on('click','li',function(){
        brushSelect($(this));
    });
    $(window).keyup(function(e){
        if(e.keyCode=='16'){
            actionCount++;
            console.log(actionCount);
        }
        if(actionCount>highActionCount){
            highActionCount = actionCount;
        }
    });
    $(window).keydown(function(e){
        var x = e.clientX;
        var y = e.clientY;
        if(e.keyCode=='17'){
            startPointX = x;
            startPointY = y;
        }
    });
    $('#imageAddButton').click(function(){
        if($('#imageInput').val()!==''){
            addBrush($('#imageInput').val());
        }
    });
    $('#undo').click(function (){
        undo();
    });
    $('#redo').click(function (){
        redo();
    });
    $('body').keydown(function(e){
        if(e.ctrlKey){
            console.log('POW!');
            if(e.keyCode=='90'){
                if(e.shiftKey){
                    redo();
                    return false;
                }
                else{
                    undo();
                    return false;
                }
            }
        }
    });
    $('#brushSize').change(function(){
        var size = $(this).val();
        console.log(size);
        brushSize = size;
    })
});