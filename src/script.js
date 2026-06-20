const formulario = document.getElementById('btnAbrirFormulario');
formulario.addEventListener('submit', function(event) {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Datos capturados:", { nombre, email, password });
    
    alert(`Usuario ${nombre} creado con éxito.`);
});