// GENERAMOS VARIABLES
const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito');
const listaCarrito = document.getElementById('cart-list');
const elementoTotal = document.getElementById('total');
let total = 0;

// EVENTOS PARA LOS BOTONES DE AGREGAR AL CARRITO
botonesAgregarCarrito.forEach(function(boton) {
    boton.addEventListener('click', function(evento) {
        // EVITAMOS QUE LA PAGINA SE REFRESQUE AL HACER CLICK
        evento.preventDefault(); 
        // OBTENEMOS LOS DATOS DEL PRODUCTO CARGADOS EN EL HTML
        const nombre = boton.getAttribute('data-name');
        const precio = parseInt(boton.getAttribute('data-price'));
        // EJECUTAMOS LA FUNCION DE AGREGAR EL ITEM AL CARRITO
        agregarItemAlCarrito(nombre, precio);
        // USAMOS LIBRERIA TOASTIFY
        Toastify({
            text: `Se agregó "${nombre}" al carrito`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){}
        }).showToast();
    });
});

// FUNCIÓN DE AGREGAR ITEM AL CARRITO
function agregarItemAlCarrito(nombre, precio) {
    //OBTENEMOS EL PRODUCTO DEL LOCALSTORAGE O UN ARRAY VACIO EN SU DEFECTO
    let productos = JSON.parse(localStorage.getItem('cartProducts')) || [];
    // VEMOS SI EL PRODUCTO YA SE ENCUENTRA EN EL CARRITO
    let encontrado = false;
    for (let i = 0; i < productos.length; i++) {
        // SI YA TENEMOS EL PRODUCTO EN EL CARRITO AUMENTAMOS LA CANTIDAD
        if (productos[i].nombre === nombre) {
            productos[i].cantidad++;
            encontrado = true;
            break;
        }
    }
    // AÑADIMOS PRODUCTO AL CARRO SI NO ESTABA PREVIAMENTE EN ÉL
    if (!encontrado) {
        productos.push({ nombre, precio, cantidad: 1 });
    }
    // GUARDAMOS LOS ITEMS EN EL LOCALSTORAGE
    localStorage.setItem('cartProducts', JSON.stringify(productos)); 
    // EJECUTAMOS LA FUNCION QUE ACTUALIZA LA VISTA DEL CARRITO
    actualizarVistaCarrito(productos);
}

// FUNCIÓN PARA ACTUALIZAR LA VISTA DEL CARRITO
function actualizarVistaCarrito(productos) {
    listaCarrito.innerHTML = '';
    total = 0;
    productos.forEach(function(producto) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} - Cantidad: ${producto.cantidad}
            <button class="btn btn-sm btn-success btn-sumar" data-name="${producto.nombre}">+</button> <!-- Botón para sumar cantidad -->
            <button class="btn btn-sm btn-danger btn-restar" data-name="${producto.nombre}">-</button> <!-- Botón para restar cantidad -->
        `;
        listaCarrito.appendChild(li);
        total += producto.precio * producto.cantidad;
    });
    elementoTotal.textContent = total;
}

// EVENTO PARA LOS BOTONES DE AGREGAR Y QUITAR ITEMS DEL CARRITO
document.addEventListener('click', function(evento) {
    if (evento.target.classList.contains('btn-sumar')) {
        const nombreProducto = evento.target.getAttribute('data-name');
        // lLAMAMOS A LA FUNCION PARA SUMAR UN ITEM AL CARRITO
        sumarProducto(nombreProducto);
        Toastify({
            text: `Se aumentó la cantidad de "${nombreProducto}" en el carrito`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){}
        }).showToast();
    } else if (evento.target.classList.contains('btn-restar')) {
        const nombreProducto = evento.target.getAttribute('data-name');
        // LLAMAMOS A LA FUNCION PARA RESTAR UN ITEM AL CARRITO
        restarProducto(nombreProducto);
        Toastify({
            text: `Se redujo la cantidad de "${nombreProducto}" en el carrito`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true, 
            style: {
                background: "linear-gradient(to right, #9b0029, #c93d5e)",
            },
            onClick: function(){}
        }).showToast();
    }
});

// FUNCION PARA SUMAR UN ITEM
function sumarProducto(nombre) {
    let productos = JSON.parse(localStorage.getItem('cartProducts')) || [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === nombre) {
            productos[i].cantidad++;
            break;
        }
    }
    localStorage.setItem('cartProducts', JSON.stringify(productos));
    actualizarVistaCarrito(productos);
}

// FUNCION PARA RESTAR UN ITEM
function restarProducto(nombre) {
    let productos = JSON.parse(localStorage.getItem('cartProducts')) || [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === nombre) {
            if (productos[i].cantidad > 1) {
                productos[i].cantidad--;
            } else {
                productos.splice(i, 1);
            }
            break;
        }
    }
    localStorage.setItem('cartProducts', JSON.stringify(productos));
    actualizarVistaCarrito(productos);
}

// OBTENEMOS LOS PRODUCTOS QUE HAY ALMACENADOS EN EL STORAGE Y PINTAMOS EL CARRITO CADA VEZ QUE SE ACTUALIZA LA PAGINA
let productos = JSON.parse(localStorage.getItem('cartProducts')) || [];
actualizarVistaCarrito(productos);

// EVENTO AL BOTÓN COMPRAR UTILIZANDO LIBRERIA SWEET ALERT
const botonCompraFinal = document.getElementById("botmerch");
botonCompraFinal.addEventListener("click", ()=>{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Confirmación de compra",
        text: "Si selecciona COMPRAR, se ejecutará el pago automáticamente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "COMPRAR",
        cancelButtonText: "CANCELAR",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: "Compra realizada!",
                text: "Muchas gracias por su compra!",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "CANCELADA",
                text: "Tu compra fue cancelada con éxito",
                icon: "error"
            });
        }
    });
});