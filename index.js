function Game()
{
    var vitesse = 30, fs = 25; //ms
    
    var self = this;

    self.handleGame = null;
    self.handlePlayer1 = null;
    self.handlePlayer2 = null;

    /**
     * 
     * @param {Personnage} player1 
     * @param {Personnage} player2 
     */
    self.start = function(player1, player2)
    {
        self.handleGame = setInterval(self.logiques,fs,player1,player2);
        self.handlePlayer1 = setInterval(player1.agir,vitesse);
        self.handlePlayer2 = setInterval(player2.agir,vitesse);
    };

    self.end = function()
    {
        clearInterval(self.handlePlayer1);
        clearInterval(self.handlePlayer2);
        clearInterval(self.handleGame);
    };

    /**
     * 
     * @param {Personnage} player1 
     * @param {Personnage} player2 
     */
    self.logiques = function(player1,player2)
    {
        alert("game started and i'm the logics");
        self.end();
    };

    self.pause = function()
    {
        alert("\t\t\t\t\t\t\tPause\n\n\t\t\t\t\tCliquez sur OK pour Play");
    };
}

var keyConfig = new KeyToCommand();
var position = new PositionPersonnage('gauche',0,0);
var puissances = [new PuissancePersonnage(0.3,0.2),new PuissancePersonnage(0.6,0.5),new PuissancePersonnage(1,0.7)];
var niveaux = new NiveauxPersonnage(2,[-1,12000,12000],[30,30,30],puissances);
var pouvoirs = [new PouvoirPersonnage('pouvoir','A',0.4,5),new PouvoirPersonnage('kamehameha','A',15,50)];

var Songoku = new Personnage('goku',keyConfig,100,100,position,niveaux,pouvoirs);

position = new PositionPersonnage('droite',870,0);
puissances = [new PuissancePersonnage(1,1)];
niveaux = new NiveauxPersonnage(0,[-1],[30],puissances);
pouvoirs = [new PouvoirPersonnage('pouvoir','A',1,5)];

var Jiren = new Personnage('jiren',null,100,100,position,niveaux,pouvoirs);

var game = new Game();

game.start(Songoku,Jiren);
