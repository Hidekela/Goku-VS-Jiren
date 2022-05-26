function KeyToCommand(left = 37, up = 38, right = 39, down = 40, box = 81, kick = 68, pouvoir = 90, attackSpecial = 83, transform = 49, block = 65, blockSpecial = 69, pause = 27) {
    // e.keyCode => KeyToCommand.smthg
    this.left          = left;
    this.up            = up;
    this.right         = right;
    this.down          = down;
    this.box           = box;
    this.kick          = kick;
    this.pouvoir       = pouvoir;
    this.attackSpecial = attackSpecial;
    this.transform     = transform;
    this.block         = block;
    this.blockSpecial  = blockSpecial;
    this.pause         = pause;
};

/* 
        Par défaut:

this.left          = 37; // touche gauche
this.up            = 38; // touche haut
this.right         = 39; // touche droite
this.down          = 40; // touche bas
this.box           = 81; // Q
this.kick          = 68; // D
this.pouvoir       = 90; // Z
this.attackSpecial = 83; // S
this.transform     = 49; // 1 (non numpad)
this.block         = 65; // A
this.blockSpecial  = 69; // E 
this.pause         = 27; // touche Echap 

*/