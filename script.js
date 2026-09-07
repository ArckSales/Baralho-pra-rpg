// ---- 1. Dados das cartas (troque nome, descricao e arte à vontade) ----
// Para usar suas imagens do Canva, troque "arte" por:
// arte: '<img src="imagens/carta1.png" alt="">'

const cartas = [
  {
    nome: "A Chama",
    descricao: "Um impulso que não pede permissão. Hoje é dia de começar algo, mesmo sem ter tudo pronto.",
    arte: svgChama()
  },
  {
    nome: "O Silêncio",
    descricao: "Nem toda resposta precisa ser dada agora. Deixe uma pergunta descansar antes de respondê-la.",
    arte: svgSilencio()
  },
  {
    nome: "A Ponte",
    descricao: "Algo que parecia separado está mais perto de se conectar do que você imagina.",
    arte: svgPonte()
  },
  {
    nome: "O Espelho",
    descricao: "O que incomoda no outro costuma apontar para dentro. Vale a pena olhar de novo.",
    arte: svgEspelho()
  },
  {
    nome: "A Semente",
    descricao: "Resultados pequenos hoje são a base de algo maior. Continue regando.",
    arte: svgSemente()
  },
  {
    nome: "A Maré",
    descricao: "Nem tudo precisa ser resolvido agora. Alguns ciclos só pedem para serem esperados.",
    arte: svgMare()
  }
];

// ---- 2. Elementos ----

const carta = document.getElementById("carta");
const frenteArte = document.getElementById("frenteArte");
const frenteNome = document.getElementById("frenteNome");
const instrucao = document.getElementById("instrucao");

const revelacaoVazia = document.getElementById("revelacaoVazia");
const revelacaoConteudo = document.getElementById("revelacaoConteudo");
const nomeCarta = document.getElementById("nomeCarta");
const textoCarta = document.getElementById("textoCarta");

const contador = document.getElementById("contador");
const botaoEmbaralhar = document.getElementById("botaoEmbaralhar");

// ---- 3. Estado do baralho (Sistema B: sem repetição até acabar) ----

let baralho = [];
let travado = false; // evita clique durante a animação

function embaralhar() {
  baralho = cartas.map((_, indice) => indice);
  for (let i = baralho.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
  }
  atualizarContador();
  botaoEmbaralhar.hidden = true;
  carta.classList.remove("esgotada");
}

function atualizarContador() {
  const restantes = baralho.length;
  contador.textContent = restantes === 1
    ? "1 carta no baralho"
    : `${restantes} cartas no baralho`;
}

// ---- 4. Puxar carta ----

function puxarCarta() {
  if (travado || baralho.length === 0) return;

  travado = true;

  const indice = baralho.pop();
  const escolhida = cartas[indice];

  frenteArte.innerHTML = escolhida.arte;
  frenteNome.textContent = escolhida.nome;

  carta.classList.add("virada");
  instrucao.textContent = "clique para virar de volta";

  revelacaoVazia.hidden = true;
  revelacaoConteudo.hidden = false;
  nomeCarta.textContent = escolhida.nome;
  textoCarta.textContent = escolhida.descricao;

  atualizarContador();

  if (baralho.length === 0) {
    instrucao.textContent = "baralho esgotado";
    botaoEmbaralhar.hidden = false;
  }

  setTimeout(() => { travado = false; }, 700);
}

function virarDeVolta() {
  carta.classList.remove("virada");
  instrucao.textContent = baralho.length > 0 ? "clique na carta" : "baralho esgotado";
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

// ---- 6. Início ----

embaralhar();
