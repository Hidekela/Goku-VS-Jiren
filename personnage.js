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

    self.entrainDeSeTransformer = false;
    self.peutSeDeplacer = true;
    self.peutBouger = true;
    self.pouvoirSpecialPres = false;
    self.enDefenceSpecial = false;
    self.chargementPouvoirSpecial = null;
    self.lancementPouvoirSpecial = null;

    self.animationPouvoirSpecialHandle = [];

    // Ajout des éléments HTML styles dans la page
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

    self.majAvatar = function()
    {
        self.avatar.src = 'avatar/'+self.nom_niveau+self.nom+'.png';
    }

    self.majSprite = function(transformation="")
    {
        self.sprite.style = "display: none";
        if(!self.enDefenceSpecial)
            self.sprite = document.getElementById(self.nom+self.position.relative+self.nom_niveau+(self.etat? self.etat : (self.deplacement.relative == 'air' || !self.deplacement.relative? self.position.place+transformation : self.deplacement.relative)));
        else
            self.sprite = document.getElementById(self.nom+self.position.relative+self.nom_niveau+self.pouvoirs[2].nom);
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
        return self.peutSeDeplacer && (self.deplacement.x != '' || self.deplacement.y != '');
    }

    self.seDeplacer = function(position_x_adversaire)
    {
        switch (self.deplacement.y) {
            case 'U':
                self.deplacement.relative = 'air';
                if(self.position.y < 410)
                    self.position.y += self.pas;
                break;
            case 'D':
                self.deplacement.relative = 'descend';
                if(self.position.y > 0)
                    self.position.y -= self.pas;
                break;
        }
        switch (self.deplacement.x) {
            case 'R':
                self.deplacement.relative = self.position.relative == 'gauche'? 'avance' : 'retour';
                if(self.position.x < 870)
                    self.position.x += self.pas;
                break;
            case 'L':
                self.deplacement.relative = self.position.relative == 'droite'? 'avance' : 'retour';
                if(self.position.x >= 0)
                    self.position.x -= self.pas;
                break;
        }

        self.majPlace();
        self.regarderAdversaire(position_x_adversaire);

        // Positionner le personnage au bon endroit
        self.handleSprite.style = 'left: '+self.position.x+'px;bottom: '+self.position.y+'px;'+(self.enDefenceSpecial? self.pouvoirs[2].style : '');

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

    self.attaquer = function()
    {
        if(self.enDefenceSpecial)
            return;

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
    }

    self.bloquer = function()
    {
        if(self.enDefenceSpecial)
            return;

        self.desactiverAnimationPouvoir();
        self.etat = 'block';
        self.majSprite();
    }

    self.avoirEnergiePlusDe = function(valeur)
    {
        return self.energie >= valeur;
    }

    self.chargePouvoir = function()
    {
        if(self.enDefenceSpecial)
            return;

        if(!self.avoirEnergiePlusDe(self.pouvoirs[0].energie_necessaire))
            return;
        
        self.desactiverAnimationPouvoir();
        self.etat = self.pouvoirs[0].nom;
        self.majSprite();
    }

    self.lancerPouvoir = function(position_adversaire,handle_sprite_adversaire)
    {
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
                if((position_adversaire.y-sprite_pouvoir.clientHeight < pouvoirPosition.y && pouvoirPosition.y < position_adversaire.y+handle_sprite_adversaire.clientHeight && pouvoirPosition.x >= position_adversaire.x+handle_sprite_adversaire.clientWidth) || pouvoirPosition.x >= 980 - sprite_pouvoir.clientWidth/2)
                {
                    sprite_pouvoir.style = "opacity: 0";
                    clearInterval(pouvoirMouvement);
                }
                pouvoirPosition.x+=25;
            }
            else
            {
                if((position_adversaire.y-sprite_pouvoir.clientHeight < pouvoirPosition.y && pouvoirPosition.y < position_adversaire.y+handle_sprite_adversaire.clientHeight && pouvoirPosition.x <= position_adversaire.x) || pouvoirPosition.x <= 0)
                {
                    sprite_pouvoir.style = "opacity: 0";
                    clearInterval(pouvoirMouvement);
                }
                pouvoirPosition.x-=25;
            }
        },30);
    }

    self.chargePouvoirSpecial = function()
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

        self.etat = self.pouvoirs[1].nom+'chargement';
        self.majSprite();
    }

    self.desactiverAnimationPouvoir = function()
    {
        for(let i = 0; i < self.pouvoirs.length; i++)
        {
            if(self.pouvoirs[i].animation_chargement)
                self.animationPouvoirSpecialHandle[i].style = "";
        }
    }

    self.lancerPouvoirSpecial = function()
    {
        self.desactiverAnimationPouvoir();

        clearTimeout(self.chargementPouvoirSpecial);
        self.chargementPouvoirSpecial = null;

        if(!self.pouvoirSpecialPres)
            return;

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
            self.nbpouvoirspecial.current = anneauxIncrementation(self.nbpouvoirspecial);
            sprite_pouvoir_special.style = "opacity: 0";
            sprite_pouvoir_special = document.getElementById(self.pouvoirs[1].nom+self.position.relative+self.nbpouvoirspecial.current);
            sprite_pouvoir_special.style = "opacity: 1; left: "+pouvoirSpecialPosition.x+"px; bottom: "+pouvoirSpecialPosition.y+"px";
        },50);

        var arretPouvoirSpecial = setTimeout(function(){
            if(self.lancementPouvoirSpecial)
            {
                clearInterval(self.lancementPouvoirSpecial);
                sprite_pouvoir_special.style = "opacity: 0";
                self.peutSeDeplacer = true;
                self.peutBouger = true;
                self.etat = '';
            }
            clearTimeout(arretPouvoirSpecial);
        },2000);
    }

    self.activerDefenceSpecial = function()
    {
        if(!self.avoirEnergiePlusDe(self.pouvoirs[2].energie_necessaire))
            return;

        if(self.pouvoirs[2].style)
            self.handleSprite.style = self.pouvoirs[2].style;

        self.pas = self.pouvoirs[2].pas;

        self.enDefenceSpecial = true;
    }

    self.desactiverDefenceSpecial = function()
    {
        self.handleSprite.style = 'left: '+self.position.x+'px;bottom: '+self.position.y+'px;';
        self.pas = self.liste_niveaux.pas[self.niveau];
        self.enDefenceSpecial = false;
    }

    self.defenceSpecial = function()
    {
        self.desactiverAnimationPouvoir();
        
        self.etat = self.pouvoirs[2].nom;
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
    
                case keyConfig.box:
                case keyConfig.kick:
                case keyConfig.pouvoir:
                case keyConfig.attackSpecial:
                case keyConfig.block:
                case keyConfig.blockSpecial:    
                case keyConfig.transform:
                    self.action = 'R';
                    break;
    
                default:
                    break;
            }
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
                    self.attaquer();
                    break;

                case 'DO':
                    self.bloquer();
                    break;

                case 'PO':
                    self.chargePouvoir();
                    break;

                case 'PS':
                    self.chargePouvoirSpecial();
                    break;

                case 'DS':
                    self.defenceSpecial();
                    break;

                case 'R':
                    switch (self.etat) {
                        case self.pouvoirs[0].nom:
                            self.lancerPouvoir(position_adversaire,handle_sprite_adversaire);
                            break;

                        case self.pouvoirs[1].nom+'chargement':
                            self.lancerPouvoirSpecial();
                            break;

                        case self.pouvoirs[2].nom:
                            if(self.enDefenceSpecial)
                                self.desactiverDefenceSpecial();
                            else
                                self.activerDefenceSpecial();
                            break;
                    
                        default:
                            break;
                    }
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