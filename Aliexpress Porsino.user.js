// ==UserScript==
// @name         Tiendas Sinotrans
// @version      1.0
// @description  Conoce las tiendas que envían por Sinotrans
// @author       Original por CHW.orochimaru - Modificado por CHW.StreicK
// @match        *.aliexpress.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==
var jsonPorSino = "https://raw.githubusercontent.com/StreicK/AliExpress/master/tiendasPorSino.json";
var jsonTiendasNoRecomendadas = "https://raw.githubusercontent.com/StreicK/AliExpress/master/TiendasNoRecomendadas.json";

var tiendasPorSino;
var TiendasNoRecomendadas;

//trae el json con el arreglo que contiene los numeros de tiendas
$.getJSON(jsonPorSino ,function(data){
    tiendasPorSino = data.tiendasPorSino;
});

$.getJSON(jsonTiendasNoRecomendadas ,function(data){
    TiendasNoRecomendadas = data.TiendasNoRecomendadas;
});

function colorear(){

    //listado de las tiendas que se muestran en la busqueda
    var listaDeProductos = $('li.list-item');

    $(listaDeProductos).each(function(){

        //extrae el numero de tienda
        var tienda = $(this).find("a.store ").attr("href").split('/').pop();
        //console.log(tienda);

        //ve si la tienda muestra envio por AliExpress Standard Shipping
        var isViaASS = $(this).find("dd.price").text().match(/via AliExpress Standard Shipping/gi);

        //comprueba que el numero de tienda este en el arreglo de tiendas conocidas
        var isPorsino = $.inArray(tienda, tiendasPorSino);

        var isTiendaNoRecomendada = $.inArray(tienda, TiendasNoRecomendadas);

        if(isPorsino !== -1){

            //COLOR DE LAS TIENDAS RECOMENDADAS
            $(this).css("background-color","#448904");

        }else if(isTiendaNoRecomendada!== -1){

            //COLOR DE LAS TIENDAS NO RECOMENDADAS
            $(this).css({'background': '#60b807',
                         'background':'-moz-linear-gradient(-45deg, #60b807 0%, #ff0808 50%)',
                         'background':' -webkit-gradient(left top, right bottom, color-stop(0%, #60b807), color-stop(50%, #ff0808))',
                         'background':' -webkit-linear-gradient(-45deg, #60b807 0%, #ff0808 50%)',
                         'background':' -o-linear-gradient(-45deg, #60b807 0%, #ff0808 50%)',
                         'background':' -ms-linear-gradient(-45deg, #60b807 0%, #ff0808 50%)',
                         'background':' linear-gradient(135deg, #60b807 0%, #ff0808 50%)'});



        }else if(isViaASS){

            //COLOR DE LAS TIENDAS QUE ENVÍAN POR ALIEXPRESS STANDARD SHIPPING (SIN COMPROBAR)
            $(this).css("background-color","#ffe700");

        }


    });

}

function correosChileLink(){

    var aliTrackingNum = $(".shipping-bd td.no").text().replace(/ |\n/g,"").trim();
    var sinoTransToCorreosChile = aliTrackingNum.match(/\d{12}(?=001$)/);

    //transforma el numero grande de sino trans a el numero valido para seguimiento en correos de chile
    if(sinoTransToCorreosChile){

        $('<a class="ui-button ui-button-normal ui-track" href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='+sinoTransToCorreosChile+'">Ver en Correos Chile</a>')
            .insertAfter("a.ui-track");

    }else{

        //alternativamente se usa el numero de manera normal

        $('<a class="ui-button ui-button-normal ui-track" href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='+aliTrackingNum+'">Ver en Correos Chile</a>')
            .insertAfter("a.ui-track");

    }
}

function alertaPocosDias(){

    //elemento que contiene el tiempo restante
    let timeLeft = $('p.left-sendgoods-day');

    $(timeLeft).each(function(){

        let days = (((this.attributes['lefttime'].value/1000)/60)/60)/24;

        if(days<7){

            //cuando quedan menos de 7 dias se cambia el color y el tamaño del texto para que sea mas visible
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
