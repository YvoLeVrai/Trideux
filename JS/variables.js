var nomBase;
var lignesDAT=[]; // lignes du fichier de données
var lignesPOS=[]; // lignes du dictionnaire des variables
var lignesDIC=[]; // lignes du dictionnaire des modalités
var lignesCSV=[]; // lignes du fichier CSV

var BDD=[]; // Tableau contenant les cases de la base de données
var sensTriBDD ='a'; // définition du sens de tri de la base
var varTriBDD = 0; //variable sur laquelle s'est effectué le dernier tri dans la base (permet d'alterner les sens de tri)
var lCur=0; // mémorisation des coordonnées de la case en cours de modification
var cCur=0;

var TabRec=[]; // enregistrement des recodages

var Nom=[0]; // tableau des NOMS de variable
var Posi=[0]; // tableau des POSITIONS de variable
var CdMax=[0]; // tableau des Codes max de variable
var Reco=[0]; // tableau des recodages de variable
var Libellé=[0]; // tableau des Libellés de variable
var TypVar=[0]; // tableau des types de variable : (a)lpha par défaut dans trideux (n)=numérique (m) = alpha multiple

var vL=0; //variable en lignes
var vC=0; //variable en colonnes
var vF=0; //variable filtre
var vX=0; //variable racine de l'explorateur
var vP=[0]; //variable de pondération

var vCopy= 0; // variable servant aux copiers/collers

var NR; // prise en compte des non réponses
var NRX;
var NRY;
var EFF;
var PCL;
var PCC;
var PCT;
var PopTot=0;
var NbVar=0; // mémorisation générale du nombre de variables dans la base
var Moda=[]; // tableau des modalités courantes
var ModaO=[]; //  tableau des modalités avant recodage
var ModaM=[]; // tableau des modalités multiples
var ModaX=[]; // modalités en ligne
var ModaY=[]; // modalités en colonne
var VarMul=["0",";"]; // mémorisation du statut de la variable (multiple ou non)
var vuDetails =false; // Mémorisation de l'affichage des détails

var Tap=[]; // tris à plat des effectifs par modalité (variables quali)
var TapX=[]; // tri à plat par lignes (pour le tableau croisé)
var TapQ=[]; // tri à plat des valeurs et effectifs pour les variables quanti
var Tcr=[]; // tri croisé
var MrgX=[]; // marges en lignes
var MrgY=[]; // marges en colonnes
var Khi2=0;
var proba=0;
var signif="";
var vcram=0;
var strpied; // pied des tableaux
var strPiedPlain; // pied des tableaux pour la copie plainText

var DebAff=0; // affichage des données à partir de...
var FinAff=49; // affichage des données jusque...
var NbDec=1; //Nombre de décimales (pour l'affichage)

var Colonne=[]; // 1 colonne extraite pour les besoins des analyses des variables numériques
var Cols=[]; // Plusieurs colonnes extraites pour les analyses bivariées

var Quants = []; //mémorisation des quantiles calculés sur la colonne
var Moy = 0; //mémorisation de la moyenne

// variables nécessaires pour l'explorateur
var VarCur ; // variable courante pour l'affichage dans l'explorateur
var IndexDep ; // index du tri à partir duquel a été demandé le sous-tri (si 0)
var ExpVar =[]; // variable
var ExpMod =[]; // modalité
var ExpLib =[]; // libellé
var ExpEff =[]; // effectifs
var ExpPct =[]; // pourcentage au niveau
var ExpPctT = []; // pourcentage du total
var ExpMum =[]; // 'mère de la moda'
var ExpRng = []; // rang (nombre d'ascendants)
var ExpRgDp;
var nbmum; // variable de calcul du nombre d'ascendants


//
var FLCXR; // contexte de sélection de la variable (filtre ligne colonne ou explorateur)