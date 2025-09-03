// index.html
function mostrarMenuUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const menu = document.getElementById('menu-usuario');
    if (usuario && usuario.nombre) {
        menu.innerHTML = `
            <li>Hola, <strong>${usuario.nombre}</strong></li>
            <li><a href="perfil.html">Mi Perfil</a></li>
            <li><button id="cerrarSesion">Cerrar sesión</button></li>
        `;
        document.getElementById('cerrarSesion').onclick = function() {
            localStorage.removeItem('usuario');
            window.location.reload();
        };
    }
}
if (document.getElementById('menu-usuario')) mostrarMenuUsuario();

// perfil.html
function perfilScript() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const box = document.getElementById('perfilBox');
    const datosDiv = document.getElementById('datosPerfil');
    const form = document.getElementById('formPerfil');
    const editarBtn = document.getElementById('editarBtn');
    function mostrarDatos() {
        if (usuario) {
            datosDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Apellido:</strong> ${usuario.apellido}</p>
                <p><strong>Edad:</strong> ${usuario.edad}</p>
                <p><strong>Fecha de nacimiento:</strong> ${usuario.fecha_nacimiento}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
            `;
            form.style.display = 'none';
            editarBtn.style.display = '';
        } else {
            datosDiv.innerHTML = '<p>No has iniciado sesión.</p>';
            editarBtn.style.display = 'none';
        }
    }
    function cargarFormulario() {
        if (!usuario) return;
        form.nombre.value = usuario.nombre;
        form.apellido.value = usuario.apellido;
        form.edad.value = usuario.edad;
        form.fecha_nacimiento.value = usuario.fecha_nacimiento;
        form.email.value = usuario.email;
        form.password.value = usuario.password;
        form.style.display = 'flex';
        editarBtn.style.display = 'none';
    }
    if (editarBtn) editarBtn.onclick = cargarFormulario;
    if (form) form.onsubmit = async function(e) {
        e.preventDefault();
        const datos = {
            nombre: form.nombre.value,
            apellido: form.apellido.value,
            edad: form.edad.value,
            fecha_nacimiento: form.fecha_nacimiento.value,
            email: form.email.value,
            password: form.password.value
        };
        try {
            const res = await fetch('http://localhost:3000/api/actualizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (res.ok) {
                localStorage.setItem('usuario', JSON.stringify(datos));
                alert('Datos actualizados correctamente.');
                mostrarDatos();
            } else {
                const err = await res.json();
                alert('Error al actualizar los datos: ' + (err.error || ''));
            }
        } catch {
            alert('Error de conexión con el servidor.');
        }
    };
    mostrarDatos();
    function logout() {
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
    }
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) logoutBtn.onclick = logout;
}
if (document.getElementById('perfilBox')) perfilScript();

// inicio-sesion.html
function loginScript() {
    const form = document.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        try {
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('usuario', JSON.stringify(user.user));
                alert('¡Bienvenido, ' + user.user.nombre + '!');
                window.location.href = 'index.html';
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'No se pudo iniciar sesión.'));
            }
        } catch (error) {
            alert('Error de conexión con el servidor.');
        }
    });
}
if (window.location.pathname.includes('inicio-sesion')) loginScript();

// registro.html
function registroScript() {
    const form = document.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        try {
            const res = await fetch('http://localhost:3000/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                window.location.href = 'inicio-sesion.html';
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'No se pudo registrar.'));
            }
        } catch (error) {
            alert('Error de conexión con el servidor.');
        }
    });
}
if (window.location.pathname.includes('registro')) registroScript();
