const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
//const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json"; este es el inicial
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"; //este link corresponde al carrito de desafiate.
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const COUNTRIES_URL = "https://restcountries.eu/rest/v2/all"; //API con paises

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
const cartQuant = localStorage.getItem("cartQuantity");
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  var user= localStorage.getItem("usuario"); 
  if(user != null){
    document.getElementById("username").innerHTML = user;
  }


  
  if (cartQuant != null){
    document.getElementById("cantidadArticulos").innerHTML = cartQuant;
  } else {
    getJSONData(CART_INFO_URL).then(function (resultObj) {
      if (resultObj.status === "ok") {
          articles = resultObj.data.articles;
          var cartQuantities = 0;
          for(let article of articles){
            cartQuantities += article.count;
          }
          document.getElementById("cantidadArticulos").innerHTML = cartQuantities;
      }
  });
}

});