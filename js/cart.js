var shipping = 0;
var articles = [];
var success = "";

//genero un array con todos los span que se ingresan bajo los input (main), para la validacion
var mainValidationSpans = document.querySelectorAll(".validacion");

//idem para los span de los input en el modal
var creditCardValidationSpans = document.querySelectorAll(".validacionTarjeta");


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

//función para validar la compra.
function mainCheck() {
    let creditCardSelected = document.getElementById("formaDePago1").checked;
    let bankTransfSelected = document.getElementById("formaDePago2").checked;

    //chequeo de todos los spans con la clase "validacion", vinculados a los input de dirección de envío.
    //también se incluye la validación asociada a la selección de un método de pago
    for (let i = 0; i < mainValidationSpans.length; i++) {
        let element = mainValidationSpans[i];

        let inputID = document.getElementById(element.id + "-input");
        let inputIDValue = document.getElementById(element.id + "-input").value;
        let spanHTML = document.getElementById(element.id);

        if (inputIDValue == "" || inputIDValue == "País" || (creditCardSelected == false && bankTransfSelected == false)) {
            inputID.classList.remove("is-valid");
            inputID.classList.add("is-invalid");
            spanHTML.classList.add("invalido");
            spanHTML.innerHTML = `Debe ingresar ${element.id}`;
        } else {
            inputID.classList.remove("is-invalid");
            inputID.classList.add("is-valid");
            spanHTML.classList.remove("invalido");
            spanHTML.classList.add("valido");
        }
    }

    //chequeo de selección de un método de envío
    let shipping1Selected = document.querySelector("#tipoEnvio1").checked;
    let shipping2Selected = document.querySelector("#tipoEnvio2").checked;
    let shipping3Selected = document.querySelector("#tipoEnvio3").checked;
    if(shipping1Selected == false & shipping2Selected == false & shipping3Selected == false){
        document.getElementById("validacionEnvios").classList.remove("valido");
        document.getElementById("validacionEnvios").classList.add("invalido");
        document.getElementById("validacionEnvios").innerHTML = "Debe seleccionar un método de envío";
    } else{
        document.getElementById("validacionEnvios").classList.remove("invalido");
        document.getElementById("validacionEnvios").classList.add("valido");
    }
    
    //chequeo final: que los 7 span con clase "validacion" estén validados y que se haya seleccionado un método de envío.
    let mainValidatedSpans = document.querySelectorAll(".validacion.valido");
    if(mainValidatedSpans.length = 7  & (shipping1Selected || shipping2Selected || shipping3Selected)){
        //Sweet Alert
        Swal.fire({
            icon: 'success',
            title: 'Felicidades',
            text: success,
            showConfirmButton: false,
            footer: '<a href="home.html">Volver al inicio</a>',
          })
    }
}

//validación de la información del modal de pago
function cardCheck() {
    let creditCardSelected = document.getElementById("formaDePago1").checked;
    let bankTransfSelected = document.getElementById("formaDePago2").checked;

    //se separa en tres posibilidades: 
    //1. haber seleccionado la tarjeta de crédito -- si todos los campos se completaron, al guardar los datos se cierra el modal.
    //2. haber seleccionado la transferencia bancaria -- si se completa el número de cuenta, al guardar los datos se cierra el modal.
    //3. no haber seleccionado ningún método, ante lo cual se muestra un cartel requiriendo seleccionar uno.
    if (creditCardSelected) {
        document.getElementById("modal-de-pago").classList.remove("invalido");
        document.getElementById("modal-de-pago").classList.add("valido");
        
        for (let i = 0; i < creditCardValidationSpans.length; i++) {
            let element = creditCardValidationSpans[i];
            
            let inputID = document.getElementById(element.id + "-input");
            let inputIDValue = document.getElementById(element.id + "-input").value;
            let spanHTML = document.getElementById(element.id);
            
            if (inputIDValue == "") {
                inputID.classList.remove("is-valid");
                inputID.classList.add("is-invalid");
                spanHTML.classList.add("invalido");
                spanHTML.innerHTML = `Debe ingresar ${element.id}`;
            } else {
                inputID.classList.remove("is-invalid");
                inputID.classList.add("is-valid");
                spanHTML.classList.remove("invalido");
                spanHTML.classList.add("valido");
            }
        }
        
        let creditCardValidatedSpans = document.querySelectorAll(".validacionTarjeta.valido");
        if(creditCardValidatedSpans.length == 4){
            //método de bootstrap
            $('#modalPago').modal('hide');
        }
        
    } else if (bankTransfSelected) {
        let transfNumber = document.getElementById("cuenta-input");
        let transfNumberSpan = document.getElementById("cuenta");

        if(transfNumber.value == ""){
            transfNumber.classList.remove("is-valid");
            transfNumber.classList.add("is-invalid");
            transfNumberSpan.classList.add("invalido");
            transfNumberSpan.innerHTML = `Debe ingresar número de cuenta`;
        } else {
            transfNumber.classList.remove("is-invalid");
            transfNumber.classList.add("is-valid");
            transfNumberSpan.classList.remove("invalido");
            transfNumberSpan.classList.add("valido");
            //método de bootstrap
            $('#modalPago').modal('hide');
        }
        
    } else {
        document.getElementById("modal-de-pago").classList.remove("valido");
        document.getElementById("modal-de-pago").classList.add("invalido");
        document.getElementById("modal-de-pago").innerHTML = "Por favor seleccione un método de pago";
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
            document.getElementById("pais-input").innerHTML = countrySelect;
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
        document.getElementById("metodo-input").innerHTML = "Tarjeta de crédito";
    });
    document.getElementById("formaDePago2").addEventListener("click", function () {
        document.getElementById("metodo-input").innerHTML = "Transferencia bancaria";
    });

});

