import { zonas } from "./ListadoLugares.js";
var mapa =document.createElement("div");
mapa.setAttribute("id","miMapa");
document.body.insertBefore(mapa, document.body.firstElementChild)
var mymap = L.map('miMapa').setView([28.456349, -16.283257], 99);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken:'pk.eyJ1IjoiYmVsbGFyayIsImEiOiJjazRjbzljangwcG9rM2ZvZ2ZwNWJ5bGJtIn0.awSpieQi4KzP3a1SFssjWA'
}).addTo(mymap);

  var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

var marker = new Array();
function lugares() {
    for(let i=0;i<zonas.length;i++){
        var longitud = zonas[i].geometry.coordinates[0];
        var latitud =  zonas[i].geometry.coordinates[1];
        let informacion =`<b>${zonas[i].properties.nombre}</b><br>${zonas[i].properties.dir}<br>Tlf:${zonas[i].properties.tf}<br>Código Postal:${zonas[i].properties.cp}`;
        var LamMarker = new L.marker([latitud, longitud], {icon: greenIcon})
        .bindPopup(informacion)
         .addTo(mymap);    
         marker.push(LamMarker);
         mymap.addLayer(marker[i]);

    }
}
lugares();

function eliminarDiacriticos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

//Función para buscar por ubicación
function filtrarUbicacion(elemento) {
    let coincide = true;
    if(!elemento.properties.dir.toLowerCase().includes(eliminarDiacriticos(document.getElementById("txtDireccion").value).trim().toLowerCase()))
        coincide = false;
    return coincide;
}

function filtrarCodPostal(elemento) {
    let coincide = true;
    if(elemento.properties.mun!=document.getElementById("txtCodMunicipio").value.trim())
        coincide = false;
    return coincide;
}


function filtrarNombre(elemento) {
    let coincide = true;
    if(!elemento.properties.nombre.toLowerCase().includes(eliminarDiacriticos(document.getElementById("txtNombre").value).trim().toLowerCase()))
        coincide = false;
    return coincide;
}


//Función para restabecer el estado de los elementos
function reiniciarFiltros() {
    for(let i=0;i<zonas.length;i++){
        if(!mymap.hasLayer(marker[i]))
        mymap.addLayer(marker[i]);
    }
}


function filtrar() {
    reiniciarFiltros();
    let mensajes="";
    let contador=0;
    
    if(!/^\d{5}$/.test(document.getElementById("txtCodMunicipio").value.trim())&&document.getElementById("txtCodMunicipio").value.trim() != ""){
        mensajes+=`En el campo "Código postal de municipio" debe introducir 5 números o dejar el campo vacio`
        document.getElementById("mensajes").textContent=mensajes;
    }
    else{
        document.getElementById("mensajes").textContent="";
        zonas.forEach(zona => {
            let coincide=true;
            if(document.getElementById("txtDireccion").value.trim() != "")
                coincide = filtrarUbicacion(zona);
            if(coincide){
                if(document.getElementById("txtCodMunicipio").value.trim() != "")
                    coincide = filtrarCodPostal(zona);
                if(coincide){
                    if(document.getElementById("txtNombre").value.trim() != "")
                        coincide = filtrarNombre(zona);
                    if(coincide){
                        if(!mymap.hasLayer(marker[contador]))
                            mymap.addLayer(marker[contador]);
                    }
                }
            }
            if(!coincide){
                if(mymap.hasLayer(marker[contador]))
                    mymap.removeLayer(marker[contador]);
            }
            contador++;
        });
    }
}



document.getElementById("filtrar").addEventListener("click",filtrar)
