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