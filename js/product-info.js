//comentarios
var comentarios= [];

//la función guardar toma los datos ingresados en el formulario de la página y los ingresa como propiedades de un objeto "comentario"
//para posteriormente agregar el objeto al array "comentarios" y mostrarlo en la página.
function guardar(){ 
    var comentario = {};
    var nombreUsuario = document.getElementById("usercoment").value;
    var descripcion = document.getElementById("descripcioncoment").value;
    
    var estrellas = document.getElementsByName("puntuacion");
    for (let estrella of estrellas){
        if (estrella.checked){
            var puntuacion = estrella.value;
        }
    }
    
    var fh = new Date(); //var de fecha y hora
    var d  = fh.getDate();
    var dia = (d < 10) ? '0' + d : d;
    var m = fh.getMonth() + 1;
    var mes = (m < 10) ? '0' + m : m;
    var fecha = fh.getFullYear() + `-` + mes + `-` + dia;
    var hora = fh.getHours() + `:` + fh.getMinutes() + `:` + fh.getSeconds();
    
    //cada propiedad tiene el mismo nombre que las asignadas en el JSON que está predefinido en la consigna.
    comentario.user = nombreUsuario;
    comentario.description = descripcion;
    comentario.score = puntuacion;
    comentario.dateTime = fecha + ` ` + hora;

    comentarios.push(comentario);
    mostrar(comentarios);
}

//función para dar formato a cada comentario e ingresarlos en la página
function mostrar(comentarios){
    var commentList= `<dl>`;

    for(i=0; i<comentarios.length; i++){
        let comentario = comentarios[i];

        var estrellitas = '';

        for(j=0; j<comentario.score; j++){
            estrellitas += `<input id="r${j}" type="radio" name="puntos" value="1" checked></input> 
            <label class="estrellita" for="r${j}"><i class="fas fa-star"></i></label>`;
        }

    commentList+= `<dt>` + comentario.user + `</dt>
    <dd> <small>` + comentario.dateTime + `</small></dd>
    <dd> ` + comentario.description + `</dd>
    <dd> Valoración: ` + estrellitas +`</dd> <hr>`;
    }

    commentList += `</dl>`;

    document.getElementById("listadecomentarios").innerHTML = commentList;
}


//funcion para mostrar imagenes del array levantado en el json

function mostrarImg(imagenes){
    var galeria = ``;

    for(i=0; i<imagenes.length; i++){
        let imagen = imagenes[i];
        galeria += 
        `<li class="item"><img src="${imagen}">
         </li>`;
    }

    document.getElementById("productImagesGallery").innerHTML = galeria;

}

//carousel
function mostrarCarousel(imgs){
    for(i=0; i<imgs.length; i++){
        document.getElementById("item"+i).src=imgs[i];
    }
}

//productos relacionados
var autos = [];

function mostrarRelacionados(array){
    let related = ``;
    array.forEach(function(i){
        var auto = autos[i];
        related+=`
        <div class="card" style="max-width:18em;">
              <img class="card-img-top" src="${auto.imgSrc}" alt="${auto.name}">
              <div class="card-body">
                <h3 class="card-title">${auto.name}</h3>
                <h4>${auto.currency} ${auto.cost}</h4>
                <p class="card-text">${auto.description}</p>
                <p class="card-text"><small class="text-muted">Vendidos: ${auto.soldCount}</small></p>
                <a href="product-info.html" class="btn btn-primary">Ver producto</a>
              </div>
          </div>
        `
    });
    document.getElementById("productRelated").innerHTML= related;
    

}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

    //obteniendo el JSON de comentarios
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
    if (resultObj.status === "ok"){
    comentarios = resultObj.data;
    mostrar(comentarios);
    }
    });

    getJSONData(PRODUCTS_URL).then(function(resultObj){
        autos = resultObj.data;
        
    });

    //obteniendo el JSON de info e ingresando las propiedades del producto al html
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            product = resultObj.data;

            let productNameHTML  = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCategoryHTML = document.getElementById("productCategory");
            let productCostHTML = document.getElementById("productCost");
            let productCurrencyHTML = document.getElementById("productCurrency");
            
            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = `<a href="category-info.html">` + product.category + `</a>`;
            productCostHTML.innerHTML = product.cost;
            productCurrencyHTML.innerHTML = product.currency;
            
            //Muestro las imagenes en forma de galería
            mostrarImg(product.images);
            mostrarCarousel(product.images);
            mostrarRelacionados(product.relatedProducts);

        }
    });
});

