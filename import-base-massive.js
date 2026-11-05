// ============================================
// IMPORT-BASE-MASSIVE.JS
// Module complet avec recherche intelligente
// Version: 2.0.0
// ============================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        SOURCE_URL: 'https://expertkevin06-cell.github.io/appli-aide-technique/',
        DB_NAME: 'DiagAutoDB',
        DB_VERSION: 2,
        STORES: {
            MARQUES: 'marques',
            MODELES: 'modeles',
            MOTORISATIONS: 'motorisations',
            ORGANES: 'organes',
            VEHICULES: 'vehicules',
            INTERVENTIONS: 'interventions'
        }
    };

    // Base de données complète étendue
    const DATABASE = {
        marques: [
            {marque: "Aixam", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Alpine", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Bolloré", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Bugatti", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Citroën", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "DS Automobiles", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Ligier", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Microcar", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Peugeot", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Renault", origine: "🇫🇷 Françaises", pays: "FR"},
            {marque: "Alfa Romeo", origine: "🇪🇺 Européennes", pays: "IT"},
            {marque: "Aston Martin", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Audi", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "Bentley", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "BMW", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "CUPRA", origine: "🇪🇺 Européennes", pays: "ES"},
            {marque: "Dacia", origine: "🇪🇺 Européennes", pays: "RO"},
            {marque: "Ferrari", origine: "🇪🇺 Européennes", pays: "IT"},
            {marque: "Fiat", origine: "🇪🇺 Européennes", pays: "IT"},
            {marque: "Ineos", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Jaguar", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Lamborghini", origine: "🇪🇺 Européennes", pays: "IT"},
            {marque: "Lancia", origine: "🇪🇺 Européennes", pays: "IT"},
            {marque: "Land Rover", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Lotus", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Maserati", origine: "🇪🇺 Européennes", pays: "IT"},
            {marque: "McLaren", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Mercedes-Benz", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "MINI", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Opel", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "Polestar", origine: "🇪🇺 Européennes", pays: "SE"},
            {marque: "Porsche", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "Rolls-Royce", origine: "🇪🇺 Européennes", pays: "GB"},
            {marque: "Saab", origine: "🇪🇺 Européennes", pays: "SE"},
            {marque: "SEAT", origine: "🇪🇺 Européennes", pays: "ES"},
            {marque: "Škoda", origine: "🇪🇺 Européennes", pays: "CZ"},
            {marque: "Smart", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "Volkswagen", origine: "🇪🇺 Européennes", pays: "DE"},
            {marque: "Volvo", origine: "🇪🇺 Européennes", pays: "SE"},
            {marque: "Acura", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Aion", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "AITO", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Aiways", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Arcfox", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Avatr", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "BAIC", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Baidu Jiyue", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Baojun", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Beijing", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Bestune", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Borgward", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "BYD", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Changan", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Chery", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Daihatsu", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Deepal", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Denza", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "DFSK", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Dongfeng", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Enovate", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Exeed", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Fangchengbao", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "FAW", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Forthing", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "GAC", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Geely", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Geely Galaxy", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Genesis", origine: "🌏 Asiatiques", pays: "KR"},
            {marque: "Geometry", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Great Wall", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Haima", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Haval", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Hengchi", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "HiPhi", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Honda", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Hongqi", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Hozon", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Human Horizons", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Hycan", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Hyundai", origine: "🌏 Asiatiques", pays: "KR"},
            {marque: "IM Motors", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Infiniti", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Isuzu", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "JAC", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Jaecoo", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Jetour", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Kaiyi", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Kandi", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Kia", origine: "🌏 Asiatiques", pays: "KR"},
            {marque: "Leapmotor", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Lexus", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Li Auto", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Livan", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Luxgen", origine: "🌏 Asiatiques", pays: "TW"},
            {marque: "Lynk & Co", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Mahindra", origine: "🌏 Asiatiques", pays: "IN"},
            {marque: "Maxus", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Mazda", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "MG", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Mitsubishi", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Neta", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "NIO", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Nissan", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Omoda", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Ora", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Qiantu", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Qoros", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Radar", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Rising Auto", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Roewe", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "SAIC", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Seres", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Singulato", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Skyworth", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Soueast", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "SsangYong", origine: "🌏 Asiatiques", pays: "KR"},
            {marque: "Subaru", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "Suzuki", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "SWM", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Tank", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Tata", origine: "🌏 Asiatiques", pays: "IN"},
            {marque: "Toyota", origine: "🌏 Asiatiques", pays: "JP"},
            {marque: "VinFast", origine: "🌏 Asiatiques", pays: "VN"},
            {marque: "Voyah", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Weltmeister", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Wey", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "WM Motor", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Wuling", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Xiaomi Auto", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "XPeng", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Yangwang", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Yudo", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Zeekr", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Zhiji Auto", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Zotye", origine: "🌏 Asiatiques", pays: "CN"},
            {marque: "Buick", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Cadillac", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Chevrolet", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Chrysler", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Dodge", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Fisker", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Ford", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "GMC", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Hummer", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Jeep", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Lincoln", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Lucid", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Pontiac", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Ram", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Rivian", origine: "🇺🇸 Américaines", pays: "US"},
            {marque: "Tesla", origine: "🇺🇸 Américaines", pays: "US"}
        ],
        modeles: [
            {marque: "Peugeot", modele: "208", annees: "2012-2024"},
            {marque: "Peugeot", modele: "2008", annees: "2013-2024"},
            {marque: "Peugeot", modele: "308", annees: "2007-2024"},
            {marque: "Peugeot", modele: "3008", annees: "2009-2024"},
            {marque: "Peugeot", modele: "508", annees: "2010-2024"},
            {marque: "Peugeot", modele: "5008", annees: "2009-2024"},
            {marque: "Renault", modele: "Clio", annees: "1990-2024"},
            {marque: "Renault", modele: "Megane", annees: "1995-2024"},
            {marque: "Renault", modele: "Scenic", annees: "1996-2024"},
            {marque: "Renault", modele: "Kadjar", annees: "2015-2022"},
            {marque: "Renault", modele: "Captur", annees: "2013-2024"},
            {marque: "Renault", modele: "Zoe", annees: "2012-2024"},
            {marque: "Citroën", modele: "C3", annees: "2002-2024"},
            {marque: "Citroën", modele: "C4", annees: "2004-2024"},
            {marque: "Citroën", modele: "C5", annees: "2001-2024"},
            {marque: "Volkswagen", modele: "Golf", annees: "1974-2024"},
            {marque: "Volkswagen", modele: "Polo", annees: "1975-2024"},
            {marque: "Volkswagen", modele: "Passat", annees: "1973-2024"},
            {marque: "Volkswagen", modele: "Tiguan", annees: "2007-2024"},
            {marque: "BMW", modele: "Serie 1", annees: "2004-2024"},
            {marque: "BMW", modele: "Serie 3", annees: "1975-2024"},
            {marque: "BMW", modele: "Serie 5", annees: "1972-2024"},
            {marque: "Mercedes-Benz", modele: "Classe A", annees: "1997-2024"},
            {marque: "Mercedes-Benz", modele: "Classe C", annees: "1993-2024"},
            {marque: "Mercedes-Benz", modele: "Classe E", annees: "1993-2024"},
            {marque: "Audi", modele: "A1", annees: "2010-2024"},
            {marque: "Audi", modele: "A3", annees: "1996-2024"},
            {marque: "Audi", modele: "A4", annees: "1994-2024"},
            {marque: "Audi", modele: "A6", annees: "1994-2024"},
            {marque: "Toyota", modele: "Yaris", annees: "1999-2024"},
            {marque: "Toyota", modele: "Corolla", annees: "1966-2024"},
            {marque: "Toyota", modele: "RAV4", annees: "1994-2024"},
            {marque: "Ford", modele: "Fiesta", annees: "1976-2023"},
            {marque: "Ford", modele: "Focus", annees: "1998-2024"},
            {marque: "Ford", modele: "Kuga", annees: "2008-2024"}
        ],
        motorisations: [
            {marque: "Peugeot", modele: "208", motorisation: "1.2 PureTech 82", puissance: 82, carburant: "Essence"},
            {marque: "Peugeot", modele: "208", motorisation: "1.2 PureTech 110", puissance: 110, carburant: "Essence"},
            {marque: "Peugeot", modele: "208", motorisation: "1.2 PureTech 130", puissance: 130, carburant: "Essence"},
            {marque: "Peugeot", modele: "208", motorisation: "1.5 BlueHDi 100", puissance: 100, carburant: "Diesel"},
            {marque: "Peugeot", modele: "208", motorisation: "1.5 BlueHDi 130", puissance: 130, carburant: "Diesel"},
            {marque: "Peugeot", modele: "208", motorisation: "Électrique 136", puissance: 136, carburant: "Électrique"},
            {marque: "Peugeot", modele: "308", motorisation: "1.2 PureTech 110", puissance: 110, carburant: "Essence"},
            {marque: "Peugeot", modele: "308", motorisation: "1.2 PureTech 130", puissance: 130, carburant: "Essence"},
            {marque: "Peugeot", modele: "308", motorisation: "1.5 BlueHDi 130", puissance: 130, carburant: "Diesel"},
            {marque: "Peugeot", modele: "3008", motorisation: "1.2 PureTech 130", puissance: 130, carburant: "Essence"},
            {marque: "Peugeot", modele: "3008", motorisation: "1.5 BlueHDi 130", puissance: 130, carburant: "Diesel"},
            {marque: "Peugeot", modele: "3008", motorisation: "1.6 PureTech 180", puissance: 180, carburant: "Essence"},
            {marque: "Renault", modele: "Clio", motorisation: "1.0 TCe 90", puissance: 90, carburant: "Essence"},
            {marque: "Renault", modele: "Clio", motorisation: "1.0 TCe 100", puissance: 100, carburant: "Essence"},
            {marque: "Renault", modele: "Clio", motorisation: "1.5 Blue dCi 85", puissance: 85, carburant: "Diesel"},
            {marque: "Renault", modele: "Clio", motorisation: "1.5 Blue dCi 115", puissance: 115, carburant: "Diesel"},
            {marque: "Renault", modele: "Clio", motorisation: "E-Tech 145", puissance: 145, carburant: "Hybride"},
            {marque: "Renault", modele: "Megane", motorisation: "1.3 TCe 115", puissance: 115, carburant: "Essence"},
            {marque: "Renault", modele: "Megane", motorisation: "1.3 TCe 140", puissance: 140, carburant: "Essence"},
            {marque: "Renault", modele: "Megane", motorisation: "1.5 Blue dCi 115", puissance: 115, carburant: "Diesel"},
            {marque: "Renault", modele: "Megane", motorisation: "E-Tech 160", puissance: 160, carburant: "Hybride"},
            {marque: "Volkswagen", modele: "Golf", motorisation: "1.0 TSI 110", puissance: 110, carburant: "Essence"},
            {marque: "Volkswagen", modele: "Golf", motorisation: "1.5 TSI 150", puissance: 150, carburant: "Essence"},
            {marque: "Volkswagen", modele: "Golf", motorisation: "2.0 TDI 115", puissance: 115, carburant: "Diesel"},
            {marque: "Volkswagen", modele: "Golf", motorisation: "2.0 TDI 150", puissance: 150, carburant: "Diesel"},
            {marque: "BMW", modele: "Serie 1", motorisation: "116i 109", puissance: 109, carburant: "Essence"},
            {marque: "BMW", modele: "Serie 1", motorisation: "118i 140", puissance: 140, carburant: "Essence"},
            {marque: "BMW", modele: "Serie 1", motorisation: "116d 116", puissance: 116, carburant: "Diesel"},
            {marque: "BMW", modele: "Serie 1", motorisation: "118d 150", puissance: 150, carburant: "Diesel"},
            {marque: "Mercedes-Benz", modele: "Classe A", motorisation: "A 180 136", puissance: 136, carburant: "Essence"},
            {marque: "Mercedes-Benz", modele: "Classe A", motorisation: "A 200 163", puissance: 163, carburant: "Essence"},
            {marque: "Mercedes-Benz", modele: "Classe A", motorisation: "A 180d 116", puissance: 116, carburant: "Diesel"},
            {marque: "Mercedes-Benz", modele: "Classe A", motorisation: "A 200d 150", puissance: 150, carburant: "Diesel"},
            {marque: "Toyota", modele: "Yaris", motorisation: "1.0 VVT-i 72", puissance: 72, carburant: "Essence"},
            {marque: "Toyota", modele: "Yaris", motorisation: "1.5 VVT-i 125", puissance: 125, carburant: "Essence"},
            {marque: "Toyota", modele: "Yaris", motorisation: "1.5 Hybrid 116", puissance: 116, carburant: "Hybride"},
            {marque: "Ford", modele: "Fiesta", motorisation: "1.0 EcoBoost 100", puissance: 100, carburant: "Essence"},
            {marque: "Ford", modele: "Fiesta", motorisation: "1.0 EcoBoost 125", puissance: 125, carburant: "Essence"},
            {marque: "Ford", modele: "Fiesta", motorisation: "1.5 TDCi 85", puissance: 85, carburant: "Diesel"}
        ],
        organes: [
            {nom: "courroie de distribution", type: "distribution", motsCles: ["courroie", "distribution", "timing belt"]},
            {nom: "courroie d'accessoire", type: "accessoire", motsCles: ["courroie", "accessoire", "alternateur"]},
            {nom: "chaîne de distribution", type: "distribution", motsCles: ["chaîne", "distribution", "chain"]},
            {nom: "FAP (Filtre à Particules)", type: "échappement", motsCles: ["fap", "filtre", "particules", "dpf"]},
            {nom: "catalyseur", type: "échappement", motsCles: ["catalyseur", "catalytic", "pot catalytique"]},
            {nom: "vanne EGR", type: "admission", motsCles: ["egr", "vanne", "recirculation"]},
            {nom: "turbo", type: "admission", motsCles: ["turbo", "turbocompresseur", "turbocharger"]},
            {nom: "embrayage", type: "transmission", motsCles: ["embrayage", "clutch", "disque"]},
            {nom: "volant moteur", type: "transmission", motsCles: ["volant", "moteur", "flywheel"]},
            {nom: "démarreur", type: "démarrage", motsCles: ["démarreur", "starter", "solenoïde"]},
            {nom: "alternateur", type: "charge", motsCles: ["alternateur", "alternator", "charge"]},
            {nom: "batterie", type: "charge", motsCles: ["batterie", "battery", "accumulateur"]},
            {nom: "pompe à eau", type: "refroidissement", motsCles: ["pompe", "eau", "water pump"]},
            {nom: "radiateur", type: "refroidissement", motsCles: ["radiateur", "radiator", "refroidissement"]},
            {nom: "thermostat", type: "refroidissement", motsCles: ["thermostat", "calorstat", "temperature"]},
            {nom: "injecteur", type: "injection", motsCles: ["injecteur", "injector", "injection"]},
            {nom: "pompe haute pression", type: "injection", motsCles: ["pompe", "haute", "pression", "hpfp"]},
            {nom: "bobine d'allumage", type: "allumage", motsCles: ["bobine", "allumage", "coil"]},
            {nom: "bougie d'allumage", type: "allumage", motsCles: ["bougie", "allumage", "spark plug"]},
            {nom: "bougie de préchauffage", type: "allumage", motsCles: ["bougie", "préchauffage", "glow plug"]},
            {nom: "capteur ABS", type: "freinage", motsCles: ["abs", "capteur", "sensor", "vitesse"]},
            {nom: "plaquettes de frein", type: "freinage", motsCles: ["plaquettes", "frein", "brake pads"]},
            {nom: "disque de frein", type: "freinage", motsCles: ["disque", "frein", "brake disc"]},
            {nom: "amortisseur", type: "suspension", motsCles: ["amortisseur", "suspension", "shock"]},
            {nom: "silent bloc", type: "suspension", motsCles: ["silent", "bloc", "bush"]},
            {nom: "rotule de direction", type: "direction", motsCles: ["rotule", "direction", "tie rod"]},
            {nom: "crémaillère", type: "direction", motsCles: ["crémaillère", "direction", "rack"]},
            {nom: "cardan", type: "transmission", motsCles: ["cardan", "drive shaft", "arbre"]},
            {nom: "soufflet de cardan", type: "transmission", motsCles: ["soufflet", "cardan", "boot"]},
            {nom: "sonde lambda", type: "échappement", motsCles: ["sonde", "lambda", "oxygen", "o2"]},
            {nom: "débitmètre d'air", type: "admission", motsCles: ["débitmètre", "air", "maf", "mass air flow"]},
            {nom: "capteur PMH", type: "allumage", motsCles: ["pmh", "point mort haut", "crankshaft", "position"]},
            {nom: "capteur de pression", type: "capteur", motsCles: ["pression", "pressure", "map"]},
            {nom: "électrovanne", type: "divers", motsCles: ["électrovanne", "solenoid", "valve"]},
            {nom: "relais", type: "divers", motsCles: ["relais", "relay", "commutateur"]}
        ]
    };

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
                    
                    // Store Marques
                    if (!db.objectStoreNames.contains(CONFIG.STORES.MARQUES)) {
                        const store = db.createObjectStore(CONFIG.STORES.MARQUES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        store.createIndex('marque', 'marque', { unique: true });
                        store.createIndex('pays', 'pays', { unique: false });
                    }
                    
                    // Store Modèles
                    if (!db.objectStoreNames.contains(CONFIG.STORES.MODELES)) {
                        const store = db.createObjectStore(CONFIG.STORES.MODELES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        store.createIndex('marque', 'marque', { unique: false });
                        store.createIndex('modele', 'modele', { unique: false });
                    }
                    
                    // Store Motorisations
                    if (!db.objectStoreNames.contains(CONFIG.STORES.MOTORISATIONS)) {
                        const store = db.createObjectStore(CONFIG.STORES.MOTORISATIONS, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        store.createIndex('marque', 'marque', { unique: false });
                        store.createIndex('modele', 'modele', { unique: false });
                        store.createIndex('motorisation', 'motorisation', { unique: false });
                    }
                    
                    // Store Organes
                    if (!db.objectStoreNames.contains(CONFIG.STORES.ORGANES)) {
                        const store = db.createObjectStore(CONFIG.STORES.ORGANES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        store.createIndex('nom', 'nom', { unique: false });
                        store.createIndex('type', 'type', { unique: false });
                    }
                    
                    // Store Véhicules
                    if (!db.objectStoreNames.contains(CONFIG.STORES.VEHICULES)) {
                        db.createObjectStore(CONFIG.STORES.VEHICULES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                    }
                    
                    // Store Interventions
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
            
            const transaction = this.db.transaction([
                CONFIG.STORES.MARQUES,
                CONFIG.STORES.MODELES,
                CONFIG.STORES.MOTORISATIONS,
                CONFIG.STORES.ORGANES
            ], 'readwrite');
            
            const marquesStore = transaction.objectStore(CONFIG.STORES.MARQUES);
            const modelesStore = transaction.objectStore(CONFIG.STORES.MODELES);
            const motorisationsStore = transaction.objectStore(CONFIG.STORES.MOTORISATIONS);
            const organesStore = transaction.objectStore(CONFIG.STORES.ORGANES);
            
            // Vider les stores
            marquesStore.clear();
            modelesStore.clear();
            motorisationsStore.clear();
            organesStore.clear();
            
            // Importer les marques
            DATABASE.marques.forEach(m => {
                marquesStore.add({
                    marque: m.marque,
                    origine: m.origine,
                    pays: m.pays,
                    dateImport: new Date().toISOString()
                });
            });
            
            // Importer les modèles
            DATABASE.modeles.forEach(m => {
                modelesStore.add({
                    marque: m.marque,
                    modele: m.modele,
                    annees: m.annees,
                    dateImport: new Date().toISOString()
                });
            });
            
            // Importer les motorisations
            DATABASE.motorisations.forEach(m => {
                motorisationsStore.add({
                    marque: m.marque,
                    modele: m.modele,
                    motorisation: m.motorisation,
                    puissance: m.puissance,
                    carburant: m.carburant,
                    dateImport: new Date().toISOString()
                });
            });
            
            // Importer les organes
            DATABASE.organes.forEach(o => {
                organesStore.add({
                    nom: o.nom,
                    type: o.type,
                    motsCles: o.motsCles,
                    dateImport: new Date().toISOString()
                });
            });
            
            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    resolve({
                        success: true,
                        marques: DATABASE.marques.length,
                        modeles: DATABASE.modeles.length,
                        motorisations: DATABASE.motorisations.length,
                        organes: DATABASE.organes.length
                    });
                };
                transaction.onerror = () => reject(transaction.error);
            });
        }

        async getAllMarques() {
            if (!this.db) await this.open();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.MARQUES], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.MARQUES);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async getAllModeles(marque = null) {
            if (!this.db) await this.open();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.MODELES], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.MODELES);
                const request = store.getAll();
                request.onsuccess = () => {
                    let modeles = request.result;
                    if (marque) {
                        modeles = modeles.filter(m => m.marque === marque);
                    }
                    resolve(modeles);
                };
                request.onerror = () => reject(request.error);
            });
        }

        async getAllMotorisations(marque = null, modele = null) {
            if (!this.db) await this.open();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.MOTORISATIONS], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.MOTORISATIONS);
                const request = store.getAll();
                request.onsuccess = () => {
                    let motorisations = request.result;
                    if (marque) {
                        motorisations = motorisations.filter(m => m.marque === marque);
                    }
                    if (modele) {
                        motorisations = motorisations.filter(m => m.modele === modele);
                    }
                    resolve(motorisations);
                };
                request.onerror = () => reject(request.error);
            });
        }

        async getAllOrganes() {
            if (!this.db) await this.open();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.ORGANES], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.ORGANES);
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
    // RECHERCHE INTELLIGENTE
    // ============================================
    class RechercheIntelligente {
        constructor() {
            this.db = new DatabaseManager();
            this.searchInput = document.getElementById('searchInput');
            this.autocompleteResults = document.getElementById('autocompleteResults');
            this.resultsContainer = document.getElementById('resultsContainer');
            this.allData = {
                marques: [],
                modeles: [],
                motorisations: [],
                organes: []
            };
            
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
            this.allData.marques = await this.db.getAllMarques();
            this.allData.modeles = await this.db.getAllModeles();
            this.allData.motorisations = await this.db.getAllMotorisations();
            this.allData.organes = await this.db.getAllOrganes();
        }

        attachEvents() {
            if (this.searchInput) {
                this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
                this.searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.lancerRecherche();
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
            const query = event.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                this.autocompleteResults.style.display = 'none';
                return;
            }

            const results = this.performSearch(query);
            this.displayAutocomplete(results, query);
        }

        performSearch(query) {
            const results = [];
            const queryLower = query.toLowerCase();

            // Rechercher dans les marques
            this.allData.marques.forEach(m => {
                if (m.marque.toLowerCase().includes(queryLower)) {
                    results.push({
                        type: 'marque',
                        text: m.marque,
                        category: `${m.origine} - ${m.pays}`,
                        data: m
                    });
                }
            });

            // Rechercher dans les modèles
            this.allData.modeles.forEach(m => {
                if (m.modele.toLowerCase().includes(queryLower) || 
                    m.marque.toLowerCase().includes(queryLower)) {
                    results.push({
                        type: 'modele',
                        text: `${m.marque} ${m.modele}`,
                        category: `Modèle - ${m.annees}`,
                        data: m
                    });
                }
            });

            // Rechercher dans les motorisations
            this.allData.motorisations.forEach(m => {
                if (m.motorisation.toLowerCase().includes(queryLower) ||
                    m.modele.toLowerCase().includes(queryLower) ||
                    m.marque.toLowerCase().includes(queryLower) ||
                    m.puissance.toString().includes(queryLower)) {
                    results.push({
                        type: 'motorisation',
                        text: `${m.marque} ${m.modele} - ${m.motorisation}`,
                        category: `${m.puissance} ch - ${m.carburant}`,
                        data: m
                    });
                }
            });

            // Rechercher dans les organes
            this.allData.organes.forEach(o => {
                const match = o.nom.toLowerCase().includes(queryLower) ||
                             o.motsCles.some(mc => mc.toLowerCase().includes(queryLower));
                if (match) {
                    results.push({
                        type: 'organe',
                        text: o.nom,
                        category: `Type: ${o.type}`,
                        data: o
                    });
                }
            });

            return results.slice(0, 15); // Limiter à 15 résultats
        }

        displayAutocomplete(results, query) {
            if (results.length === 0) {
                this.autocompleteResults.style.display = 'none';
                return;
            }

            const html = results.map(result => {
                const highlightedText = this.highlightMatch(result.text, query);
                return `
                    <div class="autocomplete-item" data-type="${result.type}" data-id="${result.data.id}">
                        <div><strong>${highlightedText}</strong></div>
                        <div class="category">${result.category}</div>
                    </div>
                `;
            }).join('');

            this.autocompleteResults.innerHTML = html;
            this.autocompleteResults.style.display = 'block';

            // Attacher les événements de clic
            this.autocompleteResults.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    const type = item.dataset.type;
                    const id = parseInt(item.dataset.id);
                    this.selectResult(type, id);
                });
            });
        }

        highlightMatch(text, query) {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        selectResult(type, id) {
            const data = this.allData[type + 's'].find(item => item.id === id);
            if (data) {
                this.searchInput.value = type === 'marque' ? data.marque : 
                                        type === 'modele' ? `${data.marque} ${data.modele}` :
                                        type === 'motorisation' ? `${data.marque} ${data.modele} ${data.motorisation}` :
                                        data.nom;
                this.autocompleteResults.style.display = 'none';
                this.lancerRecherche();
            }
        }

        async lancerRecherche() {
            const query = this.searchInput.value.trim().toLowerCase();
            
            if (!query) {
                this.resultsContainer.innerHTML = '<div class="no-results">Veuillez entrer un terme de recherche</div>';
                return;
            }

            const results = this.performSearch(query);
            
            if (results.length === 0) {
                this.resultsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé pour "' + query + '"</div>';
                return;
            }

            const html = `
                <div class="section">
                    <h3>📊 Résultats de recherche (${results.length})</h3>
                    ${results.map(result => {
                        const highlightedText = this.highlightMatch(result.text, query);
                        return `
                            <div class="result-card">
                                <h4>${highlightedText}</h4>
                                <div class="meta">
                                    <span class="badge badge-info">${result.type}</span>
                                    ${result.category}
                                </div>
                                ${this.getDiagnosticInfo(result)}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            this.resultsContainer.innerHTML = html;
        }

        getDiagnosticInfo(result) {
            if (result.type === 'organe') {
                return `<p style="margin-top: 8px; color: #666;">
                    🔧 <strong>Diagnostic:</strong> Vérifier l'état de ${result.data.nom}. 
                    Contrôler les symptômes associés et les codes défauts correspondants.
                </p>`;
            } else if (result.type === 'motorisation') {
                return `<p style="margin-top: 8px; color: #666;">
                    ⚙️ <strong>Spécifications:</strong> ${result.data.puissance} ch - ${result.data.carburant}
                </p>`;
            }
            return '';
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

    window.lancerDiagnostic = function() {
        const marque = document.getElementById('selectMarque').value;
        const modele = document.getElementById('selectModele').value;
        const motorisation = document.getElementById('selectMotorisation').value;
        const puissance = document.getElementById('puissanceInput').value;
        
        alert(`Diagnostic en cours pour:\nMarque: ${marque || 'Toutes'}\nModèle: ${modele || 'Tous'}\nMotorisation: ${motorisation || 'Toutes'}\nPuissance: ${puissance || 'Non spécifiée'}`);
    };

    window.reinitialiserDiagnostic = function() {
        document.getElementById('selectMarque').value = '';
        document.getElementById('selectModele').value = '';
        document.getElementById('selectMotorisation').value = '';
        document.getElementById('puissanceInput').value = '';
        document.getElementById('resultsContainer').innerHTML = '';
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
            
            updateStatus(`📦 Import de la base complète en cours...`, 'info');
            
            const result = await dbManager.importAll();
            
            if (result.success) {
                updateStatus(
                    `✅ <strong>Import réussi !</strong><br>` +
                    `📊 ${result.marques} marques<br>` +
                    `🚗 ${result.modeles} modèles<br>` +
                    `⚙️ ${result.motorisations} motorisations<br>` +
                    `🔧 ${result.organes} organes<br>` +
                    `<small>Rechargez la page pour voir les nouvelles données.</small>`,
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

    async function chargerSelects() {
        try {
            const db = new DatabaseManager();
            
            // Charger les marques
            const marques = await db.getAllMarques();
            const selectMarque = document.getElementById('selectMarque');
            const ficheMarque = document.getElementById('ficheMarque');
            
            if (selectMarque && marques.length > 0) {
                selectMarque.innerHTML = '<option value="">Toutes marques</option>';
                marques.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m.marque;
                    option.textContent = `${m.marque} (${m.pays})`;
                    selectMarque.appendChild(option);
                });
            }
            
            if (ficheMarque && marques.length > 0) {
                ficheMarque.innerHTML = '<option value="">Choisir</option>';
                marques.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m.marque;
                    option.textContent = `${m.marque} (${m.pays})`;
                    ficheMarque.appendChild(option);
                });
            }
            
            // Événement changement de marque
            if (selectMarque) {
                selectMarque.addEventListener('change', async (e) => {
                    const marque = e.target.value;
                    const selectModele = document.getElementById('selectModele');
                    const selectMotorisation = document.getElementById('selectMotorisation');
                    
                    if (marque) {
                        const modeles = await db.getAllModeles(marque);
                        selectModele.innerHTML = '<option value="">Tous modèles</option>';
                        modeles.forEach(m => {
                            const option = document.createElement('option');
                            option.value = m.modele;
                            option.textContent = m.modele;
                            selectModele.appendChild(option);
                        });
                        
                        selectModele.addEventListener('change', async (e2) => {
                            const modele = e2.target.value;
                            if (modele) {
                                const motorisations = await db.getAllMotorisations(marque, modele);
                                selectMotorisation.innerHTML = '<option value="">Toutes motorisations</option>';
                                motorisations.forEach(m => {
                                    const option = document.createElement('option');
                                    option.value = m.motorisation;
                                    option.textContent = `${m.motorisation} (${m.puissance} ch)`;
                                    selectMotorisation.appendChild(option);
                                });
                            }
                        });
                    }
                });
            }
            
        } catch (error) {
            console.error('Erreur chargement selects:', error);
        }
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
        
        await chargerSelects();
        
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
