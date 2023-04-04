var pas=0
var timer;
var pasprog=0


////////////////////////////////////////////////////////////////////////////////
// histogrammes tirés des tableaux croisés
///////////////////////////////////////////////////////////////////////////////
function HistoTcr(rg){

    

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

     typgrph = document.getElementById("choixHisto"+rg).value;

     // Si c'est un tableau graphique
     if (typgrph>4) {

        //legendTcr();
        pasprog = 0;
        timer = setInterval(function() {
            GraphTcr(rg);
        },7)

        
        return 0;
     }
     
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

    const canvas = document.getElementById("fondTcr"+rg);

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

            var txtmoda =  Moda2[b]
            if (txtmoda==""){txtmoda=b}
            var tlignes = splitchaine(txtmoda,larcat,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            
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
            
            var txtmoda =  Moda1[b]
            if (txtmoda==""){txtmoda=b}
            var tlignes = splitchaine(txtmoda,margG-posleg-55,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            
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
        Aff_HistoTcr(typgrph,v1,v2, nbcat1, nbcat2, Mrg1, Mrg2,  RgDpX,RgDpY,margG,margH,echymax,haudisp,larcat,larbar,rg);},7)
 
        

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

function Aff_HistoTcr(typgrph, v1,v2, nbcat1, nbcat2, Mrg1, Mrg2, RgDpX,RgDpY,margG,margH,echymax,haudisp,larcat,larbar,rg) {
    if (pasprog<=25) {pasprog = pasprog+5};
    if (pasprog>25 && pasprog<=90 ) {pasprog = pasprog+3};
    if (pasprog>90) {pasprog = pasprog+1};
    
    
    if (pasprog > 100) {
        clearInterval(timer)
        return 0}   
    
    
    
        const canvas = document.getElementById("fondTcr"+rg);
    
     
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
    

function legendTcr(){

    
    const canvas = document.getElementById("fondTcr");

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');
    var hautot =  document.getElementById("fondTcr").offsetHeight
    var lartot =  document.getElementById("fondTcr").offsetWidth

    cnv.fillStyle = 'white';
    cnv.fillRect(0, 0, lartot, hautot); // effacement du tableau précédent

    cnv.font = "12px Arial"
    cnv.fillStyle = 'black';



    // variable en ligne
    var txtlbl = Nom[vL] + " - " + Libellé[vL];

    var tlignes = splitchaine(txtlbl,lartot-100,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
    
    var rgtop= 15 
    for (l2=0;l2<tlignes.length;l2++) {
        var lartxt =  cnv.measureText(tlignes[l2]).width
        var x1= (lartot - lartxt) /2 
        cnv.fillText(tlignes[l2], x1 ,rgtop  );
    rgtop+=15;     
    }
    


}


////////////////////////////////////////////////////////////////////////////////////////////////
// Boites à moustaches
///////////////////////////////////////////////////////////////////////////////////////////////



function Moustaches(cadre, x, y,nbc) {


    const canvas = document.getElementById(cadre);

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');


    // extraction de la colonne des y (sans filtrage pour échelle)

    // les non réponses sont-elles incluses?
    var NRC = document.getElementById('ChkNRY').checked

    var col = ExtractCol(y,NRC, 0,0)
    TriParTas (col);

    var rgl = Reco[y]



    var valmin = ValApRec(col[0],rgl)
    valmin = Math.floor(valmin);
    var valmax = ValApRec(col[col.length-1],rgl)
    valmax= Math.floor(valmax)+1;




    // définition des bornes (pour la légende)

    // variables pour l'affichage
    var margG= 50
    var margD= 50
    var margH= 50
    var margB= 50

    var lartot= 1000
    var hautot= 500
    var lardisp = lartot - (margG+margD)
    var haudisp = hautot - (margH+margB)

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



    // ordonnées
    effmaxtxt = String(valmax);
    pas = effmaxtxt.length;

    var ech = 1;
    if (pas>1) {
        var ech = Math.pow(10,(pas-1))
    } else {
        ech=2;
    }

    ech=ech/2;

    var reste = valmax%ech;
    var echymax = valmax + ech - reste;
    var reste = valmin%ech;
    var echymin = valmin - ech - reste;
    if (echymin<0){echymin=0}


    var hautech = haudisp/(echymax-echymin);
    //hautech=Math.round(hautech);



    // légende en Y
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, margH, 1, haudisp);
    cnv.font = "12px Arial";
    var lastpct;
    for (b=echymax;b>echymin-1;b--) {

        if (b%ech==0) {

            // effectifs (à gauche)
            var posleg = margH + (echymax-b)*hautech;
            cnv.fillStyle = 'rgb(220 220 250)';
            cnv.fillRect(margG-5, posleg, lardisp+5, 1);

            cnv.fillStyle = 'rgb(90 90 90)';
            cnv.fillText(b, margG-30, posleg+5);


            pct= b/PopTot *100
            pct=pct.toFixed(2)
            //pct=Math.round(pct)



        }

    }
    // ajout de l'étiquette de légende
    cnv.fillText("n", 10, 250);


    // abcisses
    posleg = margG // calage à gauche de l'affichage


    var larbar = lardisp/(nbc);
    if (larbar > 200) {larbar = 200};
    var hautech =  echymax-echymin;

    // les non réponses sont-elles incluses?
    var NRX = document.getElementById('ChkNRX').checked;
    var rgstart =0;
    if (NRX == false ) {rgstart=1};

    for (c=rgstart;c<CdMax[x]+1;c++) {
        //larbar=Math.round(larbar) ;

        // extraction de la colonne
        Colonne = ExtractCol(y,NRC, x,c)

         if (Colonne.length<1) {continue}


        // légende en X
        cnv.fillStyle = 'rgb(90 90 90)';
        cnv.fillRect(margG, hautot-margB, lardisp, 1);
        cnv.font = "12px Arial";

        //Etiquette de ligne

        cnv.fillStyle = 'rgb(250 250 250)';
        cnv.fillRect(posleg, 452, 1000, margB);

        cnv.fillStyle = 'rgb(90 90 90)';

        //var posleg = margG + (c+1) *larbar;
        cnv.fillRect(posleg, 450, 1, 5);

        // ajout de l'étiquette de légende

        var tlignes = splitchaine(Moda[x][c],larbar-15,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
                 
        var rgtop=470;
        for (l2=0;l2<tlignes.length;l2++) {
            // définition de la largeur de l'étiquette
            var lartxt =  cnv.measureText(tlignes[l2]).width 
            var lft= (larbar/2) - (lartxt/ 2 )

            if (lft<0){lft=5}
            
            cnv.fillText(tlignes[l2], posleg + lft,rgtop);
            rgtop+=15;    
        }






        


        // extremas
        var valmin = jStat.min(Colonne)
        var valmax = jStat.max(Colonne)

        var y1 = hautot-margB - ((valmax-echymin)/hautech) * haudisp;
        var y2 =  ((valmax-valmin)/hautech) * haudisp

        cnv.fillRect(posleg+larbar/2, y1, 1, y2);

        cnv.fillRect(posleg+larbar/2 - 4, y1, 9, 1);
        cnv.fillRect(posleg+larbar/2 - 4, y1+y2, 9, 1);


        // Quartiles
        var Qrts =jStat.quartiles(Colonne)

        var valQ2 = Qrts[0]
        var valMed = Qrts[1]
        var valQ3 = Qrts[2]


        var y1 = hautot-margB - ((valQ3-echymin)/hautech) * haudisp;
        var y2 =  ((valQ3-valQ2)/hautech) * haudisp

        cnv.fillStyle = 'rgb(103 148 189)';
        cnv.fillRect(posleg+ 20, y1, larbar-40, y2);

        cnv.fillStyle = 'rgb(9 9 9)';
        cnv.beginPath();
        cnv.rect(posleg+ 20, y1, larbar-40, y2);
        cnv.stroke();


        //médiane
        var y1 = hautot-margB - ((valMed-echymin)/hautech) * haudisp;
        cnv.fillRect(posleg+ 20, y1, larbar-40, 1);


        posleg += larbar;

    }







}

////////////////////////////////////////////////////////////////////////////////////////////////
// Nuage de points
///////////////////////////////////////////////////////////////////////////////////////////////



function Nuage(cadre, x, y ) {


    const canvas = document.getElementById(cadre);

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');


    // extraction de la colonne des y (sans filtrage pour échelle)

    // les non réponses sont-elles incluses?
    var NRC = document.getElementById('ChkNRY').checked

    var col = ExtractCol(y,NRC, 0,0)
    TriParTas (col);

    var rgl = Reco[y]



    var valminx = ValApRec(jStat(Cols[1]).min(),rgl)
    valminx = Math.floor(valminx);
    var valmaxx = ValApRec(jStat(Cols[1]).max(),rgl)
    valmaxx= Math.floor(valmaxx);

    var valminy = ValApRec(jStat(Cols[2]).min(),rgl)
    valminy = Math.floor(valminy);
    var valmaxy = ValApRec(jStat(Cols[2]).max(),rgl)
    valmaxy= Math.floor(valmaxy);


    // définition des bornes (pour la légende)

    // variables pour l'affichage
    var margG= 60
    var margD= 50
    var margH= 50
    var margB= 60

    var lartot= 1200
    var hautot= 650
    var lardisp = lartot - (margG+margD)
    var haudisp = hautot - (margH+margB)

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


    /////////////////://///////////////://///////////////://///////////////://///////////////://///////////////:
    // légendes 
    /////////////////://///////////////://///////////////://///////////////://///////////////://///////////////:
     
        
    cnv.font = "14px Arial"
    cnv.fillStyle = 'black';



        // variable en colonnes
        var txtlbl = Nom[x] + " - " + Libellé[x];

        var tlignes = splitchaine(txtlbl,lardisp,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
        
        var rgtop= margH + haudisp + 35

        for (l2=0;l2<tlignes.length;l2++) {
            var lartxt =  cnv.measureText(tlignes[l2]).width
            var x1= margG +   (lardisp  - lartxt ) /2 
            cnv.fillText(tlignes[l2], x1 ,rgtop);
        rgtop+=15;     
        }


        // variable en lignes
        var txtlbl = Nom[y] + " - " + Libellé[y];

        var tlignes = splitchaine(txtlbl,haudisp,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
        var lartxt =  cnv.measureText(tlignes[0]).width

        cnv.save();
        cnv.translate(0, margH  +  haudisp);
        cnv.rotate(-Math.PI/2);
        //cnv.textAlign = "center";           
        
        
        var rgtop= 20 
        for (l2=0;l2<tlignes.length;l2++) {

        // rotation pour écriture verticale

        var lartxt =  cnv.measureText(tlignes[l2]).width
             
            cnv.fillText(tlignes[l2],(haudisp  - lartxt)/2 ,rgtop);
        rgtop+=15;     
                   
            
        }

        cnv.restore();





    // abscisse
    effmaxtxt = String(valmaxx);
    pas = effmaxtxt.length;

    var ech = 1;
    if (pas>1) {
        var ech = Math.pow(10,(pas-1))
    } else {
        ech=2;
    }

    ech=ech/2;
    
    var reste = valmaxx%ech;
    if (reste>0) {var echxmax = valmaxx + ech - reste;} else {var echxmax = valmaxx; }
    var reste = valminx%ech;
    if (reste>0) {var  echxmin = valminx - ech - reste;} else {var echxmin = valminx  }
    //var echxmin = valminx - ech - reste;
    if (echxmin<0 && valminx > 0){echxmin=0}

    

     
    var larech = lardisp/(echxmax-echxmin);
    

    // légende en x 
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, margH, 1, haudisp);
    cnv.font = "12px Arial";
         
    for (b=echxmin;b<echxmax+1;b++) {

        if (b%ech==0) {
             
            // effectifs (à gauche)
            var posleg = margG + b*larech;
            cnv.fillStyle = 'rgb(220 220 250)';
            cnv.fillRect( posleg, margH + haudisp, 1,10);

            cnv.fillStyle = 'rgb(90 90 90)';
            cnv.fillText(b,  posleg+2 , margH + haudisp+ 15);


           


        }

    }

 



    // ordonnées
    effmaxtxt = String(valmaxy);
    pas = effmaxtxt.length;

    var ech = 1;
    if (pas>1) {
        var ech = Math.pow(10,(pas-1))
    } else {
        ech=2;
    }

    ech=ech/2;

    var reste = valmaxy%ech;
    if (reste > 0) {var echymax = valmaxy + ech - reste;} else {var echymax = valmaxy;} 
    var reste = valminy%ech;
    if (reste > 0) {var echymin = valminy - ech - reste;} else {var echymin = valminy;}
    if (echymin < 0 && valminy >=0) {echymin=0;}
     


    var hautech = haudisp/(echymax-echymin);
    //hautech=Math.round(hautech);



    // légende en Y
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, margH, 1, haudisp);
    cnv.font = "12px Arial";
    var lastpct;
    for (b=echymax;b>echymin-1;b--) {

        if (b%ech==0) {

            // effectifs (à gauche)
            var posleg = margH + (echymax-b)*hautech;
            cnv.fillStyle = 'rgb(220 220 250)';
            cnv.fillRect(margG-5, posleg, lardisp+5, 1);

            cnv.fillStyle = 'rgb(90 90 90)';
            cnv.fillText(b, margG-30, posleg+5);


            pct= b/PopTot *100
            pct=pct.toFixed(2)
            //pct=Math.round(pct)



        }

    }
    // ajout de l'étiquette de légende
    cnv.fillText("n", 10, 250);


    // ajout des points 
    var valx,valy; // valeurs x et y pour le point 
    var valxs,valys; // valeurs x et y pour le point suivant
    var nbi=0; // nombre d'individus à la combinaison donnée
 


    for (l=0;l<Cols[1].length+1;l++){
        valx= Cols[1][l];
        valy = Cols[2][l];
        valxs= Cols[1][l+1];
        valys = Cols[2][l+1];

         if (valx != valxs || valy != valys || l == Cols[1].length ) { // si la valeur suivante est différente ou si l'on est à la fin des enregistrements
            // définition de la position en fonction des valeurs
            var posx = margG + valx / (echxmax - echxmin) * lardisp
            var posy = margH + haudisp - valy / (echymax - echymin) * haudisp
            
            cnv.globalAlpha=0.2 +nbi*0.05;

            cnv.beginPath();
            cnv.arc(posx, posy, 3 + nbi, 0, 2 * Math.PI, false);
            cnv.fillStyle =  'rgb(200 200 250)';
            cnv.fill();
            cnv.lineWidth = 2;
            cnv.strokeStyle = 'rgb(100 100 250)';
            cnv.stroke();

       
            nbi=0;
        } else {
            nbi+= 100/PopTot;    
        }


      
    }


    // calcul du coeff directeur (méthode des moindres carrés)
    var covar = jStat.covariance( Cols[1], Cols[2] )
    var varx = jStat.variance(Cols[1])
    var a = covar/varx;
    var oo= jStat.mean(Cols[2]) - a*jStat.mean(Cols[1])

    //alert("coeff dir = " + a + "\n" + "ordonnée à l'origine = " + oo)

    //tracé de la droite de régression linéaire
    var x1= echxmin;
    var y1= a * x1 + oo;
    var x2= echxmax;
    var y2= a * x2 + oo;

    x1=margG
    x2=margG + lardisp
    y1=margH + haudisp - (y1 / (echymax-echymin)*haudisp); 
    y2=margH + haudisp - (y2 / (echymax-echymin)*haudisp); 

    cnv.strokeStyle = 'rgb(155 155 255)';
    cnv.lineWidth = 1;
    cnv.globalAlpha=1
    cnv.beginPath(); 
    cnv.moveTo(x1,y1);
    cnv.lineTo(x2,y2);
    cnv.stroke();




}


// GRAPHIQUES EN TIROIR

function GraphTcr(rg){ 
    // fonctionnalité de dessin des tableaux croisés, permettant l'affichage des cases en relief

    // définition du rythme de progression
    if (typgrph != 7) { // pour tous les styles hors écarts à l'indépendance
        if (pasprog<=25) {pasprog = pasprog+5};
        if (pasprog>25 && pasprog<=50 ) {pasprog = pasprog+3};
        
        if (pasprog>50 && pasprog<=90 ) {pasprog = pasprog+2};
        if (pasprog>90) {pasprog = pasprog+0.5};
    } else { 

       // if (pasprog==50 ) {alert("Effectifs sous l'hypothèse d'indépendance")}
        pasprog++;
    }

     
    if (pasprog > 100 || pasprog<0) {
        clearInterval(timer)
        return 0}   

        

    var valmin=0;
    var effmax=0;
 

    // détermination du type de graph 

     typgrph = document.getElementById("choixHisto"+rg).value;

     
  
   
    
    // dessin du fond 

    const canvas = document.getElementById("fondTcr"+rg);

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');
    
    // définition de la largeur 
    var lartab=document.getElementById("TabTCR").offsetWidth
     
    if (lartab < 1000) {lartab=1000}
     
    canvas.width= lartab;

    // définition des bornes (pour la légende)
    
    var margG= 50
    var margD= 10
    var margH= 50
    var margB= 50

    var lartot = lartab  // document.getElementById("fondTcr").offsetWidth
    var hautot =  document.getElementById("fondTcr"+rg).offsetHeight
    var lardisp = lartot - (margG+margD)
    var haudisp = hautot - (margH+margB)

    // cas général
    var larcol = lardisp/(cnonvide+2);
    var haulig = haudisp/(lnonvide+2);
    
 


    var coulligs= "rgb(120,120,130)"
    var coulpols= "rgba(0,102,166,0.4)"


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
    //cnv.fillRect(0, 0, lartot, hautot);
    cnv.fillRect(margG, margH, lartot, hautot); // effacement du tableau précédent

    var my_gradient = cnv.createLinearGradient(margG, margH, margG, haudisp);
    my_gradient.addColorStop(0, "white");
    my_gradient.addColorStop(0.5,"rgb(250 250 255)");
    my_gradient.addColorStop(1, "rgb(245 245 250)");
    //cnv.fillStyle = my_gradient;
    //cnv.fillRect(margG, margH, lardisp, haudisp);

    
    /////////////////://///////////////://///////////////://///////////////://///////////////://///////////////:
    // légendes 
    /////////////////://///////////////://///////////////://///////////////://///////////////://///////////////:
     
        
        cnv.font = "14px Arial"
        cnv.fillStyle = 'black';



            // variable en colonnes
            var txtlbl = Nom[vC] + " - " + Libellé[vC];

            var tlignes = splitchaine(txtlbl,lardisp,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            
            var rgtop= 20 
            for (l2=0;l2<tlignes.length;l2++) {
                var lartxt =  cnv.measureText(tlignes[l2]).width
                var x1= margG + larcol + (lardisp- larcol - lartxt ) /2 
                cnv.fillText(tlignes[l2], x1 ,rgtop);
            rgtop+=15;     
            }


            // variable en lignes
            var txtlbl = Nom[vL] + " - " + Libellé[vL];

            var tlignes = splitchaine(txtlbl,haudisp-haulig,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            var lartxt =  cnv.measureText(tlignes[0]).width

            cnv.save();
            cnv.translate(0, margH  +  haudisp);
            cnv.rotate(-Math.PI/2);
            //cnv.textAlign = "center";           
            
            
            var rgtop= 20 
            for (l2=0;l2<tlignes.length;l2++) {

            // rotation pour écriture verticale

            var lartxt =  cnv.measureText(tlignes[l2]).width
                 
                cnv.fillText(tlignes[l2],(haudisp - haulig - lartxt)/2 ,rgtop);
            rgtop+=15;     
                       
                
            }

            cnv.restore();

    /////////////////://///////////////://///////////////://///////////////://///////////////://///////////////:
    // En-têtes 
    /////////////////://///////////////://///////////////://///////////////://///////////////://///////////////:
     
    var lg=0;
    var topcur = margH+haulig;
    for (l=RgDpX;l<CdMax[vL]+2;l++) { // dessin des lignes
         
        var haulig = haudisp/(lnonvide+2);

        if (typgrph==7 && l<=CdMax[vL] ) {

            var hprop= MrgX[l]/PopTot * (haudisp-haulig*2);
            if (hprop<15 || isNaN(hprop)){hprop=15;} 
            //alert("hauteur ligne moy : " + haulig + " hauteur proportionnelle : " + hprop + "diff de points : " + (hprop - haulig))
           if (pasprog <=50) {haulig=haulig + (hprop - haulig) / 100 * pasprog *2 
            } else { haulig=haulig + (hprop - haulig) } 

        }
         
        if(MrgX[l]>0 || l>CdMax[vL]) { 
            
            // en-têtes 
            cnv.fillStyle = 'rgba(0 102 166 0.2)';
            
            var x1= margG ;
            var x2=  larcol;
            var y1 = topcur // margH + ( (lg+1) * haulig);
            var y2=  haulig ;

            //cnv.fillRect(x1, y1, x2, y2);
            //cnv.fillRect(x1, y1, margD, margB);

            cnv.fillStyle = coulligs;
            cnv.beginPath();
            cnv.rect(x1, y1, x2, y2);
            cnv.stroke();
            cnv.fillStyle = "white"
            cnv.fill();

            cnv.fillStyle = coulligs;
            cnv.beginPath();
            cnv.rect(x1, y1, lardisp, haulig);
            cnv.stroke();

            lg++;
            topcur+=haulig;

            cnv.font = "14px Arial"
            cnv.fillStyle = coulligs;

            var txtlbl;
                if (l>CdMax[vL]) {txtlbl="Total"; } else {txtlbl = ModaX[l];}

            var tlignes = splitchaine(txtlbl,larcol-20,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            
            var rgtop= y1+15 
            for (l2=0;l2<tlignes.length;l2++) {
                var lartxt =  cnv.measureText(tlignes[l2]).width 
                cnv.fillText(tlignes[l2], x1 + 15 ,rgtop  );
            rgtop+=15;     
            }

             

        }

    }

    var cl=1;
    var lcur = margG + larcol;
    for (c=RgDpY;c<CdMax[vC]+2;c++) {
         
    var larcol = lardisp/(cnonvide+2);

            if(MrgY[c]>0 ||c>=CdMax[vC] ) {

            

            if (typgrph==7 && c<=CdMax[vC]) {
                var wprop= MrgY[c]/PopTot * (lardisp-larcol*2);           

                   // alert(pasprog + " larcol " + larcol + " - wprop : " + wprop + "écart : " + (wprop-larcol) / 100 * pasprog  )
                    //if (wprop<0 || isNaN(wprop)){wprop=15;}
                    
                    var débord ;
                    
                    if (pasprog<=50) {débord = (wprop - larcol) / 100 * pasprog *2;
                    } else {débord = (wprop - larcol)}

                    
                    
                    //if (pasprog>90) {alert(pasprog + "(" + c + ") larcol avant modif : " + larcol + "débord : " + débord  )}
                    larcol=larcol +  débord; 
                    if (larcol<=15){larcol=15}

                    //alert(pasprog + " > c = " + c + " - "  + larcol)
            }   
               
            // en-têtes 
            cnv.fillStyle = 'rgb(255 255 255)';
            
            var x1= lcur // margG + cl*larcol;
            var x2=  larcol;
            var y1 = margH;
            var y2= haulig ;

            cnv.fillRect(x1, y1, x2, y2);
            
             
            cnv.fillStyle = 'rgb(190 190 190)';
            cnv.beginPath();
            cnv.rect(x1, y1, x2, y2);
            cnv.stroke();
            
            cnv.beginPath();
            cnv.rect(x1, y1, larcol, haudisp);
            cnv.stroke();
            
            
            lcur = lcur + larcol;
             

            cnv.font = "14px Arial"
            cnv.fillStyle = coulligs;

            var txtlbl;
                if (c>CdMax[vC]) {txtlbl="Total"; } else {txtlbl = ModaY[c];}


               
            if (larcol < 15 ) {txtlbl="."} // étiquette uniquement si la largeur est suffisante

                
                var tlignes = splitchaine(txtlbl,larcol-15,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
                 
                var rgtop= y1+15 

                for (l2=0;l2<tlignes.length;l2++) {
                    //var lartxt =  cnv.measureText(tlignes[l2]).width 
                    cnv.fillText(tlignes[l2], x1 + 10 ,rgtop);
                    rgtop+=15;    
                }
            
            

            

            cl++;
             


        }

        
    }     
    
    
    
    ////////////////////////
    // Contenu des cases
    ////////////////////////
    
    var lg=1;
    var hmax=50;

    var ratio =0;
    var coul = "rgba(230,230,230,0.5)"

   
    var hcur=margH+haulig;

    for (l=RgDpX;l<CdMax[vL]+2;l++) { 

    var larcol = lardisp/(cnonvide+2);
     var lcur=margG+larcol;
         
        if(MrgX[l]>0 || l >CdMax[vL] ) {
        
            
            var haulig = haudisp/(lnonvide+2);
            if (typgrph==7 && l<=CdMax[vL] ) {
                var hprop= MrgX[l]/PopTot * (haudisp-haulig*2);
                if (hprop<15  || isNaN(hprop) ){hprop=15;}    

                if (pasprog<=50) {
                haulig=haulig + (hprop - haulig) / 100 * pasprog *2
                } else { haulig=haulig + (hprop - haulig)}   
            }


            var cl=1;   
            
            

            for (c=RgDpY;c<CdMax[vC]+2;c++) {
            
                var valcase =0;

                if(MrgY[c]>0 || c>CdMax[vC]) {

            
                    var larcol = lardisp/(cnonvide+2);

                    if (typgrph==7 && c<=CdMax[vC]) {
                        var wprop= MrgY[c]/PopTot * (lardisp-larcol*2);           
                            if (wprop<15 || isNaN(wprop)){wprop=15;}
                            if (pasprog<=50) {
                            larcol=larcol + (wprop - larcol) / 100 * pasprog *2 
                        } else {larcol=larcol + (wprop - larcol) }
                    } 

                    
                    x1= lcur // margG + cl*larcol;
                    x2 = x1+larcol;
                    y1 = hcur;
                    y2=y1+haulig;

                   
                    
                    // pourcentage du total
                    if (typgrph==5) { 
                        
                        if (l <=CdMax[vL] && c <= CdMax[vC]  ) {ratio= Tcr[l][c]/PopTot ; valcase = ratio *100 } // case du tableau
                        if (l>CdMax[vL] && c <= CdMax[vC]  ) {ratio= MrgY[c]/PopTot ; valcase = ratio *100   } // total en colonne
                        if (l <= CdMax[vL] && c > CdMax[vC]  ) {ratio= MrgX[l]/PopTot ;valcase = ratio *100 } // total en ligne
                        if (l >CdMax[vL] && c > CdMax[vC]  ) {ratio= 0 ;valcase = 100  } // total 
                   // mise à l'échelle
                   ratio=ratio* hmax / 100 * pasprog

 

                     }

                    

                     
                    // pourcentage en ligne
                    if (typgrph==6) {
                        
                        coul = "rgba(255,255,255,1)"; // fond de case blanc par défaut

                        if (l <=CdMax[vL] && c <= CdMax[vC]  ) {// case du tableau
                            ratio= Tcr[l][c]/MrgX[l] ;
                            valcase = ratio *100 
                         
                        // défition de la couleur des cases
                         var ecmoy = ratio - MrgY[c]/PopTot;
                         if (ecmoy > 0) {coul = "rgba(20,220,30," + (ecmoy*3) + ")";} 
                         if (ecmoy < 0) {coul= "rgba(230,20,30," + (ecmoy*-3) + ")";}

                        } 
                        
                        if (l>CdMax[vL] && c <= CdMax[vC]  ) {ratio= MrgY[c]/PopTot ;valcase = ratio *100  } // total en colonne
                        if (l <= CdMax[vL] && c > CdMax[vC]  ) {ratio= MrgX[l]/PopTot ; valcase = 100  } // total en ligne
                        if (l >CdMax[vL] && c > CdMax[vC]  ) {ratio= 0 ;valcase = 100  } // total 
                         // mise à l'échelle
                         ratio=ratio* hmax * pasprog/100




                    }

                    // écarts à l'indépendance
                    if (typgrph==7) {
                        
                        var indep = MrgX[l]*MrgY[c]/PopTot/MrgX[l];
                        var effth = MrgX[l]*MrgY[c]/PopTot  ;
                          
                        if (l <=CdMax[vL] && c <= CdMax[vC]  ) { // case du tableau
                            ratio= Tcr[l][c]/MrgX[l] - indep; 
                            if (pasprog<51) { 
                                valcase=effth * pasprog/50;
                            } 
                            if (pasprog >50 & pasprog< 99) {
                                valcase= effth +  (Tcr[l][c] - effth)   * (pasprog-50)/50 ; 
                            }
                            if (pasprog >98) {
                                valcase= Tcr[l][c] - MrgX[l]*MrgY[c]/PopTot  * (pasprog-50)/50 ; 
                            }

                            ratio=ratio*3;  

                        }  
                        
                        if (l>CdMax[vL] && c <= CdMax[vC]) { ratio= 0;} // MrgY[c]/PopTot; } // total en colonne
                        if (l <= CdMax[vL] && c > CdMax[vC]) {ratio= 0;} // MrgX[l]/PopTot ;  } // total en ligne
                        if (l >CdMax[vL] && c > CdMax[vC]) {ratio= 0;} // total 

                         // mise à l'échelle
                         var indrat = indep * hmax  ; 
                        
                        if (l<=CdMax[vL]) { // cases du tableau
                            /*if (pasprog <50) { // premier passage, affichage de l'indépendance
                            ratio=indep * hmax * pasprog*2/100; // dédoublement du pas                           
                            } 
                            
                            
                            */
                            if (pasprog >=50) { 
                            ratio=ratio* hmax *  (pasprog-50) *2  / 100
                            } else {ratio=0;}

                                // définition de la couleur des côtés
                                
                                coul = "rgba(230,230,230,0.5)"
                    
                                //AffichCase(x1,y1,x2,y2,ratio,coul)
                                if (ratio ==0) {coul = "rgba(255,255,255,1)";} 
                                if (ratio >0) {coul = "rgba(20,220,30,0.3)";} 
                                if (ratio <0) {coul= "rgba(230,20,30,0.3)";}
                                
  
                           

                            
                        } else {

                            /*

                            coul = "rgba(230,230,230,0.5)";

                            if (pasprog<50){

                                ratio=ratio * hmax * pasprog *2/100
                                
                            } else {
                                ratio=ratio * hmax ; 
                                }
                                
                            */
                        }
                        
                        
                    }                    
                    
                    
                    valcase=valcase.toFixed(NbDec);
                   
                    if (typgrph==7  ){
                        if ( ratio > 0 && pasprog>99) {valcase = "+" + valcase}
                    } else {  
                        valcase = valcase + "%" 
                    }
                    
                       
                    AffichCase(x1,y1,x2,y2,ratio,coul,valcase,rg)


                    lcur =lcur + larcol;
                    
                    cl++;
                }
            
           
            }    
            
            lg++;
            
            hcur =hcur + haulig;
        }
        
    }


        
         
    /*
    pasprog = 0;
    timer = setInterval(function() {
        Aff_HistoTcr(typgrph,v1,v2, nbcat1, nbcat2, Mrg1, Mrg2,  RgDpX,RgDpY,margG,margH,echymax,haudisp,larcat,larbar);},7)
    
        */

}

function AffichCase(x1,y1,x2,y2,ratio,coul,valcase,rg) {

    const canvas = document.getElementById("fondTcr"+rg);
    const cnv = canvas.getContext('2d');

    
                    // fond de case
                    cnv.fillStyle = "rgba(220,220,230,1)";
                    cnv.beginPath();
                    cnv.moveTo(x1,y1);
                    cnv.lineTo(x2,y1);
                    cnv.lineTo(x2,y2);
                    cnv.lineTo(x1,y2);
                    cnv.lineTo(x1,y1);
                    cnv.stroke(); 
                    cnv.fill();

                    cnv.fillStyle =coul
                    
 

                    // bord gauche
                    
                    
                    cnv.beginPath();
                    cnv.moveTo(x1,y1);
                    cnv.lineTo(x1-ratio,y1-ratio);

                        if (ratio>=0) { // rabottage de la partie basse en cas de case "creuse"
                        cnv.lineTo(x1-ratio,y2-ratio);
                        cnv.fillStyle = "rgba(220,220,230,0.5)";

                        } else {
                        cnv.lineTo(x1-ratio,y2);
                        }

                    cnv.lineTo(x1,y2);
                    cnv.lineTo(x1,y1);
                    cnv.stroke();
                    cnv.fill(); 

                    
                    //haut
                     
                    cnv.beginPath();
                    cnv.moveTo(x1,y1);
                    cnv.lineTo(x1-ratio,y1-ratio);
                        if (ratio>=0) {
                            cnv.lineTo(x2-ratio,y1-ratio);
                        } else {
                            cnv.lineTo(x2,y1-ratio);    
                        }

                    cnv.lineTo(x2,y1);
                    cnv.stroke();  
                    cnv.fill();                      
                    

                  
                     //cnv.fillStyle = "rgba(220,220,230,0.8)"
                   if (ratio>=0) {
                      //bord droit
                        cnv.beginPath();
                        cnv.moveTo(x2,y1);
                        cnv.lineTo(x2-ratio,y1-ratio);
                        cnv.lineTo(x2-ratio,y2-ratio);
                        cnv.lineTo(x2,y2);
                        cnv.stroke(); 
                        cnv.fill(); 
                
                        //bas
                        
                        cnv.beginPath();
                        cnv.moveTo(x1,y2);
                        cnv.lineTo(x1-ratio,y2-ratio);
                        cnv.lineTo(x2-ratio,y2-ratio);
                        cnv.lineTo(x2,y2);
                        cnv.lineTo(x1,y2);
                        cnv.stroke();  
                        cnv.fill();     

                   }

                    //case flottante
                   // var coul = "rgba(" + 255+ratio + "," + 255+ratio + "," + 255+ratio + ",0.9)" ;
                   cnv.fillStyle =  "rgba(255,255,255,1)";
                   // if (typgrph==7 && ratio >=0) {cnv.fillStyle = "rgba(200,250,200,0.8)";} else {cnv.fillStyle = "rgba(70,20,30,0.2)";}

                    cnv.beginPath();
                    cnv.moveTo(x1-ratio,y1-ratio);
                    if (ratio>=0) {
                        cnv.lineTo(x2-ratio,y1-ratio);
                        cnv.lineTo(x2-ratio,y2-ratio);
                        cnv.lineTo(x1-ratio,y2-ratio);
                    } else {
                        cnv.lineTo(x2,y1-ratio);
                        cnv.lineTo(x2,y2); 
                        cnv.lineTo(x1-ratio,y2);  
                    }
                   
                    cnv.lineTo(x1-ratio,y1-ratio);
                    cnv.stroke(); 

                    //fond blanc
                    cnv.fillStyle =  "rgba(255,255,255,0.75)";
                    cnv.fill();                  
                    
                    // couleur contextuelle
                    var coulcase ="rgb(255,255,255)" ;
                    var opac =  ratio/100

                    if (typgrph==5) {coulcase= 'rgba(11, 93, 168,' + opac + `)`} 

                    if (typgrph==6) {coulcase= coul} 


                    
                    if (typgrph==7) {

                        if (ratio>0) {
                        var opac =    ratio/100
                        coulcase= 'rgba(20,220, 30,' + opac + `)` } 
                        if (ratio<0) {
                        var opac =   - ratio/100
                        coulcase= 'rgba(220,20, 30,' + opac   + `)` 
                        }
                    }

                    cnv.fillStyle =  coulcase;
                    cnv.fill();

                    // valeur de la case 
                    
                    cnv.fillStyle= "rgba(100,100,100,1)";
                    cnv.font = "16px Arial ";
                    var lartxt =  cnv.measureText(valcase).width 
                    
                    cnv.fillText(valcase, x1 + ((x2-x1)-lartxt)/2 -ratio,y1 + (y2-y1)/2 - ratio );
                        


}


 
function splitchaine(chaine,largeur,font) { // fonction permettant de gérer les sauts de lignes lors de l'impression de texte dans les canvas

     

    if (chaine=="" || chaine==undefined){ return 0;}

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

                
                //var ssmot = splitmot(tabmots[m],largeur, font)
                 
                //tablignes[tablignes.length-1] += ssmot[0]

                //for (sm=1;sm<ssmot.length;sm++){
                //    tablignes.push(ssmot[sm] + " ") 
                //    sschaine=ssmot[sm] + " ";     
                //}

            } else { // si non

                tablignes.push(tabmots[m] + " "); // création d'une nouvelle ligne  

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
    var sschaine = "";

    for (c=0;c<mot.length;c++){
        var carext = mot.substr(c,1);
        sschaine +=carext;

        var lartemp = getTextWidth(sschaine,font); // on mesure la largeur de l'ensemble

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