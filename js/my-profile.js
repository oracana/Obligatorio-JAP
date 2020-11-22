//setear variables con los input.
var inputFirstName = document.getElementById("input-nombres"); 
var inputLastName = document.getElementById("input-apellidos");
var inputAge = document.getElementById("input-edad");
var inputPhone = document.getElementById("input-telefono");
var inputMail = document.getElementById("input-email");
var inputImg = document.getElementById("user-img-input");

var showImg = document.getElementById("user-img");
var imgNewUrl;
var fullImage;
//tambien quiero poner en una variable a los botones que van a tener funcionalidad
var saveBtn = document.getElementById("boton-principal");
var eraseBtn = document.getElementById("boton-borrar");
var newData = {};


function saveData(){
    newData.firstName = inputFirstName.value;
    newData.lastName = inputLastName.value;
    newData.age = inputAge.value;
    newData.phone = inputPhone.value;
    newData.mail = inputMail.value;
    newData.img = showImg.src;
    newData.img64 = fullImage;

    localStorage.setItem("localProfileData", JSON.stringify(newData));
}

function erase(){
    showImg.src = "img/user-empty.png";
    localStorage.removeItem("localProfileData");
}

saveBtn.addEventListener("click", function(){
  saveData();
  
  Swal.fire({
    position: 'top',
    icon: 'success',
    title: 'Tus datos han sido guardados con éxito',
    showConfirmButton: false,
    timer: 1500
  })

  setTimeout(function(){location.href = "my-profile.html"}, 1500);
});

eraseBtn.addEventListener("click", function(){
    erase();
    location.href = "my-profile.html";
});

//intentando subir la imagen al servidor de imgBB
inputImg.addEventListener('change', function(e){
    //esta es la url a la que enviaremos la imagen
    const IMGBB_API_URL = 'https://api.imgbb.com/1/upload?key=5a578c1ecd8a2f86a6ecc589c8b47317';
    //y una variable con el contenido de la imagen subida al input type file.
    const imgUploaded = e.target.files[0];
    //tambien generamos una nueva XMLHttpRequest. esto es porque vamos a estar llamando a esta request en repetidas ocasiones.
    const request = new XMLHttpRequest();
    
    //variable de tipo formData para enviar la request con la imagen para subir a nuestro servidor externo.
    var form = new FormData();
    form.append("image", imgUploaded)
    

    //estas dos líneas definen nuestro pedido de subida de información. primero aclaramos el método y la url destino
    //después el contenido. Esto es en el mismo orden en el que se aclara en la página de imgbb.
    request.open("POST", IMGBB_API_URL);
    request.send(form);
    
    //lo que sigue nos permite trabajar con la respuesta del servidor.    
    request.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(request.readyState === XMLHttpRequest.DONE) {
          var status = request.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            // luego de obtener una respuesta exitosa, parseamos la información de la respuesta y tomamos la url de la imagen ya pública.
            resultObj = request.response;
            resultObj = JSON.parse(resultObj);

            imgNewUrl = resultObj.data.url;
            //ya que estamos, en la misma función podemos mostrar la imagen.
            showImg.src = imgNewUrl;

              //extra, para conseguir esta imagen codificada en base 64
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                // Set width and height
                canvas.width = showImg.width;
                canvas.height = showImg.height;
                // Draw the image
                ctx.drawImage(showImg, 0, 0, showImg.width, showImg.height);
                let dataUrl = canvas.toDataURL('image/png');
                
                fullImage = dataUrl;
              //

          } else {
            console.log('Oh no! There has been an error with the request!');
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

        inputFirstName.value = profileData.firstName;
        inputLastName.value = profileData.lastName;
        inputAge.value = profileData.age
        inputPhone.value = profileData.phone;
        inputMail.value =  profileData.mail;
        showImg.src = profileData.img;
        //tambien se puede cargar la imagen codificada (img64). el problema es que es restrictivo al formato determinado.
        //en este caso el formato es png. Funciona. Dejo el código comentado a continuación para hacer la prueba:
        //showImg.src = profileData.img64;
    } else{
        document.getElementById("alerta-vacio").style.display = "block";
        showImg.src = "img/user-empty.png";
    }
});