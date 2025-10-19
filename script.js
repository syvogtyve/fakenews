// --- 1. REFERÊNCIAS AOS ELEMENTOS DO HTML ---
// Primeiro, pegamos todos os elementos HTML com os quais vamos interagir
// e os guardamos em variáveis para facilitar o acesso.

const chatArea = document.getElementById('chat-area');
const userForm = document.getElementById('user-form');
const userInput = document.getElementById('user-input');
const botResponseArea = document.getElementById('bot-response-area');
const feedbackButtons = document.getElementById('feedback-buttons');
const btnAcertou = document.getElementById('btn-acertou');
const btnErrou = document.getElementById('btn-errou');

// NOVAS REFERÊNCIAS PARA O MODAL DA DICA
const dicaEducativaContent = document.getElementById('dicaEducativaContent');
const dicaEducativaModalElement = document.getElementById('dicaEducativaModal');
// Inicializa o objeto Modal do Bootstrap no JS
const dicaEducativaModal = new bootstrap.Modal(dicaEducativaModalElement);
let dicaEducativaMostrada = false;



// --- 2. LÓGICA DE ADIVINHAÇÃO DO BOT ---

// Listas de palavras-chave que o bot usará para "adivinhar".
const palavrasFalsas = ["sempre", "nunca", "todos", "ninguém", "inacreditável", "chocante", "absurdo"];
const palavrasVerdadeiras = ["nasa", "oms", "instituto", "estudo", "pesquisa", "cientistas", "%"];

// Função que recebe a frase do usuário e tenta adivinhar se é fato ou mentira.
function adivinharFrase(frase) {
    const fraseLowerCase = frase.toLowerCase(); // Converte a frase para minúsculas para facilitar a busca.

    // Verifica se alguma palavra da lista "palavrasFalsas" está na frase.
    for (const palavra of palavrasFalsas) {
        if (fraseLowerCase.includes(palavra)) {
            return "MENTIRA"; // Se encontrar, o bot chuta que é mentira.
        }
    }

    // Verifica se alguma palavra da lista "palavrasVerdadeiras" está na frase.
    for (const palavra of palavrasVerdadeiras) {
        if (fraseLowerCase.includes(palavra)) {
            return "FATO"; // Se encontrar, o bot chuta que é fato.
        }
    }

    // Se não encontrou nenhuma palavra-chave, o bot chuta aleatoriamente.
    // Math.random() retorna um número entre 0 e 1. Se for maior que 0.5, é Fato. Senão, Mentira.
    return Math.random() > 0.5 ? "FATO" : "MENTIRA";
}

// --- 3. FUNÇÕES DE INTERAÇÃO COM A TELA ---

// Defina a URL da imagem do bot aqui
const BOT_PROFILE_PIC_URL = 'https://static.jojowiki.com/images/thumb/2/25/latest/20220711013122/PPP_HolHorse_Win.png/640px-PPP_HolHorse_Win.png'; 

// **ESTA É A FUNÇÃO CORRETA - MANTENHA APENAS ELA!**
function adicionarMensagem(texto, remetente) {
    
    // 1. Cria o contêiner da linha de chat
    const chatLine = document.createElement('div');
    chatLine.classList.add('chat-line');
    
    // 2. Cria a bolha de mensagem
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    bubble.textContent = texto;

    if (remetente === 'bot') {
        // Se for o bot, criamos a imagem
        const profilePic = document.createElement('img');
        profilePic.src = BOT_PROFILE_PIC_URL;
        profilePic.alt = 'Foto de perfil do Bot';
        profilePic.classList.add('bot-profile-pic');
        
        // Adiciona a imagem e a bolha na ordem correta: IMAGEM -> BOLHA
        chatLine.appendChild(profilePic);
        chatLine.appendChild(bubble);
        
        // Adiciona a classe específica do bot
        bubble.classList.add('bot-bubble'); 
        
    } else {
        // Se for o usuário, a estrutura é mais simples (apenas a bolha)
        chatLine.appendChild(bubble);
        chatLine.classList.add('user-line'); // Para alinhar à direita no CSS
        
        // Adiciona a classe específica do usuário
        bubble.classList.add('user-bubble'); 
    }

    // 3. Adiciona a linha completa (imagem + bolha) na área de chat
    chatArea.appendChild(chatLine); 

    // Faz a área de chat rolar para baixo para mostrar a última mensagem
    chatArea.scrollTop = chatArea.scrollHeight;
}


// 1. Array de mensagens quando o bot ACERTA o palpite
const mensagensAcertou = [
    "Eu sabia! A intuição não falha 😎",
    "É o Hol Horse, não tem jeito.",
    "Estou insuperável hoje, hein?",
    "Ez pro maior pistoleiro do Egito.",
    "Ah, essa estava na cara."
];

// 2. Array de mensagens quando o bot ERRA o palpite
const mensagensErrou = [
    "Ah, eu deixei você ganhar dessa vez, vai.",
    "Ah, mas aí também né...",
    "Isso não conta! Da próxima vez eu vou ganhar, pode escrever.",
    "Hmm, meu palpite falhou. Mas eu tenho culpa que você escreveu com tanta convicção?",
    "Não importa. Tenho o 'The Emperor', o imperador dos palpites... mas ele não quis se intrometer."
];


// 3. MENSAGEM ÚNICA (Em vez do Array de Dicas)
const MENSAGEM_FAKE_NEWS_LONGA = "Sejamos conscientes, presta atenção: a pergunta <b><i>“É verdade ou você tá viajando?”</i></b> não serve só para o título, também se aplica à vida real. O primeiro passo contra as <b>Fake News</b> é a dúvida. Se a notícia parece absurda demais, e ainda estiver em <b>grupo do WhatsApp ou Facebook</b>, provavelmente é ideia torta. Não seja bobo: use seu senso crítico e procure por <b>fontes confiáveis</b> para ter certeza. Não compartilhe <b>nada</b> antes disso. ";

// Função auxiliar para escolher uma mensagem aleatória de um array
function escolherMensagemAleatoria(mensagens) {
    // Math.random() retorna um número entre 0 e 1. Multiplicamos pelo tamanho do array.
    // Math.floor() arredonda para o menor inteiro, garantindo um índice válido (0 até length-1).
    const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
    return mensagens[indiceAleatorio];
}

// Função para reiniciar o jogo para a próxima rodada.
function reiniciarRodada() {
    botResponseArea.textContent = ''; // Limpa a resposta do bot
    feedbackButtons.classList.add('d-none'); // Esconde os botões de feedback
    userInput.value = ''; // Limpa a caixa de texto
    userInput.disabled = false; // Reabilita a caixa de texto
    userInput.focus(); // Coloca o cursor na caixa de texto

    // Mensagem do bot para a próxima rodada (AGORA É ALEATÓRIA)
    setTimeout(() => {
        // Escolhe uma mensagem aleatória do novo array
        const mensagemProximaRodada = escolherMensagemAleatoria(mensagensReiniciar); 
        adicionarMensagem(mensagemProximaRodada, 'bot');
    }, 1500); // Espera 1.5 segundos para a mensagem aparecer
}

// 4. Array de mensagens para reiniciar a rodada
const mensagensReiniciar = [
    "Manda outra aí, quero ver se você me engana agora!",
    "Pode mandar a próxima! O pai se garante.",
    "Me desafia de novo que eu quero ver!",
    "Pode desistir ainda não, me manda mais uma!",
    "Ok, ok. Só mais uma, que eu já tenho meus palpites."
];

// --- 4. EVENTOS DO JOGO (OUVINTES DE AÇÕES) ---

// Evento que acontece quando a página carrega pela primeira vez.
window.addEventListener('load', () => {
    adicionarMensagem("Opa! Eu sou o Bot do Hol Horse. Me desafie! Escreva uma frase, seja ela um fato ou algo que você acabou de inventar, e eu vou tentar adivinhar qual dos dois é.", 'bot');
    setTimeout(() => {
        adicionarMensagem("Lembrando que eu não consigo responder como uma IA, sou programado apenas para adivinhação. Pode começar!", 'bot');
    }, 3000);
});

// Evento que acontece quando o usuário envia o formulário (clica em "Enviar").
userForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede que a página recarregue ao enviar o formulário.

    const fraseUsuario = userInput.value; // Pega o texto que o usuário digitou.
    if (!fraseUsuario) return; // Se não digitou nada, não faz nada.

    adicionarMensagem(fraseUsuario, 'user'); // Mostra a mensagem do usuário na tela.
    userInput.disabled = true; // Desabilita o campo de texto enquanto o bot "pensa".

    // Simula o bot pensando por um tempo
    setTimeout(() => {
        const palpite = adivinharFrase(fraseUsuario); // Pega o palpite do bot.
        botResponseArea.textContent = `Hmm, isso me parece... um(a) ${palpite}!`; // Mostra o palpite.
        feedbackButtons.classList.remove('d-none'); // Mostra os botões "Acertou!" e "Errou!".
    }, 1500); // Espera 1.5 segundos
});

// Evento para o botão "Acertou!"
btnAcertou.addEventListener('click', () => {
    // Usa a nova função para pegar uma mensagem aleatória
    const mensagem = escolherMensagemAleatoria(mensagensAcertou);
    adicionarMensagem(mensagem, 'bot');
    reiniciarRodada(); 
});

// Evento para o botão "Errou!"
btnErrou.addEventListener('click', () => {
    const mensagem = escolherMensagemAleatoria(mensagensErrou);
    adicionarMensagem(mensagem, 'bot');

    // LÓGICA DO MODAL DA DICA
    if (dicaEducativaMostrada === false) {
        
        // 1. Injeta o conteúdo no modal
        dicaEducativaContent.innerHTML = `<p>${MENSAGEM_FAKE_NEWS_LONGA}</p>`;
        
        // 2. Espera um pouco para mostrar o modal
        setTimeout(() => {
            dicaEducativaModal.show(); // MOSTRA O MODAL!
            dicaEducativaMostrada = true; // Marca a flag como verdadeira
        }, 1500); 

        // IMPORTANTE: NÃO REINICIA AQUI. O JOGO SÓ REINICIA DEPOIS QUE O MODAL FOR FECHADO.
    } else {
        // Se a dica JÁ foi mostrada, reinicia a rodada imediatamente
        reiniciarRodada();
    }
});

// NOVO EVENTO: Garante que o jogo reinicie após o modal de Dica Educativa ser fechado.
dicaEducativaModalElement.addEventListener('hidden.bs.modal', function (event) {
    // Esta função será chamada sempre que o modal for fechado (pelo 'x' ou pelo botão 'Entendi').
    reiniciarRodada();
});

// FIM do script.js