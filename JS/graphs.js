var pas=0
var timer;
var pasprog=0

function HistoTcr(){

    // maintien de la demande (typgrph)

    

    //ombre sur les histos

    // placement dans le titre + bouton? 

    // mention de la moyenne dans le graph


    var valmin=0;
    var effmax=0;

    // création du tableau des valeurs 

    TcrH = new Array(Tcr.length)
    
        for (l=0;l<TcrH.length;l++) {
        
            TcrH[l] = new Array(Tcr[l].length)
        
        }


    // détermination du type de graph 

     typgrph = document.getElementById("choixHisto").value;

     
    // remplissage du tableau des valeurs
    
    for (l=0;l<TcrH.length;l++) {
        for (c=0;c<TcrH[l].length;c++) {

                if (typgrph==1) { // effectifs
                    TcrH[l][c]=Tcr[l][c]; 
                    if (effmax<Tcr[l][c]){effmax=Tcr[l][c]}
                    var v1=vC
                    var v2=vL
                    var Mrg1 = MrgY
                    var Moda1 = ModaY
                    var Mrg2 = MrgX
                    var Moda2 = ModaX
                    var nbcat1 = cnonvide
                    var nbcat2 = lnonvide 
                } 

                if (typgrph==2) { // % en lignes (par colonnes)
                    TcrH[l][c]=Tcr[l][c]/MrgX[l]*100;
                    effmax = 100 
                    var v1=vL
                    var v2=vC
                    var Mrg1 = MrgX
                    var Moda1 = ModaX
                    var Mrg2 = MrgY
                    var Moda2 = ModaY
                    var nbcat1 = lnonvide
                    var nbcat2 = cnonvide 
                } 

                if (typgrph==3) { // % en lignes (par lignes)
                    TcrH[l][c]=Tcr[l][c]/MrgX[l]*100
                    //TcrH[l][c]=Tcr[l][c]/MrgY[c]*100;
                    effmax = 100 
                    var v1=vC
                    var v2=vL
                    var Mrg1 = MrgY
                    var Moda1 = ModaY
                    var Mrg2 = MrgX
                    var Moda2 = ModaX
                    var nbcat1 = cnonvide
                    var nbcat2 = lnonvide 
                } 


    
        }
    }



    
    
    // dessin du fond 

    const canvas = document.getElementById("fondTcr");

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');
    
    // définition de la largeur 
    var lartab=document.getElementById("TabTCR").offsetWidth
     
    if (lartab < 1000) {lartab=1000}
     
    canvas.width= lartab;

    // définition des bornes (pour la légende)
    
    var margG= 250
    var margD= 10
    var margH= 50
    var margB= 100

    var lartot = lartab  // document.getElementById("fondTcr").offsetWidth
    var hautot = 650// document.getElementById("fondTcr").offsetHeight
    var lardisp = lartot - (margG+margD)
    var haudisp = hautot - (margH+margB)

        // les non réponses sont-elles incluses?
        NRX = document.getElementById('ChkNRX').checked
        NRY = document.getElementById('ChkNRY').checked
        if (NRX == false ) {
            RgDpX=1; }
        else {
            RgDpX = 0;
        }
    
        if (NRY == false ) {
            RgDpY=1; }
        else {
            RgDpY = 0;
        }

    // dessin du fond
    // fond blanc
    cnv.fillStyle = "white";
    cnv.fillRect(0, 0, lartot, hautot);

    var my_gradient = cnv.createLinearGradient(margG, margH, margG, haudisp);
    my_gradient.addColorStop(0, "white");
    my_gradient.addColorStop(0.5,"rgb(250 250 255)");
    my_gradient.addColorStop(1, "rgb(245 245 250)");
    cnv.fillStyle = my_gradient;
    cnv.fillRect(margG, margH, lardisp, haudisp);



    // abcisses
    
    var larcat = (lardisp / nbcat2)  
    var larbar = (larcat / nbcat1) - 20/nbcat1;

    // légende en X
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, hautot-margB, lardisp, 2);
    cnv.font = "12px Arial";
    
    var rgleft =0
    for (b=0;b<CdMax[v2]+1;b++) {
        
        if (Mrg2[b] >0) {


            cnv.fillStyle = 'rgb(220 220 250)';
            var posleg = margG + rgleft*larcat;
            cnv.fillRect(posleg, margH, 1, haudisp+10);

            cnv.fillStyle = 'rgb(255 255 255)';
            cnv.fillRect(posleg + 2, hautot - margB + 10, lartot, 40);

            cnv.fillStyle = 'rgb(90 90 90)';

             
            var tlignes = splitchaine(Moda2[b],larcat,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            
            var rgtop =hautot - margB + 20
            for (l=0;l<tlignes.length;l++) {
                var lartxt =  cnv.measureText(tlignes[l]).width 
                cnv.fillText(tlignes[l], posleg + (larcat - lartxt)/2,rgtop );
                rgtop+=15; 
            }
            
            rgleft++; 
        }

    }


   // ajout de l'étiquette de légende
   
    // calage au centre de l'étiquette
    var lib = Nom[v2] + " - " + Libellé[v2] 
    var lartxt =  cnv.measureText(lib).width 
    lartxt=Math.floor(lartxt) +5

   cnv.fillText(lib, margG + (lardisp - lartxt)/2,  hautot - 20);


    // légende 
    var lib = Nom[v1] + " - " + Libellé[v1] 
    cnv.fillText(lib, 20, margH - 20);

    var rgtop = 0

    for (b=0;b<CdMax[v1]+1;b++) {
        
        if (Mrg1[b] >0) {
            var posleg = 15 ;
            cnv.fillStyle = tabcouls[b]
            cnv.fillRect(posleg, margH + rgtop, 15, 15);

            // évaluation de la longueur
                        
            var tlignes = splitchaine(Moda1[b],margG-posleg-55,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            
            for (l=0;l<tlignes.length;l++) {
                cnv.fillText(tlignes[l], posleg + 25, margH + rgtop + 8);
                rgtop+=15; 
            }
            rgtop+=10; 


            
        }

    }



 

    // ordonnées
    effmaxtxt = String(effmax);
    pas = effmaxtxt.length;

    var ech = 1;
    if (pas>1) {
        var ech = Math.pow(10,(pas-1))
    } else {
        ech=2;
    }

    ech=ech/2;

    var reste = effmax%ech;
    
    var echymax = effmax + ech - reste;

    if (typgrph==2 || typgrph==3) {echymax=100; ech = 10;}
    var hautech = haudisp/echymax;
    //hautech=Math.round(hautech);

    var tabetq = ["","","%", "%"]

    // légende en Y
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, margH, 1, haudisp);
    cnv.font = "12px Arial";
     
    for (b=echymax;b>-1;b--) {

        if (b%ech==0) {

            // effectifs (à gauche)
            var posleg = margH + (echymax-b)*hautech;
            cnv.fillStyle = 'rgb(220 220 250)';
            cnv.fillRect(margG-5, posleg, lardisp+5, 1);
            cnv.fillStyle = 'rgb(90 90 90)';
            cnv.fillText(b + " " + tabetq[typgrph], margG-30, posleg+5);

            
        }

    }
    // ajout de l'étiquette de légende
    //var tabetq = ["","n","% l", "%c"]
    //cnv.fillText(tabetq[typgrph], 10, 250);

    pasprog = 0;
    timer = setInterval(function() {
        Aff_HistoTcr(typgrph,v1,v2, nbcat1, nbcat2, Mrg1, Mrg2,  RgDpX,RgDpY,margG,margH,echymax,haudisp,larcat,larbar);},7)
 
        

                         //affichage de la moyenne 
                         /*
                         if (typgrph == 2 ){ 
                            var valcat = Mrg1[l]/PopTot*100
                            var haubar = valcat/echymax * haudisp
        
                            cnv.fillStyle = 'rgb(200,200,200)'
                            cnv.fillRect(margG + 15 + rangl*larcat + rangc*larbar , margH + haudisp - haubar, larbar - 5, 1 );
        
                        }  
                        */

 /*
    var rangl=0;
    var rangc=0;

    // ajout des catégories
    for (c=RgDpY;c<CdMax[vC]+1;c++) {

            if (MrgY[c] >0) {
                rangc=0;

                for (l=RgDpX;l<CdMax[vL]+1;l++) {
                    
                    if (MrgX[l]>0) {
                    var valcat = TcrH[l][c]
                    var haubar = valcat/echymax * haudisp
                    cnv.fillStyle = 'rgb(22 22 25)';
                    cnv.fillRect(margG + rangl*larcat + rangc*larbar + 2 , margH + haudisp - haubar, larbar - 4, haubar );
                   rangc++;
                    }
            
                }
    
                rangl++;
            }

    }

*/


}



function Aff_HistoTcr(typgrph, v1,v2, nbcat1, nbcat2, Mrg1, Mrg2, RgDpX,RgDpY,margG,margH,echymax,haudisp,larcat,larbar) {
if (pasprog<=25) {pasprog = pasprog+5};
if (pasprog>25 && pasprog<=90 ) {pasprog = pasprog+3};
if (pasprog>90) {pasprog = pasprog+1};


if (pasprog > 100) {
    clearInterval(timer)
    return 0}   



    const canvas = document.getElementById("fondTcr");

 
    const cnv = canvas.getContext('2d');

    var rangl=0;
    var rangc=0;

    // ajout des catégories
    for (c=RgDpY;c<nbcat2 +1;c++) {

            if (Mrg2[c] >0) {
                rangc=0;

                for (l=RgDpX;l<nbcat1+1;l++) {
                    
                    if (Mrg1[l]>0) {

                    
                    if (typgrph == 2){ var valcat = TcrH[l][c] * pasprog/100}
                    if (typgrph == 1 || typgrph == 3){ var valcat = TcrH[c][l] * pasprog/100 }

                    var haubar = valcat/echymax * haudisp

                    cnv.fillStyle = tabcouls[l];
                    //cnv.globalAlpha=0.25; // opacité
                    cnv.fillRect(margG + 15 + rangl*larcat + rangc*larbar , margH + haudisp - haubar, larbar - 5, haubar );
                    
                    
                   
                    // cadre    
                    var coul = 180 - pasprog
                    var fill = 'rgb(' + coul + ',' + coul + ','+ coul + ')'  
                    cnv.strokeStyle = fill
                     
                    cnv.beginPath();
                    cnv.rect(margG + 15 + rangl*larcat + rangc*larbar , margH + haudisp - haubar, larbar - 5, haubar  );
                    cnv.stroke();
                     

                   rangc++;
                    }
            
                }
    
  


                rangl++;
            }

    }


}


function splitchaine(chaine,largeur,font) { // fonction permettant de gérer les sauts de lignes lors de l'impression de texte dans les canvas

    var lartemp;
    var sschaine = "";
    var tablignes=[];
    tablignes[0]="";
    var nmots=0;

    // 1/ splittage de la chaine
     
    var tabmots = chaine.split(/\s+/);
     
    // 2/ ajout des mots jusqu'à besoin de saut de ligne 
    for (m=0;m<tabmots.length;m++) {
         
        sschaine += tabmots[m] + " "; // il est ajouté à la sous-chaine
        
        lartemp = getTextWidth(sschaine,font); // on mesure la largeur de l'ensemble
       

        if(lartemp > largeur) { // l'ajout du dernier mot amène-t-il la chaine à excèder la largeur autorisé?
                     
            // le dernier mot déborderait-il s'il était seul? 
            var larmot = getTextWidth(tabmots[m],font)

            if (larmot>largeur) { // si oui

                var ssmot =splitmot(tabmots[m],largeur, font)
                tablignes[tablignes.length-1] += ssmot[0]
                for (sm=1;sm<ssmot.length;sm++){
                    tablignes.push(ssmot[sm] + " ") 
                    sschaine=ssmot[sm] + " ";     
                }

            } else { // si non

                tablignes.push(tabmots[m] + " "); // création d'une nouvelle ligne vide

                sschaine=tabmots[m] + " ";   
                
            }

 

        } else {

            tablignes[tablignes.length-1] += tabmots[m] + " ";
            
             
            
        }
        
    }
     
    return tablignes;

}

function splitmot(mot, largeur, font){

    var tabcars=[];
    tabcars[0]="";
    var sschaine;

    for (c=0;c<mot.length+1;c++){
        var carext = mot.substr(c,1);
        sschaine +=carext;

        lartemp = getTextWidth(sschaine,font); // on mesure la largeur de l'ensemble

        if(lartemp > largeur) {
            tabcars.push(carext); // création d'une nouvelle ligne vide
            sschaine=carext;
        } else {
            tabcars[tabcars.length-1] +=carext;
        }

    }

    return tabcars;

}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = document.getElementById("cnvGetLar");
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}