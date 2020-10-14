var shipping = 0;
var articles = [];
var success = "";
var cartQuantity = 0;

//función para mostrar los elementos del carrito
function showCart(array) {
    let html = ``;

    if (array.length == 0) {
        html = `
        <tr>
            <td class="align-middle align-center" colspan="6" style="text-align:center;"><p class="align-middle alert-warning py-3 mt-3">El carrito está vacío</p></td>
        </tr>
        `;
    } else {
        for (i = 0; i < array.length; i++) {
            article = array[i];

            html += `
        <tr>
        <th class="align-middle align-center" scope="row"><img style='max-height:7em;' src='${article.src}' alt='${article.src}' class="img-thumbnail"></th>
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
  <td class="align-middle" id="partialSub${i}"></td>
  <td class="align-middle"><i class="far fa-trash-alt trash" onclick="articles.splice(${i},1); showCart(articles); showTotal(articles)"></i></td>
  </tr>
  `;
        }
    }
    document.getElementById("cartList").innerHTML = html;
}

//mostrando los totales
function showTotal(array) {
    var genCount = 0;
    var partialSubtotal = 0; //partialSubtotal solo toma el precio y la cantidad de cada artículo
    var subtotal = 0;
    var currencySelected = document.getElementById("moneda").value;

    for (i = 0; i < array.length; i++) {
        article = array[i];
        let counter = document.getElementById("contador" + i).value;
        genCount += parseInt(counter);

        //agrego un condicional para calcular los totales dependiendo de la moneda seleccionada
        if (currencySelected == "USD") {
            if (article.currency == "UYU") {
                partialSubtotal = article.unitCost * counter / 40;
            } else if (article.currency == "USD") {
                partialSubtotal = article.unitCost * counter;
            }
        } else {
            if (article.currency == "UYU") {
                partialSubtotal = article.unitCost * counter;
            } else if (article.currency == "USD") {
                partialSubtotal = article.unitCost * counter * 40;
            }
        }
        subtotal += partialSubtotal;

        document.getElementById("partialSub" + i).innerHTML = article.unitCost * counter + " " + article.currency;
    }

    var total = subtotal;

    if (shipping != 0) {
        total = subtotal + subtotal * shipping;
    }

    //elementos para el badge
    localStorage.setItem("cartQuantity", genCount);
    document.getElementById("cantidadArticulos").innerHTML = genCount;

    document.getElementById("cartCount").innerHTML = genCount;
    document.getElementById("envio").innerHTML = (subtotal * shipping).toFixed(2) + " " + currencySelected;
    document.getElementById("totalCost").innerHTML = (total).toFixed(2) + " " + currencySelected;
    document.getElementById("subtot").innerHTML = (subtotal).toFixed(2) + " " + currencySelected;


}

//función para chequear que la información de compra no esté vacía, para validarla. Aún no está en uso
function infoCheck() {
    let addrStreet = document.getElementById("dirCalle").value;
    let addrNum = document.getElementById("dirNum").value;
    let addrInt = document.getElementById("dirEsq").value;

    let cardName = document.getElementById("titularTarjeta").value;
    let cardNumber = document.getElementById("numeroTarjeta").value;
    let cardExpiration = document.getElementById("vencTarjeta").value;
    let cardCVV = document.getElementById("cvvTarjeta").value;

    let transfNumber = document.getElementById("transferCuenta").value; 

    if(addrStreet != "" && addrNum != "" && addrInt != "" && (transfNumber != "" || cardName != "" && cardNumber != "" && cardExpiration != "" && cardCVV != "")) {
        alert(success);
    } else if (addrStreet == "" && addrNum == "" && addrInt == "") {
        alert("Por favor complete los datos de envío");
    } else if(transfNumber == "" || cardName == "" && cardNumber == "" && cardExpiration == "" && cardCVV == ""){
        alert("Por favor complete la información de pago");
    } 
}

// function cardCheck(){
//     let cardName = document.getElementById("titularTarjeta").value;
//     let cardNumber = document.getElementById("numeroTarjeta").value;
//     let cardExpiration = document.getElementById("vencTarjeta").value;
//     let cardCVV = document.getElementById("cvvTarjeta").value;

//     let transfNumber = document.getElementById("transferCuenta").value; 

//     if(transfNumber == "" || cardName == "" && cardNumber == "" && cardExpiration == "" && cardCVV == ""){
//         alert("Por favor complete la información de pago");
//     } 
// }



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

    getJSONData(COUNTRIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            let countries = resultObj.data;
            var countrySelect = `<option>País</option>`;
            for (let country of countries) {
                countrySelect += `
                <option>${country.name}</option>
                `
            }
            document.getElementById("paises").innerHTML = countrySelect;
        }
    });

    //cargar el mensaje de compra exitosa
    getJSONData(CART_BUY_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            success = resultObj.data.msg;
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

    //evento para la selección de la moneda
    document.getElementById("moneda").addEventListener("change", function () {
        showTotal(articles);
    });
    
    //seleccion de metodo de pago
    document.getElementById("formaDePago1").addEventListener("click", function () {
        document.getElementById("formaPago").innerHTML = "Tarjeta de crédito";
    });
    document.getElementById("formaDePago2").addEventListener("click", function () {
        document.getElementById("formaPago").innerHTML = "Transferencia bancaria";
    });
    
});

