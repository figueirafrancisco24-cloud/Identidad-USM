// ============ DATOS DE PRODUCTOS CON IMÁGENES REALES ============
const productosIdentidad = [
    {
        id: 'camisa-1',
        nombre: 'Camisa USM Clásica',
        facultad: 'Identidad USM',
        descripcion: 'Camisa de algodón peinado con logo bordado en el pecho. Diseño limpio y elegante.',
        precio: 18,
        // Imagen 9 de tu lista (camisa blanca con logo)
        imgFrente: 'img/camisa-1-frente.png', 
        imgEspalda: 'img/camisa-1-frente.png', // Usamos la misma porque no enviaste la parte de atrás de esta
        tallas: ['XS','S','M','L','XL','XXL','XXXL']
    },
    {
        id: 'camisa-2',
        nombre: 'Camisa Edición Banderas',
        facultad: 'Estudios Internacionales',
        descripcion: 'Camisa edición especial con diseño de banderas mundiales. Perfecta para eventos y graduaciones.',
        precio: 18,
        // Imagen 8 de tu lista
        imgFrente: 'img/camisa-2-espalda.png',
        imgEspalda: 'img/camisa-2-espalda.png',
        tallas: ['XS','S','M','L','XL','XXL','XXXL']
    },
    {
        id: 'camisa-3',
        nombre: 'Camisa Derecho - Balanza',
        facultad: 'Derecho',
        descripcion: 'Diseño exclusivo con balanza de la justicia. Representa el honor y la ética de la carrera.',
        precio: 18,
        // Imagen 3 de tu lista
        imgFrente: 'img/camisa-3-espalda.png',
        imgEspalda: 'img/camisa-3-espalda.png',
        tallas: ['XS','S','M','L','XL','XXL','XXXL']
    },
    {
        id: 'camisa-4',
        nombre: 'Camisa FACES - Calculadora',
        facultad: 'FACES',
        descripcion: 'Diseño creativo con calculadora y gráficos. Para los futuros economistas y administradores.',
        precio: 18,
        // Imagen 5 de tu lista
        imgFrente: 'img/camisa-4-espalda.png',
        imgEspalda: 'img/camisa-4-espalda.png',
        tallas: ['XS','S','M','L','XL','XXL','XXXL']
    }
];

const facultadesData = [
    { nombre: 'FACES', carreras: ['Administración', 'Contaduría', 'Economía', 'Comunicación Social'], icono: 'fas fa-chart-pie' },
    { nombre: 'DERECHO', carreras: ['Derecho', 'Estudios Internacionales'], icono: 'fas fa-gavel' },
    { nombre: 'INGENIERÍA Y ARQUITECTURA', carreras: ['Ing. Civil', 'Ing. Industrial', 'Ing. en Sistemas', 'Ing. en Telecomunicaciones', 'Arquitectura'], icono: 'fas fa-drafting-compass' },
    { nombre: 'ODONTOLOGÍA', carreras: ['Odontología'], icono: 'fas fa-tooth' },
    { nombre: 'FARMACIA', carreras: ['Farmacia'], icono: 'fas fa-pills' }
];

let usuarioActual = JSON.parse(localStorage.getItem('usuarioActualUSM')) || null;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', async () => {
    if (usuarioActual) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        await fetch('/api/visita', { method: 'POST' });
    }
    renderProductosIdentidad();
    renderFacultades();
});

// ============ LOGIN Y REGISTRO ============
async function registrarYEntrar() {
    const nombre = document.getElementById('loginNombre').value.trim();
    const apellido = document.getElementById('loginApellido').value.trim();
    const facultad = document.getElementById('loginFacultad').value;
    const correo = document.getElementById('loginCorreo').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (!nombre || !apellido || !facultad || !correo) {
        errorDiv.textContent = 'Por favor completa todos los campos.';
        errorDiv.style.display = 'block';
        return;
    }
    if (!correo.includes('@')) {
        errorDiv.textContent = 'Ingresa un correo válido.';
        errorDiv.style.display = 'block';
        return;
    }
    errorDiv.style.display = 'none';

    try {
        const res = await fetch('/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, facultad, correo })
        });
        const data = await res.json();

        if (data.success) {
            usuarioActual = data.usuario;
            localStorage.setItem('usuarioActualUSM', JSON.stringify(usuarioActual));

            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';

            await fetch('/api/visita', { method: 'POST' });

            mostrarToast('¡Registro exitoso! Cupón BIENVENIDA30 activado. 30% OFF en tu primera compra.');
        } else {
            errorDiv.textContent = data.error || 'Error al registrar.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        mostrarToast('Error de conexión con el servidor.');
    }
}

// ============ RENDER PRODUCTOS CON IMÁGENES ============
function renderProductosIdentidad() {
    const container = document.getElementById('gridIdentidad');
    container.innerHTML = '';
    productosIdentidad.forEach(p => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        // Estructura de la tarjeta con las etiquetas <img> en lugar de los íconos
        card.innerHTML = `
            <div class="producto-imgs">
                <div class="img-container" onclick="incrementarClick('${p.id}', '${p.nombre}')">
                    <img src="${p.imgFrente}" alt="${p.nombre} Frente" class="producto-img">
                    <div class="img-overlay"><span>Frente</span></div>
                </div>
                <div class="img-container" onclick="incrementarClick('${p.id}', '${p.nombre}')">
                    <img src="${p.imgEspalda}" alt="${p.nombre} Espalda" class="producto-img">
                    <div class="img-overlay"><span>Espalda</span></div>
                </div>
            </div>
            <div class="producto-info">
                <div class="facultad-tag">${p.facultad}</div>
                <h3>${p.nombre}</h3>
                <p class="desc">${p.descripcion}</p>
                <div class="precio">$${p.precio} <span>USD</span></div>
                <div class="tallas-selector">
                    ${p.tallas.map(t => `<button class="talla-btn" onclick="seleccionarTalla(this)">${t}</button>`).join('')}
                </div>
                <div class="cantidad-selector">
                    <label>Cant.</label>
                    <input type="number" min="1" value="1" id="cant-${p.id}">
                </div>
                <div class="acciones-producto">
                    <button class="btn-comprar" onclick="comprarProducto('${p.id}')">Comprar</button>
                    <button class="btn-carrito" onclick="agregarAlCarrito('${p.id}')">+ Carrito</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function seleccionarTalla(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

async function incrementarClick(productoId, productoNombre) {
    try {
        await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                producto_id: productoId,
                producto_nombre: productoNombre,
                usuario_correo: usuarioActual?.correo || 'anonimo'
            })
        });
    } catch (err) { console.warn('No se pudo registrar el click'); }
}

// ============ COMPRA ============
async function comprarProducto(productoId) {
    const producto = productosIdentidad.find(p => p.id === productoId);
    if (!producto) return;

    await incrementarClick(productoId, producto.nombre);

    const card = document.getElementById(`cant-${productoId}`).closest('.producto-card');
    const tallaSel = card.querySelector('.talla-btn.selected');
    const talla = tallaSel ? tallaSel.textContent : 'M';
    const cantidad = parseInt(document.getElementById(`cant-${productoId}`).value) || 1;

    try {
        await fetch('/api/compra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                producto_id: producto.id,
                producto_nombre: producto.nombre,
                talla,
                cantidad,
                precio_unitario: producto.precio,
                usuario_correo: usuarioActual?.correo || 'anonimo'
            })
        });
    } catch (err) { console.warn('No se pudo registrar la compra'); }

    window.open('https://docs.google.com/forms/d/e/1FAIpQLScrhNfzDG3b1r0jieSC4Arx9j61e7vtl94b4Lif8Mo3VvN3MA/viewform?usp=header', '_blank');
    mostrarToast(`Redirigiendo a pago para: ${producto.nombre}`);
}

async function agregarAlCarrito(productoId) {
    const producto = productosIdentidad.find(p => p.id === productoId);
    if (!producto) return;

    await incrementarClick(productoId, producto.nombre);

    const card = document.getElementById(`cant-${productoId}`).closest('.producto-card');
    const tallaSel = card.querySelector('.talla-btn.selected');
    const talla = tallaSel ? tallaSel.textContent : 'M';
    const cantidad = parseInt(document.getElementById(`cant-${productoId}`).value) || 1;

    try {
        await fetch('/api/carrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_correo: usuarioActual?.correo || 'anonimo',
                producto_id: producto.id,
                producto_nombre: producto.nombre,
                talla,
                cantidad,
                precio_unitario: producto.precio
            })
        });
        mostrarToast(`✅ ${producto.nombre} (Talla ${talla}) agregado al carrito.`);
    } catch (err) {
        mostrarToast('Error al agregar al carrito.');
    }
}

// ============ FACULTADES ============
function renderFacultades() {
    const container = document.getElementById('facultadesContainer');
    container.innerHTML = '';
    facultadesData.forEach((f, index) => {
        const seccion = document.createElement('div');
        seccion.className = 'facultad-seccion';
        seccion.innerHTML = `
            <div class="facultad-header" onclick="toggleFacultad(this, ${index})">
                <h3><i class="${f.icono}"></i> ${f.nombre}</h3>
                <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="facultad-content" id="facultad-content-${index}">
                <div class="carreras-grid">
                    ${f.carreras.map(c => `
                        <div class="carrera-card" onclick="seleccionarCarrera('${c}', '${f.nombre}')">
                            <i class="fas fa-graduation-cap"></i>
                            <h4>${c}</h4>
                            <p>Ver productos</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(seccion);
    });
}

function toggleFacultad(header, index) {
    const content = document.getElementById(`facultad-content-${index}`);
    const isVisible = content.classList.contains('show');
    document.querySelectorAll('.facultad-content').forEach(c => c.classList.remove('show'));
    document.querySelectorAll('.facultad-header').forEach(h => h.classList.remove('active'));
    if (!isVisible) {
        content.classList.add('show');
        header.classList.add('active');
    }
}

async function seleccionarCarrera(carrera, facultad) {
    await incrementarClick(carrera, `${carrera} - ${facultad}`);
    mostrarToast(`Mostrando productos de ${carrera} - ¡Próximamente!`);
}

// ============ CONTACTO ============
async function enviarContacto() {
    const nombre = document.getElementById('contactoNombre').value.trim();
    const correo = document.getElementById('contactoCorreo').value.trim();
    const mensaje = document.getElementById('contactoMensaje').value.trim();

    if (!nombre || !correo || !mensaje) {
        mostrarToast('Por favor completa todos los campos.');
        return;
    }

    try {
        const res = await fetch('/api/contacto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, mensaje })
        });
        const data = await res.json();
        if (data.success) {
            mostrarToast(`📩 ¡Gracias ${nombre}! Tu mensaje fue enviado.`);
            document.getElementById('contactoNombre').value = '';
            document.getElementById('contactoCorreo').value = '';
            document.getElementById('contactoMensaje').value = '';
        }
    } catch (err) {
        mostrarToast('Error al enviar el mensaje.');
    }
}

// ============ ADMIN ============
async function abrirAdmin() {
    const codigo = prompt('Ingresa el código de fundadora:');
    if (!codigo) return;

    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo })
        });
        if (res.ok) {
            document.getElementById('adminPanel').style.display = 'flex';
            await cargarAdminData();
        } else {
            mostrarToast('❌ Código incorrecto.');
        }
    } catch (err) {
        mostrarToast('Error de conexión.');
    }
}

function cerrarAdmin() {
    document.getElementById('adminPanel').style.display = 'none';
}

async function cargarAdminData() {
    const stats = await (await fetch('/api/admin/stats')).json();
    document.getElementById('statVisitantes').textContent = stats.visitantes;
    document.getElementById('statClicks').textContent = stats.clicks;
    document.getElementById('statVentas').textContent = stats.ventasTotales;
    document.getElementById('statRegistros').textContent = stats.registros;
    document.getElementById('statIngresos').textContent = `$${Number(stats.ingresos).toFixed(2)}`;

    const tbodyFav = document.getElementById('tbodyFavoritos');
    tbodyFav.innerHTML = '';
    if (stats.productosFavoritos.length === 0) {
        tbodyFav.innerHTML = '<tr><td colspan="2" style="text-align:center;color:#999;">Sin datos aún</td></tr>';
    } else {
        stats.productosFavoritos.forEach(p => {
            tbodyFav.innerHTML += `<tr><td>${p.producto_nombre || '(sin nombre)'}</td><td>${p.clicks}</td></tr>`;
        });
    }

    const usuarios = await (await fetch('/api/admin/usuarios')).json();
    const tbody = document.getElementById('tbodyUsuarios');
    tbody.innerHTML = '';
    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">Sin registros aún</td></tr>';
    } else {
        usuarios.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.nombre}</td><td>${u.apellido}</td>
                    <td>${u.facultad}</td><td>${u.correo}</td>
                    <td>${new Date(u.fecha_registro).toLocaleDateString('es-VE')}</td>
                </tr>
            `;
        });
    }

    const ventas = await (await fetch('/api/admin/ventas-mensuales')).json();
    renderGraficoVentas(ventas);
}

function renderGraficoVentas(datos) {
    const container = document.getElementById('graficoVentas');
    container.innerHTML = '';
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    if (!datos || datos.length === 0) {
        container.innerHTML = '<p style="color:#999; text-align:center; width:100%;">Aún no hay ventas registradas.</p>';
        return;
    }

    const maxVenta = Math.max(...datos.map(d => d.ventas), 1);
    datos.forEach(d => {
        const altura = (d.ventas / maxVenta) * 100;
        const item = document.createElement('div');
        item.className = 'barra-item';
        item.innerHTML = `
            <div class="barra-valor">${d.ventas}</div>
            <div class="barra" style="height: ${altura}%;" title="Ingresos: $${d.ingresos}"></div>
            <div class="barra-label">${meses[d.mes - 1]}</div>
        `;
        container.appendChild(item);
    });
}

function exportarExcel() {
    window.open('/api/admin/exportar-csv', '_blank');
    mostrarToast('📥 Descargando registros...');
}

// ============ UTILIDADES ============
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function mostrarToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

window.cerrarSesion = function() {
    localStorage.removeItem('usuarioActualUSM');
    location.reload();
};