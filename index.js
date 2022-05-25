/**Définition du jeu
 * 
 * @param {Personnage} player1 le premier personnage
 * @param {Personnage} player2 le deuxième personnage
 */
function Game(player1, player2)
{
    var vitesse_logiques = 25; //ms
    
    var self = this;

    self.handleGame = null;
    self.player1 = player1;
    self.player2 = player2;
    self.reconstitutionEnergie = null;

    self.reinit = function()
    {
        if(document.getElementById(self.player1.nom+'_control_check').checked)
        {
            self.player1.majControlleur(keyConfigPlayer1);
        }
        else
        {
            self.player1.majControlleur();
        }
        if(document.getElementById(self.player2.nom+'_control_check').checked)
        {
            self.player2.majControlleur(keyConfigPlayer2);
        }
        else
        {
            self.player2.majControlleur();
        }

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
        self.handleGame = setInterval(self.logiques,vitesse_logiques,player1,player2);
        self.player1.handleAction = setInterval(self.player1.agir,self.player1.vitesse,self.player2.position,self.player2.handleSprite);
        self.player2.handleAction = setInterval(self.player2.agir,self.player2.vitesse,self.player1.position,self.player1.handleSprite);
        
        if(self.player1.controlleur == 'user')
        {
            document.addEventListener("keydown",self.player1.keydownToBrain,false);
            document.addEventListener("keyup",self.player1.keyupToBrain,false);
        }
        else
        {
            self.player1.keydownEventSimulationListener = setInterval(self.player1.keydownToBrain,50,self.player1.keydownEventSimulation);
            self.player1.keyupEventSimulationListener = setInterval(self.player1.keyupToBrain,50,self.player1.keyupEventSimulation);
            self.player1.automatismeID = setInterval(self.player1.decisionAuto,25,self.player2.position);
            self.player1.decisionAuto(self.player2.position);
        }
        if(self.player2.controlleur == 'user')
        {
            document.addEventListener("keydown",self.player2.keydownToBrain,false);
            document.addEventListener("keyup",self.player2.keyupToBrain,false);
        }
        else
        {
            self.player2.keydownEventSimulationListener = setInterval(self.player2.keydownToBrain,50,self.player2.keydownEventSimulation);
            self.player2.keyupEventSimulationListener = setInterval(self.player2.keyupToBrain,50,self.player2.keyupEventSimulation);
            self.player2.automatismeID = setInterval(self.player2.decisionAuto,25,self.player1.position); // Isaky ny 25ms (!ampahavalontsegondra satria lasa tsy atteint mitsy le position) izy vao afaka miova decision
            self.player2.decisionAuto(self.player1.position); //Avy de alefa le action
        }

        self.reconstitutionEnergie = setInterval(function()
        {
            if(!player1.enDefenceSpecial && player1.energie < player1.energie_max)
            {
                player1.energie++;
                player1.barreEnergieRestant.style = 'width: '+player1.energie+'%';
            }
            if(!player2.enDefenceSpecialplayer2.energie < player2.energie_max)
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
        else
        {
            clearInterval(self.player1.keydownEventSimulationListener);
            clearInterval(self.player1.keyupEventSimulationListener);
            clearInterval(self.player1.automatismeID);
        }

        if(self.player2.controlleur == 'user')
        {
            document.removeEventListener("keydown",self.player2.keydownToBrain,false);
            document.removeEventListener("keyup",self.player2.keyupToBrain,false);
        }
        else
        {
            clearInterval(self.player2.keydownEventSimulationListener);
            clearInterval(self.player2.keyupEventSimulationListener);
            clearInterval(self.player2.automatismeID);
        }

        self.player1.action = 'R';
        self.player1.etat = '';
        self.player2.action = 'R';
        self.player2.etat = '';
        // Ovaina ko ny pos eto rah ny tokony ho izy: x y r

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
            }
            self.player2.arretPouvoirSpecial();
            if(self.player2.chargementPouvoirSpecial)
            {
                clearTimeout(self.player2.chargementPouvoirSpecial);
                self.player2.chargementPouvoirSpecial = null;
                self.player2.desactiverAnimationPouvoir();
            }
            // Augmenter l'énergie du perso touché
            self.player2.energie = self.player2.energie >= self.player2.energie_max? self.player2.energie_max : self.player2.energie+1;
            self.player2.majBarreEnergie();
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
            }
            self.player1.arretPouvoirSpecial();
            if(self.player1.chargementPouvoirSpecial)
            {
                clearTimeout(self.player1.chargementPouvoirSpecial);
                self.player1.chargementPouvoirSpecial = null;
                self.player1.desactiverAnimationPouvoir();
            }
            // Augmenter l'énergie du perso touché
            self.player1.energie = self.player1.energie >= self.player1.energie_max? self.player1.energie_max : self.player1.energie+1;
            self.player1.majBarreEnergie();
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
        alert("\t\t\t\t\t\t\t Pause\n\n\t\t\t\t\t\tClick OK to Play");
    };
}

var keyConfigPlayer1 = null;

keyConfigPlayer1 = new KeyToCommand();

var kamehamehaStyle = "@keyframes kamehameha {from{transform: rotate(0deg)} to{transform: rotate(360deg)}}";
var animationKamehameha = new elementdAnimation('kamehamehaanimation',1,-105,1,-22,270,kamehamehaStyle);
var position = new PositionPersonnage('gauche','',0,0);

var puissances = [new PuissancePersonnage(0.3,0.4),new PuissancePersonnage(0.6,0.7),new PuissancePersonnage(1,1)];
var niveaux = new NiveauxPersonnage(2,['initial','god','blue'],[-1,12000,12000],[40,32,25],[10,10,10],puissances);

var pouvoirs = [new PouvoirPersonnage('pouvoir','A',0.4,5),new PouvoirPersonnage('kamehameha','A',0.3,50,1000,animationKamehameha),new PouvoirPersonnage('teleportation','D',-1,10,0,null,'opacity: 0',40)];

var Songoku = new Personnage('goku',keyConfigPlayer1,200,100,position,niveaux,pouvoirs);

var keyConfigPlayer2 = null;

keyConfigPlayer2 = new KeyToCommand(37,38,39,40,75,77,79,76,56,73,80,170);

/*
        Jiren keys:

left          = 37;  // touche gauche
up            = 38;  // touche haut
right         = 39;  // touche droite
down          = 40;  // touche bas
box           = 75;  // K
kick          = 77;  // M
pouvoir       = 79;  // O
attackSpecial = 76;  // L
transform     = 56;  // 8
block         = 73;  // I
blockSpecial  = 80;  // P
pause         = 170; // touche Echap

*/

position = new PositionPersonnage('droite','',screen.width-150,0);
puissances = [new PuissancePersonnage(1,1)];
niveaux = new NiveauxPersonnage(0,['initial'],[-1],[25],[10],puissances);
pouvoirs = [new PouvoirPersonnage('pouvoirjiren','A',1,5),new PouvoirPersonnage('multiplepunch','A',0.5,50,0),new PouvoirPersonnage('bouclier','D',-1,10)];

var Jiren = new Personnage('jiren',keyConfigPlayer2,200,100,position,niveaux,pouvoirs);

var game = new Game(Songoku,Jiren);
