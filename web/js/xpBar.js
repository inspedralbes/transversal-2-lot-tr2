let progreso = document.getElementById('barra').getElementsByClassName('progreso')[0];
let xpActual = 400;
let xpMax = 750;
let xpExtra = 150;


init();


 
function init () {
   progreso.style.width = `${Math.floor((xpActual/xpMax)*100)}%`;

   afegirXP();
}

function afegirXP () {
    let xpTotal=xpActual+xpExtra;
    
 }











// let barra = document.getElementById('barra');
// let xpActual = barra.getElementsByClassName('xpActual')[0];
// let barraNueva = barra.getElementsByClassName('xpNueva')[0];
// let $barraNueva = $(barraNueva);
// let xpExtra = 150;
// let xp = 400;
// let maxXP = 750;

// init();



// function init () {
//   xpActual.style.width = Math.floor((xp/maxXP)*100) + '%';
//   applyXP(xpExtra);
// }

// function applyXP (n) {
//   let total = n+xp;

//   // Offset where green bar starts
//   let offset = Math.floor((xp/maxXP)*100);
//   barraNueva.style.left =  offset + '%';
//   let newWidth = Math.min(Math.floor((total/maxXP)*100), 100)-offset;
  
//   // Milliseconds for animation
//   let speed = 1500;
  
//   xp = total;
//   let levelup = false;
//   if (total >= maxXP) {
//     xp = total-maxXP;
//     levelup = true;
    
//     // Speed up animation by the ratio of what is cut off.
//     speed = ((n-xp)/n)*speed;
    
//     // Increase amount of XP it takes to get to the next level.
//     maxXP *= 1.5;
//   }
  
//   $barraNueva.animate({width:newWidth + '%'}, speed, null, function () {
//     xpActual.style.width = newWidth + offset + '%';
//     barraNueva.style.width = '0%';
//     if (levelup) {
//       // Reset
//       xpActual.style.width = '0%';
//       let newxp = xp;
//       xp = 0;
//       applyXP(newxp);
//     }
//   })
  

// }