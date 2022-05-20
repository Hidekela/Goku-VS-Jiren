function Game(player1, player2)
{
    var vitesse_logiques = 25; //ms
    
    var self = this;

    self.handleGame = null;
    self.player1 = player1;
    self.player2 = player2;
    self.reconstitutionEnergie = null;

    self.init = function()
    {
        self.player1.reinitialiser(0,self.player2.position,self.player2.handleSprite);
        self.player2.reinitialiser(screen.width-150,self.player1.position,self.player1.handleSprite);
        
        self.updateLifeBar(self.player1);
        self.updateLifeBar(self.player2);
    }

    self.updateLifeBar = function(player)
    {
        player.barreVieRestant.style = 'width: '+(player.vie > 0 ? player.vie*100/player.vie_max : '0')+'%';
    }

    self.start = function()
    {
        self.init();

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

        self.reconstitutionEnergie = setInterval(function()
        {
            if(player1.energie < player1.energie_max)
            {
                player1.energie++;
                player1.barreEnergieRestant.style = 'width: '+player1.energie+'%';
            }
            if(player2.energie < player2.energie_max)
            {
                player2.energie++;
                player2.barreEnergieRestant.style = 'width: '+player2.energie+'%';
            }
        },1000);
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

        self.player1.action = 'R';
        self.player1.etat = '';
        self.player2.action = 'R';
        self.player2.etat = '';

        clearInterval(self.player1.handleAction);
        clearInterval(self.player2.handleAction);
        clearInterval(self.reconstitutionEnergie);
        clearInterval(self.handleGame);

        var winner = self.player1.vie <= 0? self.player2.nom : self.player1.nom;
        var winnerShown = document.getElementById("winner");
        winnerShown.innerHTML = winner.toUpperCase() + ' WINS!';
        winnerShown.style = "animation: winning 3s;";

        setTimeout(function(){
            document.getElementById("restart_menu").style = 'display: block';
        }, 3000);

        document.getElementById("win_page").style = 'top: 0; opacity: 1; transition: opacity 1s';
    };

    self.logiques = function()
    {
        if(self.player1.vie <= 0 || self.player2.vie <= 0) 
        {
            self.end();
        }
        else if(self.player1.wantPause || self.player2.wantPause)
        {
            self.pause();
            self.player1.wantPause = false;
            self.player2.wantPause = false;
        }

        if(self.player1.toucherAdversaire && self.player2.valeurDefence != -1 && self.player1.valeurDegat > self.player2.valeurDefence)
        {
            self.player2.vie += self.player2.valeurDefence - self.player1.valeurDegat;
            self.player2.toucheParlAdversaire = true;
            self.updateLifeBar(self.player2);
            if(self.player1.lancementPouvoirSpecial)
            {
                self.player2.peutBouger = false;
                self.player2.majSprite();
                self.player2.arretPouvoirSpecial();
                if(self.player2.chargementPouvoirSpecial)
                {
                    clearTimeout(self.player2.chargementPouvoirSpecial);
                    self.player2.chargementPouvoirSpecial = null;
                    self.player2.desactiverAnimationPouvoir();
                }
            }
        }
        else if(!self.player1.lancementPouvoirSpecial && !self.player2.lancementPouvoirSpecial)
        {
            self.player2.peutBouger = true;
        }

        if(self.player2.toucherAdversaire && self.player1.valeurDefence != -1 && self.player2.valeurDegat > self.player1.valeurDefence)
        {
            self.player1.vie += self.player1.valeurDefence - self.player2.valeurDegat;
            self.player1.toucheParlAdversaire = true;
            self.updateLifeBar(self.player1);
            if(self.player2.lancementPouvoirSpecial)
            {
                self.player1.peutBouger = false;
                self.player1.majSprite();
                self.player1.arretPouvoirSpecial();
                if(self.player1.chargementPouvoirSpecial)
                {
                    clearTimeout(self.player1.chargementPouvoirSpecial);
                    self.player1.chargementPouvoirSpecial = null;
                    self.player1.desactiverAnimationPouvoir();
                }
            }
        }
        else if(!self.player2.lancementPouvoirSpecial && !self.player1.lancementPouvoirSpecial)
        {
            self.player1.peutBouger = true;
        }

        self.player1.toucherAdversaire = false;
        self.player2.toucherAdversaire = false;
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
var puissances = [new PuissancePersonnage(0.3,0.4),new PuissancePersonnage(0.6,0.7),new PuissancePersonnage(1,1)];
var niveaux = new NiveauxPersonnage(2,['initial','god','blue'],[-1,12000,12000],[30,20,10],[10,10,10],puissances);
var pouvoirs = [new PouvoirPersonnage('pouvoir','A',0.4,5),new PouvoirPersonnage('kamehameha','A',0.3,50,1000,animationKamehameha),new PouvoirPersonnage('teleportation','D',-1,10,0,null,'opacity: 0',40)];

// Natao mora maty fa tokony 200
var Songoku = new Personnage('goku',keyConfigGoku,50,100,position,niveaux,pouvoirs);

var keyConfigJiren = null;

keyConfigJiren = new KeyToCommand(56,57,48,169,61,73,79,80,160,164,170,27);

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
pause         = 170; // touche Echap

*/

position = new PositionPersonnage('droite','',screen.width-150,0);
puissances = [new PuissancePersonnage(1,1)];
niveaux = new NiveauxPersonnage(0,['initial'],[-1],[10],[10],puissances);
pouvoirs = [new PouvoirPersonnage('pouvoirjiren','A',1,5),new PouvoirPersonnage('multiplepunch','A',0.5,50,0),new PouvoirPersonnage('bouclier','D',-1,10)];

// Natao mora maty fa tokony 200
var Jiren = new Personnage('jiren',keyConfigJiren,50,100,position,niveaux,pouvoirs);

var game = new Game(Songoku,Jiren);
