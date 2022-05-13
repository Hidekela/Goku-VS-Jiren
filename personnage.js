// Définition des caractères d'un personnage

/**Position d'un personnage
 * 
 * @param {String} relative "gauche" ou "droite" (par rapport à son adversaire sur l'écran)
 * @param {String} place "air" ou "" ("air" si il vole, "" sinon)
 * @param {int} x position par rapport à l'axe des abscisses
 * @param {int} y position par rapport à l'axe des ordonnées
 */
function PositionPersonnage(relative, place, x, y)
{
    this.relative = relative;
    this.place = place;
    this.x = x;
    this.y = y;
}

/**Puissance d'un personnage
 * 
 * @param {float} attaque puissance de l'attaque
 * @param {float} defence puissance du défence
 */
function PuissancePersonnage(attaque, defence)
{
    this.attaque = attaque;
    this.defence = defence;
}

/**Pouvoir d'un personnage
 * 
 * @param {string} nom nom du pouvoir
 * @param {char} type 'A' ou 'D' (attaque ou défence)
 * @param {float} puissance valeur de dégat ou de protection
 * @param {float} energie_necessaire valeur de l'énergie nécessaire pour son utilisation
 */
function PouvoirPersonnage(nom, type, puissance, energie_necessaire)
{
    this.nom = nom;
    this.type = type;
    this.puissance = puissance;
    this.energie_necessaire = energie_necessaire;
}

/**Niveaux d'un personnage
 * 
 * @param {int} max le niveau maximal (~ nombre de niveau)
 * @param {string[]} noms tableau de noms pour chaque niveau
 * @param {int[]} durees tableau de durées de maintient de niveau
 * @param {int[]} vitesse tableau de vitesse du personnage à chaque niveau
 * @param {PuissancePersonnage[]} puissance tableau de puissance du personnage à chaque niveau
 */
function NiveauxPersonnage(max, noms, durees, vitesse, puissance)
{
    this.max = max;
    this.noms = noms;
    this.durees = durees;
    this.vitesse = vitesse;
    this.puissance = puissance;
}

/**Définition d'un personnage
 * 
 * @param {string} nom son nom
 * @param {KeyToCommand} keyConfig configuration de touche
 * @param {float} vie_max sa quantité de vie maximale
 * @param {float} energie_max sa quantité d'énergie maximale
 * @param {PositionPersonnage} position sa position
 * @param {NiveauxPersonnage} niveaux ses niveaux
 * @param {PouvoirPersonnage[]} pouvoirs ses pouvoirs
 */
function Personnage(nom, keyConfig, vie_max, energie_max, position, niveaux, pouvoirs)
{
    var self = this;

    self.handleAction = null;
    self.nom = nom;
    self.controlleur = keyConfig != null? 'user' : 'computer';
    self.vie = vie_max;
    self.energie = energie_max;
    self.position = position;
    self.liste_niveaux = niveaux;
    self.pouvoirs = pouvoirs;
    
    self.niveau = 0;
    self.nom_niveau = self.liste_niveaux.noms[0];
    self.durree_niveau = self.liste_niveaux.durees[0];
    self.vitesse = self.liste_niveaux.vitesse[0];
    self.puissance = self.liste_niveaux.puissance[0];

    self.handleSprite = document.getElementById(self.nom);
    self.avatar = document.getElementById('avatar'+self.nom);
    self.avatar.src = 'avatar/'+self.nom_niveau+self.nom+'.png';
    self.sprite = self.handleSprite.children[0];
    
    self.action = 'R';
    self.etat = '';
    self.deplacement = {
        x: '',
        y: '',
        relative: ''
    };

    self.nbbox = {
        max: 2,
        current: 1
    };

    self.nbkick = {
        max: 3,
        current: 1
    };

    self.keydownToBrain = null;
    self.keyupToBrain = null;
    self.agir = null;

    self.entrainDeSeTransformer = false;

    self.majAvatar = function()
    {
        self.avatar.src = 'avatar/'+self.nom_niveau+self.nom+'.png';
    }

    self.majSprite = function(transformation="")
    {
        self.sprite.style = "display: none";
        self.sprite = document.getElementById(self.nom+self.position.relative+self.nom_niveau+(self.etat? self.etat : (self.deplacement.relative == 'air' || !self.deplacement.relative? self.position.place+transformation : self.deplacement.relative)));
        self.sprite.style = "display: inline";
    }

    self.majPlace = function()
    {
        self.position.place = self.position.y > 0? 'air' : '';
    }

    self.faireRien = function()
    {
        self.deplacement.relative = self.position.y > 0 ? 'air' : '';
        self.majSprite();
    }

    self.doitSeDeplacer = function()
    {
        return self.deplacement.x != '' || self.deplacement.y != '';
    }

    self.seDeplacer = function(position_x_adversaire)
    {
        switch (self.deplacement.y) {
            case 'U':
                self.deplacement.relative = 'air';
                if(self.position.y < 410)
                    self.position.y += 10;
                break;
            case 'D':
                self.deplacement.relative = 'descend';
                if(self.position.y > 0)
                    self.position.y -= 10;
                break;
        }
        switch (self.deplacement.x) {
            case 'R':
                self.deplacement.relative = self.position.relative == 'gauche'? 'avance' : 'retour';
                if(self.position.x < 870)
                    self.position.x += 10;
                break;
            case 'L':
                self.deplacement.relative = self.position.relative == 'droite'? 'avance' : 'retour';
                if(self.position.x >= 0)
                    self.position.x -= 10;
                break;
        }

        self.majPlace();
        self.regarderAdversaire(position_x_adversaire);

        // Positionner le personnage au bon endroit
        self.handleSprite.style = 'left: '+self.position.x+'px;bottom: '+self.position.y+'px;';

        if(self.action == 'R')
        {
            self.majSprite();
        }
    }

    self.regarderAdversaire = function(position_x_adversaire)
    {
        self.position.relative = self.position.x < position_x_adversaire? 'gauche' : 'droite';
    }

    self.peutSeTransformer = function()
    {
        return self.liste_niveaux.max > self.niveau && !self.entrainDeSeTransformer;
    }

    self.seTransformer = function(position_adversaire)
    {
        if(self.peutSeTransformer())
        {
            ++self.niveau;
            self.majNiveau(position_adversaire);
            self.entrainDeSeTransformer = true;
        }
        self.majSprite("transformation");
    }

    self.majVitesse = function(position_adversaire)
    {
        clearInterval(self.handleAction);
        self.handleAction = setInterval(self.agir,self.vitesse,position_adversaire);
    }

    self.majNiveau = function(position_adversaire)
    {
        self.nom_niveau = self.liste_niveaux.noms[self.niveau];
        self.durree_niveau = self.liste_niveaux.durees[self.niveau];
        self.vitesse = self.liste_niveaux.vitesse[self.niveau];
        self.puissance = self.liste_niveaux.puissance[self.niveau];
        self.majAvatar();
        self.majVitesse(position_adversaire);
    }

    self.attaquer = function()
    {
        if(self.action[1] == 'K')
        {
            self.etat = 'daka'+self.nbkick.current;
            self.nbkick.current = self.nbkick.current == self.nbkick.max? 1 : self.nbkick.current+1;
        }
        else
        {
            self.etat = 'totondry'+self.nbbox.current;
            self.nbbox.current = self.nbbox.current == self.nbbox.max? 1 : self.nbbox.current+1;
        }
        self.majSprite();
    }

    self.bloquer = function()
    {
        self.etat = 'block';
        self.majSprite();
    }

    if(self.controlleur == 'user')
    {
        self.keydownToBrain = function(e)
        {
            switch (e.keyCode) {
                case keyConfig.box:
                    self.action = 'AB';
                    break;
    
                case keyConfig.kick:
                    self.action = 'AK';
                    break;
                    
                case keyConfig.pouvoir:
                    self.action = 'PO';
                    break;
    
                case keyConfig.attackSpecial:
                    self.action = 'PS';
                    break;
    
                case keyConfig.block:
                    self.action = 'DO';
                    break;
    
                case keyConfig.blockSpecial:
                    self.action = 'DS';
                    self.vie = 0;
                    break;
    
                case keyConfig.transform:
                    self.action = 'T';
                    break;
    
                case keyConfig.up:
                    self.deplacement.y = 'U';
                    break;
    
                case keyConfig.down:
                    self.deplacement.y = 'D';
                    break;
    
                case keyConfig.left:
                    self.deplacement.x = 'L';
                    break;
    
                case keyConfig.right:
                    self.deplacement.x = 'R';
                    break;
    
                default:
                    self.action = 'R';
                    break;
            }
        };

        self.keyupToBrain = function(e)
        {
            switch (e.keyCode) {
                case keyConfig.up:
                    self.deplacement.y = '';
                    break;
    
                case keyConfig.down:
                    self.deplacement.y = '';
                    break;
    
                case keyConfig.left:
                    self.deplacement.x = '';
                    break;
    
                case keyConfig.right:
                    self.deplacement.x = '';
                    break;
    
                default:
                    self.action = 'R';
                    break;
            }
        };

        self.agir = function(position_adversaire)
        {
            if(self.doitSeDeplacer())
            {
                self.seDeplacer(position_adversaire.x);
            }
            else if(self.action == 'R')
            {
                self.faireRien();
            }

            switch (self.action) {
                case 'T':
                    self.seTransformer(position_adversaire);                    
                    break;

                case 'AB':
                case 'AK':
                    self.attaquer();
                    break;

                case 'DO':
                    self.bloquer();
                    break;

                case 'R':
                    self.entrainDeSeTransformer = false;
                    self.etat = '';
                    break;
            
                default:
                    break;
            }
        };
    }
    else // controller is computer
    {
        self.agir = function()
        {
    
        };        
    }
}