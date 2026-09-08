// ---- 1. Dados das cartas (troque nome, descricao e arte à vontade) ----
// Para usar suas imagens do Canva, troque "arte" por:
// arte: '<img src="imagens/carta1.png" alt="">'

const cartas = [
  {
    nome: "Deus Ecaflip",
    descricao: "Um impulso que não pede permissão. Ganha 2 ações até o fim do turno.",
    arte: '<img src="Imagens/DeusEcaflip.png" alt="Deus Ecaflip">'
  },
  {
    nome: "Petisco",
    descricao: "Nem toda resposta precisa ser dada agora. Ganha 3 níveis de curas concedidas até o fim do turno.",
    arte: '<img src="Imagens/Petisco.png" alt="Petisco">'
  },
  {
    nome: "Lua peluda",
    descricao: "Algo que parecia separado está mais perto de se conectar do que você imagina. Ganha 2 níveis de margem crítica",
    arte: '<img src="Imagens/Roda.png" alt="Lua peluda">'
  },
  {
    nome: "Meowrtírio",
    descricao: "O que incomoda no outro costuma apontar para dentro. Você e aliados adjacentes recebem 2d10 de Proteção.",
    arte: '<img src="Imagens/Meowrtírio.png" alt="Meowrtírio">'
  },
  {
    nome: "Deus kilorf",
    descricao: "Resultados pequenos hoje são a base de algo maior. Perde 2 ações até o fim do turno",
    arte: '<img src="Imagens/Deus%20Kilorf.png" alt="Deus Kilorf">'
  },
  {
    nome: "Roda da fortuna",
    descricao: "Nem tudo precisa ser resolvido agora. Ganha +2d6 em rolagens de dano até o fim do turno.",
    arte: '<img src="Imagens/Rodadafortuna.png" alt="A Roda">'
  },
  {
    nome: "O Destino",
    descricao: "O risco escolhe seu campeão. Coloca uma marca em um alvo, causando 6d8 de dano em um alvo à escolha no fim do seu turno.",
    arte: '<img src="Imagens/Destino.png" alt="Destino">',
    especial: true,
    tema: "destino"
  },
  {
    nome: "Desventura",
    descricao: "A sorte muda de lado. criaturas dentro de uma área de 3m à sua escolha perdem 1 ação e recebem -1d6 em testes até o fim da rodada.",
    arte: '<img src="Imagens/Desventura.png" alt="Desventura">',
    especial: true,
    tema: "destino"
  }
];

// A carta especial ativada pelo sacrifício. Edite nome, descricao e efeito à vontade.
const trunfo = {
  nome: "Trunfo",
  descricao: "Uma carta fora do baralho normal, liberada por um sacrifício.",
  efeito: "recebeu a benção do Deus ecaflip, seu pai. Você teleporta pro reino divino dos ecaflip o Ecafliperama lá você descansa gradualmente recuperando 4d6 PV e PE no fim de cada turno seu. Pode voltar para o plano normal com 1 ação",
  arte: '<img src="Imagens/Trunfo.png" alt="Trunfo">'
};
const INDICE_TRUNFO = cartas.length; // não colide com os índices do baralho normal

function pegarCarta(indice) {
  return indice === INDICE_TRUNFO ? trunfo : cartas[indice];
}

// ---- 2. Elementos ----

const carta = document.getElementById("carta");
const frenteArte = document.getElementById("frenteArte");
const frenteNome = document.getElementById("frenteNome");
const instrucao = document.getElementById("instrucao");

const revelacaoVazia = document.getElementById("revelacaoVazia");
const revelacaoConteudo = document.getElementById("revelacaoConteudo");
const nomeCarta = document.getElementById("nomeCarta");
const textoCarta = document.getElementById("textoCarta");

const efeitoEspecial = document.getElementById("efeitoEspecial");

const contador = document.getElementById("contador");
const botaoEmbaralhar = document.getElementById("botaoEmbaralhar");
const botaoSacrificar = document.getElementById("botaoSacrificar");
const painelSacrificio = document.getElementById("painelSacrificio");
const listaSacrificadas = document.getElementById("listaSacrificadas");

// ---- 3. Estado do baralho (Sistema B: sem repetição até acabar) ----

let baralho = [];
let travado = false; // evita clique durante a animação
let trunfoAtivo = false; // já foi liberado por um sacrifício nesta rodada?
let sacrificadas = []; // índices das cartas normais já sacrificadas
let timerEmbaralharAutomatico = null;

function embaralhar() {
  if (timerEmbaralharAutomatico) {
    clearTimeout(timerEmbaralharAutomatico);
    timerEmbaralharAutomatico = null;
  }

  baralho = cartas.map((_, indice) => indice);
  embaralharArray(baralho);

  trunfoAtivo = false;
  sacrificadas = [];
  painelSacrificio.hidden = true;
  listaSacrificadas.innerHTML = "";

  travado = false;
  carta.classList.remove("virada", "trunfo", "especial", "destino", "esgotada");
  document.body.classList.remove("tema-destino");
  instrucao.textContent = "embaralhando...";

  revelacaoVazia.hidden = false;
  revelacaoConteudo.hidden = true;
  efeitoEspecial.hidden = true;
  efeitoEspecial.textContent = "";

  atualizarContador();
  botaoEmbaralhar.hidden = true;

  setTimeout(() => {
    instrucao.textContent = "clique na carta";
  }, 500);
}

function agendarEmbaralhamentoAutomatico() {
  if (timerEmbaralharAutomatico) {
    clearTimeout(timerEmbaralharAutomatico);
  }

  timerEmbaralharAutomatico = setTimeout(() => {
    embaralhar();
  }, 5000);
}

function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function atualizarContador() {
  const restantes = baralho.length;
  contador.textContent = restantes === 1
    ? "1 carta no baralho"
    : `${restantes} cartas no baralho`;

  const candidatosRestantes = baralho.filter(indice => indice !== INDICE_TRUNFO).length;
  botaoSacrificar.disabled = trunfoAtivo || candidatosRestantes === 0;
}

// ---- 4. Puxar carta ----

function revelarCarta(indice) {
  const escolhida = pegarCarta(indice);
  const ehTrunfo = indice === INDICE_TRUNFO;
  const ehEspecial = escolhida.especial === true;
  const tema = escolhida.tema || "";

  frenteArte.innerHTML = escolhida.arte;
  frenteNome.textContent = escolhida.nome;
  carta.classList.toggle("trunfo", ehTrunfo);
  carta.classList.toggle("especial", ehEspecial && !ehTrunfo);
  carta.classList.toggle("destino", tema === "destino" && !ehTrunfo);
  document.body.classList.toggle("tema-destino", tema === "destino" && !ehTrunfo);

  carta.classList.add("virada");
  instrucao.textContent = "clique para virar de volta";

  revelacaoVazia.hidden = true;
  revelacaoConteudo.hidden = false;
  nomeCarta.textContent = escolhida.nome;
  textoCarta.textContent = escolhida.descricao;

  efeitoEspecial.hidden = !ehTrunfo;
  efeitoEspecial.textContent = ehTrunfo ? escolhida.efeito : "";
}

function puxarCarta() {
  if (travado || baralho.length === 0) return;

  travado = true;

  const indice = baralho.pop();
  revelarCarta(indice);
  atualizarContador();

  if (baralho.length === 0) {
    instrucao.textContent = "embaralhando...";
    botaoEmbaralhar.hidden = true;
    agendarEmbaralhamentoAutomatico();
  }

  setTimeout(() => { travado = false; }, 700);
}

function virarDeVolta() {
  carta.classList.remove("virada");

  if (baralho.length > 0) {
    instrucao.textContent = "clique na carta";
    return;
  }

  instrucao.textContent = "embaralhando...";
  botaoEmbaralhar.hidden = true;
}

carta.addEventListener("click", () => {
  if (travado) return;
  if (carta.classList.contains("virada")) {
    virarDeVolta();
  } else {
    puxarCarta();
  }
});

botaoEmbaralhar.addEventListener("click", embaralhar);

// ---- 4.1 Sacrifício ----
// Inutiliza uma carta aleatória ainda não puxada e libera o Trunfo no lugar dela.

function sacrificar() {
  if (travado || trunfoAtivo) return;

  const candidatos = baralho.filter(indice => indice !== INDICE_TRUNFO);
  if (candidatos.length === 0) return;

  travado = true;

  const escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
  baralho.splice(baralho.indexOf(escolhido), 1);
  sacrificadas.push(escolhido);
  trunfoAtivo = true;

  painelSacrificio.hidden = false;
  const item = document.createElement("li");
  item.textContent = cartas[escolhido].nome;
  listaSacrificadas.appendChild(item);

  // Mostra o Trunfo direto, sem precisar clicar na carta
  revelarCarta(INDICE_TRUNFO);
  atualizarContador();

  setTimeout(() => { travado = false; }, 700);
}

botaoSacrificar.addEventListener("click", sacrificar);

// ---- 5. Artes simples em SVG (placeholders — troque por <img> quando tiver o Canva pronto) ----

function svgChama() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#8a6a3a" stroke-width="2.5">
    <path d="M50 15 C35 35 30 50 40 65 C35 60 33 52 36 45 C38 60 50 70 50 85 C65 75 68 55 58 40 C60 48 58 54 55 58 C58 40 50 28 50 15 Z" stroke-linejoin="round"/>
  </svg>`;
}
function svgSilencio() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#8a6a3a" stroke-width="2.5">
    <circle cx="50" cy="50" r="30"/>
    <circle cx="50" cy="50" r="4" fill="#8a6a3a"/>
  </svg>`;
}
function svgPonte() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#8a6a3a" stroke-width="2.5">
    <path d="M15 65 Q50 30 85 65" stroke-linecap="round"/>
    <line x1="25" y1="65" x2="25" y2="78"/>
    <line x1="50" y1="55" x2="50" y2="78"/>
    <line x1="75" y1="65" x2="75" y2="78"/>
  </svg>`;
}
function svgEspelho() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#8a6a3a" stroke-width="2.5">
    <ellipse cx="50" cy="42" rx="22" ry="28"/>
    <line x1="50" y1="70" x2="50" y2="85"/>
    <line x1="38" y1="85" x2="62" y2="85"/>
  </svg>`;
}
function svgSemente() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#8a6a3a" stroke-width="2.5">
    <path d="M50 80 C50 55 50 40 50 40 C30 40 20 25 20 25 C20 45 35 58 50 58"/>
    <path d="M50 40 C70 40 80 25 80 25 C80 45 65 58 50 58"/>
  </svg>`;
}
function svgMare() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#8a6a3a" stroke-width="2.5">
    <path d="M15 40 Q27 30 40 40 T65 40 T90 40"/>
    <path d="M15 55 Q27 45 40 55 T65 55 T90 55"/>
    <path d="M15 70 Q27 60 40 70 T65 70 T90 70"/>
  </svg>`;
}

function svgTrunfo() {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#6b5a91" stroke-width="2.5">
    <path d="M50 10 L61 39 L92 39 L67 58 L77 88 L50 69 L23 88 L33 58 L8 39 L39 39 Z" stroke-linejoin="round"/>
  </svg>`;
}

// ---- 6. Início ----

embaralhar();
