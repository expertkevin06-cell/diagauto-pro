// ============================================
// IMPORT-BASE-MASSIVE.JS
// Module complet avec recherche prédictive intelligente
// Version: 3.0.0
// ============================================

(function() {
    'use strict';

    const CONFIG = {
        SOURCE_URL: 'https://expertkevin06-cell.github.io/appli-aide-technique/',
        DB_NAME: 'DiagAutoDB',
        DB_VERSION: 3,
        STORES: {
            DIAGNOSTICS: 'diagnostics',
            VEHICULES: 'vehicules',
            INTERVENTIONS: 'interventions'
        }
    };

    // Base de données complète avec diagnostics pertinents
    const DATABASE = [
        // Peugeot 3008
        {
            marque: "Peugeot",
            modele: "3008",
            motorisation: "1.5 BlueHDi",
            puissance: "130",
            carburant: "Diesel",
            organe: "Chaîne de distribution",
            probleme: "Usure prématurée chaîne distribution",
            symptomes: ["Bruit métallique moteur", "Voyant moteur allumé", "Perte de puissance"],
            codesDefaut: ["P0016", "P0017"],
            solution: "Remplacement chaîne + tendeurs + guides",
            pieces: ["Kit chaîne distribution", "Tendeur hydraulique", "Guides chaîne"],
            cout: "800-1200€",
            temps: "6-8h",
            motsCles: ["chaîne", "distribution", "3008", "1.5", "bluehdi", "bruit", "n47", "diesel"]
        },
        {
            marque: "Peugeot",
            modele: "3008",
            motorisation: "1.2 PureTech",
            puissance: "130",
            carburant: "Essence",
            organe: "Courroie de distribution",
            probleme: "Casse courroie distribution",
            symptomes: ["Arrêt moteur brutal", "Impossible de redémarrer", "Bruit de claquement"],
            codesDefaut: [],
            solution: "Remplacement courroie + kit complet + pompe à eau",
            pieces: ["Kit courroie distribution", "Pompe à eau", "Galets tendeurs"],
            cout: "600-900€",
            temps: "4-5h",
            motsCles: ["courroie", "distribution", "3008", "puretech", "1.2", "casse", "essence"]
        },
        {
            marque: "Peugeot",
            modele: "3008",
            motorisation: "1.6 BlueHDi",
            puissance: "120",
            carburant: "Diesel",
            organe: "FAP (Filtre à Particules)",
            probleme: "Colmatage FAP",
            symptomes: ["Voyant FAP allumé", "Mode dégradé", "Perte puissance", "Fumée noire"],
            codesDefaut: ["P2002", "P2458"],
            solution: "Nettoyage ou remplacement FAP + régénération forcée",
            pieces: ["FAP neuf", "Capteur pression différentielle"],
            cout: "1500-2500€",
            temps: "3-4h",
            motsCles: ["fap", "filtre", "particules", "3008", "1.6", "colmatage", "dpf", "encrassement"]
        },
        // Peugeot 208
        {
            marque: "Peugeot",
            modele: "208",
            motorisation: "1.2 PureTech",
            puissance: "110",
            carburant: "Essence",
            organe: "Courroie de distribution",
            probleme: "Usure prématurée courroie",
            symptomes: ["Bruit de claquement", "Voyant entretien", "Préconisation 60 000km au lieu de 100 000km"],
            codesDefaut: [],
            solution: "Remplacement préventif courroie + kit",
            pieces: ["Kit courroie distribution", "Pompe à eau", "Galets"],
            cout: "500-700€",
            temps: "3-4h",
            motsCles: ["courroie", "distribution", "208", "puretech", "1.2", "usure", "prématurée"]
        },
        {
            marque: "Peugeot",
            modele: "208",
            motorisation: "1.5 BlueHDi",
            puissance: "100",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Encrassement vanne EGR",
            symptomes: ["Ralenti instable", "Voyant moteur", "Fumée noire", "Perte puissance"],
            codesDefaut: ["P0401", "P0402"],
            solution: "Nettoyage ou remplacement vanne EGR",
            pieces: ["Vanne EGR", "Joint EGR"],
            cout: "300-500€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "208", "1.5", "bluehdi", "encrassement", "ralenti"]
        },
        // Renault Clio
        {
            marque: "Renault",
            modele: "Clio",
            motorisation: "1.5 dCi",
            puissance: "90",
            carburant: "Diesel",
            organe: "Injecteurs",
            probleme: "Défaillance injecteurs",
            symptomes: ["Ratés d'allumage", "Voyant moteur", "Consommation excessive", "Fumée blanche"],
            codesDefaut: ["P0201", "P0202", "P0203", "P0204"],
            solution: "Remplacement injecteurs défectueux + codage",
            pieces: ["Injecteurs neufs", "Joints injecteurs"],
            cout: "800-1500€",
            temps: "4-5h",
            motsCles: ["injecteur", "clio", "1.5", "dci", "défaillance", "raté", "fuite"]
        },
        {
            marque: "Renault",
            modele: "Clio",
            motorisation: "1.2 TCe",
            puissance: "120",
            carburant: "Essence",
            organe: "Chaîne de distribution",
            probleme: "Détente chaîne distribution",
            symptomes: ["Bruit de chaîne au démarrage", "Claquement moteur", "Voyant moteur"],
            codesDefaut: ["P0016"],
            solution: "Remplacement chaîne + tendeur + guides",
            pieces: ["Kit chaîne distribution", "Tendeur hydraulique"],
            cout: "1200-1800€",
            temps: "8-10h",
            motsCles: ["chaîne", "distribution", "clio", "1.2", "tce", "détente", "bruit"]
        },
        {
            marque: "Renault",
            modele: "Clio",
            motorisation: "1.5 dCi",
            puissance: "110",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Blocage vanne EGR",
            symptomes: ["Mode dégradé", "Voyant anti-pollution", "Perte puissance"],
            codesDefaut: ["P0401", "P0403"],
            solution: "Nettoyage ou remplacement vanne EGR",
            pieces: ["Vanne EGR neuve", "Joint"],
            cout: "400-600€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "clio", "1.5", "dci", "blocage", "encrassement"]
        },
        // BMW
        {
            marque: "BMW",
            modele: "Serie 1",
            motorisation: "116d N47",
            puissance: "116",
            carburant: "Diesel",
            organe: "Chaîne de distribution",
            probleme: "Casse chaîne distribution N47",
            symptomes: ["Bruit métallique fort", "Casse moteur si non traité", "Voyant moteur"],
            codesDefaut: ["P0016", "P0017"],
            solution: "Remplacement préventif chaîne + guides + tendeur",
            pieces: ["Kit chaîne distribution N47", "Guides supérieurs", "Tendeur"],
            cout: "2000-3000€",
            temps: "10-12h",
            motsCles: ["chaîne", "distribution", "bmw", "n47", "serie 1", "116d", "casse", "préventif"]
        },
        {
            marque: "BMW",
            modele: "Serie 3",
            motorisation: "320d N47",
            puissance: "184",
            carburant: "Diesel",
            organe: "Chaîne de distribution",
            probleme: "Usure chaîne distribution N47",
            symptomes: ["Bruit de chaîne au démarrage à froid", "Cliquetis moteur"],
            codesDefaut: ["P0016"],
            solution: "Remplacement complet kit chaîne",
            pieces: ["Kit chaîne N47", "Guides", "Tendeur hydraulique"],
            cout: "2500-3500€",
            temps: "12-15h",
            motsCles: ["chaîne", "distribution", "bmw", "serie 3", "320d", "n47", "usure", "bruit"]
        },
        {
            marque: "BMW",
            modele: "Serie 3",
            motorisation: "320d B47",
            puissance: "190",
            carburant: "Diesel",
            organe: "Turbo",
            probleme: "Défaillance turbocompresseur",
            symptomes: ["Sifflement turbo", "Perte puissance", "Fumée bleue", "Consommation huile"],
            codesDefaut: ["P0299", "P0234"],
            solution: "Remplacement turbo + vidange huile + nettoyage admission",
            pieces: ["Turbocompresseur neuf", "Joint turbo", "Huile moteur"],
            cout: "2000-3000€",
            temps: "6-8h",
            motsCles: ["turbo", "bmw", "serie 3", "320d", "b47", "sifflement", "défaillance"]
        },
        // Volkswagen
        {
            marque: "Volkswagen",
            modele: "Golf",
            motorisation: "1.6 TDI",
            puissance: "105",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Encrassement vanne EGR",
            symptomes: ["Voyant moteur", "Mode dégradé", "Ralenti instable"],
            codesDefaut: ["P0401", "P0402"],
            solution: "Nettoyage vanne EGR ou remplacement",
            pieces: ["Vanne EGR", "Joint"],
            cout: "350-550€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "golf", "1.6", "tdi", "encrassement", "volkswagen"]
        },
        {
            marque: "Volkswagen",
            modele: "Golf",
            motorisation: "2.0 TDI",
            puissance: "150",
            carburant: "Diesel",
            organe: "FAP (Filtre à Particules)",
            probleme: "Colmatage FAP",
            symptomes: ["Voyant FAP", "Régénération impossible", "Mode dégradé"],
            codesDefaut: ["P2002", "P2458"],
            solution: "Nettoyage professionnel ou remplacement FAP",
            pieces: ["FAP neuf", "Capteur pression"],
            cout: "1800-2800€",
            temps: "4-5h",
            motsCles: ["fap", "filtre", "particules", "golf", "2.0", "tdi", "colmatage", "dpf"]
        },
        {
            marque: "Volkswagen",
            modele: "Golf",
            motorisation: "1.4 TSI",
            puissance: "125",
            carburant: "Essence",
            organe: "Chaîne de distribution",
            probleme: "Détente chaîne distribution",
            symptomes: ["Bruit de chaîne au démarrage", "Claquement moteur chaud"],
            codesDefaut: ["P0016"],
            solution: "Remplacement chaîne + tendeur hydraulique",
            pieces: ["Kit chaîne distribution", "Tendeur hydraulique"],
            cout: "1500-2200€",
            temps: "8-10h",
            motsCles: ["chaîne", "distribution", "golf", "1.4", "tsi", "détente", "bruit"]
        },
        // Audi
        {
            marque: "Audi",
            modele: "A3",
            motorisation: "1.6 TDI",
            puissance: "110",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Défaut vanne EGR",
            symptomes: ["Voyant moteur", "Perte puissance", "Fumée noire"],
            codesDefaut: ["P0401", "P0403"],
            solution: "Remplacement vanne EGR",
            pieces: ["Vanne EGR neuve", "Joint"],
            cout: "400-600€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "audi", "a3", "1.6", "tdi", "défaut"]
        },
        {
            marque: "Audi",
            modele: "A4",
            motorisation: "2.0 TDI",
            puissance: "150",
            carburant: "Diesel",
            organe: "Pompe à huile",
            probleme: "Défaillance pompe à huile",
            symptomes: ["Voyant pression huile", "Bruit moteur", "Surchauffe"],
            codesDefaut: ["P0520"],
            solution: "Remplacement pompe à huile + crépine",
            pieces: ["Pompe à huile", "Crépine", "Joint carter"],
            cout: "1200-1800€",
            temps: "6-8h",
            motsCles: ["pompe", "huile", "audi", "a4", "2.0", "tdi", "pression", "défaillance"]
        },
        // Mercedes
        {
            marque: "Mercedes-Benz",
            modele: "Classe A",
            motorisation: "A 180 CDI",
            puissance: "109",
            carburant: "Diesel",
            organe: "Injecteurs",
            probleme: "Fuite injecteurs",
            symptomes: ["Odeur gasoil", "Consommation excessive", "Démarrage difficile"],
            codesDefaut: ["P0201", "P0202"],
            solution: "Remplacement injecteurs + joints",
            pieces: ["Injecteurs neufs", "Joints injecteurs", "Rondelles pare-feu"],
            cout: "1000-1600€",
            temps: "4-5h",
            motsCles: ["injecteur", "mercedes", "classe a", "180", "cdi", "fuite", "gasoil"]
        },
        {
            marque: "Mercedes-Benz",
            modele: "Classe C",
            motorisation: "C 220 CDI",
            puissance: "170",
            carburant: "Diesel",
            organe: "Turbo",
            probleme: "Fuite huile turbo",
            symptomes: ["Consommation huile", "Fumée bleue", "Sifflement"],
            codesDefaut: ["P0299"],
            solution: "Remplacement turbo + nettoyage admission",
            pieces: ["Turbo neuf", "Joints turbo", "Durites"],
            cout: "2200-3200€",
            temps: "6-8h",
            motsCles: ["turbo", "mercedes", "classe c", "220", "cdi", "fuite", "huile"]
        },
        // Toyota
        {
            marque: "Toyota",
            modele: "Yaris",
            motorisation: "1.4 D-4D",
            puissance: "90",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Encrassement EGR",
            symptomes: ["Ralenti instable", "Voyant moteur", "Perte puissance"],
            codesDefaut: ["P0401"],
            solution: "Nettoyage vanne EGR",
            pieces: ["Nettoyant EGR", "Joint"],
            cout: "150-250€",
            temps: "1-2h",
            motsCles: ["egr", "vanne", "toyota", "yaris", "1.4", "d4d", "encrassement"]
        },
        {
            marque: "Toyota",
            modele: "RAV4",
            motorisation: "2.2 D-4D",
            puissance: "150",
            carburant: "Diesel",
            organe: "FAP",
            probleme: "Colmatage FAP",
            symptomes: ["Voyant FAP", "Régénération échouée", "Mode dégradé"],
            codesDefaut: ["P2002"],
            solution: "Nettoyage ou remplacement FAP",
            pieces: ["FAP neuf", "Capteur différentiel"],
            cout: "1600-2400€",
            temps: "4-5h",
            motsCles: ["fap", "filtre", "particules", "toyota", "rav4", "2.2", "d4d", "colmatage"]
        },
        // Ford
        {
            marque: "Ford",
            modele: "Focus",
            motorisation: "1.6 TDCi",
            puissance: "115",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Blocage vanne EGR",
            symptomes: ["Mode dégradé", "Voyant anti-pollution", "Perte puissance"],
            codesDefaut: ["P0401", "P0403"],
            solution: "Nettoyage ou remplacement vanne EGR",
            pieces: ["Vanne EGR", "Joint"],
            cout: "350-550€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "ford", "focus", "1.6", "tdci", "blocage"]
        },
        {
            marque: "Ford",
            modele: "Focus",
            motorisation: "1.0 EcoBoost",
            puissance: "125",
            carburant: "Essence",
            organe: "Courroie de distribution",
            probleme: "Usure courroie distribution",
            symptomes: ["Bruit moteur", "Préconisation remplacement 150 000km"],
            codesDefaut: [],
            solution: "Remplacement courroie + kit complet",
            pieces: ["Kit courroie", "Pompe à eau", "Galets"],
            cout: "600-900€",
            temps: "5-6h",
            motsCles: ["courroie", "distribution", "ford", "focus", "1.0", "ecoboost", "usure"]
        },
        // Citroën
        {
            marque: "Citroën",
            modele: "C3",
            motorisation: "1.2 PureTech",
            puissance: "82",
            carburant: "Essence",
            organe: "Courroie de distribution",
            probleme: "Usure prématurée courroie",
            symptomes: ["Bruit de claquement", "Préconisation 60 000km"],
            codesDefaut: [],
            solution: "Remplacement préventif courroie",
            pieces: ["Kit courroie", "Pompe à eau"],
            cout: "450-650€",
            temps: "3-4h",
            motsCles: ["courroie", "distribution", "citroën", "c3", "1.2", "puretech", "usure"]
        },
        {
            marque: "Citroën",
            modele: "C4",
            motorisation: "1.6 BlueHDi",
            puissance: "120",
            carburant: "Diesel",
            organe: "FAP",
            probleme: "Colmatage FAP",
            symptomes: ["Voyant FAP", "Régénération impossible", "Mode dégradé"],
            codesDefaut: ["P2002", "P2458"],
            solution: "Nettoyage ou remplacement FAP",
            pieces: ["FAP neuf", "Capteur pression"],
            cout: "1400-2200€",
            temps: "4-5h",
            motsCles: ["fap", "filtre", "particules", "citroën", "c4", "1.6", "bluehdi", "colmatage"]
        },
        // Opel
        {
            marque: "Opel",
            modele: "Corsa",
            motorisation: "1.3 CDTI",
            puissance: "95",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Encrassement vanne EGR",
            symptomes: ["Ralenti instable", "Voyant moteur", "Fumée noire"],
            codesDefaut: ["P0401", "P0402"],
            solution: "Nettoyage vanne EGR",
            pieces: ["Nettoyant EGR", "Joint"],
            cout: "200-350€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "opel", "corsa", "1.3", "cdti", "encrassement"]
        },
        // Dacia
        {
            marque: "Dacia",
            modele: "Duster",
            motorisation: "1.5 dCi",
            puissance: "110",
            carburant: "Diesel",
            organe: "Injecteurs",
            probleme: "Usure injecteurs",
            symptomes: ["Fumée noire", "Consommation excessive", "Ralenti instable"],
            codesDefaut: ["P0201", "P0202"],
            solution: "Remplacement injecteurs",
            pieces: ["Injecteurs neufs", "Joints"],
            cout: "700-1200€",
            temps: "4-5h",
            motsCles: ["injecteur", "dacia", "duster", "1.5", "dci", "usure", "fuite"]
        },
        {
            marque: "Dacia",
            modele: "Sandero",
            motorisation: "0.9 TCe",
            puissance: "90",
            carburant: "Essence",
            organe: "Chaîne de distribution",
            probleme: "Détente chaîne",
            symptomes: ["Bruit de chaîne au démarrage", "Claquement"],
            codesDefaut: ["P0016"],
            solution: "Remplacement chaîne + tendeur",
            pieces: ["Kit chaîne", "Tendeur hydraulique"],
            cout: "1100-1600€",
            temps: "7-9h",
            motsCles: ["chaîne", "distribution", "dacia", "sandero", "0.9", "tce", "détente"]
        },
        // Hyundai
        {
            marque: "Hyundai",
            modele: "Tucson",
            motorisation: "1.7 CRDi",
            puissance: "116",
            carburant: "Diesel",
            organe: "Turbo",
            probleme: "Défaillance turbo",
            symptomes: ["Sifflement", "Perte puissance", "Fumée bleue"],
            codesDefaut: ["P0299"],
            solution: "Remplacement turbo",
            pieces: ["Turbo neuf", "Joints", "Durites"],
            cout: "1800-2600€",
            temps: "6-8h",
            motsCles: ["turbo", "hyundai", "tucson", "1.7", "crdi", "sifflement", "défaillance"]
        },
        // Kia
        {
            marque: "Kia",
            modele: "Sportage",
            motorisation: "1.7 CRDi",
            puissance: "116",
            carburant: "Diesel",
            organe: "FAP",
            probleme: "Colmatage FAP",
            symptomes: ["Voyant FAP", "Mode dégradé", "Régénération impossible"],
            codesDefaut: ["P2002"],
            solution: "Nettoyage ou remplacement FAP",
            pieces: ["FAP neuf", "Capteur pression"],
            cout: "1500-2300€",
            temps: "4-5h",
            motsCles: ["fap", "filtre", "particules", "kia", "sportage", "1.7", "crdi", "colmatage"]
        },
        // Nissan
        {
            marque: "Nissan",
            modele: "Qashqai",
            motorisation: "1.5 dCi",
            puissance: "110",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Blocage vanne EGR",
            symptomes: ["Mode dégradé", "Voyant moteur", "Perte puissance"],
            codesDefaut: ["P0401", "P0403"],
            solution: "Nettoyage ou remplacement vanne EGR",
            pieces: ["Vanne EGR", "Joint"],
            cout: "400-600€",
            temps: "2-3h",
            motsCles: ["egr", "vanne", "nissan", "qashqai", "1.5", "dci", "blocage"]
        },
        // Organes génériques
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Diesel moderne",
            puissance: "Toutes",
            carburant: "Diesel",
            organe: "FAP (Filtre à Particules)",
            probleme: "Colmatage FAP - Problème courant",
            symptomes: ["Voyant FAP allumé", "Mode dégradé", "Perte de puissance", "Fumée noire", "Régénération impossible"],
            codesDefaut: ["P2002", "P2458", "P2463"],
            solution: "1. Régénération forcée en atelier\n2. Nettoyage professionnel FAP\n3. Remplacement si colmatage irréversible",
            pieces: ["FAP neuf ou reconditionné", "Capteur pression différentielle", "Joint FAP"],
            cout: "1200-3000€ selon véhicule",
            temps: "3-5h",
            motsCles: ["fap", "filtre", "particules", "colmatage", "diesel", "dpf", "encrassement", "régénération"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Essence moderne",
            puissance: "Toutes",
            carburant: "Essence",
            organe: "Courroie de distribution",
            probleme: "Usure courroie distribution - Maintenance préventive",
            symptomes: ["Aucun symptôme avant rupture", "Bruit de claquement si usée", "Préconisation constructeur"],
            codesDefaut: [],
            solution: "Remplacement préventif selon préconisation constructeur (généralement 60 000 à 150 000 km)",
            pieces: ["Kit courroie distribution complet", "Pompe à eau (souvent entraînée)", "Galets tendeurs et enrouleurs", "Joint de carter distribution"],
            cout: "500-1500€ selon véhicule",
            temps: "4-8h",
            motsCles: ["courroie", "distribution", "usure", "préventif", "casse", "entretien", "kilométrage"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Diesel moderne",
            puissance: "Toutes",
            carburant: "Diesel",
            organe: "Vanne EGR",
            probleme: "Encrassement vanne EGR - Problème très courant",
            symptomes: ["Ralenti instable", "Voyant moteur allumé", "Mode dégradé", "Perte de puissance", "Fumée noire", "À-coups à l'accélération"],
            codesDefaut: ["P0401", "P0402", "P0403", "P0404"],
            solution: "1. Nettoyage vanne EGR (solution économique)\n2. Remplacement vanne EGR si très encrassée\n3. Désactivation EGR (solution non homologuée)",
            pieces: ["Vanne EGR neuve ou nettoyée", "Joint vanne EGR", "Nettoyant spécial EGR"],
            cout: "200-800€ selon véhicule et solution",
            temps: "2-4h",
            motsCles: ["egr", "vanne", "encrassement", "ralenti", "instable", "nettoyage", "diesel", "pollution"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs turbo",
            puissance: "Toutes",
            carburant: "Tous",
            organe: "Turbocompresseur",
            probleme: "Défaillance turbo - Usure mécanique",
            symptomes: ["Sifflement anormal", "Perte de puissance", "Fumée bleue ou noire", "Consommation d'huile excessive", "Bruit de soufflerie"],
            codesDefaut: ["P0299", "P0234", "P0235", "P0236"],
            solution: "1. Remplacement turbocompresseur\n2. Vérification et nettoyage circuit d'huile\n3. Remplacement durites et joints",
            pieces: ["Turbocompresseur neuf ou échange standard", "Joint turbo", "Durites d'huile", "Huile moteur neuve"],
            cout: "1500-4000€ selon véhicule",
            temps: "6-10h",
            motsCles: ["turbo", "turbocompresseur", "sifflement", "défaillance", "fuite", "huile", "puissance"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs diesel",
            puissance: "Toutes",
            carburant: "Diesel",
            organe: "Injecteurs",
            probleme: "Usure ou défaillance injecteurs",
            symptomes: ["Ratés d'allumage", "Ralenti instable", "Consommation excessive", "Fumée noire ou blanche", "Démarrage difficile", "Claquement moteur"],
            codesDefaut: ["P0201", "P0202", "P0203", "P0204", "P0261", "P0262"],
            solution: "1. Test des injecteurs (débit, étanchéité)\n2. Remplacement injecteurs défectueux\n3. Codage des nouveaux injecteurs",
            pieces: ["Injecteurs neufs ou reconditionnés", "Joints injecteurs", "Rondelles pare-feu"],
            cout: "600-2000€ selon nombre et véhicule",
            temps: "4-8h",
            motsCles: ["injecteur", "injection", "fuite", "défaillance", "raté", "diesel", "common rail"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs",
            puissance: "Toutes",
            carburant: "Tous",
            organe: "Alternateur",
            probleme: "Défaillance alternateur",
            symptomes: ["Voyant batterie allumé", "Batterie qui se décharge", "Phares qui faiblissent", "Démarrage difficile"],
            codesDefaut: ["P0562", "P0563"],
            solution: "Remplacement alternateur + vérification batterie",
            pieces: ["Alternateur neuf ou échange standard", "Courroie d'accessoire", "Tendeur"],
            cout: "400-800€",
            temps: "2-3h",
            motsCles: ["alternateur", "batterie", "charge", "défaillance", "voyant", "courroie"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs",
            puissance: "Toutes",
            carburant: "Tous",
            organe: "Démarreur",
            probleme: "Défaillance démarreur",
            symptomes: ["Moteur ne démarre pas", "Clic au démarrage", "Démarreur tourne dans le vide", "Bruit de grincement"],
            codesDefaut: ["P0615", "P0616"],
            solution: "Remplacement démarreur + vérification batterie et câbles",
            pieces: ["Démarreur neuf ou échange standard", "Solénoïde"],
            cout: "300-700€",
            temps: "2-4h",
            motsCles: ["démarreur", "démarrage", "ne démarre pas", "clic", "solénoïde"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs",
            puissance: "Toutes",
            carburant: "Tous",
            organe: "Embrayage",
            probleme: "Usure embrayage",
            symptomes: ["Embrayage qui patine", "Pédale dure", "Difficulté à passer les vitesses", "Odeur de brûlé"],
            codesDefaut: [],
            solution: "Remplacement kit embrayage complet",
            pieces: ["Kit embrayage (disque, mécanisme, butée)", "Volant moteur (si bi-masse)"],
            cout: "800-2000€",
            temps: "6-10h",
            motsCles: ["embrayage", "patine", "disque", "butée", "volant moteur", "vitesse"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs",
            puissance: "Toutes",
            carburant: "Tous",
            organe: "Pompe à eau",
            probleme: "Fuite pompe à eau",
            symptomes: ["Fuite liquide refroidissement", "Surchauffe moteur", "Bruit de roulement"],
            codesDefaut: ["P0217"],
            solution: "Remplacement pompe à eau + liquide refroidissement",
            pieces: ["Pompe à eau neuve", "Joint pompe", "Liquide refroidissement"],
            cout: "300-600€",
            temps: "2-4h",
            motsCles: ["pompe", "eau", "fuite", "refroidissement", "surchauffe", "température"]
        },
        {
            marque: "Toutes marques",
            modele: "Tous modèles",
            motorisation: "Tous moteurs",
            puissance: "Toutes",
            carburant: "Tous",
            organe: "Radiateur",
            probleme: "Fuite ou colmatage radiateur",
            symptomes: ["Surchauffe moteur", "Fuite liquide refroidissement", "Ventilateur en permanence"],
            codesDefaut: ["P0217"],
            solution: "Remplacement radiateur + liquide refroidissement",
            pieces: ["Radiateur neuf", "Liquide refroidissement", "Durites"],
            cout: "400-800€",
            temps: "3-5h",
            motsCles: ["radiateur", "refroidissement", "surchauffe", "fuite", "température"]
        }
    ];

    // ============================================
    // GESTION IndexedDB
    // ============================================
    class DatabaseManager {
        async open() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);
                
                request.onerror = () => reject(request.error);
                
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    if (!db.objectStoreNames.contains(CONFIG.STORES.DIAGNOSTICS)) {
                        const store = db.createObjectStore(CONFIG.STORES.DIAGNOSTICS, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        store.createIndex('marque', 'marque', { unique: false });
                        store.createIndex('modele', 'modele', { unique: false });
                        store.createIndex('organe', 'organe', { unique: false });
                    }
                    
                    if (!db.objectStoreNames.contains(CONFIG.STORES.VEHICULES)) {
                        db.createObjectStore(CONFIG.STORES.VEHICULES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                    }
                    
                    if (!db.objectStoreNames.contains(CONFIG.STORES.INTERVENTIONS)) {
                        db.createObjectStore(CONFIG.STORES.INTERVENTIONS, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                    }
                };
            });
        }

        async importAll() {
            if (!this.db) await this.open();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.DIAGNOSTICS], 'readwrite');
                const store = transaction.objectStore(CONFIG.STORES.DIAGNOSTICS);
                
                store.clear();
                
                DATABASE.forEach(item => {
                    store.add({
                        ...item,
                        dateImport: new Date().toISOString()
                    });
                });
                
                transaction.oncomplete = () => {
                    resolve({ success: true, count: DATABASE.length });
                };
                transaction.onerror = () => reject(transaction.error);
            });
        }

        async getAllDiagnostics() {
            if (!this.db) await this.open();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.DIAGNOSTICS], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.DIAGNOSTICS);
                const request = store.getAll();
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        close() {
            if (this.db) {
                this.db.close();
                this.db = null;
            }
        }
    }

    // ============================================
    // RECHERCHE INTELLIGENTE PRÉDICTIVE
    // ============================================
    class RechercheIntelligente {
        constructor() {
            this.db = new DatabaseManager();
            this.searchInput = document.getElementById('searchInput');
            this.autocompleteResults = document.getElementById('autocompleteResults');
            this.resultsContainer = document.getElementById('resultsContainer');
            this.allDiagnostics = [];
            
            this.init();
        }

        async init() {
            try {
                await this.loadData();
                this.attachEvents();
            } catch (error) {
                console.error('Erreur initialisation recherche:', error);
            }
        }

        async loadData() {
            this.allDiagnostics = await this.db.getAllDiagnostics();
            console.log(`✅ ${this.allDiagnostics.length} diagnostics chargés`);
        }

        attachEvents() {
            if (this.searchInput) {
                this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
                this.searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.lancerRecherche();
                    }
                    if (e.key === 'Escape') {
                        this.autocompleteResults.style.display = 'none';
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (!this.autocompleteResults.contains(e.target) && e.target !== this.searchInput) {
                    this.autocompleteResults.style.display = 'none';
                }
            });
        }

        handleSearch(event) {
            const query = event.target.value.trim();
            
            if (query.length < 2) {
                this.autocompleteResults.style.display = 'none';
                return;
            }

            const results = this.performSearch(query);
            this.displayAutocomplete(results, query);
        }

        performSearch(query) {
            const queryLower = query.toLowerCase();
            const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 1);
            const results = [];

            this.allDiagnostics.forEach(diag => {
                let score = 0;
                let matchDetails = [];

                // Recherche dans tous les champs
                const searchableText = [
                    diag.marque,
                    diag.modele,
                    diag.motorisation,
                    diag.puissance,
                    diag.organe,
                    diag.probleme,
                    ...diag.symptomes,
                    ...diag.motsCles,
                    ...diag.codesDefaut
                ].join(' ').toLowerCase();

                // Calcul du score de pertinence
                queryTerms.forEach(term => {
                    if (searchableText.includes(term)) {
                        score += 10;
                        
                        // Bonus pour correspondances exactes
                        if (diag.marque.toLowerCase().includes(term)) {
                            score += 20;
                            matchDetails.push('marque');
                        }
                        if (diag.modele.toLowerCase().includes(term)) {
                            score += 20;
                            matchDetails.push('modèle');
                        }
                        if (diag.motorisation.toLowerCase().includes(term)) {
                            score += 15;
                            matchDetails.push('motorisation');
                        }
                        if (diag.organe.toLowerCase().includes(term)) {
                            score += 15;
                            matchDetails.push('organe');
                        }
                        if (diag.motsCles.some(mc => mc.toLowerCase().includes(term))) {
                            score += 10;
                            matchDetails.push('mot-clé');
                        }
                    }
                });

                // Bonus si tous les termes sont trouvés
                if (queryTerms.every(term => searchableText.includes(term))) {
                    score += 30;
                }

                if (score > 0) {
                    results.push({
                        score: score,
                        diag: diag,
                        matchDetails: [...new Set(matchDetails)]
                    });
                }
            });

            // Trier par score décroissant
            results.sort((a, b) => b.score - a.score);

            return results.slice(0, 10);
        }

        displayAutocomplete(results, query) {
            if (results.length === 0) {
                this.autocompleteResults.style.display = 'none';
                return;
            }

            const html = results.map(result => {
                const diag = result.diag;
                const highlightedTitle = this.highlightMatch(`${diag.marque} ${diag.modele} - ${diag.organe}`, query);
                
                const tags = result.matchDetails.map(detail => 
                    `<span class="tag ${detail}">${detail}</span>`
                ).join('');

                return `
                    <div class="autocomplete-item" data-id="${diag.id}">
                        <div class="title">${highlightedTitle}</div>
                        <div class="description">${diag.probleme}</div>
                        <div class="tags">${tags}</div>
                    </div>
                `;
            }).join('');

            this.autocompleteResults.innerHTML = html;
            this.autocompleteResults.style.display = 'block';

            // Attacher les événements de clic
            this.autocompleteResults.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = parseInt(item.dataset.id);
                    this.selectResult(id);
                });
            });
        }

        highlightMatch(text, query) {
            const queryTerms = query.split(/\s+/).filter(t => t.length > 1);
            let highlighted = text;
            
            queryTerms.forEach(term => {
                const regex = new RegExp(`(${term})`, 'gi');
                highlighted = highlighted.replace(regex, '<strong>$1</strong>');
            });
            
            return highlighted;
        }

        selectResult(id) {
            const diag = this.allDiagnostics.find(d => d.id === id);
            if (diag) {
                this.searchInput.value = `${diag.marque} ${diag.modele} ${diag.organe}`;
                this.autocompleteResults.style.display = 'none';
                this.displayDetailedResult(diag);
            }
        }

        async lancerRecherche() {
            const query = this.searchInput.value.trim();
            
            if (!query) {
                this.resultsContainer.innerHTML = '<div class="no-results">Veuillez entrer un terme de recherche</div>';
                return;
            }

            const results = this.performSearch(query);
            
            if (results.length === 0) {
                this.resultsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé pour "' + query + '"</div>';
                return;
            }

            this.displaySearchResults(results, query);
        }

        displaySearchResults(results, query) {
            const html = `
                <div class="section">
                    <h3>📊 ${results.length} résultat(s) trouvé(s) pour "${query}"</h3>
                    ${results.map(result => {
                        const diag = result.diag;
                        const highlightedTitle = this.highlightMatch(`${diag.marque} ${diag.modele}`, query);
                        
                        return `
                            <div class="result-card">
                                <h4>${highlightedTitle} - ${diag.organe}</h4>
                                <div class="meta">
                                    <span class="tag marque">${diag.marque}</span>
                                    <span class="tag modele">${diag.modele}</span>
                                    <span class="tag motorisation">${diag.motorisation} ${diag.puissance}ch</span>
                                    <span class="tag organe">${diag.organe}</span>
                                </div>
                                <div class="description">
                                    <strong>Problème:</strong> ${diag.probleme}
                                </div>
                                <div class="details">
                                    <h5>🔍 Symptômes</h5>
                                    <ul>
                                        ${diag.symptomes.map(s => `<li>${s}</li>`).join('')}
                                    </ul>
                                    ${diag.codesDefaut.length > 0 ? `
                                        <h5>📋 Codes défaut</h5>
                                        <ul>
                                            ${diag.codesDefaut.map(c => `<li>${c}</li>`).join('')}
                                        </ul>
                                    ` : ''}
                                    <h5>✅ Solution</h5>
                                    <p>${diag.solution}</p>
                                    <h5>🔧 Pièces nécessaires</h5>
                                    <ul>
                                        ${diag.pieces.map(p => `<li>${p}</li>`).join('')}
                                    </ul>
                                    <h5>💰 Coût et temps</h5>
                                    <p><strong>Coût estimé:</strong> ${diag.cout}</p>
                                    <p><strong>Temps de main d'œuvre:</strong> ${diag.temps}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            this.resultsContainer.innerHTML = html;
        }

        displayDetailedResult(diag) {
            const html = `
                <div class="section">
                    <h3>📋 Fiche diagnostic détaillée</h3>
                    <div class="result-card">
                        <h4>${diag.marque} ${diag.modele} - ${diag.organe}</h4>
                        <div class="meta">
                            <span class="tag marque">${diag.marque}</span>
                            <span class="tag modele">${diag.modele}</span>
                            <span class="tag motorisation">${diag.motorisation} ${diag.puissance}ch - ${diag.carburant}</span>
                            <span class="tag organe">${diag.organe}</span>
                        </div>
                        <div class="description">
                            <strong>Problème:</strong> ${diag.probleme}
                        </div>
                        <div class="details">
                            <h5>🔍 Symptômes courants</h5>
                            <ul>
                                ${diag.symptomes.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                            ${diag.codesDefaut.length > 0 ? `
                                <h5>📋 Codes défaut associés</h5>
                                <ul>
                                    ${diag.codesDefaut.map(c => `<li><strong>${c}</strong></li>`).join('')}
                                </ul>
                            ` : ''}
                            <h5>✅ Solution recommandée</h5>
                            <p>${diag.solution}</p>
                            <h5>🔧 Pièces nécessaires</h5>
                            <ul>
                                ${diag.pieces.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                            <h5>💰 Estimation coût et temps</h5>
                            <p><strong>Coût estimé:</strong> ${diag.cout}</p>
                            <p><strong>Temps de main d'œuvre:</strong> ${diag.temps}</p>
                        </div>
                    </div>
                </div>
            `;

            this.resultsContainer.innerHTML = html;
        }

        effacerRecherche() {
            if (this.searchInput) {
                this.searchInput.value = '';
                this.autocompleteResults.style.display = 'none';
                this.resultsContainer.innerHTML = '';
            }
        }
    }

    // ============================================
    // FONCTIONS GLOBALES
    // ============================================
    window.lancerRecherche = function() {
        if (window.rechercheIntelligente) {
            window.rechercheIntelligente.lancerRecherche();
        }
    };

    window.effacerRecherche = function() {
        if (window.rechercheIntelligente) {
            window.rechercheIntelligente.effacerRecherche();
        }
    };

    window.tryExample = function(example) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = example;
            if (window.rechercheIntelligente) {
                window.rechercheIntelligente.handleSearch({ target: searchInput });
            }
        }
    };

    async function importerBaseMassive() {
        const statusDiv = document.getElementById('importStatus');
        const btnImport = document.getElementById('btnImportMassive');
        
        try {
            btnImport.disabled = true;
            btnImport.textContent = '⏳ Import en cours...';
            
            updateStatus('🔌 Connexion à la base de données...', 'info');
            
            const dbManager = new DatabaseManager();
            await dbManager.open();
            
            updateStatus(`📦 Import de ${DATABASE.length} diagnostics en cours...`, 'info');
            
            const result = await dbManager.importAll();
            
            if (result.success) {
                updateStatus(
                    `✅ <strong>Import réussi !</strong><br>` +
                    `📊 ${result.count} diagnostics importés<br>` +
                    `🔗 Source: <a href="${CONFIG.SOURCE_URL}" target="_blank">${CONFIG.SOURCE_URL}</a><br>` +
                    `<small>Rechargez la page pour activer la recherche.</small>`,
                    'success'
                );
                
                setTimeout(() => {
                    if (confirm('Import terminé !\n\nVoulez-vous recharger la page ?')) {
                        location.reload();
                    }
                }, 1500);
            }
            
        } catch (error) {
            updateStatus(
                `❌ <strong>Erreur lors de l'import</strong><br>` +
                `<code>${error.message}</code>`,
                'error'
            );
            console.error('Erreur import:', error);
        } finally {
            btnImport.disabled = false;
            btnImport.textContent = '🚀 Importer depuis appli-aide-technique';
        }
    }

    function updateStatus(message, type) {
        const statusDiv = document.getElementById('importStatus');
        statusDiv.style.display = 'block';
        statusDiv.className = `status ${type}`;
        statusDiv.innerHTML = message;
    }

    // ============================================
    // INITIALISATION
    // ============================================
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🚀 DiagAuto Pro initialisé');
        
        const btnImport = document.getElementById('btnImportMassive');
        if (btnImport) {
            btnImport.addEventListener('click', importerBaseMassive);
        }
        
        // Initialiser la recherche intelligente
        window.rechercheIntelligente = new RechercheIntelligente();
    });

    // Gestion des onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

})();
