var cursorList = ['images/1.png','images/2.png','images/3.png','images/4.png','images/5.png','images/6.png','images/7.png','images/8.png','images/9.png'];
var rnd = 0;
var brush = 'images/1.png';
var brushSize = 10;
var brushBlur = 0;
var brushOpacity = 1;
var brushSaturate = 100;
var brushBrightness = 1;
var brushHue = 0;
var backColor = 'transparent';
var startPointX = 0;
var startPointY = 0;
var fieldX = 0;
var fieldY = 0;
var actionCount = 0;
var highActionCount = 0;
var undoFlg = 0;
var canvasFlg = 0;
var pl = 0;
var pt = 0;
var bombTimer = '';

function fieldArea(){
    var wh = $(window).height() - 60;
    var cw = $('#field').width();
    $('#toolBox,#field').css({
        'height':wh
    });
    $('#field').css({
        'width':cw
    });
    fieldX = $('#field').offset().left;
    fieldY = $('#field').offset().top;
}
function startBrush(){
    $('#defaultMode').prop('checked',true);
    $('#brush1').addClass('active');
    cursorImage();
    brushSize = $('#brushSize').val();
    brushBlur = $('#brushBlur').val();
    brushOpacity = $('#brushOpacity').val();
    brushSaturate = $('#brushSaturate').val();
    brushBrightness = $('#brushBrightness').val();
    brushHue = $('#brushHue').val();
    var brushBrightness = 1;
    var brushHue = 1;
    $('#backColor').val('#000');
    $('#ghostPoint').attr('src',brush);
    $('#ghostPoint').css({
        'width':brushSize,
        'height':brushSize
    });
}
function afterImage(e){
    $('#ghostPoint').css({
        'left':pl,
        'top':pt
    });
    if(e.shiftKey){
        if(undoFlg==1){
            resetUndo();
        }
        $('#field').append('<img src="'+ brush +'" class="afterImage action'+ actionCount +'" style="left: '+ pl +'px;top: '+ pt +'px;-webkit-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-moz-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-o-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-ms-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);"  width=" ' + brushSize + ' "  height=" ' + brushSize + '" />');
    }
}
function cursorImage(){
    $('#field').css({
        'cursor':'default'
    });
}
function brushSelect(target){
    clearTimeout(bombTimer);
    brush = target.find('img').attr('src');
    $('#brush').find('li').each(function(){
        $(this).removeClass('active');
    });
    if($('[name=cursorMode]:checked').attr('id')=='defaultMode'){
        cursorImage();
    }
    if(target.attr('id')=='rndBrush'){
        bomb();
    }
    target.addClass('active');
    $('#ghostPoint').attr('src',brush);
}
function addBrush(url){
    $('#rndBrush').before('<li><img src="'+url+'" /></li>');
    cursorList.push(url);
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
function resetUndo(){
    $('#field').find('img').each(function(){
        if($(this).hasClass('undo')){
            $(this).remove();
        }
    });
    undoFlg = 0;
}
function bomb(){
    var num = cursorList.length;
    rnd = Math.floor(Math.random()*num);
    $('#ghostPoint').attr('src',brush);
    brush = cursorList[rnd];
    bombTimer = setTimeout(bomb,100);
}
function canvasDraw(e){
    if(e.shiftKey){
        var x = e.clientX;
        var y = e.clientY;
        var canvas = document.getElementById("field");
        var context = canvas.getContext('2d');
        context.strokeStyle = "rgba(255,0,0,1)";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(startPointX, startPointY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
        startPointX = x;
        startPointY = y;
        if(undoFlg==1){
            resetUndo();
        }
    }
}

$(function(){
    fieldArea();
    setTimeout(startBrush,500);
    var timer = false;
    $(window).resize(function(){
        if(timer!==false){
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            fieldArea();
        },200);
    });
    $(window).keydown(function(e){
        var x = e.clientX;
        var y = e.clientY;
        if(e.keyCode=='16'){
            startPointX = x;
            startPointY = y;
        }
    });
    $('#field').mousemove(function(e){
        pl = e.clientX - brushSize/2 -fieldX;
        pt = e.clientY - brushSize/2 -fieldY;
        if(canvasFlg===0){
            afterImage(e);
        }
        else{
            canvasDraw(e);
        }
    });
    $('#brush').on('click','li',function(){
        brushSelect($(this));
    });
    $(window).keyup(function(e){
        if(e.keyCode=='16'){
            actionCount++;
        }
        if(actionCount>highActionCount){
            highActionCount = actionCount;
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
        if($(this).val()<1){
            $(this).val(1);
        }
        var size = $(this).val();
        brushSize = size;
        $('#ghostPoint').css({
            'width':brushSize,
            'height':brushSize
        });
    });
    $('#brushBlur').change(function(){
        if($(this).val()<0){
            $(this).val(0);
        }
        var size = $(this).val();
        brushBlur = size;
        $('#ghostPoint').css({
            '-webkit-filter': 'blur(' + brushBlur + 'px)',
            '-ms-filter': 'blur(' + brushBlur + 'px)',
            'filter': 'blur(' + brushBlur + 'px)'
        });
    });
    $('#brushOpacity').change(function(){
        if($(this).val()<0){
            $(this).val(0);
        }
        else if($(this).val()>1){
            $(this).val(1);
        }
        var size = $(this).val();
        brushOpacity = size;
    });
    $('#brushSaturate').change(function(){
        if($(this).val()<0){
            $(this).val(0);
        }
        else if($(this).val()>200){
            $(this).val(200);
        }
        var size = $(this).val();
        brushSaturate = size;
        $('#ghostPoint').css({
            '-webkit-filter': 'saturate(' + brushSaturate + '%)',
            '-moz-filter': 'saturate(' + brushSaturate + '%)',
            '-o-filter': 'saturate(' + brushSaturate + '%)',
            '-ms-filter': 'saturate(' + brushSaturate + '%)',
            'filter': 'saturate(' + brushSaturate + '%)'
        });
    });
    $('#brushBrightness').change(function(){
        if($(this).val()<0){
            $(this).val(0);
        }
        else if($(this).val()>2){
            $(this).val(2);
        }
        var size = $(this).val();
        brushBrightness = size;
        $('#ghostPoint').css({
            '-webkit-filter': 'brightness(' + brushBrightness + ')',
            '-moz-filter': 'brightness(' + brushBrightness + ')',
            '-o-filter': 'brightness(' + brushBrightness + ')',
            '-ms-filter': 'brightness(' + brushBrightness + ')',
            'filter': 'brightness(' + brushBrightness + ')'
        });
    });
    $('#brushHue').change(function(){
        if($(this).val()<0){
            $(this).val(0);
        }
        else if($(this).val()>360){
            $(this).val(360);
        }
        var size = $(this).val();
        brushHue = size;
        $('#ghostPoint').css({
            '-webkit-filter': 'hue-rotate(' + brushHue + 'deg)',
            '-moz-filter': 'hue-rotate(' + brushHue + 'deg)',
            '-o-filter': 'hue-rotate(' + brushHue + 'deg)',
            '-ms-filter': 'hue-rotate(' + brushHue + 'deg)',
            'filter': 'hue-rotate(' + brushHue + 'deg)'
        });
    });
    $('#backColor').change(function(){
        backColor = $(this).val();
        $('#field').css({
            'background-color':backColor
        });
    });
    $('#noColor').click(function(){
        backColor = 'transparent';
        $('#field').css({
            'background-color':backColor
        });
    });
    $('[name=cursorMode]').change(function(){
        var mode = $('[name=cursorMode]:checked').attr('id');
        if(mode=='defaultMode'){
            cursorImage();
            $('#ghostPoint').css({
                'display':''
            });
        }
        else if(mode=='ghostMode'){
            $('#field').css({
                'cursor':'none'
            });
            $('#ghostPoint').css({
                'display':'block'
            });
        }
    });
    $('#field').click(function(e){
        var pl = e.clientX - brushSize/2 -fieldX;
        var pt = e.clientY - brushSize/2 -fieldY;
        $(this).append('<img src="'+ brush +'" class="afterImage action'+ actionCount +'" style="left: '+ pl +'px;top: '+ pt +'px;-webkit-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-moz-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-o-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-ms-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);"  width=" ' + brushSize + ' "  height=" ' + brushSize + '" />');
        actionCount++;
        if(actionCount>highActionCount){
            highActionCount = actionCount;
        }
    });
});