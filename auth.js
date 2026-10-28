    // 🔒 GUARDA DE AUTENTICAÇÃO
    // Executa imediatamente antes de renderizar o restante da página
    (function() {
      const usuarioLogado = localStorage.getItem('usuarioLogado');
      if (!usuarioLogado) {
        alert('Acesso restrito! Por favor, faça login para continuar.');
        window.location.href = 'login'; // Redireciona para login.html
      }
    })();/**/
    function fazerLogout() {
  if (confirm('Deseja realmente sair do sistema?')) {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login';
  }
}