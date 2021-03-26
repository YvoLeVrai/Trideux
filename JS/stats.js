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

    var rgl = "";
    if (document.getElementById("TxtRglG")) { // récupération de la règle de recodage

        rgl= document.getElementById("TxtRglG").value

    }

    // Récupération des valeurs dans la colonne extraite et filtrée
    for (l=0 ;l < nbval; l++) {

        // adaptation spontanée au recodage saisi
        var valmod = Number(col[l])


        if (rgl != '') {valmod=ValApRec(valmod,rgl)}


        somme += valmod


    };

    res=somme/nbval;
    res=res.toFixed(NbDec)
    return res;

}

function Quantiles(col) { // comme son nom l'indique


    var nbval=col.length-1;
    var quant=[100,10,4,2,1.3333333,1.111111,1.010101];

    var rgl='';

    if (document.getElementById("TxtRglG")) { // récupération de la règle

        rgl= document.getElementById("TxtRglG").value

    }

    for (q=0;q<quant.length;q++){
        var coeff = Number(quant[q]);

        var pct= nbval/coeff;
        var pctarr= Math.floor(pct)

        // prise en compte spontanée du recodage
        var valmod=  Number(col[pctarr])


        if (rgl.trim() != '') {valmod=ValApRec(valmod,rgl)}


        var quantile= valmod;

        var reste = pct%1;


        if (reste>0){ // correction en cas de reste

            var colsuiv= Number(col[pctarr+1]);

            if (rgl.trim() != '') {colsuiv=ValApRec(colsuiv,rgl)}


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
    if (theo < 5) {theoinf5++}
    if (theo < 1) {theoinf1++}
    var ec = eff-theo;
    var ec=ec*ec;
    var resultat = ec/theo;

    return resultat;

}

// calcul de la probabilité associée au Khi2 (fonction originaire de Trideux - auteur : Philippe Cibois)
function loinorm(ddl,khi) {

    //if (khi < 3) {return 0.001;}
    prob = 0;

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
