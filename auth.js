    // 🔒 GUARDA DE AUTENTICAÇÃO
    // Executa imediatamente antes de renderizar o restante da página
    (function() {
      const usuarioLogado = localStorage.getItem('usuario');
      if (!usuarioLogado) {
        alert('Acesso restrito! Por favor, faça login para continuar.');
        window.location.href = 'login.html'; // Redireciona para login.html
      }
    })();