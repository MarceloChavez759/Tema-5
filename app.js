// 3. Inicializar datos desde localStorage
let eventos = JSON.parse(localStorage.getItem("agenda_eventos")) || [];
let editando = false;

const form = document.getElementById("form-evento");
const contenedor = document.getElementById("contenedor-eventos");

document.addEventListener("DOMContentLoaded", () => {
    mostrarEventos(eventos);
});

// 2. Funcionalidad Crear y Editar
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("event-id").value;
    const titulo = document.getElementById("titulo").value;
    const fecha = document.getElementById("fecha").value;
    const descripcion = document.getElementById("descripcion").value;

    if (editando) {
        // Editar: Buscamos el índice y reemplazamos
        const index = eventos.findIndex(ev => ev.id == id);
        eventos[index] = { id: parseInt(id), titulo, fecha, descripcion };
        editando = false;
    } else {
        // Crear: Nuevo objeto
        const nuevoEvento = {
            id: Date.now(), // ID único basado en tiempo
            titulo,
            fecha,
            descripcion
        };
        // Requerimiento: eventos.push()
        eventos.push(nuevoEvento);
    }

    guardarYRefrescar();
    resetearFormulario();
});

// 2. Mostrar datos dinámicamente
function mostrarEventos(datos) {
    contenedor.innerHTML = "";
    
    if (datos.length === 0) {
        contenedor.innerHTML = "<p>No hay eventos registrados.</p>";
        return;
    }

    // Ordenar por fecha antes de mostrar
    datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    datos.forEach(ev => {
        const div = document.createElement("div");
        div.className = "event-card";
        div.innerHTML = `
            <h4>${ev.titulo}</h4>
            <small>📅 ${ev.fecha}</small>
            <p>${ev.descripcion}</p>
            <div class="actions">
                <button class="btn-edit" onclick="cargarEdicion(${ev.id})">Editar</button>
                <button class="btn-delete" onclick="eliminarEvento(${ev.id})">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// 2. Eliminar: Requerimiento filter()
function eliminarEvento(id) {
    if (confirm("¿Seguro que deseas eliminar este evento?")) {
        eventos = eventos.filter(ev => ev.id !== id);
        guardarYRefrescar();
    }
}

// 2. Editar: Reutilizar formulario
function cargarEdicion(id) {
    const ev = eventos.find(e => e.id === id);
    document.getElementById("event-id").value = ev.id;
    document.getElementById("titulo").value = ev.titulo;
    document.getElementById("fecha").value = ev.fecha;
    document.getElementById("descripcion").value = ev.descripcion;

    document.getElementById("form-title").innerText = "Editando Evento";
    document.getElementById("btn-guardar").innerText = "Actualizar Cambios";
    document.getElementById("btn-cancelar").classList.remove("hidden");
    editando = true;
    window.scrollTo(0, 0);
}

// 4. Filtros por fechas (Desde - Hasta)
function filtrarEventos() {
    const desde = document.getElementById("filter-desde").value;
    const hasta = document.getElementById("filter-hasta").value;

    // Validación básica
    if (!desde || !hasta) {
        alert("Por favor selecciona ambas fechas para filtrar.");
        return;
    }

    if (new Date(desde) > new Date(hasta)) {
        alert("La fecha 'Desde' no puede ser mayor a 'Hasta'.");
        return;
    }

    const filtrados = eventos.filter(ev => {
        return ev.fecha >= desde && ev.fecha <= hasta;
    });

    mostrarEventos(filtrados);
}

function limpiarFiltros() {
    document.getElementById("filter-desde").value = "";
    document.getElementById("filter-hasta").value = "";
    mostrarEventos(eventos);
}

// 3. Guardar en localStorage
function guardarYRefrescar() {
    localStorage.setItem("agenda_eventos", JSON.stringify(eventos));
    mostrarEventos(eventos);
}

function resetearFormulario() {
    form.reset();
    document.getElementById("form-title").innerText = "Nuevo Evento";
    document.getElementById("btn-guardar").innerText = "Guardar Evento";
    document.getElementById("btn-cancelar").classList.add("hidden");
    editando = false;
}

// 5. Exportar PDF
function exportarPDF() {
    window.print();
}