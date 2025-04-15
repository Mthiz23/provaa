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
}

// Classe Jogador
class Jogador extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.velocidade = 5; // Velocidade do movimento da nave
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

// Criação do jogador
const jogador = new Jogador(canvas.width / 2 - 25, canvas.height - 50, 50, 30, 'green');

// Função que gerencia o movimento do jogador
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

// Função do loop do jogo
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gerencia a entrada do teclado
    gerenciarEntradaTeclado();

    // Desenha o jogador
    jogador.desenhar();

    // Chama o loop de novo
    requestAnimationFrame(loop);
}

loop();
