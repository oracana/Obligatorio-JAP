//setear variables con los input.
var inputFirstName = document.getElementById("input-nombres"); 
var inputLastName = document.getElementById("input-apellidos");
var inputAge = document.getElementById("input-edad");
var inputPhone = document.getElementById("input-telefono");
var inputMail = document.getElementById("input-email");

//tambien quiero poner en una variable a los botones que van a tener funcionalidad
var saveBtn = document.getElementById("boton-principal");
var cancelBtn = document.getElementById("boton-cancelar");
var newData = {};


function saveData(){
    newData.firstName = inputFirstName.value;
    newData.lastName = inputLastName.value;
    newData.age = inputAge.value;
    newData.phone = inputPhone.value;
    newData.mail = inputMail.value;

    console.log(newData);
    localStorage.setItem("localProfileData", JSON.stringify(newData));
}

function cancel(){
    inputFirstName.value == "";
    inputLastName.value == "";
    inputAge.value == "";
    inputPhone.value == "";
    inputMail.value == "";
}

saveBtn.addEventListener("click", saveData);
cancelBtn.addEventListener("click", function(){
    cancel();
    location.href = "/my-profile.html";
});

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    var profileData = localStorage.getItem("localProfileData");
    profileData = JSON.parse(profileData);
    
    
    if(profileData != "undefined"){
        document.getElementById("alerta-vacio").style.display = "none";

        console.log(profileData);
        inputFirstName.value = profileData.firstName;
        inputLastName.value = profileData.lastName;
        inputAge.value = profileData.age
        inputPhone.value = profileData.phone;
         inputMail.value =  profileData.mail;
    } else{
        document.getElementById("alerta-vacio").style.display = "block";
    }
});