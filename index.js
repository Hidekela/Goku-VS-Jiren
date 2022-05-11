function Game(player1, player2)
{
    var vitesse = 30, fs = 25; //ms
    
    var self = this;

    self.handleGame = null;
    self.handlePlayer1 = null;
    self.handlePlayer2 = null;
    self.player1 = player1;
    self.player2 = player2;

    self.start = function()
    {
        self.handleGame = setInterval(self.logiques,fs,player1,player2);
        self.handlePlayer1 = setInterval(self.player1.agir,vitesse);
        self.handlePlayer2 = setInterval(self.player2.agir,vitesse);
        
        if(self.player1.controlleur == 'user')
        {
            document.addEventListener("keydown",self.player1.keydownToBrain,false);
            document.addEventListener("keyup",self.player1.keyupToBrain,false);
        }
        if(self.player2.controlleur == 'user')
        {
            document.addEventListener("keydown",self.player2.keydownToBrain,false);
            document.addEventListener("keyup",self.player2.keyupToBrain,false);
        }
    };

    self.end = function()
    {
        if(self.player1.controlleur == 'user')
        {
            document.removeEventListener("keydown",self.player1.keydownToBrain,false);
            document.removeEventListener("keyup",self.player1.keyupToBrain,false);
        }
        if(self.player2.controlleur == 'user')
        {
            document.removeEventListener("keydown",self.player2.keydownToBrain,false);
            document.removeEventListener("keyup",self.player2.keyupToBrain,false);
        }

        clearInterval(self.handlePlayer1);
        clearInterval(self.handlePlayer2);
        clearInterval(self.handleGame);
    };

    self.logiques = function()
    {
        if(player1.vie == 0) 
        {
            self.end(self.player1,self.player2);
            alert("Game is end!");
        }
    };

    self.pause = function()
    {
        alert("\t\t\t\t\t\t\tPause\n\n\t\t\t\t\tCliquez sur OK pour Play");
    };
}

var keyConfig = new KeyToCommand();
var position = new PositionPersonnage('gauche','',0,0);
var puissances = [new PuissancePersonnage(0.3,0.2),new PuissancePersonnage(0.6,0.5),new PuissancePersonnage(1,0.7)];
var niveaux = new NiveauxPersonnage(2,['initial','god','blue'],[-1,12000,12000],[10,10,10],puissances);
var pouvoirs = [new PouvoirPersonnage('pouvoir','A',0.4,5),new PouvoirPersonnage('kamehameha','A',15,50)];

var Songoku = new Personnage('goku',keyConfig,100,100,position,niveaux,pouvoirs);

position = new PositionPersonnage('droite','',870,0);
puissances = [new PuissancePersonnage(1,1)];
niveaux = new NiveauxPersonnage(0,['initial'],[-1],[10],puissances);
pouvoirs = [new PouvoirPersonnage('pouvoir','A',1,5)];

var Jiren = new Personnage('jiren',null,100,100,position,niveaux,pouvoirs);

var game = new Game(Songoku,Jiren);

game.start();
