function Game(player1, player2)
{
    var vitesse_logiques = 25; //ms
    
    var self = this;

    self.handleGame = null;
    self.player1 = player1;
    self.player2 = player2;

    self.start = function()
    {
        self.handleGame = setInterval(self.logiques,vitesse_logiques,player1,player2);
        self.player1.handleAction = setInterval(self.player1.agir,self.player1.vitesse,self.player2.position,self.player2.handleSprite);
        self.player2.handleAction = setInterval(self.player2.agir,self.player2.vitesse,self.player1.position,self.player1.handleSprite);
        
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

        clearInterval(self.player1.handleAction);
        clearInterval(self.player2.handleAction);
        clearInterval(self.handleGame);
    };

    self.logiques = function()
    {
        if(!player1.vie || !player2.vie) 
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

var keyConfigGoku = new KeyToCommand();
var kamehamehaStyle = "@keyframes kamehameha {from{transform: rotate(0deg)} to{transform: rotate(360deg)}}";
var animationKamehameha = new elementdAnimation('kamehamehaanimation',1,-105,1,-22,270,kamehamehaStyle);
var position = new PositionPersonnage('gauche','',0,0);
var puissances = [new PuissancePersonnage(0.3,0.2),new PuissancePersonnage(0.6,0.5),new PuissancePersonnage(1,0.7)];
var niveaux = new NiveauxPersonnage(2,['initial','god','blue'],[-1,12000,12000],[30,20,10],[10,10,10],puissances);
var pouvoirs = [new PouvoirPersonnage('pouvoir','A',0.4,5),new PouvoirPersonnage('kamehameha','A',15,50,1500,animationKamehameha),new PouvoirPersonnage('teleportation','D',15,10,0,null,'opacity: 0',40)];

var Songoku = new Personnage('goku',keyConfigGoku,100,100,position,niveaux,pouvoirs);

var keyConfigJiren = null;

// keyConfigJiren = new KeyToCommand(56,57,48,169,61,73,79,80,160,164,170);

/*
        Jiren keys:

left          = 56;  // touche 8 (non numpad)
up            = 57;  // touche 9 (non numpad)
right         = 48;  // touche 0 (non numpad)
down          = 169; // touche )
box           = 61;  // touche =
kick          = 73;  // I
pouvoir       = 79;  // O
attackSpecial = 80;  // P
transform     = 160; // touche ^
block         = 164; // touche $
blockSpecial  = 170; // touche *

*/

position = new PositionPersonnage('droite','',870,0);
puissances = [new PuissancePersonnage(1,1)];
niveaux = new NiveauxPersonnage(0,['initial'],[-1],[10],[10],puissances);
pouvoirs = [new PouvoirPersonnage('pouvoirjiren','A',1,5),new PouvoirPersonnage('multiplepunch','A',20,50,0),new PouvoirPersonnage('bouclier','D',20,10)];

var Jiren = new Personnage('jiren',keyConfigJiren,100,100,position,niveaux,pouvoirs);

var game = new Game(Songoku,Jiren);

game.start();
