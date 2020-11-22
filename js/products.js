const ORDER_ASC_BY_COST = "Precio ascendente";
const ORDER_DESC_BY_COST = "Precio descendente";
const ORDER_BY_SOLD_COUNT = "Relevancia";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCost = undefined;
var maxCost = undefined;
var productsArray = [];
var busqueda = undefined; //crea una variable que va a contener el valor de la búsqueda ingresada
var resultado = [];

//funcion para ordenar los productos
function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost < bCost ){ return -1; }
            if ( aCost > bCost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost > bCost ){ return -1; }
            if ( aCost < bCost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if ( aSoldCount > bSoldCount ){ return -1; }
            if ( aSoldCount < bSoldCount ){ return 1; }
            return 0;
        });
    }

    return result;
}


//mostrar las categorías
function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

           if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) && 
           ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))
            ){

        htmlContentToAppend += `
        <div class="col-sm-6 col-xs-12 product-info-container">
            <a href="product-info.html" class="product-info-link">
                <div class="row">
                    <div class="col-md-5 product-img-container">
                        <img src="` + product.imgSrc + `" alt="` + product.desc + `">
                    </div>
                    <div class="col-md-7">
                        <div>
                            <h4 class="mb-1">`+ product.name + `</h4> 
                            <h4 class="mb-1 bold">` + product.cost + ` ` + product.currency + `</h4>
                            <br>
                            <small class="muted">` + product.soldCount + ` artículos vendidos </small>
                        </div>
                    </div>
                    
                    <p class="mt-4 mb-1">` + product.description + `</p>
                </div>
            </a>
        </div>
        `

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    } 
}
}



function sortAndShowCategories(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortCategories(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//la función buscar atribuye a la variable búsqueda el texto ingresado en el input, para después mostrar un nuevo array con los resultados de la búsqueda
function buscar(){
        buscador = document.getElementById("busquedatxt");
        busqueda = buscador.value.toLowerCase(); //se pasa a minúsculas todo texto, para la comparación
        for(let i = 0; i < currentProductsArray.length; i++){
            let product = currentProductsArray[i];
            let nombre = product.name.toLowerCase();
            let desc = product.description.toLowerCase(); 
    
            if  ((nombre.indexOf(busqueda) !== -1) || (desc.indexOf(busqueda) !== -1)){
                resultado.push(product);
            }
        } 
    
    let htmlContentToAppend = ""; //con lo que sigue, se insertan en el html los resultados de la búsqueda.
    for(let i = 0; i < resultado.length; i++){
    let product = resultado[i];

    if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) && 
       ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){

    htmlContentToAppend += `
    <div class="col-sm-6 col-xs-12 product-info-container">
            <a href="product-info.html" class="product-info-link">
                <div class="row">
                    <div class="col-md-5 product-img-container">
                        <img src="` + product.imgSrc + `" alt="` + product.desc + `">
                    </div>
                    <div class="col-md-7">
                        <div>
                            <h4 class="mb-1">`+ product.name + `</h4> 
                            <h4 class="mb-1 bold">` + product.cost + ` ` + product.currency + `</h4>
                            <br>
                            <small class="muted">` + product.soldCount + ` artículos vendidos </small>
                        </div>
                    </div>
                    
                    <p class="mt-4 mb-1">` + product.description + `</p>
                </div>
            </a>
        </div>
    `

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend; 
        }
    }

if (resultado.length== 0){ //si la búsqueda no tiene resultados, entonces se muestra el cartel de "producto no encontrado"
    document.getElementById("cat-list-container").innerHTML = `<h4 class="mb-1"> Producto no encontrado </h4>`;
} 
resultado = []; //con esto borramos el array antes de seguir buscando *muy importante. De lo contrario, los resultados siguen agregándose a un mismo array
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            sortAndShowCategories(ORDER_ASC_BY_COST, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
        document.getElementById("busquedatxt").value = "";

        minCost = undefined;
        maxCost = undefined;
        busqueda = undefined;

        showCategoriesList();
    }); //agrego la limpieza de la búsqueda al botón "limpiar"

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCost = document.getElementById("rangeFilterCountMin").value;
        maxCost = document.getElementById("rangeFilterCountMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showCategoriesList();
    });

    //evento para la searchbar, que ejecuta la función buscar() 
    document.getElementById("busquedatxt").addEventListener("keyup", buscar);
    
});