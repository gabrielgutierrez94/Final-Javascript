// VARIABLES DOM
const botonIniciar = document.getElementById("login-button");
const contenedor = document.getElementById("contenedor");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// FUNCION PARA PINTAR HTML Y CERRAR SESIÓN
const miCuenta = (usuario) => {
    contenedor.innerHTML = `<h1>Bienvenido/a, ${usuario}!</h1><button class="login-button" id="close">Cerrar Sesión</button>`;
    const cerrarSesion = document.getElementById("close")
    cerrarSesion.addEventListener("click", () => {
        localStorage.clear();
    });
};

// VERIFICAMOS SI YA EXISTE UN LOGEO
const isLog = JSON.parse(localStorage.getItem("isLog")) || {};
isLog.usuario && miCuenta(isLog.usuario);

// EVENTO PARA EL BOTÓN DE INICIO DE SESION
botonIniciar.addEventListener("click", () => {
    //SACAMOS EL REFRESCO AUTOMÁTICO AL DAR CLICK AL BOTÓN Y GENERAMOS VARIABLES
    event.preventDefault();
    const usuario = usernameInput.value;
    const contraseña = passwordInput.value;
    // APLICAMOS FETCH CON LA BASE DE DATOS SIMULADA EN JSON
    fetch('../json/usuarios.json')
        .then(respuesta => respuesta.json())
        .then(data => {
            // VERIFICAMOS LAS CREDENCIALES
            const Existe = data.find((miembro) => {
                return miembro.usuario === usuario && miembro.contraseña === contraseña;
            });
            if (Existe) {
                localStorage.setItem("isLog", JSON.stringify({ usuario: usuario }));
                miCuenta(usuario);
            } else {
                contenedor.innerHTML = '<h1>Usuario no encontrado</h1><button class="login-button">Volver a Login</button>';
                Swal.fire({
                    icon: "error",
                    title: "Algo salió mal!",
                    text: "Si ya tienes una cuenta, por favor escribe los datos correctamente",
                    footer: '<a href="../index.html">Volver a la página de inicio'
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});