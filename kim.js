// No topo do seu kim.js
const BASE_URL = "https://kartodromo-api.onrender.com";
//const API_URL = "https://kartodromo-api.onrender.com"; 
// (Se precisar voltar para o PC, basta trocar para: "http://localhost:3000")
// Acorda a API no Render silenciosamente assim que a página inicial carrega
window.addEventListener('DOMContentLoaded', () => {
  if (typeof BASE_URL !== 'undefined') {
    fetch(`${BASE_URL}/api/pilotos`, { method: 'GET' })
      .then(res => {
        if (res.ok) console.log('🚀 API do Render acordada!');
      })
      .catch(() => {
        console.log('⏳ Acordando servidor no Render...');
      });
  }
});

$(document).ready(function(){
    $('#cpf').inputmask('999.999.999-99'); // Máscara para CPF
    $('#email').inputmask('aaa@aaa.com'); // Máscara para email
    $('#telefone').inputmask('(99)99999-9999'); // Máscara para Telefone
    $('#cep').inputmask('99999-999'); // Máscara para CEP
    $('#cc').inputmask('9999 9999 9999 9999');
    $('#cod').inputmask('999');
    $('#dataval').inputmask('99/99');



$('#cep').on('blur', function() {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length === 8) {
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
                if (!("erro" in data)) {
                    $('#rua').val(data.logradouro);
                    $('#bairro').val(data.bairro);
                    $('#cidade').val(data.localidade);
                    $('#estado').val(data.uf);
                } else {
                    alert("CEP não encontrado.");
                    document.getElementById("cep").value="";
                    document.getElementById("cep").focus();
                }
            });
        }
    });	
});

function toggleMenu() {
   if (document.getElementById("sidebar").classList.toggle("active")){
    document.getElementsByClassName("menu-icon").toggle("visible");
        document.getElementById("sidebar").classList.toggle("deactive");
   }
   if (document.getElementById("sidebar").classList.toggle("false")){
        document.getElementById("sidebar").classList.toggle("active");
}
}

function aplicarArquivosTema(tema) {
  const linkClassico = document.getElementById('cssClassico');
  const linkModerno = document.getElementById('cssModerno');

  const usarClassico = tema === 'classico';

  if (linkClassico) linkClassico.disabled = !usarClassico;
  if (linkModerno) linkModerno.disabled = usarClassico;
}

// Aplica imediatamente ao carregar o <head> (padrão: moderno)
(function initTema() {
  const temaSalvo = localStorage.getItem('alakart_tema') || 'moderno';
  aplicarArquivosTema(temaSalvo);
})();

function alternarTema() {
  const atual = localStorage.getItem('alakart_tema') || 'moderno';
  const novoTema = atual === 'classico' ? 'moderno' : 'classico';

  localStorage.setItem('alakart_tema', novoTema);
  aplicarArquivosTema(novoTema);
  atualizarTextoBotaoTema();
}

function atualizarTextoBotaoTema() {
  const btn = document.getElementById('btnAlternarTema');
  if (!btn) return;

  const isClassico = (localStorage.getItem('alakart_tema') || 'moderno') === 'classico';
  btn.innerHTML = isClassico
    ? '<i class="bi bi-stars me-1"></i> Modo Moderno'
    : '<i class="bi bi-clock-history me-1"></i> Modo Clássico';
}

window.addEventListener('DOMContentLoaded', atualizarTextoBotaoTema);