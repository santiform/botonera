document.addEventListener('DOMContentLoaded', () => {
    const altoInput = document.getElementById('alto');
    const anchoInput = document.getElementById('ancho');
    const pliegueCheckbox = document.getElementById('pliegue');
    const indicadorSelect = document.getElementById('indicador');
    const totalParadasInput = document.getElementById('total-paradas');
    const subsueloInput = document.getElementById('subsuelo');
    const azoteaCheckbox = document.getElementById('azotea');
    const preview = document.getElementById('preview');
    const indicadorImg = document.getElementById('indicador-img');
    const buttonsContainer = document.getElementById('buttons-container');

    const botonesSelect = document.getElementById('botones');
    const abrirCerrarSelect = document.getElementById('abrircerrar');

    const indicadorImg2 = document.getElementById('botones-especiales-img');
    const indicadorImg3 = document.getElementById('botones-especiales-img2');



    // Definir la altura estándar y el máximo de altura en píxeles en la pantalla
    const alturaEstandar = 2150; // mm
    const alturaMaxPantalla = 830; // px

    // Calcular el factor de escala para el alto
    const factorEscalaAlto = alturaMaxPantalla / alturaEstandar;

    // Definir el factor de escala adicional para el ancho
    const factorEscalaAncho = 1.4; // Ajustar este valor para hacer el ancho más grande

    function updatePreview() {
        const alto = parseFloat(altoInput.value) || 0;
        const ancho = parseFloat(anchoInput.value) || 0;
        const tienePliegue = pliegueCheckbox.checked;
        const indicadorValue = indicadorSelect.value;
        const totalParadas = parseInt(totalParadasInput.value) || 0;
        const subsuelos = parseInt(subsueloInput.value) || 0;
        const tieneAzotea = azoteaCheckbox.checked;
        const botonesEspecialesValue = botonesSelect.value;
        const abrirCerrarValue = abrirCerrarSelect.checked;

        let finalAlto = alto;
        let finalAncho = ancho;

        if (tienePliegue) {
            finalAncho += 8; // Añade 4 mm a cada lado
        }

        // Aplicar el factor de escala para el alto y el ancho
        const altoPixels = finalAlto * factorEscalaAlto;
        const anchoPixels = finalAncho * factorEscalaAlto * factorEscalaAncho;

        preview.style.width = `${anchoPixels}px`;
        preview.style.height = `${altoPixels}px`;

        // Mostrar/Ocultar líneas punteadas
        document.getElementById('line-izquierda').style.display = tienePliegue ? 'block' : 'none';
        document.getElementById('line-derecha').style.display = tienePliegue ? 'block' : 'none';

        let lineDerecha = document.getElementById('line-derecha-extra');
        let lineAbajo = document.getElementById('line-abajo-extra');

        if (!lineDerecha) {
            lineDerecha = document.createElement('div');
            lineDerecha.id = 'line-derecha-extra';
            document.body.appendChild(lineDerecha);
        }

        if (!lineAbajo) {
            lineAbajo = document.createElement('div');
            lineAbajo.id = 'line-abajo-extra';
            document.body.appendChild(lineAbajo);
        }


          // Estilo de las líneas
        const lineStyle =
        'position: absolute; background-color: black;';
        lineDerecha.style.cssText = `${lineStyle} width: 1px; height: ${altoPixels}px; top: ${preview.offsetTop}px;
        left:${preview.offsetLeft + anchoPixels + 12}px;`;
        lineAbajo.style.cssText = `${lineStyle} height: 1px; width: ${anchoPixels}px;
        top: ${preview.offsetTop + altoPixels + 12}px; left: ${preview.offsetLeft}px;`;



        // Ajustar la imagen del indicador según la selección
        if (indicadorValue === '5') {
            indicadorImg.style.display = 'block';
            indicadorImg.style.width = '60px'; // Tamaño para 5"
        } else if (indicadorValue === '10') {
            indicadorImg.style.display = 'block';
            indicadorImg.style.width = '80px'; // Tamaño para 10"
        } else {
            indicadorImg.style.display = 'none';
        }

        document.getElementById('abrir-cerrar-img').style.display = abrirCerrarValue ? 'block' : 'none';


        if (botonesEspecialesValue === '3') {
            indicadorImg3.style.display = 'none';
            indicadorImg2.style.display = 'block';
            indicadorImg2.style.width = '60px';
        }  else if (botonesEspecialesValue === '4') { // Arreglar el nombre de la variable
                indicadorImg2.style.display = 'none';
                indicadorImg3.style.display = 'block';
                indicadorImg3.style.width = '60px';
        } else {
            indicadorImg2.style.display = 'none';
            indicadorImg3.style.display = 'none';
        }


        // Actualizar etiquetas de dimensiones
        document.getElementById('dim-alto').textContent = `${alto} mm`;
        document.getElementById('dim-ancho').textContent = `${ancho} mm`;

        // Generar los botones para las paradas
        buttonsContainer.innerHTML = '';

        // Número total de botones visibles
        const botonesVisibles = totalParadas - subsuelos - 1; // Restar subsuelos

        // Botones para pisos positivos (de mayor a menor)
        const botones = [];
        for (let i = botonesVisibles - 1; i >= 0; i--) {
            botones.push(i + 1); // Añadir números de pisos
        }

        // Botón Planta Baja (PB)
        if (totalParadas > 0) {
            botones.push('0');
        }

        // Botones de subsuelo en orden ascendente (de menor a mayor)
        const subsuelosPares = [];
        const subsuelosImpares = [];

        for (let i = 1; i <= subsuelos; i++) {
            const subsueloLabel = `-${i}`;
            if (i % 2 === 0) {
                subsuelosPares.push(subsueloLabel);
            } else {
                subsuelosImpares.push(subsueloLabel);
            }
        }

        // Calcular la suma y determinar si es par o impar
        const suma = totalParadas + subsuelos;
        const esPar = suma % 2 === 0;

        if (tieneAzotea && botones.length > 0) {
            if (esPar) {
                botones[0] = 'AZ'; // Si es par, reemplaza el primer botón con "AZ"
            }
        }




        





         // Crear columnas
        if (totalParadas <= 6) {
            // Crear una sola columna centrada
            const col1Container = document.createElement('div');
            col1Container.className = 'button-column single-column'; // Clase para columna única
            col1Container.style.margin = '0 auto'; // Centrar la columna

            // Añadir botones de pisos y subsuelos
            botones.forEach(button => {
                col1Container.appendChild(createButtonElement(button));
            });

            subsuelosPares.forEach(button => {
                col1Container.appendChild(createButtonElement(button));
            });

            subsuelosImpares.forEach(button => {
                col1Container.appendChild(createButtonElement(button));
            });

            // Añadir la columna al contenedor de botones
            buttonsContainer.appendChild(col1Container);
        } else {



                // Crear botones y añadir al contenedor
                const col1Container = document.createElement('div');
                col1Container.className = 'button-column';
                const col2Container = document.createElement('div');
                col2Container.className = 'button-column';

                // Añadir botones de pisos (pares e impares)
                botones.forEach(button => {
                    const btn = createButtonElement(button);
                    (parseInt(button) % 2 === 0 || button === '0') ? col1Container.appendChild(btn) : col2Container.appendChild(btn);
                });

                // Añadir botones de subsuelo (pares e impares)
                subsuelosPares.forEach(button => {
                    col1Container.appendChild(createButtonElement(button));
                });

                subsuelosImpares.forEach(button => {
                    col2Container.appendChild(createButtonElement(button));
                });


                // Condición adicional: agregar un botón transparente si total de paradas es IMPAR y la suma es IMPAR
                if ((totalParadas % 2 !== 0 && suma % 2 !== 0)) {
                    const transparentButton = createButtonElement('');
                    transparentButton.style.backgroundColor = 'transparent'; // Hacer el fondo del botón transparente
                    transparentButton.style.border = '1px solid transparent'; // Aplicar un borde transparente

                    // Insertar el botón al principio del contenedor
                    col2Container.appendChild(transparentButton, col2Container.firstChild);

                    // Intercambiar el contenido de las columnas
                    const tempContainer = document.createElement('div');
                    tempContainer.style.display = 'none'; // Ocultar el contenedor temporal

                    // Mover el contenido de col1Container a tempContainer
                    while (col1Container.firstChild) {
                        tempContainer.appendChild(col1Container.firstChild);
                    }

                    // Mover el contenido de col2Container a col1Container
                    while (col2Container.firstChild) {
                        col1Container.appendChild(col2Container.firstChild);
                    }

                    // Mover el contenido de tempContainer a col2Container
                    while (tempContainer.firstChild) {
                        col2Container.appendChild(tempContainer.firstChild);
                    }

                }



                // Condición adicional: agregar un botón transparente si total de paradas es PAR y la suma es IMPAR
                if ((totalParadas % 2 === 0 && suma % 2 !== 0)) {

                    // Intercambiar el contenido de las columnas
                    const tempContainer = document.createElement('div');
                    tempContainer.style.display = 'none'; // Ocultar el contenedor temporal

                    // Mover el contenido de col1Container a tempContainer
                    while (col1Container.firstChild) {
                        tempContainer.appendChild(col1Container.firstChild);
                    }

                    // Mover el contenido de col2Container a col1Container
                    while (col2Container.firstChild) {
                        col1Container.appendChild(col2Container.firstChild);
                    }

                    // Mover el contenido de tempContainer a col2Container
                    while (tempContainer.firstChild) {
                        col2Container.appendChild(tempContainer.firstChild);
                    }
                }




                // Condición adicional: agregar un botón transparente si total de paradas es IMPAR y la suma es PAR
                if (totalParadas % 2 !== 0 && suma % 2 === 0 ) {
                    const transparentButton = createButtonElement('');
                    transparentButton.style.backgroundColor = 'transparent'; // Hacer el fondo del botón transparente
                    transparentButton.style.border = '1px solid transparent'; // Aplicar un borde transparente
                    col2Container.appendChild(transparentButton); // Añadir al final


                }


                

                // Añadir las columnas al contenedor de botones
                buttonsContainer.appendChild(col1Container);
                buttonsContainer.appendChild(col2Container);

                // Reemplazar el primer botón visible con "AZ" si se marca la casilla de azotea
                if (tieneAzotea && botones.length > 0) {
                    if (esPar) {
                        botones[0] = 'AZ'; // Si es par, reemplaza el primer botón con "AZ"
                    } else {
                        // Si es impar, reemplaza el primer botón en la columna izquierda con "AZ"
                        const firstButtonInLeftColumn = col2Container.querySelector('.button');
                        if (firstButtonInLeftColumn) {
                            firstButtonInLeftColumn.textContent = 'AZ';
                        }
                    }
                }

                // Ajustar el atributo align-items basado en la suma y las nuevas condiciones
                if (totalParadas % 2 === 0) {
                    // Si total de paradas es PAR
                    buttonsContainer.style.alignItems = 'flex-start';
                } else {
                    // Mantener la lógica original si no se cumple la condición adicional
                    buttonsContainer.style.alignItems = esPar ? 'flex-start' : 'flex-start';
                }
            }        

    }

    function createButtonElement(text) {
        const btn = document.createElement('div');
        btn.className = 'button';
        btn.textContent = text;
        return btn;
    }

    



        // Evento para actualizar la vista previa cada vez que se cambian los valores
    [altoInput, anchoInput, pliegueCheckbox, indicadorSelect, totalParadasInput, subsueloInput,
        azoteaCheckbox, botonesSelect, abrirCerrarSelect].forEach(element => {
        element.addEventListener('input', updatePreview);
    });

    // Inicializar la vista previa al cargar la página
    updatePreview();
});





document.getElementById('total-paradas').addEventListener('input', function() {
    const value = this.value; // Obtener el valor ingresado por el usuario
    const buttonsContainer = document.getElementById('buttons-container');

    // Aplicar la transformación según el valor ingresado
    if (value > 20) {
        buttonsContainer.style.transform = 'translate(-50%, -70%)';
    } else if (value > 10 && value <= 20) {
        buttonsContainer.style.transform = 'translate(-50%, -80%)';
    } else {
        buttonsContainer.style.transform = 'translate(-50%, -90%)';
    }
});





document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');

    inputs.forEach(input => {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);

        input.addEventListener('blur', () => {
            let value = parseFloat(input.value);

            // Ajustar al mínimo si el valor es menor
            if (value < min) {
                input.value = min;
            }
            // Ajustar al máximo si el valor es mayor
            else if (value > max) {
                input.value = max;
            }
        });
    });
});








// También puedes validar al enviar el formulario o en otros eventos relevantes
document.querySelector('form').addEventListener('submit', function(event) {
    validarRango({target: document.getElementById('alto')});
    validarRango({target: document.getElementById('ancho')});
    validarRango({target: document.getElementById('total-paradas')});
    validarRango({target: document.getElementById('subsuelo')});
});
