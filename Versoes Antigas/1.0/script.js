// --- SAÚDE ---
let saudeAtual = 100;
let saudeMaxima = 100;
let regeneracaoInterval;

function atualizarSaudeDisplay() {
    document.getElementById('saude-valor').textContent = saudeAtual;
    document.getElementById('saude-maxima-valor').textContent = saudeMaxima;
    atualizarBarraDeSaude();
}

function atualizarMaxSaudeDisplay() {
    document.getElementById('max-saude-valor').textContent = saudeMaxima;
    atualizarSaudeDisplay(); // Garante que a saúde atual não exceda a máxima
}

function atualizarBarraDeSaude() {
    const porcentagemSaude = (saudeAtual / saudeMaxima) * 100;
    const barraDeSaude = document.getElementById('health-bar');
    barraDeSaude.style.width = porcentagemSaude + '%';

    if (porcentagemSaude > 70) {
        barraDeSaude.style.backgroundColor = 'green';
    } else if (porcentagemSaude > 30) {
        barraDeSaude.style.backgroundColor = 'orange';
    } else {
        barraDeSaude.style.backgroundColor = 'red';
    }
}

function alterarSaude(quantidade) {
    saudeAtual += quantidade;
    if (saudeAtual > saudeMaxima) {
        saudeAtual = saudeMaxima;
    } else if (saudeAtual < 0) {
        saudeAtual = 0;
    }
    atualizarSaudeDisplay();
}

function restaurarSaude() {
    saudeAtual = saudeMaxima;
    atualizarSaudeDisplay();
}

function alterarMaxSaude(quantidade) {
    saudeMaxima += quantidade;
    if (saudeMaxima < 1) {
        saudeMaxima = 1; // Evita saúde máxima negativa ou zero
    }
    atualizarMaxSaudeDisplay();
}

function resetarMaxSaude() {
    saudeMaxima = 100;
    atualizarMaxSaudeDisplay();
}

function aplicarDano() {
    const quantidadeDano = parseInt(document.getElementById('quantidade-dano').value);
    alterarSaude(-quantidadeDano);
    registrarCuraOuDano(`Dano Físico: -${quantidadeDano}`); // Ajustado para registrar dano
}

function aplicarCura() {
    const quantidadeCura = parseInt(document.getElementById('quantidade-cura').value);
    alterarSaude(quantidadeCura);
    registrarCuraOuDano(`Cura: +${quantidadeCura}`);
}

function registrarCuraOuDano(mensagem) {
    const curaLog = document.getElementById('cura-log');
    const novoRegistro = document.createElement('li');
    novoRegistro.textContent = `${mensagem} - ${new Date().toLocaleTimeString()}`;
    curaLog.appendChild(novoRegistro);
    // Limpa a mensagem padrão "Nenhum registro..." se for o primeiro registro
    if (curaLog.children.length === 1 && curaLog.children[0].textContent === 'Nenhum registro de cura recente.') {
        curaLog.removeChild(curaLog.firstChild);
    }
}


// --- EFEITOS ATIVOS ---
function adicionarEfeito() {
    const nomeEfeito = document.getElementById('nome-efeito').value;
    const duracaoEfeito = document.getElementById('duracao-efeito').value;
    const listaEfeitos = document.getElementById('lista-efeitos');

    if (nomeEfeito) {
        const novoEfeito = document.createElement('li');
        novoEfeito.textContent = `${nomeEfeito} ${duracaoEfeito ? '(' + duracaoEfeito + ')' : ''}`;
        listaEfeitos.appendChild(novoEfeito);

        if (listaEfeitos.children.length === 1 && listaEfeitos.children[0].textContent === 'Sem efeitos ativos') {
            listaEfeitos.removeChild(listaEfeitos.firstChild);
        }

        document.getElementById('nome-efeito').value = '';
        document.getElementById('duracao-efeito').value = '';
    }
}

// --- REGENERAÇÃO DE SAÚDE ---
function iniciarRegeneracao() {
    let regeneracaoBase = parseInt(document.getElementById('regeneracao-base').value);
    let regeneracaoPeriodo = document.getElementById('regeneracao-periodo').value;
    let intervaloTempo = 0;

    if (regeneracaoPeriodo === 'segundo') {
        intervaloTempo = 1000; // 1 segundo em milissegundos
    } else if (regeneracaoPeriodo === 'minuto') {
        intervaloTempo = 60000; // 1 minuto em milissegundos
    } else if (regeneracaoPeriodo === 'turno') {
        intervaloTempo = 5000; // 5 segundos para simular um turno (ajuste conforme necessário)
    }

    if (!regeneracaoInterval) { // Impede múltiplos intervalos rodando
        regeneracaoInterval = setInterval(() => {
            alterarSaude(regeneracaoBase);
            registrarCuraOuDano(`Regeneração: +${regeneracaoBase}`); // Registra a regeneração no log
        }, intervaloTempo);
    }
}

function pararRegeneracao() {
    clearInterval(regeneracaoInterval);
    regeneracaoInterval = null;
}

// Inicialização da Saúde
atualizarSaudeDisplay();