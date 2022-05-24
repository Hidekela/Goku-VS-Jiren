function KeyToCommand(left = 70, up = 84, right = 72, down = 71, box = 81, kick = 68, pouvoir = 90, attackSpecial = 83, transform = 49, block = 65, blockSpecial = 69, pause = 27) {
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

this.left          = 70; // F
this.up            = 84; // T
this.right         = 72; // H
this.down          = 71; // G
this.box           = 81; // Q
this.kick          = 68; // D
this.pouvoir       = 90; // Z
this.attackSpecial = 83; // S
this.transform     = 49; // 1 (non numpad)
this.block         = 65; // A
this.blockSpecial  = 69; // E 
this.pause         = 27; // touche Echap 

*/