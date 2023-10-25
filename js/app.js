const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let paginador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}


function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        mostrarAlerta('ingresa parametros');
    }

    buscarImagenes(terminoBusqueda);
}



function buscarImagenes(){
    const terminos = document.querySelector('#termino').value;

    const key = '40254485-f5b9db31f36a41872aa317d79';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminos}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url) 
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginacion(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        });
}


//generador que va a mostrar determinada cantidad de elementos segun las paginas
function *crearPaginador(total) {
    for(let i = 1; i <= total; i++) {
        yield i;
    }
}


function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //iterar el arreglo de imagenes e inyectarlas al dom
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}" />

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light">Me gusta</span> </p>
                        <p class="font-bold"> ${views} <span class="font-light">Vistas</span> </p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" 
                            target="_blank" 
                            rel="noopener noreferrer">

                            Ver imagen
                        </a>
                    </div>
                </div>
            </div>
        `;

    });

    //limpiar paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    //generamos el nuevo paginador
    imprimirPaginador();
}

function imprimirPaginador() {
    paginador = crearPaginador(totalPaginas);
    while(true) {
        const {value, done} = paginador.next();
        if(done) {
            return;
        }

        //si done es false, es decir
        //el generador sigue funcionando:
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pague = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');


        boton.onclick = function() {
            paginaActual = value;
            
            buscarImagenes()
        }


        paginacionDiv.appendChild(boton);
    }
}


function calcularPaginacion(total) {
    return parseInt( Math.ceil(total / registrosPorPagina));
}


function mostrarAlerta(mensaje) {
    const alertaPrevia = document.querySelector('.bg-red-100');
    if(!alertaPrevia) {
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rouded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}