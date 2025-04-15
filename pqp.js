// Obtendo o contexto do canvas
const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

// Classe base para entidades que vão ser desenhadas no jogo
class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    // Método para checar colisão com outra entidade
    colisao(outro) {
        return this.x < outro.x + outro.largura &&
               this.x + this.largura > outro.x &&
               this.y < outro.y + outro.altura &&
               this.y + this.altura > outro.y;
    }
}

// Classe Jogador
class Jogador extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.velocidade = 5;
    }

    mover(esquerda, direita) {
        if (esquerda && this.x > 0) {
            this.x -= this.velocidade;
        }
        if (direita && this.x + this.largura < canvas.width) {
            this.x += this.velocidade;
        }
    }
}

// Classe Projetil
class Projetil extends Entidade {
    constructor(x, y) {
        super(x, y, 5, 20, 'red');
        this.velocidade = 5;
    }

    atualizar() {
        this.y -= this.velocidade; // Move o projétil para cima
    }
}

// Classe Inimigo
class Inimigo extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.velocidade = 2;
    }

    mover() {
        this.y += this.velocidade; // Movimento do inimigo para baixo
    }
}

// Criando o jogador
const jogador = new Jogador(canvas.width / 2 - 25, canvas.height - 50, 50, 30, 'green');

// Array para armazenar os projéteis
let projeteis = [];

// Array para armazenar os inimigos
let inimigos = [];

// Gerenciar entrada do teclado
function gerenciarEntradaTeclado() {
    let esquerda = false;
    let direita = false;

    // Eventos de pressionamento das teclas
    window.addEventListener('keydown', (evento) => {
        if (evento.key === 'ArrowLeft') {
            esquerda = true;
        }
        if (evento.key === 'ArrowRight') {
            direita = true;
        }
        if (evento.key === ' ') { // Dispara um projétil quando a tecla de espaço é pressionada
            dispararProjetil();
        }
    });

    // Eventos de soltura das teclas
    window.addEventListener('keyup', (evento) => {
        if (evento.key === 'ArrowLeft') {
            esquerda = false;
        }
        if (evento.key === 'ArrowRight') {
            direita = false;
        }
    });

    jogador.mover(esquerda, direita);
}

// Função para disparar projétil
function dispararProjetil() {
    let projétil = new Projetil(jogador.x + jogador.largura / 2 - 2, jogador.y);
    projeteis.push(projétil);
}

// Função para criar inimigos
function criarInimigos() {
    for (let i = 0; i < 5; i++) {
        let inimigo = new Inimigo(100 + i * 60, 50, 40, 40, 'red');
        inimigos.push(inimigo);
    }
}

// Função para verificar colisão com o chão ou com os inimigos
function verificarColisao() {
    // Verificar colisão com o chão
    if (jogador.y + jogador.altura >= canvas.height) {
        gameOver();
    }

    // Verificar colisão com os inimigos
    for (let i = 0; i < inimigos.length; i++) {
        if (jogador.colisao(inimigos[i])) {
            gameOver();
        }
    }

    // Verificar se algum inimigo chegou ao chão
    for (let i = 0; i < inimigos.length; i++) {
        if (inimigos[i].y + inimigos[i].altura >= canvas.height) {
            gameOver();
        }
    }
}

// Função que mostra o game over
function gameOver() {
    alert("Game Over!");
    // Limpar os inimigos e projéteis
    inimigos = [];
    projeteis = [];
    // Parar o loop de animação
    cancelAnimationFrame(animationId);
}

// Função do loop do jogo
let animationId;
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gerencia a entrada do teclado
    gerenciarEntradaTeclado();

    // Atualiza e desenha o jogador
    jogador.desenhar();

    // Atualiza e desenha os projéteis
    for (let i = 0; i < projeteis.length; i++) {
        projeteis[i].atualizar();
        projeteis[i].desenhar();
        
        // Verifica colisão com os inimigos
        for (let j = 0; j < inimigos.length; j++) {
            if (projeteis[i].colisao(inimigos[j])) {
                // Se houve colisão, remover o inimigo e o projétil
                inimigos.splice(j, 1);
                projeteis.splice(i, 1);
                break; // Para evitar conflitos ao remover dentro do loop
            }
        }
    }

    // Atualiza e desenha os inimigos
    for (let i = 0; i < inimigos.length; i++) {
        inimigos[i].mover();
        inimigos[i].desenhar();
    }

    // Verifica colisões
    verificarColisao();

    // Chama o loop de novo
    animationId = requestAnimationFrame(loop);
}

// Cria inimigos no início
criarInimigos();

// Inicia o jogo
loop();
