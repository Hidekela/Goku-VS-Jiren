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
 * @param {int} temps_chargement temps de chargement nécessaire pour son utilisation (0 si ce n'est pas précisé)
 * @param {elementdAnimation} animation_chargement objet contenant des propriétés nécessaire pour une animation pendant le chargement
 * @param {string} style style à affecter au sprite du personnage lors de lancement du pouvoir
 * @param {int} pas pas de déplacement du personnage lors de lancement du pouvoir
 */
function PouvoirPersonnage(nom, type, puissance, energie_necessaire,temps_chargement=0, animation_chargement=null, style='', pas=10)
{
    this.nom = nom;
    this.type = type;
    this.puissance = puissance;
    this.energie_necessaire = energie_necessaire;
    this.temps_chargement = temps_chargement;
    this.animation_chargement = animation_chargement;
    this.style = style;
    this.pas = pas;
}

/**Niveaux d'un personnage
 * 
 * @param {int} max le niveau maximal (~ nombre de niveau)
 * @param {string[]} noms tableau de noms pour chaque niveau
 * @param {int[]} durees tableau de durées de maintient de niveau
 * @param {int[]} vitesse tableau de vitesse du personnage à chaque niveau
 * @param {int[]} pas tableau de pas de déplacement du personnage à chaque niveau
 * @param {PuissancePersonnage[]} puissance tableau de puissance du personnage à chaque niveau
 */
function NiveauxPersonnage(max, noms, durees, vitesse, pas, puissance)
{
    this.max = max;
    this.noms = noms;
    this.durees = durees;
    this.vitesse = vitesse;
    this.pas = pas;
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
    self.vie_max = vie_max;
    self.vie = vie_max;
    self.energie_max = energie_max;
    self.energie = energie_max;
    self.position = position;
    self.liste_niveaux = niveaux;
    self.pouvoirs = pouvoirs;
    
    self.niveau = 0;
    self.nom_niveau = self.liste_niveaux.noms[0];
    self.durree_niveau = self.liste_niveaux.durees[0];
    self.vitesse = self.liste_niveaux.vitesse[0];
    self.pas = self.liste_niveaux.pas[0];
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

    self.nbpouvoir = {
        max: 10,
        current: 1
    }

    self.nbpouvoirspecial = {
        max: 3,
        current: 1
    }

    self.keydownToBrain = null;
    self.keyupToBrain = null;
    self.agir = null;

    /* Only for computer controller ******/
    self.keysdown = new Array();
    self.actionAuto = rand(0,8);
    self.ieme_sousActionAuto = 0;
    self.automatismeID = null;
    self.decisionAuto = null;
    self.keydownEventSimulation = {keyCode: 0};
    self.keyupEventSimulation = {keyCode: 0};
    self.keydownEventSimulationListener = null;
    self.keyupEventSimulationListener = null;
    /******                              */

    self.entrainDeSeTransformer = false;
    self.entrainDeBloquer = false;
    self.entrainDeChargerPouvoir = false;
    self.entrainDeChargerPouvoirSpecial = false;
    self.entrainDeChargerDefenceSpecial = false;
    self.peutSeDeplacer = true;
    self.peutBouger = true;
    self.pouvoirSpecialPres = false;
    self.enDefenceSpecial = false;
    self.chargementPouvoirSpecial = null;
    self.lancementPouvoirSpecial = null;

    self.wantPause = false;

    self.toucherAdversaire = false;
    self.valeurDefence = 0;
    self.valeurDegat = self.puissance.attaque;
    self.toucheParlAdversaire = false;

    self.barreVieRestant = document.getElementById('vie_restante_'+self.nom);
    self.barreEnergieRestant = document.getElementById('energie_restante_'+self.nom);

    self.controlleur = keyConfig? 'user' : 'computer';
    self.keyConfig = keyConfig? keyConfig : new KeyToCommand(-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12);
    /* 
            keyConfig :

    this.left          = -1;
    this.up            = -2;
    this.right         = -3;
    this.down          = -4;
    this.box           = -5;
    this.kick          = -6;
    this.pouvoir       = -7;
    this.attackSpecial = -8;
    this.transform     = -9;
    this.block         = -10;
    this.blockSpecial  = -11;
    this.pause         = -12;

    */

    var Terrain = document.body;
    
    // Stocker les éléments HTML pour optimiser l'affichage
    self.allSpritesId = [];
    self.allSprites = [];
    for(let i = 0, l = self.handleSprite.children.length; i < l; i++)
    {
        self.allSprites.push(self.handleSprite.children[i]);
        self.allSpritesId.push(self.allSprites[i].id);
    }

    // Ajout des éléments HTML styles dans la page
    self.animationPouvoirSpecialHandle = [];
    for(let i = 0; i < self.pouvoirs.length; i++)
    {
        if(self.pouvoirs[i].animation_chargement)
        {
            var style = document.createElement('style');
            style.innerHTML = self.pouvoirs[i].animation_chargement.style;
            document.body.appendChild(style);
            self.animationPouvoirSpecialHandle.push(document.getElementById(self.pouvoirs[i].animation_chargement.id));
        }
        else
        {
            
            self.animationPouvoirSpecialHandle.push(null);
        }
    }

    self.majBarreEnergie = function()
    {
        self.barreEnergieRestant.style = 'width: '+(self.energie > 0 ? self.energie*100/self.energie_max : '0')+'%';
    }

    self.majAvatar = function()
    {
        self.avatar.src = 'avatar/'+self.nom_niveau+self.nom+'.png';
    }

    self.majSprite = function(transformation="",positionTouched="")
    {
        self.sprite.style = "display: none";
        if(self.enDefenceSpecial)
            self.sprite = self.allSprites[self.allSpritesId.indexOf(self.nom+self.position.relative+self.nom_niveau+self.pouvoirs[2].nom)];
            // self.sprite = document.getElementById(self.nom+self.position.relative+self.nom_niveau+self.pouvoirs[2].nom);
        else if(self.lancementPouvoirSpecial)
            self.sprite = self.allSprites[self.allSpritesId.indexOf(self.nom+self.position.relative+self.nom_niveau+self.pouvoirs[1].nom)];
            // self.sprite = document.getElementById(self.nom+self.position.relative+self.nom_niveau+self.pouvoirs[1].nom);
        else if(self.toucheParlAdversaire)
            self.sprite = self.allSprites[self.allSpritesId.indexOf(self.nom+self.position.relative+self.nom_niveau+'touched'+(positionTouched? positionTouched : 'top'))];
        else
            self.sprite = self.allSprites[self.allSpritesId.indexOf(self.nom+self.position.relative+self.nom_niveau+(self.etat? self.etat : (self.deplacement.relative == 'air' || !self.deplacement.relative? self.position.place+transformation : self.deplacement.relative)))];
            // self.sprite = document.getElementById(self.nom+self.position.relative+self.nom_niveau+(self.etat? self.etat : (self.deplacement.relative == 'air' || !self.deplacement.relative? self.position.place+transformation : self.deplacement.relative)));
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

    self.majPosition = function()
    {
        self.handleSprite.style = 'left: '+self.position.x+'px;bottom: '+self.position.y+'px;'+(self.enDefenceSpecial? self.pouvoirs[2].style : '');
    }

    self.doitSeDeplacer = function()
    {
        return self.peutSeDeplacer && (self.deplacement.x != '' || self.deplacement.y != '');
    }

    self.seDeplacer = function(position_x_adversaire)
    {
        switch (self.deplacement.y) {
            case 'U':
                self.deplacement.relative = 'air';
                if(self.position.y < document.body.clientHeight-self.handleSprite.clientHeight)
                    self.position.y += self.pas;
                break;
            case 'D':
                self.deplacement.relative = 'descend';
                if(self.position.y > 0)
                    self.position.y -= self.pas;
                break;
        }
        if(self.action == 'R')
        {
            switch (self.deplacement.x) {
                case 'R':
                    self.deplacement.relative = self.position.relative == 'gauche'? 'avance' : 'retour';
                    if(self.position.x < screen.width-self.handleSprite.clientWidth+self.pas)
                        self.position.x += self.pas;
                    break;
                case 'L':
                    self.deplacement.relative = self.position.relative == 'droite'? 'avance' : 'retour';
                    if(self.position.x >= 0)
                        self.position.x -= self.pas;
                    break;
            }
        }

        self.majPlace();
        self.regarderAdversaire(position_x_adversaire);

        // Positionner le personnage au bon endroit
        self.majPosition();

        if(self.action == 'R')
        {
            self.majSprite();
        }
    }

    self.regarderAdversaire = function(position_x_adversaire)
    {
        self.position.relative = self.position.x <= position_x_adversaire? 'gauche' : 'droite';
    }

    self.peutSeTransformer = function()
    {
        return self.liste_niveaux.max > self.niveau && !self.entrainDeSeTransformer && !self.enDefenceSpecial;
    }

    self.seTransformer = function(position_adversaire,handle_sprite_adversaire)
    {
        if(self.peutSeTransformer())
        {
            ++self.niveau;
            self.majNiveau(position_adversaire,handle_sprite_adversaire);
            self.entrainDeSeTransformer = true;
        }

        self.majSprite("transformation");
    }

    self.majVitesse = function(position_adversaire,handle_sprite_adversaire)
    {
        clearInterval(self.handleAction);
        self.handleAction = setInterval(self.agir,self.vitesse,position_adversaire,handle_sprite_adversaire);
    }

    self.majNiveau = function(position_adversaire,handle_sprite_adversaire)
    {
        self.nom_niveau = self.liste_niveaux.noms[self.niveau];
        self.durree_niveau = self.liste_niveaux.durees[self.niveau];
        self.vitesse = self.liste_niveaux.vitesse[self.niveau];
        self.puissance = self.liste_niveaux.puissance[self.niveau];
        self.majAvatar();
        self.majVitesse(position_adversaire,handle_sprite_adversaire);
    }

    self.attaquer = function(position_adversaire,handle_sprite_adversaire,position_x_adversaire)
    {
        if(self.enDefenceSpecial)
            return;

        self.regarderAdversaire(position_x_adversaire);
        self.desactiverAnimationPouvoir();

        if(self.action[1] == 'K')
        {
            self.etat = 'daka'+self.nbkick.current;
            self.nbkick.current = anneauxIncrementation(self.nbkick);
        }
        else
        {
            self.etat = 'totondry'+self.nbbox.current;
            self.nbbox.current = anneauxIncrementation(self.nbbox);
        }
        self.majSprite();
        
        if(position_adversaire.y+handle_sprite_adversaire.clientHeight/2-self.handleSprite.clientHeight < self.position.y && self.position.y < position_adversaire.y+handle_sprite_adversaire.clientHeight-handle_sprite_adversaire.clientHeight/2)
        {
            if(self.position.relative == 'gauche' && self.position.x > position_adversaire.x+(handle_sprite_adversaire.clientWidth/2)-self.handleSprite.clientWidth)
            {   
                self.valeurDegat = self.puissance.attaque;
                self.toucherAdversaire = true;
            }
            else if(self.position.relative == 'droite' && self.position.x < position_adversaire.x+(handle_sprite_adversaire.clientWidth/2))
            {
                self.valeurDegat = self.puissance.attaque;
                self.toucherAdversaire = true;
            }
        }
    }

    self.bloquer = function(position_x_adversaire)
    {
        if(self.valeurDefence != self.puissance.defence)
            self.valeurDefence = self.puissance.defence;
        
        if(self.entrainDeBloquer || self.enDefenceSpecial)
            return;

        self.desactiverAnimationPouvoir();
        self.etat = 'block';
        self.regarderAdversaire(position_x_adversaire);
        self.majSprite();
        self.entrainDeBloquer = true;
    }

    self.avoirEnergiePlusDe = function(valeur)
    {
        return self.energie >= valeur;
    }

    self.chargePouvoir = function(position_x_adversaire)
    {
        if(self.entrainDeChargerPouvoir || self.enDefenceSpecial)
            return;

        if(!self.avoirEnergiePlusDe(self.pouvoirs[0].energie_necessaire))
            return;
        
        self.regarderAdversaire(position_x_adversaire);
        self.desactiverAnimationPouvoir();
        self.etat = self.pouvoirs[0].nom;
        self.majSprite();
        self.entrainDeChargerPouvoir = true;
    }

    self.lancerPouvoir = function(position_adversaire,handle_sprite_adversaire,position_x_adversaire)
    {
        self.regarderAdversaire(position_x_adversaire);
        var sprite_pouvoir = document.getElementById(self.pouvoirs[0].nom+self.position.relative+self.nbpouvoir.current);
        var pouvoirPosition = {
            x: self.position.x+(self.position.relative == 'gauche'? self.handleSprite.clientWidth : -sprite_pouvoir.clientWidth),
            y: self.position.y+self.handleSprite.clientHeight/2
        };

        var positionRelative = self.position.relative; // Eviter le pouvoir qui revient quand on change de position relative
        
        self.nbpouvoir.current = anneauxIncrementation(self.nbpouvoir);

        var pouvoirMouvement = setInterval(function(){
            sprite_pouvoir.style = "opacity: 1; left: "+pouvoirPosition.x+"px; bottom: "+pouvoirPosition.y+"px";
            if(positionRelative == "gauche")
            {
                if(position_adversaire.y-sprite_pouvoir.clientHeight < pouvoirPosition.y && pouvoirPosition.y < position_adversaire.y+handle_sprite_adversaire.clientHeight && pouvoirPosition.x+sprite_pouvoir.clientWidth >= position_adversaire.x+handle_sprite_adversaire.clientWidth && pouvoirPosition.x <= position_adversaire.x+handle_sprite_adversaire.clientWidth)
                {
                    self.valeurDegat = self.pouvoirs[0].puissance;
                    self.toucherAdversaire = true;
                    sprite_pouvoir.style = "opacity: 0";
                    clearInterval(pouvoirMouvement);
                }
                else if(pouvoirPosition.x >= screen.width - sprite_pouvoir.clientWidth/2)
                {
                    sprite_pouvoir.style = "opacity: 0";
                    clearInterval(pouvoirMouvement);
                }
                pouvoirPosition.x+=25;
            }
            else
            {
                if(position_adversaire.y-sprite_pouvoir.clientHeight < pouvoirPosition.y && pouvoirPosition.y < position_adversaire.y+handle_sprite_adversaire.clientHeight && pouvoirPosition.x <= position_adversaire.x && pouvoirPosition.x + sprite_pouvoir.clientWidth >= position_adversaire.x)
                {
                    self.valeurDegat = self.pouvoirs[0].puissance;
                    self.toucherAdversaire = true;
                    sprite_pouvoir.style = "opacity: 0";
                    clearInterval(pouvoirMouvement);
                }
                else if(pouvoirPosition.x <= 0)
                {
                    sprite_pouvoir.style = "opacity: 0";
                    clearInterval(pouvoirMouvement);
                }
                pouvoirPosition.x-=25;
            }
        },30);

        self.energie -= self.pouvoirs[0].energie_necessaire;
        self.majBarreEnergie();
    }

    self.chargePouvoirSpecial = function(position_x_adversaire)
    {
        if(self.enDefenceSpecial)
            return;

        if(!self.avoirEnergiePlusDe(self.pouvoirs[1].energie_necessaire))
            return;
        
        if(!self.chargementPouvoirSpecial)
        {
            self.chargementPouvoirSpecial = setTimeout(function(){
                self.pouvoirSpecialPres = self.etat == self.pouvoirs[1].nom+'chargement';
                clearTimeout(self.chargementPouvoirSpecial);
                self.chargementPouvoirSpecial = null;
            },self.pouvoirs[1].temps_chargement);
        }

        if(self.pouvoirs[1].animation_chargement)
        {
            var x, y = self.pouvoirs[1].animation_chargement.ay*self.position.y + self.pouvoirs[1].animation_chargement.by;
            
            if(self.position.relative == 'droite')
                x = self.pouvoirs[1].animation_chargement.ax*self.position.x + self.handleSprite.clientWidth - self.pouvoirs[1].animation_chargement.bx - self.pouvoirs[1].animation_chargement.width_element;
            else
                x = self.pouvoirs[1].animation_chargement.ax*self.position.x + self.pouvoirs[1].animation_chargement.bx;
            
                self.animationPouvoirSpecialHandle[1].style = "animation: "+self.pouvoirs[1].nom+" 3s linear infinite;display: block; left: "+x+"px; bottom: "+y+"px";
        }
            
        self.regarderAdversaire(position_x_adversaire);
        self.majSprite();
        
        if(self.entrainDeChargerPouvoirSpecial)
            return;

        self.etat = self.pouvoirs[1].nom+'chargement';
        self.entrainDeChargerPouvoirSpecial = true;
    }

    self.desactiverAnimationPouvoir = function()
    {
        for(let i = 0; i < self.pouvoirs.length; i++)
        {
            if(self.pouvoirs[i].animation_chargement)
                self.animationPouvoirSpecialHandle[i].style = "";
        }
    }

    self.lancerPouvoirSpecial = function(position_adversaire,handle_sprite_adversaire,position_x_adversaire)
    {
        self.desactiverAnimationPouvoir();

        clearTimeout(self.chargementPouvoirSpecial);
        self.chargementPouvoirSpecial = null;

        if(!self.pouvoirSpecialPres)
            return;

        self.regarderAdversaire(position_x_adversaire);

        self.pouvoirSpecialPres = false;
        self.peutSeDeplacer = false;
        self.peutBouger = false;
        self.etat = self.pouvoirs[1].nom;
        var sprite_pouvoir_special = document.getElementById(self.pouvoirs[1].nom+self.position.relative+self.nbpouvoirspecial.current);
        var pouvoirSpecialPosition = {
            x: self.position.x+(self.position.relative == 'gauche'? self.handleSprite.clientWidth : -sprite_pouvoir_special.clientWidth),
            y: self.position.y+(self.handleSprite.clientHeight - sprite_pouvoir_special.clientHeight)/2
        };

        self.majSprite();

        self.lancementPouvoirSpecial = setInterval(function(){
            var half_width_adversaire = handle_sprite_adversaire.clientWidth/2;
            if(self.position.relative == 'gauche' && position_adversaire.y-sprite_pouvoir_special.clientHeight < pouvoirSpecialPosition.y && pouvoirSpecialPosition.y < position_adversaire.y+handle_sprite_adversaire.clientHeight && pouvoirSpecialPosition.x+sprite_pouvoir_special.clientWidth > position_adversaire.x + half_width_adversaire && position_adversaire.x+half_width_adversaire >= pouvoirSpecialPosition.x)
            {
                self.valeurDegat = self.pouvoirs[1].puissance;
                self.toucherAdversaire = true;
            }
            else if(self.position.relative == 'droite' && position_adversaire.y-sprite_pouvoir_special.clientHeight < pouvoirSpecialPosition.y && pouvoirSpecialPosition.y < position_adversaire.y+handle_sprite_adversaire.clientHeight && pouvoirSpecialPosition.x < position_adversaire.x+half_width_adversaire && position_adversaire.x+half_width_adversaire <= pouvoirSpecialPosition.x+sprite_pouvoir_special.clientWidth)
            {
                self.valeurDegat = self.pouvoirs[1].puissance;
                self.toucherAdversaire = true;
            }
    
            self.nbpouvoirspecial.current = anneauxIncrementation(self.nbpouvoirspecial);
            sprite_pouvoir_special.style = "opacity: 0";
            sprite_pouvoir_special = document.getElementById(self.pouvoirs[1].nom+self.position.relative+self.nbpouvoirspecial.current);
            sprite_pouvoir_special.style = "opacity: 1; left: "+pouvoirSpecialPosition.x+"px; bottom: "+pouvoirSpecialPosition.y+"px";
        },50);

        setTimeout(self.arretPouvoirSpecial,5000);

        self.energie -= self.pouvoirs[1].energie_necessaire;
        self.majBarreEnergie();
    }

    self.arretPouvoirSpecial = function(){
        if(self.lancementPouvoirSpecial)
        {
            clearInterval(self.lancementPouvoirSpecial);
            document.getElementById(self.pouvoirs[1].nom+self.position.relative+self.nbpouvoirspecial.current).style = "opacity: 0";
            self.peutSeDeplacer = true;
            self.peutBouger = true;
            self.etat = '';
            self.lancementPouvoirSpecial = null;
        }
    };

    self.activerDefenceSpecial = function()
    {
        if(!self.avoirEnergiePlusDe(self.pouvoirs[2].energie_necessaire))
            return;

        if(self.pouvoirs[2].style)
            self.handleSprite.style = self.pouvoirs[2].style;

        self.pas = self.pouvoirs[2].pas;

        self.enDefenceSpecial = true;
        self.valeurDefence = self.pouvoirs[2].puissance;

        self.energie -= self.pouvoirs[2].energie_necessaire;
        self.majBarreEnergie();
    }

    self.desactiverDefenceSpecial = function()
    {
        self.handleSprite.style = 'left: '+self.position.x+'px;bottom: '+self.position.y+'px;';
        self.pas = self.liste_niveaux.pas[self.niveau];
        self.enDefenceSpecial = false;
        self.valeurDefence = 0;
    }

    self.defenceSpecial = function(position_x_adversaire)
    {
        if(self.entrainDeChargerDefenceSpecial)
            return;

        self.desactiverAnimationPouvoir();
        
        self.etat = self.pouvoirs[2].nom;
        self.regarderAdversaire(position_x_adversaire);
        self.majSprite();
        self.entrainDeChargerDefenceSpecial = true;
    }

    self.keydownToBrain = function(e)
    {
        switch (e.keyCode) {
            case self.keyConfig.box:
                self.action = 'AB';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.kick:
                self.action = 'AK';
                self.toucheParlAdversaire = false;
                break;
                
            case self.keyConfig.pouvoir:
                self.action = 'PO';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.attackSpecial:
                self.action = 'PS';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.block:
                self.action = 'DO';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.blockSpecial:
                self.action = 'DS';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.transform:
                self.action = 'T';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.up:
                self.deplacement.y = 'U';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.down:
                self.deplacement.y = 'D';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.left:
                self.deplacement.x = 'L';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.right:
                self.deplacement.x = 'R';
                self.toucheParlAdversaire = false;
                break;

            case self.keyConfig.pause:
                self.wantPause = true;
                break;

            default:
                break;
        }
        return;
    };

    self.keyupToBrain = function(e)
    {
        switch (e.keyCode) {
            case self.keyConfig.up:
                self.deplacement.y = '';
                break;

            case self.keyConfig.down:
                self.deplacement.y = '';
                break;

            case self.keyConfig.left:
                self.deplacement.x = '';
                break;

            case self.keyConfig.right:
                self.deplacement.x = '';
                break;

            case self.keyConfig.box:
            case self.keyConfig.kick:
            case self.keyConfig.pouvoir:
            case self.keyConfig.attackSpecial:
            case self.keyConfig.block:
            case self.keyConfig.blockSpecial:    
            case self.keyConfig.transform:
                self.action = 'R';
                self.toucheParlAdversaire = false;
                break;

            default:
                break;
        }

        if(self.controlleur == 'computer')
        {
            e.keyCode = 0;
        }
        return;
    };

    self.agir = function(position_adversaire,handle_sprite_adversaire)
    {
        if(!self.peutBouger)
            return;
            
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
                self.seTransformer(position_adversaire,handle_sprite_adversaire);
                break;

            case 'AB':
            case 'AK':
                self.attaquer(position_adversaire,handle_sprite_adversaire,position_adversaire.x);
                self.toucheParlAdversaire = false;
                break;

            case 'DO':
                self.bloquer(position_adversaire.x);
                break;

            case 'PO':
                self.chargePouvoir(position_adversaire.x);
                break;

            case 'PS':
                self.chargePouvoirSpecial(position_adversaire.x);
                break;

            case 'DS':
                self.defenceSpecial(position_adversaire.x);
                break;

            case 'R':
                switch (self.etat) {
                    case self.pouvoirs[0].nom:
                        self.lancerPouvoir(position_adversaire,handle_sprite_adversaire,position_adversaire.x);
                        break;

                    case self.pouvoirs[1].nom+'chargement':
                        self.lancerPouvoirSpecial(position_adversaire,handle_sprite_adversaire,position_adversaire.x);
                        break;

                    case self.pouvoirs[2].nom:
                        if(self.enDefenceSpecial)
                            self.desactiverDefenceSpecial();
                        else
                            self.activerDefenceSpecial();
                        break;
                
                    default:
                        if(!self.enDefenceSpecial)
                            self.valeurDefence = 0;
                        break;
                }
                self.entrainDeSeTransformer = false;
                self.entrainDeBloquer = false;
                self.entrainDeChargerPouvoir = false;
                self.entrainDeChargerPouvoirSpecial = false;
                self.entrainDeChargerDefenceSpecial = false;
                self.etat = '';
                break;
        
            default:
                break;
        }
    };

    self.majControlleur = function(keyConfig=null)
    {
        self.keyConfig = keyConfig? keyConfig : new KeyToCommand(-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12);
        self.controlleur = keyConfig? 'user' : 'computer';
    }

    self.reinitialiser = function(position_x,position_adversaire,handle_sprite_adversaire)
    {
        self.position.x = position_x;
        self.position.y = 0;
        self.position.relative = position_x? 'gauche' : 'droite';
        self.action = 'R';
        self.etat = '';
        self.deplacement.x = '';
        self.deplacement.y = '';
        self.deplacement.relative = '';

        self.vie = self.vie_max;
        self.energie = self.energie_max;

        self.majBarreEnergie();
        

        if(self.controlleur == 'computer')// Pour les persos auto
        {
            self.actionAuto = rand(0,8);
            self.niveau = self.liste_niveaux.max;
            self.majNiveau(position_adversaire,handle_sprite_adversaire);
        }
        else
        {
            self.niveau = 0;
            self.majNiveau(position_adversaire,handle_sprite_adversaire);
        }

        self.pas = self.liste_niveaux.pas[self.niveau];
        
        self.entrainDeSeTransformer = false;
        self.entrainDeBloquer = false;
        self.entrainDeChargerPouvoir = false;
        self.entrainDeChargerPouvoirSpecial = false;
        self.entrainDeChargerDefenceSpecial = false;
        self.peutSeDeplacer = true;
        self.peutBouger = true;
        self.pouvoirSpecialPres = false;
        self.enDefenceSpecial = false;
        if(!self.chargementPouvoirSpecial)
        {
            clearTimeout(self.chargementPouvoirSpecial);
            self.chargementPouvoirSpecial = null;
        }
        self.desactiverAnimationPouvoir();

        self.wantPause = false;

        self.toucherAdversaire = false;
        self.valeurDefence = 0;
        self.valeurDegat = self.puissance.attaque;
        self.toucheParlAdversaire = false;

        for(let i = 1; i <= self.nbpouvoirspecial.max; i++)
        {
            document.getElementById(self.pouvoirs[1].nom+"gauche"+i).style = "opacity: 0";
            document.getElementById(self.pouvoirs[1].nom+"droite"+i).style = "opacity: 0";
        }
        self.arretPouvoirSpecial();
        self.seDeplacer(position_adversaire.x);

    }

    //Les actions automatiques pour les personnages non controlés par l'utilisateurs

    function pushInKeysdownIfNotIn(val)
    {
        if(self.keysdown.indexOf(val) == -1){
            self.keysdown.push(val);
        }
    }
    
    function popInKeysdown(val)
    {
        self.keysdown.splice(self.keysdown.indexOf(val),1);
    }

    function avancer(position_adversaire)
    {
        if(position_adversaire.relative == 'gauche' && position_adversaire.x+60 < self.position.x && self.action == 'R') // Action == 'R' pour éviter l'arret du mouvement en cas d'érreur
        {
            self.keydownEventSimulation.keyCode = -1;
            popInKeysdown(-3);
            pushInKeysdownIfNotIn(-1);
        }
        else if(position_adversaire.relative == 'droite' && position_adversaire.x > self.position.x+60 && self.action == 'R')
        {
            self.keydownEventSimulation.keyCode = -3;
            popInKeysdown(-1);
            pushInKeysdownIfNotIn(-3);
        }
        else
            self.ieme_sousActionAuto++;
    }

    function reculer(position_adversaire)
    {
        var x_rand = rand(0,Terrain.clientWidth);
        if(self.position.x <= 0 || self.position.x >= Terrain.clientWidth - self.sprite.clientWidth)
            self.ieme_sousActionAuto++;
        else if(position_adversaire.relative == 'droite' && position_adversaire.x < self.position.x + x_rand)
        {
            self.keydownEventSimulation.keyCode = -1;
            popInKeysdown(-3);
            pushInKeysdownIfNotIn(-1);
        }
        else if(position_adversaire.relative == 'gauche' && position_adversaire.x + x_rand > self.position.x)
        {
            self.keydownEventSimulation.keyCode = -3;
            popInKeysdown(-1);
            pushInKeysdownIfNotIn(-3);
        }
        else
            self.ieme_sousActionAuto++;
    }

    function se_mettre_derriere(position_adversaire)
    {
        if(position_adversaire.x <= 0 || position_adversaire.x >= Terrain.clientWidth - self.sprite.clientWidth)
            self.ieme_sousActionAuto++;
        else if(position_adversaire.relative == 'gauche' && self.position.x > position_adversaire.x)
        {
            self.keydownEventSimulation.keyCode = -1;
            popInKeysdown(-3);
            pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        }
        else if(position_adversaire.relative == 'droite' && self.position.x < position_adversaire.x)
        {
            self.keydownEventSimulation.keyCode = -3;
            popInKeysdown(-1);
            pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        }
        else
            self.ieme_sousActionAuto++;
    }

    function se_mettre_au_milieu_terrain()
    {
        if(self.position.x-60 > Terrain.clientWidth/2)
        {
            self.keydownEventSimulation.keyCode = -1;
            popInKeysdown(-3);
            pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        }
        else if(self.position.x+60 < Terrain.clientWidth/2)
        {
            self.keydownEventSimulation.keyCode = -3;
            popInKeysdown(-1);
            pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        }
        else
            self.ieme_sousActionAuto++;
    }

    function atteindre_hauteur(position_adversaire)
    {
        if(position_adversaire.y+60 < self.position.y)
        {
            self.keydownEventSimulation.keyCode = -4;
            popInKeysdown(-2);
            pushInKeysdownIfNotIn(-4);
        }
        else if(position_adversaire.y > self.position.y+60)
        {
            self.keydownEventSimulation.keyCode = -2;
            popInKeysdown(-4);
            pushInKeysdownIfNotIn(-2);
        }
        else
            self.ieme_sousActionAuto++;
    }

    function eviter_hauteur()
    {
        var y_rand = rand(0,Terrain.clientHeight);
        if(y_rand < self.position.y-200)
        {
            self.keydownEventSimulation.keyCode = -4;
            popInKeysdown(-2);
            pushInKeysdownIfNotIn(-4);
        }
        else if(y_rand > self.position.y+200)
        {
            self.keydownEventSimulation.keyCode = -2;
            popInKeysdown(-4);
            pushInKeysdownIfNotIn(-2);
        }
        else
            self.ieme_sousActionAuto++;
    }

    function arret_deplacement_x()
    {
        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function arret_deplacement_y()
    {
        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function attaquer()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        self.keydownEventSimulation.keyCode = rand(-6,-5);
        pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        self.ieme_sousActionAuto++;
    }

    function arreter_attaque()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function charger_pouvoir()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        if(!self.avoirEnergiePlusDe(self.pouvoirs[0].energie_necessaire))
        {
            // Va pour l'action "s'approcher puis kick/box"
            self.actionAuto = 0;
            self.ieme_sousActionAuto = 0;
            self.keydownEventSimulation.keyCode = -7;
            pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
            return;
        }

        self.keydownEventSimulation.keyCode = -7;
        pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        self.ieme_sousActionAuto++;
    }

    function lancer_pouvoir()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function charger_pouvoir_special()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        if(!self.avoirEnergiePlusDe(self.pouvoirs[1].energie_necessaire))
        {
            // Va pour le chargement du pouvoir ordinaire
            self.actionAuto = 1;
            self.ieme_sousActionAuto = 2;
            return;
        }

        self.keydownEventSimulation.keyCode = -8;
        pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        if(self.pouvoirSpecialPres || self.toucheParlAdversaire)
            self.ieme_sousActionAuto++;
    }

    function lancer_pouvoir_special()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function attendre_fin_pouvoir_special()
    {
        if(!self.lancementPouvoirSpecial)
            self.ieme_sousActionAuto++;
    }

    function bloquer()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        self.keydownEventSimulation.keyCode = -10;
        pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        self.ieme_sousActionAuto++;
    }

    function arreter_bloque()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function charger_defence_special()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        self.keydownEventSimulation.keyCode = -11;
        pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        self.ieme_sousActionAuto++;
    }

    function lancer_defence_special()
    {
        if(self.enDefenceSpecial)
        {
            self.ieme_sousActionAuto++;
            return;
        }

        if(!self.avoirEnergiePlusDe(self.pouvoirs[2].energie_necessaire))
        {
            // Va pour le chargement du defence ordinaire
            self.actionAuto = 5;
            self.ieme_sousActionAuto = 0;

            popInKeysdown(self.keydownEventSimulation.keyCode);
            self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
            self.keydownEventSimulation.keyCode = 0;
            return;
        }

        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = self.keydownEventSimulation.keyCode;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }

    function charger_arret_defence_special()
    {
        self.keydownEventSimulation.keyCode = -11;
        pushInKeysdownIfNotIn(self.keydownEventSimulation.keyCode);
        self.ieme_sousActionAuto++;
    }

    function arreter_defence_special()
    {
        popInKeysdown(self.keydownEventSimulation.keyCode);
        self.keyupEventSimulation.keyCode = -11;
        self.keydownEventSimulation.keyCode = 0;
        self.ieme_sousActionAuto++;
    }
    
    // Les actions que le perso peut faire en mode automatique
    var actions = [
        [// action 0: avancer et monter/descendre puis kick/box
            avancer,
            arret_deplacement_x,
            atteindre_hauteur,
            arret_deplacement_y,
            attaquer, // Attaquer pendant un certain moment
            attaquer,
            attaquer,
            arreter_attaque
        ],
        [// action 1: monter/descendre puis charger et lancer pouvoir
            atteindre_hauteur,
            arret_deplacement_y,
            charger_pouvoir, // Charger un peu plus longtemps pour pouvoir apercevoir le chargement du pouvoir
            charger_pouvoir,
            charger_pouvoir,
            lancer_pouvoir
        ],
        [// action 2: monter/descendre puis charger et lancer pouvoir special
            atteindre_hauteur,
            arret_deplacement_y,
            charger_pouvoir_special,
            lancer_pouvoir_special,
            attendre_fin_pouvoir_special
        ],
        [// action 3: reculer puis charger et lancer pouvoir
            reculer,
            arret_deplacement_x,
            charger_pouvoir,
            lancer_pouvoir
        ],
        [// aciotn 4: évite juste l'hauteur de l'adversaire
            eviter_hauteur,
            arret_deplacement_y
        ],
        [// action 5: bloquer, pouvoir puis bloquer
            bloquer, // bloquer pendant un certain moment
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            arreter_bloque,
            charger_pouvoir,
            charger_pouvoir,
            charger_pouvoir,
            lancer_pouvoir,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            bloquer,
            arreter_bloque
        ],
        [// action 6: lancer defence special puis eviter hauteur et se mettre derriere l'adversaire
            charger_defence_special,
            lancer_defence_special,
            eviter_hauteur,
            arret_deplacement_y,
            charger_arret_defence_special,
            arreter_defence_special,
            se_mettre_derriere,
            arret_deplacement_x
        ],
        [// action 7: se mettre derriere l'adversaire et monter/descendre puis kick/box
            se_mettre_derriere,
            arret_deplacement_x,
            atteindre_hauteur,
            arret_deplacement_y,
            attaquer, // Attaquer pendant un certain moment
            attaquer,
            attaquer,
            arreter_attaque
        ],
        [// action 8: se mettre au milieu du terrain en abscisse
            se_mettre_au_milieu_terrain,
            arret_deplacement_x
        ]
    ];

    self.decisionAuto = function(position_adversaire)
    {
        if(actions[self.actionAuto][self.ieme_sousActionAuto])
            actions[self.actionAuto][self.ieme_sousActionAuto](position_adversaire);
        else
        {
            self.ieme_sousActionAuto = 0;
            // return; // Atao manao action hafa, ovaina ny actionAuto @ alalan function
            self.actionAuto = rand(0,8); // Ito le manova actionAuto eh!
        }
    }
}