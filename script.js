async function notificar() {
    const selectMenu = document.getElementById('asesores');
    //Obtener la opción que el usuario seleccionó 
    const opcionSeleccionada = selectMenu.options[selectMenu.selectedIndex];
    
    //Extraer correos de esa opción
    const emailAsesor = opcionSeleccionada.value;
    const emailAsistente = opcionSeleccionada.dataset.emailAsistente; 
    const nombreCliente = document.getElementById('nombreCliente').value;
    const nombreAsesor = opcionSeleccionada.textContent;

    // Limpia el campo de texto del nombre del cliente.
    document.getElementById('nombreCliente').value = ''; 
    // Reinicia el menú de selección a la primera opción ("-- Seleccione su asesor --").
    document.getElementById('asesores').selectedIndex = 0; 


    // Alerta de validación si faltan datos
    if (!emailAsesor || !nombreCliente) {
        Swal.fire({
            title: 'Datos Incompletos',
            text: 'Por favor, ingrese su nombre y seleccione un asesor.',
            icon: 'warning',
            confirmButtonColor: '#0078d4'
        });
        return;
    }

    
    // Alerta de "Cargando" mientras se envía la notificación
    Swal.fire({
        title: 'Notificando...',
        text: 'Por favor espere.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const urlPowerAutomate = 'https://42ce45ff7a7641abb39be7d135449e.ef.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/eb311d5bb18b46c8b695005faff67835/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wBs-6l6h3bmA0i7au4utdMRWlwGrQbh2f7EC5jTPC8g'; // URL DE POWER AUTOMATE DEL BOT

    try {
        const response = await fetch(urlPowerAutomate, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Enviar correos a Power Automate ---
            body: JSON.stringify({
                emailAsesor: emailAsesor,
                CorreoAsistente: emailAsistente,
                nombreCliente: nombreCliente,
                nombreAsesor: nombreAsesor
            })
        });

        if (response.ok) {
            // Alerta de éxito
            Swal.fire({
                title: '¡Notificación Enviada!',
                text: 'Hemos notificado a su asesor. Por favor, tome asiento.',
                icon: 'success',
                draggable: true,
                confirmButtonColor: '#0078d4'
            });
        } else {
            // Alerta de error si Power Automate responde con un problema
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un problema al notificar al asesor.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        // Alerta de error de conexión
        Swal.fire({
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el sistema. Error técnico.',
            icon: 'error',
            confirmButtonColor: '#d33'
        });
    }
}



async function cargarAsesores() {
    const urlFlujoLector = 'https://42ce45ff7a7641abb39be7d135449e.ef.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/eeb9da8c525e4eb998d2b41b727f8ec9/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7tuiqdnAzHTdyRbPDi9jqbe3fM5Anq25YoHbnIdl0pU'; // URL DEL FLUJO LECTOR DE SHAREPOINT

    try {
        const response = await fetch(urlFlujoLector);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Error al cargar los asesores desde SharePoint.", {
                status: response.status,
                statusText: response.statusText,
                body: errorBody
            });
            Swal.fire({
                icon: 'error',
                title: `Error ${response.status}`,
                text: 'No se pudieron cargar los datos de los asesores. Avise a soporte técnico.'
            });
            return;
        }
        
        const asesores = await response.json();

        
        const selectMenu = document.getElementById('asesores');

        asesores.forEach(asesor => {
            const opcion = document.createElement('option');
            opcion.value = asesor.field_2; 
            opcion.textContent = asesor.Title; 
            opcion.dataset.emailAsistente = asesor.CorreoAsistente
            selectMenu.appendChild(opcion);
        });


    } catch (error) {
        console.error("Error de conexión al cargar asesores:", error);
    }
}
cargarAsesores();



