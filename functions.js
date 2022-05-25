/** Dans un objet contenant les propriétés current et max,
 * incrémente current dans Z/maxZ et en ajoute +1
 * 
 * @param {objet} objet l'objet
 * @returns {int} la valeur de objet.current
 */
function anneauxIncrementation (objet)
{
    return objet.current == objet.max? 1 : objet.current+1;
}

/** Renvoie un nombre entier aléatoire
 * 
 * @param {int} min le minimum de l'ensemble des valeurs que le nombre peut prendre
 * @param {int} max le maximum
 * @returns la nombre aléatoire
 */
function rand(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}