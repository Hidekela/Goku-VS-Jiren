// Définition des caractères d'un personnage

/**Position d'un personnage
 * 
 * @param {String} relative "gauche" ou "droite" (par rapport à son adversaire sur l'écran)
 * @param {int} x position par rapport à l'axe des abscisses
 * @param {int} y position par rapport à l'axe des ordonnées
 */
function PositionPersonnage(relative, x, y)
{
    this.relative = relative;
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
 * @param {int[]} durees tableau de durées de maintient de niveau
 * @param {int[]} vitesse tableau de vitesse du personnage à chaque niveau
 * @param {PuissancePersonnage[]} puissance tableau de puissance du personnage à chaque niveau
 */
function NiveauxPersonnage(max, durees, vitesse, puissance)
{
    this.max = max;
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
    self.nom = nom;
    self.controlleur = keyConfig != null? 'user' : 'computer';
    self.vie = vie_max;
    self.energie = energie_max;
    self.position = position;
    self.liste_niveaux = niveaux;
    self.pouvoirs = pouvoirs;
    
    self.niveau = 0;
    self.vitesse = self.liste_niveaux.vitesse[0];
    self.puissance = self.liste_niveaux.puissance[0];
    self.avatar = 'avatar/'+self.niveau+self.nom+'.png';
    self.sprite = 'perso/'+self.position.relative+self.nom+'/'+self.niveau;
    
    self.action = 'R';
    self.deplacement = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    self.keydownToBrain = null;
    self.keyupToBrain = null;
    self.agir = null;

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
                    self.action = 'PB';
                    break;
    
                case keyConfig.attackSpecial:
                    self.action = 'PS';
                    break;
    
                case keyConfig.block:
                    self.action = 'BO';
                    break;
    
                case keyConfig.blockSpecial:
                    self.action = 'BS';
                    break;
    
                case keyConfig.transform:
                    self.action = 'T';
                    break;
    
                case keyConfig.up:
                    self.deplacement.up = true;
                    break;
    
                case keyConfig.down:
                    self.deplacement.down = true;
                    break;
    
                case keyConfig.left:
                    self.deplacement.left = true;
                    break;
    
                case keyConfig.right:
                    self.deplacement.right = true;
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
                    self.deplacement.up = false;
                    break;
    
                case keyConfig.down:
                    self.deplacement.down = false;
                    break;
    
                case keyConfig.left:
                    self.deplacement.left = false;
                    break;
    
                case keyConfig.right:
                    self.deplacement.right = false;
                    break;
    
                default:
                    self.action = 'R';
                    break;
            }
        };

        self.agir = function()
        {
            if(self.deplacement.up)
            {
                self.position.y += self.vitesse;
                if(self.action == 'R')
                {
                    
                }
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