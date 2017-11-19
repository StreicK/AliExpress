// ==UserScript==
// @name         Tiendas Sinotrans
// @version      1.0
// @description  Conoce las tiendas que envían por Sinotrans
// @author       Original por CHW.orochimaru - Modificado por CHW.StreicK
// @match        *.aliexpress.com/*
// @require      http://code.jquery.com/jquery-latest.js


// ==/UserScript==
var jsonTiendasRecomendadas = "https://raw.githubusercontent.com/StreicK/AliExpress/master/TiendasRecomendadas.json";
var jsonTiendasPosibles = "https://raw.githubusercontent.com/StreicK/AliExpress/master/TiendasPosibles.json";
var jsonTiendasNoRecomendadas = "https://raw.githubusercontent.com/StreicK/AliExpress/master/TiendasNoRecomendadas.json";

var TiendasRecomendadas;
var TiendasPosibles;
var TiendasNoRecomendadas;

//trae el json con el arreglo que contiene los numeros de tiendas
$.getJSON(jsonTiendasRecomendadas ,function(data){
    TiendasRecomendadas = data.TiendasRecomendadas;
});

$.getJSON(jsonTiendasNoRecomendadas ,function(data){
    TiendasNoRecomendadas = data.TiendasNoRecomendadas;
});

$.getJSON(jsonTiendasPosibles ,function(data){
    TiendasPosibles = data.TiendasPosibles;
});

function colorear(){

    //LISTADO DE LAS TIENDAS QUE SE MUESTRAN EN LA BUSQUEDA
    var listaDeProductos = $('li.list-item');

    $(listaDeProductos).each(function(){

        //EXTRAE EL NUMERO DE LA TIENDA
        var tienda = $(this).find("a.store ").attr("href").split('/').pop();
        //console.log(tienda);

        //COMPRUEBA SI LA TIENDA MUESTRA ENVIO POR ALIEXPRESS STANDARD SHIPPING
        var isViaASS = $(this).find("dd.price").text().match(/via AliExpress Standard Shipping/gi);

        //COMPRUEBA QUE EL NUMERO DE TIENDA ESTE EN LOS REGISTROS
        var isTiendasRecomendadas = $.inArray(tienda, TiendasRecomendadas);

        var isTiendasNoRecomendadas = $.inArray(tienda, TiendasNoRecomendadas);
        
        var isTiendasPosibles = $.inArray(tienda, TiendasPosibles);

        if(isTiendasRecomendadas !== -1){

            //COLOR DE LAS TIENDAS RECOMENDADAS
            $(this).css("background-color","#448904");
            
            
        if(isTiendasNoRecomendadas !== -1){

            //COLOR DE LAS TIENDAS NO RECOMENDADAS
            $(this).css("background-color","#d800ff");

        }else if(isTiendasPosibles!== -1){

            //COLOR DE LAS TIENDAS POSIBLES
            $(this).css({'background': '#448904',
                         'background':'-moz-linear-gradient(-45deg, #448904 0%, #448904 30%, #ffe600 70%, #ffe600 100%)',
                         'background':' -webkit-gradient(left top, right bottom, color-stop(0%, #448904), color-stop(30%, #448904), color-stop(70%, #ffe600), color-stop(100%, #ffe600))',
                         'background':' -webkit-linear-gradient(-45deg, #448904 0%, #448904 30%, #ffe600 70%, #ffe600 100%)',
                         'background':' -o-linear-gradient(-45deg, #448904 0%, #448904 30%, #ffe600 70%, #ffe600 100%)',
                         'background':' -ms-linear-gradient(-45deg, #448904 0%, #448904 30%, #ffe600 70%, #ffe600 100%)',
                         'background':' linear-gradient(135deg, #448904 0%, #448904 30%, #ffe600 70%, #ffe600 100%)'});
                      


        }else if(isViaASS){

            //COLOR DE LAS TIENDAS QUE ENVÍAN POR ALIEXPRESS STANDARD SHIPPING (SIN COMPROBAR)
            $(this).css("background-color","#ffe700");

        }


    });

}

function correosChileLink(){

    var aliTrackingNum = $(".shipping-bd td.no").text().replace(/ |\n/g,"").trim();
    var sinoTransToCorreosChile = aliTrackingNum.match(/\d{12}(?=001$)/);

    //TRANSFORMA EL NÚMERO SINOTRANS PARA PODER HACER EL SEGUIMIENTO EN LA PAGINA DE CORREOS DE CHILE
    if(sinoTransToCorreosChile){

        $('<a class="ui-button ui-button-normal ui-track" href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='+sinoTransToCorreosChile+'">Ver en Correos Chile</a>')
            .insertAfter("a.ui-track");

    }else{

        //ALTERNATIVAMENTE SE USA EL NUMERO DE MANERA NORMAL

        $('<a class="ui-button ui-button-normal ui-track" href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='+aliTrackingNum+'">Ver en Correos Chile</a>')
            .insertAfter("a.ui-track");

    }
}

function alertaPocosDias(){

    //TIEMPO RESTANTE
    let timeLeft = $('p.left-sendgoods-day');

    $(timeLeft).each(function(){

        let days = (((this.attributes['lefttime'].value/1000)/60)/60)/24;

        if(days<7){

            //SI ES MENOR A 7 DIAS CAMBIA EL COLOR Y TAMAÑO
            this.style.color ="red";
            this.style.fontSize ="large";

        }

    });

}

$(function(){

    colorear();
    correosChileLink();
    alertaPocosDias();

});
