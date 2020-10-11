var shipping = 0;
var articles = [];

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

function showTotal(array) {
    var subtotal = 0;
    var genCount = 0;
    var partialSubtotal = 0;
    var currencySelected = document.getElementById("moneda").value;

    for (i = 0; i < array.length; i++) {
        article = array[i];
        let counter = document.getElementById("contador" + i).value;
        genCount += parseInt(counter);

        if (currencySelected == "dolares") {
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

    document.getElementById("cartCount").innerHTML = genCount;

    if (currencySelected == "dolares") {
        document.getElementById("envio").innerHTML = (subtotal * shipping).toFixed(2) + ` USD`;
        document.getElementById("totalCost").innerHTML = (total).toFixed(2) + ` USD`;
        document.getElementById("subtot").innerHTML = (subtotal).toFixed(2) + ` USD`;
    } else {
        document.getElementById("envio").innerHTML = (subtotal * shipping).toFixed(2) + ` UYU`;
        document.getElementById("totalCost").innerHTML = (total).toFixed(2) + ` UYU`;
        document.getElementById("subtot").innerHTML = (subtotal).toFixed(2) + ` UYU`;
    }

}

//función para chequear que la información de compra no esté vacía, para validarla.
function infoCheck() {
    let addrStreet = document.getElementById("dirCalle").value;
    let addrNum = document.getElementById("dirNum").value;
    let addrInt = document.getElementById("dirEsq").value;

    if (addrStreet != 0 && addrNum != 0 && addrInt != 0) {
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

    document.getElementById("moneda").addEventListener("change", function () {
        showTotal(articles);
    });
});

