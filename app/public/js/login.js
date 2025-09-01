document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        if (usuario === 'admin' && senha === 'admin') {
            window.location.href = 'index.html'; 
        } else {
            alert('Usuário ou senha inválidos');
        }
    });
});