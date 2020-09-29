//función para mostrar los elementos del carrito
function showCart(array){
    let html=``;
    for(i=0; i<array.length; i++){
        article = array[i];
        subtotal = article.unitCost*article.count;
        html+= `
        <tr>
      <th class="align-middle" scope="row">${article.count}</th>
      <td class="align-middle"><img style='height:4em' src='${article.src}' alt='${article.src}' class="img-thumbnail"></td>
      <td class="align-middle">${article.name}</td>
      <td class="align-middle">${article.unitCost} ${article.currency}</td>
      <td class="align-middle">${subtotal} ${article.currency}</td>
      </tr>
        `;
    }
    document.getElementById("cartList").innerHTML= html;
    document.getElementById("cartCount").innerHTML= array.length;
}

function showTotal(array){
    var total = 0;
    for(let article of array){
        let subtotal = article.unitCost*article.count;
        if(article.currency == "UYU") {
            total += subtotal/40;  
        } else if(article.currency == "USD") {
            total += subtotal;
        }
    }
    document.getElementById("totalCost").innerHTML= total + ` USD`;
}




//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            var articles = resultObj.data.articles
            showCart(articles);
            showTotal(articles);
        }
    });
});