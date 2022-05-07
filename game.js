var up = false, down = false, left = false, right = false, toto = false, daka = false, kmhmh = false;
var pres = false;
var vie_goku = 100,energie_goku = 100, x = 0, y = 0, position = 'gauche', goku = document.getElementById('goku'), t = 1, d = 1, etat = 'initial', p = 1, k = 0, kanim = 0, boolp = false, can_p = true, boolk = false, transform = false;

var boolfin = false;

var touchedj = false;
var touched = false;

var vie_jiren = 100, energie_jiren = 100, xj = 870, yj = 0, positionj = 'droite', jiren = document.getElementById('jiren'), tj = 1, pj = 1, boolpj = false, can_pj = true;

document.getElementById('tuto').innerHTML = '<h3 style:"text-align:center">Transformations</h3><br/> I: initiale (niveau 0)<br/> G: Super Sayen God<br/> B: Super Sayen Blue<br/><h3 style:"text-align:center">Attaque</h3><br/> Q: coup de poing<br/> D: coup de pied<br/> Z: pouvoir<br/> S: kamehameha (à maintenir pendant 3.5s au moins)<br/><h3 style:"text-align:center">Déplacement</h3><br/> ←: gauche<br/> →: droite<br/> ↑: haut<br/> ↓: bas<br/> <span style="color: white; text-shadow: none">(Cliquez pour commencer)</span>';
document.getElementById('tuto').style = 'text-shadow: 0 0 2px white; font-size: 21px;color: #1259fa';

    document.addEventListener('keydown', function(event){
    if(!boolk && !boolfin)
    {
        // if(String.fromCharCode(event.keyCode) != 'S')
        // {
        //     document.getElementById('kamehamehaanim').style.opacity = '0';
        //     document.getElementById('kamehamehacharge').style.opacity = '0';
        //     k = 0;
        //     document.querySelector('p').innerHTML = '';
        // }
        if(String.fromCharCode(event.keyCode) != 'Z')
        {
            boolp = false;
        }
        switch(String.fromCharCode(event.keyCode))
        {
            case '&'://haut
                up = true;
                break;
            case '('://bas
                down = true;
                break;
            case '%'://gauche
                left = true;
                break;
            case '\''://droite
                right = true;
                break;
            case 'Q'://totondry
                toto = true;
                break;
            case 'D'://daka
                daka = true;
                break;
            case 'Z'://pouvoir
                boolp = true;
                if(y <= 0)
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'pouvoir.png';
                }
                else
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'airpouvoir.png';
                }
                break;
            case 'S'://kamehameha
                kmhmh = true;
                break;
        }
    }
}, false);

var game = setInterval(function(){
    if(x >= xj)
    {
        position = 'droite';
        positionj = 'gauche';
    }
    else
    {
        positionj = 'droite';
        position = 'gauche';
    }
    if(!boolk)
    {
        if(up)//haut
        {
            if(y < 410)
            {
                y += 10;
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
                goku.style = 'left: '+x+'px;bottom: '+y+'px;';
            }
        }
        else if(down)//bas
        {
            if(y > 0)
            {
                y -= 10;
                goku.src = 'perso/'+position+'goku/'+etat+'descend.png';
                goku.style = 'left: '+x+'px;bottom: '+y+'px;';
            }
            else if(y == 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
        }
        if(left)//gauche
        {
            if(x >= xj)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'avance.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'retour.png';
            }
            if(x >= 0)
            {
                x -= 10;
                goku.style = 'left: '+x+'px;bottom: '+y+'px;';
            }
        }
        else if(right)//droite
        {
            if(x >= xj)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'retour.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'avance.png';
            }
            if(x < 870)
            {
                x += 10;
                goku.style = 'left: '+x+'px;bottom: '+y+'px;';
            }
        }
        if(toto)//totondry
        {
                goku.src = 'perso/'+position+'goku/'+etat+'totondry'+t+'.png';
                if(y-30 <= yj && yj <= y+20)//middle
                {
                x <= xj? (x+80 >= xj?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedmiddle.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-60):(x <= xj+80?xj+60:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):''):(x <= xj+80?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedmiddle.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-60):(x <= xj+80?xj+60:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):'');
                jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                else if(yj > y+20 && yj <= y+120)//bottom
                {
                x <= xj? (x+70 >= xj?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-20):(x <= xj+70?xj+20:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):''):(x <= xj+70?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-20):(x <= xj+70?xj+20:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):'');
                jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                else if(y-30 > yj && y-60 <= yj)//top
                {
                x <= xj? (x+50 >= xj?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-40):(x <= xj+50?xj+40:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):''):(x <= xj+50?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-40):(x <= xj+50?xj+40:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):'');
                jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                t++;
                if(t > 2)
                {
                    t = 1;
                }
            }
        else if(daka)//daka
        {
            goku.src = 'perso/'+position+'goku/'+etat+'daka'+d+'.png';
            if(y-60 <= yj && yj <= y-10)//middle
                {
                x <= xj? (x+80 >= xj?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedmiddle.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-60):(x <= xj+80?xj+60:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):''):(x <= xj+80?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedmiddle.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-60):(x <= xj+80?xj+60:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):'');
                }
                else if(yj > y-10 && yj <= y+80)//bottom
                {
                x <= xj? (x+70 >= xj?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-20):(x <= xj+70?xj+20:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):''):(x <= xj+70?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-20):(x <= xj+70?xj+20:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):'');
                }
                else if(y-60 > yj && y-100 <= yj)//top
                {
                x <= xj? (x+50 >= xj?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-40):(x <= xj+50?xj+40:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):''):(x <= xj+50?(jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png',
                goku.style = 'left: '+parseInt(x < xj?(xj-40):(x <= xj+50?xj+40:''))+'px;bottom: '+y+'px;',(etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1))),vie('jiren')):'');
                }
                d++;
                if(d > 3)
                {
                    d = 1;
                }
        }
        else if(kmhmh)//kamehameha
        {
            if(k == 1)
            {
                document.querySelector('p').innerHTML = 'KA';
            }
            else if(k == 16)
            {
                document.querySelector('p').innerHTML = 'KAME';
            }
            else if(k == 32)
            {
                document.querySelector('p').innerHTML = 'KAMEHA';
            }
            else if(k == 50)
            {
                document.querySelector('p').innerHTML = 'KAMEHAME';
            }
            if(k < 50)
            {
                k++;
            }
            if(y <= 0 && !left && !right)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'kamehamehachargement.png';
                if(k < 30)
                {
                    document.getElementById('kamehamehacharge').style = 'bottom: '+parseFloat(y+101-(k/2))+'px; left: '+(x >= xj? parseFloat(x+114-(k/2)) : parseFloat(x+34-(k/2)))+'px; opacity: 0.9; width: '+k+'px';
                }
                else
                {
                    document.getElementById('kamehamehacharge').style = 'bottom: '+parseFloat(y+86)+'px; left: '+(x >= xj? parseFloat(x+100) : parseFloat(x+19))+'px; opacity: 0.9; width: 30px';
                }
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'airkamehamehachargement.png';
                if(k < 30)
                {
                    document.getElementById('kamehamehacharge').style = 'bottom: '+parseFloat(y+112 -(k/2))+'px; left: '+(x >= xj? parseFloat(x+119-(k/2)) : parseFloat(x+29-(k/2)))+'px; opacity: 0.9; width: '+k+'px';
                }
                else
                {
                    document.getElementById('kamehamehacharge').style = 'bottom: '+parseFloat(y+97)+'px; left: '+(x >= xj? parseFloat(x+105) : parseFloat(x+14))+'px; opacity: 0.9; width: 30px';
                }
            }
            if(k > 25)
            {
                if(y <= 0 && !left && !right)
                {
                    document.getElementById('kamehamehaanim').style = 'left: '+(x >= xj? parseInt(x-20) : parseInt(x-101))+'px;bottom:'+parseInt(y-35)+'px;opacity: 0.5;transform: rotate('+kanim+'deg);';
                }
                else
                {
                    document.getElementById('kamehamehaanim').style = 'left: '+(x >= xj? parseInt(x-15) : parseInt(x-106))+'px;bottom:'+parseInt(y-24)+'px;opacity: 0.5;transform: rotate('+kanim+'deg);';
                }
                kanim ++;
            }
        }
    }
},25);

document.addEventListener('keypress', function(event){
    switch(String.fromCharCode(event.keyCode))
    {
        case 'i'://initial
            if(etat == 'god')
            {
                energie_goku = energie_goku + 10;
                barre_energie('goku');
                transform = true;
            }
            if(etat == 'blue')
            {
                energie_goku = energie_goku + 20;
                barre_energie('goku');
                transform = true;
            }
            etat = 'initial';
            if(boolk)
            {
                    goku.src = 'perso/'+position+'goku/'+etat+'kamehameha.png';
            }
            else
            {
                if(y <= 0)
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'.png';
                }
                else
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
                }
            }
            break;
        case 'g'://god
            if(etat == 'initial' && energie_goku >= 20)
            {
                energie_goku -= 20;
                barre_energie('goku');
                transform = true;
                etat = 'god';
            }
            if(etat == 'blue')
            {
                energie_goku = energie_goku + 10;
                barre_energie('goku');
                transform = true;
                etat = 'god';
            }
            if(boolk)
            {
                    goku.src = 'perso/'+position+'goku/'+etat+'kamehameha.png';
            }
            else
            {
                if(y <= 0)
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'transformation.png';
                }
                else
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'airtransformation.png';
                }
            }
            break;
        case 'b'://blue
            if(etat == 'initial' && energie_goku >= 50)
            {
                energie_goku -= 50;
                barre_energie('goku');
                transform = true;
                etat = 'blue';
            }
            if(etat == 'god' && energie_goku >= 30)
            {
                energie_goku -= 30;
                barre_energie('goku');
                transform = true;
                etat = 'blue';
            }
            if(boolk)
            {
                    goku.src = 'perso/'+position+'goku/'+etat+'kamehameha.png';
            }
            else
            {
                if(y <= 0)
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'transformation.png';
                }
                else
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'airtransformation.png';
                }
            }
            break;
        case ' ':
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
            if(boolk)
            {
                    goku.src = 'perso/'+position+'goku/'+etat+'kamehameha.png';
            }
            else
            {
                if(y <= 0)
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'.png';
                }
                else
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
                }
            }
            break;
    }
    document.getElementById('avatargoku').src = 'avatar/'+etat+'goku.png';
}, false);
document.addEventListener('keyup', function(event){
if(!boolk && !boolfin)
{
    switch(String.fromCharCode(event.keyCode))
    {
        case 'D'://daka
            daka = false;
            break;
        case 'Q'://totondry
            toto = false;
            break;
        case '&'://haut
            up = false;
            break;
        case '%'://gauche
            left = false;
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            break;
        case '\''://droite
            right = false;
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            break;
        case '('://bas
            down = false;
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            break;
        case 'I'://initial
            if(etat == 'god' && !transform)
            {
                energie_goku = energie_goku + 10;
                barre_energie('goku');
            }
            if(etat == 'blue' && !transform)
            {
                energie_goku = energie_goku + 20;
                barre_energie('goku');
            }
            etat = 'initial';
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            break;
        case 'G'://god
            if(etat == 'initial' && energie_goku >= 20 && !transform)
            {
                energie_goku -= 20;
                barre_energie('goku');
                etat = 'god';
            }
            if(etat == 'blue' && !transform)
            {
                energie_goku = energie_goku + 10;
                barre_energie('goku');
                etat = 'god';
            }
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            break;
        case 'B'://blue
            if(etat == 'initial' && energie_goku >= 50 && !transform)
            {
                energie_goku -= 50;
                barre_energie('goku');
                etat = 'blue';
            }
            if(etat == 'god' && energie_goku >= 30 && !transform)
            {
                energie_goku -= 30;
                barre_energie('goku');
                etat = 'blue';
            }
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            break;
        case 'Z'://pouvoir
            if(y <= 0)
            {
                goku.src = 'perso/'+position+'goku/'+etat+'.png';
            }
            else
            {
                goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
            }
            if(boolp && can_p)
            {
                
                if(x >= xj)
                {
                    document.getElementById('pouvoir'+p).innerHTML = "@keyframes pouvoir"+p+"\n  {\n   0%{bottom:"+parseInt(y+85)+"px;left:"+(x >= 60 ?parseInt(x-60):'0')+"px;opacity:1;}\n   90%{opacity:1;}\n   100%{bottom:"+parseInt(y+85)+"px;left:"+((y+73) <= (yj+130) && (y+140) >= yj? (touchedj = true, xj+10) : "0")+"px;opacity:0;}\n  }";
            document.getElementById('p'+p).style = 'animation: pouvoir'+p+' '+((y+73) <= (yj+130) && (y+140) >= yj? "0.5" : parseFloat((x/10+120)/120))+'s;';
                }
                else
                {
                    document.getElementById('pouvoir'+p).innerHTML = "@keyframes pouvoir"+p+"\n  {\n   0%{bottom:"+parseInt(y+85)+"px;left:"+(x <= 810 ?parseInt(x+120):'932')+"px;opacity:1;}\n   90%{opacity:1;}\n   100%{bottom:"+parseInt(y+85)+"px;left:"+((y+73) <= (yj+130) && (y+140) >= yj? (touchedj = true, xj+60) : "932")+"px;opacity:0;}\n  }";
            document.getElementById('p'+p).style = 'animation: pouvoir'+p+' '+((y+73) <= (yj+130) && (y+140) >= yj? "0.5" : parseFloat(120/(x/10+120)))+'s;';
                }
                
                energie_goku = baisse_energie('goku');
                barre_energie('goku');
                        
                        if(y == yj && boolpj)
                        {
                            touched = false;
                            touchedj = false;
                        }
                
                    if(touchedj)
                    {
                        var debut = new Date().getTime(), fin = debut + 300;
                        var  pouvoir = setInterval(function()
                        {
                            var time = new Date().getTime();
                            if(time >= fin)
                            {
                                if(yj < y+50 && yj > y-10)
                                {
                                    jiren.src = 'perso/'+positionj+'jiren/initialtouchedmiddle.png';
                                }
                                else
                                {
                                    jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png';
                                }
                                clearInterval(pouvoir);
                                (etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1)));
                                vie('jiren');         
                            }
                        },300
                        );
                    }
                
                var debuttime = new Date().getTime(), timeout_boolp = setTimeout(function(){
                    var now = new Date().getTime();
                    boolp = false;
                    if(now >= debuttime)
                    {
                        clearTimeout(timeout_boolp);
                    }
                },300);
                
            document.getElementById('p'+p).src = 'pouvoir/pouvoir'+p+position+'.png';
            p++;
            if(p == 11)
            {
                p = 1;
            }
            document.getElementById('p'+p).style = '';
            }
            touchedj = false;
            break;
        case 'S'://kamehameha
            kmhmh = false;
            document.getElementById('kamehamehaanim').style = 'opacity: 0;';
            kanim = 0;
            if(k >= 50 && energie_goku >= 15)
            {
                document.querySelector('p').innerHTML += 'HAAA!!!!';
                    boolk = true;
                var debut = new Date().getTime(), fin = debut + 3000, voan_ka = false;
                    goku.src = 'perso/'+position+'goku/'+etat+'kamehameha.png';
                document.getElementById('kamehameha').style = 'animation: kamehameha 3s; opacity:1; bottom:'+y+'px; '+(x >= xj? 'right:'+parseInt(997-x):'left:'+parseInt(x+123))+'px;';/*(x >= xj? 'right:'+parseInt(952-x):'left:'+parseInt(x+123)) pour !(min-width:100%)*/
                document.getElementById('kamehameha').src = 'pouvoir/kamehameha'+position+'.png';
                document.getElementById('kamehamehastyle').innerHTML = '@keyframes kamehameha{0%{width:0px;height:238px}5%{width:'+(x >= xj? parseInt(x+30) : parseInt(900-x))+'px;height:238px}90%{width:'+(x >= xj? parseInt(x+30) : parseInt(900-x))+'px;opacity:1;height:238px}100%{width:'+(x >= xj? parseInt(x+30) : parseInt(900-x))+'px;height:238px;opacity:0}}';
                y <= (yj+100) && (y+160) >= yj? ((yj <= (y+10) && yj >= (y-30)?jiren.src = 'perso/'+positionj+'jiren/initialtouchedmiddle.png' : (yj < (y-30)?jiren.src = 'perso/'+positionj+'jiren/initialtouchedtop.png' : (yj = y, jiren.src = 'perso/'+positionj+'jiren/initialtouchedbehind.png'))), document.getElementById('kamehamehatouched').innerHTML = '@keyframes kamehamehatouched{0%{left: '+xj+'px}60%{left: '+(x >= xj? '0' : '872')+'px}100%{left: '+(x >= xj? '0' : '872')+'px}}',x >= xj? xj = 0 : xj = 872, jiren.style = 'animation: kamehamehatouched 3s;left:'+xj+'px;bottom:'+yj+'px;', voan_ka = true) : '';
                energie_goku = baisse_energie('goku');
                energie_goku = baisse_energie('goku');
                energie_goku = baisse_energie('goku');
                barre_energie('goku');
                var kamehameha = setInterval(function(){
                    time = new Date().getTime();
                    if(voan_ka)
                    {
                        (etat == 'initial'? vie_jiren = touche('jiren', 0.3) : (etat == 'god'? vie_jiren = touche('jiren', 0.6) : vie_jiren = touche('jiren', 1)));
                        vie('jiren');
                    }
                    if(time >= fin)
                    {
                        document.getElementById('kamehameha').style = 'opacity:0;';
                        if(y <= 0)
                        {
                            goku.src = 'perso/'+position+'goku/'+etat+'.png';
                        }
                        else
                        {
                            goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
                        }
                        if(yj <= 0)
                        {
                            jiren.src = 'perso/'+positionj+'jiren/initial.png';
                        }
                        else
                        {
                            jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                        }
                        document.querySelector('p').innerHTML = '';
                        clearInterval(kamehameha);
                    boolk = false;
                    up = false;
                    down = false;
                    left = false;
                    right = false;
                    }
                },100);
            }
            else
            {
                if(y <= 0)
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'.png';
                }
                else
                {
                    goku.src = 'perso/'+position+'goku/'+etat+'monte.png';
                }
                document.querySelector('p').innerHTML = '';
            }
            k = 0;
            document.getElementById('kamehamehacharge').style = 'opacity: 0;';
                break;
    }
}
    transform = false;
}, false);

//jiren

//automatisme jiren

    function rand(min, max, integer) {
if (!integer) {
return Math.random() * (max - min) + min;
} else {
return Math.floor(Math.random() * (max - min + 1) + min);
}
}

function rand_number_action()
{
    return number_of_action = rand(1, 5, integer = true);
}

function totondry()
{
    if(!boolk && pres && !boolp)
    {
    var coup_effectue = 0, nb_coup = rand(5, 30, integer=true);
    var action = setInterval(function(){
    if(!boolk && pres && !boolp)
    {
        if(coup_effectue < nb_coup)
        {
            jiren.src = 'perso/'+positionj+'jiren/initialtotondry'+tj+'.png';
                    if(yj + 70 >= y && yj <= y)//middle
                    {
                        x < xj?(xj <= x+70? (jiren.style = 'left: '+parseInt(x+40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedmiddle.png',(etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1))),vie('goku')):''):(xj >= x-70? (jiren.style = 'left: '+parseInt(x-40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedmiddle.png',(etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1))),vie('goku')):'');
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
                        k = 0;
                        document.getElementById('kamehamehaanim').style = 'opacity: 0;';
                    }
                    else if(yj > y && yj <= y+20)//bottom
                    {
                        x < xj?(xj <= x+70? (jiren.style = 'left: '+parseInt(x+40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png',(etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1))),vie('goku')):''):(xj >= x-70? (jiren.style = 'left: '+parseInt(x-40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png',(etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1))),vie('goku')):'');
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
                        k = 0;
                        document.getElementById('kamehamehaanim').style = 'opacity: 0;';
                    }
                    else if(yj + 140 >= y && yj + 70 < y)//top
                    {
                        x < xj?(xj <= x+60? (jiren.style = 'left: '+parseInt(x+20)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png',(etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1))),vie('goku')):''):(xj >= x-60? (jiren.style = 'left: '+parseInt(x-20)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png',(etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1))),vie('goku')):'');
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
                        k = 0;
                        document.getElementById('kamehamehaanim').style = 'opacity: 0;';
                    }
                    tj++;
                    if(tj > 2)
                    {
                        tj = 1;
                    }
            coup_effectue++;
        }
        else
        {
            clearInterval(action);
        }
    }
    },25);
    }
}

function prepouvoir()
{
    if(!boolk && pres && !boolfin)
    {
                    if(yj <= 0)
                    {
                        jiren.src = 'perso/'+positionj+'jiren/initialpouvoir.png';
                    }
                    else
                    {
                        jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png';
                    }
    }
}
function pouvoir(yj, y, xj, x)
{
    if(!boolk && pres && !boolfin)
    {
            var pouvoirj = setTimeout(function(){
            
    if(!boolk && pres && !boolfin)
    {
                    if(yj <= 0)
                    {
                        jiren.src = 'perso/'+positionj+'jiren/initial.png';
                    }
                    else
                    {
                        jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                    }
                        boolpj = true;
                
                    if(boolpj && can_pj)
                    {
                        
                        if(x >= xj)
                        {
                            document.getElementById('pouvoirjiren'+pj).innerHTML = "@keyframes pouvoirjiren"+pj+"\n  {\n   0%{bottom:"+parseInt(yj+85)+"px;left:"+(xj <= 810 ?parseInt(xj+120):'932')+"px;opacity:1;}\n   90%{opacity:1;}\n   100%{bottom:"+parseInt(yj+85)+"px;left:"+((yj+73) <= (y+130) && (yj+140) >= y? (touched = true, x+70) : "932")+"px;opacity:0;}\n  }";
                    document.getElementById('pj'+pj).style = 'animation: pouvoirjiren'+pj+' '+((yj+73) <= (y+130) && (yj+140) >= y? '0.5': parseFloat(120/(xj/10+120)))+'s;';
                        }
                        else
                        {
                            document.getElementById('pouvoirjiren'+pj).innerHTML = "@keyframes pouvoirjiren"+pj+"\n  {\n   0%{bottom:"+parseInt(yj+85)+"px;left:"+(xj >= 60 ?parseInt(xj-60):'0')+"px;opacity:1;}\n   90%{opacity:1;}\n   100%{bottom:"+parseInt(yj+85)+"px;left:"+((yj+73) <= (y+130) && (yj+140) >= y? (touched = true, x) : "0")+"px;opacity:0;}\n  }";
                    document.getElementById('pj'+pj).style = 'animation: pouvoirjiren'+pj+' '+((yj+73) <= (y+130) && (yj+140) >= y? '0.5': parseFloat((xj/10+120)/120))+'s;';
                        }
                        
                energie_jiren = baisse_energie('jiren');
                barre_energie('jiren');
                        
                        if(y == yj && boolp)
                        {
                            touched = false;
                            touchedj = false;
                        }
                        
                            if(touched && !boolk)
                            {
                                var debut = new Date().getTime(), fin = debut + 300;
                                var  pouvoir = setInterval(function()
                                {
                                    var time = new Date().getTime();
                                    if(time >= fin)
                                    {
                                        if(!boolk)
                                        {
                                            if(y < yj+60 && y > yj)
                                            {
                                                goku.src = 'perso/'+position+'goku/'+etat+'touchedmiddle.png';
                                            }
                                            else
                                            {
                                                goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png';
                                            }
                                        }
                                        clearInterval(pouvoir);
                                        k = 0;
                                document.getElementById('kamehamehaanim').style = 'opacity: 0;';
                                    }
                                },300
                                );
                        (etat == 'initial'? (vie_goku = touche('goku', 2.5)) : (etat == 'god'? vie_goku = touche('goku', 1.7) : vie_goku = touche('goku', 1)));
                        vie('goku');
                            }
                
                var debuttime = new Date().getTime(), timeout_boolpj = setTimeout(function(){
                    var now = new Date().getTime();
                    boolpj = false;
                    if(now >= debuttime)
                    {
                        clearTimeout(timeout_boolpj);
                    }
                },300);
                
            document.getElementById('pj'+pj).src = 'pouvoir/pouvoirjiren'+pj+'.png';
                    pj++;
                    if(pj == 11)
                    {
                        pj = 1;
                    }
                    document.getElementById('pj'+pj).style = '';
                    }
                clearTimeout(pouvoirj);
    }
            },50);
    touched = false;
    }
}

function action_possible(number_of_action)
{
    switch(number_of_action)
    {
        case 1:
            var debutj = new Date().getTime(), fin = debutj + 2000;
            var action = setInterval(function(){
                var time = new Date().getTime();
                if(time < fin)
                {
    if(!boolk && pres)
    {
    var atteint_y = false;
    var action_ = setInterval(function(){
    if(!boolk && pres)
    {
        if(!atteint_y && !touchedj)
        {
            if(y < yj)
            {
                yj-=10;
            }
            else if(y > yj)
            {
                yj+=10;
            }
            else
            {
                atteint_y = true;
            }
            jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
            boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
        }
        else
        {
            clearInterval(action_);
        }
    }
    },25);
    }
                }
                else
                {
                    var coup_effectue = 0, nb_coup = rand(1, 11, integer=true);
                    var actions = setInterval(function(){
                        if(coup_effectue < nb_coup)
                        {
                            prepouvoir();
                            pouvoir(yj, y, xj, x);
                            coup_effectue++;
                        }
                        else
                        {
                            clearInterval(actions);
                        }
                    },100);

                    clearInterval(action);
                }
            },1000);
            break;
        case 2:
            var debutj = new Date().getTime(), fin = debutj + 2000;
            var action = setInterval(function(){
                var time = new Date().getTime();
                if(time < fin)
                {
    if(!boolk && pres)
    {
    var atteint_x = false, atteint_y = false;
    var action1 = setInterval(function(){
        
    if(!boolk && pres)
    {
        if(!atteint_x && !touchedj)
        {
            if(x < xj && x+60 < xj)
            {
                xj-=10;
            }
            else if(x > xj && x-60 > xj)
            {
                xj+=10;
            }
            else
            {
                atteint_x = true;
            }
            jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
            boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
        }
        else
        {
            clearInterval(action1);
                var action2 = setInterval(function(){
    if(!boolk && pres)
    {
                if(!atteint_y && !touchedj)
                {
                    if(y < yj)
                    {
                        yj-=10;
                    }
                    else if(y > yj)
                    {
                        yj+=10;
                    }
                    else
                    {
                        atteint_y = true;
                    }
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                    boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                }
                else
                {
                    clearInterval(action2);
                }
    }
            },25);
        }
    }
    },25);
    }
                }
                else
                {
                    var coup_effectue = 0, nb_coup = rand(1, 17, integer=true);
                    var actions = setInterval(function(){
                        if(coup_effectue < nb_coup)
                        {
                            prepouvoir();
                            pouvoir(yj, y, xj, x);
                            coup_effectue++;
                        }
                        else
                        {
                            clearInterval(actions);
                        }
                    },100);

                    clearInterval(action);
                }
            },1000);
            break;
        case 3:
            var debutj = new Date().getTime(), fin = debutj + 2000;
            var action = setInterval(function(){
                var time = new Date().getTime();
                if(time < fin)
                {
    if(!boolk && pres)
    {
    var atteint_x = false, atteint_y = false;
    var action1 = setInterval(function(){
        
    if(!boolk && pres)
    {
        if(!atteint_y && !touchedj)
        {
            if(y < yj)
            {
                yj-=10;
            }
            else if(y > yj)
            {
                yj+=10;
            }
            else
            {
                atteint_y = true;
            }
            jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
            boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
        }
        else
        {
            clearInterval(action1);
                var action2 = setInterval(function(){
                    
    if(!boolk && pres)
    {
                if(!atteint_x && !touchedj)
                {
                    if(x < xj && x+60 < xj)
                    {
                        xj-=10;
                    }
                    else if(x > xj && x-60 > xj)
                    {
                        xj+=10;
                    }
                    else
                    {
                        atteint_x = true;
                    }
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                    boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                }
                else
                {
                    clearInterval(action2);
                }
    }
            },25);
        }
    }
    },25);
    }
                }
                else
                {
                    var coup_effectue = 0, nb_coup = rand(1, 17, integer=true);
                    var actions = setInterval(function(){
                        if(coup_effectue < nb_coup)
                        {
                            prepouvoir();
                            pouvoir(yj, y, xj, x);
                            coup_effectue++;
                        }
                        else
                        {
                            clearInterval(actions);
                        }
                    },100);

                    clearInterval(action);
                }
            },1000);
            break;
        case 4:
            var debutj = new Date().getTime(), fin = debutj + 2000;
            var action = setInterval(function(){
                var time = new Date().getTime();
                if(time < fin)
                {
    if(!boolk && pres)
    {
    var atteint_x = false, atteint_y = false;
    var action1 = setInterval(function(){
        
    if(!boolk && pres)
    {
        if(!atteint_x && !touchedj)
        {
            if(x < xj && x+60 < xj)
            {
                xj-=10;
            }
            else if(x > xj && x-60 > xj)
            {
                xj+=10;
            }
            else
            {
                atteint_x = true;
            }
            jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
            boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png'; 
        }
        else
        {
            clearInterval(action1);
                var action2 = setInterval(function(){
    if(!boolk && pres)
    {
                if(!atteint_y && !touchedj)
                {
                    if(y < yj)
                    {
                        yj-=10;
                    }
                    else if(y > yj)
                    {
                        yj+=10;
                    }
                    else
                    {
                        atteint_y = true;
                    }
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                    boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                }
                else
                {
                    clearInterval(action2);
                }
    }
            },25);
        }
    }
    },25);
    }
                }
                else
                {
                    clearInterval(action);
                    totondry();
                }
            },1000);
            break;
        case 5:
            var debutj = new Date().getTime(), fin = debutj + 2000;
            var action = setInterval(function(){
                var time = new Date().getTime();
                if(time < fin)
                {
    if(!boolk && pres)
    {
    var atteint_x = false, atteint_y = false;
    var action1 = setInterval(function(){
        
    if(!boolk && pres)
    {
        if(!atteint_y && !touchedj)
        {
            if(y < yj)
            {
                yj-=10;
            }
            else if(y > yj)
            {
                yj+=10;
            }
            else
            {
                atteint_y = true;
            }
            jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
            boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';   
        }
        else
        {
            clearInterval(action1);
                var action2 = setInterval(function(){
                    
    if(!boolk && pres)
    {
                if(!atteint_x && !touchedj)
                {
                    if(x < xj && x+60 < xj)
                    {
                        xj-=10;
                    }
                    else if(x > xj && x-60 > xj)
                    {
                        xj+=10;
                    }
                    else
                    {
                        atteint_x = true;
                    }
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                    boolpj? jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png' : jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';  
                }
                else
                {
                    clearInterval(action2);
                }
    }
            },25);
        }
    }
    },25);
    }
                }
                else
                {
                    clearInterval(action);
                    totondry();
                }
            },1000);
            break;
    }
            jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
}



var jiren_action = setInterval(function(){
    rand_number_action();
    action_possible(number_of_action);
},3000);

//energie

function baisse_energie(personnage)
{
    return (personnage == 'goku'? energie_goku - 5 : energie_jiren - 5);
}
function barre_energie(personnage)
{
    document.getElementById('energie_restant_'+personnage).style = 'width: '+(personnage == 'goku'? energie_goku*2 : energie_jiren*2)+'px';
    if(energie_goku < 5)
    {
        can_p = false;
    }
    if(energie_jiren < 5)
    {
        can_pj = false;
    }
}
var reconstitution_energie = setInterval(function()
    {
        if(energie_goku < 100)
        {
            energie_goku++;
            document.getElementById('energie_restant_goku').style = 'width: '+energie_goku*2+'px';
        }
        if(energie_jiren < 100)
        {
            energie_jiren++;
            document.getElementById('energie_restant_jiren').style = 'width: '+energie_jiren*2+'px';
        }
        if(energie_goku > 5)
        {
            can_p = true;
        }
        if(energie_jiren > 5)
        {
            can_pj = true;
        }
    },500);

//vie

function touche(personnage, degat)
{
    return (personnage == 'goku'? vie_goku - degat : vie_jiren - degat);
}
function vie(personnage)
{
    document.getElementById('vie_restant_'+personnage).style = 'width: '+(personnage == 'goku'? Math.round(vie_goku*3) : Math.round(vie_jiren*3))+'px; border-radius: '+(personnage == 'goku'?(vie_goku > 97? 5 : 0) : (vie_jiren > 97? 5 : 0))+'px;';
    if(vie_goku <= 0)
    {
        document.getElementById('vie_restant_'+personnage).style = 'width: 0px';
        document.getElementById('fin').innerHTML = 'Vous avez perdu! Cliquez pour rebattre.';
        document.getElementById('fin').style = 'display: block; color: red';
        document.getElementById('fin').addEventListener('click', function(){
            location.href = '';
            },false);
        clearInterval(jiren_action);
        clearInterval(reconstitution_energie);
        boolfin = true;
        clearInterval(game);
    }
    else if(vie_jiren <= 0)
    {
        document.getElementById('vie_restant_'+personnage).style = 'width: 0px';
        document.getElementById('fin').innerHTML = 'Vous avez gagnez! Cliquez pour rebattre.';
        document.getElementById('fin').style = 'display: block; color: green';
        document.getElementById('fin').addEventListener('click', function(){
            location.href = '';
        },false);
        clearInterval(jiren_action);
        clearInterval(reconstitution_energie);
        boolfin = true;
        clearInterval(game);
    }
}

boolfin = true;

document.addEventListener('click', function(){
document.getElementById('tuto').style = 'display: none';

    document.getElementById('fight').innerHTML = '...READY...';
    
    setTimeout(function(){
    document.getElementById('fight').innerHTML = '';
},1000);

setTimeout(function(){
    document.getElementById('fight').innerHTML = 'FIGHT!';
    pres = true;
},2000);

setTimeout(function(){
    document.getElementById('fight').style = 'display: none';
    boolfin = false;
},3000);
    
},false);





                        (etat == 'initial'? vie_jiren = touche('jiren', 0.1) : (etat == 'god'? vie_jiren = touche('jiren', 0.2) : vie_jiren = touche('jiren', 0.3)));
                                                                                    (etat == 'initial'? (vie_goku = touche('goku', 5)) : (etat == 'god'? vie_goku = touche('goku', 4) : vie_goku = touche('goku', 3)));
                                                                                                                                            
//action de jiren en le controllant

    /*document.addEventListener('keydown', function(event){
        if(String.fromCharCode(event.keyCode) != 'j')
        {
            boolpj = false;
        }
        switch(String.fromCharCode(event.keyCode))
        {
            case '!'://haut
                if(yj < 410)
                {
                    yj += 10;
                    jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                break;
            case '"'://bas
                if(yj > 0)
                {
                    yj -= 10;
                    jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                else if(yj == 0)
                {
                    jiren.src = 'perso/'+positionj+'jiren/initial.png';
                }
                break;
            case '$'://gauche
                if(x >= xj)
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialretour.png';
                }
                else
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                }
                if(xj >= 0)
                {
                    xj -= 10;
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                break;
            case '#'://droite
                if(x >= xj)
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                }
                else
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialretour.png';
                }
                if(xj < 870)
                {
                    xj += 10;
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                }
                break;
            case 'C'://totondry
                    jiren.src = 'perso/'+positionj+'jiren/initialtotondry'+tj+'.png';
                    if(yj + 70 >= y && yj <= y)
                    {
                        x < xj?(xj <= x+70? (jiren.style = 'left: '+parseInt(x+40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedmiddle.png'):''):(xj >= x-70? (jiren.style = 'left: '+parseInt(x-40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedmiddle.png'):'');
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
                    }
                    else if(yj > y && yj <= y+20)
                    {
                        x < xj?(xj <= x+70? (jiren.style = 'left: '+parseInt(x+40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png'):''):(xj >= x-70? (jiren.style = 'left: '+parseInt(x-40)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png'):'');
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
                    }
                    else if(yj + 140 >= y && yj + 70 < y)
                    {
                        x < xj?(xj <= x+60? (jiren.style = 'left: '+parseInt(x+20)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png'):''):(xj >= x-60? (jiren.style = 'left: '+parseInt(x-20)+'px;bottom: '+yj+'px;', goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png'):'');
                    goku.style = 'left: '+x+'px;bottom: '+y+'px;';
                    }
                    tj++;
                    if(tj > 2)
                    {
                        tj = 1;
                    }
                break;
            case 'j'://pouvoir
                boolpj = true;
                if(yj <= 0)
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialpouvoir.png';
                }
                else
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialairpouvoir.png';
                }
                break;
        }
}, false);
document.addEventListener('keypress', function(event){
    switch(String.fromCharCode(event.keyCode))
    {
        case ' ':
                    jiren.style = 'left: '+xj+'px;bottom: '+yj+'px;';
                if(yj <= 0)
                {
                    jiren.src = 'perso/'+positionj+'jiren/initial.png';
                }
                else
                {
                    jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
                }
            break;
    }
}, false);
document.addEventListener('keyup', function(event){
    switch(String.fromCharCode(event.keyCode))
    {
        
        case '$'://gauche
            if(yj <= 0)
            {
                jiren.src = 'perso/'+positionj+'jiren/initial.png';
            }
            else
            {
                jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
            }
            break;
        case '#'://droite
            if(yj <= 0)
            {
                jiren.src = 'perso/'+positionj+'jiren/initial.png';
            }
            else
            {
                jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
            }
            break;
        case '"'://bas
            if(yj <= 0)
            {
                jiren.src = 'perso/'+positionj+'jiren/initial.png';
            }
            else
            {
                jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
            }
            break;
        case 'j'://pouvoir
            if(yj <= 0)
            {
                jiren.src = 'perso/'+positionj+'jiren/initial.png';
            }
            else
            {
                jiren.src = 'perso/'+positionj+'jiren/initialmonte.png';
            }
            if(boolpj)
            {
                var touched = false;
                if(x >= xj)
                {
                    document.getElementById('pouvoirjiren'+pj).innerHTML = "@keyframes pouvoirjiren"+pj+"\n  {\n   0%{bottom:"+parseInt(yj+85)+"px;left:"+(xj <= 810 ?parseInt(xj+120):'932')+"px;opacity:1;}\n   90%{opacity:1;}\n   100%{bottom:"+parseInt(yj+85)+"px;left:"+((yj+73) <= (y+130) && (yj+140) >= y? (touched = true, x+70) : "932")+"px;opacity:0;}\n  }";
            document.getElementById('pj'+pj).style = 'animation: pouvoirjiren'+pj+' '+((yj+73) <= (y+130) && (yj+140) >= y? '0.5': parseFloat(120/(xj/10+120)))+'s;';
                }
                else
                {
                    document.getElementById('pouvoirjiren'+pj).innerHTML = "@keyframes pouvoirjiren"+pj+"\n  {\n   0%{bottom:"+parseInt(yj+85)+"px;left:"+(xj >= 60 ?parseInt(xj-60):'0')+"px;opacity:1;}\n   90%{opacity:1;}\n   100%{bottom:"+parseInt(yj+85)+"px;left:"+((yj+73) <= (y+130) && (yj+140) >= y? (touched = true, x) : "0")+"px;opacity:0;}\n  }";
            document.getElementById('pj'+pj).style = 'animation: pouvoirjiren'+pj+' '+((yj+73) <= (y+130) && (yj+140) >= y? '0.5': parseFloat((xj/10+120)/120))+'s;';
                }
                    if(touched && !boolk)
                    {
                        var debut = new Date().getTime(), fin = debut + 300;
                        var  pouvoir = setInterval(function()
                        {
                            var time = new Date().getTime();
                            if(time >= fin)
                            {
    
                                if(y < yj+60 && y > yj)
                                {
                                    goku.src = 'perso/'+position+'goku/'+etat+'touchedmiddle.png';
                                }
                                else
                                {
                                    goku.src = 'perso/'+position+'goku/'+etat+'touchedtop.png';
                                }
                                clearInterval(pouvoir);
                            }
                        },300
                        );
                    }
            pj++;
            if(pj == 11)
            {
                pj = 1;
            }
            document.getElementById('pj'+pj).style = '';
            }
            break;
    }
}, false);*/