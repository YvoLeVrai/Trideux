
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
    var rgl = document.getElementById("TxtRglG").value;
    DicoRegle(vL);
    Reco[vL]=rgl;
    TypVar[vL]="" // forcer la recherche du type
    chargerREC()
    vuDetails=false;

    T_A_P()

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
    document.getElementById("btnexport1").innerText = "Base actuelle (modifiée)"




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

                //récupérartion de la valeur de la modalité avant recodage
                Moda[v][res] = ModaO[v][res]

            }
        }
    }



    Reco[v] = nvrgl;

    chargerREC();
    T_A_P();
    CacheBloc('degroup');
    document.getElementById("btnexport1").innerText = "Base actuelle (modifiée)"


}

///////////////////////////////////////////////////////////////////////////////////////////
// Codage logique des questions à choix multiples
///////////////////////////////////////////////////////////////////////////////////////////

function Eclater(v) {

    // 0 la variable est-elle bien multiple?
    // Recopiage du tableau des modalités
    ModaM = Moda[v].slice()

    //VarMul = EstMulti(v);



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

            sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne

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
    chargerREC()

    // 3 remplissage des colonnes crées

    // Défilement des variables de la base de données
    for (l=0; l<BDD.length; l++) {

        var valmod = 0;
        if (BDD[l][v]!=null){valmod=BDD[l][v]}

        if (valmod=='' || valmod=='0' || valmod==undefined) {

            // mise en non réponse de toutes les variables
            for (nv=1;nv<nbNv;nv++) {
                BDD[l][v + nv] = '0';
            }

            continue

        }

        var txtmod = Moda[v][valmod]

        //alert("ligne " + l + " = " + txtmod )



        // recherche des valeurs dans les modalités multiples
        var sstab=txtmod.split(VarMul[1]);


        for (m2=0;m2<sstab.length;m2++){

            sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne

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


    alert("Les variables ont bien été créées à la suite.")


}

function Agreger(v) {
    v=vL;

    // définition du nombre de colonnes à agréger
    var nbcol = prompt("Combien de colonnes souhaitez vous agréger (en comptant celle-ci)?")
    if (nbcol<2 || isNaN(nbcol)==true) {return 0}

    var nomvar = prompt("Quel est le nom de la variable créée ?")

    var col = v


    // création de la variable au rang -1
    Nom.splice(col,0,Nom[col] + "(multi)");
    Posi.splice(col,0,'');
    CdMax.splice(col,0,10);
    Reco.splice(col,0,'');
    TypVar.splice(col,0,'a');
    Libellé.splice(col,0,nomvar);

    NbVar++;

    // agrandissement du tableau des modalités
    Moda.splice(col,0,"0")
    ModaO.splice(col,0,"0")
    Moda[col]=new Array(1)
    ModaO[col]=new Array(1)

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
                var libssttr= Libellé[c].replace(nomvar,"")
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


        if (nvval=="") {
            nvval= Moda[col].length

            Moda[col].push(strlig)
            ModaO[col].push(strlig)
            //alert(nvval + " "  + strlig)

        }


        BDD[l][col]=nvval;

    }


    CdMax[col] = Moda[col].length



    ChargerListVar()

    T_A_P();






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

    for (m=0;m<=CdMax[v];m++) {

        if (m != mod) {


            if (TabRec[v][m] == mod) {return true;}

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

    if (key===13) {

        var idTxt = 'mod' + modalité;
        var nvTxt = document.getElementById(idTxt).value
        nvTxt = nvTxt.trim()

        VarMul = EstMulti(vL,ModaM);

        if (VarMul[0]==false) {


            if (nvTxt!='') {
                Moda[variable][modalité] = nvTxt

            } else {

                Moda[variable][modalité] = ModaO[variable][modalité]
            } ;

        } else { // si la variable est multiple

            for (m=0;m<Moda[vL].length;m++) {

                var sstab=Moda[vL][m].split(VarMul[1]);

                for (m2=0;m2<sstab.length;m2++){
                    if (sstab[m2] == ModaM[modalité]) {
                        Moda[vL][m]=Moda[vL][m].replace(sstab[m2],nvTxt)
                    }
                }

            }

        }

        // passage à la modalité suivante (si elle existe)
        var Msuiv= 'mod' + (modalité+1);

        if (document.getElementById(Msuiv)) {

            document.getElementById(Msuiv).focus();

        } else {

            T_A_P();
        }



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
    Number(modswap);


    Moda[v][mod1]=Moda[v][mod2]
    Moda[v][mod2]=modswap;

    ModaO[v][mod1] = Moda[v][mod1]
    ModaO[v][mod2] = Moda[v][mod2]



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
            var règle = document.getElementById("TxtRglG").value;
            valcase=ValApRec(valcase,règle)
        }

        BDD[l].splice(col,0,valcase)

    }

    ChargerListVar()
    chargerREC()
    vL++;
    T_A_P();

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
    T_A_P();

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


        LibPropre= libl.substr(0, Number(libl.length));
        TxtFile = TxtFile + TxtMef(Nom[v],3," ") + TxtMef(Posi[v],4,"0") + TxtMef(CodeMax,2," ") +  " "

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

                TxtFile = TxtFile + TxtMef(Nom[v],3," ") + TxtMef(m,3,"0") + " " + Moda[v][m] + "\r\n"

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


    var sep = prompt("Quel séparateur de colonnes voulez-vous utiliser? (par exemple :  ; / ) ?", ",");

    if (sep == null || sep == ""){
        alert("Un séparateur est nécessaire");
        return ;
    }

    var nl= BDD.length-1;
    var TxtFile="";
    var Ligne = "";

    var nv = Nom.length-1;

//Ajout des en-têtes
    for (v=1; v<= nv; v++) { // défilement des variables

        var lib = Libellé[v];

        if (lib == "") {lib=Nom[v]};

        if (isNaN(lib)) {lib = lib.replace(sep," ")}

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

            if (Reco[v].trim() != "") {val2 = ValApRec(val1, Reco[v])}// TabRec[v][val1]}

            if (TypVar[v] == "a" ) {

                var modalité = Moda[v][val2];
                if (isNaN(modalité)) { modalité = modalité.replace(sep," ")}

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


function ExportTR2() {
    SauvegarderSurDisque(SauvTR2(),nomBase + ".TR2", "UTF-8")

}

function SauvTR2() { //écriture de la base au format CSV


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

        var lib = Nom[v];

        if (lib == "") {lib=v};

        if (isNaN(lib)) {lib = lib.replace(sep," ")}

        Ligne = Ligne + lib;
        if (v<nv) {Ligne +=  sep;}

    }



    TxtFile = "VAR" + sep + Ligne + "\n";

    //Ajout des libellés
    Ligne = "";
    for (v=1; v<= nv; v++) { // défilement des variables

        var lib = Libellé[v];

        if (lib == "") {lib=Nom[v]};

        if (isNaN(lib)) {lib = lib.replace(sep," ")}

        Ligne = Ligne + lib;
        if (v<nv) {Ligne +=  sep;}

    }
    var ligne0 = Ligne;
    TxtFile += "Libellé" + sep + Ligne + "\n";





    //Ajout du type de variable
    Ligne = "Type Var (a=alphanum, e=entier, r=réel" + sep;
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




////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//STATS
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function SommeVal(col) { // somme des valeurs

    var somme=0
    var nbval =col.length;
    // Récupération des valeurs dans la colonne extraite et filtrée
    for (l=0 ;l < nbval; l++) {

        var valmod = Number(col[l])
        somme += valmod


    };


    return somme;

}

function Moyenne(col) { // comme son nom l'indique

    var somme=0
    var nbval =col.length;

    var règle = "";
    if (document.getElementById("TxtRglG")) { // récupération de la règle de recodage

        règle= document.getElementById("TxtRglG").value

    }

    // Récupération des valeurs dans la colonne extraite et filtrée
    for (l=0 ;l < nbval; l++) {

        // adaptation spontanée au recodage saisi
        var valmod = Number(col[l])


        if (règle != '') {valmod=ValApRec(valmod,règle)}


        somme += valmod


    };

    res=somme/nbval;
    res=res.toFixed(NbDec)
    return res;

}

function Quantiles(col) { // comme son nom l'indique


    var nbval=col.length-1;
    var quant=[100,10,4,2,1.3333333,1.111111,1.010101];

    var règle='';

    if (document.getElementById("TxtRglG")) { // récupération de la règle

        règle= document.getElementById("TxtRglG").value

    }

    for (q=0;q<quant.length;q++){
        var coeff = Number(quant[q]);

        var pct= nbval/coeff;
        var pctarr= Math.floor(pct)

        // prise en compte spontanée du recodage
        var valmod=  Number(col[pctarr])


        if (règle.trim() != '') {valmod=ValApRec(valmod,règle)}


        var quantile= valmod;

        var reste = pct%1;


        if (reste>0){ // correction en cas de reste

            var colsuiv= Number(col[pctarr+1]);

            if (règle.trim() != '') {colsuiv=ValApRec(colsuiv,règle)}


            var ajout =  (colsuiv-quantile)*reste;

            quantile +=ajout;

        }

        var res= quantile.toFixed(NbDec)

        quant[q] = res

    }



    return quant;


}

function EcartType(col, moy) {// comme son nom l'indique

    var somme=0
    var nbval =col.length;
    // Récupération des valeurs dans la colonne extraite et filtrée
    for (l=0 ;l < nbval; l++) {

        var valmod = Number(col[l]) //Number(item.substr(Posi[x]-1,CdMax[x].length));
        var ec=Number(valmod-moy);
        somme += Math.pow(ec,2);




    };

    res=somme/nbval;
    res=Math.sqrt(res);
    res=res.toFixed(NbDec)
    return res;

}


// calcul de la contribution locale au Khi²
function Contrib(eff, margl, margc ,popu) {

    var theo = (margl*margc/popu);
    var ec = eff-theo;
    var ec=ec*ec;
    var resultat = ec/theo;

    return resultat;

}

// calcul de la probabilité associée au Khi2 (fonction originaire de Trideux - auteur : Philippe Cibois)
function loinorm(ddl,khi) {

    //if (khi < 3) {return 0.001;}

    var co = new Array(5);
    co[1] = 0.3194;
    co[2] = -0.3566;
    co[3] = 1.7815;
    co[4] = -1.8213;
    co[5] = 1.3303;

    var f1=ddl;
    var fis = khi/f1;
    var f2=10000000000;
    var f=fis;

    if(fis < 1) {
        f = 1 / fis;
        var f3 = f1;// interversion
        f1=f2;
        f2=f3;
    }

    var a1 = 2 / (9 * f1);
    var a2 = 2 / (9 * f2);
    var w = (1 - a2) * Math.pow(f,0.33333333) - (1 - a1);

    w = w / Math.sqrt(a1 + a2 * Math.pow(f, 0.666667));

    if(f2 <= 3) {
        w = w * (1 + 0.08 * Math.pow(w,4) / Math.pow(f2,3));
    }

    var y = Math.exp(-w * w / 2) * 0.39894228;

    var t = 1 / (1 + 0.2316419 * Math.abs(w))
    t=parseFloat(t);

    var som=0;

    for (s = 1; s < 6; s++) {
        som += co[s]*Math.pow(t,s);

    }


    var prob = 0.5 + Math.sign(w)*(0.5 - y * som);


    return prob.toFixed(5);



};



function TxtMef(nombre, largeur,caractère) {
    var output = nombre + '';
    while (output.length < largeur) {
        output = caractère + output;
    }
    return output;
}


/// Calcul du PEM LOCAL
function PEMLOC(TOT, MARGI, MARGJ, OBS) {
    THEO = MARGI * MARGJ / TOT;
    ECAR = OBS - THEO;


    var EC = MARGJ - OBS;
    var EA = MARGI - OBS;
    var Mc = TOT - MARGJ;
    var MA = TOT - MARGI;
    var OP = TOT - OBS - EC - EA;
    var TC = MARGJ - THEO;
    var TA = MARGI - THEO;
    var tp = TOT - THEO - TC - TA;
    var PEM=0

    if (THEO < 5 || TC < 5 || TA < 5 || tp < 5) {
        CONT$ = "OUI";} //correction de continuité
    else {
        CONT$ = "NON";
    }



    var de = (MARGJ * MARGI * Mc * MA);

    if (de == 0) {
        k2 = 0;
    }
    else {
        if (CONT$ == "NON") {
            k2 = TOT * Math.pow(OBS * OP - EA * EC,2) / de;
        }

        else {
            if (Math.abs(OBS * OP - EA * EC) > TOT / 2) {k2 = TOT * Math.pow((Math.abs(OBS * OP - EA * EC) - TOT / 2),2) / de;}  //cf. Rouanet, Analyse Inf.Donn‚es:155

            else {k2 = 0;}
        }

    }

    //if (k2<SeuilK2) {k2=0;}

    //if (ECAR <= 0 && SignEcart$ == "POSI") {k2 = -2;}


    if (ECAR > 0) {
        if (MARGJ > MARGI) {
            EMAX = MARGI - THEO;
        }
        else {
            EMAX = MARGJ - THEO;
        }
        PEM = ECAR * 100 / EMAX;
    }

    if (ECAR < 0) {
        CMARGJ = TOT - MARGJ;
        if (CMARGJ > MARGI) {
            EMAX = -THEO}
        else {
            EMAX = MARGI - CMARGJ - THEO;
        }
        PEM = ECAR * 100 / EMAX
        PEM = -PEM
    }



    return [PEM,k2];






}

function t_test(x1, x2) { // test de Student (Welsh) non apparié Trouvé ici : https://rasmusab.github.io/bayes-null-ttest-app/
    var n1 = x1.length;
    var n2 = x2.length;
    mean1 = jStat.mean(x1);
    mean2 = jStat.mean(x2);
    var var1 = Math.pow(jStat.stdev(x1, true), 2);
    var var2 = Math.pow(jStat.stdev(x2, true), 2);
    var sd = Math.sqrt( ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
    var t = (mean1 - mean2) / (sd * Math.sqrt(1 / n1 + 1 / n2));
    var p = jStat.ttest(t, n1 + n2 - 2 +1,1);
    return [mean1 - mean2, t, p];
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


function openInfos() {
    document.getElementById("infostrideux").style.zIndex = "101";
    document.getElementById("infostrideux").style.height = "100%";

}

function closeInfos() {
    document.getElementById("infostrideux").style.height = "0%";
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

function EstMulti(vm,tabmod) { //permet de déterminer si une variable est à choix multiples

    var mo;
    var prescoup = false;
    var delimit = "";
    var ptv =0
    var slh =0
    var bar = 0
    var nbm = Number(tabmod.length)
    var seuil = nbm/2 // le seuil de déclenchement de la var multiple est la moitié du nombre des modalités

    for (mo=1 ;mo<nbm-1;mo++){

        var mx = tabmod[mo];

        //if (isNaN(mx)!=false) {continue;}
        if (mx==mo) {continue;}//évitement des modalités numériques



        var posptv = mx.indexOf(";");
        var posslsh = mx.indexOf("/");
        var posbar = mx.indexOf("|");


        if (posptv  >-1) {ptv++;}
        if (posslsh >-1) {slh++;}
        if (posbar > -1) {bar++}

    }



    //alert("seuil :" + seuil + "ptv : " + ptv + " slh : " + slh + " bar : " + bar )

    if (ptv>seuil || slh > seuil || bar > seuil) {

        if (ptv > slh && ptv > bar) {delimit = ";"}
        if (slh > ptv && slh > bar) {delimit = "/"}
        if (bar > ptv && bar > slh) {delimit = "|"}


        return [true,delimit];

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


function Traitements() {
    document.getElementById("accueil").style.display = "none";

    document.getElementById("cadreboutons").style.display = "block";
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


    if (VarMul[0]==true) {
        document.getElementById('btnEclat').style.display="block"


    }

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
    document.getElementById("processing").style.display="block"
    document.getElementById("lblwait").innerText = message
}

function endWait() { document.getElementById("processing").style.display="none"}
