//////////////////////////////////////////////////////////////////////////////////
// Variables utilisées pour les analyses factorielles
/////////////////////////////////////////////////////////////////////////////////

var AF_listV=[]; // Variables prises en compte dans l'AF
var AF_listM=[0]; // modalités prises en compte dans les AF (v, m,  A/S, marge, phi, cos²)
var AF_nbv = 0; // Nombre de variables impliquées dans l'AF
var NbmAct = 0; // Nombre de modalités actives impliquées dans l'AF
var NbmSup = 0; // Nombre de modalités actives impliquées dans l'AF
var AF_nbfac=3; // Nombre de facteurs
var AF_VP=[]; // valeurs propres des facteurs
var AF_PCT = []; // % de l'inertie des facteurs
var BURT=[]; // tableau de Burt
var T1=[] ; // tableau des restes (calculs intermédiaires - même structure que le burt)
var V1=[] ; // vecteur des lignes
var V2=[] ; // vecteur des colonnes
var tabcoulsAF = ['#225979', '#225979','rgb(39, 138, 63)','rgb(253, 122, 0)', 'rgba(148, 67, 111, 0.685)', '#b91a1a', '#34376f', '#0441f9','#8287ff', '#c1baf0', '#409355',' #72c687', '#adfbc1','#225979','#4b82a2','#3a9ed9', '#4fbeff', '#34376f', '#4b50a2a8','#8287ff', '#c1baf0', '#409355',' #72c687', '#adfbc1']
var FautBURT=true; // faut-il recharger le tableau de BURT? 

var OrigX0, OrigX1 // coordonnées du centre du repère (précédentes 0 et actuelles 1)
var OrigY0, OrigY1
var xmin =0;
var xmax = 0;
var ymin = 0;
var ymax = 0; 
var amplX = 0;
var amplY = 0;
var PixParPt =0; 

var TabPtAf0 = [] // tableau des points du plan factoriel 
var TabPtAf1 = [] // tableau des points du plan factoriel 
var TabPtSelAf=[] // tableau des points sélectionnés sur le plan

// pour le déplacement du plan factoriel
var dragAF=false;
var OrigXs=0;
var OrigYs=0;
var x0s, y0s; 
 
// pour le déplacement des points
var mouvAF=false;
var TabPtDplAf=[] // tableau des points DEPLACES sur le plan

// pour le filtrage par CPF
var CPFMin=0;

//var CDG=[]; // Tableau disjonctif complet ("codage logique")

    //////////////////////////////////////////////////////////////////////////////////
    // Résultats 
    //////////////////////////////////////////////////////////////////////////////////
    var PHI2 = 0 // phi2 
    var SCAR = 0 // somme des carrés des écarts
    var ResteMax= 0; // reste maximum 
    var Fac=[]; // Facteurs  (Rang, moda, coord, CPF)


//////////////////////////////////////////////////////////////////////////////////
// Affichage de la page des analyses factorielles
/////////////////////////////////////////////////////////////////////////////////

function prepA_F() {

    TypTri="af"
    


        Vidage() // On vide tous les contrôles

        if (EstVu('BlocEXP')!=0) {CacheBloc('BlocEXP');}
        if (EstVu('BlocVar')!=0) {CacheBloc('BlocVar');}
        if (EstVu('BlocVar2')!=0) {CacheBloc('BlocVar2');}

         
 
    // création du cadre de fond 
    var body = document.body
    
    var tbl = document.createElement('div');
    tbl.id = 'TabAF';
    var lrg = window.innerWidth-80;
    lrg +="px"
    var ht= window.innerHeight-130;
    ht+="px"
    tbl.style.width  = lrg; 
    tbl.style.top="120px"
    tbl.innerHTML = `
    
    <div class="row">

        <div class="col-sm-3" id="listvaraf" class="panneauAF">


        <div class="ChoixVar" id="BlocAF" style="display:block;margin-top:0px;!important" >

        <div class="input-group-prepend">
            
            <span class="input-group-text"><img src='Images/\Lig.PNG'  alt="var" onclick="openVars('AF');"></span>

            <input onclick="openVars('AF');ExpRgDp=0" id= "TxtAF" type="text" class="form-control" placeholder="Choisissez les variables" >


           
            <button id="BtnOptL" class="btn btn-outline-secondary imgbtn imgcog selectHide" onclick="VoirOpt('OptAF')"  type="button"></button>
            
            <!-- <button class="btn btn-outline-secondary imgbtn imgclose selectHide"  onclick= "prepTAP()" type="button"></button> !-->
            
        </div>

        <div  class="selectHide" id='OptAF' style='float: left; margin-left: 5px;margin-top: 10px;margin-bottom: 10px;margin-right:5px; display: none;animation: voiropt 0.10s;width:100%'>


            <div class="custom-control custom-switch" style='float: left;margin-left: 0px;;margin-right: 15px;'>
                <input type="checkbox" class="custom-control-input" id="ChkNRAF"  onclick="AF_listM=[0];LancerListMod()"> 
                <label class="custom-control-label" for="ChkNRAF" style="padding-top:0px; !important">Non réponses (0)</label>
            </div>

            <label for="ChkACPM" style='float: left;margin-right: 5px;margin-top: 3.2px;display:none;'> ACP</label>

            <div class="custom-control custom-switch" style='float: left;margin-right: 25px;display:none;'>
                
                <input type="checkbox" class="custom-control-input" id="ChkACPM" checked="true" onclick="LancerListMod()"> 
                <label class="custom-control-label" for="ChkACPM">ACM</label>
            </div>


            <div class="btn-group btn-group-sm" style="float:right">

                <button type="button"  class="btn btn-outline-secondary"style="font-size: 0.75em" disabled>Facteurs</button>
                <button type="button" class="btn btn-outline-primary" style="font-size: 0.5em" onclick="ChgNbF('-')">-</button>
                <button type="button" id= "BtnFac" class="btn btn-primary"style="font-size: 0.75em" disabled>3</button>
                <button type="button" class="btn btn-outline-primary"style="font-size: 0.5em"onclick="ChgNbF('+')">+</button>


            </div>

           
            


        </div>

            
        </div>

         

 

            <div id="ModsAF" style="overflow-y: scroll; border:1px solid rgb(230,230,230);"> 

            </div>

            <div  id = "infoAF" style="border:1px solid rgb(230,230,230);padding-left:15px;font-size:0.85rem;color:rgb(100,100,100)"> 
            0 variable | 0 moda active | 0 suppl. 

            </div>

            

         

           <button class="btn btn-outline-primary"  style = "float:left;width:100%;margin-top:15px" onclick= "LancerAF(true)" type="button">Lancer</button>
       
    </div>

        


    <div class="col-sm-9" id = "contenuAF" style="padding:0px">
    
        <div id = "fondplanFac"  style = "width:` + lrg  + `; height:` + ht + `">

            <canvas id="planFac"  width="` + lrg  + `"  height="` + ht + `" style=""  onmousedown="Af_drag0(event)" onmousemove = "Af_drag(event)" onmouseup="Af_drag1()" onmouseleave = ""  ondblclick = "FullScreen()"></canvas>

            <button id = "ZoomAFP" class="btn btn-outline-secondary btn-sm imgbtn imgplus"  onclick= "zoomAF('1')" type="button" style="position: absolute; top: 15px; left: 20px;";  ></button>

            <button id = "ZommAFM" class="btn btn-outline-secondary btn-sm imgbtn imgminus"  onclick= "zoomAF('-1')" type="button" style="position: absolute; top: 50px; left: 20px;";  ></button>

            <button id="BtnOpPlF" class="btn btn-outline-secondary btn-sm imgbtn imgcog selectHide" onclick="VoirOpt('OptplanFac')"  type="button" style="position: absolute; top: 85px; left: 20px;width:32px;height:32px";></button>


            <div  class="selectHide" id='OptplanFac' style='position: absolute; top: 130px; left: 20px; width: 240px !important; height:auto; background-color:rgba(255,255,255,0.7); display: none;animation: voiropt 0.10s;width:100%'>


            <div class="custom-control custom-switch" style='margin-left: 0px;;margin-right: 15px;'>
                <input type="checkbox" class="custom-control-input" id="ChkContrib" checked="true" onclick="AffPlanFac(99)"> 
                <label class="custom-control-label" for="ChkContrib" style="padding-top:0px; !important"> Contribs.</label>
           

            <div class="btn-group btn-group-sm" style="float:right">

            <button type="button"  class="btn btn-outline-secondary"style="font-size: 0.75em;margin-left:5px" disabled>Min.</button>
            <button type="button" class="btn btn-outline-primary" style="font-size: 0.75em" onclick="ChgCPFMin('-');AffPlanFac(99)">-</button>
            <button type="button" id= "BtnCPFmin" class="btn btn-primary"style="font-size: 0.75em" disabled>0</button>
            <button type="button" class="btn btn-outline-primary"style="font-size: 0.75em"onclick="ChgCPFMin('+');AffPlanFac(99)">+</button>


            </div>

            </div>

            <div class="custom-control custom-switch" style='margin-left: 0px;;margin-right: 15px;'>
            <input type="checkbox" class="custom-control-input" id="ChkPrefix"   onclick="AffPlanFac(99)"> 
            <label class="custom-control-label" for="ChkPrefix" style="padding-top:0px; !important"> Nom var. </label>
            </div>

            <div class="custom-control custom-switch" style='margin-left: 0px;;margin-right: 15px;'>
            <input type="checkbox" class="custom-control-input" id="ChkPrefixL" onclick="AffPlanFac(99)"> 
            <label class="custom-control-label" for="ChkPrefixL" style="padding-top:0px; !important; margin-bottom: 10px"> Lib. var. </label>
            </div>

            <div>
            <label style="float:left; padding:5px;margin-right:2px"> X : </label>
            <select id="choixAxeX" class="custom-select"  style = "float:left;margin-bottom: 2px;width:80px;font-size:1rem;" onchange='ExtremasAF();AffPlanFac(0)'>
            <option value="0" selected>fac. 1</option>
            <option value="1">fac. 2</option>
            <option value="2">fac. 3</option>s
            <option value="3">fac. 4</option> 
            <option value="4">fac. 5</option>
                       
            </select>  

            </div>

            <div>
            <label style="  float:left; padding:5px;margin-right:2px"> Y : </label>
            <select id="choixAxeY" class="custom-select"  style = "float:left;margin-bottom: 2px;width:80px;font-size:1rem;" onchange='ExtremasAF();AffPlanFac(0)'>
            <option value="0">fac. 1</option>
            <option value="1" selected >fac. 2</option>
            <option value="2">fac. 3</option>s
            <option value="3">fac. 4</option> 
            <option value="4">fac. 5</option>
                       
            </select>  

            </div>

        </div>


        <div id="detailfacteurs"> </div>

        </div>
     
     </div> 
    
    `
     
    // onwheel = "zoomAF(event)"


    document.getElementById('contenu').appendChild(tbl);

    //document.getElementById('planFac').addEventListener("DOMMouseScroll", zoomAF, false);

    CaleSsHead();

    // définition des dimensions du panneau latéral
    var panneau = document.getElementById("ModsAF");
    var Pos = panneau.getBoundingClientRect();
    var topcdr= window.innerHeight - Pos.top - 95; 
    topcdr +="px"

    panneau.style.minHeight = topcdr ;
    panneau.style.maxHeight = topcdr ;

     

    // définition des dimensions du graph
    var canvas = document.getElementById("planFac");
    var Pos = canvas.getBoundingClientRect();
    var larcdr=window.innerWidth - Pos.left - 30;
    canvas.width = larcdr; 
    var topcdr=Pos.top; 
    canvas.height = window.innerHeight - topcdr  ;

 

if (AF_listM.length>1){LancerListMod()}

ExtremasAF()
AffPlanFac(0)





}

function LancerListMod() {
     
    wait("Chargement des modalités...")
     
    setTimeout(ListMods, 10);
   

}

function ListMods() {

 

    // les non réponses sont-elles incluses?
    var NRAF = document.getElementById('ChkNRAF').checked
      

    // suppression des variables éventuellement retirées
    var nbmods=AF_listM.length;

    for (l=nbmods-1;l>0;l--){

        var vAF = AF_listM[l][1]
        
        if (VdsAF[vAF]==false || AF_listM[l][2]==0 && NRAF==false ) {

           AF_listM.splice(l,1);
          

        }

        

    }

    AF_nbv=0;
    // décompte des variables encore présentes
    for (v=0;v<VdsAF.length+1;v++){
        if (VdsAF[v]==true) AF_nbv++;
    }

    nbm = AF_listM.length-1;


     
    // ajout des nouvelles variables éventuelles
    for (v=0;v<VdsAF.length+1;v++){

        
        
            if (VdsAF[v]==true && VdslistAF(v)==false ) {
             
                var VarMul = EstMulti(v);
                if (VarMul[0]==true){alert("La variable " + Nom[v] + " est multiple. Elle ne peut pas être ajoutée à l'ACM"); VdsAF[v]==false; continue}

                //AF_nbv++;

               
                // tri à plat de la variable
                CréerTapX(v)

                // évitement ou non des codes 0
                var RgDp=0;
                if (NRAF==false){RgDp=1};

                 
                // ajout des lignes au tableau des modas
                for (m=RgDp;m<CdMax[v]+1;m++) {
                    
                    if (TapX[m]>0){
                        
                        nbm++;
                    
                         
                        AF_listM.push(v);
                        AF_listM[nbm] = new Array(16);
                        AF_listM[nbm][0] = Moda[v][m] ; // variables
                        AF_listM[nbm][1] = v ; // variables
                        AF_listM[nbm][2] = m ; // modalités
                        AF_listM[nbm][3] = true ; // active (sup=false)
                        AF_listM[nbm][4] = 0 ; // Marge 
                        AF_listM[nbm][5] = 0 ; // Inertie (INRI dans trideux) = Somme des contributions
                        AF_listM[nbm][6] = 0 ; // Cos²
                        AF_listM[nbm][7] = 0 ; // coord du facteur 1
                        AF_listM[nbm][8] = 0 ; // contrib du facteur 1
                        AF_listM[nbm][9] = 0 ; // coord du facteur 2
                        AF_listM[nbm][10] = 0 ; // contrib du facteur 2
                        AF_listM[nbm][11] = 0 ; // coord du facteur 3
                        AF_listM[nbm][12] = 0 ; // contrib du facteur 3
                        AF_listM[nbm][13] = 0 ; // coord du facteur 4
                        AF_listM[nbm][14] = 0 ; // contrib du facteur 4
                        AF_listM[nbm][15] = 0 ; // coord du facteur 5
                        AF_listM[nbm][16] = 0 ; // contrib du facteur 5
                           
                        

                        
                        
                    }

                }
 
                 
            }

    }

    var chn=""
    for (l=0;l<AF_listM.length; l++){
    chn += AF_listM[l] + " \n " 
    }
    //alert(chn)
    //alert("il y a " + AF_listM.length-1 + "lignes")

    AffListMods()
    //AffPlanFac()

};

function AffListMods() {

    // vidage des anciennes chkbox
    document.getElementById("ModsAF").innerHTML=` 
    <div class="custom-control custom-checkbox chkvaraf" style="float:left; margin: 5px; border: none;">
    <input type="checkbox" class="custom-control-input" id="ChkVAf" checked  disabled >
    <label class="custom-control-label" for="ChkVAf"  style="white-space:nowrap;z-index:0"> Actives </label>
                        
                        
    </div>

    <button id="BtnEditM" class="btn btn-outline-secondary imgbtn imgpen " onclick="ChngVisible(0); EditModAF();";   type="button" style ="float:right;margin:5px; "></button>`


    nbm=0; // nombre de modas

      
    // inventaire des variables prises en compte
    var vcur = -1;
    var chn = "";
    var chnstyle= "";
    var nbv = 0;
 
    // définition de la position à droite des boutons dans le panneau latéral
    var posbtn=document.getElementById("ModsAF").clientWidth - 37;


    for (l=1;l<AF_listM.length; l++){
       
         

    var v= AF_listM[l][1];
        
        if (v!=vcur){

            if(l!=1) { chn += "<br>"}

             
                // tri à plat de la variable
                CréerTapX(v)
                 
                chn += `<div style="display:inline-flex"> 
                    <div class="custom-control custom-checkbox chkvaraf" style="margin-left: 5px; width: ` + posbtn + `px" >
                        <input type="checkbox" class="custom-control-input" id="ChkVAf` + v + `" checked  >
                        <label class="custom-control-label" for="ChkVAf` + v + `"  onmouseover = "selPtAf(` + v + `)"   onmouseup = "AF_StatutV(` + v + `)" onmouseleave = "videPtAf()" style="white-space:nowrap;z-index:0;color:` + tabcoulsAF[nbv+1] + ` ">` + Nom[v] + ` |  ` + Libellé[v] + ` </label>
                        
                        
                    </div>
                    
                    <button id="BtnVAf` + v + `" class="btnfonction imgbtn-xs imghaut" onclick= "ChngVisible(` + v + `);" type="button" style="margin:8px;left:` + posbtn + `px;cursor:pointer; height:20px;width:20px; border: 1px solid white;z-index:1"></button>
                </div>`;

                vcur=v;
                nbv++;

                // <img src='CSS/\caret-bas.png' alt="déployer" style="margin:5px;left:` + posbtn + `px;cursor:pointer;z-index:999;height:10px;" ></img>
        }
                
                
        
        
        
        var chnstyle= "background-color:" + tabcoulsAF[nbv] + ";";

            var m = AF_listM[l][2];

            var chkd = "checked";
            

            var ratiow= TapX[m] / PopTot * 100;
            ratiow=Math.round(ratiow);

             chnstyle += "width:" + ratiow + "%"

            if (AF_listM[l][3] == false ) {chkd="";} 

                        chn += `<div id="ligModAf` + l + `" class="custom-control custom-checkbox lngmodaf d-none"  onmouseover = "selPtAf(` + v + `,`+ m + `)" onmouseleave = "videPtAf()">
                            <input type="checkbox" class="custom-control-input chkmodaf" id="ChkMAf` + l + `" ` + chkd + ` >
                            <label  id="LblMAf` + l + `" class="custom-control-label" for="ChkMAf` +l+ `"  onmouseup = "AF_StatutM(` + l + `)" style="white-space:nowrap;" >` + AF_listM[l][0]  + ` </label>
                            <label class = "barrepctaf" id="pctMAf` + l + `" style="`+ chnstyle + `"> </label>
                            <input type="text" class="TxtModAF d-none" id="TxtModAF` +  l + `" onkeyup="MàJModAF(event,`+ l +`)" placeholder ="` + AF_listM[l][0] + `"
                                style= "position:fixed;
                                position: absolute;
                                left: 20px;
                                height: 25px;
                                width: ` + (posbtn - 10) + `px;
                                z-index:100;">
                        </div>`;


                                    

    }

     
    compteModsAf() // décompte des modalités
   

    document.getElementById("ModsAF").innerHTML+=chn;

    FautBURT=true; // il faut recalculer le BURT

    endWait();
     
}

function VdslistAF(v) {

    for (l=1;l<AF_listM.length;l++){

        if (AF_listM[l][1]==v){
             
            return true;
            
        }

    }

    return false;


}

function ChngVisible(v) { // affiche ou masque les modalités

    

    var voir=false;
   
    for (l=1;l<AF_listM.length; l++){
       
        var vl= AF_listM[l][1];

        if (vl==v || v==0){
            var nomlig="ligModAf"+l;
            var ctrlig= document.getElementById(nomlig);

            // variable par variable
            if (v>0) {

                if (ctrlig.classList.contains("d-none")){
                    $("#"+nomlig).removeClass("d-none");
                    voir=true;
                } else {
                    
                    $("#"+nomlig).addClass("d-none");
                    voir=false;
                }
            } else {

            // toutes les variables  (ouverture forcée)   
                if (ctrlig.classList.contains("d-none")){
                    $("#"+nomlig).removeClass("d-none");
                    voir=true;
                } 

            }

        }
    }
    
    var nombtn = "#BtnVAf" + v 
    if (voir==true) {
        $(nombtn).removeClass("imghaut");
        $(nombtn).addClass("imgbas");

    } else {
        $(nombtn).removeClass("imgbas");
        $(nombtn).addClass("imghaut");

    }

    
}
function ChgNbF(sens) {
    if(sens=="+") {AF_nbfac++} else {AF_nbfac--}
    document.getElementById("BtnFac").textContent=AF_nbfac;
    if (FautBURT==false) {
    Facteurs();
    }

}
function compteModsAf() {

     // suppression des variables éventuellement retirées
     var nbmods=AF_listM.length;
      NbmAct =0;
      NbmSup =0 ;

     for (l=nbmods-1;l>0;l--){
 
                
        if (AF_listM[l][3]==true ) { NbmAct++} else { NbmSup ++}
        
 
     }

     document.getElementById("infoAF").innerText = AF_nbv + " variables | " + NbmAct + " moda. actives | " + NbmSup + " suppl. " ;
    // alert("il y a " + )

}
function AF_StatutM(m) { // définition du statut des modalités (à partir )
 

    // changement de statut de la moda sélectionnée

    if (AF_listM[m][3] == true) { AF_listM[m][3] =false; } else {AF_listM[m][3] =true;}
   
    compteModsAf()
        
    if(FautBURT==false) {
        compteModsAf();
        LancerAF();
    }
    

}

function AF_StatutV(v) {
     
    // récupération du statut de la checkbox

    var nomchk = "ChkVAf" + v ;
    var chk = document.getElementById(nomchk);
    var statut = true; 

    if(chk) {

        if (chk.checked==true) { 
            statut=false;
        }
    }

    for (l=1;l<AF_listM.length;l++){

        if (AF_listM[l][1]==v){
            AF_listM[l][3]=statut;

        }

    }

    var listchk= document.getElementsByClassName("chkmodaf")
 
    for (l=0 ; l<listchk.length;l++) {
        
          
                   
            listchk[l].checked =  AF_listM[l+1][3] ;    

             
    }

    
    compteModsAf()

    if(FautBURT==false) {LancerAF()}


}
function LancerAF(bouton){
    
   
    
    wait("Chargement du tableau de Burt. \n Merci de patienter...");
    
    

   if (FautBURT==true || bouton==true) {

        setTimeout(ChargerBurt,500);
        setTimeout(Facteurs,500);
         
    } else {

        Facteurs();
    }

   

    //endWait();
}
function ChargerBurt(){ // Chargement du tableau de BURT



     
    var nmods = AF_listM.length; 

    // les non réponses sont-elles incluses?
    var NRAF = document.getElementById('ChkNRAF').checked
    

        //if (nmods>10) { alert("Tri2 va faire le croisement 2 à 2 de toutes les modalités.\n Cette opération peut prendre un peu de temps. \n Merci de patienter. ")}
  
     

    // Initialisation du tableau de BURT
    BURT=[];

    BURT = new Array(nmods)

    for (b=0;b<BURT.length;b++){

        BURT[b] = new Array(nmods)

    }

        // mise à zéro
        for (l=1;l<nmods;l++) {
            for (c=1;c<nmods;c++) {
                BURT[l][c]=0;
            }
        }       


    // remplissage des lignes et colonnes 

    for (l=1;l<nmods;l++) {


        // remplissage  des premières cases par symétrie (à partir de la deuxième ligne)
        if (l>1){

            for (c=1;c<l;c++) {
                BURT[l][c] = BURT[c][l];
            }
        
        }

        var RgDp=l;
        
        if (NRAF==true){ RgDp=l+1;}; // évitement de la diagonale (calculée après)

        for (c=RgDp;c<nmods;c++) { 

            var x = AF_listM[l][1]; // récupération de la variable en ligne
            var y = AF_listM[c][1]; // récupération de la variable en colonne

              
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
        

                if (valmodlig==AF_listM[l][2] && valmodcol == AF_listM[c][2]) {
        
                    //filtrage
                    if (EstVu('BlocFiltre')==0) { BURT[l][c]+=coeffp;  }
                    else
                    {
                    if (Filtrer(index) == true) {BURT[l][c]+=coeffp;  }
                    }

                }
        

                 
        
        
        
            }; // fin lecture base





        }; // fin c



        // remplissage de la diagonale (par somme des éléments) 
        // uniquement possible si les NR sont incluses 
        // sinon, remplissage de la diagonale par lecture de la base
        
        if (NRAF==true) {
            var totlig = 0;
            for (c=1;c<nmods;c++) {
                totlig += BURT[l][c]
            }

            BURT[l][l] = totlig/ (AF_nbv-1)
        }
            
 
        var prog= Math.round(l/nmods*100) + "% " 
        
        document.getElementById("lblwait").innerText = prog

         

    }; // fin l

    //Vérification du BURT (ok)
    /*
    var chn= "\ Tableau de burt <br> "
    
    for (l=1;l<AF_listM.length;l++) { 
        chn += Moda[AF_listM[l][1]][AF_listM[l][2]] + ","
    }
    chn += " <br>  "
    
    for (l=1;l<AF_listM.length;l++) { 
        chn +=  Moda[AF_listM[l][1]][AF_listM[l][2]] + " : " + BURT[l] + " <br>  "
    } 
    */
 
//document.getElementById("contenu").innerHTML += chn;

FautBURT=false; // Le burt n'a plus à être calculé (jusqu'au prochain chgt de la liste )

endWait()

}



function Facteurs(){ // Calcul des facteurs 

    // CET ALGORITHME EST UNE VERSION ADAPTEE DE L'ALGORITHME ELABORE PAR PHILIPPE CIBOIS POUR LE LOGICIEL TRIDEUX ('WANECAR.BAS' --> ANECAR2 )

    // les non réponses sont-elles incluses?
    var ACPM = document.getElementById('ChkACPM').checked
    
    if (ACPM==true) {
        type="ACM";
    } else {
        type="ACP";
    }

    
    var nmods = AF_listM.length; 
    
    // création du tableau des calculs intérmédiaires (copie du BURT)
    var T1 = new Array(nmods);
        
    // Dimensionnement du tableau 
    for (l=1;l<T1.length;l++){
         T1[l]=new Array(T1.length)
    }

     
    
 
     
    
       

            var TOT=0;    

            //---------------------------------------------
            // 1 - calcul des marges et du total 
            //---------------------------------------------

            for (l=1;l<nmods;l++){
                AF_listM[l][4]= 0;

                for (c=1;c<nmods;c++){

                    // ACTIVES
                    if (AF_listM[l][3]==true && AF_listM[c][3]==true) { 

                        AF_listM[l][4]+= Number(BURT[l][c]);
                        TOT+=Number(BURT[l][c]);
                        
                    } ;

                    
                    // SUPPLEMENTAIRES 
                    if (AF_listM[l][3]==false && AF_listM[c][3]==true) { 
                        
                        AF_listM[l][4]+= Number(BURT[l][c]); // on n'ajoute que les valeurs des modalités de la ligne qui sont actives en colonne. 
                        
                        
                    }

                    
                }

            
        
            }







            //---------------------------------------------
            // calcul des écarts à l'indépendance et phi2
            //---------------------------------------------

            var PHI2 = 0 ; // Calcul du Phi-deux
            var SCAR = 0 ; // Somme des carr‚s des ‚carts
            var RESTMAX = 0; // reste maximum
            var RESTI = 0; // index de l'écart principal 

            for (l=1;l<nmods;l++){
                for (c=1;c<nmods;c++){

                    var MRGL = AF_listM[l][4];
                    var MRGC = AF_listM[c][4];
                    var TH = (MRGL / TOT) * (MRGC / TOT); // effectif théorique en prop.
                    var PH = 0 ;
                    var SC = 0;
                    

                    T1[l][c] = (BURT[l][c]/TOT)-TH ; // écart en prop.
                    SC = T1[l][c] * T1[l][c]; // Carré de l'écart  

                    if (TH!=0) { // phi 2
                        PH = (T1[l][c] * T1[l][c]/TH);  
                    }

                    
 
                            
                        if (AF_listM[c][3]==true ) { // si l'une des deux modas est active
                        
                            if (type=="ACM") {

                                AF_listM[l][5] += PH; // ajout de la somme des contributions en ligne au tableau des modalités                                          
                               
                                                                                                    
                            } 

                            if (type=="ACP") {
                                 
                                AF_listM[l][5] +=  SC; 
                                
                            }


                            if (AF_listM[l][3]==true ) {// si les deux modalités sont actives 

                                if (Math.abs(T1[l][c]) > RESTMAX)  { // recherche du reste le plus important du tableau
                                    RESTMAX = Math.abs(T1[l][c]);
                                    RESTI = l; 
                                }
                                // ajout aux totaux
                                PHI2 +=  PH;
                                SCAR += SC;
                            }
                            
                            
                               


                        }       
                        
 

                          
                            
                    
                    

        
                    
                    
                }

                
            }

            

                //Vérification du tableau des calcul vectoriels (ok)
            var chn= "\ Tableau pour vecteurs <br> "
            chn+="Total pris en compte : " + TOT + "<br> ,";

            for (l=1;l<AF_listM.length;l++) { 
                chn += Moda[AF_listM[l][1]][AF_listM[l][2]]
            }
            chn += "TOTAL, SOMME DES CONTRIBS <br> "
            
            for (l=1;l<AF_listM.length;l++) { 
                chn +=  Moda[AF_listM[l][1]][AF_listM[l][2]] + " : " + T1[l] + " , " + AF_listM[l][5] + " <br> "
            } 

            chn += "<br>  plus grand reste au rang " + RESTI

            //document.getElementById("contenu").innerHTML += chn;

        





            // amplitudes ???
            var NA = 0;
            var NA2 = 3
            var AMPL = 1;
            var AMPL2 = 1;


            //---------------------------------------------
            // Calcul de l'inertie 
            //---------------------------------------------

            for (l=1;l<nmods;l++){

                AF_listM[l][6] = AF_listM[l][5] //    Cos2I(i%) = INRI(i%)

               if (type=="ACM") {
                
                    AF_listM[l][5] =  AF_listM[l][5] / PHI2 * 1000  
               }
                
               if (type=="ACP") {
                   
                    AF_listM[l][5] =  AF_listM[l][5] / SCAR * 1000  
               }

            }

            //---------------------------------------------
            // Initialisation des marges  
            //---------------------------------------------
            var QUAD = 0; // PHI2 ou SOMME DES CARRES DES ECARTS

            for (l=1;l<nmods;l++){

                if (type=="ACM") {
                    
                    AF_listM[l][4] = AF_listM[l][4] / TOT 
                    QUAD=PHI2;
                }

                if (type=="ACP") {
                    AF_listM[l][4] =1;
                    QUAD=SCAR;
                }


            }
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // BOUCLE SUR LES FACTEURS
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var nbfac=AF_nbfac;
            AF_VP  = new Array(nbfac)
            AF_PCT  = new Array(nbfac)
            

            for (fac=1;fac<nbfac+1;fac++) {

                    //---------------------------------------------        
                    // initialisation du vecteur lignes 
                    //---------------------------------------------

                    V1= new Array(nmods)
                    V2= new Array(nmods)

                    for (l=1;l<nmods;l++){

                        if (AF_listM[l][3]==true) {
                            V1[l] = 1;
                            if(T1[l][1]<0) {V1[l]=-1;}
                        }

                        // mise à zéro du vecteur colonne
                        V2[l]=0;

                    }



                    var DIFF=1;
                    var niter= 0;
                    //---------------------------------------------
                    // boucle sur le facteur pour extraire les vecteurs propres
                    //---------------------------------------------
                    while(DIFF!= NaN && DIFF>=1) {

                        niter++;

                    // alert(niter + " itération(s)")

                        // définition de la précision 
                        var PRECIS = 1000000;

                        // valeur du vecteur le plus important avant itération
                        var test = V1[RESTI] * PRECIS;
                        
                        

                        // ======================================================    
                        // calibrage du vecteur colonne (produit scalaire)
                        // ======================================================
                        for (c=1;c<nmods;c++){
                            
                            var SOM=0;

                            for (l=1;l<nmods;l++){ // 
                                
                                // ACTIVES seulement
                                if (AF_listM[l][3]==true && AF_listM[c][3]==true) { 

                                
                                    SOM+=V1[l]*Number(T1[l][c]); 
                                }    
                            
                            }

                            V2[c]=SOM;

                        }    


                        SOM = 0;
                        //=============================================================================
                        // PONDERATION de vecteur colonne (division du vecteur colonne par l'effectif) 
                        //=============================================================================

                        for (c=1;c<nmods;c++){

                            // ACTIVES seulement
                            if (AF_listM[c][3]==true) { 

                                var MRG = Number(AF_listM[c][4])  // marge en prop
                                var XP = Number(V2[c])
                                
                                if (MRG!=0) {
                                    XP = XP/MRG;  
                                } 

                                SOM += V2[c] * XP;
                                V2[c] = XP;
                                
                            }

                        }
 

                        var AKSI = Math.sqrt(SOM); // norme du vecteur

 

                        // ======================================================
                        // NORMALISATION du vecteur colonne
                        // ======================================================
                        for (c=1;c<nmods;c++){
                            
                            // ACTIVES seulement
                            if (AF_listM[c][3]==true) { 
                                if (AKSI!=0) {
                                    V2[c]= Number(V2[c])/AKSI;  
                                } 
                            }   
                        }
                        
 

                        // ======================================================
                        // calibrage du vecteur ligne
                        // ======================================================
                        for (l=1;l<nmods;l++){
                            
                            var SOM=0;

                            for (c=1;c<nmods;c++){
                                
                                // ACTIVES seulement
                                if (AF_listM[l][3]==true && AF_listM[c][3]==true) { 
                                
                                    SOM+=V2[c]*T1[l][c]; 
                                }    
                            
                            }

                            V1[l]=SOM;

                        }    

                        

                        SOM = 0;

                        //=============================================================================
                        // PONDERATION du vecteur ligne (division du vecteur ligne par l'effectif) 
                        //=============================================================================

                        for (l=1;l<nmods;l++){

                            // ACTIVES seulement
                            if (AF_listM[l][3]==true) { 

                                var MRG = AF_listM[l][4]  // marge en prop
                                var XP = V1[l] 
                                
                                if (MRG!=0) {
                                    XP = V1[l]/MRG;  
                                } 

                                SOM += V1[l] * XP;
                                V1[l] = XP;

                            }
                        }

                        

                        var AKSI = Math.sqrt(SOM); // norme

                         

                        //=============================================================================
                        // Normalisation du vecteur ligne  (division du vecteur colonne par l'effectif) 
                        //=============================================================================

                        for (l=1;l<nmods;l++){
                            if (AF_listM[l][3]==true) { 
                                if (AKSI!=0) {
                                    V1[l]= V1[l]/AKSI;  
                                } 
                            }   
                        }

                        


                         
                        var test2 = V1[RESTI] * PRECIS;
                        
                        
                        DIFF = Math.abs(test - test2);
                        
                        

                    } // fin des itérations pour l'extraction du vecteur ------------------------------------------------------------------------------------------------------------------


                
                

                    // --------------------------------------------------------------------------
                    // Calcul des supplémentaires
                    // --------------------------------------------------------------------------

                        // ======================================================    
                        // calibrage du vecteur colonne (produit scalaire) SUPPLEMENTAIRES
                        // ======================================================
                        for (c=1;c<nmods;c++){
                            
                            if (AF_listM[c][3]==false) { // colonnes inactives
                            var SOM=0;

                                for (l=1;l<nmods;l++){ // 
                                    
                                    // ACTIVES seulement
                                    if (AF_listM[l][3]==true ) { 

                                    
                                        SOM+=Number(V1[l]*T1[l][c]); 
                                    }    
                                
                                }

                                V2[c]=SOM;

                            }

                        }    


                                        
 
                        

                        SOM = 0;
                        //=============================================================================
                        // PONDERATION de vecteur colonne (division du vecteur colonne par l'effectif) 
                        //=============================================================================
                         
                        for (c=1;c<nmods;c++){

                        // Supplémentaires seulement
                            if (AF_listM[c][3]==false) { 

                                var MRG = Number(AF_listM[c][4])  // marge en prop
                                
                                var XP = Number(V2[c])
                                
                                if (MRG!=0) {
                                    XP = XP/MRG;  
                                } 

                                SOM += V2[c] * XP;
                                V2[c] = XP;
                                
                            }

                        }

                         
                        
                         
                        // ======================================================
                        // NORMALISATION du vecteur colonne SUPPL
                        // ======================================================
                        for (c=1;c<nmods;c++){
                            
                            // Supplémentaires seulement
                            if (AF_listM[c][3]==false) { 
                                if (AKSI!=0) {
                                    V2[c]= V2[c]/AKSI;  
                                    V1[c] = V2[c];// report du vecteur colonne dans le vecteur ligne (seul pris en compte ensuite)
                                } 

                                 
                            }   
                        }

                        
                        
                        // ---------------------------------------------------------
                        // Calcul des VP et inertie
                        // ---------------------------------------------------------
                        var LAMBDA = AKSI*AKSI;
                        var POUR = LAMBDA * 100 / QUAD;
                        AF_VP[fac] = LAMBDA;  
                        AF_PCT[fac] = POUR;



                        

                        // ---------------------------------------------------------
                        // Calcul des contributions  
                        // ---------------------------------------------------------
                        
                        var rgfac = 5 + fac*2; // définition du rang de facteur dans le tableau des modalités (Positions 7(1) à 16(10))
                        
                        for (l=1;l<nmods;l++){
                            
                            // calcul de la contribution par facteur de la ligne
                            V1[l] = V1[l] * AKSI;
                            // mémorisation des coordonnées
                            AF_listM[l][rgfac] =  V1[l].toFixed (3);

                            var CPFI2 = V1[l]*V1[l]*AF_listM[l][4]*100/LAMBDA ; // contibution de la modalité au facteur
                            
                            if (CPFI2>100){
                                AF_listM[l][rgfac+1] = 99.9;
                            } else {
                                AF_listM[l][rgfac+1] = CPFI2.toFixed(3) ;
                            }
                            
                             

                            c 
                             
                            // calcul du cos²
                            var COS= AF_listM[l][6]
                            var COSI2 = V1[l]*V1[l]*AF_listM[l][4]*100/COS ; 
                            
                            if (COSI2>100){
                                AF_listM[l][6] = 99.9;
                            } else {
                                AF_listM[l][6] = CPFI2.toFixed(3);
                            }
                            
                        }

                       


                        //--------------------------------------------------------------------------
                        //Calcul des restes 
                        //--------------------------------------------------------------------------
                        RESTMAX= 0;
                        for (l=1;l<nmods;l++){
                                         
                            for (c=1;c<nmods;c++){

                                var MRGL = AF_listM[l][4];
                                var MRGC = AF_listM[c][4];
                                
                                            
                                    T1[l][c] = Number(T1[l][c]) - V1[l] * V1[c] * MRGL * MRGC / AKSI;

                                    if (AF_listM[l][3]==true && AF_listM[c][3]==true) { // définition du plus grand reste (parmi actives)
                                        if (Math.abs(T1[l][c])> RESTMAX) {
                                            RESTMAX = Math.abs(T1[l][c]);
                                            RESTI = l;
                                        }
                                    
                                    } ;
            
                                                                
                            };
                                   
                    
                        };


 

            } // fin boucle facteurs              
        
      
            
     ////////////////////////////////////////////////////////////////////////////////////////////////////::::
     // AFFICHAGE DES RESULTATS
     /////////////////////////////////////////////////////////////////////////////////////////////////////

    //Vidage('TabAF')
    var elmnt = document.getElementById('detailfacteurs');
    if (elmnt) {elmnt.innerHTML="";}

     // définition du nombre de colonnes
    var nbcol = 1 + AF_nbfac * 2;

    // décompte des modalités
    compteModsAf(); 

    // création du tableau
    tbl  = document.createElement('table');
    tbl.id = 'TabResAFTitre';
    tbl.className= 'TabTri';
    tbl.style.width  = '1000px';
    tbl.style.marginTop = "15px";

        // Titre
        var titre="Analyse des correspondances mulitples  (ACM)"; 
        var sstitre = "Phi2 : "
        if (type=="ACP") {
        titre= titre="Analyse en composantes principales des écarts (ACP)" 
        sstitre = "Somme des carrés : "
        }    


       
        var tr = tbl.insertRow();
        var HCell = document.createElement("th");
        HCell.innerHTML =  `<label style="cursor:pointer;" >` + titre + ` </label>`;
        HCell.colSpan=nbcol;
        tr.appendChild(HCell);


        var tr = tbl.insertRow();
        // sstitre
        var HCell = document.createElement("td");
        HCell.innerHTML = `<label style="cursor:pointer;" >`+ sstitre + QUAD.toFixed(6) + `  </label>` ;
        HCell.colSpan=nbcol;
        tr.appendChild(HCell);

        //'création du tableau'
        document.getElementById('detailfacteurs').appendChild(tbl);       

        // création du tableau
        tbl  = document.createElement('table');
        tbl.id = 'TabResAF';
        tbl.className= 'TabTri';
        tbl.style.width  = '1000px';
        tbl.style.marginTop = "15px";


        var tr = tbl.insertRow();
        // titres des facteurs
        var HCell = document.createElement("td"); // 1ère case vide
        HCell.innerHTML = `<label style="cursor:pointer;" >  </label>` ;
        HCell.colSpan=1;
        HCell.style.width="400px";
        tr.appendChild(HCell);


        // entêtes des facteurs
        for (c=1;c<AF_nbfac+1;c++) {
            var HCell = document.createElement("th");
            HCell.innerHTML = `<label style="cursor:pointer;" > Facteur ` + c + `  </label>` ;
            HCell.colSpan=2;
            tr.appendChild(HCell);
        }

        // valeurs propres 
        var tr = tbl.insertRow();
        // 
        var HCell = document.createElement("th");  
        HCell.innerHTML = `<label style="cursor:pointer;" > Valeur propre : </label>` ;
        HCell.colSpan=1;
        tr.appendChild(HCell);


        
        for (c=1;c<AF_nbfac+1;c++) {

            var HCell = document.createElement("td");
            HCell.innerHTML = `<label style="cursor:pointer;" >  ` + AF_VP[c].toFixed(7) + `  </label>` ;
            HCell.colSpan=2;
            tr.appendChild(HCell);
        }


        // % du total 
        var tr = tbl.insertRow();
        // 
        var HCell = document.createElement("th");  
        HCell.innerHTML = `<label style="cursor:pointer;" > % du total : </label>` ;
        HCell.colSpan=1;
        tr.appendChild(HCell);


        
        for (c=1;c<AF_nbfac+1;c++) {

            var HCell = document.createElement("td");
            HCell.innerHTML = `<label style="cursor:pointer;" >  ` + AF_PCT[c].toFixed(2) + `  </label>` ;
            HCell.colSpan=2;
            tr.appendChild(HCell);
        }


     


        // MODALITES ACTIVES
        var tr = tbl.insertRow();
        // 
        var HCell = document.createElement("td");  
        HCell.innerHTML = `<label style="cursor:pointer;" > Modalités Actives </label>` ;
        HCell.colSpan=1;
        //HCell.style.width="400px";
        tr.appendChild(HCell);


        
        for (c=1;c<AF_nbfac+1;c++) {

            var HCell = document.createElement("th");
            HCell.innerHTML = `<div style="cursor:pointer;display: inline-flex;" onclick = "triTabAF('TabResAF',`+ ( (c-1)*2) + `,` + 4 + `,` + (4 + NbmAct) + `,'asc')">  Coord.  <img src="CSS/\sort_both.png" alt="trier" style="margin: 3px;float:left;position:relative;" ></div>` ; 
            HCell.colSpan=1;
            tr.appendChild(HCell);
            
            var HCell = document.createElement("th");
            HCell.innerHTML = `<div style="cursor:pointer;display: inline-flex;" onclick = "triTabAF('TabResAF',`+ (1 + (c-1)*2) + `,` + 4 + `,` + (4 + NbmAct) + `,'desc')">  Contrib.  <img src="CSS/\sort_both.png" alt="trier" style="margin: 3px;" ></div>` ; ;
            HCell.colSpan=1;
            tr.appendChild(HCell);
        }


        // ajout des modalités actives 
        var vcur=-1;
        var nbv=0

        for (l=1;l<nmods;l++){

            var v =AF_listM[l][1];
            if ( v!= vcur) {
                nbv++;
                vcur=v;

            }

            if (AF_listM[l][3]==true) {

                var tr = tbl.insertRow();
                // 
                
                var HCell = document.createElement("th");  
                HCell.innerHTML = `<label style="cursor:pointer;color:` + tabcoulsAF[nbv] + `" > `+  Nom[AF_listM[l][1]] + " - " +  Moda[AF_listM[l][1]][AF_listM[l][2]] + ` </label>` ;
                HCell.colSpan=1;
                HCell.style.backgroundColor= "rgb(255,255,255)" // tabcoulsAF[nbv]
                tr.appendChild(HCell);
        
    
                
                for (c=1;c<AF_nbfac+1;c++) {
        
                    var HCell = document.createElement("td");
                    HCell.innerHTML = `<label style="cursor:pointer;" > ` + AF_listM[l][7+(c-1)*2] + ` </label>` ;
                    HCell.colSpan=1;
                    tr.appendChild(HCell);
                    
                    var HCell = document.createElement("td");
                    HCell.innerHTML = `<label style="cursor:pointer;" > ` + AF_listM[l][7+(c-1)*2 +1] + ` </label>` ;
                    HCell.colSpan=1;
                    tr.appendChild(HCell);
                }

            }

        }

  
        if (NbmSup>0 ){// MODALITES SUPPLEMENTAIRES

        
            
            var tr = tbl.insertRow();
            // 
            var HCell = document.createElement("td");  
            HCell.innerHTML = `<label style="cursor:pointer;" > Modalités Supplémentaires </label>` ;
            HCell.colSpan=1;
            //HCell.style.width="400px";
            tr.appendChild(HCell);

            
            
            for (c=1;c<AF_nbfac+1;c++) {

                var HCell = document.createElement("th");
                HCell.innerHTML = `<div style="cursor:pointer;display: inline-flex;" onclick = "triTabAF('TabResAF',`+ ( (c-1)*2) + `,` + (5 + NbmAct) + `,` + (5 + NbmAct+NbmSup) + `,'asc')">  Coord.  <img src="CSS/\sort_both.png" alt="trier" style="margin: 3px;" ></div>` ; ;
                HCell.colSpan=1;
                tr.appendChild(HCell);
                
                var HCell = document.createElement("th");
                HCell.innerHTML = `<div style="cursor:pointer;display: inline-flex;" onclick = "triTabAF('TabResAF',`+ ( 1+(c-1)*2) + `,` + (5 + NbmAct) + `,` + (5 + NbmAct+NbmSup) + `,'desc')">  Contrib. <img src="CSS/\sort_both.png" alt="trier" style="margin: 3px;" > </div>` ; ;
                HCell.colSpan=1;
                tr.appendChild(HCell);
            }

            // ajout des modalités
            var vcur=-1;
            var nbv=0
    
            for (l=1;l<nmods;l++){
    
                var v =AF_listM[l][1];
                if ( v!= vcur) {
                    nbv++;
                    vcur=v;
    
                }

                if (AF_listM[l][3]==false) {

                    var tr = tbl.insertRow();
                    // 
                    
                    var HCell = document.createElement("th");  
                    HCell.innerHTML = `<label style="cursor:pointer;color:` + tabcoulsAF[nbv] + `" > ` + Nom[AF_listM[l][1]] + " - " +  Moda[AF_listM[l][1]][AF_listM[l][2]] + ` </label>` ;
                    HCell.colSpan=1;
                    HCell.style.backgroundColor= "rgb(255,255,255)" //tabcoulsAF[nbv]
                    tr.appendChild(HCell);
            

                    
                    for (c=1;c<AF_nbfac+1;c++) {
            
                        var HCell = document.createElement("td");
                        HCell.innerHTML = `<label style="cursor:pointer;" > ` + AF_listM[l][7+(c-1)*2] + ` </label>` ;
                        HCell.colSpan=1;
                        tr.appendChild(HCell);
                        
                        var HCell = document.createElement("td");
                        HCell.innerHTML = `<label style="cursor:pointer;" > ` + AF_listM[l][7+(c-1)*2 +1] + ` </label>` ;
                        HCell.colSpan=1;
                        tr.appendChild(HCell);
                    }

                }

            }

        }


        //'création du tableau'
        document.getElementById('detailfacteurs').appendChild(tbl);       
        endWait();

        ExtremasAF() // calcul des extrêmas
        TabDepl() // initialisation du tableau des déplacements
        AffPlanFac(0); // affichage du plan
}

 

function triTabAF(Tableau, col, rgdep, rgfin, sens) {// Tri tableau des facteurs ( Analyse factorielle )
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(Tableau);
    switching = true;

   // alert("tri du tableau " + Tableau + " colonne " + col + " par ordre " + sens)
  

    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
first, which contains table headers):*/

 
        for (i = rgdep; i < rgfin; i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
  one from current row and one from the next:*/

  

            x = rows[i].getElementsByTagName("td")[col];
            y = rows[i + 1].getElementsByTagName("td")[col];


             
                var valx = x.innerText;
                var valy = y.innerText;

                if (Number(valx) > Number(valy) && sens=='asc' || Number(valx) < Number(valy) && sens=='desc' ) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
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

function ExtremasAF() { // définit les positions extrêmes des points

    const nmods = AF_listM.length; 
    var xmd=0;
    var ymd=0;

    

    if (nmods<=1) { // en cas de plan vide

        xmin=-2;
        xmax=2
        ymin=-2;
        ymax=2;



    } else {
        
    // création du tableau des coordonnées des points

    if (TabPtAf0.length < nmods) {
        TabPtAf0= new Array(nmods)

        for (l=1;l<nmods;l++){ 
            TabPtAf0[l]= new Array(5)
            TabPtAf0[l][1]=0;
            TabPtAf0[l][2]=0;
            TabPtAf0[l][3]=0;
            TabPtAf0[l][4]=0;
        }


        
    }

        xmin=0;
        xmax=0
        ymin=0;
        ymax=0;


        for (mx=1;mx<nmods;mx++){ //recherche des extremas

            // calcul de la position des points
            
            // facteurs demandés
            var fX = document.getElementById("choixAxeX").value
            var fY = document.getElementById("choixAxeY").value
            var pX= 7 + fX * 2; 
            var pY= 7 + fY * 2; 

            xmd= Number(AF_listM[mx][pX]);
            ymd= Number(AF_listM[mx][pY]);



            if (xmin>xmd){xmin=xmd;}
            if (xmax<xmd){xmax=xmd;}
            if (ymin>ymd){ymin=ymd;}
            if (ymax<ymd){ymax=ymd;}


        }

    }

    // amplitudes 
    amplX = xmax + Math.abs(xmin);
    amplY = ymax + Math.abs(ymin);
    
    var lartot =  document.getElementById("planFac").offsetWidth;
    var hautot =  document.getElementById("planFac").offsetHeight;

     

    

    if (amplY>amplX){ // calage sur le plus petit des deux axes

        if (lartot > hautot) { // + gde sur petit côté

            PixParPt = hautot /amplY

        } else { // + gde sur grand côté
            
            PixParPt = lartot /amplY

            if (PixParPt * amplX > lartot) {
                
                PixParPt = lartot /amplX 

            }
             

        }
        

    } else {
         
        if (lartot > hautot) { // plus gde sur grand côté

            PixParPt = lartot /amplX 
             

            if (PixParPt * amplY > hautot) {
                 
                PixParPt = hautot /amplY 

            }
            
            

        } else {

            PixParPt = hautot /amplY // + gde sur petit côté
        }

 
    }
 

        var gch = (lartot - (amplX * PixParPt)) / 2  
            // coordonnées de l'origine
            OrigX1= gch + Math.abs(xmin) * PixParPt ;  
            var drt = (hautot - (amplY * PixParPt)) / 2  
            OrigY1= drt + Math.abs(ymax) * PixParPt ; 


    PixParPt-=PixParPt * 0.1
    
}

function AffPlanFac(pas) {

 
    const canvas = document.getElementById("planFac");
    //canvas.style.width="1500px"
    //canvas.style.height="1000px"

    if (!canvas.getContext) {
        return;
    }

    if (amplX == 0 || amplY == 0) {

        return;
    }


    const cnv = canvas.getContext('2d');

    cnv.font = "12px Arial"
    
    var margG= 0;
    var margD= 3;
    var margH= 0;
    var margB= 0;

    var lartot =  document.getElementById("planFac").offsetWidth;
    var hautot =  document.getElementById("planFac").offsetHeight;
    var lardisp = lartot - (margG+margD);
    var haudisp = hautot - (margH+margB);

    
    var x=0;
    var y=0 ;

    var nmods= AF_listM.length;

            if (TabPtDplAf.length!=nmods) {TabDepl();} // création du tableau des déplacements 
    
            // définition des coordonnées des points
            TabPtAf1 = new Array(nmods)
            for (l=1;l<nmods;l++){

                        // calcul de la position des points


                        // facteurs demandés
                        var fX = Number(document.getElementById("choixAxeX").value)
                        var fY = Number(document.getElementById("choixAxeY").value)
                        var pX= 7 + fX * 2; 
                        var pY= 7 + fY * 2; 
                        
                        x= AF_listM[l][pX] ;
                        y= AF_listM[l][pY] ;

                        TabPtAf1[l] = new Array(5);
                        //alert(fX + " " + fY + " " + TabPtDplAf[l][fY+1])
                        TabPtAf1[l][1] = (OrigX1 +  x * PixParPt)  + TabPtDplAf[l][fX+1];
                        TabPtAf1[l][2] = (OrigY1 - y * PixParPt ) + TabPtDplAf[l][fY+1];
            }
            

    
    // Définition du point d'origine
    
    


    // définition de l'amplitude max
    //var maxampl=amplX
    



    //amplX += amplX* 0.1
    //amplY += amplY *0.1
     

    //alert("xmin : " + xmin + " xmax : " + xmax + " amplX : " + amplX + " ymin : " + ymin + " ymax : " + ymax + " amplY : " + amplY)
    
    // définition du ration pixels par point
    //var PixParPt = lardisp/maxampl 
    
    //PixParPt = PixParPt * 0.75


   

    // coordonnées centrées
    //OrigX1= margG+(lardisp/2)
    //OrigY1= margH+(haudisp/2)
     
    pasprog=pas;

    
    timer = setInterval(function() {
       RepereAF(canvas, 1, 2, OrigX1,OrigY1, margG, lardisp, margH, haudisp,xmin, xmax, ymin, ymax);},10)


    
      
    
   


    



}


function RepereAF(canvas, abs, ord, OrigX1,OrigY1, margG, lardisp, margH, haudisp,xmin, xmax, ymin, ymax ) { // dessin du repère
 
    var abs=document.getElementById("choixAxeX").value 
    var ord=document.getElementById("choixAxeY").value 
    abs++;ord++;

    if (pasprog<=25) {pasprog = pasprog+5};
    if (pasprog>25 && pasprog<=90 ) {pasprog = pasprog+3};
    if (pasprog>90) {pasprog = pasprog+1};
    
    
    if (pasprog > 100) {
        clearInterval(timer)
        OrigX0 = OrigX1;
        OrigY0 = OrigY1;
        
        for (l=0;l<TabPtAf0.length;l++) {
            TabPtAf0[l] = TabPtAf1[l]
        }

        return 0;
    }   
    
    


    if (!canvas.getContext) {
        return;
    }

    const cnv = canvas.getContext('2d');
    var nmods = AF_listM.length; 
    var lartot = canvas.offsetWidth;
    var hautot =  canvas.offsetHeight;
 

     // dessin du fond 
     cnv.fillStyle = "white";
     //cnv.fillRect(0, 0, lartot, hautot);
     cnv.fillRect(0, 0, lartot, hautot); // effacement du tableau précédent
 
     var my_gradient = cnv.createLinearGradient(margG, margH, margG, haudisp);
     my_gradient.addColorStop(0, "white");
     my_gradient.addColorStop(0.5,"rgb(250 250 255)");
     my_gradient.addColorStop(1, "rgb(245 245 245)");
     cnv.fillStyle = my_gradient;
     //cnv.fillRect(margG, margH, lardisp, haudisp);
 
     // cadre
     cnv.fillStyle = 'rgb(120,120,120)';
     cnv.strokeStyle = cnv.fillStyle;
     cnv.beginPath();
     cnv.rect(margG, margH, lardisp, haudisp);
     cnv.stroke();


    // récupération de l'ancienne origine (ou définition au centre du graph)
    if (OrigX0==undefined || OrigY0 == undefined) {

        OrigX0= margG+(lardisp/2)
        OrigY0= margH+(haudisp/2)

    }

   

    // définition de la position relative
    var OrigX = OrigX0 +   (OrigX1 - OrigX0)* pasprog/100  
    var OrigY = OrigY0 +  (OrigY1 - OrigY0)* pasprog/100   

     

    // tracé du repère 
    
    // Abscisses 
    var x1=margG;
    var x2=lardisp;
    var y1 = OrigY ;
    var y2 = y1;

    cnv.fillStyle = 'rgb(120,120,120)';
    //cnv.beginPath();
    cnv.fillRect(x1, y1, x2, 1);
    //cnv.stroke();

    if (AF_PCT[abs]!=undefined) { // n'affiche les VP par axe que s'il y a quelque chose
    // étiquette des axes
    var lblaxe =  "F" + abs + " (" + AF_PCT[abs].toFixed(2) + " %)"; 
    var lartxt =  cnv.measureText(lblaxe).width
    cnv.fillText(lblaxe,x2 - lartxt -15,OrigY+25);

    var lblaxe =  "F" + ord + " (" + AF_PCT[ord].toFixed(2) + " %)"; 
    var lartxt =  cnv.measureText(lblaxe).width

    cnv.save();
    cnv.translate(0, margH  +  haudisp);
    cnv.rotate(-Math.PI/2);
    cnv.fillText(lblaxe, haudisp - lartxt - 15,OrigX - 10);
    cnv.restore();
    }





    //tracé des graduations

     for (p=0.1;p<amplX*3;p=p+0.1){

        var reste= Math.round((p*10)%5);
        
        
        if (reste == 0 || reste== 5)  { // graduation complète tous les 5 
            cnv.fillStyle = 'rgb(240,240,240)'
            var x = OrigX + p * PixParPt
            cnv.fillRect(x, margH, 1, haudisp);

            var x = OrigX - p * PixParPt
            cnv.fillRect(x, margH, 1, haudisp);
        }


        // graduation tous les 0.1
        cnv.fillStyle = 'rgb(140,140,140)'
        var x = OrigX + p * PixParPt
        cnv.fillRect(x, OrigY-5, 1, 5);
        cnv.fillStyle = 'rgb(240,240,240)'
        cnv.fillText(p.toFixed(1),x,OrigY+15);
        cnv.fillStyle = 'rgb(140,140,140)'
        var x = OrigX - p * PixParPt
        cnv.fillRect(x, OrigY-5, 1, 5);
        cnv.fillStyle = 'rgb(240,240,240)'
        cnv.fillText((p*-1).toFixed(1),x,OrigY+15);

    }


    for (p=0.1;p<amplY;p=p+0.1){

        var reste= Math.round((p*10)%5);

        if (reste == 0 || reste== 5) { // graduation complète tous les 5 
        cnv.fillStyle = 'rgb(240,240,240)'
        var y = OrigY - p * PixParPt
        cnv.fillRect(margG, y, lardisp, 1);
        var y = OrigY + p * PixParPt
        cnv.fillRect(margG, y, lardisp, 1);
        }

                // graduation tous les 0.1
                cnv.fillStyle = 'rgb(140,140,140)'
                var y = OrigY - p * PixParPt
                cnv.fillRect(OrigX, y, 5, 1);
                cnv.fillStyle = 'rgb(240,240,240)'
                cnv.fillText(p.toFixed(1),OrigX+15,y);
                cnv.fillStyle = 'rgb(140,140,140)'
                var y = OrigY + p * PixParPt
                cnv.fillRect(OrigX, y, 5, 1);
                cnv.fillStyle = 'rgb(240,240,240)'
                cnv.fillText((p*-1).toFixed(1),OrigX+15,y);



    }


    // ordonnées
    var x1=OrigX;
    var x2=1;
    var y1 = margH ;
    var y2 = haudisp;

    cnv.fillStyle = 'rgb(120,120,120)';
    //cnv.beginPath();
    cnv.fillRect(x1, y1, 1, y2);
    //cnv.stroke();


    

    // défilement des points à afficher 
  

    var nbv=0;
    
    var vcur=-1;
            for (l=1;l<nmods;l++){



                cnv.fillStyle= "black";



                // couleur d'affichage
                var v= AF_listM[l][1];

                if (v!=vcur){
                    vcur=v;
                    nbv++;
                }


                // évitement des points à la contribution trop faible
                // contrib
                var pX= 8 + (abs-1) * 2; 
                var pY= 8 + (ord-1) * 2; 
                var ctb1 = Number(AF_listM[l][pX])
                var ctb2 = Number (AF_listM[l][pY])

              // if (pasprog >98) {alert(ctb1 + " " + ctb2)}
                 if (ctb1<CPFMin && ctb2<CPFMin) {continue}
 
                
                /*var taillepol = 12;
                
                if (cx>=cy){
                    taillepol = 12 + Math.round(cx/50)
                } else {
                    taillepol = 12 + Math.round(cy/50)
                }

                var chntaille= "bold " +  taillepol + "px Arial"
                cnv.font= chntaille;

                */
               
                // définition de la position de départ du point
                if (TabPtAf0[l][1]== 0 || TabPtAf0[l][2]== 0 ) {

                    TabPtAf0[l][1]=OrigX0;
                    TabPtAf0[l][2]=OrigY0;

                }

                x = TabPtAf0[l][1] + (TabPtAf1[l][1] - TabPtAf0[l][1]) * pasprog/100;
                y = TabPtAf0[l][2] + (TabPtAf1[l][2] - TabPtAf0[l][2]) * pasprog/100;


               

               
                cnv.fillStyle = tabcoulsAF[nbv];


                if (AF_listM[l][3]==false) {cnv.fillStyle= "rgb(120,120,120)";}


                // petit point de positionnement précis
                cnv.fillRect(x, y, 1,1 );
                

                // marque de déplacement
                var fX = Number(document.getElementById("choixAxeX").value)
                var fY = Number(document.getElementById("choixAxeY").value)

                cnv.strokeStyle = cnv.fillStyle; 
                cnv.beginPath(); 
                cnv.moveTo(x,y);
                cnv.lineTo(x+TabPtDplAf[l][fX+1]*-1,y+TabPtDplAf[l][fY+1]*-1);
                cnv.stroke();

                //cnv.stroke(x, y, TabPtDplAf[l][1]*-1,TabPtDplAf[l][2]*-1);



                // affichage du texte
                
                // mise en italique en cas de supplémentaire
                if (AF_listM[l][3]==false){cnv.font="italic 14px Arial"} else {cnv.font=" 14px Arial"}; 

                var txtmoda = "";

                // Ajout d'un préfixe
                var Pfx = document.getElementById('ChkPrefix').checked
                if (Pfx==true) {txtmoda = Nom[AF_listM[l][1]] + " | "};

                Pfx = document.getElementById('ChkPrefixL').checked
                if (Pfx==true) {txtmoda += Libellé[AF_listM[l][1]] + " | " };
                 
                txtmoda +=  AF_listM[l][0];

                if (isNaN(txtmoda)==false) {txtmoda=String(AF_listM[l][2])}

                var tlignes = splitchaine(txtmoda,150,cnv.font) // découpage (éventuel) de l'étiquette en plusieurs lignes
            

                var rgtop = y
                var maxw =0

                // définition du cadre
                for (l2=0;l2<tlignes.length;l2++) {
                    var lartxt =  cnv.measureText(tlignes[l2]).width 
                    if (lartxt>maxw){maxw=lartxt}
                    rgtop+=15; 
                }
                
                TabPtAf1[l][3] = maxw // mémorisation de la largeur
                TabPtAf1[l][4] = rgtop - y + 15// mémorisation de la hauteur


                 // mise en relief des variables/modalités sélectionnées
                 
                 
                 if (TabPtSelAf[l]==true) {
                    /* cnv.opacity = 0.3;
                     cnv.fillStyle = "rgb(255,255,255)"
                     cnv.fillRect(x -40 , y - 40, maxw + 80, TabPtAf1[l][4] + 40 );
                     cnv.opacity=1;
                     */

                     // cadre 
                     
                     cnv.strokeStyle = "rgb(255,0,0)"
                     cnv.beginPath();
                     cnv.rect(x -20 , y - 20, maxw + 40, TabPtAf1[l][4] );
                     cnv.stroke();

                     // intérieur du cadre
                      
                     cnv.fillStyle = "rgb(255,255,255)"
                     cnv.fillRect(x-10 , y - 22, maxw+20, TabPtAf1[l][4] +10 );
                     cnv.fillRect(x-22 , y -10  , maxw + 44, TabPtAf1[l][4] -20 );
                      

                     
 
                 }

                

                 cnv.fillStyle = tabcoulsAF[nbv];

                var rgtop = y
                // Ajout du texte
                for (l2=0;l2<tlignes.length;l2++) {
                    cnv.fillText(tlignes[l2], x+2,rgtop );
                    rgtop+=15; 
                }

                //cnv.fillText(Moda[AF_listM[l][1]][AF_listM[l][2]],x+2,y-2);

                // affichage de la contribution (cercle)
                Ctb = document.getElementById('ChkContrib').checked
                if (Ctb==true){
                        //taille du cercle 
                        var cx = AF_listM[l][8];
                        var cy = AF_listM[l][10];

                        var radius = Number(cx) + Number(cy);
                        /*if (cy>=cx){
                            radius = cy
                        } */



                        cnv.beginPath();
                        cnv.arc(x, y, radius , 0, 2 * Math.PI, false);
                        //cnv.fillStyle = 'green';
                        cnv.globalAlpha = 0.1;
                        cnv.fill();
                        cnv.globalAlpha = 0.5;
                        cnv.beginPath();
                        cnv.arc(x, y, radius  , 0, 1.5   * Math.PI, false);
                        cnv.lineWidth = 4;
                        cnv.strokeStyle = cnv.fillStyle //'rgba(1,1,250,0.3)';
                        cnv.stroke();
                        cnv.globalAlpha = 1;
                        cnv.lineWidth = 1;




                        /*
                        cnv.fillText("amplX " + amplX + " min : " + xmin + " max : " + xmax, 15,15 );
                        cnv.fillText("amplY " + amplY + " min : " + ymin + " max : " + ymax, 15,40 );
                        cnv.fillText("lardisp " + lardisp + " haudisp : " + haudisp, 15,70 );
                        cnv.fillText("pix par pt " + PixParPt, 15, 100 );
                        */
                 }

            }
            //window.scroll(0, 0)

}

function trouvePtAf(x,y) { //recherche d'un point par ses coordonnées


    //return 0;
    
    // prise en compte de la position du planfac

     
    var trouvé=false ;
    var pln = document.getElementById("planFac");
    
    var Pos = pln.getBoundingClientRect();
    var PosY = Number(Pos.top) - 15
    var PosX = Number(Pos.left) 

    var xcor= x -  PosX
    x=xcor;
    var ycor= y - PosY;
    y=ycor;

     
    for (pt=1;pt<TabPtAf1.length;pt++) {

        TabPtSelAf[pt]=false;

        var x1 = Number(TabPtAf1[pt][1]);
        var y1 = Number(TabPtAf1[pt][2]);
        var x2 = Number(x1 + TabPtAf1[pt][3]);
        var y2 = Number(y1 + TabPtAf1[pt][3]);

         


        if (x >= x1 && x <= x2 ) {

            if (y >= y1 && y <= y2 ) {

                TabPtSelAf[pt]=true;
                trouvé=true
                AffPlanFac(99); 
                return trouvé;

            }

        }
        
    }
    
    AffPlanFac(99); 
    return trouvé;
}

function selPtAf(v,m) { // recherche de points à partir de la variable

    if (FautBURT==true){return 0}

        TabPtSelAf=new Array (AF_listM.length);
        for (l=1;l<AF_listM.length; l++){
            TabPtSelAf[l]=false;
        }



    for (l=1;l<AF_listM.length; l++){

        if (AF_listM[l][1]==v) {

            if (m==undefined) {

                TabPtSelAf[l]=true;

            } else {

                if (AF_listM[l][2]==m) { 
                    TabPtSelAf[l]=true; 
                }
            }
        }



    }

AffPlanFac(99);


}

function videPtAf() {// annulation des tous les points suvolés
    
    for (pt=0;pt<TabPtSelAf.length;pt++) {
        TabPtSelAf[pt]=false;
    }
  
    AffPlanFac(99);
}

function zoomAF(sens) {

     

    if (sens > 0) {

        PixParPt = PixParPt*1.25;

     } else {

        PixParPt = PixParPt*0.8;
        

    }

    setTimeout(AffPlanFac, 10,0) ;
     
    //  AffPlanFac(0)
    


}




/// fonctions de déplacement du graphique

function Af_drag0(event){

    
    var x = event.clientX;
    var y = event.clientY;


    var trv = trouvePtAf(x,y);

    if (trv==false) {
    dragAF=true; // mode drag
    } else {
    mouvAF=true; // mode déplacement de point 
    }


    OrigXs = OrigX1; // mémorisation de la position du centre au départ
    OrigYs = OrigY1; 
    x0s = x; // mémorisation de la position de départ du drag 
    y0s = y;
    

}

function Af_drag(event) {

    var x = event.clientX;
    var y = event.clientY;

    if (dragAF==true) {
    
    OrigX1 = OrigXs + (x-x0s)
    OrigY1 = OrigYs + (y- y0s)    

    AffPlanFac(99)
    } 
    
    
    
    if (mouvAF==true) {
    
        var fX = Number(document.getElementById("choixAxeX").value)
        var fY = Number(document.getElementById("choixAxeY").value)

        for (l=1;l<TabPtDplAf.length-1;l++){

            // recalcul de la position des points
        
            if (TabPtSelAf[l]==true) {
                
            TabPtDplAf[l][fX+1] =  (x - x0s)
            TabPtDplAf[l][fY+1] =  (y - y0s)

            }

        }
    
        AffPlanFac(99)

    }

}

function Af_drag1(){
    dragAF=false;
    mouvAF=false;
    videPtAf();
}

function EditModAF() {

   
    var lignes = document.getElementsByClassName("TxtModAF")
    var cacher = false;

    for (lg=0;lg<lignes.length+1;lg++)  {
        var nomlig= "TxtModAF"+lg;
        if (document.getElementById(nomlig)) {
            
            var ctrlig= document.getElementById(nomlig);

                if (ctrlig.classList.contains("d-none")){
                    $("#"+nomlig).removeClass("d-none");
                    
                } else {
                    
                    $("#"+nomlig).addClass("d-none");
                    cacher=true;
                }


    
         
        };
    }

     if (cacher==true) {

        //AffListMods()
     }
        
        
    

}

 

function MàJModAF(event,lg) {

    var key = event.keyCode;

     
    var idTxt = 'TxtModAF' + lg;
    var nvTxt = document.getElementById(idTxt).value;
    nvTxt = nvTxt.trim();

    if (nvTxt=="") {nvTxt=Moda[AF_listM[lg][1]][AF_listM[lg][2]] }
    
    var idLbl = 'LblMAf' + lg;
    var cible = document.getElementById(idLbl);
    cible.innerText=nvTxt;

    AF_listM[lg][0] = nvTxt;


    AffPlanFac(99)

     

}


function FullScreen() {


//var fond = document.getElementById(cnv).value;

//$(fond).addClass("fscreen");
 

var divObj = document.getElementById("planFac");


       //Use the specification method before using prefixed versions
      if (divObj.requestFullscreen) {
        divObj.requestFullscreen();
      }
      else if (divObj.msRequestFullscreen) {
        divObj.msRequestFullscreen();               
      }
      else if (divObj.mozRequestFullScreen) {
        divObj.mozRequestFullScreen();      
      }
      else if (divObj.webkitRequestFullscreen) {
        divObj.webkitRequestFullscreen();       
      } else {
        console.log("Fullscreen API is not supported");
      } 

}

function TabDepl() {


     // création du tableau des déplacements 
     TabPtDplAf=new Array (AF_listM.length);
     for (l=1;l<AF_listM.length; l++){
         TabPtDplAf[l]=new Array (10)

         for (l2=0;l2<10; l2++){
            TabPtDplAf[l][l2] = 0; // initialisation
         }

     }


}

function ChgCPFMin(sens) {

    if(sens=="+") {CPFMin++} else {CPFMin--}
    if (CPFMin<0){CPFMin=0;}

    document.getElementById("BtnCPFmin").textContent=CPFMin;

}