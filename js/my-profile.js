//setear variables con los input.
var inputFirstName = document.getElementById("input-nombres"); 
var inputLastName = document.getElementById("input-apellidos");
var inputAge = document.getElementById("input-edad");
var inputPhone = document.getElementById("input-telefono");
var inputMail = document.getElementById("input-email");
var inputImg = document.getElementById("user-img-input");

var showImg = document.getElementById("user-img");
var imgNewUrl;
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
    newData.img = showImg.src;

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
const request = new XMLHttpRequest();
//intentando subir la imagen al servidor de imgBB
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload?key=5a578c1ecd8a2f86a6ecc589c8b47317';
inputImg.addEventListener('change', function(e){
    const imgUploaded = e.target.files[0];
    var form = new FormData();
    form.append("image", imgUploaded)
    console.log(form);
    // const res = axios.post(IMGBB_API_URL, form);
    //hacemos una request de tipo post al servidor de imgbb
    
    request.open("POST", IMGBB_API_URL);
    request.send(form);
    // .then( response=>response)
    // .then(datos=> { //obtenemos una nueva promesa, pero los datos ya están como json.
    //    console.log(datos) 
    // })
    // .catch( error => alert("Hubo un error: " + error));
    console.log(request);
    // var theURLwewant = request.getAllResponseHeaders();
    // console.log(request.readyState);
    // request.onreadystatechange = console.log(request.response);
    
    request.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(request.readyState === XMLHttpRequest.DONE) {
          var status = request.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
            resultObj = request.response;
            resultObj = JSON.parse(resultObj);
            
            imgNewUrl = resultObj.data.url;
            showImg.src = imgNewUrl;
          } else {
            // Oh no! There has been an error with the request!
          }
        }
      };
})

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    var profileData = localStorage.getItem("localProfileData");
    profileData = JSON.parse(profileData);
    
    
    if(profileData != null){
        document.getElementById("alerta-vacio").style.display = "none";

        console.log(profileData);
        inputFirstName.value = profileData.firstName;
        inputLastName.value = profileData.lastName;
        inputAge.value = profileData.age
        inputPhone.value = profileData.phone;
        inputMail.value =  profileData.mail;
        showImg.src = profileData.img;
    } else{
        document.getElementById("alerta-vacio").style.display = "block";
        showImg.src = "/img/user-empty.png";
    }
});