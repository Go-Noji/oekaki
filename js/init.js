var cursorList = ['images/burush1.png','images/burush2.png','images/burush3.png','images/burush4.png','images/burush5.png'];
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
var pl = 0;
var pt = 0;
var bombTimer = '';
var nowLayer = 1;
var highLayer = 1;

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
        $('#layer' + nowLayer).append('<img src="'+ brush +'" class="afterImage action'+ actionCount +'" style="left: '+ pl +'px;top: '+ pt +'px;-webkit-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-moz-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-o-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-ms-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);"  width=" ' + brushSize + ' "  height=" ' + brushSize + '" />');
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
function ghostFilterCss(){
    $('#ghostPoint').css({
        '-webkit-filter': 'blur(' + brushBlur + 'px) saturate(' + brushSaturate + '%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg)',
        '-moz-filter': 'blur(' + brushBlur + 'px) saturate(' + brushSaturate + '%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg)',
        '-o-filter': 'blur(' + brushBlur + 'px) saturate(' + brushSaturate + '%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg)',
        '-ms-filter': 'blur(' + brushBlur + 'px) saturate(' + brushSaturate + '%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg)',
        'filter': 'blur(' + brushBlur + 'px) saturate(' + brushSaturate + '%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg)'
    });
}
function layerVisibility(target){
    if(target.hasClass('on')){
        target.removeClass('on');
        target.addClass('off');
        var num = target.parents('.layerList').attr('id').replace(/l/g,'');
        $('#layer' + num).css({
            'visibility':'hidden'
        });
    }
    else{
        target.removeClass('off');
        target.addClass('on');
        var num = target.parents('.layerList').attr('id').replace(/l/g,'');
        $('#layer' + num).css({
            'visibility':''
        });
    }
}
function countImg(){
    var num = $('#layer' + nowLayer).find('img').length;
    var hidden = $('#layer' + nowLayer).find('.undo').length;
    $('.activeLayer').find('.imgNum').text(num - hidden);
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
        afterImage(e);
    });
    $('#brush').on('click','li',function(){
        brushSelect($(this));
    });
    $(window).keyup(function(e){
        if(e.keyCode=='16'){
            actionCount++;
            countImg();
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
                    countImg();
                    return false;
                }
                else{
                    undo();
                    countImg();
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
        ghostFilterCss();
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
        ghostFilterCss();
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
        ghostFilterCss();
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
        ghostFilterCss();
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
        $('#layer' + nowLayer).append('<img src="'+ brush +'" class="afterImage action'+ actionCount +'" style="left: '+ pl +'px;top: '+ pt +'px;-webkit-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-moz-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-o-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);-ms-filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);filter: blur(' + brushBlur + 'px) saturate(' + brushSaturate +'%) brightness(' + brushBrightness + ') hue-rotate(' + brushHue + 'deg);"  width=" ' + brushSize + ' "  height=" ' + brushSize + '" />');
        actionCount++;
        countImg();
        if(actionCount>highActionCount){
            highActionCount = actionCount;
        }
    });
    $('#layerPlus').click(function(){
        highLayer++;
        nowLayer = highLayer;
        $('#layerBox').find('.layerList').each(function(){
            $(this).removeClass('activeLayer');
        });
        $('#ghostPoint').after('<div id="layer' + nowLayer + '" class="layer" style="z-index:' + nowLayer + ';"></div>');
        $('#lHead').after('<li id="l' + nowLayer + '" class="activeLayer layerList clearfix"><p class="layerVisibility on"></p><p class="layerName">layer' + nowLayer + '</p><input class="inputLayerName" type="text" /><p class="imgNum">0</p><p class="upDown"><input class="up" type="button" value="up" /><input class="down" type="button" value="down"></p></li>');
    });
    $('#layerMinus').click(function(){
        var nothing = nowLayer;
        $('#layer' + nowLayer).remove();
        $('#l' + nowLayer).remove();
        if(highLayer==nowLayer){
            highLayer--;
        }
        $('#layerBox').find('.layerList').each(function(){
            nowLayer = $(this).attr('id').replace(/l/g,'');
            $(this).addClass('activeLayer');
            return false;
        });
        if(nothing==nowLayer){
            $('#ghostPoint').after('<div id="layer1" class="layer" style="z-index:1;"></div>');
            $('#lHead').after('<li id="l1" class="activeLayer layerList clearfix"><p class="layerVisibility on"></p><p class="layerName">layer1</p><p class="imgNum">0</p><p class="upDown"><input class="up" type="button" value="up" /><input class="down" type="button" value="down"></p></li>');
        }
    });
    $('#layerBox').on('click','.layerList',function(){
        nowLayer = $(this).attr('id').replace(/l/g,'');
        $('#layerBox').find('.layerList').each(function(){
            $(this).removeClass('activeLayer');
        });
        $(this).addClass('activeLayer');
    });
    $('#layerBox').on('click','.up',function(){
        var list = $(this).parents('.layerList');
        if(list.prev().attr('id')=='lHead'){
            return false;
        }
        var num = list.attr('id').replace(/l/g,'');
        var nextNum = list.prev().attr('id').replace(/l/g,'');
        var thisStyle = $('#layer' + num).attr('style');
        var targetStyle = $('#layer' + nextNum).attr('style');
        list.prev().clone().insertAfter(list);
        list.prev().remove();
        $('#layer' + nextNum).attr('style',thisStyle);
        $('#layer' + num).attr('style',targetStyle);
    });
    $('#layerBox').on('click','.down',function(){
        var list = $(this).parents('.layerList');
        if(list.next().length==0){
            return false;
        }
        var num = list.attr('id').replace(/l/g,'');
        var prevNum = list.next().attr('id').replace(/l/g,'');
        var thisStyle = $('#layer' + num).attr('style');
        var targetStyle = $('#layer' + prevNum).attr('style');
        list.next().clone().insertBefore(list);
        list.next().remove();
        $('#layer' + prevNum).attr('style',thisStyle);
        $('#layer' + num).attr('style',targetStyle);
    });
    $('#layerBox').on('click','.layerVisibility',function(){
        var target = $(this);
        layerVisibility(target);
    });
    $('#layerBox').on('click','.layerName',function(){
        var beforeName = $(this).text();
        $(this).next().css({
            'display':'block'
        });
        $(this).css({
            'display':'none'
        });
        $(this).next().val(beforeName);
    });
    $('#layerBox').on('blur','.inputLayerName',function(){
        $(this).css({
            'display':''
        });
        $(this).prev().css({
            'display':''
        });
        var newText = $(this).val();
        $(this).prev().text(newText);
    });
});