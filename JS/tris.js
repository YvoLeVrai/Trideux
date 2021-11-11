
////////   ///////////     ///      ///////////
///        ///       //    ///     ///
///        ///       //    ///     ///
///        ///////////     ///      ///////////
///        ///  ///        ///              ///
///        ///   ///       ///              ///
///        ///    ///      ///      //////////



////////////////////////////////////////////////////////////////////////////////////////////////
// Affichage de la base //////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function B_A_S_E() {

 
    wait("Affichage en cours. Merci de patienter ") // affichage de l'indicateur de chargement

    TypTri="base";

    // effacement des tableaux précédents


    if (document.getElementById('ChkHis').checked ==false ) {
        if (EstVu('BlocVar')!=0) {CacheBloc('BlocVar');}
        if (EstVu('BlocVar2')!=0) {CacheBloc('BlocVar2');}

        if ( document.getElementById("TabTAP")) {Vidage("TabTAP")};
        if ( document.getElementById("TabTCR")) {Vidage("TabTCR")};
        if ( document.getElementById("TabBDD")) {Vidage("TabBDD")};
    }


    CaleSsHead() // positionnement sous le header
    PopTot = BDD.length;





    //Création du tableau de résultats
    var body = document.body;
    var nbcols = NbVar-1;

    // Titre

    titre = document.createElement('table');
    titre.id='Titre';
    titre.className= 'TabTitre';
    var lrg = window.innerWidth-80;
    lrg +="px"
    titre.style.width  = lrg; 
    titre.style.marginTop = "15px"

    /*
    titre  = document.createElement('label');
    titre.id='Titre';
    titre.innerHTML = `<div class='titretab' style="margin-left:20px;"> Base : ` + nomBase  + `  ( Nombre de lignes : `+ PopTot + ` ; Nombre de variables : ` + nbcols + `)</div>`
    document.getElementById('contenu').appendChild(titre);
    */

    var tr = titre.insertRow();
    var HCell = document.createElement("th");
    HCell.colSpan=2;
    var Case = `<div class='titretab' id="titrebdd" style="width:100%"> ` + nomBase  + `     
 
    
    <button class="btn btn-outline-primary"  style = "float:right;margin-top:-5px; margin-left:3px; margin-right:5px;display:none" onclick= "AjoutVarCrois()" type="button">Suppr. lignes</button>

    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" style = "margin-top:-5px; width:175px;float:right">
    Créer une variable... 
    </button>

      <div class="dropdown-menu">
      <div class="dropdown-item" onclick= "AjoutVarCrois()" style="cursor:pointer;" > Par croisement </div>
      <div class="dropdown-item"  onclick= "AjoutVarScore()" style="cursor:pointer"> Par score </div>
      <div class="dropdown-item"  onclick= "AjoutVarCalc()" style="cursor:pointer;"> Par calcul </div>
       

      
      </div>`  

      



    Case += ` </div>
    
                <div id="sstitrebdd"> `+ PopTot + ` lignes /  ` + nbcols + ` variables </div>    `

    HCell.innerHTML = Case;
    tr.appendChild(HCell);
    document.getElementById('contenu').appendChild(titre);
    

    // Cases du tableau
    
    tbl  = document.createElement('table');
    tbl.id = 'TabBDD';
    tbl.className= 'TabTri';
    tbl.style.width  = '100%';




    /// entêtes
    var tr = tbl.insertRow();
    var Case;

    Case = "Id";
    var HCell = document.createElement("th");
    HCell.innerHTML = Case;
    tr.appendChild(HCell);



    // défilement des variables pour l'entête
    for (x = 1; x < Number(Nom.length); x++) {


        Case = `<label style = "cursor:pointer;"  onclick="TriBDD(` + x + `)"> ` + Nom[x] + ` <br> ` + Libellé[x] + `</label>`;
        var HCell = document.createElement("th");
        HCell.innerHTML = Case;
        tr.appendChild(HCell);

        //var valmodlig = Number(item.substr(Posi[x]-1,CdMax[x].length));
    }


    // Récupération des valeurs dans la base
    if (FinAff > BDD.length-1) {FinAff = BDD.length-1;}

    var l;
    for (l = DebAff; l < FinAff+1; l++) {

        //filtrage éventuel
        if (EstVu('BlocFiltre')!=0 && Filtrer(l) == false) {if (FinAff<BDD.length-1){FinAff++}; continue;} 
           
            
                var tr = tbl.insertRow();

                // numéro de ligne
                Case = l+1;
                var HCell = document.createElement("th");
                HCell.innerHTML = Case;
                tr.appendChild(HCell);




                // défilement des variables
                for (x = 1; x < Number(Nom.length) ; x++) {

                    var valmoddat = BDD[l][x];
                    var rgl = Reco[x]

                    // application du recodage
                    if (rgl != "") {valmoddat=ValApRec(valmoddat,rgl)}


                    var idC = "casel" + l + "c" + x;
                    Case = `<label id ="` + idC +  `" style = "cursor:pointer;" onclick="modifCase('`+ idC + `',` + l +  `,` + x + `)">`;



                    if (Moda.length > 1 && TypVar[x] == "a") {

                        Case += Moda[x][valmoddat];

                    } else {
                        Case += valmoddat ;
                    }


                    Case += `</label>`

                    var HCell = document.createElement("td");
                    HCell.innerHTML = Case;
                    tr.appendChild(HCell);


                }

        

    };

    document.getElementById('contenu').appendChild(tbl);
    //body.appendChild(tbl);

    Pied  = document.createElement('p');
    Pied.id='Pied';
    var champ = "Population totale";
    Pied.innerHTML = `<div class = 'cadrepied'>  
            <div class="btn btn-primary imgbtn imgleft" id="validbase" style = "float:left; display:block;margin-right:10px" onclick="Lprec()"></div>
            <div style = "float:left;">`+ (DebAff+1) + ` - ` + (FinAff +1) + `</div>
            <div class="btn btn-primary imgbtn imgright" id="validbase" style = "float:left ; display:block;margin-left:10px" onclick="Lsuiv()"></div>
            </div>`;
    //document.body.appendChild(Pied);

    document.getElementById('contenu').appendChild(Pied);

    endWait()

}

function Lprec(){ // lignes précédentes dans la base

    if (DebAff>50) {DebAff = DebAff-50;} else {DebAff=0;}
    FinAff=DebAff+49;
    Vidage('TabBDD');
    B_A_S_E();
}

function Lsuiv(){ // lignes suivantes dans la base
    if (DebAff<(BDD.length-50)) {DebAff = DebAff+50;} else {DebAff=BDD.length-49;}
    FinAff=DebAff+49;
    Vidage('TabBDD');
    B_A_S_E();
}

function modifCase(nomCase,l,c) {


    //mémorsation des coordonnées de la case à modifier
    lCur=l
    cCur=c

    //'détermination de la position de la case à modifier
    var hCase = document.getElementById(nomCase);
    hCase.style.whiteSpace='pre';

    var Pos = hCase.getBoundingClientRect();
    var PosY = Number(Pos.top)-5
    var PosX = Number(Pos.left)
    var PosH = Number(Pos.height)  + 10
    var PosW = Number(Pos.width)
    if (PosW<100){PosW=100}


    var scrlX = window.scrollX;
    var scrlY = window.scrollY;


    var txtmdf = document.getElementById("txtModifCase")
    txtmdf.style.top = PosY + scrlY;
    txtmdf.style.left = PosX + scrlX;
    txtmdf.style.height = PosH;
    txtmdf.style.width = PosW;
    txtmdf.style.fontSize='1rem';
    txtmdf.style.padding= '2px';
    txtmdf.style.position= 'absolute';
    txtmdf.style.zIndex = '100';


    var fnt = hCase.style.fontSize;
    txtmdf.style.font.size  = fnt;

    txtmdf.value = hCase.innerText

    txtmdf.style.display = 'block';
    txtmdf.focus()
    txtmdf.select()

}

/*Rhabillage d'une modalité*/
function MàJCase(event) {
    var key = event.keyCode;



    if (key===13) {



        var nomCase = "casel"+ lCur + "c" + cCur;

        var nvCase = document.getElementById("txtModifCase").value;
        document.getElementById(nomCase).innerText = nvCase

        if (TypVar[cCur]!='a') {

            if (isNaN(nvCase)){
                alert("La valeur saisie ne correspond pas au type de variable (quantitative)")
                return 0
            } else {
                BDD[lCur][cCur] = nvCase;
            }

        } else {

            // la modalité existe-t-elle

            // fonction nécessaire pour déclencher la recherche d'index (findIndex plus bas)
            function ValeurCase(valcase) {
                return valcase == nvCase;
            }

            var idx=Moda[cCur].findIndex(ValeurCase);

            // la modalité a-t-elle déjà été trouvée?
            if (idx<0) {
                // si non,
                Moda[cCur].push(nvCase);
                ModaO[cCur].push(nvCase);
                CdMax[cCur]++;
                BDD[lCur][cCur] = CdMax[cCur];

            } else {

                BDD[lCur][cCur] = idx
            }


        }



        document.getElementById("txtModifCase").style.display='none';
    }

    if (key===27) {
        document.getElementById("txtModifCase").style.display='none';
    }




}



////////////////////////////////////////////////////////////////////////////////////////////////
// TRI A PLAT //////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function prepTAP() {

    TypTri="tap"

    if (EstVu('BlocEXP')!=0) {CacheBloc('BlocEXP');}

    VoirBloc('BlocVar');

    if(vL==0){
        openVars("L");
       // $("#TxtL").focus();
    }



    if (EstVu('BlocVar2')!=0) {CacheBloc('BlocVar2');}
    Vidage("TabBDD","TabTCR",'TabEXP');
    QuelTri();

}

//insertion des non-réponses dans les tris
document.getElementById('ChkNRX').onclick = function() {

    // calage sous le titre
    CaleSsHead()

    QuelTri();


};

function T_A_P() { // Calcule et affiche le tri à plat


    TypTri="tap";

    var x = vL

    if (x<=0) {vL=1; return 0;}
    if (x>=Nom.length) {vL=Nom.length-1; return 0;}


    // ajout de la variable choisie dans la zone de sélection
    var nomtxt= "TxtL";
    var prefix = ""

    if (isNaN(Nom[vL])) {prefix = vL + " | "}
    document.getElementById(nomtxt).placeholder = prefix + Nom[vL] + " | "+ Libellé[vL];
    document.getElementById(nomtxt).focus()


    // effacement du précédent tri à plat
    if (document.getElementById('ChkHis').checked ==false ) {
        if ( document.getElementById("TabTAP")) {Vidage("TabTAP")};
    }

    var rgl = Reco[x] // règle de recodage
    if (document.getElementById("TxtRglG")) {
        rgl = document.getElementById("TxtRglG").value;
    }



    // caractérisation de la variable (conditionne l'affichage ou non du tri à plat)
    if (TypVar[x]=="") {TypVar[x] = QuelTypVar(x);};

    var typv = TypVar[x];



    EnteteVar(x) ;


    // tableau des valeurs
    TapX= new Array (Number(CdMax[x])+1);
    for (i = 0; i < TapX.length; i++) {
        TapX[i]=0;
    }



    // Récupération des valeurs dans la base
    BDD.forEach(LireBDDL);

    function LireBDDL(item, index) {


        var valmod = BDD[index][x] //Number(item.substr(Posi[x]-1,CdMax[x].length));

        var vide=false
        valmod = String(valmod);

        if (valmod == ' ' && typv == "e") {vide=true } // évitement des modalités vides pour les variables numériques

        if (vide==false) {

            valmod = Number(valmod) ;

            // application du recodage
             

            if (rgl.trim() !='') {valmod=ValApRec(valmod,rgl)}

            // prise en compte de la pondération
            var coeffp=1;

            if (vP !=0) {
                coeffp = BDD[index][vP]
            }


            //filtrage
            if (EstVu('BlocFiltre')==0) {TapX[valmod]+= coeffp; }
            else
            {
            if (Filtrer(index) == true) {TapX[valmod]+= coeffp; }
            }

        }


    };

    // arrondi des valeurs après pondération
    if (vP!=0) {
        for (m=0;m<TapX.length;m++){
            var taparr= Math.round(TapX[m])
            TapX[m]=taparr
        }
    }

    // Calcul de la population totale
    var RgDp;
    PopTot=0 ;

    // les non réponses sont-elles incluses?
    NRX = document.getElementById('ChkNRX').checked
    if (NRX == false ) {
        RgDp=1; }
    else {
        RgDp = 0;
    }


    for (j=RgDp;j<TapX.length;j++) {
        PopTot=PopTot + Number(TapX[j]);
    }

    // Recopiage du tableau des modalités
    ModaM = Moda[x].slice()

    if (typv != "r") { // le calcul du tri à plat n'est pas réalisé pour les variables contenant des Réels


        // Recopiage du tableau des modalités
        ModaM = Moda[x].slice()
        var multi=false;

        if (typv != "e") {
            // gestion des variables à choix multiple




            VarMul = EstMulti(x,ModaM);




            if (VarMul[0]==true) {

                multi=true;
                ModaM=[0];
                var TapX2 = [];

                // réécriture du fichier de modalités après split
                for (m=1 ; m < Moda[x].length ; m++){

                    if (Moda[x][m] == "" || Moda[x][m] == m ) {continue}

                    var sstab=Moda[x][m].split(VarMul[1]);

                    for (m2=0;m2<sstab.length;m2++){

                        sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne

                        function ValSousMod(valmod) {
                            return valmod == sstab[m2];
                        }

                        var idx=ModaM.findIndex(ValSousMod);

                        // la modalité a-t-elle déjà été trouvée?
                        if (idx<0) {
                            ModaM.push(sstab[m2]);
                            TapX2[ModaM.length-1] = TapX[m]
                        }
                        else {
                            TapX2[idx] += TapX[m]
                        }

                    }

                }


                TapX=[]
                TapX=TapX2.slice()

            }

        }
    }







    // dessin de l'histogramme (après création de l'entête)
    if (typv != "a" ){Histo('fondHisto', Colonne, Quants,Moy)


        //document.getElementById("LQnt20").addEventListener("mouseover", surligneQnt[3]);

    }

    //Création du tableau de résultats
    var body = document.body
    
    tbl  = document.createElement('table');
    tbl.id = 'TabTAP';
    tbl.className= 'TabTri';
    tbl.style.width  = '1000px';
    tbl.style.marginTop = "15px"


    if (typv != "r" ) { // tente d'afficher le tri à plat de la variable (s'abstient pour les nombres réels)

        // entêtes
        var tr = tbl.insertRow();
        var Case;

        for (j=0;j<4;j++) {


            if (j==0) { Case = `<input type="checkbox" value="1"  id= "ChkAll" onclick = "selallchk()"> <label style="cursor:pointer;" onclick = "triTableau('TabTAP','0', 'val', 'asc')">  Code </label>`};
            if (j==1) { Case = `<label style="cursor:pointer;" onclick = "triTableau('TabTAP','1','txt','asc')"> Libellé </label>`};
            if (j==2) { Case = `<label style="cursor:pointer;" onclick = "triTableau('TabTAP','2', 'val', 'desc')"> Effectifs </label>`};
            if (j==3) { Case = `<label style="cursor:pointer;" onclick = "triTableau('TabTAP','2','val', 'asc')"> Pourcentages </label>`};

            var HCell = document.createElement("th");
            HCell.innerHTML = Case;
            if (VarMul[0]==true) {HCell.style.backgroundColor='#1a3f55';}
            tr.appendChild(HCell);

        }



        //valeurs

        // inclusion ou non des non-réponses
        if (NRX == false ) { RgDp=1; } else { RgDp = 0;}

        for (i = RgDp; i < TapX.length+1; i++) {


            if (TapX[i]>0) {

                var tr = tbl.insertRow();
                var Case;

                for (j=0;j<4;j++) {


                    if (j==0) {

                        if (EstRec(x,i)==true) {Case = `<label style="color:blue; cursor:pointer;font-weight: bold;" > <input type="checkbox" class = "ChkMod" id="ChkModR` + i + `" value="1" onclick = "veilleCHKmod()" style="margin-right : 10px;">` + i +` </label>` ;}

                        else {Case = `<div style="cursor:n-resize" draggable="true" ondrag = "ModO(`+ i + `)"  ondrop="ModA(`+ i + `)" ondragover="allowDrop(event)"> <label style="cursor:pointer"> <input type="checkbox" class = "ChkMod" id="ChkMod` + i + `" value="1"  onclick = "veilleCHKmod()" style="margin-right : 10px;" >` + i +` </label></div>`;}

                    }
                    if (j==1) {

                        var coulPol="black"

                        if (VarMul[0]==true) {coulPol='#1a3f55';}
                        Case = `<label class= 'LibMod' onclick="VoirModas()" style="cursor:pointer;color:`+ coulPol + `;">  `+ ModaM[i] + `</label> <input type="text" class="NvMod" id=mod`+i+ ` value="`+ ModaM[i] + `" onkeydown="MàJMod(event,` + x +`,`+ i + `)">`;

                    }

                    if (j==2) { Case = `<div class= 'effectifs' style="text-align:left;">  `+ TapX[i].toFixed(0) + `</div>`;};

                    if (j==3) {

                        Prct = TapX[i]/PopTot*100;
                        Prct=Prct.toFixed(NbDec);
                        var nomb=  Math.round(Prct);


                        var r = document.querySelector(':root');
                        r.style.setProperty('--pct', nomb);

                        if (VarMul[0]!=true) {
                        Case = `<div  class='Prct' style="width:`+ nomb  + `%;animation: elarg 1s;}">`+Prct+`% </div>  `;
                        } else { 
                        Case = `<div  class='Prct' style="width:`+ nomb  + `%;animation: elarg 1s;background-color:#1a3f55bd;">`+Prct+`% </div>  `;
                        }    

                    };



                    var HCell = document.createElement("td");
                    HCell.innerHTML = Case ;
                    if (j==1){HCell.className="caselib"}
                    tr.appendChild(HCell);



                }

            };
        }



        // TOTAL
        var tr = tbl.insertRow();
        var Case;
        for (j=0;j<4;j++) {



            if (j==0) { if (multi == false) {Case = "TOTAL"; } else {Case = "Effectif";} };
            if (j==1)  {Case = "";}
            if (j==2) { Case = PopTot};
            if (j==3) { Case = "100%"};

            var td = tr.insertCell();
            td.appendChild(document.createTextNode(Case));

            if (j==0) {
                td.setAttribute('column-span', '2');
            }
        }


    }





    //'création du tableau'
    document.getElementById('contenu').appendChild(tbl);


    //désactivation des déplacements et recodages si variable multiple
    if (VarMul[0]==true) {
        document.getElementById('ChkAll').style.display='none'
        var listchk= document.getElementsByClassName("ChkMod")

        for (l=0 ; l<listchk.length;l++) {
            listchk[l].style.display='none';
        }

    }


    Pied  = document.createElement('p');
    Pied.id='Pied';
    var champ = "Population totale";

    if (EstVu("BlocFiltre")==true) {
        champ = ChampFiltre();
    }

    var Rgl = RglRec()
    strPiedPlain = 'Source : ' + nomBase + '\r\n\vChamp : ' + champ + '\r\n';
    strpied = `<div style="margin-left:37px;margin-top:10px;float:left'">Source : `+ nomBase + ` <br> Champ : `+ champ + ` <br> `
    if (vP!=0){
        strPiedPlain = ' Var. Pond. : ' + Libellé[vP] + '\r\n';
        strpied+=` Var. Pond. : ` + Libellé[vP]  + `<br>`
    }
    strpied+=`</div>`

    //Pied.innerHTML = `<div style="margin-left:37px;margin-top:10px;float:left'">Source : `+ nomBase + ` <br> Champ: `+ champ + ` <br> </div>`

    strpied += `<div class = 'cadrepied' style="float:left;width:1000px">`;

    // ajout des flèches d'interverstion
    strpied += `<div id="swap" style="display:none;">
                    <div class="btn btn-outline-primary imgbtn imgup" onclick="PrepInterv('h')"></div>
                    <div class="btn btn-outline-primary imgbtn imgdown" onclick="PrepInterv('b')"></div>
                    </div>`;

    // ajout des fonctions de regroupement
    strpied += `<div id="regroup" style="display:none; width:1000px;">
                      <div class="btn btn-primary" onclick="regrouper()"> Regrouper </div>
                        <label class= "lblrgl" for="TxtssRgl">Règle:</label>
                        <input type="text" id="TxtssRgl" name="TxtssRgl" class ="txtrgl" onkeydown="LancerRgl(event)">
                        <label class= "lblrgl" for="TxtMod">Libellé:</label>
                        <input type="text" id="TxtMod" name="TxtMod" class ="txtrgl" style="width:500px" onkeydown="LancerRgl(event)">
                      </div> `;

    // ajout du bouton dégrouper
    strpied +=  `<div class="btn btn-warning" id="degroup" style="display:none;width:300px;" onclick="degrouper()"> Dégrouper </div>`;




    // clôture du pied
    strpied +=`</div>`
    Pied.innerHTML =strpied;
    document.getElementById('contenu').appendChild(Pied);

    ;


    if (vuDetails==true) {DetailsVar()}


};


function EnteteVar(x) {
    //Création du tableau de résultats
    var body = document.body

    // Titre
    titre  = document.createElement('table');
    titre.id='Titre';
    titre.className= 'TabTitre';
    titre.style.width  = '1000px';
    titre.style.marginTop = "15px"

    var tr = titre.insertRow();
    var HCell = document.createElement("th");
    HCell.colSpan=2;
    var Case = `<div id= 'ligneNom' class='titretab'>` + Nom[x] + ` | ` + Libellé[x]

    //Case += `<button  class="btn btn-outline-primary btn-sm imgbtn imgright" onclick="vL++;QuelTri()" type="button" style="float:right";></button>`
    // ajout du bouton copier

    Case += `<button id = "BtnPlusVar" class="btn btn-outline-primary btn-sm imgbtn imgplus"  onclick= "DetailsVar()" type="button" style="float:right";  ></button>`
    Case += `<button id = "BtnMoinsVar" class="btn btn-outline-primary btn-sm imgbtn imgminus"  onclick= "CacheDetails()" type="button" style="float:right;display:none";  ></button>`

    Case +=  ` <div class="btn btn-outline-primary btn-sm imgbtn imgcopy" onclick="CopieTAP()" style="float:right;margin-right:3px;" ></div>`;


    Case +=` <button  class="btn btn-outline-primary btn-sm imgbtn imgright" onclick="vL++;QuelTri()" type="button" style="float:right;margin-right:3px;"></button> `
    Case +=` <button  class="btn btn-outline-primary btn-sm imgbtn imgleft" onclick="vL--;QuelTri()" type="button" style="float:right;"></button> `

    Case += ` </div>`

    HCell.innerHTML = Case;
    tr.appendChild(HCell);

    var tr = titre.insertRow();
    var HCell = document.createElement("td");
    HCell.colSpan=2;

    // définition du type de variable en toutes lettres
    var estSel1="selected"
    var estSel2=""



    if (TypVar[x] == 'e' || TypVar[x] == 'r') {estSel1="";estSel2="selected"}

    var Case = `<div id="LigneVar" style="display:none">

                                <div style="float: left;
                                border: 0px solid rgb(206, 206, 206);;
                                border-radius: 4px;
                                width:100%;

                                ">


                                  <button class="btn btn-outline-secondary"  style = "float:left;margin:3px; margin-right:5px;" onclick= "SupprCol(`+ vL + `)" type="button">Supprimer</button>

                                  <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" style = "margin:3px;width:150px;float:left;">
                                  Recopier...
                                  </button>

                                    <div class="dropdown-menu">
                                    <div class="dropdown-item"  onclick= "dupliCol(`+ vL + `,` + (vL + 1) + `,false)">à l'identique </div>
                                    <div class="dropdown-item" onclick= "dupliCol(`+ vL + `,` + (vL + 1) + `,true)" >après recodages </div>

                                    </div>   `




    Case +=`<button id = "btnEclat" class="btn btn-outline-secondary"  style = "float:right;margin:3px; margin-right:5px;display:none" onclick= "Eclater(`+ vL + `)" type="button">Eclater</button>`







    Case +=`</div>
                                </div>
                    </div> `


    HCell.innerHTML = Case;
    tr.appendChild(HCell);


    // ligne de modification
    var tr = titre.insertRow();
    var HCell = document.createElement("td");
    HCell.style.backgroundColor = 'white';

    Case = ` <div id="modifVar" style="display:none; "> <p class='titretab' style="font-weight:bold; color:rgb(183,183,200)"> Modifier </p>

                    <div id="RenomVar" class="input-group-prepend" style="margin-top:7px;">

                        <span class="input-group-text">Nom :</span>
                        <input id= "TxtNom" type="text" class="form-control" value=` + Nom[x] + ` style="width:90px;" onkeyup="LancerRecod(event)">


                        <span class="input-group-text">Libellé :</span>
                        <input id= "TxtLib" type="text" class="form-control" value=` + Libellé[x] + ` onkeyup="LancerRecod(event)">`

    Case += `</div>





                    <div class="input-group-prepend" style="margin-top:15px;">
                    <span class="input-group-text">Recodages:</span>
                    <input id= "TxtRglG" type="text" class="form-control" placeholder="exemple : 1-3=1/5=2/4,6-8=3"  onkeyup ="TestRglG(event)" value=` + Reco[x] + `>`

    if (TypVar[x]!="a") {

        Case += `<div class="btn-group">

                    <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">
                    classes
                    </button>

                      <div class="dropdown-menu">
                      <a class="dropdown-item" href="#" onclick="MiseEnClasses('c5')">Classes de 5 [0;4][5;9]...</a>
                      <a class="dropdown-item" href="#" onclick="MiseEnClasses('c10')">Classes de 10 [0;9][10;19]...</a>
                      <a class="dropdown-item" href="#" onclick="MiseEnClasses('cx')">Classes de x [0;x]...</a>
                      <a class="dropdown-item" href="#" onclick="MiseEnClasses('n')">n classes </a>
                      </div> `


        if (Reco[x].trim() != ''){
            Case += `<button class="btn btn-warning imgbtn imgtrash"  style = "float:left;height:38px;width:38px" onclick= "SuppRecod(`+ vL + `)" type="button"></button></div>`
        } else {Case += `</div>`}


    } else {

        if (Reco[x].trim() != ''){Case += `<button class="btn btn-warning imgbtn imgtrash"  style = "float:left;height:38px;width:38px" onclick= "SuppRecod(`+ vL + `)" type="button"></button>`
        }

    }


    Case += `</div>`

    Case +=`<div class="input-group-prepend" style="margin-top:15px;width:400px">
                          <span class="input-group-text">Type :</span>
                          <select id="CmbTypVar" class="custom-select" onchange="ChgTypVar()" style="width:135px">
                          <option value="a" ` + estSel1 + `>Qualitative</option>
                          <option value="n" ` + estSel2 + ` >Quantitative</option>

                          </select>
                        </div>`





    Case += `<br><button class="btn btn-outline-primary"  onclick= "ValidModifVar()" type="button" style="float:right;margin-top:-60px;">Valider </button>`










    Case += `</div>`



    HCell.innerHTML = Case;
    HCell.colSpan=2;
    tr.appendChild(HCell);








    var tr = titre.insertRow();

    var Case = ` <div id="LigneModas" style="display:none"> `

    if (TypVar[x] =='a') {// gestion des modalités

        Case += ` <p class='titretab' style="font-weight:bold; color:rgb(183,183,200)"> Modalités </p>

          <div style="float: left;
          margin-left:0px;
          border: 0px solid rgb(206, 206, 206);;
          border-radius: 4px;
          height: 40px;
          margin-right:5px;
          "> `



        Case += `

              <div class="input-group-prepend" style="margin-top:9px;width:690px;float:left;">
                    <span class="input-group-text">Filtrer:</span>
                    <input id= "TxtChrMod" type="text" class="form-control" placeholder="Rechecher un libellé"  onkeyup ="FiltrerModas(event)" >

              </div>

              <div class="btn-group" style="float:right">


                <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" style = "margin-top:9px;margin-left:5px;"  style="float:left;">
                Trier les modalités par...
                </button>

                <div class="dropdown-menu">
                <a class="dropdown-item" href="#" onclick="TriGnrModas(1,'c')">libellés     - + </a>
                <a class="dropdown-item" href="#" onclick="TriGnrModas(1,'d')">libellés     + - </a>
                <a class="dropdown-item" href="#" onclick="TriGnrModas(2,'c')">effectifs    - +</a>
                <a class="dropdown-item" href="#" onclick="TriGnrModas(2,'d')">effectifs    + -</a>
                </div>

                <button type="button" class="btn btn-outline-primary imgbtn imgcopy" style = "margin-top:9px; height:40px"  style="float:left;background-repeat: no-repeat;"  onclick="PrepCopie(` + vL + `)">
                </button>

                <button type="button" class="btn btn-outline-primary imgbtn  imgpaste" style = "margin-top:9px; height:40px"; "  style="float:left;background-repeat: no-repeat;" onclick="CollMods(` + vL + `)">
                </button>






                </div>`
    }

    Case +=`</div>`









    /*
            <select id="CmbTypVar" class="custom-select" style="width:160px;margin-left:-6px;margin-top:7px;margin-right: 15px; font-size:0.75rem;text-align:center">
            <option value="c" selected >Ordre croissant</option>
            <option value="d" >Ordre décroissant</option>

            </select>
        */


    var HCell = document.createElement("td");
    HCell.colSpan=2;
    HCell.innerHTML = Case;
    HCell.style.backgroundColor = 'white';


    tr.appendChild(HCell);


    var typv= TypVar[x]

    // Statistiques de tendance centrale et de dispersion
    if (typv !='a') {



        // Création du canva pour le graphique

        var tr = titre.insertRow();

        var Case = `<canvas id="fondHisto" width="1000" height="500" style="border: 1px solid #333;" onmousemove = "survHisto(event)" onmouseleave = "Histo('fondHisto', Colonne, Quants, Moy)"  ></canvas>`

        var HCell = document.createElement("td");
        HCell.colSpan=2;
        HCell.innerHTML = Case;
        tr.appendChild(HCell);


        // les non réponses sont-elles incluses?
        NRC = document.getElementById('ChkNRX').checked
            

        Colonne = ExtractCol(x,NRC,0,0);
        TriParTas (Colonne);





        var nblig = Colonne.length
        var nbmiss = BDD.length - Colonne.length
        Moy=  Moyenne(Colonne);

        Quants = Quantiles(Colonne)

        var med = Quants[3];
        var ect = EcartType(Colonne, Moy)



        for (i=0;i<9;i++) {
            var tr = titre.insertRow();


            for (j=0;j<2;j++) {

                Case= "";


                if (j==0) {
                    if (i==0) {Case = "Nombre de valeurs :" + "<br>"}
                    if (i==1) {Case += "Valeurs manquantes :"  + "<br>"}
                    if (i==2) {Case += "Moyenne :" + "<br>"}
                    if (i==3) {Case += "Ec.Typ. :"}
                    if (i==4) {Case += "Min :"+ "<br>"}
                    if (i==5) {Case += "Q1 :"+ "<br>"}
                    if (i==6) {Case += "Médiane. :"+ "<br>"}
                    if (i==7) {Case += "Q3 :"+ "<br>"}
                    if (i==8) {Case += "Max :"+ "<br>"}
                    var nomcase="LQnt" + i + j
                }
                if (j==1) {
                    if (i==0) {Case = nblig + "<br>"}
                    if (i==1) {Case += nbmiss + "<br>"}
                    if (i==2) {Case += Moy + "<br>"}
                    if (i==3) {Case += ect + "<br>"}
                    if (i==4) {Case += Colonne[0] + "<br>"}
                    if (i==5) {Case += Quants[2]; + "<br>"}
                    if (i==6) {Case += Quants[3]; + "<br>"}
                    if (i==7) {Case += Quants[4]; + "<br>"}
                    if (i==8) {Case += Colonne[Colonne.length-1] + "<br>"}
                    var nomcase="LQnt" + i + j
                }


                var HCell = document.createElement("td");
                HCell.id= nomcase;
                HCell.innerHTML = Case;

                tr.appendChild(HCell);

            }
        }

        // histogramme

        // saut de ligne

        var tr = titre.insertRow();
        var HCell = document.createElement("th");
        HCell.colSpan=2;
        HCell.innerHTML = "";
        tr.appendChild(HCell);





    }


    document.getElementById('contenu').appendChild(titre);




}


function PrepCopie(v) {
    vCopy=v;
    document.getElementById('btncoller').style.enabled =true;

    document.getElementById('TxtL').focus()

}

// copie/colle l'ordre des modalités d'une variable sur une autre

function CollMods(vColle) {


    if (vCopy==0) { return 0}

    if (Moda[vCopy].length!=Moda[vColle].length) { alert("Les deux variables n'ont pas le même nombre de modalités"); return 0}
    var TabInterv = new Array(Moda[vColle].length)

    // boucle sur la variable
    for (m1=0;m1<Moda[vColle].length;m1++){
        TabInterv[m1] =0

        // boucle sur la variable
        for (m2=0;m2<Moda[vCopy].length;m2++){

            if (m1!=m2 && Moda[vColle][m1] == Moda[vCopy][m2]) {

                TabInterv[m1] = m2;

            }


        }

    }

    // interversions
    for (m1=0;m1<TabInterv.length;m1++){

        var m2=TabInterv[m1]

        Number(m2);
        if (m2!=0) {

            // transformation du dictionnaire
            Moda[vColle][m2]=Moda[vCopy][m2]


        }
    }

    // transformation des valeurs dans la base

    for (l=0;l<BDD.length;l++) {

        var modl = BDD[l][vColle]
        Number(modl);
        if (TabInterv[modl] !=0) {

            BDD[l][vColle] = TabInterv[modl]

        }




    }










    T_A_P();

}


function CopieTAP(){


    var tabPlain = Libellé[vL] + '\r\n';
    tabPlain += 'Libellé\tEffectif\t%\r\n';
    var tabhtml =`<h3> ` + Libellé[vL] + `</h3>
              <table style="width:100%;">
              <tr style="background-color: #3b8dbd;color:'white'; ">
                <th >Libellé</th>
                <th>Effectif</th>
                <th>%</th>
              </tr> `



    var rgstart=0

    // les non réponses sont-elles incluses?
    NRX = document.getElementById('ChkNRX').checked
    if (NRX == false ) {rgstart=1}

    for (m=rgstart ; m<TapX.length;m++){

        if (TapX[m]>0) {

            Prct = TapX[m]/PopTot*100;
            Prct=Prct.toFixed(NbDec);
            Prct=Prct.replace( ".",",")

            tabPlain += ModaM[m] + '\t' + TapX[m] +'\t' + Prct + '\r\n';
            tabhtml += (m%2)? '<tr style="background-color: #f2f2f2;">':'<tr>'
            tabhtml += `
                <td > ` + ModaM[m] + `</th>
                <td > ` + TapX[m] + `</th>
                <td > ` + Prct  + `</th>
              </tr>  `
        }
    }

    tabPlain += 'Total\t' + PopTot +'\t100\r\n\r\n';
    tabhtml += `<tr>
                <td > Total</th>
                <td > ` + PopTot + `</th>
                <td > 100 </th>
              </tr>  `


    tabhtml += `</table>`


    // ajout du pied


    tabPlain += strPiedPlain;
    tabhtml += strPiedPlain;


    CopiePressePapier(tabhtml, tabPlain);

    alert("Le tri à plat a été copié. ")
}

function CopiePressePapier (tabRich, tabPlain) {
    function listener(e) {
        e.clipboardData.setData("text/html", tabRich);
        e.clipboardData.setData("text/plain", tabPlain);
        e.preventDefault();
    }

    document.addEventListener("copy", listener);
    document.execCommand('copy');
}

function ImgCopie(){
    el = document.getElementById('contenu')
    el.select();

    document.execCommand('copy');
    document.body.removeChild(el);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORATEUR  //////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function prepEXP(){

    TypTri="exp"

    Vidage('TabBDD','TabTAP','TabTCR');
    
    CacheBloc('BlocFiltre') 


    VoirBloc('BlocEXP');

    if (EstVu('BlocVar')!=0) {CacheBloc('BlocVar');}
    if (EstVu('BlocVar2')!=0) {CacheBloc('BlocVar2');}

    ExpRgDp = 0;

    CaleSsHead()

    openVars("X");
};


function openVars(typevar) {

    FLCXR=typevar; // mémorisation de l'origine de la demande

openFrmvar()

    //var nomctrl= "Txt" + FLCXR

// placement de la barre de recherche
    /*var Bout = document.getElementById(nomctrl);
    var BoutPos = Bout.getBoundingClientRect();
    var PosY = BoutPos.top
    var ht = window.innerHeight;
    var lt = window.innerWidth - 35;
    lt+="px";*/
    //document.getElementById("headervar").style.width = lt;

    /*var h = ht-PosY ;
    String(h);
    h +="px";*/
    //document.getElementById('ListeVariables').style.top=PosY;
    //document.getElementById('ListeVariables').style.height=h;


    //document.getElementById("ListeVariables").style.display = "";
//document.getElementById("ListeVariables").style.height = "100%";
    //document.getElementById("headervar").style.display = "";
    //document.getElementById("TxtChercher").value = "";
    //document.getElementById("TxtChercher").focus();

    // Yvo 
    /*
    $(".selectHide").addClass("d-none");
    $("#ListeVariables").collapse('show');
    $(".bi-caret-up-fill").removeClass("d-none");
    // fin
    */
   
    //FiltrerVars()
};

function closeVars() {
     

    document.getElementById("headervar").style.display = "none";
    document.getElementById("ListeVariables").style.height = "0%";
    document.getElementById("ListeVariables").style.display = "none";
    document.getElementById("TxtVr").value='';
    ChargerListVar()
    
    //document.getElementById("ListeVariables").style.height = "0%";
    //document.getElementById("headervar").style.display = "none";
    
    // Yvo 
    /*
    $(".picthb").val('');
    $(".selectHide").removeClass("d-none");
    $(".list-group-item").removeClass("d-none");
    $("#ListeVariables").removeClass("show");
    $(".bi-caret-up-fill").addClass("d-none");
    */
};

function FiltrerVars(event) {
    
    var nbli=0;
    var lastli=0;
    var key = event.keyCode;

    

if (key==27){ // sortie par échap
closeVars()
var nomtxt= "Txt"+FLCXR
document.getElementById(nomtxt).focus()
return 0;
}
 

    var filter, ul, a, i, txtValue;
    //console.log(event.currentTarget.value);
    filter = event.currentTarget.value.toUpperCase();
    ul = document.getElementById("ListeVariables");
    a = ul.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {

            a[i].classList.remove("d-none");
            
            // comportement en cas d'affichage en colonne
            if (enlig!=true) {a[i].style.color = "rgb(0,0,0)";}
            nbli++;
            lastli=i;

        } else {
            // comportement en cas d'affichage en colonne
            if (enlig!=true) {a[i].style.color = "rgb(230,230,230)"; }
            else {
            a[i].classList.add("d-none");
            }

        }
    }




    if (nbli==1) {
        //a[lastli].style.backgroundColor = "rgb(103, 148, 189)";
        a[lastli].classList.add("active");
        var key = event.keyCode;
        if (key==13){
            SelVar(lastli+1)
        };
    }
}

function FiltrerModas(event) {



    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("TxtChrMod");
    filter = input.value.toUpperCase();
    ul = document.getElementById("TabTAP");
    li = ul.getElementsByTagName("tr");
    for (i = 1; i < li.length; i++) {
        a = li[i].getElementsByClassName("caselib")[0];
        txtValue = a.textContent || a.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }




}



function SuppDesc(x,fonction) {

    if (x==0) {
        Vidage('TabEXP')
        return ;}

         

    //'analyse de toutes les lignes qui sont placées à la suite '
    for (i= ExpMum.length; i>x; i--) {

        // la ligne descend-elle de la même que la ligne sélectionnée
        if (DescDeV(x,i)==true) {

            ExpVar.splice(i,1);
            ExpMod.splice(i,1);
            ExpLib.splice(i,1);
            ExpEff.splice(i,1);
            ExpPct.splice(i,1);
            ExpPctT.splice(i,1);
            ExpMum.splice(i,1);
            ExpRng.splice(i,1);




        }



    }


    //suppression de la ligne où a eu lieu de clic

    ExpVar.splice(x,1);
    ExpMod.splice(x,1);
    ExpLib.splice(x,1);
    ExpEff.splice(x,1);
    ExpPct.splice(x,1);
    ExpPctT.splice(x,1);
    ExpMum.splice(x,1);
    ExpRng.splice(x,1);


     AffE_X_P(fonction)

};

function DescDeV(x,i) { // recherche les modalités descendant d'une ligne de variable
 
    
    // boucle sur la parenté
    var Rgm = ExpMum[i];

    while (Rgm > 0) {

        if (Rgm== ExpMum[x]) {return true};

        Rgm = ExpMum[Rgm];
         
    };

}

function DescDeM(x,i) { // recherche les modalités descendant d'une ligne de variable
 
    
    // boucle sur la parenté
    var Rgm = ExpMum[i];

    while (Rgm > 0) {

        if (Rgm==x) {return true};

        Rgm = ExpMum[Rgm];
         
    };

}


function SelVar(rang) {


    //var (document.getElementById(rang).innerText);
    //décalage du contenu vers le bas
    //document.getElementById('contenu').style.marginTop = document.getElementById('hautpage').offsetHeight + 30

    closeVars();

    // ajout de la variable choisie dans la zone de sélection
    var prefix = ""

    if (isNaN(Nom[rang])) {prefix = rang + " | "}

    var nomtxt= "Txt"+FLCXR
    
    if (FLCXR=='X' && ExpRgDp==0) {document.getElementById(nomtxt).placeholder = prefix+ Nom[rang] + " | "+ Libellé[rang];}
    if (FLCXR!='X') {document.getElementById(nomtxt).placeholder = prefix +  Nom[rang] + " | "+ Libellé[rang];document.getElementById(nomtxt).focus()}



    if (FLCXR=="X") { // en cas de variable pour l'explorateur

        vX = rang;  // variable courante de l'exploration
        E_X_P(vX,ExpRgDp);


    }

    if (FLCXR=="L") { // en cas de variable pour ligne

        vL = rang; // variable courante en ligne
        QuelTri()

    }

    if (FLCXR=="C") { // en cas de variable pour colonne

        vC = rang; // variable courante en colonnes
        QuelTri()

    }

    if (FLCXR=="P") { // en cas de variable de pondération

        if (TypVar[rang] =='a'){
            alert("La variable " + Nom[rang] + " - " + Libellé[rang] + " est qualitative. \n Elle ne peut pas servir de variable de pondération.")
            vP=0;
            return 0
        }

        vP = rang; // variable courante de pondération
        QuelTri()

    }

    if (FLCXR=="F") { // en cas de variable pour filtre

        vF = rang; // variable courante du filtre

        E_X_P(vF,ExpRgDp,"filtre");


        //ChargerFiltre();

    }


    if (FLCXR=="LD") { // en cas de variable pour création de variable par croisement

        vLd = rang; // variable courante du filtre
         
        if (vCd!=0) {TabRecCrois(vLd, vCd)}


    }

    if (FLCXR=="CD") { // en cas de variable pour création de variable par croisement
        
        vCd = rang; // variable courante du filtre
         
        if (vLd!=0) {TabRecCrois(vLd, vCd)}

    }


    if (FLCXR=="LS") { // en cas de variable pour création de variable score

        vS = rang; // variable courante du filtre
         
        if (vS!=0) {ModasScore(vS)}


    }


};



function SousTri(x, fonction) {


    ExpRgDp = x

    if (fonction=="filtre") {

    openVars('F')

    } else {

    openVars('X')
    
}


};

function E_X_P(x,RgDp,fonction) {



    if (fonction!="filtre"){TypTri="exp"};

// cette fonction a pour objet de retrouver les effectifs d'une modalité donnée en remontant son ascendance

    if (x==0) {return 0;}

    // inclusion ou non des non-réponses

    // tableau des valeurs
    TapX= new Array (Number(CdMax[x])+1);
    for (i = 0; i < TapX.length; i++) {
        TapX[i]=0;
    }

    var rgl = Reco[x] // règle de recodage

// 1- Tri à plat de la variable

// remise à zéro en cas de tri racine
    if (RgDp == 0){

        ExpVar =[]; // variable
        ExpMod =[]; // modalité
        ExpLib =[]; // libellé
        ExpEff =[]; // effectifs
        ExpPct =[]; // pourcentage au niveau
        ExpPctT = []; // pourcentage du total
        ExpMum = []; // 'mère de la moda'
        ExpRng = [];// rang
        ExpAct=[]; // actif ou non

        // calcul de la population totale
        PopTot = BDD.length;

    };




// recherche de la valeur de la modalité
    // défilement des lignes

// Récupération des valeurs dans la base
    BDD.forEach(LireBDDX);

    function LireBDDX(item, index) {


        // extraction de la valeur locale pour la variable choisie
        var valmod = Number(BDD[index][x]);

        // application du recodage
        if (rgl.trim() !='') {valmod=ValApRec(valmod,rgl)}
        

        var filtré = false
        nbmum = 0;



        //boucle sur les valeurs de modalité des mères
        if (RgDp > 0) { // s'il y a une mère !
            nbmum = 1;
            var Rgm = RgDp;

            //alert("le rg de la modalité mère au niveau " + nbmum + "est " + Rgm  + "  la variable est la numéro " + ExpVar[Rgm] +  ")   Modalité : " + Moda[ExpVar[Rgm]][ExpMod[Rgm]])

            while (Rgm > 0) {

                var vm = ExpVar[Rgm]; // variable de la mère


                // analyse de la réponse
                // extraction de la valeur locale pour la variable choisie
                var valmodmum = Number(BDD[index][vm]);

                // application du recodage
                var rgl2 = Reco[vm] // règle de recodage
                if (rgl2.trim() !='') {valmodmum=ValApRec(valmodmum,rgl)}
                 

                //alert("la valeur de la modalité trouvée dans la base pour la variable mère est " + valmodmum  + ". La variable de filtre est  " + ExpMod[Rgm] );

                if (valmodmum != ExpMod[Rgm]){// si différente de la valeur de la mère, sortie
                    filtré=true
                    //break;
                }


                Rgm = ExpMum[Rgm];
                if (Rgm==0){break};

                nbmum++;


            };


        }
        // si valeurs pour les modalités des mères correspondent à celles de la ligne

        // Ajout au tableau de tri à plat
                    
                 // prise en compte de la pondération
                var coeffp=1;

                if (vP !=0) {
                    coeffp = BDD[index][vP]
                }



        if (filtré==false) {TapX[valmod]+= coeffp};

    };


        // arrondi des valeurs après pondération
        if (vP!=0) {
            for (m=0;m<TapX.length;m++){
                var taparr= Math.round(TapX[m])
                TapX[m]=taparr
            }
        }


    // Calcul du total de la sous population

    var SousPop=0 ;
     // les non réponses sont-elles incluses?
     NRE = document.getElementById('ChkNRE').checked
      
     if (NRE == false ) {
         RgDpE=1; }
     else {
         RgDpE = 0;
     }


    for (j=RgDpE;j<TapX.length;j++) {
        SousPop=SousPop + Number(TapX[j]);
    }

    if (SousPop>PopTot) {PopTot=SousPop} // corrige la population totale en cas de pondération


    // défilement des modalités supérieures à zéro
    var nbmodaj =0;
    var Rg= RgDp +1;

    // Création de la ligne pour la variable
    ExpVar.splice(Rg,0,x);
    ExpMod.splice(Rg,0,'var');
    ExpLib.splice(Rg,0,Libellé[x]);
    ExpEff.splice(Rg,0,0);
    ExpPct.splice(Rg,0,0);
    ExpPctT.splice(Rg,0,0);
    ExpMum.splice(Rg,0,ExpRgDp);
    ExpRng.splice(Rg,0, nbmum);
    ExpAct.splice(Rg,0, 1);

     
    for (i = RgDpE; i < TapX.length+1; i++) {

        //if (TapX[0]==0) {break;}

        if (TapX[i]>0) {
            nbmodaj++;
            Rg++;


            // ajout des lignes correspondantes fonction splice(index de départ, nombre d'items effacés, valeur à ajouter)
            // et ce dans tous les tableaux (var mod lib eff prct )...

            ExpVar.splice(Rg,0,x);
            ExpMod.splice(Rg,0,i);
            ExpLib.splice(Rg,0,Moda[x][i]);
            ExpEff.splice(Rg,0,TapX[i]);
            ExpPct.splice(Rg,0,TapX[i]/PopTot);
            ExpPctT.splice(Rg,0,TapX[i]/PopTot);
            ExpMum.splice(Rg,0,ExpRgDp);
            ExpRng.splice(Rg,0, nbmum);
            ExpAct.splice(Rg,0, 1);

        };

    }



    // affichage des résultats
    /*
var tbl = "";
for (i = 0; i < ExpVar.length; i++) {
tbl=tbl+ ExpVar[i] + "|";
tbl=tbl+ ExpMod[i]+ "|";
tbl=tbl+ ExpLib[i]+ "|";
tbl=tbl+ ExpEff[i]+ "| niveau";
tbl=tbl+ ExpRng[i];

tbl=tbl+ "\n";
};
*/



    AffE_X_P(fonction);


};



function AffE_X_P(fonction) {
 

    Vidage('TabEXP','TabFIL');

    //if (RgDp ==0) { // s'il n'y a pas de tableau courant




    var l=0; // mémorisation de l'index des lignes

    // Création d'un tableau reprenant le contenu du tableau Exp
    //Création du tableau de résultats
    var body = document.body
    
    if (fonction=="filtre") {
    body = document.getElementById('BlocFiltre')
    }  

    // Titre
    titre  = document.createElement('p');
    titre.id='Titre';
    titre.innerHTML = "";



    document.body.appendChild(titre);


    tbl  = document.createElement('table');
    tbl.id = 'TabEXP';

    if (fonction=="filtre") {
        tbl.id = 'TabFIL';
        tbl.style.marginLeft='3px';
        tbl.style.width='99%';

    } else {
    tbl.className= 'TabTri';
    
    }

    
    //  };




    // for (i = RgDp+1; i < RgDp + nm+1; i++) {
    for (i =0; i < ExpVar.length; i++) {


        var tr = tbl.insertRow(i);
        var Case;


        // Création des classes pour l'affichage
        var rng =   ExpRng[i] ;
        if (rng=="undefined") {rng=0;}

        var balise =`rg` + rng  ;
        var divlgn ="";
        for (r=0;r<ExpRng[i];r++){
            divlgn +=  `
            <div  style="margin-left:20px;width:2px;height:30px;padding-top:-5px;float:left;border-left:1px dotted #646262;"> </div>
            <div style="width:20px;height:15px;padding-top:-5px;float:left;border-bottom:1px hidden #646262;"> </div>
            `  ;

        }

         

        var baliseV= ``; // `rg` + rng  ;


        var caseCoch = "";
        
        if (ExpAct[i]==true){caseCoch="checked"}

        if (ExpMod[i] == "var") {

            var tr = tbl.insertRow(i);
            var HCell = document.createElement("td");
            var CaseV  = `
  
            <div class="  ` + baliseV + `">
            
            
                <div class="livar"> ` + divlgn + ` 
                <div  style="width:2px;height:15px;padding-top:-5px;float:left;border-left:1px dotted #646262;"> </div>
                <div style="width:20px;height:15px;padding-top:-5px;float:left;border-bottom:1px dotted #646262;"> </div>`

                if (fonction == "filtre") {
                    CaseV += `<input type="checkbox" `+ caseCoch +` class= "chkexp" id="ChkExpl` + i + `" value="1" onclick="seltronc(`+ i + `);selbranches(`+ (i-1) + `,true);defFiltre(); " >`
                }

                CaseV+=  `| ` + Nom[ExpVar[i]] + "| " + Libellé[ExpVar[i]] + `
                
                </div>
           
            
                <button type="button" class="btn btn-outline-alarm btn-sm imgbtn imgclose" style="font-size: 0.45em;float: right;margin-right: 3px;margin-top:0px;"  onclick= "SuppDesc('` + i + `','`+ fonction + `')"></button>
            </div> 
             `; 
            HCell.innerHTML = CaseV;
            tr.appendChild(HCell);

            //<button class="btn btn-outline-secondary btn-sm" onclick= "SuppDesc('` + i + `')" type="button" style="float:right;margin-left:-30px;">X</button>
        } else {

            //ajout de la ligne  de modalité
            var tr = tbl.insertRow(i);
            // =  `<tr onclick = "SousTri(this)">`;

            
            Prct = ExpPct[i]*100;
            Prct= Prct.toFixed(NbDec);

            var larfond = 1200; // largeur fixe (par défaut, de la fenêtre d'exploration)
                        
            if (fonction=="filtre") {
                larfond = document.getElementById('BlocFiltre').offsetWidth
            }  

            

            var lardisp= larfond - (ExpRng[i]+1) *45 - 60;
            var Prctaff = Prct*lardisp/larfond
             
            var nomb= Math.round(Prctaff);
            
            var r = document.querySelector(':root');
            r.style.setProperty('--pct', nomb);

            var rg = (i+1);

           // ajout du Prct%
            var prg ="";

            if (ExpMum[i]==ExpRgDp) {prg=`animation: elarg 1s;`}

 
            Case = `<div  style="height:30px;width:100%" > ` + divlgn + `            
            
            <div  style="margin-left:20px;width:2px;height:30px;padding-top:-5px;float:left;border-left:1px dotted #646262;"> </div>
            <div style="width:20px;height:15px;padding-top:-5px;float:left;border-bottom:1px dotted #646262;"> </div>`

            if (fonction == "filtre") {
                Case += `<input type="checkbox"  `+ caseCoch +` class= "chkexp" id="ChkExpl` + i + `" value="1" onclick="seltronc(`+ i + `);selbranches(`+ i + `,false);defFiltre(); " >`
            }

            Case += `<div onclick = "SousTri(`+ l + `,'` + fonction + `')"> 
            <div  class="PrctExp ` + balise + ` " style="height:30px;position:absolute;cursor:pointer;width:`+ nomb  + `%;` + prg + `"></div>
            <div  class="` + balise + `" style="padding-top:5px;height:30px;position:absolute;padding-left:10px;cursor:pointer;">`+  ExpLib[i] + `  </div>   
            </div> `

            if (fonction != "filtre") {
            Case += `<div   style="padding-top:5px;height:30px;position:absolute;left:80%;width:15%;text-align:right;cursor:pointer;" onclick=solo(`+ i +`)>`+  ExpEff[i] + ` </div>
            <div   style="padding-top:5px;height:30px;position:absolute;left:95%;width:5%;text-align:right;cursor:pointer;">`+    Prct+` % </div> `     
            } else {
                Case += `<button class="btn btn-outline-secondary btn-sm imgbtn imgfltr flchbout"  onclick= "onclick=solo(`+ i +`)" type="button" style="float:right;opacity:0.25;"  ></button>
                `
            }

        
            Case += `</div> `;



            var HCell = document.createElement("td");
            HCell.style.height='40px';
            HCell.innerHTML = Case ;
            tr.appendChild(HCell);

        };

        l++;  // incrémentation des lignes
    }



    body.appendChild(tbl);

    Pied  = document.createElement('p');
    Pied.id='Pied';
    Pied.innerHTML = "";
    document.body.appendChild(Pied);








};

// Fonctions de filtrage dans l'explorateur 
function selbranches(rg,etqv) {
 
    
    var nomchk = "ChkExpl" + rg;
    if (etqv==true) {nomchk = "ChkExpl" + (rg + 1);}


    var bool=false;
    if (document.getElementById(nomchk).checked==true) {
    bool=true;
    } else {
    bool=false;    
    }

    var dp=rg+1
    if (etqv==true) {dp++}

    for (l=dp;l<ExpVar.length+1;l++) {
            
        if (DescDeV(rg+1,l)==true && etqv==true || DescDeM(rg,l)==true && etqv==false && ExpRng[rg]!= ExpRng[l]) {
            var nomchk = "ChkExpl" + l;
            
            if (document.getElementById(nomchk)){
                document.getElementById(nomchk).checked =bool;
                ExpAct[l]=bool;
            }
        }

    }

    

}

function seltronc(rg) {

    if (rg==0){

        tutti();
        return 0;
    }

    var nomchk = "ChkExpl" + rg;
    var bool=false;
    if (document.getElementById(nomchk).checked==false) {
        ExpAct[rg]=false;
    return 0;
    } else {
        ExpAct[rg]=true;
    }


        // boucle sur la parenté
        var Rgm = ExpMum[rg];

        while (Rgm > 0) {
    
            var nomchk = "ChkExpl" + Rgm;
            
            if (document.getElementById(nomchk)){
                document.getElementById(nomchk).checked =true;
                ExpAct[Rgm]=true;
            }

            // sélection de la variable
            var nomchk = "ChkExpl" + (Rgm+1);
            
            if (document.getElementById(nomchk)){
                document.getElementById(nomchk).checked =true;
            }

            Rgm = ExpMum[Rgm];
    
        };

       
        //sélection par défaut de la racine
        var nomchk = "ChkExpl0";
        if (document.getElementById(nomchk)) {
            document.getElementById(nomchk).checked=true; 
        }

     

    



}

function solo(rg){
  
    for (l=0;l<ExpAct.length;l++) {
            ExpAct[l]=false;
            var nomchk = "ChkExpl" + l;
            if (document.getElementById(nomchk)) {
                document.getElementById(nomchk).checked=false; 
            }
    }

    var nomchk = "ChkExpl" + rg;
        if (document.getElementById(nomchk)) {
            document.getElementById(nomchk).checked=true; 
        }

    seltronc(rg)

    defFiltre()
        
    
    
}

function tutti(rg){
    var bool=false;

    var nomchk = "ChkExpl0";
    if (document.getElementById(nomchk).checked==false) {
        bool=false;
    } else {
        bool=true ;
    }

    for (l=0;l<ExpAct.length;l++) {
            ExpAct[l]=bool;
            var nomchk = "ChkExpl" + l;
            if (document.getElementById(nomchk)) {
                document.getElementById(nomchk).checked=bool; 
            }
    }

 
    
}


function defFiltre(){

     
    ExpFltr=[];
    var rgCur=0;
    var chaineFltr ="";


    // inventaire des lignes
    for (l=0;l<ExpVar.length+1;l++) {

        if (ExpAct[l]==false && ExpMod[l]!="var"){ // la case est désactivée (il y a un filtre à ajouter)
        
            chaineFltr += ExpVar[l] + "-" + ExpMod[l] + "-" + ExpAct[l] + "/"; // ajout de la ligne

            var rg= ExpRng[l] // nombre d'itérations
            

                if (rg>0) { // s'il y a une ascendance à ajouter


                    var mumc = ExpMum[l]
                    
                    for (r=1;r<rg+1;r++) {
                         
                        chaineFltr += ExpVar[mumc] + "-" + ExpMod[mumc] + "-" + ExpAct[mumc] + "/"
                     
                        mumc = ExpMum[mumc]
                    }
                }    

                ExpFltr.push(chaineFltr)    
                
        }
        chaineFltr="";
    }
 
    
     
    QuelTri()
 
}

function SuppFltr() {

    ExpFltr=[];
}


// calcul de la population après filtrage

function testFiltre() {
    return 0;

var nbIn =0
var nbOut=0;
var out=false 

 
    
    for (l=0;l<BDD.length;l++) {
     out=false 

        for (f=0;f<ExpFltr.length;f++) {
                
            //split des conditions de filtrage
            var sstab=ExpFltr[f].split("/");    

            
            var nonc = false;

            for (f2=0;f2<sstab.length-1;f2++) { // boucle sur les conditions

                
                 
                //extraction des critères
                var crit=sstab[f2].split("-")
                
                
                var varf = crit[0] ;
                var modf = crit[1] ;
                var actf=true;
                actf = crit[2] ;
                

                var valmod = BDD[l][varf] ;

                 
                  
                if(valmod!=modf) { // la ligne est-elle concernée par le filtre 
                    nonc=true // si oui, non concernée
           
                }



            }   
 
            if (nonc==false){out=true ;}    

            

  

        }
        
       // alert('statut de la ligne ' + l + " : sortie? " + out)
        if (out==true) {
        nbOut++    
        } else {
        nbIn++;
        }
    }




 
    
alert(nbOut + "filtrés - " + nbIn + "gardés");
    
};


////////////////////////////////////////////////////////////////////////////////////////////////
// Histogramme univarié
///////////////////////////////////////////////////////////////////////////////////////////////



function Histo(cadre, col, qnts, Moy, vsel) {



    const canvas = document.getElementById(cadre);

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');


    var rgl = ""
    if (document.getElementById("TxtRglG")) {
        rgl = document.getElementById("TxtRglG").value;
    }



    var valmin = ValApRec(col[0],rgl)
    valmin = Math.floor(valmin);
    var valmax = ValApRec(col[col.length-1],rgl)
    valmax= Math.floor(valmax)+1;


    var effmax = 0
    var nbval=0

    TapQ = [0] // création du tableau des valeurs


    // "tri à plat " des valeurs de la variable

    // initialisation sur la première modalité
    var vcur=col[0]; // valeur courante
    var vRcur=ValApRec(col[0],rgl) // valeur recodée courante

    var nb = 1; // nombre d'apparition de la valeur

    for (l=1;l<col.length+1;l++){

        if (Number(col[l])<0) {col[l]!=0};

        if (col[l]!= vcur && ValApRec(col[l],rgl) != vRcur || l == col.length-1 && ValApRec(col[l],rgl) != vRcur) { // changement de valeur ou fin de la série



            TapQ.push(vcur);
            TapQ[TapQ.length-1] = new Array(4)
            TapQ[TapQ.length-1][1]= ValApRec(vcur,rgl) //vcur; //valeur
            TapQ[TapQ.length-1][2]= nb; // effectif
            TapQ[TapQ.length-1][3]= 0; // position sur le graph
            TapQ[TapQ.length-1][4]= 0; // largeur

            // mémorisation de la fréquence la plus élevée
            if (nb>effmax){effmax=nb};

            // nouvelle valeur courante
            vcur = col[l];
            vRcur = ValApRec(col[l],rgl)
            nb=1
            nbval++;
        } else {
            nb++

        }


    }


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

    // abcisses

    var pas =0.1

    valmaxtxt = String(valmax);
    pas = valmaxtxt.length;

    var ech = 1;
    if (pas>1) {
        var ech = Math.pow(10,(pas-1))
    } else {
        ech=5;
    }
    ech=ech/5

    var reste = valmin%ech;
    var echmin = valmin-reste;
    var reste = valmax%ech;
    var echmax = valmax + ech -reste;

    var amplix = echmax - echmin;
    var larbar = lardisp/amplix;
    //larbar=Math.round(larbar);

    // légende en X
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, hautot-margB, lardisp, 1);
    cnv.font = "12px Arial";

    for (b=echmin;b<echmax+1;b++) {

        if (b%ech==0) {

            var posleg = margG + (b-echmin)*larbar;
            cnv.fillRect(posleg, 450, 1, 5);
            cnv.fillText(b, posleg, 470);
        }

    }

    
    // ajout de l'étiquette de légende
    var lib = Nom[vL] + " - " + Libellé[vL] 
    var lartxt =  cnv.measureText(lib).width 
    lartxt=Math.floor(lartxt) +5

    cnv.fillText(lib, margG + (lardisp - lartxt)/2,  hautot - margB + 35);

     


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
    var hautech = haudisp/echymax;
    //hautech=Math.round(hautech);



    // légende en Y
    cnv.fillStyle = 'rgb(90 90 90)';
    cnv.fillRect(margG, margH, 1, haudisp);
    cnv.font = "12px Arial";
    var lastpct
    for (b=echymax;b>-1;b--) {

        if (b%ech==0) {

            // effectifs (à gauche)
            var posleg = margH + (echymax-b)*hautech;
            cnv.fillStyle = 'rgb(220 220 250)';
            cnv.fillRect(margG-5, posleg, lardisp+5, 1);
            cnv.fillStyle = 'rgb(90 90 90)';
            cnv.fillText(b, margG-30, posleg+5);

            // % à (droite)
            pct= b/PopTot *100
            pct=pct.toFixed(2)
            //pct=Math.round(pct)

            if (lastpct != pct) {
                lastpct = pct;
                if (isNaN(pct)==false) {
                    pct = pct+"%"
                    cnv.fillText(pct, margG + lardisp + 5, posleg+5);
                }

            }


        }

    }
    // ajout de l'étiquette de légende
    cnv.fillText("n", 10, 250);


    // ajout des quantiles
    txtqnt=["P1","D1","Q1","Med","Q3","D9","P99"]
    hqnt=[35,25,20,15,20,25,35]
    for (q=0;q<7;q++){ //(q=0;q<qnts.length;q++){

        var x1 = margG + (qnts[q]-echmin) * larbar ;
        cnv.fillStyle = 'rgb(255 190 190)';

        cnv.fillRect(x1, margH, 1, haudisp);
        cnv.fillText(txtqnt[q], x1-5, hqnt[q]);
        cnv.fillText(qnts[q], x1-5, hqnt[q]+12);
    }




    for (m=1;m<TapQ.length;m++){



        var x1 = margG + (TapQ[m][1]-echmin) * larbar ;
        TapQ[m][3] = x1 // mémorisation au passage de la position
        TapQ[m][4] = x1 + larbar;
        var x2 = larbar ;
        var typevar = TypVar[vL]
        if (typevar =='r') {x2=2}
        var y1= hautot-margB - (TapQ[m][2]/echymax) * haudisp;
        var y2 = TapQ[m][2]/echymax * haudisp;


        sel = false;

        if (m==vsel) {sel =true}
        dessinbarre(cadre,x1,y1,x2,y2,TapQ[m][1],TapQ[m][2],sel,effmax)


    }

    // ajout de la moyenne
    if (Moy !=0) {
        var x1 = margG + (Moy-echmin) * larbar ;
        cnv.fillStyle = 'rgb(255 90 90)';

        cnv.fillRect(x1, margH, 3, haudisp);
        cnv.fillText("moy.:" + Moy, x1+10, margH + 10);

    }


}

function dessinbarre(cadre,x1,y1,x2,y2,valeur,eff,sel,effmax) {

    const canvas = document.getElementById(cadre);

    if (!canvas.getContext) {
        return;
    }
    const cnv = canvas.getContext('2d');

    // Définition des couleurs


    if (sel == false) {
        cnv.fillStyle = 'rgb(103 148 189)';
        if (eff == effmax) {cnv.fillStyle = 'rgb(53 98 139)'} // couleur spécifique pour le mode
    } else {


        cnv.fillStyle = 'rgba(255 255 255 0.25)';
        cnv.fillRect(x1, 451, 40, 40);
        cnv.fillStyle = 'rgb(255 103 103)';
        cnv.fillText(valeur, x1+8, 470) ;
        cnv.fillText(eff, x1+8, 485) ;

        //cnv.fillStyle = 'rgb(90 90 90)';
        //cnv.fillText(b, margG-30, posleg);

        //cnv.fillStyle = 'rgb(203 203 203)';

        //cnv.fillStyle = 'rgb(255 103 103)';

    }




    //fond
    cnv.fillRect(x1, y1, x2, y2);


    cnv.fillStyle = 'rgb(220,220,220)';
    cnv.beginPath();
    cnv.rect(x1, y1, x2, y2);
    cnv.stroke();


}


function survHisto(ev){


    var x = ev.clientX;



    x=x-45;

    // recherche de la modalité suvolée
    for (m=0;m<TapQ.length;m++) {

        if (x >= TapQ[m][3]  && x < TapQ[m][4]) {


            Histo('fondHisto',Colonne,Quants, Moy, m);



        }
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
    var lastpct
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


    var larbar = lardisp/(nbc+2);
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

        // if (Colonne.length<1) {continue}


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
        var lft= (larbar/2) - (Moda[x][c].length / 2 * 6)
        if (lft<0){lft=5}

        cnv.fillText(Moda[x][c],posleg + lft, 470);

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
// TRI CROISE //////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function prepTCR() {

    TypTri="tcr"

    if (EstVu('BlocEXP')!=0) {CacheBloc('BlocEXP');}
    closeVars(); // fermeture de la fenêtre des variables pour éviter les pb de décalage vers le base
    
    VoirBloc('BlocVar2');

    Vidage("TabBDD","TabTAP","TabEXP");
    
    CaleSsHead()

    if (vL>0 && vC>0) {QuelTri()};

    

}

//insertion des non-réponses dans les tris croisés (Y)
document.getElementById('ChkNRY').onclick = function() {
    T_C_R(vL,vC);
};


function T_C_R(x,y,complet) {

    TypTri="tcr";


    // effacement du précédent tri à plat
    if (document.getElementById('ChkHis').checked ==false ) {
        Vidage('TabTAP','TabTCR')

    }

    // index de la variable en lignes (si manquant)
    if (x==undefined){x = vL}

    // index de la variable en colonnes (si manquant)
    if (y==undefined){y = vC}
     


    if (x<=0) {vL=1; return 0;}
    if (x>=Nom.length) {vL=Nom.length-1; return 0;}
    if (y<=0) {vC=1; return 0;}
    if (y>=Nom.length) {vC=Nom.length-1; return 0;}


    // Bifurcation en cas de variable quanti en colonnes
    var typvx= TypVar[x]
    var typvy= TypVar[y]

    if (typvx!='a' && typvy=='a') {
        var tmp = x;
        x=y;
        y=tmp;
        vL=x;
        vC=y;
        typvx='a'
        typvy='r'
    }



    // ajout de la variable choisie dans la zone de sélection (lignes)
    var prefix = ""

    

    if (x>0) {
        if (isNaN(Nom[x])) {prefix = x + " | "}
        document.getElementById('TxtL').placeholder = prefix + Nom[vL] + " | "+ Libellé[vL];
    }

    // ajout de la variable choisie dans la zone de sélection (colonnes)
    if (y>0) {
        if (isNaN(Nom[y])) {prefix = y + " | "}
        document.getElementById('TxtC').placeholder = prefix + Nom[vC] + " | "+ Libellé[vC];
    }
    


    if (typvx='a' && typvy!='a') {
        ComparVars(x,y)
        return 0
    }


    // tableau des valeurs
    Tcr= new Array (Number(CdMax[x])+1);

    //déclaration
    for (i = 0; i < Tcr.length; i++) {
        Tcr[i]= new Array (Number(CdMax[y])+1);
    }

    // mise à zéro
    for (i = 0; i < Number(CdMax[x])+1; i++) {
        for (j = 0; j < Number(CdMax[y])+1; j++) {
            Tcr[i][j]= 0;
        }
    }


    var rglx = Reco[x] // rgl de recodage
    var rgly = Reco[y] // rgl de recodage



    // Récupération des valeurs dans la base
    BDD.forEach(LireBDDLC);

    function LireBDDLC(item, index) {

        //var valmodlig = Number(item.substr(Posi[x]-1,CdMax[x].length));
        var valmodlig = Number(BDD[index][x]);

        //var valmodcol = Number(item.substr(Posi[y]-1,CdMax[y].length));
        var valmodcol = Number(BDD[index][y]);

        // application du recodage
        if (Reco[x].trim() != "") { valmodlig = ValApRec(valmodlig,rglx);}

        if (Reco[y].trim() != " ") { valmodcol = ValApRec(valmodcol,rgly);}

        // prise en compte de la pondération
        var coeffp=1;

        if (vP !=0) {
            coeffp = BDD[index][vP]
        }


        //filtrage
        if (EstVu('BlocFiltre')==0) { Tcr[valmodlig][valmodcol]+=coeffp;  }
        else
        {
            if (Filtrer(index) == true) {Tcr[valmodlig][valmodcol]+=coeffp;  }
        }




    };


// Calcul des marges et de la population totale
    MrgX = new Array(Number(CdMax[x])+1);
    for (i = 0; i < MrgX.length; i++) {
        MrgX[i]=0;
    }

    MrgY = new Array(Number(CdMax[y])+1);
    for (j = 0; j <MrgY.length; j++) {
        MrgY[j]=0;
    }

    var RgDpX, RgDpY;
    PopTot=0;

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


    if (vP !=0) { // arrondi en cas de pondération
        for (i = RgDpX; i < Number(CdMax[x])+1; i++) {
            for (j = RgDpY; j < Number(CdMax[y])+1; j++) {

                var valcase = Math.round(Tcr[i][j])

                Tcr[i][j]=valcase

            }
        }
    }


    for (i = RgDpX; i < Number(CdMax[x])+1; i++) {
        for (j = RgDpY; j < Number(CdMax[y])+1; j++) {

            var valcase = Tcr[i][j]

            MrgX[i] = MrgX[i] + valcase;
            MrgY[j] = MrgY[j] + valcase;
            PopTot=PopTot+ valcase;

        }
    }





    // Recopiage du tableau des modalités
    ModaX = Moda[x].slice()
    ModaY = Moda[y].slice()

    // prise en compte des variables multi (COLONNES)
    var multi=false
    VarMul = EstMulti(y,ModaY);

    // si multiple
    if (VarMul[0]==true ) {

        multi=true;

        // création nouveau tableau d'effectifs

        // Nouvelles modalités en colonne
        ModaY=[0];
        MrgY=[0];

        var TcrM =new Array(Tcr.length);
        for (l=0;l<TcrM.length;l++){
            TcrM[l]= new Array(1)
            TcrM[l][0]=0;
        }




        // défilement des modalités

        for (m=RgDpY ; m < Moda[y].length ; m++){

            if (Moda[y][m] == "" || Moda[y][m] == m ) {continue}

            var sstab=Moda[y][m].split(VarMul[1]);

            for (m2=0;m2<sstab.length;m2++){

                sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne

                function ValSousMod(valmod) {
                    return valmod == sstab[m2];
                }

                var idx=ModaY.findIndex(ValSousMod);



                // la modalité a-t-elle déjà été trouvée?
                if (idx<0) { // si non, création d'une nouvelle modalité


                    ModaY.push(sstab[m2]);
                    MrgY.push(0)
                    var dermod=MrgY.length -1;


                    // réécriture du tableau des effectifs
                    for (l=RgDpX;l<TcrM.length;l++){
                        var valaj = Number(Tcr[l][m])
                        TcrM[l].push(valaj)
                        MrgY[dermod] +=valaj
                    }


                }
                else {
                    for (l=RgDpX;l<TcrM.length;l++){
                        TcrM[l][idx] += Tcr[l][m]
                        MrgY[idx] +=Tcr[l][m]
                    }
                }

            }

        }


        Tcr= new Array(TcrM.length)

        for (l=0;l<TcrM.length;l++){

            Tcr[l]=TcrM[l].slice()

        }

    }


    // prise en compte des variables multi (LIGNES)
    VarMul = EstMulti(x,ModaX);

    // si multiple
    if (VarMul[0]==true ) {

        multi=true;

        // création nouveau tableau d'effectifs

        // Nouvelles modalités en colonne
        ModaX=[0];
        MrgX=[0];

        var TcrM =new Array(1);
        TcrM[0]= new Array(ModaY.length)
        for (c=0;c<ModaY.length;c++){
            TcrM[0][c] = Tcr[0][c]
        }



        // défilement des modalités

        for (m=RgDpX ; m < Moda[x].length ; m++){

            if (Moda[x][m] == "" || Moda[x][m] == m ) {continue}

            var sstab=Moda[x][m].split(VarMul[1]);

            for (m2=0;m2<sstab.length;m2++){

                sstab[m2] = sstab[m2].replace(/\r?\n|\r/,"") // retrait des sauts de ligne

                function ValSousMod2(valmod) {
                    return valmod == sstab[m2];
                }

                var idx=ModaX.findIndex(ValSousMod2);



                // la modalité a-t-elle déjà été trouvée?
                if (idx<0) { // si non, création d'une nouvelle modalité

                    ModaX.push(sstab[m2]);
                    MrgX.push(0)
                    var dermod=MrgX.length -1;
                    var lignetab = Tcr[m].slice()
                    TcrM.push(lignetab)


                    // réécriture du tableau des effectifs
                    for (c=RgDpY;c<ModaY.length;c++){
                        var valaj = Tcr[m][c];
                        MrgX[dermod] +=valaj
                    }


                }
                else {
                    for (c=RgDpY;c<ModaY.length;c++){
                        TcrM[idx][c] += Tcr[m][c]
                        MrgX[idx] += Tcr[m][c]
                    }
                }

            }

        }



        Tcr= new Array(TcrM.length)

        for (l=0;l<TcrM.length;l++){

            Tcr[l]=TcrM[l].slice()

        }



    }


    if (complet == false) {
    //return(TCR,ModaX,ModaY);
    } else {
        if (multi==false) {
            khi(x,RgDpX,y,RgDpY)
            }
    Aff_T_C_R(x, RgDpX, y, RgDpY, multi)
    }
}







function khi(x,RgDpX,y,RgDpY){
    //Calcul du khi2

        Khi2=0;
        lnonvide=0;
        cnonvide=0;
        theoinf5=0;
        theoinf1=0;

    // tableau des effectifs théoriques
    TcrTh= new Array (Number(CdMax[x])+1);

    //déclaration
    for (i = 0; i < TcrTh.length; i++) {
        TcrTh[i]= new Array (Number(CdMax[y])+1);
    }

    // mise à zéro
    for (i = 0; i < Number(CdMax[x])+1; i++) {
        for (j = 0; j < Number(CdMax[y])+1; j++) {
            TcrTh[i][j]= 0;
        }
    }



        for (i = RgDpX; i < Number(CdMax[x])+1; i++) {

            for (j = RgDpY; j < Number(CdMax[y])+1; j++) {


                if (MrgX[i]>0 && MrgY[j]>0 ) { // évitemment des colonnes vides

                    TcrTh[i][j] = MrgX[i]*MrgY[j]/PopTot

                    var ContribCase= Contrib(Tcr[i][j],MrgX[i],MrgY[j],PopTot);

                    if (isNaN(ContribCase)) {}
                    else {
                        Khi2 = Khi2 + ContribCase;
                    }

                }


            }

        }

        // calcul de la probabilité associée au kh2
        for (i = RgDpX; i < Number(CdMax[x])+1; i++) {

            if (MrgX[i]>0) {lnonvide++;}

        }

        for (j = RgDpY; j < Number(CdMax[y])+1; j++) {

            if (MrgY[j]>0) {cnonvide++;}

        }


        deglib=(lnonvide-1)*(cnonvide-1);


        proba = loinorm(deglib,Khi2);

        if (isNaN(proba)) {}
        else {
            proba= (1-proba);
            proba = proba.toFixed(3);
            signif = "ns";
            if (proba<0.1){signif="*";}
            if (proba<=0.05){signif+="*";}
            if (proba<=0.01){signif+="*";}
            
        }

        var minmarges = 0 
        if (lnonvide <= cnonvide){minmarges=lnonvide-1;}
        if (lnonvide > cnonvide){minmarges=cnonvide-1;}

        var khi2max = Khi2/(PopTot*minmarges);
        vcram = Math.sqrt(khi2max);
        vcram = vcram.toFixed(3);

     

}


    function Aff_T_C_R(x, RgDpX, y, RgDpY, multi) {

    //Création du tableau de résultats
    var body = document.body,

        // Titre
        titre  = document.createElement('p');
    titre.id='Titre';
    titre.className= 'TabTitre';
    //if (document.getElementById('ChkHis').checked ==true ) {
    titre.innerHTML = `<div class=titretab style="font-size:18px;color:#3b8dbd;" > ` + Nom[vC] + ` en fonction de ` + Nom[vL] + `
     
    <div class="btn btn-outline-primary btn-sm imgbtn imgcopy" onclick="CopieTCR()" style="float:right; margin-left:3px" ></div> 
    <div class="btn btn-outline-primary btn-sm imgbtn imggrph" onclick="if(vuGrph==true){vuGrph=false} else {vuGrph=true};typgrph=2;QuelTri()" style="float:right" ></div>        
    `
    /*
        <a>` + Nom[y] + ` | ` + Libellé[y] + `</a> <br>
        <a style="font-size:0.75rem;color: gray">en fonction de</a> <br>
        <a>` + Nom[x] + ` | ` + Libellé[x] + `</a>` +     // ajout du bouton copier

        `
       */

    titre.innerHTML += `</div>`
    
    
    
    var affhist= "none"
    if (vuGrph==true){affhist="block";}
    titre.innerHTML += `<div id = "blocHisto" style="float:none;display:`+ affhist + `"> 

        

        <select id="choixHisto" class="custom-select"  style = " margin-bottom: 2px;width:350px;font-size:1rem;" onchange='HistoTcr()'>
        <option value="0" disabled>Histogrammes</option>
        <option value="1">Histogramme des effectifs</option>
        <option value="2">Histogramme % en lignes (par colonnes) </option>s
        <option value="3">Histogramme % en lignes (par lignes) </option> 
        <option value="4" disabled>Tableaux "à tiroirs"</option>
        <option value="5"> Tab. des effectifs</option>
        <option value="6"> Tab. des % en lignes </option>
        <option value="7"> Tab. des écarts à l'indépendance </option>
        
        </select>  
        
        

    

    <canvas id="fondTcr" width=1000 height=650 style="border:1px solid #333;display: `+ affhist + `"></canvas>
    </div> 
    
    
    `;

    /* 
<option value="8"> Tab. des contributions au khi2 </option>
        
    */ 

    //  }
    //else {
    //titre.innerHTML = "";
    //}

    var cnt = document.getElementById("contenu")    
    //document.body.appendChild(titre);
    cnt.appendChild(titre)    

    tbl  = document.createElement('table');
    tbl.id = 'TabTCR';
    tbl.className= 'TabTri';
    var larcol= (cnonvide+2)*120 +"px";
    tbl.style.width  = larcol;
    //tbl.style.border = '1px solid black';



    // entêtes
    var tr = tbl.insertRow();
    var Case;
    var HCell = document.createElement("th");
    HCell.style.backgroundColor= 'white'
    HCell.style.padding= '0px'
    HCell.style.border='none'
    HCell.style.verticalAlign='top'

    HCell.innerHTML = `



        <div style="float:left">
               <button  class="btn btn-outline-primary imgbtn imginterv" onclick="intervLC()" type="button"></button><br>
               <button  class="btn btn-outline-primary imgbtn imgup" onclick="vL--;QuelTri()" type="button" style="margin-top:2px"></button><br>
               <button  class="btn btn-outline-primary imgbtn imgdown " onclick="vL++;QuelTri()" type="button" style="margin-top:2px"></button>
               </div>

             <div style="float:left;margin-left:2px;margin-top:0px;">
             <button  class="btn btn-outline-primary imgbtn imgleft " onclick="vC--;QuelTri()" type="button" ></button>
             <button  class="btn btn-outline-primary imgbtn imgright  " onclick="vC++;QuelTri()" type="button" style="margin-left:-2px"></button>
            </div> `

    tr.appendChild(HCell);


     var caseMod ="" ;  

    for (j=RgDpY;j<Number(CdMax[y])+1;j++) {
        caseMod = `<label style="cursor:pointer;font-weight: bold;" ><input type="checkbox" class = "ChkModC" id="ChkModC` + j + `" value="1" onclick = "veilleChkTCR()" style="margin-right : 10px;display:none"></input>` + ModaY[j]+ `</label>`

        //n'affiche l'entête que s'il y a une colonne
        if (MrgY[j]>0) {
            var HCell = document.createElement("th");
            HCell.innerHTML = caseMod 

            if (j==0){ HCell.innerHTML +=`<button type="button" class="btn btn-outline-alarm btn-sm imgbtn imgclose" style="font-size: 0.45em;float: right;margin-right: 3px;margin-top:-15px;"  onclick="SsNr('Y')"></button>`}


            tr.appendChild(HCell);

        }
    }

    var HCell = document.createElement("th");
    HCell.innerHTML = "Total";
    tr.appendChild(HCell);



    //valeurs

    for (i = RgDpX; i < Tcr.length; i++) {
 


        if (MrgX[i]>0) { //n'affiche la ligne que si elle contient des valeurs
        caseMod = `<label style="cursor:pointer;font-weight: bold;" ><input type="checkbox" class = "ChkModL" id="ChkModL` + i + `" value="1" onclick = "veilleChkTCR()" style="margin-right : 10px;display:none">`+ ModaX[i] + `</input>`

            var tr = tbl.insertRow();
            var Case;

            var td = tr.insertCell();
            td.innerHTML =  caseMod  

            if (i==0){ td.innerHTML +=`<button type="button" class="btn btn-outline-alarm btn-sm imgbtn imgclose" style="font-size: 0.5em;float: right;margin-right: 3px;margin-top: -18px;" onclick="SsNr('X')" ></button>`}

            //td.appendChild(document.createTextNode(Moda[x][i]));


            for (j=RgDpY;j<Number(CdMax[y])+1;j++) {

                if (MrgY[j]>0) {  //n'affiche la colonne que si elle contient des valeurs



                    // contenu de la case
                    var eff = Tcr[i][j];


                    Case ="";


                    // fond case affichage PEM
                    if (document.getElementById('ChkPEM').checked ==true  ) {

                        var coulpos= 'rgba(11, 93, 168, 0.25)' //'rgba(112, 194, 176,100)';
                        var coulmoins= 'rgba(167, 58, 255, 0.25)' //'rgba(245, 184, 115,100)';


                        var CalcPEM = PEMLOC(PopTot,MrgX[i],MrgY[j],eff);


                        PEM=Math.round(CalcPEM[0]);
                        var k2Pem =CalcPEM[1]; //.toFixed(4);

                        var ProbPEM=0.1;

                        ProbPEM =  loinorm(1,k2Pem);

                        if ( Number(ProbPEM) < 0.9) {coulpos= 'rgba(240, 240, 240,100)';coulmoins=coulpos; }

                        var signifPEM = "";
                        if (ProbPEM>=0.9){signifPEM="*";}
                        if (ProbPEM<=0.95){signifPEM+="*";}
                        if (ProbPEM<=0.99){signifPEM+="*";}




                        if (PEM > 0)  {

                            var hPEM = Number(PEM)/2;
                            //var r = document.querySelector(':root');
                            //r.style.setProperty('--hpem', hPEM);

                            var stylePEM = `style = "background: linear-gradient(to bottom,
                          rgba(255,255,255,0) 0%,
                          rgba(255,255,255,0) ` + (50-hPEM) + `%,`
                                + `rgba(11, 93, 168, 0.20)` + (50-hPEM) + `%,`
                                + `rgba(11, 93, 168, 0.03) 50%,`
                                + `rgba(255,255,255,0) 51%,`
                                + `rgba(255,255,255,0) 100%)"`



                            PEM = "+" + PEM + "%";
                        }

                        else {
                            var hPEM = Number(PEM/2)*-1;

                            var stylePEM = `style = "background: linear-gradient(to bottom,
                                rgba(255,255,255,0) 0%,
                                rgba(255,255,255,0) 50%,`
                                + `rgba(6, 42, 149, 0.05) 50%, `
                                + `rgba(5, 0, 157, 0.2) ` + (50+hPEM) + `%,`
                                + `rgba(255,255,255,0) ` + (50+hPEM) + `%,`
                                + `rgba(255,255,255,0) 100%)"`



                            PEM = PEM + "%";
                        }

                        Case = `<div class='fondcase'`+ stylePEM + `><div class="pem fadeout"  style="color:rgb(240,240,240)">` + signifPEM + `</div> `;

                    }



                    var nbvalaff = 0 ;  // combien de valeurs différentes affichées dans la case?
                    var valaff = "" ; // dernière valeur affichée

                    // calcul des ratios
                    var PrctX = eff/MrgX[i]*100;
                    PrctX=PrctX.toFixed(NbDec);

                    var PrctY = eff/MrgY[j]*100;
                    PrctY=PrctY.toFixed(NbDec);

                    var PrctT = eff/PopTot*100;
                    PrctT=PrctT.toFixed(NbDec);


                    var listChk=['ChkEff', 'ChkPT','ChkPL','ChkPC']
                    var valPct=[eff, PrctT,PrctX,PrctY]

                    for (chk=0;chk<4;chk++){ // analyse du nombre de valeurs à afficher par case (pour remplacer les effectifs le cas échéant)
                        if (document.getElementById(listChk[chk]).checked ==true ) {
                            nbvalaff++;
                            valaff = valPct[chk]
                        }
                    }

                    // substitution des effectifs théoriques aux effectifs
                    if (document.getElementById("ChkTH").checked ==true ) {
                         
                        eff = TcrTh[i][j].toFixed(NbDec); 
                    }


                    // % en colonnes (en haut à gauche)
                    if (document.getElementById('ChkPC').checked ==true && nbvalaff>1) {

                        Case +=`<div class= 'pctcol'>` + PrctY + `%</div> `;
                        valaff=PrctY
                    }


                    // signalement des eff. théo inf. 5
                    var styleeff= ``
                    if (multi==false && TcrTh[i][j] < 5) {
                        styleeff+=`color:red;`
                         
                    }

                    // signalement des résidus
                    if (document.getElementById('ChkRS').checked ==true && multi==false ) {

                        // calcul du résidu du khi²

                        var resi= (eff - TcrTh[i][j]) / Math.sqrt(TcrTh[i][j])
                        
                        if (resi < -2 || resi > 2) {
                        styleeff+=`font-weight:bold;`;
                        }
                        
                    }



                    // effectifs
                    if (document.getElementById('ChkEff').checked ==true || document.getElementById('ChkTH').checked ==true ) {

                        Case +=`<div class= 'effectifs' style="` + styleeff + `" >  `+eff+ `</div>`;}

                    else {
                        var txt = ""
                        if (nbvalaff==1){txt=valaff}
                        Case +=`<div class= 'effectifs'  style="` + styleeff + `" > <label></label>`+txt+` </div>`;

                    }

                    //% total (en bas  à gauche)
                    if (document.getElementById('ChkPT').checked ==true && nbvalaff>1 ) {

                        Case +=`<div class= 'pcttot'>` + PrctT + `%</div> `;

                    }

                    // % en lignes (bas droite)
                    if (document.getElementById('ChkPL').checked ==true && nbvalaff>1) {

                        Case +=`<div class= 'pctlig'>  `+ PrctX + `%</div> `;

                    }







                    if (document.getElementById('ChkPEM').checked ==true ) {
                        Case +=`</div>`;
                    }

                    var HCell = document.createElement("td");
                    HCell.innerHTML = Case ;


                    //coloration des cases selon sens de la liaison
                    

                    if (document.getElementById('ChkCoul').checked ==true && multi==false) {
                        
                        
                        if (Tcr[i][j]>TcrTh[i][j] && proba <0.1) {
                        HCell.style.backgroundColor="rgba(91, 230, 91, 0.24)";
                        
                            if (document.getElementById('ChkRS').checked ==true) { 

                                if (resi < -2 || resi > 2) {
                                HCell.style.backgroundColor="rgba(91, 230, 91, 0.45)";
                                }
                            }

                        }
                        if (Tcr[i][j]<TcrTh[i][j] && proba<0.1 ) {
                            HCell.style.backgroundColor="rgba(255, 121, 2, 0.22)";

                            if (document.getElementById('ChkRS').checked ==true) { 

                                if (resi < -2 || resi > 2) {
                                HCell.style.backgroundColor="rgba(255, 84, 0, 0.36)";
                                }
                            }

                        }
                    
                    }

                    tr.appendChild(HCell);



                    //td.appendChild(document.createTextNode(Tcr[i][j]));



                }

            }




            'bout de ligne'

            // contenu de la case
            var eff = Number(MrgX[i]);
            var PrctX = 100;
            PrctX=PrctX.toFixed(NbDec);
            var PrctY = eff/PopTot*100;
            PrctY=PrctY.toFixed(NbDec);

            var PrctT = PrctY;
            Case ="";


            // % en colonnes (en haut à gauche)
            if (document.getElementById('ChkPC').checked ==true ) {
                Case +=`<div class= 'pctcol'>` + PrctY + `%</div> `;
            }



            // effectifs
            //if (document.getElementById('ChkEff').checked ==true ) {

            Case +=`<div class= 'effectifs'>  `+eff+ `</div>`;//}

            //  else {
            //  Case +=`<div class= 'effectifs'> <label></label> </div>`;
            //}

            //% total (en haut à droite)
            if (document.getElementById('ChkPT').checked ==true ) {
                Case +=`<div class= 'pcttot'>` + PrctT + `%</div> `;
            }

            // % en lignes (bas droite)
            if (document.getElementById('ChkPL').checked ==true ) {
                Case +=`<div class= 'pctlig'>  `+ PrctX + `%</div> `;
            }


            var HCell = document.createElement("td");
            HCell.innerHTML = Case ;
            tr.appendChild(HCell);

        };
    }

    // Total en colonnes
    var tr = tbl.insertRow();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Total"));
    for (j=RgDpY;j<Number(CdMax[y])+1;j++) {

        if (MrgY[j]>0) {  //n'affiche la colonne que si elle contient des valeurs
            // contenu de la case
            var eff = MrgY[j];
            var PrctX =eff/PopTot*100;
            PrctX=PrctX.toFixed(NbDec);

            var PrctY = 100 ;
            PrctY=PrctY.toFixed(NbDec);

            var PrctT = PrctX;

            Case ="";



            // % en colonnes (en haut à gauche)
            if (document.getElementById('ChkPC').checked ==true ) {
                Case +=`<div class= 'pctcol'>` + PrctY + `%</div> `;
            }

            //% total (en haut à droite)
            if (document.getElementById('ChkPT').checked ==true ) {
                Case +=`<div class= 'pcttot'>` + PrctT + `%</div> `;
            }

            // effectifs
            if (document.getElementById('ChkEff').checked ==true ) {

                Case +=`<div class= 'effectifs'>  `+eff+ `</div>`;}

            else {
                Case +=`<div class= 'effectifs'> <label></label> </div>`;
            }

            // % en lignes (bas droite)
            if (document.getElementById('ChkPL').checked ==true ) {
                Case +=`<div class= 'pctlig'>  `+ PrctX + `%</div> `;
            }


            var HCell = document.createElement("td");
            HCell.innerHTML = Case ;
            tr.appendChild(HCell);

        }

    }

    // TOTAL


    var eff = PopTot;
    var PrctX =100;
    PrctX=PrctX.toFixed(NbDec);
    var PrctY =100;
    PrctY=PrctY.toFixed(NbDec);
    var PrctT =100;
    PrctT=PrctT.toFixed(NbDec);



    Case ="";

    // % en colonnes (en haut à gauche)
    if (document.getElementById('ChkPC').checked ==true ) {
        Case +=`<div class= 'pctcol'>` + PrctY + `%</div> `;
    }

    //% total (en haut à droite)
    if (document.getElementById('ChkPT').checked ==true ) {
        Case +=`<div class= 'pcttot'>` + PrctT + `%</div> `;
    }

    // effectifs
    if (document.getElementById('ChkEff').checked ==true ) {

        Case +=`<div class= 'effectifs'>  `+eff+ `</div>`;}

    else {
        Case +=`<div class= 'effectifs'> <label></label> </div>`;
    }

    // % en lignes (bas droite)
    if (document.getElementById('ChkPL').checked ==true ) {
        Case +=`<div class= 'pctlig'>  `+ PrctX + `%</div> `;
    }


    var HCell = document.createElement("td");
    HCell.innerHTML = Case ;
    tr.appendChild(HCell);
    ;












    // Sources et champ
    //var tr = tbl.insertRow();
    //var td = tr.insertCell();

    //td.appendChild(document.innerHTML("Champ" + "Population Totale"));
    //}

    cnt.appendChild(tbl);
    //body.appendChild(tbl);

    Pied  = document.createElement('p');
    Pied.id='Pied';
    var champ = "Population totale (n=" + PopTot + ")";

    if (EstVu("BlocFiltre")==true) {
        champ = ChampFiltre() + " (n=" + PopTot + ")";
    }

    strPiedPlain = 'Source : ' + nomBase + '\r\n\v' + 'Champ : ' + champ + '\r\n';
    strpied=`<div class = "piedtab">
            Source : ` + nomBase + `<br>
            Champ : ` + champ + `<br>`


    if (vP!=0){
        strPiedPlain += 'Var. Pond. : ' + Libellé[vP] + '\r\n';
        strpied+=` Var. Pond. : ` + Libellé[vP]  + `<br>`
    }

    if (multi==false) {
        if (proba==0){proba ="< 0.001"}
        strPiedPlain += 'Khi² : ' +  Khi2.toFixed(NbDec) + ` ddl : ` + deglib + ` proba : ` + proba + " " + signif + '\r\nV de Cramér :' + vcram;
        strpied+=`  Khi² : ` + Khi2.toFixed(NbDec) + ` ddl : ` + deglib + ` proba : ` + proba + "  " + signif 

              if (theoinf5>0) {

                strPiedPlain += ' - Attention : ' + theoinf5 + ` cases ont des eff. théoriques < 5  `;
                strpied+=`<label style="color:rgb(255,10,10);font-size:0.75rem"> - Attention : ` + theoinf5 + ` cases ont des eff. théoriques < 5  </label>`

                if (theoinf1>0) {

                    strPiedPlain += ' - (dont ' + theoinf1 + `  < 1)`;
                    strpied+=`<label style="color:rgb(255,10,10);font-size:0.75rem">  ... (dont  ` + theoinf1 + `  < 1)</label>`
    
                  }


              }

              strPiedPlain +=  '\r\n V de Cramér :' + vcram;
              strpied+=  "  <br> V de Cramér : " + vcram + " </p>";


    } else {
        strPiedPlain += 'Variable(s) multiple(s)! Les marges dépassent 100%';
        strpied+=`<p style="color:rgb(255,10,10);font-size:0.75rem">Variable(s) multiple(s)! Les marges dépassent 100% </p>`
    }

    Pied.innerHTML = strpied 
    // ajout du bouton grouper
    Pied.innerHTML += `<div id = "piedtcr" class = 'cadrepied' style="float:left;width:100%; display:none">
    <div class="btn btn-primary" id="regroupTCR" style="width:200px" onclick="regrouperLC()"> Regrouper</div>
    </div>
     `


    // ajout de l'histogramme
    Pied.innerHTML += `
    

`;



    //document.body.appendChild(Pied);
    cnt.appendChild(Pied);

    // affichage du graphique
    if (typgrph>0) {
        document.getElementById('choixHisto').value = typgrph
        HistoTcr()
    }
    ;

     document.getElementById("fondpage").style.width=window.innerWidth
     // définition de la largeur du tableau
    var lartab=document.getElementById("TabTCR").offsetWidth
    // ajustement du titre
    document.getElementById("Titre").style.width=lartab



};

function SsNr(sens) {

    var idchk = "ChkNR" + sens;
    String(idchk)

    document.getElementById(idchk).checked=false;
    T_C_R(vL,vC)

}

function intervLC() { // interversion Lignes et colonnes
var vT = vL;
vL=vC;
vC=vT;

QuelTri()


}


function ComparVars(x,y) {


    // tableau des valeurs
    Tcr= new Array (Number(CdMax[x])+1);
    MrgX = new Array(Number(CdMax[x])+1);
    MrgY = new Array(Number(CdMax[y])+1);


    // mise à zéro
    for (i = 0; i < Number(CdMax[x])+1; i++) {
        Tcr[i]= new Array (11);
        for (j = 0; j < 12; j++) {
            Tcr[i][j]= 0;
        }
    }


    var rgl = Reco[x] // règle de recodage

    var nbc = 0 // nombres de valeurs/lignes différentes
    Cols = new Array (Number(CdMax[x])) // tableau des colonnes (pour tests)

        // les non réponses sont-elles incluses?
        NRX = document.getElementById('ChkNRX').checked
        NRY = document.getElementById('ChkNRY').checked
        if (NRX == false ) {
            RgDpX=1; }
        else {
            RgDpX = 0;
        }
    
 



    // calcul des valeurs
    for (i = RgDpX; i < Number(CdMax[x])+1; i++) {

        //agrandissement du tableau
        

        // extraction de la colonne pour la variable
        ExtractCol(y,NRY, x,i)

        TriParTas (Colonne);

        var nblig = Colonne.length

        if (nblig<=0) {continue}

        nbc++ // nombre de colonnes non vides +1
        Cols[nbc] = Colonne  // mémorisation de la colonne dans le tableau des colonnes

        var nbmiss = BDD.length - Colonne.length
        Tcr[i][0] = nblig
        MrgX[i]=nblig

        Moy=Moyenne(Colonne);
        Tcr[i][1] = Moy // moyenne
        var Quants=Quantiles(Colonne)
        var ect = EcartType(Colonne, Moy)
        Tcr[i][2]=ect; //écart-type
        Tcr[i][3]=Colonne[0] //min

        for (q=0;q<Quants.length+1;q++){ // défilement des quantiles p1 p10 Q1 Q2 Q3 p90 p99
            Tcr[i][Number(q)+4]=Quants[q];
        }

        Tcr[i][11]=Colonne[nblig-1] // max
    }

    // Recopiage du tableau des modalités
    ModaX = Moda[x].slice()
    ModaY = ["n","moyenne","écart-type","min","p1","d1","q1","Médiane","q3","d9","p99","max"]



    //Création du tableau de résultats
    var body = document.body

    // Titre
    titre  = document.createElement('p');
    titre.id='Titre';
    titre.className= 'TabTitre';
    //if (document.getElementById('ChkHis').checked ==true ) {
    titre.innerHTML = ` <div class=titretab style="font-size:18px;color:#3b8dbd;" > ` + Nom[y] + ` en fonction de `+ Nom[x] +`
            <div class="btn btn-outline-primary btn-sm imgbtn imgcopy" onclick="CopieTCR()" style="float:right" ></div> 
                        
  

            `
    /*
        <a>` + Nom[y] + ` | ` + Libellé[y] + `</a> <br>
        <a style="font-size:0.75rem;color: gray">en fonction de</a> <br>
        <a>` + Nom[x] + ` | ` + Libellé[x] + `</a>` +     // ajout du bouton copier

        `
      */

    titre.innerHTML += `</div>
  
        <div>
                 <canvas id="fondMoustaches" width="1000" height="500" style="border: 1px solid #333; margin-top: 30px ; margin-left: 100px; margin-right: auto"></canvas>
            </div>  
        
        `;


    //  }
    //else {
    //titre.innerHTML = "";
    //}


    document.body.appendChild(titre);



    tbl  = document.createElement('table');
    tbl.id = 'TabTCR';
    tbl.className= 'TabTri';
    var larcol= (11)*120 +"px";
    tbl.style.width  = larcol;


    // entêtes
    var tr = tbl.insertRow();
    var Case;
    var HCell = document.createElement("th");
    HCell.style.backgroundColor= 'white'
    HCell.style.padding= '0px'
    HCell.style.border='none'
    HCell.style.verticalAlign='top'
    HCell.innerHTML = `



        <div style="float:left">

              <button  class="btn btn-outline-primary imgbtn imgup" onclick="vL--;QuelTri()" type="button"></button><br>
              <button  class="btn btn-outline-primary imgbtn imgdown " onclick="vL++;QuelTri()" type="button" style="margin-top:2px"></button>
              </div>

            <div style="float:left;margin-left:2px;margin-top:0px;">
            <button  class="btn btn-outline-primary imgbtn imgleft " onclick="vC--;QuelTri()" type="button" ></button>
            <button  class="btn btn-outline-primary imgbtn imgright  " onclick="vC++;QuelTri()" type="button" style="margin-left:-2px"></button>
            </div>

        `

    tr.appendChild(HCell);

    for (j=0;j<12;j++) {


        var HCell = document.createElement("th");
        HCell.innerHTML =ModaY[j];
        tr.appendChild(HCell);

    }




    var RgDpX, RgDpY;


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


    //valeurs

    for (i = RgDpX; i < Tcr.length; i++) {



        if (MrgX[i]>0) { //n'affiche la ligne que si elle contient des valeurs

            var tr = tbl.insertRow();
            var Case;

            var td = tr.insertCell();
            td.innerHTML =  ModaX[i]

            //td.appendChild(document.createTextNode(Moda[x][i]));


            for (j=0;j<12;j++) {



                // contenu de la case
                var eff = Tcr[i][j];


                Case ="";







                // valeurs

                Case +=`<div class= 'effectifs'>  `+eff+ `</div>`;


                var HCell = document.createElement("td");
                HCell.innerHTML = Case ;
                tr.appendChild(HCell);



                //td.appendChild(document.createTextNode(Tcr[i][j]));





            }






        };
    }

    // extraction de la colonne pour le TOTAL
    ExtractCol(y,0,0)
    TriParTas (Colonne);

    var nblig = Colonne.length

    var nbmiss = BDD.length - Colonne.length
    MrgY[0]=nblig

    Moy=Moyenne(Colonne);
    MrgY[1] = Moy
    var Quants=Quantiles(Colonne)
    var ect = EcartType(Colonne, Moy)
    MrgY[2]=ect;
    MrgY[3]=Colonne[0]



    for (q=0;q<Quants.length+1;q++){
        MrgY[Number(q)+4]=Quants[q];
    }

    MrgY[11]=Colonne[nblig-1]



    // Total en colonnes
    var tr = tbl.insertRow();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Total"));
    for (j=0;j<12;j++) {


        // contenu de la case
        var eff = MrgY[j];

        Case ="";




        Case +=`<div class= 'effectifs'>  `+eff+ `</div>`;


        var HCell = document.createElement("td");
        HCell.innerHTML = Case ;
        tr.appendChild(HCell);




    }




    document.body.appendChild(tbl);

    // affichage de la boite à moustaches
    Moustaches("fondMoustaches",  x , y , nbc)

    Pied  = document.createElement('p');
    Pied.id='Pied';
    var champ = "Population totale (n=" + PopTot + ")";

    if (EstVu("BlocFiltre")==true) {
        champ = ChampFiltre() + " (n=" + PopTot + ")";
    }

    strPiedPlain = "Sources : " + nomBase + '\r\n\v' + 'Champ : ' + champ + '\r\n';
    strpied=`<div class = "piedtab">
            Source : ` + nomBase + `<br>
            Champ : ` + champ + `<br>`


    if (vP!=0){
        strPiedPlain = "Var. Pond. : " + Libellé[vP] + '\r\n';
        strpied+=` Var. Pond. : ` + Libellé[vP]  + `<br>`
    }


    // test de significativité

    if (nbc==2) { // Test de student (welsh)

        var result= t_test(Cols[1],Cols[2])
        var tstud = result[1].toFixed(3);
        var pval = result[2].toFixed(3);
        if (pval == 0){pval = "<0.001"}
        strPiedPlain = "T Student : " + tstud + ' p-value : ' + pval + '\r\n';
        strpied+=`T Student : ` +  tstud + ` p-value : `+ pval +`<br>`

    } else {

        var fscore= 0
        var ftest= 0

        // au-delà de 2 modalités : ANOVA

        if (nbc==3) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3])
        }

        if (nbc==4) {

            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4])

        }

        if (nbc==5) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4,Cols[5]])
        }

        if (nbc==6) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6])
        }

        if (nbc==7) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7])
        }

        if (nbc==8) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8])
        }

        if (nbc==9) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8],Cols[9])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8],Cols[9])
        }

        if (nbc==10) {
            var fscore= jStat.anovafscore(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8],Cols[9],Cols[10])
            var ftest= jStat.anovaftest(Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8],Cols[9],Cols[10])
        }


        if (nbc>10) {
            var fscore= 0
            var ftest= 0
        }


        fscore = fscore.toFixed(3);
        ftest = ftest.toFixed(3);

        if (ftest == 0){ftest = "<0.001"}

        if (fscore>0) { // pas d'affichage si l'anova n'est pas calculée (car trop de modas)
            strPiedPlain = `Anova : f: ` + fscore + ` ddl: ( `+ nbc-1 + ` - ` + PopTot-nbc + ` ) p-value : ` + ftest+ '\r\n';
            strpied+= `Anova : f: ` + fscore + ` ddl: ( `+ (nbc-1) + ` - ` + (PopTot-nbc) + ` ) p-value : ` + ftest + '<br>';
        }

    }

    Pied.innerHTML = strpied


    document.body.appendChild(Pied);





}



function CopieTCR(){

    // les non réponses sont-elles incluses?
    NRX = document.getElementById('ChkNRX').checked;
    NRY = document.getElementById('ChkNRY').checked;

    var rgstartx =0;
    var rgstarty = 0;

    if (NRX === false ) {rgstartx=1}
    if (NRY === false ) {rgstarty=1}


    var tabPlain = Libellé[vC] + ` en fonction de ` + Libellé[vL] + '\r\n';
    var tabhtml =`<h4> ` + Libellé[vC] + ` en fonction de ` + Libellé[vL] +` </h4>`;

    // export des effectifs

    // effectifs
    if (document.getElementById('ChkEff').checked === true ) {

        tabPlain += 'eff.\t';
        tabhtml += `<table style="width:100%">
                      <tr style="background-color: #3b8dbd;color:'white'; ">
                    <th style="background-color: white;color:'#3b8dbd'">eff.</th> `;

        if (NRY == false ) {rgstarty=1}

        // en-têtes de colonnes
        for (m=rgstarty ; m<CdMax[vC]+1;m++){

            if (MrgY[m]>0) {
                tabPlain += ModaY[m] + '\t';
                tabhtml += `<th style="background-color: #3b8dbd;"> ` + ModaY[m] + `</th>`;
            }

        }

        tabPlain += 'Total\r\n';
        tabhtml += `
                    <th >Total</th>

                  </tr> `;




        for (l=rgstartx ; l<MrgX.length;l++){

            if (MrgX[l]>0) {
                tabPlain +=  ModaX[l] + '\t';
                tabhtml += '<tr>'
                tabhtml += `<td style="background-color:#3b8dbd;color:'white';">` + ModaX[l] + `</td>`;

                for (c=rgstarty ; c<MrgY.length;c++){

                    if (MrgY[c]>0) {
                        tabPlain +=  Tcr[l][c] + '\t';
                        tabhtml += `<td>` + Tcr[l][c] + `</td>`
                    }

                }

                tabPlain +=  MrgX[l] + '\r\n';
                tabhtml +=  `<td>` + MrgX[l] + '</td></tr>';
            }
        }

        tabPlain +=  'Total\t';
        tabhtml += `<tr> <td style="background-color: #3b8dbd;color:'white';"> Total </td>`

        for (c=rgstarty ; c<MrgY.length;c++){

            if (MrgY[c]>0) {
                tabPlain +=  MrgY[c] + '\t';
                tabhtml += `<td> ` + MrgY[c] + `</td>`
            }

        }
        tabPlain +=  PopTot + '\r\n\r\n';
        tabhtml += `<td> `+ PopTot + ` </td>
                                </tr>`

        tabhtml += `</table> <br>`

    }

    // Pourcentages en lignes
    if (document.getElementById('ChkPL').checked ==true ) {

        tabPlain += '% l.\t';
        tabhtml += `<table style="width:100%"> <br>
            <tr style="background-color: #3b8dbd;color:'white'; ">
              <th style="background-color: white;color:'#3b8dbd'">% l.</th> `

        if (NRY == false ) {rgstarty=1}

        // en-têtes de colonnes
        for (m=rgstarty ; m<CdMax[vC]+1;m++){

            if (MrgY[m]>0) {
                tabPlain += Moda[vC][m] + '\t';
                tabhtml += `<th style="background-color: #3b8dbd;"> ` + Moda[vC][m] + `</th> `
            }

        }

        tabPlain += 'Total\r\n';
        tabhtml += `
          <th >Total</th>

          </tr> `




        for (l=rgstartx ; l<MrgX.length;l++){

            if (MrgX[l]>0) {
                tabPlain +=  Moda[vL][l] + '\t';
                tabhtml += `<tr>`
                tabhtml += `<td style="background-color: #3b8dbd;color:'white';"> ` + Moda[vL][l] + `</td> `

                for (c=rgstarty ; c<MrgY.length;c++){

                    if (MrgY[c]>0) {
                        var PrctX = Tcr[l][c] /MrgX[l]*100;
                        PrctX=PrctX.toFixed(NbDec);
                        PrctX=PrctX.replace( ".",",")

                        tabPlain +=  PrctX + '\t';
                        tabhtml += `<td> ` + PrctX + `</td>`
                    }

                }

                tabPlain +=  '100\r\n';
                tabhtml +=  `
              <td> 100 </td>
              </tr>  `
            }
        }

        tabPlain +=  'Total\t';
        tabhtml += `<tr>
            <td style="background-color: #3b8dbd;color:'white';"> Total </td>`

        for (c=rgstarty ; c<MrgY.length;c++){

            if (MrgY[c]>0) {
                var PrctM = MrgY[c] /PopTot*100;
                PrctM=PrctM.toFixed(NbDec);
                PrctM=PrctM.replace( ".",",")
                tabPlain +=  PrctM + '\t';
                tabhtml += `<td> ` + PrctM + `</td>`
            }

        }
        tabPlain +=  '100\r\n\r\n';
        tabhtml += `<td> 100 </td>
                      </tr>`

        tabhtml += `</table><br>`

    }

    // Pourcentages en colonnes
    if (document.getElementById('ChkPC').checked ==true ) {

        tabPlain += '% c.\t';
        tabhtml += `<table style="width:100%"> <br>
            <tr style="background-color: #3b8dbd;color:'white'; ">
              <th style="background-color: white;color:'#3b8dbd'">% c.</th> `

        if (NRY == false ) {rgstarty=1}

        // en-têtes de colonnes
        for (m=rgstarty ; m<CdMax[vC]+1;m++){

            if (MrgY[m]>0) {
                tabPlain += Moda[vC][m] + '\t';
                tabhtml += `<th style="background-color: #3b8dbd;"> ` + Moda[vC][m] + `</th> `
            }

        }

        tabPlain += 'Total\r\n';
        tabhtml += `
          <th >Total</th>

          </tr> `


        for (l=rgstartx ; l<MrgX.length;l++){

            if (MrgX[l]>0) {
                tabPlain +=  Moda[vL][l] + '\t';
                tabhtml += `<tr>`
                tabhtml += `<td style="background-color: #3b8dbd;color:'white';"> ` + Moda[vL][l] + `</td> `

                for (c=rgstarty ; c<MrgY.length;c++){

                    if (MrgY[c]>0) {
                        var PrctX = Tcr[l][c] /MrgY[c]*100;
                        PrctX=PrctX.toFixed(NbDec);
                        PrctX=PrctX.replace( ".",",")

                        tabPlain +=  PrctX + '\t';
                        tabhtml += `<td> ` + PrctX + `</td>`
                    }

                }

                PrctX = MrgX[l]/PopTot*100;
                PrctX=PrctX.toFixed(NbDec);
                PrctX=PrctX.replace( ".",",")

                tabPlain +=  PrctX + '\r\n';
                tabhtml +=  `
              <td>`+ PrctX + `</td>
              </tr>  `
            }
        }

        tabPlain +=  'Total\t';
        tabhtml += `<tr>
            <td style="background-color: #3b8dbd;color:'white';"> Total </td>`

        for (c=rgstarty ; c<MrgY.length;c++){

            if (MrgY[c]>0) {

                tabPlain += '100\t';
                tabhtml += `<td> 100 </td>`
            }

        }
        tabPlain +=  '100\r\n\r\n';
        tabhtml += `<td> 100 </td>
                      </tr>`

        tabhtml += `</table> <br>`

    }


    // Pourcentages du total
    if (document.getElementById('ChkPT').checked ==true ) {

        tabPlain += '% tot.\t';
        tabhtml += `<table style="width:100%"> <br>
            <tr style="background-color: #3b8dbd;color:'white'; ">
              <th style="background-color: white;color:'#3b8dbd'">% tot.</th> `

        if (NRY == false ) {rgstarty=1}

        // en-têtes de colonnes
        for (m=rgstarty ; m<CdMax[vC]+1;m++){

            if (MrgY[m]>0) {
                tabPlain += Moda[vC][m] + '\t';
                tabhtml += `<th style="background-color: #3b8dbd;"> ` + Moda[vC][m] + `</th> `
            }

        }


        tabPlain += 'Total\r\n';
        tabhtml += `
          <th >Total</th>

          </tr> `


        for (l=rgstartx ; l<MrgX.length;l++){

            if (MrgX[l]>0) {
                tabPlain +=  Moda[vL][l] + '\t';
                tabhtml += `<tr>`
                tabhtml += `<td style="background-color: #3b8dbd;color:'white';"> ` + Moda[vL][l] + `</td> `

                for (c=rgstarty ; c<MrgY.length;c++){

                    if (MrgY[c]>0) {
                        var PrctX = Tcr[l][c] /PopTot*100;
                        PrctX=PrctX.toFixed(NbDec);
                        PrctX=PrctX.replace( ".",",")

                        tabPlain +=  PrctX + '\t';
                        tabhtml += `<td> ` + PrctX + `</td>`
                    }

                }

                PrctX = MrgX[l]/PopTot*100;
                PrctX=PrctX.toFixed(NbDec);
                PrctX=PrctX.replace( ".",",")

                tabPlain +=  PrctX + '\r\n';
                tabhtml +=  `
              <td>`+ PrctX + `</td>
              </tr>  `
            }
        }
        tabPlain +=  'Total\t';
        tabhtml += `<tr>
            <td style="background-color: #3b8dbd;color:'white';"> Total </td>`

        for (c=rgstarty ; c<MrgY.length;c++){

            if (MrgY[c]>0) {

                PrctX = MrgY[c]/PopTot*100;
                PrctX=PrctX.toFixed(NbDec);
                PrctX=PrctX.replace( ".",",")

                tabPlain +=  '100\t';
                tabhtml +=  `
              <td> 100 </td>
               `

            }

        }


        tabPlain +=  'PopTot\r\n\r\n';
        tabhtml += `
              <td>`+ PopTot + `</td>
              </tr>  `

        tabhtml += `</table> <br>`

    }



    // pied

    /*
     var champ = "Population totale (n=" + PopTot + ")";

      if (EstVu("BlocFiltre")==true) {
      champ = ChampFiltre() + " (n=" + PopTot + ")";
      }

      strpied=`<div class = "piedtab" style="font-size:9px;">
        Source : ` + nomBase + `<br>
        Champ : ` + champ + `<br> `

        if (vP!=0){
      strpied+=` Var. Pond. : ` + Libellé[vP]  + `<br>`
      }

        strpied+=`Khi² : ` + Khi2.toFixed(NbDec) + `
        proba : ` + proba + "  " + signif + " <br> V de Cramér : " + vcram + " </p>";
      */

    tabPlain += strPiedPlain;
    tabhtml += strPiedPlain;

    CopiePressePapier(tabhtml, tabPlain);

    alert("Le tableau a bien été copié")
}


/////////////////////////////////////////////////////////////////////////////////////////
// Extraction de colonne
/////////////////////////////////////////////////////////////////////////////////////////

function ExtractCol(c,NRC, v2,m2){ //c=colonne  de la base à extraire , v2= 2èvariable conditionnant l'affichage, m2 = modalité de la deuxième variable


    Colonne=[]
    var nblig = BDD.length
    var l=0
    var rgl=Reco[c]

    // les non réponses sont-elles incluses? <- dorénavant passé en paramètre
    //NRC = document.getElementById('ChkNRX').checked

    // défilement des lignes
    for (l=0 ;l < nblig; l++) {

        if (String(BDD[l][c]) ==' '){continue;}// évitement des valeurs nulles
        if (Number(BDD[l][c])==0 && NRC==false ){continue;}// évitement des zéros (si choisi)

        if (v2> 0) {

            if (Number(BDD[l][v2]!=m2)){continue;}// prise en compte d'une seconde variable
        }

        var valmod = Number(BDD[l][c]); // récupération de la valeur dans la base

        // application du recodage éventuel
        if (rgl.trim() !='') {valmod=ValApRec(valmod,rgl)}

        // prise en compte de la pondération
        var coeffp=1;

        if (vP !=0) {
            coeffp = BDD[l][vP]
            valmod=valmod*coeffp
        }


        
         

        //filtrage
        if (EstVu('BlocFiltre')!=0 && Filtrer(l) == false ) { continue}



        Colonne.push(valmod)

    }



    return Colonne;

};




////////////////////////////////////////////////////////////////////////////////////////////////////////
// Analyse d'un colonne pour déterminer le type de variable
///////////////////////////////////////////////////////////////////////////////////////////////////////

function QuelTypVar(c){




    var m;
    var typ = 'e';

    // défilement des libellés
    for (m=0;m < CdMax[c];m++) {


        if (isNaN(Moda[c][m])==true) {typ= 'a';} // la colonne est alphanumérique

    }

    var rgl=Reco[c]


    var nblig = BDD.length -1;
    var l=0;

    // défilement des lignes
    for (l=0 ;l < nblig; l++) {


        // la variable est-elle qualitative?

        // si la variable est numérique, est-elle entière ou réelle
        if (String(BDD[l][c]) ==' '){continue;}// évitement des valeurs nulles

        var valmod = parseFloat(BDD[l][c]); // récupération de la valeur dans la base

        // application du recodage éventuel
        if (rgl != "") {valmod=ValApRec(valmod,rgl);}

        // recherche de valeur décimale
        valmod=String(valmod);
        var virg=valmod.indexOf(".");
        if (virg != '-1') {typ = 'r';break;} // la colonne contient au moins un nombre réel

    }


    //le vecteur ne contient ni alpha, ni nombre réel, ce sont donc des nombres entiers
    return typ;


};


/////////////////////////////////////////////////////////////////////////////////////////
// Tri tableau ( tri à bulle)
////////////////////////////////////////////////////////////////////////////////////////

function triTableau(Tableau, col, type, sens) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(Tableau);
    switching = true;
    /*Make a loop that will continue until
no switching has been done:*/



    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
first, which contains table headers):*/
        for (i = 1; i < (rows.length - 2); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
  one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[col];
            y = rows[i + 1].getElementsByTagName("TD")[col];




            //check if the two rows should switch place:
            if (type == 'txt') {

                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() && sens=='asc' || x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase() && sens=='desc') {
                    //if so, mark as a switch and break the loop:

                    shouldSwitch = true;
                    break;

                }

            }

            if (type == 'val') {
                var valx = x.innerText;
                var valy = y.innerText;

                if (Number(valx) > Number(valy) && sens=='asc' || Number(valx) < Number(valy) && sens=='desc' ) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }

        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
  and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
// Tri par tas (source : https://fr.wikibooks.org/wiki/Impl%C3%A9mentation_d%27algorithmes_classiques/Algorithmes_de_tri/Tri_par_tas)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function echanger (col, a, b) {
    var temp = col[a];
    col[a] = col[b];
    col[b] = temp;


}


function tamiser (col, noeud, n) {
    var k = noeud;
    var j = 2 * k;
    while (j <= n) {
        if ((j < n) && (col[j] < col[j + 1]))
            j++;
        if (col[k] < col[j]) {
            echanger(col, k, j);
            k = j;
            j = 2 * k;
        } else
            break;
    }
}

function TriParTas (col) {

    for (var i = col.length >> 1; i >= 0; i--)
        tamiser(col, i, col.length - 1);
    for (var i = col.length - 1; i >= 1; i--) {
        echanger(col, i, 0);
        tamiser(col, 0, i - 1);
    }
}


/////////////////////////////////////////////////////////////////////////////////////////
// Tris des modalités
/////////////////////////////////////////////////////////////////////////////////////////
function TriGnrModas(type, sens) {

    var nbm= CdMax[vL]

    var TabTap = new Array(nbm)


    for (m=0;m<nbm+1; m++){
        TabTap[m]=new Array(2);
        TabTap[m][0]=m;
        TabTap[m][1]=Moda[vL][m];
        TabTap[m][2]=TapX[m];
    }




    TriParTasMods (TabTap,type)



    // Inversion du tri en cas de sens décroissant
    if(sens=='d') {

        for (t=0;t<TabTap.length/2;t++) {
            var t2 = TabTap.length - t -1
            var temp = TabTap[t]
            TabTap[t] = TabTap[t2]
            TabTap[t2] =temp;

        }

    }



    var nbm= TapX.length

    var matRec = new Array (TapX.length)

    // réécriture des modalités
    for (m=0;m<TabTap.length; m++){

        // nouvel valeur au rang considéré
        //var rg = TabTap[m][0]
        //alert(rg + " -> " + ModaTemp[rg] )
        Moda[vL][m] = TabTap[m][1]
        matRec[TabTap[m][0]]  = m;
    }

    for (l=0;l< BDD.length; l++) {

        var valmod=Number(BDD[l][vL]);
        var valrec= matRec[valmod]

        BDD[l][vL] = valrec

    }



    T_A_P()


}


function tamiserMods (TaP,c, noeud, n) {


    var k = noeud;
    var j = 2 * k;
    var valj;
    var valjp;
    var valk;

    while (j <= n) {



        if ((j < n) && (TaP[j][c] < TaP[j+1][c]))
            j++;


        //if (c==1){

        //valj = TaP[j][c];
        //valjp = TaP[j+1][c];

        //valk = TaP[k][c];

        //}



        if (TaP[k][c] < TaP[j][c]) {

            echanger(TaP, k, j);
            k = j;
            j = 2 * k;
        } else
            break;
    }


}

function TriParTasMods (TaP,c) {


    var nbm = TaP.length-1
    for (var i = nbm; i >= 0; i--)

        tamiserMods(TaP,c, i, nbm);

    for (var i = TaP.length - 1; i >= 1; i--) {
        echanger(TaP, i, 0);
        tamiserMods(TaP, c, 0, i - 1);
    }


}


/////////////////////////////////////////////////////////////////////////////////////////
// Tris des lignes de la base
/////////////////////////////////////////////////////////////////////////////////////////
function TriBDD(vT) {




    TriParTasBDD (vT)

    var sens='a';

    if (vT == varTriBDD) {
        if (sensTriBDD=='a') {sens='d'} else {sens='a'}
    }

    sensTriBDD= sens
    varTriBDD = vT;

    // Inversion du tri en cas de sens décroissant
    if(sens=='d') {

        for (t=0;t<BDD.length/2;t++) {
            var t2 = BDD.length - t -1
            var temp = BDD[t]
            BDD[t] = BDD[t2]
            BDD[t2] =temp;

        }

    }



    Vidage('TabBDD');
    B_A_S_E();



}


function tamiserBDD (c, noeud, n) {


    var k = noeud;
    var j = 2 * k;


    while (j <= n) {


        if ((j < n) && (BDD[j][c] < BDD[j+1][c]))
            j++;



        if (BDD[k][c] < BDD[j][c]) {

            echanger(BDD, k, j);
            k = j;
            j = 2 * k;
        } else
            break;
    }


}

function TriParTasBDD (c) {


    var nbm = BDD.length-1
    for (var i = nbm; i >= 0; i--)

        tamiserBDD(c, i, nbm);

    for (var i = nbm; i >= 1; i--) {
        echanger(BDD, i, 0);
        tamiserBDD(c, 0, i - 1);
    }


}


function Vidage() { // Effacement des tris précédents

    // masque de la zone de texte d'édition
    document.getElementById("txtModifCase").style.display='none';

    for (i = 0; i < arguments.length; i++) {


        if (document.getElementById(arguments[i])) {
            var elmnt = document.getElementById("Titre");
            elmnt.remove();
            var elmnt = document.getElementById(arguments[i]);
            elmnt.remove();
            var elmnt = document.getElementById("Pied");
            elmnt.remove();

        }

    }

};


// réaffichage du TCR en cas de changement des options
document.getElementsByClassName('ChkNR').onclick = function() {
    QuelTri();
}




function ChargerFiltre() {

    var z = vF ;

    VoirBloc('OptFiltre')

    document.getElementById("Combo4").options.length = 0;

    for (m=0;m<= CdMax[z];m++) {
        document.getElementById("Combo4").options[m]=new Option( Moda[z][m] , m , true, false);
    }

    document.getElementById("Combo4").size = 5;

}


function Filtrer(ligne) {
    
    // ancienne procédure

    /*var z = vF; 

    var val = Number(BDD[ligne][z]);

    var select = document.getElementById( 'Combo4' );

    if (select.options[val].selected) {return true;} else {return false;}

    */

    // procédure multi variée
  
    
    if (ExpFltr=="0") {return true} // s'il n'y a pas de filtre, on valide sans chercher

    var out=false; // par défaut la ligne n'est pas filtrée
     
    for (f=0;f<ExpFltr.length;f++) {
            
         
        var rgl=ExpFltr[f]
         

        if(rgl!=undefined && rgl!=0) { // s'il y a une règle

            //split des conditions de filtrage
            var sstab=rgl.split("/");    
            
            var nonc = false; // par défaut la modalité est exclue

            for (f2=0;f2<sstab.length;f2++) { // boucle sur les conditions
                
                
                //extraction des critères
                var crit=sstab[f2].split("-")
                
                
                var varf = crit[0] ;
                var modf = crit[1] ;
                var actf=true;
                actf = crit[2] ;
                

                var valmod = BDD[ligne][varf] ;

                
                
                if(valmod!=modf) { // la ligne est-elle concernée par le filtre (si la valeur )
                    nonc=true // si oui, non concernée
                }



            }   

            if (nonc==false){out=true ;}  
        
        }
        
        
    }
    
 if (out==true) {return false} else {return true} 
 


}

function ChampFiltre(){

    if (ExpFltr!=[]) {
        return "filtre actif";
    } else {
        return "population totale";
    }

/*
    var z = vF;

    var champ =
        champ= "Filtre : " + Libellé[z].substr(0,Libellé[z].length-2) + " ( ";

    var select = document.getElementById( 'Combo4' );

    for (l=0; l<=CdMax[z]; l++) {
        if (select.options[l].selected) {champ = champ + " " + select.options[l].text + "/" ; }
    }
    champ=champ.substr(0,champ.length-1) + " ) ";

    return champ;

    */
}

/* Détermination du type de tri en fonction des éléments affichés*/
function QuelTri() {
 
     
    if (TypTri=='base'){B_A_S_E();}
    if (TypTri=='tap'){T_A_P();}
    if (TypTri=='exp'){E_X_P();}
    if (TypTri=='tcr'){T_C_R();}


   // if (EstVu('BlocVar2')==0) {T_A_P();} else {T_C_R(vL,vC);}

}


/* Voir bloc */
function VoirBloc(Bloc) {



    document.getElementById(Bloc).style.display = "block";

    if (Bloc=='BlocVar2') {document.getElementById('BlocVar').style.display = "block";}
    if (Bloc=='BlocEXP') {
        document.getElementById('BlocVar').style.display = "none";
        document.getElementById('BlocVar2').style.display = "block";
    }

    //décalage du contenu vers le bas
    //document.getElementById('contenu').style.marginTop = document.getElementById('hautpage').offsetHeight + 30
    CaleSsHead()
}

/* Cacher bloc */
function CacheBloc(Bloc) {

    document.getElementById(Bloc).style.display = "none";

    //décalage du contenu vers le haut
    //document.getElementById('contenu').style.marginTop = document.getElementById('hautpage').offsetHeight + 30

    CaleSsHead()
}

function VoirOpt(Bloc){


    if (EstVu(Bloc)!=false){document.getElementById(Bloc).style.display = "none";
    } else {document.getElementById(Bloc).style.display = "block";
        document.getElementById(Bloc).style.animation = "voiropt 0.5s;"}

    CaleSsHead();
}

/*Un bloc est-il visible?*/
function EstVu(Bloc) {

    var x = document.getElementById(Bloc);
    if (window.getComputedStyle(x).display === "none") {
        return 0;} else {return 1;}

}

function cacheOptions() {
    document.getElementById("OptVar1").style.display = "none"
    document.getElementById("OptVar2").style.display = "none"
    document.getElementById("OptVar3").style.display = "none"
} 

function VoirPann() {
 if (EstVu('BlocFiltre')) {
    document.getElementById('BlocFiltre').style.display = "none"
 } else {
        if (EstVu('BlocEXP')==false) { // pas avec l'explorateur (redondant)
        document.getElementById('BlocFiltre').style.display = "block";
        }
    }
}

function croisetotal() {

    wait("Analyse en cours. Merci de patienter "); // affichage de l'indicateur de chargement

    for (v=1;v<Nom.length;v++) {

       if(TypVar[v]=="a"){ T_C_R(vL,v,false)};
       document.getElementById('v'+v).style.backgroundColor = "rgba(10,200,255,0.5)"
    }

    endWait()
}