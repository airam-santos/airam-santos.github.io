const button = $("button");
const out = $("#resultados");
const spinner = $("#loading");
let description;
spinner.hide();
//Comienza la búsqueda cuano se haga click
button.on("click", function () {

    let output = "";
    const myApiKey = "dbee55139239a07a4c857ed4123c4bc6";
    spinner.show();
    if (this.id == 'botonComic') {
        let value = document.getElementById('comics').value;
        //Si buscamos y el texto está vacío, se hará una consulta de todos los cómics
        let direccion;
        if (value == "") {
            direccion = "https://gateway.marvel.com:443/v1/public/comics?limit=100&apikey=" + myApiKey;
        } else {
            direccion = "https://gateway.marvel.com:443/v1/public/comics?limit=100&titleStartsWith=" + value + "&apikey=" + myApiKey;
        }
        //Consulta a la API
        $.ajax({
            url: direccion,
            type: "GET",
            beforeStart: () => {
                spinner.show();
            },
            complete: () => {
                spinner.hide();
            },
            success: response => {


                //Creamos los elementos donde aparecerán los datos del cómic
                $.each(response.data.results, (key, value) => {
                    //Controlamos que no aparezca null como descripción
                    if (value.description == null) {
                        description = 'Sin descripcion.';
                    } else {
                        description = value.description;
                    }
                    output += "<div class='data'><p>" + value.title + "</p> <p class='descripcion'> " + description + "</p> <img src=" + value.thumbnail.path + "." + value.thumbnail.extension + " alt='imagen'/></div>";
                });
                spinner.hide();
                output ? out.html(output) : out.hmtl("No results");

                jQuery(function ($) {
                    //Intento de implementar un elemento Leer más y leer menos en la descripción, no funciona correctamente
                    $('.descripcion').each(function (descripcion) {
                        let caracteres = 20;
                        let contenido = $(this).text();
                        if (contenido.length > caracteres) {
                            let resumen = contenido.substr(0, caracteres);
                            let todo = contenido.substr(caracteres, contenido.length - caracteres);
                            let nuevoContenido = "<span class='summary'>" + resumen + "</span> <span class='complete'>" + todo + "</span><br/><span class='more'>Leer mas...</span>";
                            $(this).html(nuevoContenido);
                            $('.complete').hide();

                            $('.more').on('click', function () {
                                if ($(this).text() == "Leer mas...") {
                                    $(this).text("Leer menos...").siblings(".complete").show();
                                } else {
                                    $(this).text("Leer mas...").siblings(".complete").hide();
                                }

                                //Crear función on click, con if se mira el valor de mostrar mas.
                            })
                        }

                    })

                    //Paginación
                    var items = $(".data");
                    var numItems = items.length;
                    var perPage = 10;

                    items.slice(perPage).hide();

                    $("#pagination").pagination({
                        items: numItems,
                        itemsOnPage: perPage,
                        cssStyle: "light-theme",

                        onPageClick: function (pageNumber) {

                            var showFrom = perPage * (pageNumber - 1);

                            var showTo = showFrom + perPage;
                            items.hide()

                                .slice(showFrom, showTo).show();
                        }
                    });

                });
            }
        });

    };
    if (this.id == 'botonPersonaje') {
        let value = document.getElementById('characters').value;

        let direccion;
        //Si buscamos y el texto está vacío, se hará una consulta de todos los personajes
        if (value == "") {
            direccion = "https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey=" + myApiKey;
        } else {
            direccion = "https://gateway.marvel.com:443/v1/public/characters?limit=100&nameStartsWith=" + value + "&apikey=" + myApiKey;
        }

        $.ajax({
            url: direccion,
            type: "GET",
            beforeStart: () => {
                spinner.show();
            },
            complete: () => {
                spinner.hide();
            },
            success: response => {

                $.each(response.data.results, (key, value) => {
                    output += "<div class='data'><p>" + value.name + "</p> <img src=" + value.thumbnail.path + "." + value.thumbnail.extension + " alt='imagen'/></div>";
                });
                spinner.hide();
                output ? out.html(output) : out.hmtl("No results");
                jQuery(function ($) {
                    //Paginación
                    var items = $(".data");

                    var numItems = items.length;
                    var perPage = 10;

                    items.slice(perPage).hide();

                    $("#pagination").pagination({
                        items: numItems,
                        itemsOnPage: perPage,
                        cssStyle: "light-theme",


                        onPageClick: function (pageNumber) {

                            var showFrom = perPage * (pageNumber - 1);

                            var showTo = showFrom + perPage;

                            items.hide()

                                .slice(showFrom, showTo).show();
                        }
                    });
                });
            }
        });
    }

})