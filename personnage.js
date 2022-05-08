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
 * @param {int} attaque puissance de l'attaque
 * @param {int} defence puissance du défence
 */
function PuissancePersonnage(attaque, defence)
{
    this.attaque = attaque;
    this.defence = defence;
}

/**Pouvoir d'un personnage
 * 
 * @param {string} nom nom du pouvoir
 * @param {int} type attaque ou défence
 * @param {int} puissance valeur de dégat ou de protection
 * @param {int} energie_necessaire valeur de l'énergie nécessaire pour son utilisation
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
 * @param {PuissancePersonnage[]} puissance tableau de puissance du personnage à chaque niveau
 */
function NiveauxPersonnage(max, durees, puissance)
{
    this.max = max;
    this.durees = durees;
    this.puissance = puissance;
}

/**Définition d'un personnage
 * 
 * @param {string} nom son nom
 * @param {int} vie_max sa quantité de vie maximale
 * @param {int} energie_max sa quantité d'énergie maximale
 * @param {PositionPersonnage} position sa position
 * @param {NiveauxPersonnage} niveaux ses niveaux
 * @param {PouvoirPersonnage} pouvoirs ses pouvoirs
 */
function Personnage(nom, vie_max, energie_max, position, niveaux, pouvoirs)
{
    this.nom = nom;
    this.vie = vie_max;
    this.energie = energie_max;
    this.position = position;
    this.liste_niveaux = niveaux;
    this.pouvoirs = pouvoirs;
    
    this.niveau = 0;
    this.puissance = this.liste_niveaux.puissance[0];
    this.avatar = 'avatar/'+this.niveau+this.nom+'.png';
    this.sprite = 'perso/'+this.position.relative+this.nom+'/'+this.niveau;
    
    this.action = 'R';
}