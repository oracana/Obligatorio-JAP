//comentarios
var comentarios= [];

function guardar(){
    var comentario = {};
    var nombreusuario = document.getElementById("usercoment").value;
    var descripcion = document.getElementById("descripcioncoment").value;
    var puntuacion = document.getElementById("puntuacion").value;
    
    comentario.user = nombreusuario;
    comentario.description = descripcion;
    comentario.score = puntuacion;

    comentarios.push(comentario);
    mostrar(comentarios);
}

function mostrar(comentarios){
    var commentlist= `<dl>`;

    for(i=0; i<comentarios.length; i++){
        let comentario = comentarios[i];

    commentlist+= `<dt>  ` + comentario.user + `</dt>
    <dd> ` + comentario.description + `</dd>
    <dd> Valoración: ` + comentario.score + `.</dd> <hr>`
    }

    commentlist += `</dl>`;

    document.getElementById("listadecomentarios").innerHTML=commentlist;
}


//contamos con un conjunto de imagenes dentro del json





//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
if (resultObj.status === "ok"){
    comentarios = resultObj.data;
    mostrar(comentarios);
}
    });

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
            //let productRelatedHTML = document.getElementById("productRelated");
        
            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;
            productCostHTML.innerHTML = product.cost;
            productCurrencyHTML.innerHTML = product.currency;
            //productRelatedHTML.innerHTML = product.relatedProducts;

            //Muestro las imagenes en forma de galería
            //showImagesGallery(category.images);
        }
    });




}); 