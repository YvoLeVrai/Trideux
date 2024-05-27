    /*
    Trideux.cloud, logiciel d'analyse statistique gratuit en ligne
    Copyright (C) 2023  A. Alber

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    contact : alber@univ-tours.fr
    */




///////
//   //  ///////   //////  ///////   //////
//////   //       //      //     //  //   //
// //    /////    //      //     //  //   //
//  //   //       //      //     //  //   //
//   //  ///////   //////  //////    //////


function veilleCHKmod() {

    var listchk= document.getElementsByClassName("ChkMod")


    var nbchk=0
    var nbchkr=0

    for (l=0 ; l<listchk.length;l++) {
        if (listchk[l].checked ==true ) {
            var nom = listchk[l].id ;

            if (nom.indexOf("R")>-1) {nbchkr++;} else {nbchk++;}
        }
    }




    // affichage des blocs
    if (nbchk >1) {
        // mise à jour de la règle de recodage
        var TxtR = document.getElementById("TxtssRgl");
        var TxtM = document.getElementById("TxtMod");
        var NvR = RglRec();
        TxtR.value = NvR[0];
        TxtM.value = NvR[1];

        VoirBloc('regroup');CacheBloc('swap')

    } else {CacheBloc('regroup');CacheBloc('swap')}


    if (nbchk ==1) {
        VoirBloc('swap')
    }

    if (nbchkr >0) { VoirBloc('degroup');} else {CacheBloc('degroup');}




}

function selallchk() {

    var cases = document.getElementsByClassName("ChkMod")
    var nbcases=0;

    for (c=0;c<cases.length;c++)  {
        if (cases[c].checked==true) {nbcases++}
    }

    var bool=false;

    if (nbcases<cases.length) {bool=true}

    for (c=0;c<cases.length;c++)  {
        cases[c].checked=bool;
    }


    var chk = document.getElementById("ChkAll")
    chk.checked=false;
}

function RglRec(){


    // variable sur laquelle opérer
    var v = vL

    var m1 = "-1";
    var rgl = "";
    var nbcases=0;

    for (m=0; m<=CdMax[v];m++) {


        var chk= 'ChkMod' + m ;


        if (document.getElementById(chk)) { // la case existe-t-elle?


            if (document.getElementById(chk).checked ==true ) { // la case est-elle cochée?
                nbcases++;

                //s'il n'y a pas encore de case cochée, elle devient la première, sinon elle s'ajoute aux autres
                if (m1=="-1") {
                    m1=m;
                    rgl = m1 + ","
                    var NvModa = Moda[v][m1];
                }
                else {
                    rgl += m + ","
                    NvModa = NvModa + " + " + Moda[v][m];

                }
            }
        }

    }

    if (nbcases==0) {

        //alert("sélectionnez au moins deux modalités!")

    }

    else {

        //correction de la sous-règle de recodage
        rgl=rgl.substr(0,rgl.length-1);// retrait de la dernière virgule

        // Ajout de la règle de recodage
        var nvrgl = rgl + "=" + m1;

        var Res = [nvrgl, NvModa];
        return Res

    }

}

function AnalyseRgl(Rgl) {
    var ssrgl;
    var av;
    var ap;
    var ok=true;
    var msg ="";

    ssrgl = Rgl.split("=");

    av=  ssrgl[0]
    ap=  ssrgl[1]

    // y a-t-il bien une règle?
    if (Rgl.length==0) {
        msg += "Saisissez une règle.\n"
        ok=false
    }

    // y a-t-il un signe égal?
    if (ssrgl.length==0) {
        msg += "La règle ne comporte pas de signe égal.\n"
        ok=false


    }


    //la valeur de résultat est-elle bien numérique?
    if (isNaN(ssrgl[1])==true) {
        msg += "La valeur qui suit le signe égal n'est pas numérique..\n"
        ok=false;
    }

    //la valeur est-elle inférieure au code max?

    if (isNaN(ssrgl[1])==false && ssrgl[1] > CdMax[vL] ) {
        msg += "La valeur qui suit le signe égal est supérieure au code max de la variables " + Libellé[vL]
        ok=false;
    }


    var Res = [ok,msg, av,ap];
    return Res;



}

function ChgTypVar(){

    var cmb = document.getElementById("CmbTypVar").value

    TypVar[vL]=cmb

    if (cmb =='n') {TypVar[vL]=QuelTypVar(vL) }

    T_A_P()


};




function ValidModifVar(){ // lancement manuel d'une règle de recodage saisie
    Nom[vL] = document.getElementById("TxtNom").value;
    Libellé[vL] = document.getElementById("TxtLib").value;
    
    ChargerListVar() // mise à jour des variables (en cas de modif)

    var rgl = document.getElementById("TxtRglG").value;
    
    
    //suppresion des espaces
    rgl = rgl.replace(/\s/g, '') 

    DicoRegle(vL);
    Reco[vL]=rgl;
    
    //TypVar[vL]="" // forcer la recherche du type
     
    vuDetails=false;

    T_A_P()
    fautSauver()

}

function regrouper() {

// variable sur laquelle opérer
    var v = vL
    var nvrgl = document.getElementById("TxtssRgl").value;


    //habillage de la modalité
    var anl= AnalyseRgl(nvrgl)


    if (anl[0]==false) {
        alert("La règle de recodage a le(s) problème(s) suivant : \n" + anl[1])
        return;
    }

    if (Reco[v].trim() == "") {Reco[v] = nvrgl} else {Reco[v] = Reco[v] + "/" + nvrgl}

    var m = anl[3]; //Mise à jour de la modalité
    var nvmod = document.getElementById("TxtMod").value;

    if (nvmod.trim()!='') {
        Moda[v][m] = nvmod;

        // si recodage textuel (type mise en classe) changement de statut de la variable
        if (isNaN(nvmod)) {TypVar[v] = 'a'};
    }

    //mise à jour de la règle de recodage
    chargerREC()



    T_A_P();
    CacheBloc('regroup');
    fautSauver()



}

function degrouper() {


    // variable sur laquelle opérer
    var v = vL


    var rgl = Reco[v];


    var nvrgl=""; //nouvelle règle
    ssrgl = rgl.split("/");


    for (r=0; r<=ssrgl.length-1; r++) {

        //récupération de la valeur de résultat de la règle
        var posEgal = ssrgl[r].indexOf("=");

        var res = ssrgl[r].substr(posEgal+1)

        var chk= 'ChkModR' + res ;

        if (document.getElementById(chk)) { // la case existe-t-elle?

            if (document.getElementById(chk).checked !=true) {nvrgl = nvrgl + ssrgl[r] + "/";} // la case n'est pas cochée, la règle n'est pas supprimée

            if (document.getElementById(chk).checked ==true) { // la case est cochée, la règle est supprimée

                 
                //récupérartion des valeurs de modalité avant recodage
                Moda[v][res] = ModaO[v][res]
                
                /* a priori seule la modalité de résultat a besoin d'être rhabillée. Le cas échéant, la fonction ci-dessous permettrait de tout remettre à plat
                for (m=0;m<CdMax[v]+1;m++) {
                    if (ValApRec(m,rgl)==res) {
                        alert("le code " + m + "renvoie bien " + res)    
                        if (Moda[v][m] != ModaO[v][m]) {Moda[v][m] = ModaO[v][m]}
                    }

                }
                */

            }
        }
    }



    Reco[v] = nvrgl;

    chargerREC();
    T_A_P();
    CacheBloc('degroup');
    fautSauver() 


}


function veilleChkTCR() { // fonction de préparation aux regroupements dans les TCR

    var listchkL= document.getElementsByClassName("ChkModL")
    var listchkC= document.getElementsByClassName("ChkModC")
 

    var nbchkl=0
    var nbchkc=0

    for (l=0; l<listchkL.length;l++) {
        if (listchkL[l].checked ==true ) { 
            nbchkl++; 
        }

        if (listchkL[l]) {listchkL[l].style.display='inline-block';}
    }

    for (c=0 ; c<listchkC.length;c++) {
        if (listchkC[c].checked ==true ) { 
            nbchkc++;
        }

        if (listchkC[c]){ listchkC[c].style.display='inline-block';} 
    }


    // affichage des blocs
    if (nbchkl >1 || nbchkc >1 ) {

       VoirBloc('piedtcr');


    } else {
        CacheBloc('piedtcr');
    }

}


function regrouperLC() { //gestion du regroupement des lignes et/ou colonnes 

    // copie du TCR 

    // analyse des lignes 
    var preml =-1
    for (i=0;i<Tcr.length;i++) {
        var nomchk = 'ChkModL' + i
            
        var valchk = document.getElementById(nomchk)
        if (valchk) {

            if (valchk.checked) {

                if (preml==-1) {
                    
                    preml=i;}  // définition de la première case cochée
                    
                else {
                    
                    regroupLignes(preml,i)   

                }
            }

        }


    }


    // analyse des colonnes 
    var premc =-1
    for (j=0;j<Tcr[0].length;j++) {
        var nomchk = 'ChkModC' + j
            
        var valchk = document.getElementById(nomchk)
        if (valchk) {
            if (valchk.checked) {

                if (premc==-1) {
                    
                    premc=j;}  // définition de la première case cochée
                    
                else {
                    
                    regroupColonnes(premc,j)   

                }
            }
        }

    }

    
    // affichage du nouveau tableau
    var RgDpX, RgDpY;
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

    //calcul du nouveau khi2
    Vidage('TabTCR')

    
    var VarMul1 = EstMulti(vL);
    var VarMul2 = EstMulti(vC);

    if (VarMul1[0]==true || VarMul2[0]==true) {
        var multi=true;
    } else {
        khi(vL,RgDpX,vC,RgDpY)
        var multi=false;
    }
            
     
    Aff_T_C_R(vL, RgDpX, vC, RgDpY, multi) 


}


function regroupLignes(l1,l2){ // fonction de regroupement effectif des lignes

    for(c=0;c<Tcr[l1].length;c++) {

        //ajout des valeurs
        Tcr[l1][c] +=Tcr[l2][c] ;
        Tcr[l2][c] = 0 ;
        
    }

   // mise à jour du nom de modalité 
    ModaX[l1] += ' + ' + ModaX[l2] ;
     // vidage de la marge
     MrgX[l1]+=MrgX[l2] ;
     MrgX[l2]=0 ;

}   

function regroupColonnes(c1,c2){ // fonction de regroupement effectif des lignes

    for(l=0;l<Tcr.length;l++) {

        //ajout des valeurs
        Tcr[l][c1] +=Tcr[l][c2] ;
        Tcr[l][c2] = 0 ;
        
    }

   // mise à jour du nom de modalité 
    ModaY[c1] += ' + ' + ModaY[c2] ;
    // vidage de la marge
    MrgY[c1]+=MrgY[c2]; ;
    MrgY[c2]=0 ;

}   


///////////////////////////////////////////////////////////////////////////////////////////
// Codage logique des questions à choix multiples
///////////////////////////////////////////////////////////////////////////////////////////

function Eclater(v) {

    // 0 la variable est-elle bien multiple?
    // Recopiage du tableau des modalités
    ModaM = Moda[v].slice()

    VarMul = EstMulti(v);



    if (VarMul[0]==false) {
        alert("La variable choisie ne semble pas être à réponses multiples! \n Impossible de l'éclater...")
        return 0
    }

    ModaM=[0];



    // 1 Analyse des différentes modalités

    // réécriture du fichier de modalités après split
    for (m=1 ; m < Moda[v].length ; m++){

        if (Moda[v][m] == "" || Moda[v][m] == m ) {continue}

        var sstab=Moda[v][m].split(VarMul[1]);

        for (m2=0;m2<sstab.length;m2++){

            sstab[m2] = sstab[m2].replace(/\r?\n|\r/,""); // retrait des sauts de ligne
            sstab[m2] = sstab[m2].trim();

            function ValSousMod(valmod) {
                return valmod == sstab[m2];
            }

            var idx=ModaM.findIndex(ValSousMod);

            // la modalité a-t-elle déjà été trouvée?
            if (idx<0) {
                ModaM.push(sstab[m2]);
            }

        }

    }

    var nbNv = Number(ModaM.length)

    if (confirm("Il y aura " + (nbNv - 1) + " variables à créer. \n Pouruivre?")) {
    } else {
        return 0;
    }


    // 2 Création des colonnes pour la variables
    for (nv=1;nv<nbNv;nv++) {
        var col = v + nv;



        // trouver le rang d'itération de la variable
        var nomvar = Nom[v] + "(" + nv + ")";

        Nom.splice(col,0,nomvar);
        Posi.splice(col,0,Posi[v]+nv);
        CdMax.splice(col,0,'2');
        Reco.splice(col,0,' ');
        TypVar.splice(col,0,'a');
        Libellé.splice(col,0,ModaM[nv]);

        NbVar++;




        // agrandissement du tableau des modalités
        Moda.splice(col,0,"0")
        ModaO.splice(col,0,"0")

        Moda[col] = new Array(2)
        ModaO[col] = new Array(2)


        Moda[col][0] = "0";
        Moda[col][1] = "Oui";
        Moda[col][2] = "Non";

        for (m=0;m<3;m++){
            ModaO[col][m] = Moda[v][m];
        }


        // agrandissement de la base de données
        for (l=0; l<BDD.length; l++) {

            BDD[l].splice(col,0,'2')

        }



    }

    ChargerListVar()
    //chargerREC()

    // 3 remplissage des colonnes crées

    // Défilement des variables de la base de données
    for (l=0; l<BDD.length; l++) {

        var valmod = 0;

        

        if (BDD[l][v]!=null) {valmod=BDD[l][v]} ;
        
                 
        valmod=Number(valmod);
         
        
         
        

        if (valmod=='' || valmod=='0' || valmod==undefined || isNaN(valmod)==true) {

             
            // mise en non réponse de toutes les variables
            for (nv=1;nv<nbNv;nv++) {
                BDD[l][v + nv] = '0';
            }

            continue

        }

         
        var txtmod = Moda[v][valmod]

        



        // recherche des valeurs dans les modalités multiples
        var sstab=txtmod.split(VarMul[1]);


        for (m2=0;m2<sstab.length;m2++){

            sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne
            sstab[m2]= sstab[m2].trim()

            function ValSousMod2(valmod) {
                return valmod == sstab[m2];
            }

            var idx=ModaM.findIndex(ValSousMod2);


            // la modalité est-elle trouvée?
            if (idx>0) {
                BDD[l][v + idx] = '1';
            }

        }


    }


    // décalage à droite du rang de la variable de pondération en cours d'utilisation (si en cours)
    if(vP !=0 && vP!= undefined) {vP+=(nbNv-1)}

    alert("Les variables ont bien été créées à la suite.")
    fautSauver()

}

function Agreger() {
    var v=vL;

    // définition du nombre de colonnes à agréger
    var nbcol = prompt("Combien de colonnes souhaitez vous agréger (en comptant celle-ci)?")
    if (nbcol<2 || isNaN(nbcol)==true) {alert("Saisissez un nombre. \n Merci. ") ; return 0}

    var nomvar = prompt("Quel est le NOM de la variable créée ?")
    if (nomvar.trim()=="") {alert("Saisissez un nom . \n Merci.") ;return 0}
    var libvar = prompt("Quel est le LIBELLE de la variable créée ?")
    if (libvar.trim()=="") {libvar=nomvar}
    var col = v


    // création de la variable au rang -1
    Nom.splice(col,0,nomvar + "_(multi)");
    Posi.splice(col,0,'');
    CdMax.splice(col,0,10);
    Reco.splice(col,0,'');
    TypVar.splice(col,0,'a');
    Libellé.splice(col,0,libvar);
    VdsAF.splice(col,0,false)
    NbVar++;

    // agrandissement du tableau des modalités
    Moda.splice(col,0,"0")
    ModaO.splice(col,0,"0")
    Moda[col]=new Array(1)
    ModaO[col]=new Array(1)
    Moda[col][0]="NA"
    ModaO[col][0]="NA"

    // ajout de la colonne
    for (l=0; l<BDD.length; l++) {
        BDD[l].splice(col,0,0)
    }

    // ligne à ligne

    for (l=0; l<BDD.length; l++) {
        var strlig=""

        // colonne par colonne
        var premcol= Number(col)+1
        var dercol =premcol + Number(nbcol)

        for (c=premcol;c<dercol ;c++) {


            var valcase = Number(BDD[l][c])
            //alert("valeur case " + l + " / " + c + " = " + valcase + " valeur moda :" + Moda[c][valcase])

            // si valeur de case = 1 Oui Y Yes
            if (Moda[c][valcase]== '1' || Moda[c][valcase]=='Oui'|| Moda[c][valcase]=="oui" || Moda[c][valcase]=='OUI'||Moda[c][valcase]=='O'|| Moda[c][valcase]=="Y" ||Moda[c][valcase]=="YES" || Moda[c][valcase]=="Yes" ||Moda[c][valcase]=="yes") {


                // la chaine de modalité est allongée du nom de la colonne
                // retrait de la partie commune
                var libssttr= Libellé[c].replace(libvar,"")
                libssttr= libssttr.replace("/"," ") // évitement de la présence des slashs dans la modalité ajoutée
                strlig +=  libssttr + "/"

            }

        }



        var nvval="";

        // vérification du dico de la variable
        for (m=1;m<Moda[col].length+1;m++) {


            if (strlig == Moda[col][m]) {
                nvval= m

            }

        }


        if (nvval=="" && strlig!="" ) {
            nvval= Moda[col].length
            Moda[col].push(strlig)
            ModaO[col].push(strlig)
            //alert(nvval + " "  + strlig)

        }


        BDD[l][col]=nvval;

    }


    CdMax[col] = Moda[col].length-1



    ChargerListVar()

    T_A_P();

    // décalage à droite du rang de la variable de pondération 
    if(vP !=0 && vP!= undefined) {vP++}

    fautSauver()






    // renseignement du code max de la variable
}

function SuppRecod(v) { // suppression de tous les recodages


    Reco[v] = ' ';


    for (m=0;m<CdMax[v];m++) {
        Moda[v][m] = ModaO[v][m]
    }

    TypVar[v]="" // forcer le tri à plat à déterminer
    chargerREC()
    T_A_P();
    fautSauver()

}

function MiseEnClasses(typclass) {

    // borne inférieure
    var b0 = Colonne[0]
    // borne supérieure
    var nbl= Colonne.length-1
    var bn1 = Number(Colonne[nbl])

    // Classes de 5 ou 10
    if (typclass=='c5' || typclass=='c10' || typclass=='cx' )  {

        if (typclass=='c5'){divi = 5}
        if (typclass=='c10'){divi = 10}
        if (typclass=='cx') {

            var divi = prompt("Quelle amplitude doivent avoir les classes ?", "2");

            if (divi == null || divi == ""){
                alert("Choisissez une amplitude...");
                return ;
            }

            // en cas de valeur décimale
            divi=divi.replace( /,/g,".")

            if (isNaN(divi)){
                alert("L'amplitude saisie n'est pas numérique...");
                return ;
            }

        }


        var reste = b0%divi

        if (reste > 0) {
            b1 = b0 + (divi-1) - reste
        } else {b1=b0 + (divi-1)}



        var reste = bn1%divi

        if (reste > 0) {
            var bn0 = bn1 - reste
        } else {bn0=bn1}

        // nombre de classes à créer
        var nbcl = bn0-(b1+1)
        nbcl = nbcl/divi

        // classe 1
        var rgclass = 1
        var txtgrl= b0 + "-" + b1 + "=" + rgclass + "/"
        //Moda[vL][rgclass]="["+b0+"-" + b1+"]"

        // classes suivantes
        for (cl = 0 ; cl<nbcl; cl++) {
            rgclass++;
            var brninf= (b1+1) + cl*divi;
            var brnsup= Number((brninf+(divi-1)))

            txtgrl += brninf + "-" + brnsup + "=" + rgclass + "/"
            //Moda[vL][rgclass]="["+brninf+"-" + brnsup+"]"
        }

        // dernière classe
        txtgrl+= bn0 + "-" + bn1 + "=" + rgclass
        //Moda[vL][rgclass]="["+bn0+"-" + bn1+"]"

        //alert(txtgrl)



    }


    if (typclass=='n') {

        var nbcl = prompt("Combien de classes voulez-vous créer?", "2");

        if (nbcl == null || nbcl == ""){
            alert("Choisissez un nombre de classes...");
            return ;
        }

        // en cas de valeur décimale
        nbcl=nbcl.replace( /,/g,".")
        nbcl=Math.floor(nbcl)
        if (isNaN(nbcl)){
            alert("Le nombre de classes saisi  n'est pas numérique...");
            return ;
        }



        // classe 1
        var rgclass = 1
        var b1 = Math.floor(nbl/(nbcl))
        vb1=Colonne[b1]
        var txtgrl= b0 + "-" + vb1 + "=" + rgclass + "/"

        var ratio = Math.floor(nbl/nbcl)


        // classes intermédiaires
        for (cl=1; cl<nbcl-1;cl++) {
            rgclass++;
            var brninf= Number(vb1+1);
            b2= b1+ratio
            var brnsup= Colonne[b2]
            txtgrl += brninf + "-" + brnsup + "=" + rgclass + "/"

            b1=b2+1
            vb1=Colonne[b1]
        }

        //dernière classe
        rgclass++;
        var brninf= Number(vb1+1);
        var brnsup= Colonne[nbl]
        txtgrl += brninf + "-" + brnsup + "=" + rgclass

    }


    document.getElementById("TxtRglG").value = txtgrl
    TestRglG('');

}

function ValApRec(val, RglRecP){ // renvoie la valeur après modification trouvée dans la règle de recodage

    //var RglRecP = document.getElementById("TxtRglG").value;


    if (RglRecP.trim() != "" && RglRecP.indexOf("=") > 0 ) {



        //alert("prise en compte du recodage de la variable " + v)
        var Rgl = RglRecP.split("/");

        for (r=0;r<Rgl.length;r++){ // défilement des règles

            var posEgal = Rgl[r].indexOf("=");
            var avEgal= Rgl[r].substr(0,posEgal);
            var apEgal = Rgl[r].substr(posEgal+1);

            var Ssrgl= avEgal.split(",")

            for (s=0;s<Ssrgl.length;s++) {

                var posTrait = Ssrgl[s].indexOf("-");

                if (posTrait<0) {
                    var valamodif = Number(Ssrgl[s]);
                    if (valamodif==val) {return Number(apEgal);}
                }

                else {
                    var avTrait=Number(Ssrgl[s].substr(0,posTrait));
                    var apTrait = Number(Ssrgl[s].substr(posTrait+1));

                    if (val >= avTrait && val <=apTrait)
                        return Number(apEgal);
                }

            }

        }


    }


    return val;

}

function DicoRegle(vL){

    var RglRecP = document.getElementById("TxtRglG").value

    if (RglRecP.trim() != "" && RglRecP.indexOf("=") > 0 ) {


        //alert("prise en compte du recodage de la variable " + v)
        var Rgl = RglRecP.split("/");


        for (r=0;r<Rgl.length;r++){ // défilement des règles

            var posEgal = Rgl[r].indexOf("=");
            var avEgal= Rgl[r].substr(0,posEgal);
            var apEgal = Rgl[r].substr(posEgal+1);

            if (Number(apEgal)>CdMax[vL]) {
            //alert("Le code " + Number(apEgal) + " est supérieur à la valeur maximale de la variable \n Choisissez une valeur inférieure ou égale à " +  CdMax[vL] + " .");
              
                for (md=CdMax[vL]+1;md<Number(apEgal)+1;md++) {
                    Moda[vL].push('')
                }
                CdMax[vL] = Number(apEgal);
            }

            if (TypVar[vL]!='a') { // variables quanti

                if (isNaN(apEgal)==false) {
                    Number(apEgal)
                    Moda[vL][apEgal] = "[" + avEgal + "]"
                }

            } else { // variables quali

                var Ssrgl= avEgal.split(",")
                var nvtxtmod="";


                for (s=0;s<Ssrgl.length;s++) {

                    var posTrait = Ssrgl[s].indexOf("-");

                    if (posTrait<0) {
                        var valamodif = Number(Ssrgl[s]);
                        nvtxtmod += Moda[vL][valamodif] + " + ";
                    }

                    else {

                        var avTrait=Number(Ssrgl[s].substr(0,posTrait));
                        var apTrait = Number(Ssrgl[s].substr(posTrait+1));

                        for (t=avTrait; t<=apTrait;t++) {
                            nvtxtmod += Moda[vL][t] + " + ";
                        }


                    }


                    if (isNaN(apEgal)==false) {
                        Number(apEgal)

                        if (Moda[vL][apEgal]==ModaO[vL][apEgal]) { // ne modifie que les modalités qui n'ont pas encore été rhabillées

                            Moda[vL][apEgal] = nvtxtmod.substr(0, nvtxtmod.length-3)

                        }

                    }
                }


            }

        }


    }



}

function TestRglG(event) { // test de la règle générale

    var key = event.keyCode;

    if (key===13) { // validation par entrée
        ValidModifVar()
    };


    Moy=Moyenne(Colonne)
    Quants= Quantiles(Colonne)
    Histo("fondHisto",Colonne,Quants, Moy)

}

function LancerRecod(event) {
    var key = event.keyCode;

    if (key===13) { // validation par entrée
        ValidModifVar()
    };
}

function LancerRgl(event) {

    var key = event.keyCode;

    if (key===13) {
        regrouper()
    };


}


function EstRec(v,mod) { // la modalité est-elle le fruit d'un recodage?

    var rgl = Reco[v]
    
    for (m=0;m<=CdMax[v];m++) {

        if (m != mod) {

            if (ValApRec(m,rgl) == mod) {return true;}

        }

    }



}

/* Montrer Modas */
function VoirModas() {

    var TxtMod = document.getElementsByClassName('NvMod')
    for (var i = 0; i < TxtMod.length; ++i) {
        var item = TxtMod[i];
        item.style.display = "block";
    }

    var LblMod = document.getElementsByClassName('LibMod')
    for (var i = 0; i < LblMod.length; ++i) {
        var item = LblMod[i];
        item.style.display = "none";
    }


}

/*Rhabillage d'une modalité*/
function MàJMod(event,variable,modalité) {
    var key = event.keyCode;

     

        var idTxt = 'mod' + modalité;
        var nvTxt = document.getElementById(idTxt).value
        nvTxt = nvTxt.trim()

        //VarMul = EstMulti(vL);
        var multiples = document.getElementById("ChkMul").checked;

        if (VarMul[0]==false || multiples==false) {


            if (nvTxt!='') {
                Moda[variable][modalité] = nvTxt

            } else {

                Moda[variable][modalité] = ModaO[variable][modalité]
            } ;

        } else if(multiples==true) { // si la variable est multiple

            for (m=0;m<Moda[vL].length;m++) {

                var sstab=Moda[vL][m].split(VarMul[1]);

                for (m2=0;m2<sstab.length;m2++){
                    if (sstab[m2] == ModaM[modalité]) {
                        Moda[vL][m]=Moda[vL][m].replace(sstab[m2],nvTxt)
                    }
                }

            }

        }

        if (key===13) {
        // passage à la modalité suivante (si elle existe)
        var Msuiv= 'mod' + (modalité+1);

        if (document.getElementById(Msuiv)) {

            document.getElementById(Msuiv).focus();

        } else {
             
            T_A_P();
        }

        fautSauver()

    }

    if (key===27) {
        T_A_P();
    }


    /*Rhabillage d'une modalité
    function QuitMod(event,variable,modalité) {
      var key = event.keyCode;
    }
     */
  

}

// fonctions d'intervesion des modalités
function PrepInterv(sens){

    var v=vL;

    var cases = document.getElementsByClassName("ChkMod")
    var nbcases=0;

    for (c=0;c<cases.length;c++)  {
        if (cases[c].checked==true) {break}
    }


    // pas d'interversion après le code max
    if (c==cases.length-1 && sens=='b') {return 0}


    //'récupération de la valeur de la case
    var nomchk = cases[c].id
    var mod1 = nomchk.substr(6,3)
    Number(mod1);



    // pas d'interversion avec le code zéro
    if (mod1==1 && sens=='h') {return 0}


    // y'a -t-il des non réponses

    if (sens=="b") {mod2=mod1++}
    if (sens=="h") {mod2=mod1--}

    Number(mod2);


    Interv(mod1,mod2);


    T_A_P();


    document.getElementById("ChkMod" + mod1).checked=true;

    VoirBloc('swap')
    

}

function Interv(mod1,mod2) {

    var v=vL;

    // transformation du dictionnaire
    var modswap = Moda[v][mod1]
    
    // interversion des valeurs actives
    Moda[v][mod1]=Moda[v][mod2]
    Moda[v][mod2]=modswap;

    // interversion des valeurs d'origine
    var modswap = ModaO[v][mod1]

    ModaO[v][mod1] = ModaO[v][mod2]
    ModaO[v][mod2] = modswap 



    // transformation des valeurs dans la base

    for (l=0;l<BDD.length;l++) {

        if (BDD[l][v]==mod1){
            BDD[l][v]=mod2
        }

        else {

            if (BDD[l][v]==mod2){
                BDD[l][v]=mod1}

        }

    }

    fautSauver()
}


// fonctions de drag & drop pour l'interversion des modalités
function allowDrop(ev) {
    ev.preventDefault();
}

var Modrag;

function ModO(idx) {
    Modrag=idx;
}

function ModA(idx) {
    var mod1=Modrag;
    var mod2=idx;



    if (mod1 < mod2) {

        for (m=mod1;m<mod2;m++) {

            Interv(m,m+1);

        }
    }

    if (mod1 > mod2) {

        for (m=mod1-1;m>mod2-1;m--) {

            Interv(m,m+1);


        }
    }


    T_A_P();

}

function drag(ev) {

    ev.dataTransfer.setData("text", ev.target.id);
}

function dropMod(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}


// duplication de colonne
function dupliCol(v,col,recod) {

    if (recod==true && Reco[v].trim()=='') {
        alert("Il n'y a pas de recodages enregistrés!")
        return 0;
    }

    // Agrandissement du tableau des variables

    // trouver le rang d'itération de la variable
    var nomnvar = Nom[v] + "+"


    Nom.splice(col,0,Nom[v] + "+");
    Posi.splice(col,0,Posi[v]);
    CdMax.splice(col,0,CdMax[v]);
    var valrec = Reco[v];
    if (recod==true){valrec="";}
    Reco.splice(col,0,valrec);
    TypVar.splice(col,0,TypVar[v]);
    Libellé.splice(col,0,Libellé[v]);
    VdsAF.splice(col,0,false);

    NbVar++;

    // agrandissement du tableau des modalités
    Moda.splice(col,0,"0")
    ModaO.splice(col,0,'0')

    Moda[col] = new Array(CdMax[v])
    ModaO[col] = new Array(CdMax[v])

    for (m=0;m<CdMax[v]+1;m++) {
        Moda[col][m] = Moda[v][m];
        ModaO[col][m] = ModaO[v][m];
    }




    // agrandissement de la base de données
    for (l=0; l<BDD.length; l++) {
        var valcase = BDD[l][v]

        if (recod==true) {
            var rgl = document.getElementById("TxtRglG").value;
            valcase=ValApRec(valcase,rgl)
        }

        BDD[l].splice(col,0,valcase)

    }

    ChargerListVar()
    chargerREC()
    // décalage à droite du rang de la variable de pondération 
    if(vP !=0 && vP!= undefined) {vP++}
    vL++;
    T_A_P();
    fautSauver()

}

// suppression de colonne
function SupprCol(col) {

    if (confirm("Voulez-vous vraiment supprimer cette variable? ")) {
    } else {
        return 0;
    }


    Nom.splice(col,1);
    Posi.splice(col,1);
    CdMax.splice(col,1);
    Reco.splice(col,1);
    TypVar.splice(col,1);
    Libellé.splice(col,1);
    VdsAF.splice(col,1);

    NbVar--;

    // redimensionnement du tableau des modalités
    Moda.splice(col,1)
    ModaO.splice(col,1)

    // transformation de la base de données
    for (l=0; l<BDD.length; l++) {

        BDD[l].splice(col,1)

    }

    ChargerListVar()
    chargerREC()
//if (vL > 1){vL--};
    // décalage à gauche du rang de la variable de pondération 
    if(vP !=0 && vP!= undefined) {vP--}
    Vidage("TabTAP")
    T_A_P();
    fautSauver()
}

// codage automatique de toutes les valeurs 0 (fonction non accessible aux utilisateurs)
function DefNA() {

    var lbl = prompt("Quel intitulé voulez-vous donner à toutes les valeurs zéro de la base?")

    for (v=1;v<NbVar;v++) {

        if (TypVar[v] =='a') {
            Moda[v][0] = lbl
            ModaO[v][0] = lbl
        }
    }

    alert("fin du remplacement")
    fautSauver()
}

////////  //     //   ///////    //////   ///////    ///////
//         //   //    //    //  //    //  //    //     //
////////    // //     ///////   //    //  //////       //
//         //   //    //        //    //  //  //       //
////////  //     //   //         //////   //   //      //




function SauvDAT(reco) {


    var nl= BDD.length-1;
    var TxtFile="";
    var nv = Nom.length-1;
    var position = 1;
    var v;

    for (v=1;v<=nv;v++) { // determination des types de variables (si manquantes?)

        if (TypVar[v]=="" || TypVar[v]=="n") {TypVar[v]=QuelTypVar(v)};


    }

    for (l=0;l<=nl;l++){ // défilement des lignes

        nvligne = ""


        for (v=1; v<= nv; v++) { // défilement des variables

            var valmod = "0";
            var nbcar = 1;


            if (TypVar[v]=='a'  || TypVar[v]=='e') {

                if (CdMax[v]<999) {
                    var cd = String(CdMax[v])
                    cd=cd.trim()
                    nbcar = cd.length;
                    var valmod = BDD[l][v];

                    if (reco==true) { // application éventuel du recodage

                        if (Reco[v].trim() != "") { // application du recodage à la ligne
                            var nvmod = ValApRec(valmod,Reco[v])
                            valmod = nvmod
                        }

                    }

                }

            }


            nvligne += TxtMef(valmod,nbcar," ")


            if (l==1) { // ne redéfinit la position qu'à la première ligne
                Posi[v]=position;
                position +=Number(nbcar);
                Number(position);
            }


        }

        TxtFile = TxtFile + nvligne
        if (l<nl) {TxtFile = TxtFile + "\r\n";} // ajout d'un saut de ligne



    }

    var textEncoder = new CustomTextEncoder('windows-1252', {NONSTANDARD_allowLegacyEncoding: true})
    var TxtANSI = textEncoder.encode([TxtFile]);

    return TxtANSI;

}





//rédation du fichier POS à sauvegarder
function SauvPOS(reco) {

    var TxtFile=nomBase + "\r\n" + PopTot + "\r\n";


    for (v=1;v<=Nom.length-1;v++) {

        var libl = String(Libellé[v]);

        var CodeMax = CdMax[v];

        if (CdMax[v]>99) {CodeMax = "L3";}

        if (CdMax[v]>999 || TypVar[v] == "r") {CodeMax = "1"; libl += "  !! Format non compatible !! "}


        LibPropre= libl.substring(0, Number(libl.length));
        TxtFile = TxtFile + TxtMef(v,3,"0") + TxtMef(Posi[v],4,"0") + TxtMef(CodeMax,2," ") +  " "

        if (reco == true) {TxtFile = TxtFile + Reco[v];}
        TxtFile=TxtFile +  "$" + LibPropre + '\$' + "\r\n"
    }


    var textEncoder = new CustomTextEncoder('windows-1252', {NONSTANDARD_allowLegacyEncoding: true})
    var TxtANSI = textEncoder.encode([TxtFile]);

    return TxtANSI;

}


//rédaction du fichier DIC à sauvegarder
function SauvDIC() {

    var TxtFile="";
    for (v=1;v<=Moda.length;v++) {

        for (m=0; m<=CdMax[v];m++) {

            if (Moda[v][m] !=m) {

                TxtFile = TxtFile + TxtMef(v,3,"0") + TxtMef(m,3,"0") + " " + Moda[v][m] + "\r\n"

            }

        }

    }

    var textEncoder = new CustomTextEncoder('windows-1252', {NONSTANDARD_allowLegacyEncoding: true})
    var TxtANSI = textEncoder.encode([TxtFile]);

    return TxtANSI;

}


function SauvINI() {
    var TxtFile= nomBase + "\r\n 2" ;
    return TxtFile;

}

function ExportBase() {


    var zip = new JSZip();


// Ajout de la base DAT
    zip.file(nomBase + ".DAT", SauvDAT(false));

    // Ajout du POS
    zip.file(nomBase + ".POS", SauvPOS(true));

    // Ajout du DIC
    zip.file(nomBase + ".DIC", SauvDIC());

    // Ajout du fichier Ini
    zip.file("Tri2.Ini", SauvINI());

    // Generate the zip file asynchronously
    zip.generateAsync({type:"blob"})
        .then(function(content) {
            // Force down of the Zip file

            saveAs(content, nomBase + ".zip");

        });




}



function Outils() {


    // incrémentation du nom de la base

    var nvnombase = nomBase.substr(0,nomBase.length-1) ;
    var dercar = nomBase.substr(nomBase.length-1);
    if (dercar == 'z' || dercar == 'Z') {dercar='0'}
    var dercar2 = String.fromCharCode(dercar.charCodeAt(0) + 1);

    nvnombase=nvnombase+dercar2;


    var zip = new JSZip();


    // Ajout de la base DAT
    zip.file(nvnombase + ".DAT", SauvDAT(true));

    // Ajout du POS
    zip.file(nvnombase + ".POS", SauvPOS(false));

    // Ajout du DI
    zip.file(nvnombase + ".DIC", SauvDIC());

    // Ajout du fichier Ini
    zip.file("Tri2.Ini", SauvINI());

    // Generate the zip file asynchronously
    zip.generateAsync({type:"blob"})
        .then(function(content) {
            // Force down of the Zip file

            saveAs(content, nvnombase + ".zip");

        });




}




function ExportCSV() {
    SauvegarderSurDisque(SauvCSV(),nomBase + ".CSV")

}

function SauvCSV() { //écriture de la base au format CSV


    var sep = prompt("Quel séparateur de colonnes voulez-vous utiliser? (par exemple :  ; / ) ?", ";");

    if (sep == null || sep == ""){
        alert("Un séparateur est nécessaire");
        return ;
    }

     
    //if (sep.toUpperCase() =="TAB") {sep= String.fromCharCode(9); }

    var nl= BDD.length-1;
    var TxtFile="";
    var Ligne = "";

    var nv = Nom.length-1;

//Ajout des en-têtes
    for (v=1; v<= nv; v++) { // défilement des variables

        var lib = Nom[v] + " | " + Libellé[v];

        //if (lib == "") {lib=Nom[v]};

        if (isNaN(lib)) {lib = lib.replaceAll(sep," ")}

        Ligne = Ligne + lib;
        if (v<nv) {Ligne = Ligne + sep;}

    }

    TxtFile = Ligne + "\n";


    for (l=0;l<=nl;l++){ // défilement des lignes

        var Ligne = "";


        for (v=1; v<= nv; v++) { // défilement des variables


            var val1 = BDD[l][v];

            Number(val1);
            var val2=val1

            if (Reco[v].trim() != "") {val2 = ValApRec(val1, Reco[v])}

            if (TypVar[v] == "a" ) {

                var modalité = Moda[v][val2];
                if (isNaN(modalité)) { modalité = modalité.replaceAll(sep," ")}

                Ligne = Ligne + modalité;

            } else {
                Ligne = Ligne + val2;
            }


            if (v<nv) {Ligne = Ligne + sep;}


        }

        TxtFile = TxtFile + Ligne
        if (l<nl) {TxtFile = TxtFile + "\n";} // ajout d'un saut de ligne (sauf à la fin)





    }

    return TxtFile;

}


function ExportTR2(filtre) {
    
    
    var baseexport = nomBase;
    
    if (filtre=='true') {baseexport += "[filtre]"};

    SauvegarderSurDisque(SauvTR2(filtre),baseexport + ".TR2", "UTF-8")
    sauvOk();
}

function SauvTR2(filtre) { //écriture de la base au format CSV


// séparateur = tabulation (chr9)
    var sep= String.fromCharCode(9)


    var nl= BDD.length-1;
    var TxtFile="";
    var Ligne = "";

    var nv = Nom.length-1;
    var maxmod=0;



    //Ajout des noms de variables
    Ligne = "";
    for (v=1; v<= nv; v++) { // défilement des variables

        var lib = String(Nom[v]);
       
        lib = lib.replace(/[\r\n]+/gm," ") // retrait des sauts de ligne
       

        if (lib == "") {lib=v};

        if (isNaN(lib)) {lib = lib.replaceAll(sep," ")}

        Ligne = Ligne + lib;
        if (v<nv) {Ligne +=  sep;}

    }



    TxtFile = "VAR" + sep + Ligne + "\n";

    //Ajout des libellés
    Ligne = "";
    for (v=1; v<= nv; v++) { // défilement des variables

        var lib = Libellé[v];

        if (lib == "") {lib=Nom[v]};

        lib = lib.replace(/[\r\n]+/gm," ") // retrait des sauts de ligne

        if (isNaN(lib)) {lib = lib.replaceAll(sep," ")} // retrait des séparateurs 

        Ligne = Ligne + lib;
        if (v<nv) {Ligne +=  sep;}

    }
    var ligne0 = Ligne;
    TxtFile += "Libellé" + sep + Ligne + "\n";





    //Ajout du type de variable
    Ligne = "Type Var (a=alphanum, e=entier, r=réel)" + sep;
    for (v=1; v<= nv; v++) { // défilement des variables

        if (TypVar[v]=="") {TypVar[v]=QuelTypVar(v)}
        var tv = TypVar[v];

        Ligne = Ligne + tv;
        if (v<nv) {Ligne +=  sep;}

    }

    TxtFile += Ligne + "\n";




    //Ajout des recodages
    Ligne = "Reco" + sep;

    for (v=1; v<= nv; v++) { // défilement des variables

        var recod = Reco[v]

        Ligne = Ligne + recod;
        if (v<nv) {Ligne +=  sep;}

    }

    TxtFile += Ligne + "\n";



    //Ajout des codes max
    Ligne = "Max" + sep;

    for (v=1; v<= nv; v++) { // défilement des variables

        var mx = CdMax[v];

        if (mx > maxmod && TypVar[v]=='a'){maxmod = mx} // plus grand nombre de modalités trouvé

        Ligne = Ligne + mx;
        if (v<nv) {Ligne +=  sep;}

    }

    TxtFile += Ligne + "\n";



    /// Export des modalités

    for (m=0;m<maxmod+1;m++) {

        Ligne =  m + sep

        for (v=1; v<= nv; v++) { // défilement des variables

            var moda = "";

            if (TypVar[v]=='a' && m<=CdMax[v]) {

 
                if (Moda[v][m]== ModaO[v][m]) {

                    Ligne += Moda[v][m];} else {Ligne += Moda[v][m] + "||" + ModaO[v][m] }

            } else {Ligne += " "}


            if (v<nv) {Ligne +=  sep;}


        }

        TxtFile += Ligne + "\n";
    }


    TxtFile += "\n";

    TxtFile += "DAT" + sep + ligne0 + "\n";

    for (l=0;l<=nl;l++){ // défilement des lignes



        Ligne = l + 1 + sep;

        if (filtre=='true' && Filtrer(l) == false) {
        continue;
        }


        for (v=1; v<= nv; v++) { // défilement des variables


            var val1 = BDD[l][v];

            Number(val1);
            var val2=val1

            //if (Reco[v].trim() != "") {val2 = TabRec[v][val1]}
            Ligne += val2;


            if (v<nv) {Ligne += sep;}


        }

        TxtFile = TxtFile + Ligne
        if (l<nl) {TxtFile = TxtFile + "\n";} // ajout d'un saut de ligne (sauf à la fin)


    }

    return TxtFile;

}

function DicoVars() {

    var txt="Dictionnaire des variables de la base : " + nomBase;
    let date = new Date();


    txt+=" \nEdité par trideux le " + date;

    txt+=" \nNombre de variables : " + NbVar

    txt+=" \n"

    

    for (v=1;v<NbVar;v++){

        txt+="\n\n" + v + " - " + Nom[v] + " | " + Libellé[v]

        if (TypVar[v]!='a') {
            txt+= "\n (Variable numérique)"

        } else {

            if (CdMax[v]>99) {
                txt+= "\n (Question ouverte)"
            } else {


                for (m=0;m<=CdMax[v];m++){
                    txt+= "\n" + m + " - " + Moda[v][m]
                }
            }


        }

    }


    SauvegarderSurDisque(txt,"Dictionnaire des variables.txt", "ANSI")

}

function TapComplet() {

    var sep= String.fromCharCode(9)

    var txt="Tri à plat complet des variables de la base : " + nomBase;
    let date = new Date();


    txt+=" \nEdité par trideux le " + date;

    txt+=" \nNombre de variables : " + NbVar

    txt+=" \nNombre d'individus : " + PopTot

    txt+=" \n"


    for (v=1;v<NbVar;v++){

        txt+="\n\n" + Nom[v] + sep + Libellé[v]

        if (TypVar[v]!='a') {
            txt+= "\n (Variable numérique)"

        } else {

            if (CdMax[v]>99) {
                txt+= "\n (Question ouverte)"
            } else {

                CréerTapX(v) ; // extraction des valeurs de la variable 
                
                txt+= "\n" + "code" + sep + "libellé " + sep + " n " + sep + " % " + sep + "% hors NR"

                for (m=0;m<=CdMax[v];m++){

                    var eff = TapX[m];
                    var pct = TapX[m] / PopTot * 100;
                    pct = pct.toFixed(NbDec);

                    var pctxprm = TapX[m]/ (PopTot- TapX[0]) * 100;
                    pctxprm = pctxprm.toFixed(NbDec);
                    if (pctxprm<0) {pctxprm=0};
                    if (m==0){pctxprm=0}; 

                    txt+= "\n" + m + sep + Moda[v][m] + sep + TapX[m] + sep +  pct + " % " + sep +  pctxprm + " % "

                }
            }


        }

    }


    SauvegarderSurDisque(txt,"TAP complet.txt", "ANSI")

}




//////////////////////////////////////////////////////////////
// télécharger sur le disque
//////////////////////////////////////////////////////////////
function SauvegarderSurDisque(textToWrite,fileNameToSaveAs, format) {

    wait("Conversion de la base en cours. Merci de patienter.")

    if (format != 'UTF-8') {
        var TxtANSI= ""
        var textEncoder = new CustomTextEncoder('windows-1252', {NONSTANDARD_allowLegacyEncoding: true})

        
         if (textToWrite.length > 5000000)  {

            alert("La base a une longueur de " + textToWrite.length + "caractères! \n La conversion peut prendre plusieurs minutes. N'interrompez pas le processus. \n Merci de votre patience." )
         }
        /* 
        // découpage de la chaine à convertir pour éviter la surcharge en cas de très gros fichier     
        var parts = textToWrite.split("\n")  

                    
            for(p=0;p<parts.length;p++) {
             TxtANSI += textEncoder.encode(parts[p])            
            }
            

         */

           

        TxtANSI = textEncoder.encode([textToWrite]);
        textToWrite = TxtANSI;
            
         
    }

    var textFileAsBlob = new Blob([textToWrite], {type:'text/csv;charset=windows-1252;'});
    //var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();

    endWait()
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DIVERS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openFiltre() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeFiltre() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}


 


function dossfichext(fich) { // renvoie le dossier, le nom de fichier sans extension, et l'extension d'un fichier
    var derpoint = fich.lastIndexOf(".");
    var extens = fich.substr(derpoint);
    extens = extens.toUpperCase()
    var derslash = fich.lastIndexOf("/") +1;
    var fichier = fich.substr(derslash,derpoint - derslash);
    dossier = fich.substr(0, derslash);

    return [dossier,fichier, extens];
}

function EstMulti(vm) { //permet de déterminer si une variable est à choix multiples

    if (vm < 1  || vm > Nom.length-1) {return [false,""];}
    if (TypVar[vm]!="a") {return [false,""];}

    // les variables sont vues comme non multi par défaut si la gestion des var. multiples est désactivée
    var GereMul = document.getElementById('ChkMul').checked
    if (GereMul==false) {return [false,""];}


    var mo;
    var delimit = "";
    var ptv =0
    var slh =0
    var bar = 0
    var nbm = Number(Moda[vm].length)
    var seuil = nbm/3; // seuil de déclenchement de la var multiple 

    for (mo=1 ;mo<nbm-1;mo++){ // décompte des différents séparateurs possbiles (;/|)

        var mx = Moda[vm][mo];

        if (isNaN(mx)==true) { if (mx.trim()=="") {continue} }; // évitement des modalités (quali) vides

        //if (isNaN(mx)!=false) {continue;}//évitement des modalités numériques
        if (mx==mo) {continue;}

        var posptv = mx.indexOf(";");
        var posslsh = mx.indexOf("/");
        var posbar = mx.indexOf("|");


        if (posptv  >-1) {ptv++;}
        if (posslsh >-1) {slh++;}
        if (posbar > -1) {bar++}

    }



    //alert("seuil :" + seuil + "ptv : " + ptv + " slh : " + slh + " bar : " + bar )

    // si le nombre de séparateurs dépasse un certain seuil
    if (ptv>seuil || slh > seuil || bar > seuil) {

        if (ptv > slh && ptv > bar) {delimit = ";"}
        if (slh > ptv && slh > bar) {delimit = "/"}
        if (bar > ptv && bar > slh) {delimit = "|"}

       // alert("le délimiteur " + delimit + " passe le seuil : " + seuil)

        // test du délimiteur 
        // y a-t-il répétition des modalités avec ce délimiteurs ? 
        var nbrep=0;
        for (mo=1 ;mo<nbm;mo++){ // défilement des modalités

            var mx = Moda[vm][mo];
     
            var tabmod1 = mx.split(delimit); // division des libelles de modalités avec le séparateur
            
            for(sm1=0;sm1<tabmod1.length;sm1++) {
                
                var smod1=tabmod1[sm1];
                smod1=smod1.trim();

                for (mo2=mo+1;mo2<nbm;mo2++){ // comparaison avec les sous-modalités des autres modalités

                    var mx2 = Moda[vm][mo2];
                    var tabmod2 = mx2.split(delimit);

                    
                        for(sm2=0;sm2<tabmod2.length;sm2++) {


                            var smod2=tabmod2[sm2];
                            smod2=smod2.trim();

                            //alert(smod1 + " - "  + smod2)
                            if (smod1==smod2 && smod1 !="") {nbrep++} // nombre de répétition

                           
                            
                            
                        
                        }

                    


                }
             }
    

    
        }

         
        if(nbrep>3) { return [true,delimit]; }

        return [false,delimit];

    } else {

        return [false,delimit];

    }
}

 

/*
function EstDansMulti(Tab, Txt,spl){

var sstab=Txt.split(spl);

for (m2=0;m2<sstab.length;m2++){

sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne

function ValSousMod(valmod) {
return valmod == sstab[m2];
}

var idx=Tab.findIndex(ValSousMod);

}

}
*/


function AjoutVarCrois() {

    
    var elmnt = document.getElementById('TabBDD');
    if (elmnt) {elmnt.style.display="none"} //{elmnt.remove()}

    var elmnt = document.getElementById("Pied");
    if (elmnt) {elmnt.style.display="none"}

    document.getElementById("titrebdd").innerText= "Créer une variable par croisement"
    document.getElementById("sstitrebdd").innerHTML= `<h4 style="float:left"> Choisissez les variables à croiser : </h4>  <a href="https://utbox.univ-tours.fr/s/GEwx9XSc7mmo4fe" target="_blank" style="float:right">demo</a>`

    vLd=0;
    vCd=0;


    // affichage des fonctionnalités dans l'entête du tableau de base
    var titre = document.getElementById('Titre')
    var tr = titre.insertRow();
    var HCell = document.createElement("th");
    HCell.colSpan=1;
    var Case = ` 

   

    <div class="input-group-prepend" >
            <!-- <span class="input-group-text">Lignes    </span> -->

            

            <span class="input-group-text" onclick="openVars('LD')"> V. 1</span>

            <input onclick="openVars('LD')" onkeyup="FiltrerVars(event)" id= "TxtLD" type="text" class="form-control picthb" placeholder="Choisissez une variable" onkeydown="GetClav(event,'LD')">

            <button class="btn btn-outline-secondary imgbtn bi-caret-up-fill d-none" onclick= "closeVars();" type="button"></button>


    </div>

    <div class="input-group-prepend" >
    <!-- <span class="input-group-text">Lignes    </span> -->



    <span class="input-group-text" onclick="openVars('CD')"> V. 2</span>

    <input onclick="openVars('CD')" onkeyup="FiltrerVars(event)" id= "TxtCD" type="text" class="form-control picthb" placeholder="Choisissez une variable" onkeydown="GetClav(event,'CD')">
    <button class="btn btn-outline-secondary imgbtn bi-caret-up-fill d-none" onclick= "closeVars();" type="button"></button>


    </div>

    <div id ="blocnvv" style="display:none">

    <br>  <H3> Nouvelle variable  </h3>

    <div  class="input-group-prepend" style="width:100%;">

    <span class="input-group-text"> Nom :  </span> `

    Case += `<input  type="text" id="NomC" class="form-control" style = "width:150px;placeholder="Nom?" value = ` + Nom.length + ` >

    <span class="input-group-text"> Libellé :  </span> `

    Case += ` <input  type="text" id="LibC" class="form-control" placeholder="Libellé de la variable?" >

    </div>

    `
    
                 
    HCell.innerHTML = Case;
    tr.appendChild(HCell);
     

    

}



var coulMods= ['rgba(200, 200, 200, 0.3)', 
    'rgba(0, 54, 202, 0.3)',
    'rgba(36, 189, 14, 0.42)',
    'rgba(255, 131, 0, 0.55)',
    'rgba(255, 233, 55, 0.55)', 
    'rgba(213, 71, 71, 0.59)', 
    'rgba(236, 105, 54, 0.5)',
    'rgba(189, 14, 101, 0.42)', 
    'rgba(89, 131, 245, 0.5)', 
    'rgba(89, 245, 224, 0.3)', 
    'rgba(60, 191, 173, 0.5)',
    'rgba(0, 54, 202, 0.4)',
    'rgba(36, 189, 14, 0.52)',
    'rgba(255, 131, 0, 0.65)',
    'rgba(255, 233, 55, 0.65)', 
    'rgba(213, 71, 71, 0.69)', 
    'rgba(236, 105, 54, 0.6)',
    'rgba(189, 14, 101, 0.52)', 
    'rgba(89, 131, 245, 0.6)', 
    'rgba(89, 245, 224, 0.4)', 
    'rgba(60, 191, 173, 0.6)',
    'rgba(0, 54, 202, 0.5)',
    'rgba(36, 189, 14, 0.62)',
    'rgba(255, 131, 0, 0.75)',
    'rgba(255, 233, 55, 0.75)', 
    'rgba(213, 71, 71, 0.79)', 
    'rgba(236, 105, 54, 0.7)',
    'rgba(189, 14, 101, 0.62)', 
    'rgba(89, 131, 245, 0.7)', 
    'rgba(89, 245, 224, 0.5)', 
    'rgba(60, 191, 173, 0.7)',
    'rgba(0, 54, 202, 0.6)',
    'rgba(36, 189, 14, 0.72)',
    'rgba(255, 131, 0, 0.85)',
    'rgba(255, 233, 55, 0.85)', 
    'rgba(213, 71, 71, 0.89)', 
    'rgba(236, 105, 54, 0.8)',
    'rgba(189, 14, 101, 0.72)', 
    'rgba(89, 131, 245, 0.8)', 
    'rgba(89, 245, 224, 0.6)', 
    'rgba(60, 191, 173, 0.8)',
    'rgba(0, 54, 202, 1)',
    'rgba(36, 189, 14, 1)',
    'rgba(255, 131, 0, 1)',
    'rgba(255, 233, 55, 1)', 
    'rgba(213, 71, 71, 1)', 
    'rgba(236, 105, 54, 1)',
    'rgba(189, 14, 101, 1)', 
    'rgba(89, 131, 245, 1)', 
    'rgba(89, 245, 224, 1)', 
    'rgba(60, 191, 173, 1)']

function TabRecCrois(vLd, vCd){ // fonction permettant d'afficher le croisement de deux variables en vue de les combiner pour en créer une troisième


// vérif du type de variable

        if (TypVar[vLd] != 'a'){alert("La variable " + Nom[vLd] + " n'est pas qualitative. Croisement impossible");return 0}
        // évitement des variables multiples
        VarMul = EstMulti(vLd);
        if (VarMul[0]==true){alert("La variable " + Nom[vLd] + " est multiple. Croisement impossible");return 0}

        if (TypVar[vCd] != 'a'){alert("La variable " + Nom[vCd] + " n'est pas qualitative. Croisement impossible");return 0}
        // évitement des variables multiples
        VarMul = EstMulti(vCd);
        if (VarMul[0]==true){alert("La variable " + Nom[vCd] + " est multiple. Croisement impossible");return 0}

//



    document.getElementById("sstitrebdd").style.display='none'; //.innerText= "Cliquez sur les cases pour définir les combinaisons :"
    document.getElementById("blocnvv").style.display="block"


    // les non réponses sont incluses d'office
    document.getElementById('ChkNRX').checked=true;
    document.getElementById('ChkNRY').checked=true;

    T_C_R(vLd, vCd, false)

    var x= vLd
    var y = vCd

    document.getElementById("LibC").value = Nom[x] + ` X ` + Nom[y] 
   
   
    //création du tableau des recodages
    TcrC = new Array(CdMax[x])
    for (i=0;i<CdMax[x]+1;i++) {

        TcrC[i] = new Array(CdMax[y])

        for (j=0;j<CdMax[y]+1;j++) {
            TcrC[i][j]=0;
        }
    }


    var combimax = (CdMax[x]+1) * (CdMax[y]+1)       
        
    TapC = new Array(combimax)
    ModaR = new Array(combimax)  

    ModaR[0] = "N/A"
    for (i=1;i<combimax;i++) {
        ModaR[i] = ""
    }


    ModCur = 1
    Aff_TcrC()
}

function Aff_TcrC() {

    var nbl = document.getElementById("Titre").rows.length 
    if (nbl>=3 ){document.getElementById("Titre").deleteRow(2)}; 

    var elmnt = document.getElementById("cadrerec1");
    if (elmnt) {elmnt.remove()}

    
    var x= vLd
    var y = vCd

    // affichage des fonctionnalités dans l'entête du tableau de base
    var titre = document.getElementById('Titre')
    var tr = titre.insertRow();
    var HCell = document.createElement("th");
    HCell.colSpan=1;
    
    
    var Case = `<div id="cadrerec1" >
    
        

    </div> `

    if (ModCur <10) {
    var couleur = `background-color:`+ coulMods[ModCur]
    } else {
    var couleur = `background-color: white; color:black`
    }


    Case += `<h4> Définir modalité n° ` + ModCur+ `</h4>
    
    
    <div class="input-group-prepend" style="width:60%;">

            <span class="input-group-text" > Num° </span>

            <span class="input-group-text" style="` +  couleur  + `"> ` + ModCur + ` </span>

            <span class="input-group-text" > Libellé </span>

            <input  type="text" id="LibModC" class="form-control" onkeyup="AjoutModaCrois(event)" placeholder="Libellé ?" value = ` + ModaR[ModCur] + `  >


            <button id= "btnvalmdrc" class="btn btn-primary"  onclick= "ValidModRec()" type="button" style="height:38px;display:none;width:300px">Créer la modalité</button>



    </div> <br><br>`


    Case += `<div style="display: flex;flex-direction:row;"> <div class="tabrec"></div>`

    // création des entêtes de colonnes
    for (j=0;j<Number(CdMax[y])+1;j++) {

        //n'affiche l'entête que s'il y a une colonne
        if (MrgY[j]>0) {
            Case += `<div class="tabrec"  style="background-color:white;" onclick="selcol(` + j + `)" >` + ModaY[j] + `</div>`;

        }
    }

    Case += `</div>`


    // cases (lignes + moda)
    
    var nbl=0

        // défilement des lignes
        for (i=0;i<Number(CdMax[x])+1;i++) {

            if (MrgX[i]>0) {

                Case += `<div style="display: flex;flex-direction:row;">`

                    Case += `<div class="tabrec" style="background-color:white;" onclick="sellig(` + i + `)">` + ModaX[i] + `</div>`;

                    // cases
                    for (j=0;j<Number(CdMax[y])+1;j++) {

                        //n'affiche la colonne que s'il y a des valeurs 
                        if (MrgY[j]>0) {

                            // définition de la situation 
                            var couleur = `background-color:`+ coulMods[Number(TcrC[i][j])]
                            if (TcrC[i][j]== ModCur){couleur +=';border: 1px solid #80bdff;box-shadow: 0 0 0.15rem 0.1rem rgba(0,123,255, 0.25);'}// +  coulMods[Number(TcrC[i][j])] + ';'}    

                            Case += `<div class="tabrec" style = "padding-top:20px;color:white;` +  couleur  + `" onclick=selCase(`+ i + `,` + j + `) onmouseover=survCase(this,`+ i + `,` + j + `,"in") onmouseleave=survCase(this,`+ i + `,` + j + `,"out") >` + Tcr[i][j] + `</div>`;
                
                        }
                    }
                    
                Case += `</div>`
            } 
        }


        // affichage du tri à plat 

  
     
    
    for (i=0;i<TapC.length;i++) {
        TapC[i]=0;
         
    }

    
    for (i=0;i<CdMax[x]+1;i++) {
        
        for (j=0;j<CdMax[y]+1;j++) {
        var rg = Number(TcrC[i][j])
        TapC[rg]+=Tcr[i][j];
        }

    }




    
    


    Case += ` <br> <h4> Tri à plat de la variable en préparation </h4> <br>`



    for (i=0;i<TapC.length+1;i++){
        
         if (TapC[i]>0 || i==ModCur) {

             

            var couleur = `background-color:`+ coulMods[i]
            if (i== ModCur){couleur +=';border: 1px solid #80bdff;box-shadow: 0 0 0.5rem 0.1rem rgba(0,123,255, 0.25);'}

            Prct = TapC[i]/PopTot*100;
            Prct=Prct.toFixed(NbDec);
            var nomb=  Math.round(Prct);


            var r = document.querySelector(':root');
            r.style.setProperty('--pct', nomb);

            Case += `<div style="height:40px;float:left;width:100%" onclick= selMod(`+ i + `)> 
                
                <div  class="Prct" style="height:30px;position:absolute;left:50px;cursor:pointer; width:`+ nomb  + `%;` + couleur + `"></div>
                <div  style="padding-top:5px;height:30px;position:absolute;left:60px;width:100%;cursor:pointer;">`+  ModaR[i] + `   |   ` + TapC[i] + ` (`+ Prct+` %) </div>   
            
                </div> <br>`;


             



         }

    }

   
    Case += `


    <button class="btn btn-primary"  onclick= "AjoutVCr()" type="button" style="width:200px;height:50px;float:left;margin-top:10px;"> Créer la variable </button>
    
    `



    Case += `</div>`;
    HCell.innerHTML = Case;
    tr.appendChild(HCell);

    if (document.getElementById('LibModC').value == "") {document.getElementById('LibModC').value = ModaR[ModCur]};





}

function AjoutModaCrois(event) { // pour valider l'ajout par entrée

    var key = event.keyCode;

    if (key==13) {
        ValidModRec()
    }
}

function ValidModRec() {

    // création de la chaine de réponse 
    
    var nommod = document.getElementById("LibModC").value
    
    if (nommod=="") {
    nommod = prompt("Choisissez un libellé pour la combinaison...", "Nouvelle modalité");
    
    }

    var rg= Number(ModCur)
    ModaR[Number(ModCur)] = nommod ;

    ModCur++;
    Aff_TcrC() 

}


function selCase(i,j) { // fonction permettant de déterminer le comportement en cas de clic sur une case


    if (TcrC[i][j] ==0) {
        TcrC[i][j] = ModCur ;
        


    } else {
        if (TcrC[i][j] == ModCur) {TcrC[i][j] =0};
    }

    Aff_TcrC()
    document.getElementById('btnvalmdrc').style.display = "block";

}

function survCase(cntrl, i,j,inorout) { // fonction permettant de déterminer le comportement en cas de survol d'une case

     

        if (TcrC[i][j] == 0) {

            
            if (inorout == "in") {
            var coul = coulMods[Number(ModCur)]
            } else {
            var coul = coulMods[0]
            }

            cntrl.style.backgroundColor = coul;

            //TcrC[i][j] = ModCur ;
        }  
    

}

function selMod(i) { // fonction permettant de déterminer le comportement en cas de clic sur une case

    if (i==0) {return 0};
    ModCur =i 
     

    Aff_TcrC()
    document.getElementById('btnvalmdrc').innerText = "Modifier"
    document.getElementById('btnvalmdrc').style.display = "block";
}

function sellig(i) { // sélection de toutes les cases de la ligne
 
    // nb de cases cochées
    var nbcoch =0
    for (j=0;j<TcrC[i].length;j++){

        if (TcrC[i][j] == ModCur) {nbcoch++}
             
    }

    var decoch;
     
    if (TcrC.length==nbcoch) {decoch=true}

    for (j=0;j<TcrC[i].length;j++){

        if (TcrC[i][j] ==0) {
            TcrC[i][j] = ModCur ;
            
        } else {
           if (TcrC[i][j] == ModCur && decoch==true) {TcrC[i][j] =0};
        }

    }
  
     

    Aff_TcrC()
    document.getElementById('btnvalmdrc').style.display = "block";

};

function selcol(j) { // sélection de toutes les cases de la colonne
 
    var nbcoch =0
    for (i=0;i<TcrC.length;i++){
            
        if (TcrC[i][j] == ModCur) {nbcoch++}
             
    }

    var decoch;
    if (TcrC.length==nbcoch) {decoch=true}
    
    

    for (i=0;i<TcrC.length;i++){

        if (TcrC[i][j] ==0) {
            TcrC[i][j] = ModCur ;
            
        } else {
            if (TcrC[i][j] == ModCur && decoch==true) {TcrC[i][j] =0};
        }

    }
  
     

    Aff_TcrC()
    document.getElementById('btnvalmdrc').style.display = "block";

};

function AjoutVCr(){// création de la variable par croisement 

        // ajout de la colonne
        var col = Nom.length
        var nomvar = document.getElementById('NomC').value;
        var libvar = document.getElementById('LibC').value;

        // définition du code max
        
        var nbcomb = 0;

        for (m=0;m<TapC.length;m++){
        if (TapC[m]>0){nbcomb = m}    
        }
        

        // Agrandissement du tableau des variables
        var nomvar = col;  
        Nom.splice(col,0,nomvar);
        Posi.splice(col,0,'2');
        CdMax.splice(col,0,nbcomb);
        Reco.splice(col,0,' ');
        TypVar.splice(col,0,'a');
        Libellé.splice(col,0,libvar);

        NbVar++;



        // agrandissement du tableau des modalités
        Moda.splice(col,0,"0")
        ModaO.splice(col,0,"0")

        Moda[col] = new Array(nbcomb)
        ModaO[col] = new Array(nbcomb)

 
        for (m=0;m<nbcomb+1;m++){
            Moda[col][m] = ModaR[m];
            ModaO[col][m] = Moda[col][m];
        }


        // agrandissement de la base de données
        for (l=0; l<BDD.length; l++) {

            // définition contenu de la ligne

            var v1= Number(BDD[l][vLd]);
            var rgl = Reco[vLd];
            v1=ValApRec(v1,rgl);

            var v2= Number(BDD[l][vCd])
            var rgl = Reco[vCd];
            v2=ValApRec(v2,rgl);

            var combi= TcrC[v1][v2]

            BDD[l].splice(col,0,combi)

        }





        ChargerListVar()
        Vidage("TabBDD")
        vL = col;
        T_A_P()

        // extension du dictionnaire des modalités

        // définition des valeurs 

        // sortie 

}

function AjoutVarScore() {

    
    var elmnt = document.getElementById('TabBDD');
    if (elmnt) {elmnt.style.display="none"} //{elmnt.remove()}

    var elmnt = document.getElementById("Pied");
    if (elmnt) {elmnt.style.display="none"}

    document.getElementById("titrebdd").innerText= "Créer un variable score"
    document.getElementById("sstitrebdd").innerHTML= `` // `<H3> Nouvelle variable  </h3>  <a href="https://utbox.univ-tours.fr/s/GEwx9XSc7mmo4fe" target="_blank" style="float:right">demo</a>`

    vS=0;
    mS=-1
    
    TabScr=[]

    // affichage des fonctionnalités dans l'entête du tableau de base
    var titre = document.getElementById('Titre')
    var tr = titre.insertRow();
    var HCell = document.createElement("th");
    HCell.colSpan=1;
    var Case = ` 

    <div id ="blocnvv" >

       

        <div  class="input-group-prepend" style="width:100%;">

        <span class="input-group-text"> Nom :  </span> `

        Case += `<input  type="text" id="NomS" class="form-control" style = "width:150px;placeholder="Nom?" value = ` + Nom.length + ` >

        <span class="input-group-text"> Libellé :  </span> `

        Case += ` <input  type="text" id="LibS" class="form-control" placeholder="Libellé de la variable?" >

        </div>

        <br>
     

        <h4> Choisissez les variables/modalités à additionner </h4> 

    </div>

    <div class="input-group-prepend" >
                       

            <span class="input-group-text" onclick="openVars('LS')"> Variable </span>

            <input onclick="openVars('LS')" onkeyup="FiltrerVars(event)" id= "TxtLS" type="text" class="form-control picthb" placeholder="Choisissez une variable" onkeydown="GetClav(event,'LS')">

            <button class="btn btn-outline-secondary imgbtn bi-caret-up-fill d-none" onclick= "closeVars();" type="button"></button>


    </div>

    <div style="width:100%"> 
        <select id="ComboS" class="custom-select"  onchange='VoirBloc("btnvalsc")' multiple="multiple" style = "float: left; margin-bottom: 2px;display:none">
            <option value="" disabled selected>Choisissez une ou plusieurs modalités</option>
        </select>  
    </div>
     
    <br>
    <br>

    <button id= "btnvalsc" class="btn btn-primary"  onclick= "AjoutScores()" type="button" style="margin-top:10px;height:38px;width:250px;float:right;display:none;">Ajouter </button>
    
   
   
    <div style="clear:both;"></div>

    <div id="listscores">  <h4> Scores ajoutés </h4>

                <div class="input-group-prepend" > 
                       
                 
                       <span class="input-group-text" style = "width:10%;"> Variable </span>
                       <span class="input-group-text" style = "width:40%;"> Libellé </span>
                       <span class="input-group-text" style = "width:35%;"> Modalité </span>
                       <span class="input-group-text" style = "width:15%;"> Score </span>
           
           
           
               </div>
                 
               
    </div>

    <div id="tapscores" style='display:none'> Tri à plat temporaire </div>

    `
    
                 
    HCell.innerHTML = Case;
    tr.appendChild(HCell);
     

     

}

function ModasScore(z) {

     
    document.getElementById("ComboS").style.display='block';    
    document.getElementById("ComboS").options.length = 0;

    if(TypVar[z]=='a') {

        for (m=0;m<= CdMax[z];m++) {
            document.getElementById("ComboS").options[m]=new Option(Moda[z][m] , m , true, false);
        }

        var nbl= document.getElementById("ComboS").length
        if (nbl<5) { 
        document.getElementById("ComboS").size = nbl;
        } else {
        document.getElementById("ComboS").size = 5;
        }
    }

    if(TypVar[z]=='e' ||TypVar[z]=='r' ) {

         
            document.getElementById("ComboS").options[0]=new Option("Variable quantitative : score = valeur" , 0 , true, false);
        

        document.getElementById("ComboS").size = 1;
        VoirBloc("btnvalsc")

    }


}

function AjoutScores() { // permet d'ajouter les modalités au tableau des scores


    if (TypVar[vS]=='a') { // ajout des variables quali

        var select = document.getElementById( 'ComboS' );
        var nbm=0
        for(m=0;m<select.length;m++) {
            
            if (select.options[m].selected) {
                
                //évitement des doublons
                var dejala=false 
                for (s=0;s<TabScr.length;s++){
                    if (TabScr[s][0]==vS && TabScr[s][1]==m){dejala=true}
                }
                if (dejala){continue}

                //agandissement du tableau
                var nbsc = TabScr.push('')
                nbsc--;
                
                TabScr[nbsc] = new Array(2)
                TabScr[nbsc][0] = vS;
                TabScr[nbsc][1] = m;
                TabScr[nbsc][2] = 1;


                nbm++

                select.options[m].selected=false;

            }

        }

        if (nbm>0) {

            voirScores()
        }

    } else { // variables quanti

                        //évitement des doublons
            var dejala=false 
            for (s=0;s<TabScr.length;s++){
            if (TabScr[s][0]==vS){dejala=true}
            }
            if (dejala){return 0}

           //agandissement du tableau
           var nbsc = TabScr.push('')
           nbsc--;
           
           TabScr[nbsc] = new Array(2)
           TabScr[nbsc][0] = vS;
           TabScr[nbsc][1] = 0;
           TabScr[nbsc][2] = CdMax[vS];

           voirScores()


    }


// dénombrement des options

//


}

function voirScores() { // affiche les modalités score déjà choisies

    document.getElementById("listscores").innerHTML=""

    var Liste = `<div ><h4> Scores ajoutés </h4>

                <div class="input-group-prepend" > 
                       
                 
                       <span class="input-group-text" style = "width:10%;"> Variable </span>
                       <span class="input-group-text" style = "width:40%;"> Libellé </span>
                       <span class="input-group-text" style = "width:35%;"> Modalité </span>
                       <span class="input-group-text" style = "width:15%;"> Score </span>
           
           
           
               </div>
                 
               `

    for (s=0;s<TabScr.length;s++) {


    Liste+= `
    
    <div class="input-group-prepend" style="margin-top:0px"> 
                       

             

            <input type="text" class="form-control" style = "width:10%;" onkeypress="return false;" placeholder="` + Nom[TabScr[s][0]]+ `"   >
            <input type="text" class="form-control" style = "width:40%;" onkeypress="return false;" placeholder="` + Libellé[TabScr[s][0]]+ `" >`

            if (TypVar[TabScr[s][0]]== 'a') {
            
                Liste+= `

                <input type="text" class="form-control" style = "width:35%;" onkeypress="return false;" placeholder="` + Moda[TabScr[s][0]][TabScr[s][1]] + `"   >
                <input type="text" class="form-control" style = "width:10%;" onkeypress="return false;"  placeholder="` +  TabScr[s][2] + `" >
                <button class="btn btn-outline-primary imgbtn imgminus" style="height:38px" type="button" onclick="scoreMoins(`+s+`)"></button>
                <button class="btn btn-outline-primary imgbtn imgplus"  style="height:38px" type="button" onclick="scorePlus(`+s+`)"></button>`

            } else {

                Liste+= `

                <input type="text" class="form-control" style = "width:35%;" onkeypress="return false;" placeholder="..."   >
                <input type="text" class="form-control" style = "width:13.3%;" onkeypress="return false;"  placeholder="valeur (max:` + CdMax[TabScr[s][0]] + `)" >`

            }


            Liste+= `
            <button class="btn btn-outline-warning imgbtn imgtrash" style="height:38px" type="button" onclick="scoreSuppr(`+s+`)"></button>


    </div>

    `    
    }

    Liste +=`</div>`;

    document.getElementById("listscores").innerHTML=Liste;
    document.getElementById("listscores").style.display="block";

    tapscores();


}

function scorePlus(rg){
TabScr[rg][2]++; 
voirScores()
}

function scoreMoins(rg){
   // if (TabScr[rg][2]<=1){return}

    TabScr[rg][2]--;
    voirScores()
}

function scoreSuppr(rg){
    TabScr.splice(rg,1);
    voirScores()
}

function tapscores(){ // fonction affichant les scores cumulés des modalités
    //effacement de l'ancien tri a plat
    document.getElementById("tapscores").innerHTML = "";

    // calcul du tri à plat
    

    // définition de la valeur max
    var scmax=0;
    for (s=0;s<TabScr.length;s++){
    scmax+= TabScr[s][2] ;   
    }

    TapS= new Array(scmax+1)
    for(t=0;t<scmax+1;t++) {TapS[t]=0} //mise à zéro

    // analyse de la BB

    var scoreli=0

    for(l=0;l<BDD.length;l++) {
        scoreli=scoreligne(l);
        
        // incrémentation du tri à plat
        scoreli=Math.round(scoreli)
        TapS[scoreli]++;
    }



    // affichage du tri à plat

     
    var Case = ` <br> <h4> Tri à plat de la variable en préparation </h4> <br>`



    for (i=0;i<TapS.length+1;i++){
        
         if (TapS[i]>0) {
                     

            Prct = TapS[i]/BDD.length*100;
            Prct=Prct.toFixed(NbDec);
            var nomb=  Math.round(Prct);


            var r = document.querySelector(':root');
            r.style.setProperty('--pct', nomb);

            Case += `<div style="height:40px;float:left;width:100%" onclick= selMod(`+ i + `)> 
                
                <div  class="Prct" style="height:30px;position:absolute;left:50px;cursor:pointer; width:`+ nomb  + `%;"></div>
                <div  style="padding-top:5px;height:30px;position:absolute;left:60px;width:100%;cursor:pointer;">`+  i + `   |   ` + TapS[i] + ` (`+ Prct+` %) </div>   
            
                </div> <br>`;


             



         }

    }

   
    Case += `


    <button class="btn btn-primary"  onclick= "AjoutVSc()" type="button" style="width:200px;height:50px;float:left;margin-top:10px;"> Créer la variable </button>
    
    `

    document.getElementById("tapscores").innerHTML = Case;
    document.getElementById("tapscores").style.display="block";

}

function scoreligne(l){ //renvoie le score obtenu par l'individu en fonction 

var scoreli=0;

for (s=0;s<TabScr.length;s++){

    var vsc=TabScr[s][0];
    var msc=TabScr[s][1];

    var valmod=BDD[l][vsc]
    
    // application du recodage
    var rgl = Reco[vsc]
    if (rgl != "") {valmod=ValApRec(valmod,rgl)}
    
    if (TypVar[vsc] =='a') {

        if (valmod==msc){scoreli += Number(TabScr[s][2]) }

    } else {

        scoreli +=valmod
        
    }
       
}

if (scoreli==0) {scoreli=""}
return scoreli;


}
function AjoutVSc(){// création de la variable par score

    // ajout de la colonne
    var col = Nom.length
    var nomvar = document.getElementById('NomS').value;
    var libvar = document.getElementById('LibS').value;
    if (libvar==""){libvar="variable score"}

    // définition du code max
    
    var nbcomb = 0;
    for (m=0;m<TapS.length;m++){
    if (TapS[m]>0){nbcomb = m}    
    }
    

    // Agrandissement du tableau des variables
    var nomvar = col;  
    Nom.splice(col,0,nomvar);
    Posi.splice(col,0,'2');
    CdMax.splice(col,0,nbcomb);
    Reco.splice(col,0,' ');
    TypVar.splice(col,0,'e');
    Libellé.splice(col,0,libvar);

    NbVar++;



    // agrandissement du tableau des modalités
    Moda.splice(col,0,"0")
    ModaO.splice(col,0,"0")

    Moda[col] = new Array(nbcomb)
    ModaO[col] = new Array(nbcomb)


    for (m=0;m<nbcomb+1;m++){
        Moda[col][m] =m;
        ModaO[col][m] =m;
    }


    // agrandissement de la base de données
    for (l=0; l<BDD.length; l++) {

        // définition contenu de la ligne

        var scoreli = scoreligne(l)

        BDD[l].splice(col,0,scoreli)

    }





    ChargerListVar()
    Vidage("TabBDD")
    vL = col;
    prepTAP()
 

}


function AjoutVarCalc() {
        
    var elmnt = document.getElementById('TabBDD');
    if (elmnt) {elmnt.style.display="none"} //{elmnt.remove()}

    var elmnt = document.getElementById("Pied");
    if (elmnt) {elmnt.style.display="none"}

    document.getElementById("titrebdd").innerText= "Créer un variable calculée"
    document.getElementById("sstitrebdd").innerHTML= `` // `<H3> Nouvelle variable  </h3>  <a href="https://utbox.univ-tours.fr/s/GEwx9XSc7mmo4fe" target="_blank" style="float:right">demo</a>`

    vS=0;
    mS=-1
    
    TabScr=[]

    // affichage des fonctionnalités dans l'entête du tableau de base
    var titre = document.getElementById('Titre')
    var tr = titre.insertRow();
    var HCell = document.createElement("th");
    HCell.colSpan=1;
    var Case = ` 

    <div id ="blocnvv" >

        <div  class="input-group-prepend" style="width:100%;">

            <span class="input-group-text"> Nom :  </span> `

            Case += `<input  type="text" id="NomS" class="form-control" style = "width:150px;placeholder="Nom?" value = ` + Nom.length + ` >

            <span class="input-group-text"> Libellé :  </span> `

            Case += ` <input  type="text" id="LibS" class="form-control" placeholder="Libellé de la variable?" >

            </div>

        <br>
     

        <h4> Composez le calcul à effectuer </h4> 

        </div>


    <div id ="operations" >
 
        <div  class="input-group-prepend" style="width:100%;">
        
            <div class="dropdown" style = "float:left;width:40%;">

                <input  type="text" id="TxtCalc0" class="form-control dropdown-toggle tcalc" style = "float:left; margin-bottom: 2px;" placeholder="Choisissez une variable ou saisissez une valeur" data-toggle="dropdown" onchange='testCalc()'>
            
                <div class="dropdown-menu cmbcalc" style = "float:left;width:100%;">
                <a class="dropdown-item" href="#" onclick='defvcalc("0","TxtCalc0")'>Saisir une valeur</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onclick="openVars('Calc0')">Choisissez une variable</a>    
                </div>

            </div>

            
            

            <select id="Calc0" class="custom-select opcalc"  style = "float: left; margin-bottom: 2px;width:20%;font-size:1rem" onchange='testCalc()'>
                    <option value="0" selected >Choisissez un opérateur</option>
                    <option value="1">+</option>
                    <option value="2">-</option>
                    <option value="3">x</option>
                    <option value="4">/</option>
            </select>  

        
            <div class="dropdown" style = "float:left;width:40%;">

                <input  type="text" id="TxtCalc1" class="form-control dropdown-toggle tcalc" style = "float:left; margin-bottom: 2px;" placeholder="Choisissez une variable ou saisissez une valeur" data-toggle="dropdown" onchange='testCalc()'>
            
                <div class="dropdown-menu cmbcalc" style = "float:left;width:100%;">
                <a class="dropdown-item" href="#" onclick='defvcalc("0","TxtCalc1")'>Saisir une valeur</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onclick="openVars('Calc1')">Choisissez une variable</a>
                
            </div>

           
    
        </div>
     

    </div>

    

    `

    HCell.innerHTML = Case;
    tr.appendChild(HCell);

    //fillcmbcalc()

         // affichage des fonctionnalités dans l'entête du tableau de base
         var titre = document.getElementById('Titre')
         var tr = titre.insertRow();
         var HCell = document.createElement("th");
         HCell.colSpan=1;
         var Case = `     <button class="btn btn-outline-primary"  onclick= "AjoutOp()" type="button" style="width:10%;height:35px;float:left ;"> Ajouter une opération </button>
                    <div>
                        <button class="btn btn-primary"  onclick= "AjoutVCalc()" type="button" style="width:20%;height:35px;float:right"> Calculer la nouvelle variable </button>
                    
                    </div>
                    `
    
        HCell.innerHTML = Case;
        tr.appendChild(HCell);
        
    
    


}

function fillcmbcalc(){

    /*
// remplissage des combos avec les variables quanti
var cmbs = document.getElementsByClassName("cmbcalc")

// remise à zéro des combos
for (c=0;c<cmbs.length;c++) {
    cmbs[c].innerHTML = `<a class="dropdown-item" href="#" onclick='defvcalc("0","TxtCalc`+ c+`")'>Saisir une valeur</a>
    <div class="dropdown-divider"></div>`;
}

// défilement des variables
for (v = 1; v < Nom.length; v++) { //défilement des variables

   if (TypVar[v] != 'a') { // si variables quanti



       for (c=0;c<cmbs.length;c++) {
           cmbs[c].innerHTML += `<a class="dropdown-item" href="#" onclick='defvcalc("[`+ v + `] ` + Nom[v] + ` - ` +  Libellé[v] + `","TxtCalc` + c + `");testCalc()'>` + Nom[v] + ` - ` +  Libellé[v] +  `</a>`

       }

   }
   
}

*/
}
function defvcalc(val,control){

    document.getElementById(control).value=val;
}

function AjoutOp(){

    NbOps++;

    testCalc();

    //définition du rang 
var cmbs = document.getElementsByClassName("cmbcalc")
var rg = cmbs.length;

 

 // affichage des fonctionnalités dans l'entête du tableau de base
 var titre = document.getElementById('Titre')

 var nbrow = document.getElementById('Titre').rows.length
 nbrow--;
 var tr = titre.insertRow(nbrow);
 
 var HCell = document.createElement("th");
 HCell.colSpan=1;
 var Case = ` 
 
    <select id="opint`+ (rg/2) +`" class="custom-select opintcalc"  style = "float: left; margin-bottom: 12px;  ; width:10%;font-size:1rem" onchange='testCalc()'>

        <option value="0" selected >Choisissez un opérateur</option>
        <option value="1">+</option>
        <option value="2">-</option>
        <option value="3">x</option>
        <option value="4">/</option>
    
    </select>  
 

<div  class="input-group-prepend" style="width:100%;">

        <div class="dropdown" style = "float:left;width:40%;">

        <input  type="text" id="TxtCalc`+ rg +`" class="form-control dropdown-toggle tcalc" style = "float:left; margin-bottom: 2px;" placeholder="Choisissez une variable ou saisissez une valeur" data-toggle="dropdown" onchange='testCalc()'>

        <div class="dropdown-menu cmbcalc" style = "float:left;width:100%;">
        <a class="dropdown-item" href="#" onclick='defvcalc("0","TxtCalc`+ rg +`")'>Saisir une valeur</a>
        <div class="dropdown-divider"></div>
            
        </div>

        </div>




        <select id="Calc`+ (rg/2) +`" class="custom-select opcalc"  style = "float: left; margin-bottom: 2px;width:20%;font-size:1rem" onchange='testCalc()' >
            <option value="0" selected >Choisissez un opérateur</option>
            <option value="1">+</option>
            <option value="2">-</option>
            <option value="3" >x</option>
            <option value="">/</option>
        </select>  


        <div class="dropdown" style = "float:left;width:40%;">

        <input  type="text" id="TxtCalc`+ (rg+1) +`" class="form-control dropdown-toggle tcalc" style = "float:left; margin-bottom: 2px;" placeholder="Choisissez une variable ou saisissez une valeur" data-toggle="dropdown" onchange='testCalc()' >

        <div class="dropdown-menu cmbcalc" style = "float:left;width:100%;">
        <a class="dropdown-item" href="#" onclick='defvcalc("0","TxtCalc`+ (rg+1) +`")'>Saisir une valeur</a>
        <div class="dropdown-divider"></div>

        </div>
    </div>

    


`    

HCell.innerHTML = Case;
tr.appendChild(HCell);
fillcmbcalc()



}

function testCalc(){ //fonction permettant de vérifier que les valeurs saisies permettent le calcul
 

    // vérification des valeurs
    var cmbs = document.getElementsByClassName("tcalc") ;
    var nbcalc = cmbs.length;
    var nbok = 0 ;

    for (c=0;c<cmbs.length;c++) {
        var okvar=false

        //remplacement des virgules
        cmbs[c].value =cmbs[c].value.replace(",", ".") 
        var vcalc = cmbs[c].value;


        if(vcalc!=""){ 
        
        

            if (isNaN(vcalc)) {

                // recherche d'un numéro de variable quanti entre [ ]
                if(vcalc!=""){
                
                    var dcr = decroch(vcalc)
                    if(dcr[0]==true){

                        if (isNaN(dcr[1])==false) {

                            if (TypVar[dcr[1]]!='a') {okvar=true }
                        }
                    }

                }


            } else {
                if (vcalc>0) {okvar=true}

            }

        } else {
            okvar==false;
        }

        if (okvar==true){
            $(cmbs[c]).removeClass("nocalc");
            $(cmbs[c]).addClass("okcalc");
            nbok++;
        } else {
            $(cmbs[c]).removeClass("okcalc");
            $(cmbs[c]).addClass("nocalc");
        }
    }

    // vérification des opérateurs de ligne
    var cmbs = document.getElementsByClassName("opcalc")
    nbcalc += cmbs.length

    for (c=0;c<cmbs.length;c++) {
        
        var opcalc = cmbs[c].selectedIndex; 

         

        if (opcalc>0) {
            $(cmbs[c]).removeClass("nocalc");
            $(cmbs[c]).addClass("okcalc");
            nbok++;

        } else {
            $(cmbs[c]).removeClass("okcalc");
            $(cmbs[c]).addClass("nocalc");
        }
    }


     // vérification des opérateurs inter-lignes
     var cmbs = document.getElementsByClassName("opintcalc")
     nbcalc += cmbs.length
 
     for (c=0;c<cmbs.length;c++) {
         
         var opcalc = cmbs[c].selectedIndex; 
  
         if (opcalc>0) {
             $(cmbs[c]).removeClass("nocalc");
             $(cmbs[c]).addClass("okcalc");
             nbok++;
 
         } else {
             $(cmbs[c]).removeClass("okcalc");
             $(cmbs[c]).addClass("nocalc");
         }
     }

     

    if(nbok==nbcalc) {
        return true;
    } else {
        return false;
    }

}
function decroch(vcalc){

var cr1= vcalc.indexOf("[")
var cr2= vcalc.indexOf("]")

    if (cr1>-1 && cr2>-1) {
        var v = vcalc.substr(cr1+1,cr2-cr1-1)
        return[true,v]
    }
    else {
        return[false,vcalc]
    }
}

function AjoutVCalc() {

    var okcalc = testCalc()
    if(okcalc==false) {alert("calcul impossible.");return 0}

    // ajout de la colonne
    var col = Nom.length
    var nomvar = document.getElementById('NomS').value;
    var libvar = document.getElementById('LibS').value;
    if (libvar==""){libvar="variable calculée"}

    // définition du code max
    
    var nbcomb = 1;
    //for (m=0;m<TapS.length;m++){
    //if (TapS[m]>0){nbcomb = m}    
    //}
  

  // Agrandissement du tableau des variables
  var nomvar = col;  
  Nom.splice(col,0,nomvar);
  Posi.splice(col,0,'2');
  CdMax.splice(col,0,nbcomb);
  Reco.splice(col,0,' ');
  TypVar.splice(col,0,'r');
  Libellé.splice(col,0,libvar);

  NbVar++;



  // agrandissement du tableau des modalités
  Moda.splice(col,0,"0")
  ModaO.splice(col,0,"0")

  Moda[col] = new Array(nbcomb)
  ModaO[col] = new Array(nbcomb)


  for (m=0;m<nbcomb+1;m++){
      Moda[col][m] =m;
      ModaO[col][m] =m;
  }

  // création du tableau de mémorisation des opérations intermédiaires
  

  // agrandissement de la base de données
  for (l=0; l<BDD.length; l++) {

      // définition contenu de la ligne

      // succession des opérations
      var calcli = 0
      var sstot = new Array (NbOps)


      for (op=0;op<NbOps+1;op++) {

        // définition de l'opération courante
        
        var val1=0
        var val2=0

        
        // première valeur 
        var nomv1= 'TxtCalc'+ (op*2);
        var txtv1 = document.getElementById(nomv1).value 
         

        var vd=decroch(txtv1)
        
        if(vd[0]==false) { 
            val1= Number(vd[1])
        } else {
            val1= Number(BDD[l][Number(vd[1])])
        }


        // deuxième  valeur 
        var nomv2= 'TxtCalc'+ ((op*2)+1);
        var txtv2 = document.getElementById(nomv2).value
         
        
        var vd=decroch(txtv2)
        
        if(vd[0]==false) { 
            val2= Number(vd[1])
        } else {
            val2= Number(BDD[l][Number(vd[1])])
        }


        
        //opérateur
        var nomop = "Calc" + (op);
        var  oper=document.getElementById(nomop).selectedIndex; 
        

        if (oper==1) {sstot[op] = val1 + val2 }
        if (oper==2) {sstot[op] = val1 - val2 }
        if (oper==3) {sstot[op] = val1 * val2 }
        if (oper==4) {sstot[op] = val1 / val2 }

         

      }
      

      // traitement des opérations intermédiaires
      calcli = sstot[0]
      for (op=1;op<NbOps+1;op++) {

        var nomop = "opint" + (op);
        var  oper=document.getElementById(nomop).selectedIndex; 
        

        if (oper==1) {calcli = calcli + sstot[op] }
        if (oper==2) {calcli = calcli - sstot[op]}
        if (oper==3) {calcli = calcli * sstot[op]}
        if (oper==4) {calcli = calcli / sstot[op]}


      }

      BDD[l].splice(col,0,calcli)

  }





  ChargerListVar()
  Vidage("TabBDD")
  vL = col;
  prepTAP()


}

function Traitements() {
    document.getElementById("accueil").style.display = "none";

    var cdrbtn = document.getElementById("cadreboutons")
    $(cdrbtn).removeClass("greyed");
    
    document.getElementById("lblbase").innerText = nomBase;
    document.getElementById("lblbase").style.display = "block";

    document.getElementById("BlocFiltre").style.display= "none";
    document.getElementById("BlocVar").style.display= "none";
    document.getElementById("BlocVar2").style.display= "none";
    // document.getElementById("BlocFiltre").style.display= "none";
}






function ChgNbd(sens) { // ajustement du nombre de décimales


    if (sens=="-"){

        NbDec--;
        if (NbDec<0) {NbDec=0;return 0}
    }

    if (sens=="+"){

        NbDec++;
        if (NbDec>8) {NbDec=8;return 0}
    }


    document.getElementById("BtnDec").innerText = NbDec ;

    QuelTri();
}

function GetClav(event, typv) {

    var key = event.keyCode;



    if (typv=="L") {
        if (key==37){vL--} //flèche à gauche
        if (key==39){vL++} //flèche à gauche
        if (EstVu('BlocVar2')!=0 && key==40) { // flèche bas sélectionner la variable en colonne
            document.getElementById("TxtC").focus()
            return 0;
        }
    }

    if (typv=="C") {
        if (key==37){vC--} //flèche à gauche
        if (key==39){vC++} //flèche à gauche
        if (key==38) { // flèche haut sélectionner la variable en lignes

            document.getElementById("TxtL").focus()
            return 0;
    }
    
    if (key==115) { // inversion des variables avec F4
            var vtrans= vL;
            vL=vC;
            vC=vtrans;
            QuelTri()
            return 0;
        }
    }

    if(key==37 || key==39){QuelTri() ; return 0}



    openVars(typv);
    var char = document.getElementById('Txt'+typv).value
    //document.getElementById('TxtChercher').value = char;





}

function DetailsVar() {
    VoirBloc('modifVar')
//document.getElementById('ligneNom').style.display="none"
    document.getElementById('BtnMoinsVar').style.display="block"
    document.getElementById('LigneModas').style.display="block"
    document.getElementById('LigneVar').style.display="block"
    document.getElementById('BtnPlusVar').style.display="none"
    document.getElementById('TxtNom').value = Nom[vL];
    document.getElementById('TxtLib').value = Libellé[vL];

    VarMul = EstMulti(vL);
    if (VarMul[0]==true) {
        document.getElementById('btnEclat').style.display="block"
        document.getElementById('TxtRglG').disabled=true; 
        document.getElementById('TxtRglG').placeholder="Variable multiple : recodages impossibles"; 
    } else { document.getElementById('btnAgreg').style.display="block"}

    vuDetails=true;
}

function CacheDetails() {
    CacheBloc('modifVar');
    document.getElementById('BtnMoinsVar').style.display="none"
    document.getElementById('LigneModas').style.display="none"
    document.getElementById('LigneVar').style.display="none"
    document.getElementById('BtnPlusVar').style.display="block"
//document.getElementById('ligneNom').style.display="block"
    vuDetails=false;
}

function CaleSsHead() {

    
    var hpage = document.getElementById("hautpage");
    var Pos = hpage.getBoundingClientRect();
    var PosY = Number(Pos.height)  + 10

    document.getElementById('BlocFiltre').style.marginTop = PosY
    document.getElementById('contenu').style.marginTop = PosY

}


function ajoutCookie(fich, obj){
    return 0
    var d = new Date();
    d.setTime(d.getTime() + (31*24*60*60*1000)); // ajout de 31 jours
    var expires = "expires="+ d.toUTCString();
    document.cookie = fich + "=" + obj + ";" + expires + ";path=/";

}

function lireCookies(){

    var allcookies = document.cookie;
    var listebases=[]
    // Get all the cookies pairs in an array
    cookiearray = allcookies.split(';');

    // Now take key value pair out of this array
    for(var i=0; i<cookiearray.length; i++) {
        name = cookiearray[i].split('=')[0];
        value = cookiearray[i].split('=')[1];


        // ajout de la base ouverte dans le tableau des bases récentes
        listebases.push(value)

        var tbl=document.getElementById("tabfichs")

        var tr = tbl.insertRow();

        // numéro de ligne
        Case = `<a href="#" onclick="LireTR2H('` + value + `');" > <label style="cursor: pointer;">` + name + ` </p></label> </a> <br>`
        var HCell = document.createElement("th");
        HCell.innerHTML = Case;
        tr.appendChild(HCell);

    }

    return listebases;

}


function wait(message) {

    document.body.style.cursor = "wait";
   // document.getElementById("contenu").style.display="none"
    document.getElementById("processing").style.display="block"
    document.getElementById("processing").style.zIndex="1000";
    document.getElementById("lblwait").innerText = message
    
     

}

function endWait() {
     document.getElementById("processing").style.display="none"
     document.body.style.cursor = "default";    
     //document.getElementById("contenu").style.display="block"
}

function redefModaO() {

    for (v=1;v<NbVar;v++) {
        
        for (m=0;m<Moda[v].length;m++) {

            ModaO[v][m] = Moda[v][m]

        }


    }

        
}

function trimModa(){

    for (m=0;m<Moda[vL].length;m++) {

        Moda[vL][m] = Moda[vL][m].replace(/^\s+|\s+$/gm,'');
        ModaO[vL][m] = Moda[vL][m]

    }

}

