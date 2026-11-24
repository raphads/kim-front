(function () {
  if (document.getElementById('btnAbrirMural')) return;

  const htmlMural = `
    <!-- BOTÃO FLUTUANTE DO CHAT COMUNITÁRIO -->
    <button
      id="btnAbrirMural"
      class="btn shadow-lg rounded-pill px-3 py-2 d-flex align-items-center gap-2"
      style="position: fixed; bottom: 20px; left: 20px; z-index: 1050; background-color: #1e3a5f; color: #fff; border: 2px solid #f97316;"
      onclick="toggleMural()"
    >
      <i class="bi bi-chat-dots-fill text-warning"></i>
      <span class="fw-semibold">Chat da Galera</span>
    </button>

    <!-- JANELA DO CHAT COMUNITÁRIO -->
    <div
      id="janelaMural"
      class="card shadow-lg d-none"
      style="position: fixed; bottom: 80px; left: 20px; width: 340px; max-width: calc(100vw - 40px); z-index: 1050; border-radius: 14px; overflow: hidden; border: 2px solid #1e3a5f;"
    >
      <div class="card-header d-flex justify-content-between align-items-center text-white py-2 px-3" style="background-color: #1e3a5f;">
        <div class="fw-bold small">
          <i class="bi bi-shield-lock-fill text-warning me-1"></i> Chat da Galera
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm text-white p-0" title="Atualizar" onclick="carregarMural()">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <button class="btn btn-sm text-white p-0" title="Fechar" onclick="toggleMural()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- ÁREA DAS MENSAGENS SALVAS -->
      <div
        id="listaMensagensMural"
        class="card-body p-3"
        style="height: 280px; overflow-y: auto; background-color: #f1f5f9; color: #1e293b; font-size: 0.9rem;"
      >
        <div class="text-center text-muted small py-4">Carregando mensagens...</div>
      </div>

      <!-- RODAPÉ: MOSTRA USUÁRIO LOGADO OU BLOQUEIA ENVIO -->
      <div class="card-footer bg-white p-2 border-top">
        <div id="muralAreaLogado" class="d-none">
          <div class="d-flex justify-content-between align-items-center mb-1 px-1">
            <small class="text-muted">Enviando como:</small>
            <span id="muralBadgeUsuario" class="badge bg-primary"></span>
          </div>
          <div class="input-group input-group-sm">
            <input
              type="text"
              id="muralTexto"
              class="form-control"
              placeholder="Escreva uma mensagem..."
              maxlength="500"
              onkeydown="if(event.key === 'Enter') enviarMensagemMural()"
            >
            <button class="btn text-white fw-semibold" style="background-color: #43ab3c;" onclick="enviarMensagemMural()">
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
        </div>

        <div id="muralAreaDeslogado" class="text-center py-2">
          <div class="small text-muted mb-2">Faça login para participar do chat.</div>
          <a href="login.html" class="btn btn-sm text-white fw-semibold px-3" style="background-color: #1e3a5f;">
            <i class="bi bi-box-arrow-in-right me-1"></i> Fazer Login
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', htmlMural);
})();

let intervaloMural = null;

function obterUsuarioLogado() {
  try {
    const raw = localStorage.getItem('usuarioLogado');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function atualizarEstadoAuthMural() {
  const user = obterUsuarioLogado();
  const areaLogado = document.getElementById('muralAreaLogado');
  const areaDeslogado = document.getElementById('muralAreaDeslogado');
  const badge = document.getElementById('muralBadgeUsuario');

  if (!areaLogado || !areaDeslogado || !badge) return;

  if (user && user.usuario) {
    areaLogado.classList.remove('d-none');
    areaDeslogado.classList.add('d-none');
    badge.textContent = `@${user.usuario}`;
  } else {
    areaLogado.classList.add('d-none');
    areaDeslogado.classList.remove('d-none');
  }
}

function escaparHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toggleMural() {
  const janela = document.getElementById('janelaMural');
  if (!janela) return;

  const fechada = janela.classList.toggle('d-none');

  if (!fechada) {
    atualizarEstadoAuthMural();
    carregarMural(true);
    intervaloMural = setInterval(() => {
      atualizarEstadoAuthMural();
      carregarMural(false);
    }, 5000);
  } else if (intervaloMural) {
    clearInterval(intervaloMural);
    intervaloMural = null;
  }
}

async function carregarMural(rolarParaFim = false) {
  const box = document.getElementById('listaMensagensMural');
  if (!box) return;

  try {
    const res = await fetch(`${BASE_URL}/api/chat`);
    const msgs = await res.json();

    if (!Array.isArray(msgs) || msgs.length === 0) {
      box.innerHTML = `<div class="text-center text-muted small py-4">Nenhuma mensagem ainda.</div>`;
      return;
    }

    const estavaNoFim = box.scrollHeight - box.scrollTop <= box.clientHeight + 40;

    box.innerHTML = msgs.map(m => {
      const hora = m.criadoEm
        ? new Date(m.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '';
      return `
        <div class="bg-white rounded-3 p-2 mb-2 shadow-sm border">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong style="color: #1e3a5f; font-size: 0.82rem;">@${escaparHtml(m.autor)}</strong>
            <span class="text-muted" style="font-size: 0.72rem;">${hora}</span>
          </div>
          <div style="word-break: break-word;">${escaparHtml(m.texto)}</div>
        </div>
      `;
    }).join('');

    if (rolarParaFim || estavaNoFim) {
      box.scrollTop = box.scrollHeight;
    }
  } catch (err) {
    box.innerHTML = `<div class="text-center text-danger small py-4">Erro ao carregar mensagens.</div>`;
  }
}

async function enviarMensagemMural() {
  const user = obterUsuarioLogado();
  if (!user || !user.id) {
    atualizarEstadoAuthMural();
    return;
  }

  const inputTexto = document.getElementById('muralTexto');
  const texto = inputTexto.value.trim();
  if (!texto) return;

  inputTexto.value = '';
  inputTexto.disabled = true;

  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: user.id,
        texto
      })
    });

    if (res.status === 401) {
      localStorage.removeItem('usuarioLogado');
      atualizarEstadoAuthMural();
      return;
    }

    if (res.ok) {
      await carregarMural(true);
    }
  } catch (err) {
    console.error('Erro ao enviar:', err);
  } finally {
    inputTexto.disabled = false;
    inputTexto.focus();
  }
}