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