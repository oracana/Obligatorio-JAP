//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});

function login(){ 
    var usuario=document.getElementById("user").value; 
    var password=document.getElementById("pass").value; 
    if (usuario=="" || password=="") { 
    alert("Por favor, ingrese un nombre de usuario y contraseña válidos."); 
    } else{
        location.href="home.html";
    }
    }; 