document.addEventListener('DOMContentLoaded', () => {
    const altoInput = document.getElementById('alto');
    const anchoInput = document.getElementById('ancho');
    const pliegueCheckbox = document.getElementById('pliegue');
    const indicadorCheckbox = document.getElementById('indicador');
    const totalParadasInput = document.getElementById('total-paradas');
    const subsueloInput = document.getElementById('subsuelo');
    const azoteaCheckbox = document.getElementById('azotea');
    const preview = document.getElementById('preview');
    const indicadorImg = document.getElementById('indicador-img');
    const buttonsContainer = document.getElementById('buttons-container');

    // Definir la altura estándar y el máximo de altura en píxeles en la pantalla
    const alturaEstandar = 2150; // mm
    const alturaMaxPantalla = 800; // px

    // Calcular el factor de escala para el alto
    const factorEscalaAlto = alturaMaxPantalla / alturaEstandar;

    // Definir el factor de escala adicional para el ancho
    const factorEscalaAncho = 1.2; // Ajustar este valor para hacer el ancho más grande

    function updatePreview() {
        const alto = parseFloat(altoInput.value) || 0;
        const ancho = parseFloat(anchoInput.value) || 0;
        const tienePliegue = pliegueCheckbox.checked;
        const tieneIndicador = indicadorCheckbox.checked;
        const totalParadas = parseInt(totalParadasInput.value) || 0;
        const subsuelos = parseInt(subsueloInput.value) || 0;
        const tieneAzotea = azoteaCheckbox.checked;

        let finalAlto = alto;
        let finalAncho = ancho;

        if (tienePliegue) {
            finalAncho += 20; // Añade 10 mm a cada lado
        }

        // Aplicar el factor de escala para el alto y el ancho
        const altoPixels = finalAlto * factorEscalaAlto;
        const anchoPixels = finalAncho * factorEscalaAlto * factorEscalaAncho;

        preview.style.width = `${anchoPixels}px`;
        preview.style.height = `${altoPixels}px`;

        // Mostrar/Ocultar líneas punteadas
        document.getElementById('line-izquierda').style.display = tienePliegue ? 'block' : 'none';
        document.getElementById('line-derecha').style.display = tienePliegue ? 'block' : 'none';

        // Mostrar/Ocultar imagen del indicador de piso
        indicadorImg.style.display = tieneIndicador ? 'block' : 'none';

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

        // Reemplazar el primer botón visible con "AZ" si se marca la casilla de azotea
        if (tieneAzotea && botones.length > 0) {
            botones[0] = 'AZ'; // Reemplaza el primer botón (el más alto) con "AZ"
        }

        // Crear botones y añadir al contenedor
        const col1Container = document.createElement('div');
        col1Container.className = 'button-column';
        const col2Container = document.createElement('div');
        col2Container.className = 'button-column';

        // Añadir botones de pisos (pares e impares)
        botones.forEach(button => {
            const btn = document.createElement('div');
            btn.className = 'button';
            btn.textContent = button;
            (parseInt(button) % 2 === 0 || button === '0') ? col1Container.appendChild(btn) : col2Container.appendChild(btn);
        });

        // Añadir botones de subsuelo (pares e impares)
        subsuelosPares.forEach(button => {
            const btn = document.createElement('div');
            btn.className = 'button';
            btn.textContent = button;
            col1Container.appendChild(btn);
        });

        subsuelosImpares.forEach(button => {
            const btn = document.createElement('div');
            btn.className = 'button';
            btn.textContent = button;
            col2Container.appendChild(btn);
        });

        // Añadir las columnas al contenedor de botones
        buttonsContainer.appendChild(col1Container);
        buttonsContainer.appendChild(col2Container);

        // Calcular la suma y determinar si es par o impar
        const suma = totalParadas + subsuelos;
        const esPar = suma % 2 === 0;

        // Ajustar el atributo align-items basado en la suma
        if (esPar) {
            buttonsContainer.style.alignItems = 'flex-start'; // Si la suma es par
        } else {
            buttonsContainer.style.alignItems = 'flex-end'; // Si la suma es impar
        }
    }

    altoInput.addEventListener('input', updatePreview);
    anchoInput.addEventListener('input', updatePreview);
    pliegueCheckbox.addEventListener('change', updatePreview);
    indicadorCheckbox.addEventListener('change', updatePreview);
    totalParadasInput.addEventListener('input', updatePreview);
    subsueloInput.addEventListener('input', updatePreview);
    azoteaCheckbox.addEventListener('change', updatePreview);
});
