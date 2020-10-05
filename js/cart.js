var shipping = 0;
var articles = [];

//función para mostrar los elementos del carrito
function showCart(array) {
    let html = ``;
    for (i = 0; i < array.length; i++) {
        article = array[i];
        html += `
        <tr>
        <th class="align-middle align-center" scope="row"><img style='height:7em' src='${article.src}' alt='${article.src}' class="img-thumbnail"></th>
        <td class="align-middle">${article.name}</td>
        <td class="align-middle">
        <div>
                      <div class="def-number-input number-input btn-group">
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepDown(); showTotal(articles);"
                          class="btn btn-outline-secondary"><strong>-</strong>
                          </button>
                        <input class="quantity" min="1" name="contador[${i}]" value="${article.count}" type="number" id="contador${i}" style="width:3em; text-align:center" disabled>
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepUp(); showTotal(articles);"
                          class="btn btn-outline-secondary"><strong>+</strong></button>
                      </div>
                    </div>   
  </td>
  <td class="align-middle">${article.unitCost} ${article.currency}</td>
  </tr>
  `;
    }

    document.getElementById("cartList").innerHTML = html;
}

function showTotal(array) {
    var subtotal = 0;
    var genCount = 0;

    for (i = 0; i < array.length; i++) {
        article = array[i];
        let counterID = "contador" + i;
        let counter = document.getElementById(counterID).value;

        genCount += parseInt(counter);

        if (article.currency == "UYU") {
            subtotal += article.unitCost * counter / 40;
        } else if (article.currency == "USD") {
            subtotal += article.unitCost * counter;
        }

    }
    var total = subtotal;

    if (shipping != 0) {
        total = subtotal + subtotal * shipping;
    }

    document.getElementById("cartCount").innerHTML = genCount;
    document.getElementById("envio").innerHTML = (subtotal * shipping).toFixed(2) + ` USD`
    document.getElementById("totalCost").innerHTML = total + ` USD`;
    document.getElementById("subtot").innerHTML = subtotal + ` USD`;
}

//función para chequear que la información de compra no esté vacía, para validarla.
function infoCheck(){
    let addrStreet = document.getElementById("dirCalle").value;
    let addrNum = document.getElementById("dirNum").value;
    let addrInt = document.getElementById("dirEsq").value;

    if(addrStreet != 0 && addrNum != 0 && addrInt != 0){
        alert("Por favor complete los datos de envío");
    }
}



//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            articles = resultObj.data.articles;
            showCart(articles);
            showTotal(articles);
        }
    });

    //cambios en el valor del shipping
    document.getElementById("tipoEnvio1").addEventListener("change", function () {
        shipping = 0.15;
        showTotal(articles);
    });

    document.getElementById("tipoEnvio2").addEventListener("change", function () {
        shipping = 0.07;
        showTotal(articles);
    });

    document.getElementById("tipoEnvio3").addEventListener("change", function () {
        shipping = 0.05;
        showTotal(articles);
    });
});

