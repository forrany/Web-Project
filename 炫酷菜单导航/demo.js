var wrap = $('.wrapper');
setTimeout(function () {change()}, 300);
wrap.on('click',function () {
    change();
})

function change() {
    $('div').toggleClass("open");
    var oLi = $('li');
    var len = oLi.length;
    var deg = 360 / len;
    for(var i = 0; i < len; i++){
        var po = deg * i;
        $('div').hasClass('open')? rotateZ(oLi[i],po) : rotateZ(oLi[i],-360);
    }
}

function rotateZ(dom,deg) {
    $(dom).css({
        'transform' : 'rotateZ(' + deg + 'deg)'
    })
}