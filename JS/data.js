
////////    //////   ////////  //////
//     //  //    //     //    //    //
//     //  ////////     //    ////////
//     //  //    //     //    //    //
////////   //    //     //    //    //



function okAPI(){
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {

        alert('Votre navigateur ne permet pas de charger des fichiers (File API manquant).');
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////
// Chargement des lignes du fichier DAT/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var openDAT = function(event) {

    wait("Chargement en cours. Merci de patienter "); // affichage de l'indicateur de chargement

    lignesDAT=[];  // vidage du tableau
    var input = event.target;
    fichBase = event.target.files;

    var nomBase1= fichBase[0].name;
    nomBase= nomBase1.substr(0,nomBase1.length-4);
    document.title= nomBase;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;

        text = text.replace(/\r?\n|\r/,'\n') // retrait des sauts de ligne
        // split du texte par lignes \n
        lignesDAT = text.split("\n");



    };

    reader.readAsText(input.files[0],'windows-1252');

    //document.getElementById("BlocBase1").style.visibility = "hidden";


    document.getElementById("BlocBase1").style.backgroundColor = "rgb(210,250,210,0.5)"
    document.getElementById("BlocBase2").style.display = "block";

    endWait()

};



////////////////////////////////////////////////////////////////////////////////////////////////
// ouverture du fichier POS/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var openPOS = function(event) {
    lignesPOS=[];  // vidage du tableau
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;



        // split du texte par lignes \n
        lignesPOS= text.split("\n");
        ChargerPOS() ;
        //chargerREC() ;
    };

    reader.readAsText(input.files[0],'windows-1252');
};


function ChargerPOS() {

    Nom = [0];
    Posi = [0];
    CdMax = [0];
    Reco = [0];
    TypVar = [0];
    Libellé = [0];




    // Création du menu déroulant de sélection des variables
    // nom court


    for (l = 2; l < lignesPOS.length ; l++) {

        if (lignesPOS[l]=="***") {break;}
        if (lignesPOS[l].length < 9) {continue;}

        NbVar = l-1

        // nom court
        Nom.push(lignesPOS[l].substr(0,3));

        // position
        Posi.push(Number(lignesPOS[l].substr(3,4)));

        // Code Max
        var str= lignesPOS[l].substr(7,2);
        var CodeMax=str.trim();

        var posL = CodeMax.indexOf("L");
        if (posL != -1) {nbc= CodeMax.substr(posL+1)
            CodeMax = "9";
            CodeMax = TxtMef(9,nbc,"9");


        }


        CdMax.push(CodeMax);

        var posDol = lignesPOS[l].indexOf("$");

        var rgl= lignesPOS[l].substr(9,posDol-9);

        // recodage éventuel
        Reco.push(rgl);

        // type de variable
        TypVar.push("a");

        str = lignesPOS[l].substring(posDol)
        var LibPropre = str.replace( /\$/g,"")
        LibPropre = LibPropre.replace(/\r?\n|\r/,"") // retrait des sauts de ligne
        Libellé.push(LibPropre);





    };


    document.getElementById("BlocBase2").style.backgroundColor = "rgb(210,250,210,0.5)"
    document.getElementById("BlocBase3").style.display = "block";




    ChargerListVar()


};

function ChargerListVar(){

    var htmlvariables = ``;

    // défilement des variables
    for (v = 1; v < Nom.length; v++) {

        // définition du type d'image à afficher en fonction du type de variable
        var htmlimg = `<img src='Images/\Abc.png'   alt="Abc">`
        if (TypVar[v]!='a') { htmlimg = `<img src="Images/\Num.png"   alt="123">` }

        var htmlmods = ""

        for (m=0;m<4;m++){
            if (TypVar[v]!='a') {

                if (m<=BDD.length && m>0) {htmlmods+=BDD[m][v] + `, `}

            } else {

                if (m<=CdMax[v] && Moda.length >=v) {htmlmods+=Moda[v][m] + `, `}

            }
        }
        htmlmods += " ... (" + CdMax[v] + ")"

        // Ajout de la variable au menu de sélection
        var num = Nom.length-1;
        // htmlvariables = String(htmlvariables) + `<li id='v` + v + `' onclick="SelVar(` + v + `)" style="padding:0px;width:200%">
        //         <table>
        //             <tr >
        //                 <td style="width:20px;font-size:0.75rem;color:rgb(120 120 120)" >`+ v + `</td>
        //                 <td style="width:30px" > `+ htmlimg + `</td>
        //                 <td style="font-weight:bold;"> ` + Nom[v] + ` </td>
        //                 <td >  | ` + Libellé[v] + ` </td>
        //                 <td style="padding-left:10px;font-size:0.85rem;color:rgb(120 120 120);" >`+ htmlmods + `</td>
        //         </table>
        //         </li>`
        htmlvariables += '<a class="list-group-item list-group-item-action" href="#" id=\'v' + v + '\' onclick="SelVar(' + v + ')"><div class="row"><div class="col-id text-right"><small class="text-secondary">' + v + '</small></div><div class="col-11">' + htmlimg + ' <strong>' + Nom[v] + '</strong> | ' + Libellé[v] + ' <small class="text-secondary">' + htmlmods + '</small></div></div></a>';
    }

    document.getElementById("ListVars").innerHTML = htmlvariables;

}


////////////////////////////////////////////////////////////////////////////////////////////////
// Chargement des lignes d'un fichier TR2 depuis le serveur////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function openFich(fich) {

    wait("Chargement en cours. Merci de patienter" ) // affichage de l'indicateur de chargement

    reinit();
    lignesTR2=[];  // vidage du tableau

    // définition du nom de la base
    var posslsh = fich.lastIndexOf('/')
    nomBase1= fich.substr(posslsh+1,fich.length - posslsh);
    nomBase= nomBase1.substr(0,nomBase1.length-4);

    document.title= nomBase;


    var request = new XMLHttpRequest();
    request.open('GET', fich, true);
    request.responseType = 'blob';
    request.onload = function() {

        var reader = new FileReader();
        reader.readAsText(request.response);

        reader.onload =  function(e){
            var text = reader.result;
            text = text.replace(/\r?\n|\r/,'\n') // retrait des sauts de ligne
            // split du texte par lignes \n
            lignesTR2 = text.split("\n");
            TR2versBDD(lignesTR2)

        };
    };
    request.send();


};



////////////////////////////////////////////////////////////////////////////////////////////////
// MISE EN Cases du DAT/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// fonction visant à spliter les lignes du fichier DAT pour un accès aux données sous forme de coordonnées (l,c)

function DATversBDD() {


    BDD = new Array(lignesDAT.length-1);



    // Récupération des valeurs dans la base
    lignesDAT.forEach(MiseEnCases);

    function MiseEnCases(item, index) {


        // agrandissement du tableau
        BDD[index] = new Array(Number(Nom.length));


        // défilement des variables
        for (v = 1; v < Nom.length; v++) {
            //extraction de la valeur pour la case
            var valmodlig = Number(item.substr(Posi[v]-1,CdMax[v].length));
            BDD[index][v] = valmodlig;

        }
    }



}



////////////////////////////////////////////////////////////////////////////////////////////////
// charger les recodages
////////////////////////////////////////////////////////////////////////////////////////////////
function chargerREC() {

    return 0; // la fonction a été remplacée par ValApRec qui interprète les règles de recodage à chaque affichage (plus lent mais plus souple )

/*
    // tableau des recodages (un par variable)
    TabRec= new Array (Number(Nom.length));

    //agrandissement pour chaque modalité de la variable
    for (v = 1; v < Number(TabRec.length); v++) {
        TabRec[v]= new Array (CdMax[v]);
    }

    // mise à zéro
    for (v = 1; v < TabRec.length; v++) {
        for (m = 0; m <= CdMax[v] ; m++) {
            TabRec[v][m]= m;
        }
    }


    // construction de la matrice de recodage pour chaque variables concernée

    for (v = 1; v < TabRec.length; v++) {

        if (Reco[v].trim() != "" && Reco[v].indexOf("=") > 0 ) {

            //alert("prise en compte du recodage de la variable " + v)
            var Rgl = Reco[v].split("/");

            for (r=0;r<Rgl.length;r++){


                var posEgal = Rgl[r].indexOf("=");
                var avEgal= Rgl[r].substr(0,posEgal);
                var apEgal = Rgl[r].substr(posEgal+1);

                var Ssrgl= avEgal.split(",")

                for (s=0;s<Ssrgl.length;s++) {

                    var posTrait = Ssrgl[s].indexOf("-");

                    if (posTrait<0) {
                        var valamodif = Number(Ssrgl[s]);
                        TabRec[v][valamodif] = Number(apEgal);
                    }

                    else {
                        var avTrait=Number(Ssrgl[s].substr(0,posTrait));
                        var apTrait = Number(Ssrgl[s].substr(posTrait+1));

                        for (t=avTrait; t<=apTrait;t++) {
                            TabRec[v][t] = Number(apEgal);
                        }

                    }

                }



            }


        }



    }

*/

}


////////////////////////////////////////////////////////////////////////////////////////////////
// ouverture du fichier DIC/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var openDIC = function(event) {
    lignesDIC=[];  // vidage du tableau
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;

        // split du texte par lignes \n
        lignesDIC = text.split("\n");

        ChargerDIC();

    };

    reader.readAsText(input.files[0],'windows-1252');

    document.getElementById("BlocBase3").style.backgroundColor = "rgb(210,250,210,0.5)"
    document.getElementById("validbase").style.display = "block";
    Traitements()
};


function ChargerDIC() {



    // tableau des modalités (un par variable)
    Moda= new Array (Number(Nom.length));
    ModaO= new Array (Number(Nom.length));

    //agrandissement pour chaque modalité de la variable
    for (v = 0; v < Number(Moda.length); v++) {
        Moda[v]= new Array (CdMax[v]);
        ModaO[v]= new Array (CdMax[v]);
    }


    // mise à zéro

    for (v = 0; v < Moda.length; v++) {
        for (m = 0; m <= CdMax[v] ; m++) {
            Moda[v][m]= m;
            ModaO[v][m]= m;
        }
    }


    // remplissage
    for (l=0 ;l < lignesDIC.length; l++) {

        var varmod = lignesDIC[l].substr(0,3);
        var modamod = lignesDIC[l].substr(3,3);
        modamod=Math.round(modamod);

        //recherche de la variable correspondante
        for (v = 1; v < Number(Nom.length); v++) {

            if (varmod == Nom[v]) {

                var str = lignesDIC[l].substr(7);
                Moda[v][modamod] = str.replace(/\r?\n|\r/,""); // retrait des sauts de ligne
                if (Moda[v][modamod] ==""){ Moda[v][modamod]=modamod };
                ModaO[v][modamod] = Moda[v][modamod]
            }
        }

    }




}


////////////////////////////////////////////////////////////////////////////////////////////////
// lecture d'un dossier ZIP /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var LireZip = function(event) {

    wait("Chargement en cours. Merci de patienter ") // affichage de l'indicateur de chargement
    reinit()


    function handleFile(f) {

        JSZip.loadAsync(f)

            .then(function(zip) {


                var fdat=[];
                var gen="";
                var dossier;


                // boucle d'importation
                zip.forEach(function (relativePath, zipEntry) {


                    var fich = zipEntry.name;

                    detailsf = dossfichext(fich)



                    if (detailsf[2] == ".DAT" || detailsf[2] == ".POS" || detailsf[2] == ".DIC") { fdat.push(fich);} // si fichiers base, ajout du fichier au tableau des fichiers base de données


                    if (detailsf[2]   == ".INI") {  // récupération du générique

                        zip.file(zipEntry.name).async("string").then(function (data) {
                            var lignesini= data.split("\n");
                            gen=lignesini[0];


                        });

                    }


                });



                // s'il n'y a pas de générique défini par le fichier .ini
                if (gen =="") {


                    // y'a t-il plusieurs génériques dans le dossier?
                    if (fdat.length> 1) {

                        // si oui, ouverture du générique le plus avancé
                        detailsf = dossfichext(fdat[fdat.length-1])
                        gen= detailsf[1];

                    }

                    //si non, ouverture du seul trouvé
                    else {
                        detailsf = dossfichext(fdat[0])
                        gen= detailsf[1];
                    }


                }


                nomBase= gen;
                document.title= nomBase;

                function trvfich(nomfich) { //rechercher le nom exact d'un fichier du tableau à partir de son générique et de son extension supposées


                    for (f=0;f<fdat.length;f++)  {

                        var fichsource=fdat[f].toUpperCase();

                        var fichcherch = nomfich.toUpperCase();

                        var trouv=fichsource.indexOf(fichcherch);

                        if (trouv != -1) {

                            return f;
                        }

                    }


                }

                // importation DAT
                var fichDAT = fdat[trvfich(gen + ".DAT")];
                zip.file(fichDAT).async("string").then(function (data) {
                    lignesDAT =[]
                    lignesDAT = data.split("\n");
                    DATversBDD();
                });

                // importation POS
                var fichPOS= fdat[trvfich(gen + ".POS")];
                zip.file(fichPOS).async("string").then(function (data) {
                    lignesPOS= []
                    lignesPOS = data.split("\n");

                    ChargerPOS(); // Analyse du fichier POS
                    chargerREC() // Chargement des recodages
                    // conversion des lignes du DAT en cases de la BDD
                });

                // importation DIC
                var fichDIC= fdat[trvfich(gen +".DIC")];
                zip.file(fichDIC).async("string").then(function (data) {
                    lignesDIC=[];
                    lignesDIC = data.split("\n");

                    ChargerDIC() // Importation du dictionnaire
                });




                Traitements()
                endWait()

                B_A_S_E();
            });
        ;}



    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {


        handleFile(files[i]);



    }


};

////////////////////////////////////////////////////////////////////////////////////////////////
// lecture d'un fichier TR2 /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var LireTR2 = function(event,obj) {

    wait("Chargement en cours. Merci de patienter ") // affichage de l'indicateur de chargement
    reinit();


    var lignesTR2=[];
    var ficheàlire = ""
    var nomBase1 = ""

    if (obj ==undefined && event!= undefined) {
        var input = event.target;
        fichBase = event.target.files;

        ficheàlire = input.files[0];
        nomBase1= fichBase[0].name;
    } else {
        ficheàlire = obj.files[0];
        nomBase1= obj[0].name;

    }


    ///ajoutCookie(nomBase1,input.files[0]) // permettrait d'ajouter en mémoire les infos



    nomBase= nomBase1.substr(0,nomBase1.length-4);
    document.title= nomBase;


    function Lirefichier (fichier) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };



            reader.readAsText(fichier);

        });
    }


    Lirefichier(ficheàlire).then(function (content) {




        //splitage en lignes
        lignesTR2 = content.split("\n")


        //construction de la base TR2
        TR2versBDD(lignesTR2)





    }).catch(function (err) {
        alert("problème lors de l'importation ")
        alert('Erreur lors du chargement du TR2!' + err );

    });



};



function TR2versBDD(lignesTR2) {

    var libdd = 0;
    var lg = 0;
    var nbl= lignesTR2.length-1;

    var sep = String.fromCharCode(9);
    var maxmax = 0;

    // splitage des lignes
    for (l=0;l<lignesTR2.length;l++) {


        if (lignesTR2[l].trim() =="") {continue}


        var col = lignesTR2[l].split(sep)


        if (l==0) {//ligne des en-têtes

            NbVar = col.length;

            // tableau des modalités (un par variable)
            Moda= new Array (NbVar);
            ModaO= new Array (NbVar);

            for (c=1;c<col.length;c++) {

                Nom.push(col[c]);
                Posi.push(0)

            }

        }

        if (l==1) {//ligne des en-têtes


            for (c=1;c<col.length;c++) {

                Libellé.push(col[c]);

            }

        }



        if (l==2) { // ligne des types de variable


            for (c=1;c<col.length;c++) {

                TypVar.push(col[c]);


            }

        }

        if (l==3) { // ligne des recodages


            for (c=1;c<col.length;c++) {

                Reco.push(col[c]);


            }

        }




        if (l==4) { // ligne des codes max


            for (c=1;c<col.length;c++) {
                var valmax = Number(col[c]);
                CdMax.push(valmax);

                Moda[c]= new Array(valmax);
                ModaO[c]= new Array(valmax);

                if (valmax > maxmax && TypVar[c]=='a') {
                    maxmax=valmax; // mémorisation de la valeur max
                } else {

                    // remplissage des modalités numériques
                    if (TypVar[c]=='e' || TypVar[c]=='r') {

                        for (m=0; m<valmax+1;m++){
                            Moda[c][m] = m;
                            ModaO[c][m] = m;
                        }

                    }
                }


            }

        }
        lg = l;

        if (l > 4 && l <=(maxmax+5)){ // chargement des lignes de modalités

            var grm = l-5;

            for (c=1;c<col.length;c++) {

                if (TypVar[c]=='a') {
                    var lib = String(col[c]);

                    if (grm <= CdMax[c]) {

                        var posbar = lib.indexOf("||")

                        if ( posbar > -1) {
                            Moda[c][grm] = lib.substr(0,posbar);
                            ModaO[c][grm] = lib.substr(posbar+2);
                        } else {
                            Moda[c][grm] = lib
                            ModaO[c][grm] = lib
                        }

                    }
                }
            }

        }


        var debDAT ;

        if  (col[0] =='DAT') {debDAT=l+1}

        Number(debDAT);


        if (l>= debDAT && maxmax > 0){// chargement de la base de données


            if (l==debDAT) {

                var nbldat = nbl - debDAT
                BDD = new Array(nbldat);


            }

            BDD[libdd] = new Array(NbVar)

            for (c=1;c<col.length;c++) {

                var valcase = col[c];

                // en cas de valeur décimale
                valcase=valcase.replace( /,/g,".")

                if (valcase.trim() !='') {
                    BDD[libdd][c]=Number(valcase);
                } else {
                    BDD[libdd][c]= ' ' ;

                }



            }

            libdd++;
        }





    }

    //ChargerPOS();
    ChargerListVar();
    //chargerREC();


    Traitements();
    endWait()

    B_A_S_E();

}


////////////////////////////////////////////////////////////////////////////////////////////////
// lecture d'un fichier CSV /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var LireCSV = function(event) {

    wait("Chargement en cours. Merci de patienter ") // affichage de l'indicateur de chargement
    reinit()


    var input = event.target;
    fichBase = event.target.files;

    var ficheàlire = input.files[0];
    var nomBase1= fichBase[0].name;
    nomBase= nomBase1.substr(0,nomBase1.length-4);
    document.title= nomBase;


    function Lirefichier (fichier) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };



            reader.readAsText(fichier,'windows-1252');

        });
    }


    Lirefichier(ficheàlire).then(function (content) {



        //splitage en lignes
        lignesCSV = content.split("\n")
        var nbl= lignesCSV.length;

        var sep = ",";
        sep = QuelSplit()


        if (sep=="?") {

            sep = prompt("Quel est le séparateur de colonnes (par exemple : , ; / ) ?", ",");

            if (sep == null || sep == ""){
                alert("Un séparateur est nécessaire");
                return ;
            }

        }





        if (lignesCSV[nbl]==undefined) {lignesCSV.length=nbl-1 } //suppression de la dernière ligne si elle est vide

        // splitage des lignes
        for (l=0;l<lignesCSV.length;l++) {

            var col = lignesCSV[l].split(sep)

            if (l==0) {NbVar = col.length;}

            // repérer ici les différences par rapport à la ligne d'en-têtes
            if (NbVar == col.length) {

                lignesCSV[l]= new Array (NbVar);


                for (c=0;c<NbVar;c++) {
                    // Analyser ici la colonne et l'éclater si réponses multiples

                    lignesCSV[l][c] = col[c]

                }

            } else {

                var abort = window.confirm ('Erreur lors du chargement du CSV! (problème ligne ' + l + ')\n\n POURSUIVRE le chargement?\n\n')
                if (abort) {

                } else {return 0}


                lignesCSV.splice(l,1)
                l--
            }

        }

        // alert("Fin de l'analyse du fichier CSV. \n Contenu : \n " + NbVar  + " colonnes \n" + lignesCSV.length + " lignes")

        TABversBDD(lignesCSV);

    }).catch(function (err) {
        var abort = window.confirm ('Erreur lors du chargement du CSV! : ' + err + "\n Problème au niveau de la ligne :" + l + "\n Voulez-vous tout de même poursuivre le chargement?");
        if (abort) {

        } else {endWait();return 0}
    });



};

function QuelSplit() { // permet de déterminer le séparateur du fichier csv
    var tabul= String.fromCharCode(9)
    var sep = new Array(";","/",",",tabul);
    var nblig=  lignesCSV.length-1 ;

    if (nblig > 50) {nblig=50};

    for (s=0;s < sep.length;s++) {

        var nbc = lignesCSV[0].split(sep[s]);


        if (nbc.length <=1 ) {continue}
        var nbeg = 0

        for (l=1;l < nblig;l++) {
            var nbc2 = lignesCSV[l].split(sep[s]);
            if (nbc.length == nbc2.length){nbeg++}
        }

        if (nbeg == nblig-1) {return sep[s]};
    }

    return "?";
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Importation d'un fichier XLS
///////////////////////////////////////////////////////////////////////////////////////////////////


var LireXLSX = function(event){

    wait("Chargement en cours. Merci de patienter ") // affichage de l'indicateur de chargement

    reinit()

    var input = event.target;
    fichBase = event.target.files;

    var nomBase1= fichBase[0].name;
    nomBase= nomBase1.substr(0,nomBase1.length-5);
    document.title= nomBase;

    ajoutCookie(fichBase[0].name)


    var reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);




    reader.onload = function(event) {


        var data = new Uint8Array(reader.result);


        var wb = XLSX.read(data,{type:'array'});


        //get the name of First Sheet.
        var Sheet = wb.SheetNames[0];

        // conversion du classeur en tableau
        var tabXLS = XlsToTab(wb.Sheets[Sheet]);


        TABversBDD(tabXLS)

    }


}



//fonction de conversion du classeur EXCEL en tableau source : https://github.com/SheetJS/sheetjs/issues/270
var XlsToTab = function(sheet){
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
        row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
            var nextCell = sheet[
                XLSX.utils.encode_cell({r: rowNum, c: colNum})
                ];
            if( typeof nextCell === 'undefined' ){
                row.push(' ');
            } else row.push(nextCell.w);
        }
        result.push(row);
    }
    return result;
};

function TABversBDD(TabXLS) { // création de la base de données à partir du classeur

    var nblig= TabXLS.length-1;
    NbVar = TabXLS[0].length ;


    //alert("Le tableau à importer a " + nblig + " lignes et " + NbVar + " colonnes")


    var colDAT= new Array(nblig); // pour stocker les valeurs de la colonnes

    BDD = new Array(nblig); // Remise à zéro de la base de données

    for (l=0;l<nblig;l++) { //agrandissement du tableau - ajout des cases
        BDD[l] = new Array(NbVar+1);
    }

    Moda = new Array(NbVar+1)




    // Première analyse des colonnes
    for (c=0;c<NbVar;c++) {


        // analyse de la variable (alpha ou numérique)

        var typv="e"; // par défaut, valeur entières
        var maxval = 0

        for (l=1;l<nblig+1;l++) {

            var valcase=TabXLS[l][c]


            // retrait des sauts de ligne
            valcase=valcase.replace(/\r?\n|\r/,"");

            // en cas de valeur décimale
            valcase=valcase.replace( /,/g,".")

            if(isNaN(valcase)==true) {
                typv="a";//un valeur non numérique a été trouvée, la variable est alphanumérique
                break;
            } else {

                if (Number(valcase) > Number(maxval)) {maxval=valcase} ; // mémorisation de la valeur max trouvée

                if (valcase.indexOf(".") > -1) {
                    typv="r";
                    break;
                }

            }
        }





        var modcol=[0]; // tableau des modalités différentes trouvées pour la variable (pour alphanum)

        // analyse des lignes de la colonne (à partir du rang 1 pour sauter les en-têtes)
        for (l=1;l<nblig+1;l++) {



            var valcol=TabXLS[l][c] //récupération de la valeur de la "case" du tableau



            if (typv == "a") { // comportement en cas de variable alphanumérique (ou multiple)

                // fonction nécessaire pour déclencher la recherche d'index (findIndex plus bas)
                function ValeurCase(valcase) {
                    return valcase == valcol;
                }

                var idx=modcol.findIndex(ValeurCase);

                // la modalité a-t-elle déjà été trouvée?
                if (idx<0) {
                    modcol.push(valcol); // si non,
                    colDAT[l-1] = modcol.length-1; //la valeur de la case équivaut au code le plus avancé

                } else {
                    colDAT[l-1] = idx; //si oui, c'est la valeur d'index qui est ajoutée
                }



            }

            if (typv == "e" || typv == "r" ) { // comportement en cas de variable numérique (entier ou réel)
                var valcase=TabXLS[l][c]
                // en cas de valeur décimale
                valcase=valcase.replace( /,/g,".")

                if (valcase!='') {
                    colDAT[l-1] = Number(valcase);
                } else {
                    colDAT[l-1] = ' ' ; //toString('---');

                }

            }


        }



        // création de la variable
        var nomvar= TxtMef(c+1,3,0);



        if (typv=="a") {
            var maxvar = modcol.length-1;
        }


        var libvar = TabXLS[0][c]; // récupération de l'intitulé de la variable dans la première ligne de la colonne


        if (typv == "e") {maxvar = Number(maxval);}
        if (typv == "r") {
            maxval= Number(maxval);
            maxval = maxval.toFixed(0);
            maxvar = maxval ;
        }

        //Remplissage du tableau des variables
        Nom.push(nomvar);
        Posi.push(0);
        CdMax.push(maxvar)
        Reco.push('');
        TypVar.push(typv);
        Libellé.push(libvar.trim());


        //ajout des modalités au dictionnaire
        Moda[c+1]=new Array(maxvar)
        ModaO[c+1]=new Array(maxvar)

        if (typv=='a'){ // pour les variables alphanumériques, ajout du dictionnaire

            for (m=0; m<modcol.length;m++) {
                Moda[c+1][m] = modcol[m]
                ModaO[c+1][m] = Moda[c+1][m]
            }

        } else {

            for (m=0; m <= maxvar;m++) { // pour les variables quanti, simple reproduction du nombre
                Moda[c+1][m] = m
                ModaO[c+1][m] = Moda[c+1][m]
            }

        }



        // ajout de la case à la base de données BDD


        for (l=0;l<nblig;l++) {

            BDD[l][c+1] = colDAT[l];

        }




    }



    // chargement de la base
    ChargerListVar();
    //chargerREC();


    Traitements();
    B_A_S_E();

    endWait()

}





function reinit(){

    //vidage de la base
    PopTot= 0
    BDD = [0];

    // vidage du dictionnaire des variables
    Nom = [0];
    Posi = [0];
    CdMax = [0];
    Reco = [0];
    TypVar = [0];
    Libellé = [0];

    // vidage des variables mémorisées
    vL=0
    vC=0
    vF=0
    vX=0

    //cache des tableaux précédents
    Vidage('TabBDD','TabTAP','TabTCR','TabEXP');
    document.getElementById("TxtC").placeholder = "Choisissez une variable"
    document.getElementById("TxtL").placeholder = "Choisissez une variable"
    document.getElementById("TxtF").placeholder = "Choisissez une variable"

}

function EffacePnd() {

    vP=0;
    var t= document.getElementById('TxtP');
    t.value = 'Pas de pondération';
    QuelTri()
}

// Avertissement en cas de sortie sans sauvegarde
window.onbeforeunload = function() {
    
    return "Des modifications peuvent ne pas être enregistrées";
  
 };
