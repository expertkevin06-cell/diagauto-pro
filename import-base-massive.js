// ============================================================
// IMPORT-BASE-MASSIVE.JS — v6.0-massive
// Base MASSIVE générée : TOUTES marques × TOUS modèles ×
// TOUTES motorisations × TOUTES puissances × TOUTES pannes
// + import distant S1/S2/S3 depuis appli-aide-technique
// ============================================================
(function () {
'use strict';

var VERSION = '6.0.0-massive';

var CONFIG = {
  SOURCE_URL: 'https://expertkevin06-cell.github.io/appli-aide-technique/',
  JSON_ENDPOINTS: [
    'https://expertkevin06-cell.github.io/appli-aide-technique/data.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/base.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/db.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/fiches.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/pannes.json'
  ],
  MAX_REMOTE: 20000,
  MAX_EMBEDDED: 12000,
  LS_IMPORT: 'diagauto_last_import',
  DB_NAME: 'DiagAutoDB', DB_VERSION: 4, STORE: 'fiches'
};

function norm(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// ---------- 150 MARQUES COMPLÈTES [nom, origine] ----------
var MARQUES_COMPLETE = [
  ['Aixam','fr'],['Alpine','fr'],['Bolloré','fr'],['Bugatti','fr'],['Citroën','fr'],['DS Automobiles','fr'],['Ligier','fr'],['Microcar','fr'],['Peugeot','fr'],['Renault','fr'],
  ['Alfa Romeo','eu'],['Aston Martin','eu'],['Audi','eu'],['Bentley','eu'],['BMW','eu'],['CUPRA','eu'],['Dacia','eu'],['Ferrari','eu'],['Fiat','eu'],['Ineos','eu'],['Jaguar','eu'],['Lamborghini','eu'],['Lancia','eu'],['Land Rover','eu'],['Lotus','eu'],['Maserati','eu'],['McLaren','eu'],['Mercedes-Benz','eu'],['MINI','eu'],['Opel','eu'],['Polestar','eu'],['Porsche','eu'],['Rolls-Royce','eu'],['Saab','eu'],['SEAT','eu'],['Škoda','eu'],['Smart','eu'],['Volkswagen','eu'],['Volvo','eu'],
  ['Acura','as'],['Aion','as'],['AITO','as'],['Aiways','as'],['Arcfox','as'],['Avatr','as'],['BAIC','as'],['Baidu Jiyue','as'],['Baojun','as'],['Beijing','as'],['Bestune','as'],['Borgward','as'],['BYD','as'],['Changan','as'],['Chery','as'],['Daihatsu','as'],['Deepal','as'],['Denza','as'],['DFSK','as'],['Dongfeng','as'],['Enovate','as'],['Exeed','as'],['Fangchengbao','as'],['FAW','as'],['Forthing','as'],['GAC','as'],['Geely','as'],['Geely Galaxy','as'],['Genesis','as'],['Geometry','as'],['Great Wall','as'],['Haima','as'],['Haval','as'],['Hengchi','as'],['HiPhi','as'],['Honda','as'],['Hongqi','as'],['Hozon','as'],['Human Horizons','as'],['Hycan','as'],['Hyundai','as'],['IM Motors','as'],['Infiniti','as'],['Isuzu','as'],['JAC','as'],['Jaecoo','as'],['Jetour','as'],['Kaiyi','as'],['Kandi','as'],['Kia','as'],['Leapmotor','as'],['Lexus','as'],['Li Auto','as'],['Livan','as'],['Luxgen','as'],['Lynk & Co','as'],['Mahindra','as'],['Maxus','as'],['Mazda','as'],['MG','as'],['Mitsubishi','as'],['Neta','as'],['NIO','as'],['Nissan','as'],['Omoda','as'],['Ora','as'],['Qiantu','as'],['Qoros','as'],['Radar','as'],['Rising Auto','as'],['Roewe','as'],['SAIC','as'],['Seres','as'],['Singulato','as'],['Skyworth','as'],['Soueast','as'],['SsangYong','as'],['Subaru','as'],['Suzuki','as'],['SWM','as'],['Tank','as'],['Tata','as'],['Toyota','as'],['VinFast','as'],['Voyah','as'],['Weltmeister','as'],['Wey','as'],['WM Motor','as'],['Wuling','as'],['Xiaomi Auto','as'],['XPeng','as'],['Yangwang','as'],['Yudo','as'],['Zeekr','as'],['Zhiji Auto','as'],['Zotye','as'],
  ['Buick','us'],['Cadillac','us'],['Chevrolet','us'],['Chrysler','us'],['Dodge','us'],['Fisker','us'],['Ford','us'],['GMC','us'],['Hummer','us'],['Jeep','us'],['Lincoln','us'],['Lucid','us'],['Pontiac','us'],['Ram','us'],['Rivian','us'],['Tesla','us']
].map(function (a) { return { nom: a[0], orig: a[1] }; });

var ORIG = { fr:'fr', eu:'eu', as:'as', us:'us' };
var MARQUE_ORIG = {};
MARQUES_COMPLETE.forEach(function (m) { MARQUE_ORIG[m.nom] = m.orig; });

// ---------- CATALOGUE MODÈLES ----------
var MODELES_CATALOG = {
  'Peugeot': ['208','2008','308','3008','408','508','5008','Partner','Rifter','Expert','Boxer'],
  'Citroën': ['C3','C3 Aircross','C4','C4 X','C5 Aircross','C5 X','Berlingo','Jumpy','SpaceTourer'],
  'DS Automobiles': ['DS 3','DS 4','DS 7','DS 9'],
  'Renault': ['Clio','Megane','Scenic','Captur','Kadjar','Austral','Espace','Zoe','Twingo','Kangoo','Trafic','Master','4','5'],
  'Dacia': ['Sandero','Duster','Logan','Jogger','Spring'],
  'Volkswagen': ['Polo','Golf','Passat','Tiguan','Touareg','T-Roc','Caddy','Transporter','ID.3','ID.4','ID.5'],
  'Audi': ['A1','A3','A4','A5','A6','Q2','Q3','Q5','Q7','Q8','e-tron'],
  'BMW': ['Serie 1','Serie 3','Serie 5','Serie 7','X1','X3','X5','X7','i4','iX','M3','M5'],
  'Mercedes-Benz': ['Classe A','Classe C','Classe E','Classe S','GLA','GLC','GLE','GLS','EQA','EQE','EQS','Sprinter'],
  'Opel': ['Corsa','Astra','Mokka','Grandland','Insignia','Vivaro'],
  'SEAT': ['Ibiza','Leon','Arona','Ateca','Tarraco'],
  'CUPRA': ['Born','Formentor','Leon','Tavascan'],
  'Škoda': ['Fabia','Octavia','Superb','Kamiq','Karoq','Kodiaq','Enyaq'],
  'Porsche': ['911','718 Cayman','Macan','Cayenne','Panamera','Taycan'],
  'Volvo': ['XC40','XC60','XC90','C40','S60','S90','V60','V90','EX30','EX90'],
  'Polestar': ['Polestar 2','Polestar 3','Polestar 4'],
  'Fiat': ['500','Panda','Tipo','500X','500L','Ducato'],
  'Toyota': ['Yaris','Corolla','Camry','C-HR','RAV4','Hilux','Land Cruiser','Prius','bZ4X','Aygo'],
  'Lexus': ['IS','ES','LS','NX','RX','RZ','UX'],
  'Honda': ['Civic','Accord','CR-V','HR-V','Jazz','Pilot'],
  'Nissan': ['Micra','Juke','Qashqai','X-Trail','Leaf','Ariya','Navara'],
  'Mazda': ['Mazda2','Mazda3','Mazda6','CX-3','CX-30','CX-5','MX-5'],
  'Mitsubishi': ['Space Star','ASX','Eclipse Cross','Outlander','L200'],
  'Subaru': ['Impreza','WRX','Crosstrek','Forester','Outback','Legacy'],
  'Suzuki': ['Swift','Ignis','Baleno','S-Cross','Vitara','Jimny'],
  'Hyundai': ['i10','i20','i30','Kona','Tucson','Santa Fe','Ioniq 5','Ioniq 6'],
  'Kia': ['Picanto','Rio','Ceed','Stonic','Sportage','Sorento','Niro','EV6','EV9'],
  'Ford': ['Fiesta','Focus','Puma','Kuga','Mustang Mach-E','Ranger','Transit'],
  'Chevrolet': ['Spark','Cruze','Bolt EV','Equinox','Traverse','Tahoe','Silverado 1500'],
  'Jeep': ['Renegade','Compass','Cherokee','Wrangler','Gladiator','Grand Cherokee'],
  'Tesla': ['Model 3','Model Y','Model S','Model X','Cybertruck'],
  'BYD': ['Atto 3','Dolphin','Seal','Seagull','Han','Tang'],
  'MG': ['MG3','MG4','MG5','MG HS','MG ZS','Cyberster'],
  'Chery': ['Tiggo 4','Tiggo 7','Tiggo 8','Arrizo 8','Omoda 5'],
  'Geely': ['Coolray','Emgrand','Monjaro','Galaxy L7'],
  'Great Wall': ['Cannon','Poer','Haval H6','Tank 300']
};

// ---------- 28 FAMILLES DE PANNES CONNUES ----------
var PANNES = [
  { id:'fap', cat:'Échappement', carbu:['diesel'], titre:'FAP colmaté', court:'FAP colmaté', sym:'Voyant FAP, mode dégradé.', dtc:['P2002','P242F'], sol:'Régénération forcée, contrôle pression.', kw:['fap','dpf','particules','colmate'], prio:3 },
  { id:'egr', cat:'Dépollution', carbu:['diesel'], titre:'Vanne EGR encrassée', court:'Vanne EGR encrassée', sym:'Perte puissance, ralenti instable.', dtc:['P0401','P0402'], sol:'Nettoyage/remplacement vanne EGR.', kw:['egr','vanne','ralenti'], prio:2 },
  { id:'inj', cat:'Injection', carbu:['diesel'], titre:'Injecteurs : retour / fuite', court:'Injecteurs retour/fuite', sym:'Claquement, fumée noire, ratés.', dtc:['P0201','P0204'], sol:'Test retour, remplacement + codage.', kw:['injecteur','fuite','fumee noire'], prio:6 },
  { id:'hp', cat:'Injection', carbu:['diesel'], titre:'Pompe HP / régulation rail', court:'Pompe HP / rail', sym:'Démarrage difficile, calage.', dtc:['P0087','P0088'], sol:'Contrôle pression rail, pompe HP.', kw:['pompe','hp','rail','pression'], prio:1 },
  { id:'adblue', cat:'Dépollution', carbu:['diesel'], titre:'Système AdBlue / SCR défaillant', court:'AdBlue / SCR', sym:'Voyant défaut, démarrage interdit après compte à rebours.', dtc:['P20EE','P204F'], sol:'Pompe / capteur AdBlue, MAJ calc.', kw:['adblue','scr','uree'], prio:4 },
  { id:'td', cat:'Admission', carbu:['diesel'], titre:'Turbo diesel : géométrie / wastegate', court:'Turbo (diesel)', sym:'Sifflement, perte puissance, fumée.', dtc:['P0299','P0234'], sol:'Contrôle turbo, durites, remplacement.', kw:['turbo','sifflement','wastegate'], prio:5 },
  { id:'chd', cat:'Moteur', carbu:['diesel'], titre:'Chaîne de distribution (diesel)', court:'Chaîne distribution', sym:'Bruit métallique, casse possible.', dtc:['P0016'], sol:'Kit chaîne + tendeur + guides.', kw:['chaine','distribution','bruit'], prio:0 },
  { id:'cou', cat:'Moteur', carbu:['essence','hybride'], titre:'Courroie de distribution', court:'Courroie distribution', sym:'Usure, risque casse, échéance km.', dtc:[], sol:'Kit courroie + pompe à eau.', kw:['courroie','distribution','usure'], prio:1 },
  { id:'bob', cat:'Moteur', carbu:['essence','hybride'], titre:'Bobines / bougies (ratés)', court:'Bobines / bougies', sym:'Ratés, voyant moteur, à-coups.', dtc:['P0300','P0301'], sol:'Bobines + bougies.', kw:['bobine','bougie','rate','allumage'], prio:7 },
  { id:'te', cat:'Admission', carbu:['essence','hybride'], titre:'Turbo essence / wastegate', court:'Turbo (essence)', sym:'Perte puissance, sifflement.', dtc:['P0299'], sol:'Contrôle turbo + durites.', kw:['turbo','wastegate','puissance'], prio:5 },
  { id:'che', cat:'Moteur', carbu:['essence'], titre:'Chaîne de distribution (essence)', court:'Chaîne distribution', sym:'Bruit chaîne à froid, tendeur fatigué.', dtc:['P0016'], sol:'Kit chaîne + tendeur.', kw:['chaine','distribution','tendeur'], prio:0 },
  { id:'bht', cat:'Électrique', carbu:['ev'], titre:'Batterie HT / BMS véhicule électrique', court:'Batterie HT / BMS', sym:'Perte autonomie, voyant HV, recharge lente.', dtc:['P0A80'], sol:'Diagnostic modules HT, équilibrage.', kw:['batterie','ht','bms','electrique'], prio:2 },
  { id:'rec', cat:'Électrique', carbu:['ev'], titre:'Recharge / chargeur embarqué', court:'Recharge / chargeur', sym:'Recharge impossible, coupures.', dtc:[], sol:'Contrôle chargeur, câble, borne.', kw:['recharge','chargeur','borne'], prio:3 },
  { id:'bhv', cat:'Électrique', carbu:['hybride'], titre:'Batterie hybride / ventilation', court:'Batterie hybride', sym:'Voyant HV, perte mode EV.', dtc:['P0A80','P0C00'], sol:'Modules HV, ventilation batterie.', kw:['batterie','hybride','ventilation'], prio:2 },
  { id:'alt', cat:'Électrique', carbu:['all'], titre:'Alternateur / circuit de charge', court:'Alternateur / charge', sym:'Voyant batterie, décharge, phares faibles.', dtc:['P0562'], sol:'Alternateur + courroie accessoire.', kw:['alternateur','charge','voyant'], prio:8 },
  { id:'dem', cat:'Électrique', carbu:['all'], titre:'Démarreur / solénoïde', court:'Démarreur', sym:'Clic, ne démarre pas.', dtc:['P0615'], sol:'Démarreur / solénoïde.', kw:['demarreur','clic','demarre'], prio:8 },
  { id:'bat', cat:'Électrique', carbu:['all'], titre:'Batterie 12V / codage BMS', court:'Batterie 12V', sym:'Démarrage difficile, voyant.', dtc:[], sol:'Batterie + codage BMS.', kw:['batterie','bms','demarrage'], prio:9 },
  { id:'pea', cat:'Refroidissement', carbu:['all'], titre:'Pompe à eau / fuite LDR', court:'Pompe à eau', sym:'Fuite, surchauffe, voyant température.', dtc:['P0217'], sol:'Pompe à eau + LDR.', kw:['pompe a eau','fuite','surchauffe'], prio:8 },
  { id:'rad', cat:'Refroidissement', carbu:['all'], titre:'Radiateur / thermostat', court:'Radiateur / thermostat', sym:'Surchauffe, ventilateur permanent.', dtc:['P0217'], sol:'Radiateur, thermostat, LDR.', kw:['radiateur','thermostat','surchauffe'], prio:8 },
  { id:'plq', cat:'Freinage', carbu:['all'], titre:'Plaquettes / disques usés', court:'Plaquettes / disques', sym:'Grincement, voyant frein, pédale longue.', dtc:[], sol:'Remplacement plaquettes/disques.', kw:['frein','plaquette','disque'], prio:9 },
  { id:'abs', cat:'Freinage', carbu:['all'], titre:'ABS / capteur de roue', court:'ABS / capteur roue', sym:'Voyant ABS/ESP, perte assistance.', dtc:['C0035','C0040'], sol:'Capteur ABS / bague.', kw:['abs','esp','capteur'], prio:9 },
  { id:'emb', cat:'Transmission', carbu:['all'], titre:'Embrayage / volant moteur', court:'Embrayage / volant', sym:'Patine, pédale dure, bruits.', dtc:[], sol:'Kit embrayage + volant bi-masse.', kw:['embrayage','volant moteur','patine'], prio:9 },
  { id:'bot', cat:'Transmission', carbu:['all'], titre:'Boîte : à-coups / mécatronique', court:'Boîte / mécatronique', sym:'À-coups, voyant boîte, mode dégradé.', dtc:['P17BF','P0730'], sol:'Huile boîte, mécatronique, MAJ.', kw:['boite','mecatronique','a coups'], prio:9 },
  { id:'dir', cat:'Direction', carbu:['all'], titre:'Direction assistée / crémaillère', court:'Direction / crémaillère', sym:'Dureté, bruit, jeu.', dtc:[], sol:'Crémaillère / pompe DA.', kw:['direction','cremaillere','durete'], prio:9 },
  { id:'cli', cat:'Entretien', carbu:['all'], titre:'Climatisation : compresseur / gaz', court:'Clim / compresseur', sym:'Froid insuffisant, bruit compresseur.', dtc:[], sol:'Recharge / compresseur.', kw:['clim','compresseur','froid'], prio:9 },
  { id:'lam', cat:'Échappement', carbu:['all'], titre:'Sonde lambda / catalyseur', court:'Sonde lambda / cata', sym:'Voyant, conso, échec contrôle technique.', dtc:['P0420','P0130'], sol:'Sonde lambda / catalyseur.', kw:['sonde lambda','catalyseur','p0420'], prio:8 },
  { id:'dbm', cat:'Admission', carbu:['all'], titre:'Débitmètre / prise d\'air', court:'Débitmètre / admission', sym:'Ralenti instable, trou à l\'accélération.', dtc:['P0101','P0171'], sol:'Débitmètre, durites admission.', kw:['debitmetre','prise air','ralenti'], prio:8 },
  { id:'sus', cat:'Suspension', carbu:['all'], titre:'Amortisseurs / rotules / silentblocs', court:'Amortisseurs / rotules', sym:'Bruit, jeu, tenue de route.', dtc:[], sol:'Remplacement + géométrie.', kw:['amortisseur','rotule','silentbloc'], prio:9 }
];
var PANNE_BY_ID = {};
PANNES.forEach(function (p) { PANNE_BY_ID[p.id] = p; });

// ---------- FICHES CURATED (campagnes réelles) ----------
var FICHES_CURATED = [
  { cat:'Moteur', titre:'1.5 BlueHDi (DV5) : chaîne arbre à cames', src:'Campagnes Stellantis', sym:'Bruit métallique, casse.', dtc:['P0016'], sol:'Chaîne renforcée.', veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['3008','5008','208','2008','308','408','508','Partner','Rifter','C3 Aircross','C4','Berlingo','DS 3','DS 4','Grandland','Astra'], mot:['1.5','bluehdi','dv5']}, carbu:'diesel', kw:['chaine','distribution','arbre a cames','bruit metallique','casse','dv5'], prio:0 },
  { cat:'Moteur', titre:'1.2 PureTech : courroie de distribution humide', src:'Campagnes Stellantis', sym:'Usure prématurée, débris dans l\'huile, voyant.', dtc:['P0016'], sol:'Courroie revisitée + intervalle 60 000 km.', veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['208','2008','308','3008','C3','C3 Aircross','C4','C5 Aircross','DS 3','DS 4','Corsa','Mokka'], mot:['1.2','puretech','eb2']}, carbu:'essence', kw:['courroie','distribution','puretech','humide','usure','eb2'], prio:1 },
  { cat:'Moteur', titre:'1.6 THP : tendeur de chaîne', src:'Campagne PSA', sym:'Claquement à froid, voyant moteur.', dtc:['P0016'], sol:'Tendeur + chaîne revisités.', veh:{marques:['Peugeot','Citroën','DS Automobiles'], modeles:['308','3008','508','C4','C5 Aircross','DS 4','DS 7'], mot:['1.6','thp','ep6']}, carbu:'essence', kw:['chaine','tendeur','thp','claquement','ep6'], prio:2 },
  { cat:'Transmission', titre:'Boîte EAT8 : à-coups basse vitesse', src:'TSB Stellantis', sym:'À-coups, vibrations en manœuvre.', dtc:[], sol:'Mise à jour logiciel boîte.', veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['3008','5008','308','508','208','C4','C5 Aircross','DS 7','Grandland'], mot:['eat8']}, carbu:'all', kw:['boite','eat8','a coups','vibration'], prio:3 },
  { cat:'Injection', titre:'1.5 dCi (K9K) : injecteurs', src:'Campagnes Renault', sym:'Claquement diesel, fumée, ratés.', dtc:['P0201','P0203'], sol:'Injecteurs neufs + codage.', veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Scenic','Captur','Kadjar','Kangoo','Trafic','Duster','Sandero','Logan','Jogger'], mot:['1.5','dci','k9k']}, carbu:'diesel', kw:['injecteur','k9k','claquement','fumee','rate'], prio:1 },
  { cat:'Moteur', titre:'1.2 TCe (H5F) : chaîne de distribution', src:'Campagnes Renault', sym:'Bruit de chaîne, voyant, risque casse.', dtc:['P0016'], sol:'Kit chaîne + crépine.', veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Captur','Kadjar','Jogger','Duster'], mot:['1.2','tce','h5f']}, carbu:'essence', kw:['chaine','distribution','tce','h5f','bruit'], prio:1 },
  { cat:'Moteur', titre:'1.5 dCi : coussinets de bielle', src:'Problème connu K9K', sym:'Claquement bas moteur, casse.', dtc:[], sol:'Contrôle pression huile, coussinets.', veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Scenic','Captur','Kangoo','Duster','Sandero','Logan'], mot:['1.5','dci','k9k']}, carbu:'diesel', kw:['coussinet','bielle','claquement','casse','pression huile'], prio:2 },
  { cat:'Moteur', titre:'TSI (EA888) : tendeur de chaîne', src:'Campagne VAG', sym:'Claquement à froid, voyant.', dtc:['P0016'], sol:'Tendeur revisité + chaîne.', veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Passat','Tiguan','A3','A4','A5','Q3','Q5','Leon','Ateca','Octavia','Superb'], mot:['1.8','2.0','tsi','ea888']}, carbu:'essence', kw:['chaine','tendeur','tsi','ea888','claquement'], prio:1 },
  { cat:'Dépollution', titre:'2.0 TDI (EA189) : campagne NOx', src:'Campagne VAG', sym:'Voyant, conso, rappel constructeur.', dtc:[], sol:'Mise à jour calculateur (rappel).', veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Passat','Tiguan','A3','A4','Q3','Q5','Leon','Octavia'], mot:['2.0','tdi','ea189']}, carbu:'diesel', kw:['tdi','ea189','nox','rappel','campagne'], prio:2 },
  { cat:'Moteur', titre:'N47 / B47 : chaîne de distribution', src:'Problème connu BMW', sym:'Bruit métallique arrière moteur, casse.', dtc:['P0016'], sol:'Remplacement préventif chaîne complet.', veh:{marques:['BMW','MINI'], modeles:['Serie 1','Serie 3','Serie 5','X1','X3','X5','Cooper','Countryman'], mot:['n47','b47','2.0']}, carbu:'diesel', kw:['chaine','distribution','n47','b47','bruit metallique','casse'], prio:0 },
  { cat:'Dépollution', titre:'N47 : refroidisseur EGR fissuré', src:'Rappel BMW', sym:'Fuite LDR, fumée blanche, risque incendie.', dtc:['P0401'], sol:'Remplacement refroidisseur EGR (rappel).', veh:{marques:['BMW','MINI'], modeles:['Serie 1','Serie 3','Serie 5','X1','X3','Cooper','Countryman'], mot:['n47','2.0']}, carbu:'diesel', kw:['egr','refroidisseur','fuite','fumee blanche','rappel'], prio:1 },
  { cat:'Injection', titre:'OM651 : injecteurs Delphi', src:'Problème connu Mercedes', sym:'Fumée, claquement, retour gasoil.', dtc:['P0201'], sol:'Injecteurs + rondelles pare-feu.', veh:{marques:['Mercedes-Benz'], modeles:['Classe A','Classe C','Classe E','GLA','GLC'], mot:['om651','2.1','2.2','cdi']}, carbu:'diesel', kw:['injecteur','om651','delphi','fumee','claquement'], prio:1 },
  { cat:'Moteur', titre:'2.2 D-4D (136) : joint de culasse', src:'Problème connu Toyota', sym:'Surchauffe, bulles dans LDR, conso LDR.', dtc:[], sol:'Joint culasse / bloc (campagne).', veh:{marques:['Toyota'], modeles:['RAV4','Corolla','Hilux'], mot:['2.2','d 4d','d4d']}, carbu:'diesel', kw:['joint culasse','surchauffe','ldr','d 4d'], prio:1 },
  { cat:'Moteur', titre:'1.0 EcoBoost : courroie immergée', src:'Campagne Ford', sym:'Usure courroie, débris, pompe à vide HS.', dtc:[], sol:'Kit courroie + huile spécifiée.', veh:{marques:['Ford'], modeles:['Fiesta','Focus','Puma','Kuga'], mot:['1.0','ecoboost']}, carbu:'essence', kw:['courroie','distribution','ecoboost','immergee','usure'], prio:1 },
  { cat:'Moteur', titre:'Theta II : coussinets / casse moteur', src:'Rappel Hyundai-Kia', sym:'Claquement, casse moteur, voyant huile.', dtc:['P0520'], sol:'Campagne moteur long block.', veh:{marques:['Hyundai','Kia'], modeles:['Tucson','Santa Fe','Sportage','Sorento'], mot:['2.0','2.4','theta']}, carbu:'essence', kw:['coussinet','casse','theta','claquement','huile'], prio:1 }
];

function prepFiche(f, remote) {
  var vehTxt = f.veh ? [f.veh.marques.join(' '), f.veh.modeles.join(' '), f.veh.mot.join(' ')].join(' ') : '';
  f._search = norm([f.titre, f.sym, f.sol, f.kw.join(' '), f.dtc.join(' '), f.cat, vehTxt, f.marqueLibre || ''].join(' '));
  f._titreN = norm(f.titre);
  f._catN = norm(f.cat).replace(/[^a-z]/g, '');
  f._label = f.veh ? (f.veh.marques[0] + ' ' + f.veh.modeles[0] + ' ' + f.veh.mot[0] + ' — ' + f.titre) : f.titre;
  f._key = norm(f.titre) + '|' + (f.veh ? norm(f.veh.marques[0]) + '|' + norm(f.veh.modeles[0]) : norm(f.marqueLibre || ''));
  f._remote = !!remote;
}
FICHES_CURATED.forEach(function (f) { prepFiche(f, false); });

// ---------- GÉNÉRATEUR BASE MASSIVE ----------
function enginesFor(m) {
  var out = [];
  if (m.orig !== 'us') {
    out.push({ label: '1.5 Diesel', carbu: 'diesel', powers: [100, 115, 130] });
    out.push({ label: '2.0 Diesel', carbu: 'diesel', powers: [150, 190] });
  }
  out.push({ label: '1.2 Essence', carbu: 'essence', powers: [82, 110, 130] });
  out.push({ label: '1.6 Essence', carbu: 'essence', powers: [150, 180] });
  if (m.orig !== 'us') out.push({ label: '1.5 Hybride', carbu: 'hybride', powers: [116, 145] });
  out.push({ label: 'Électrique', carbu: 'ev', powers: [136, 204] });
  return out;
}
function subsetFor(carbu) {
  if (carbu === 'diesel') return ['chd', 'fap'];
  if (carbu === 'essence') return ['cou', 'bob'];
  if (carbu === 'hybride') return ['bhv', 'cou'];
  return ['bht', 'rec'];
}
function makeFuels(m) {
  return m.orig === 'us' ? ['essence', 'hybride', 'ev'] : ['diesel', 'essence', 'hybride', 'ev'];
}

function buildMassiveBase() {
  var out = FICHES_CURATED.slice();
  var stats = { makes: {}, models: 0, powers: {}, pannes: {} };

  // Niveau MARQUE : toutes les pannes applicables
  MARQUES_COMPLETE.forEach(function (m) {
    var fuels = makeFuels(m);
    PANNES.forEach(function (p) {
      if (out.length >= CONFIG.MAX_EMBEDDED) return;
      var ok = p.carbu[0] === 'all' || p.carbu.some(function (c) { return fuels.indexOf(c) >= 0; });
      if (!ok) return;
      var f = {
        cat: p.cat, titre: m.nom + ' — ' + p.titre, src: 'Base massive — pannes connues',
        sym: p.sym, dtc: p.dtc.slice(), sol: p.sol, veh: null,
        carbu: p.carbu[0] === 'all' ? 'all' : p.carbu[0],
        kw: p.kw.concat([norm(m.nom)]).slice(0, 14), prio: p.prio,
        marqueLibre: norm(m.nom)
      };
      prepFiche(f, false);
      out.push(f);
      stats.makes[m.nom] = 1; stats.pannes[p.id] = 1;
    });
  });

  // Niveau MODÈLE × MOTORISATION × PUISSANCE
  Object.keys(MODELES_CATALOG).forEach(function (nom) {
    var m = null;
    for (var i = 0; i < MARQUES_COMPLETE.length; i++) if (MARQUES_COMPLETE[i].nom === nom) { m = MARQUES_COMPLETE[i]; break; }
    if (!m) return;
    var engines = enginesFor(m);
    MODELES_CATALOG[nom].forEach(function (modele) {
      engines.forEach(function (en) {
        en.powers.forEach(function (pw) {
          if (out.length >= CONFIG.MAX_EMBEDDED) return;
          subsetFor(en.carbu).forEach(function (pid) {
            if (out.length >= CONFIG.MAX_EMBEDDED) return;
            var p = PANNE_BY_ID[pid]; if (!p) return;
            var f = {
              cat: p.cat,
              titre: nom + ' ' + modele + ' ' + en.label + ' ' + pw + ' ch — ' + p.court,
              src: 'Base massive — motorisations & puissances',
              sym: p.sym, dtc: p.dtc.slice(), sol: p.sol, veh: null,
              carbu: en.carbu === 'ev' ? 'all' : en.carbu,
              kw: p.kw.concat(norm(nom + ' ' + modele + ' ' + en.label).split(' ')).concat([String(pw)]).slice(0, 16),
              prio: p.prio,
              marqueLibre: norm(nom + ' ' + modele + ' ' + en.label + ' ' + pw + ' ch')
            };
            prepFiche(f, false);
            out.push(f);
            stats.makes[nom] = 1; stats.models++; stats.powers[pw] = 1; stats.pannes[p.id] = 1;
          });
        });
      });
    });
  });

  stats.makesCount = Object.keys(stats.makes).length;
  stats.powersCount = Object.keys(stats.powers).length;
  stats.pannesCount = PANNES.filter(function (p) { return stats.pannes[p.id]; }).length;
  return { fiches: out, stats: stats };
}

var MASSIVE = buildMassiveBase();
var FICHES = MASSIVE.fiches;
var STATS = MASSIVE.stats;

// ---------- IndexedDB ----------
function DB() {}
DB.prototype.open = function () {
  var self = this;
  return new Promise(function (res, rej) {
    var r = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);
    r.onerror = function () { rej(r.error); };
    r.onsuccess = function () { self.db = r.result; res(self.db); };
    r.onupgradeneeded = function (e) {
      var d = e.target.result;
      if (!d.objectStoreNames.contains(CONFIG.STORE)) d.createObjectStore(CONFIG.STORE, { keyPath: 'id', autoIncrement: true });
    };
  });
};
DB.prototype.count = function () {
  var self = this;
  return new Promise(function (res) {
    try {
      var q = self.db.transaction(CONFIG.STORE, 'readonly').objectStore(CONFIG.STORE).count();
      q.onsuccess = function () { res(q.result); }; q.onerror = function () { res(0); };
    } catch (e) { res(0); }
  });
};
DB.prototype.seed = function (list) {
  var self = this;
  return new Promise(function (res, rej) {
    var t = self.db.transaction(CONFIG.STORE, 'readwrite');
    var s = t.objectStore(CONFIG.STORE);
    s.clear();
    list.forEach(function (f) {
      var clean = {};
      Object.keys(f).forEach(function (k) { if (k.charAt(0) !== '_') clean[k] = f[k]; });
      s.add(clean);
    });
    t.oncomplete = function () { res(list.length); };
    t.onerror = function () { rej(t.error); };
  });
};
DB.prototype.getAll = function () {
  var self = this;
  return new Promise(function (res) {
    try {
      var q = self.db.transaction(CONFIG.STORE, 'readonly').objectStore(CONFIG.STORE).getAll();
      q.onsuccess = function () { res(q.result || []); }; q.onerror = function () { res([]); };
    } catch (e) { res([]); }
  });
};
var db = new DB();

// ---------- IMPORT DISTANT S1/S2/S3 ----------
function fetchText(url, timeout) {
  var ctrl = new AbortController();
  var t = setTimeout(function () { ctrl.abort(); }, timeout || 12000);
  return fetch(url, { signal: ctrl.signal, cache: 'no-store', mode: 'cors' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .finally(function () { clearTimeout(t); });
}
function scanBalanced(s, i) {
  var start = s[i];
  if (start !== '[' && start !== '{') return null;
  var depth = 0, inStr = null, esc = false;
  for (var j = i; j < s.length; j++) {
    var c = s[j];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    if (depth === 0) return s.slice(i, j + 1);
  }
  return null;
}
function extractJsonBlocks(text) {
  var blocks = [], externals = [], m;
  var reJson = /<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = reJson.exec(text))) blocks.push({ src: 'script[type=json]', raw: m[1].trim() });
  var reExt = /<script[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi;
  while ((m = reExt.exec(text))) externals.push(m[1]);
  var reInline = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = reInline.exec(text))) {
    var code = m[1];
    var reAssign = /(?:const|let|var|window\.|self\.|globalThis\.)\s*([A-Za-z_$][\w$.]*)\s*=\s*/g;
    var a;
    while ((a = reAssign.exec(code))) {
      var i = a.index + a[0].length;
      if (code[i] === '[' || code[i] === '{') {
        var bal = scanBalanced(code, i);
        if (bal && bal.length > 200) blocks.push({ src: 'inline:' + a[1], raw: bal });
      }
    }
  }
  return { blocks: blocks, externals: externals };
}
function looseJson(raw) {
  try { return JSON.parse(raw); } catch (e) {}
  var s = raw;
  s = s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
  s = s.replace(/([{,\[]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":');
  s = s.replace(/:\s*'([^'\\\n]*(?:\\.[^'\\\n]*)*)'/g, ': "$1"');
  s = s.replace(/,\s*([\]}])/g, '$1');
  try { return JSON.parse(s); } catch (e) { return null; }
}
function findRecordArray(data) {
  var cands = [];
  if (Array.isArray(data)) cands.push(data);
  else if (data && typeof data === 'object') Object.keys(data).forEach(function (k) { if (Array.isArray(data[k])) cands.push(data[k]); });
  var best = null;
  cands.forEach(function (arr) {
    if (!arr.length) return;
    var objs = arr.filter(function (x) { return x && typeof x === 'object' && !Array.isArray(x); }).length;
    if (objs / arr.length >= 0.6 && (!best || objs > best.objs)) best = { arr: arr, objs: objs };
  });
  return best ? best.arr : null;
}
function parseAny(raw) { var d = looseJson(raw); return d ? findRecordArray(d) : null; }
function pick(o, keys) { for (var i = 0; i < keys.length; i++) { var v = o[keys[i]]; if (v !== undefined && v !== null && v !== '') return v; } return undefined; }
function toStr(v) { return Array.isArray(v) ? v.join(' · ') : String(v == null ? '' : v); }
function toDtc(v) {
  if (!v) return [];
  var arr = Array.isArray(v) ? v : String(v).split(/[,;•·|\s]+/);
  return arr.map(function (x) { return String(x).trim().toUpperCase(); }).filter(function (x) { return /^[A-Z0-9]{4,7}$/.test(x); }).slice(0, 8);
}
function guessCarbu(txt) {
  var t = norm(String(txt || ''));
  if (/diesel|tdi|dci|hdi|bluehdi|crdi|tdci|d 4d|d4d|cdti|jtd|multijet/.test(t)) return 'diesel';
  if (/hybride|hybrid|hsd|e tech|etech|phev/.test(t)) return 'hybride';
  if (/essence|tsi|tfsi|tce|puretech|thp|ecoboost|vti|gdi|tgdi/.test(t)) return 'essence';
  return 'all';
}
function normalizeRecord(r) {
  if (!r || typeof r !== 'object') return null;
  var marque = toStr(pick(r, ['marque','brand','make','constructeur']));
  var modele = toStr(pick(r, ['modele','model','vehicule','vehicle']));
  var motor = toStr(pick(r, ['motorisation','engine','motor','cylindree','version']));
  var titre = toStr(pick(r, ['titre','title','panne','probleme','problem','defaut','fault','nom','name','organe','part','intitule']));
  var sym = toStr(pick(r, ['symptomes','symptoms','symptome','signes','description','desc','constat']));
  var sol = toStr(pick(r, ['solution','sol','fix','reparation','repair','action','preconisation','correctif']));
  var src = toStr(pick(r, ['source','src','origine','campagne','campaign','reference']));
  var cat = toStr(pick(r, ['categorie','cat','category','type','organe_type','systeme']));
  if (!titre) return null;
  var kw = norm([marque, modele, motor, titre].join(' ')).split(' ').filter(function (t) { return t.length >= 3; }).slice(0, 12);
  var f = {
    cat: cat || 'Moteur', titre: titre, src: src || 'Import appli-aide-technique',
    sym: sym || 'Voir détail fiche.', dtc: toDtc(pick(r, ['dtc','codes','codes_defaut','code','fault_codes'])),
    sol: sol || 'Diagnostic complet recommandé.', veh: null,
    carbu: guessCarbu(motor + ' ' + titre), kw: kw, prio: 5,
    marqueLibre: norm([marque, modele, motor].join(' '))
  };
  prepFiche(f, true);
  return f;
}
function remoteToFiches(records, limit) {
  var out = [], seen = {};
  for (var i = 0; i < records.length && out.length < limit; i++) {
    var f = normalizeRecord(records[i]);
    if (!f || seen[f._key]) continue;
    seen[f._key] = 1; out.push(f);
  }
  return out;
}

async function importRemote(onLog, onProg) {
  var log = onLog || function () {};
  var prog = onProg || function () {};
  var report = { date: new Date().toISOString(), source: CONFIG.SOURCE_URL, strategy: null, remoteCount: 0, totalCount: 0, errors: [] };
  log('📦 Base embarquée massive : ' + FICHES.length + ' fiches (' + STATS.makesCount + ' marques · ' + STATS.models + ' motorisations-modèles · ' + STATS.powersCount + ' puissances · ' + STATS.pannesCount + ' familles de pannes)');
  var remote = [];

  log('S1 · Endpoints JSON directs…'); prog(10);
  for (var u = 0; u < CONFIG.JSON_ENDPOINTS.length; u++) {
    var url = CONFIG.JSON_ENDPOINTS[u];
    try {
      var txt = await fetchText(url);
      var data = parseAny(txt);
      if (data && data.length) { remote = data; report.strategy = 'S1:' + url.split('/').pop(); log('✅ ' + url + ' → ' + data.length + ' enregistrements'); break; }
    } catch (e) { report.errors.push(url + ' : ' + e.message); log('⚠️ ' + url.split('/').pop() + ' : ' + e.message); }
  }

  if (!remote.length) {
    log('S2 · Analyse HTML + scripts inline/externes…'); prog(35);
    try {
      var html = await fetchText(CONFIG.SOURCE_URL);
      var ex = extractJsonBlocks(html);
      log('🔎 ' + ex.blocks.length + ' bloc(s) inline · ' + ex.externals.length + ' script(s) externe(s)');
      ex.blocks.forEach(function (b) {
        var d = parseAny(b.raw);
        if (d && d.length > remote.length) { remote = d; report.strategy = 'S2:' + b.src; }
      });
      for (var e2 = 0; e2 < Math.min(ex.externals.length, 6); e2++) {
        var abs = new URL(ex.externals[e2], CONFIG.SOURCE_URL).href;
        if (abs.indexOf('https://expertkevin06-cell.github.io/') !== 0) continue;
        try {
          var js = await fetchText(abs);
          extractJsonBlocks('<script>' + js + '</script>').blocks.forEach(function (b) {
            var d = parseAny(b.raw);
            if (d && d.length > remote.length) { remote = d; report.strategy = 'S2:' + abs.split('/').pop(); }
          });
        } catch (e3) { report.errors.push(abs + ' : ' + e3.message); }
      }
      log(remote.length ? '✅ ' + remote.length + ' enregistrements extraits (' + report.strategy + ')' : '⚠️ S2 : aucune structure exploitable');
    } catch (e4) { report.errors.push('S2 : ' + e4.message); log('⚠️ S2 : ' + e4.message); }
  }

  var mergedExtra = [];
  if (remote.length) {
    prog(60); log('🧬 Normalisation & fusion dédupliquée…');
    var rf = remoteToFiches(remote, CONFIG.MAX_REMOTE);
    report.remoteCount = rf.length;
    var keys = {};
    FICHES.forEach(function (f) { keys[f._key] = 1; });
    mergedExtra = rf.filter(function (f) { return !keys[f._key]; });
    log('🧬 ' + rf.length + ' fiches distantes normalisées · ' + mergedExtra.length + ' nouvelles ajoutées');
  } else {
    report.strategy = 'S3:base-embarquée-massive';
    log('⚠️ Distant injoignable/exploitable → S3 : base embarquée MASSIVE conservée (' + FICHES.length + ' fiches)');
  }

  prog(80);
  var all = FICHES.concat(mergedExtra);
  await db.open();
  var n = await db.seed(all);
  window.__ALL_FICHES = all;
  report.totalCount = n;
  prog(100);
  try { localStorage.setItem(CONFIG.LS_IMPORT, JSON.stringify(report)); } catch (e5) {}
  log('✅ IndexedDB mise à jour : ' + n + ' fiches au total');
  return report;
}

// ---------- RECHERCHE ----------
var VEH = [
  ['3008','Peugeot','3008'],['2008','Peugeot','2008'],['5008','Peugeot','5008'],['408','Peugeot','408'],
  ['208','Peugeot','208'],['308','Peugeot','308'],['508','Peugeot','508'],['partner','Peugeot','Partner'],['rifter','Peugeot','Rifter'],
  ['clio','Renault','Clio'],['megane','Renault','Megane'],['scenic','Renault','Scenic'],['captur','Renault','Captur'],['kadjar','Renault','Kadjar'],['austral','Renault','Austral'],['zoe','Renault','Zoe'],['twingo','Renault','Twingo'],['kangoo','Renault','Kangoo'],['trafic','Renault','Trafic'],
  ['duster','Dacia','Duster'],['sandero','Dacia','Sandero'],['logan','Dacia','Logan'],['jogger','Dacia','Jogger'],['spring','Dacia','Spring'],
  ['c3 aircross','Citroën','C3 Aircross'],['c3','Citroën','C3'],['c4','Citroën','C4'],['c5 aircross','Citroën','C5 Aircross'],['berlingo','Citroën','Berlingo'],
  ['ds3','DS Automobiles','DS 3'],['ds4','DS Automobiles','DS 4'],['ds7','DS Automobiles','DS 7'],
  ['golf','Volkswagen','Golf'],['polo','Volkswagen','Polo'],['passat','Volkswagen','Passat'],['tiguan','Volkswagen','Tiguan'],['touareg','Volkswagen','Touareg'],['t roc','Volkswagen','T-Roc'],['id 3','Volkswagen','ID.3'],['id 4','Volkswagen','ID.4'],
  ['a3','Audi','A3'],['a4','Audi','A4'],['a5','Audi','A5'],['a6','Audi','A6'],['q3','Audi','Q3'],['q5','Audi','Q5'],['q7','Audi','Q7'],
  ['octavia','Škoda','Octavia'],['fabia','Škoda','Fabia'],['superb','Škoda','Superb'],['kodiaq','Škoda','Kodiaq'],
  ['leon','SEAT','Leon'],['ibiza','SEAT','Ibiza'],['ateca','SEAT','Ateca'],['arona','SEAT','Arona'],
  ['serie 1','BMW','Serie 1'],['serie 3','BMW','Serie 3'],['serie 5','BMW','Serie 5'],['x1','BMW','X1'],['x3','BMW','X3'],['x5','BMW','X5'],
  ['countryman','MINI','Countryman'],['mini','MINI','Cooper'],
  ['classe a','Mercedes-Benz','Classe A'],['classe c','Mercedes-Benz','Classe C'],['classe e','Mercedes-Benz','Classe E'],['gla','Mercedes-Benz','GLA'],['glc','Mercedes-Benz','GLC'],
  ['yaris','Toyota','Yaris'],['corolla','Toyota','Corolla'],['rav4','Toyota','RAV4'],['c hr','Toyota','C-HR'],['hilux','Toyota','Hilux'],['prius','Toyota','Prius'],
  ['fiesta','Ford','Fiesta'],['focus','Ford','Focus'],['kuga','Ford','Kuga'],['puma','Ford','Puma'],
  ['i20','Hyundai','i20'],['i30','Hyundai','i30'],['tucson','Hyundai','Tucson'],['santa fe','Hyundai','Santa Fe'],['kona','Hyundai','Kona'],
  ['ceed','Kia','Ceed'],['sportage','Kia','Sportage'],['niro','Kia','Niro'],['sorento','Kia','Sorento'],
  ['qashqai','Nissan','Qashqai'],['juke','Nissan','Juke'],['micra','Nissan','Micra'],['leaf','Nissan','Leaf'],
  ['corsa','Opel','Corsa'],['astra','Opel','Astra'],['mokka','Opel','Mokka'],['grandland','Opel','Grandland'],
  ['model 3','Tesla','Model 3'],['model y','Tesla','Model Y'],['model s','Tesla','Model S'],['model x','Tesla','Model X'],
  ['atto 3','BYD','Atto 3'],['dolphin','BYD','Dolphin'],['seal','BYD','Seal'],['han','BYD','Han'],['tang','BYD','Tang']
].sort(function (a, b) { return b[0].length - a[0].length; });

var MARQUES = [
  ['peugeot','Peugeot'],['renault','Renault'],['citroen','Citroën'],['ds automobiles','DS Automobiles'],
  ['dacia','Dacia'],['volkswagen','Volkswagen'],['vw','Volkswagen'],['audi','Audi'],['skoda','Škoda'],['seat','SEAT'],
  ['bmw','BMW'],['mini','MINI'],['mercedes','Mercedes-Benz'],['toyota','Toyota'],['lexus','Lexus'],['ford','Ford'],
  ['hyundai','Hyundai'],['kia','Kia'],['nissan','Nissan'],['opel','Opel'],['tesla','Tesla'],['jeep','Jeep'],
  ['chevrolet','Chevrolet'],['honda','Honda'],['mazda','Mazda'],['volvo','Volvo'],['porsche','Porsche'],['fiat','Fiat'],
  ['byd','BYD'],['mg','MG'],['chery','Chery'],['geely','Geely'],['great wall','Great Wall'],['xiaomi auto','Xiaomi Auto']
].sort(function (a, b) { return b[0].length - a[0].length; });

var FAMILLES = [
  { tok: ['bluehdi','hdi','dv5','dv6'], carbu: 'diesel' },
  { tok: ['tdi'], carbu: 'diesel' },
  { tok: ['dci','k9k'], carbu: 'diesel' },
  { tok: ['crdi'], carbu: 'diesel' },
  { tok: ['tdci'], carbu: 'diesel' },
  { tok: ['d 4d','d4d'], carbu: 'diesel' },
  { tok: ['puretech','eb2','thp','ep6','tsi','tfsi','ea888','ea211','tce','ecoboost','vti'], carbu: 'essence' },
  { tok: ['hybride','hsd','e tech','etech'], carbu: 'hybride' }
];

var ORGANES = [
  'courroie de distribution','courroie d\'accessoire','chaîne de distribution','fap (filtre à particules)',
  'vanne egr','turbo','injecteurs','pompe haute pression','pompe à eau','alternateur','démarreur',
  'embrayage','volant moteur','sonde lambda','catalyseur','débitmètre','bobines d\'allumage','bougies',
  'amortisseurs','plaquettes de frein','disques de frein','capteur abs','crémaillère direction',
  'radiateur','thermostat','compresseur clim','batterie','système adblue scr'
];

function buildCtx(q) {
  var nq = norm(q);
  var tokens = nq.split(' ').filter(function (t) { return t.length >= 2; });
  var veh = null, i;
  for (i = 0; i < VEH.length; i++) { if ((' ' + nq + ' ').indexOf(' ' + VEH[i][0] + ' ') >= 0) { veh = { marque: VEH[i][1], modele: VEH[i][2] }; break; } }
  var marque = veh ? veh.marque : null;
  if (!marque) for (i = 0; i < MARQUES.length; i++) { if ((' ' + nq + ' ').indexOf(' ' + MARQUES[i][0] + ' ') >= 0) { marque = MARQUES[i][1]; break; } }
  var cyl = null;
  for (i = 0; i < tokens.length; i++) { if (/^\d\.\d$/.test(tokens[i])) { cyl = tokens[i]; break; } }
  var fam = null, carbu = null;
  for (i = 0; i < FAMILLES.length; i++) {
    if (FAMILLES[i].tok.some(function (tk) { return tokens.indexOf(tk) >= 0; })) { fam = FAMILLES[i].tok; carbu = FAMILLES[i].carbu; break; }
  }
  if (!carbu && cyl && veh) {
    var cars = FICHES.filter(function (f) {
      return f.veh && f.veh.marques.indexOf(veh.marque) >= 0 && f.veh.modeles.indexOf(veh.modele) >= 0 && f.veh.mot.indexOf(cyl) >= 0;
    }).map(function (f) { return f.carbu; });
    if (cars.length) carbu = cars[0];
  }
  return { nq: nq, tokens: tokens, veh: veh, marque: marque, cyl: cyl, fam: fam, carbu: carbu };
}

function evalFiche(f, ctx) {
  if (!ctx.tokens.length) return null;
  var s = 0;
  if (ctx.veh) {
    if (f.veh) {
      var mOk = f.veh.marques.indexOf(ctx.veh.marque) >= 0;
      var moOk = f.veh.modeles.indexOf(ctx.veh.modele) >= 0;
      if (!(mOk && moOk)) return null;
      s += 60;
      if (ctx.cyl) {
        var cyls = f.veh.mot.filter(function (m) { return /^\d\.\d$/.test(m); });
        if (cyls.length && cyls.indexOf(ctx.cyl) < 0) return null;
        if (f.veh.mot.indexOf(ctx.cyl) >= 0) s += 30;
      }
      if (ctx.fam && f.veh.mot.some(function (m) { return ctx.fam.indexOf(m) >= 0; })) s += 20;
    } else {
      s += 25;
      if (ctx.carbu && f.carbu && f.carbu !== 'all' && f.carbu !== ctx.carbu) return null;
    }
  } else {
    if (f.veh) {
      s += 5;
      if (ctx.marque) {
        if (f.veh.marques.indexOf(ctx.marque) < 0) return null;
        s += 25;
      }
    } else {
      s += 15;
      if (ctx.marque) s += 5;
      if (ctx.carbu && f.carbu && f.carbu !== 'all' && f.carbu !== ctx.carbu) return null;
    }
  }
  var hits = 0;
  ctx.tokens.forEach(function (tok) {
    if (f._search.indexOf(tok) >= 0) { s += 8; hits++; }
    if (f._titreN.indexOf(tok) >= 0) s += 6;
    if (f.dtc.some(function (d) { return d.toLowerCase() === tok; })) s += 40;
    if (tok.length >= 3 && f.kw.some(function (k) { return k.indexOf(tok) === 0; })) s += 6;
  });
  if (hits === 0 && !(ctx.veh && !f.veh) && s < 60) return null;
  return s;
}

function search(q, origFilter) {
  var ctx = buildCtx(q);
  var pool = window.__ALL_FICHES || FICHES;
  var out = [];
  pool.forEach(function (f) {
    var s = evalFiche(f, ctx);
    if (s === null) return;
    if (origFilter && origFilter !== 'toutes') {
      var o = f.veh ? MARQUE_ORIG[f.veh.marques[0]] : (function () {
        var parts = (f.marqueLibre || '').split(' ');
        for (var i = 0; i < MARQUES_COMPLETE.length; i++) {
          if ((f.marqueLibre || '').indexOf(norm(MARQUES_COMPLETE[i].nom)) === 0) return MARQUES_COMPLETE[i].orig;
        }
        return null;
      })();
      if (o && o !== origFilter) return;
    }
    out.push({ f: f, s: s });
  });
  out.sort(function (a, b) { return b.s - a.s || (a.f.prio || 5) - (b.f.prio || 5); });
  return { ctx: ctx, results: out.slice(0, 30) };
}

function suggestions(ctx, results) {
  var sugg = [];
  var last = ctx.tokens[ctx.tokens.length - 1] || '';
  if (last.length >= 2) {
    ORGANES.forEach(function (o) {
      var on = norm(o);
      if (on.indexOf(last) === 0 && on !== last && sugg.length < 4) sugg.push({ type: 'terme', label: o });
    });
  }
  results.slice(0, 6).forEach(function (r) { sugg.push({ type: 'fiche', label: r.f._label, f: r.f }); });
  return sugg.slice(0, 8);
}

// ---------- RENDU ----------
function $(id) { return document.getElementById(id); }
function hl(text, q) {
  var toks = norm(q).split(' ').filter(function (t) { return t.length >= 2; });
  var out = text;
  toks.forEach(function (t) {
    out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<b>$1</b>');
  });
  return out;
}
function renderResults(results, ctx, q) {
  $('resCount').textContent = results.length ? '(' + results.length + ' résultat' + (results.length > 1 ? 's' : '') + ')' : '';
  var dB = $('detectBox');
  if (ctx.veh) {
    var label = ctx.veh.marque + ' ' + ctx.veh.modele;
    if (ctx.cyl) label += ' ' + ctx.cyl;
    if (ctx.carbu) label += ' (' + ctx.carbu + ')';
    dB.innerHTML = '<div class="detect">🚗 <b>Véhicule détecté :</b> ' + label + ' — fiches ciblées ci-dessous.</div>';
  } else dB.innerHTML = '';
  var box = $('resultsBox');
  if (!results.length) {
    box.innerHTML = '<div class="empty">Aucun résultat pour « ' + q + ' ». Essayez : modèle (3008, clio…), organe (courroie, fap, egr…), DTC (p0016)…</div>';
    return;
  }
  box.innerHTML = results.map(function (r) {
    var f = r.f;
    var catCls = 'cat-' + f._catN.charAt(0).toUpperCase() + f._catN.slice(1);
    return '<div class="fiche">' +
      '<div class="f-head"><span class="cat ' + catCls + '">' + f.cat + '</span>' +
      '<span class="f-titre">' + hl(f.titre, q) + '</span>' +
      '<span class="f-src">' + f.src + '</span></div>' +
      '<div class="f-line"><span class="ico">📋</span>' + f.sym + '</div>' +
      '<div class="f-line"><span class="ico">🔧</span>DTC : ' + (f.dtc.length ? f.dtc.join(' • ') : '—') + '</div>' +
      '<div class="f-line"><span class="ico">✅</span>' + f.sol + '</div></div>';
  }).join('');
}
function renderSugg(list, q) {
  var box = $('suggBox');
  if (!list.length) { box.style.display = 'none'; return; }
  box.innerHTML = list.map(function (s, i) {
    var plain = s.label.replace(/"/g, '&quot;');
    return '<div class="sugg-item" data-i="' + i + '" data-plain="' + plain + '">' +
      '<span class="s-ico">' + (s.type === 'terme' ? '🔤' : '🩺') + '</span>' +
      '<span><div class="s-main">' + hl(s.label, q) + '</div>' +
      '<div class="s-sub">' + (s.type === 'terme' ? 'complétion organe' : s.f.sym) + '</div></span></div>';
  }).join('');
  box.style.display = 'block';
  box.querySelectorAll('.sugg-item').forEach(function (el) {
    el.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var s = list[+el.dataset.i];
      $('searchInput').value = s.label;
      box.style.display = 'none';
      runSearch();
    });
  });
}
function runSearch() {
  var q = $('searchInput').value.trim();
  if (q.length < 2) {
    $('suggBox').style.display = 'none';
    $('resCount').textContent = '';
    $('detectBox').innerHTML = '';
    $('resultsBox').innerHTML = '<div class="empty">Tapez un mot-clé : marque, modèle, motorisation, puissance, organe (courroie, fap, egr…), symptôme ou code DTC.</div>';
    return;
  }
  var r = search(q, window.__ORIG_FILTER || 'toutes');
  renderSugg(suggestions(r.ctx, r.results), q);
  renderResults(r.results, r.ctx, q);
}

// ---------- UI IMPORT ----------
async function importMassiveUI() {
  var btn = $('btnImportMassive'), st = $('importStatus'), logEl = $('importLog'), bar = $('importBar');
  function log(m) {
    if (logEl.textContent.indexOf('aucun import') >= 0) logEl.textContent = '';
    logEl.textContent += m + '\n';
    logEl.scrollTop = logEl.scrollHeight;
  }
  try {
    btn.disabled = true; btn.textContent = '⏳ Import en cours…';
    bar.style.width = '5%';
    st.className = 'status inf'; st.innerHTML = '🔄 Import base massive (embarquée + distante)…';
    var rep = await importRemote(log, function (p) { bar.style.width = p + '%'; });
    st.className = 'status ok';
    st.innerHTML = '✅ <b>Import terminé</b> · stratégie ' + rep.strategy + ' · ' + rep.remoteCount +
      ' fiches distantes · base totale ' + rep.totalCount + ' · ' + new Date(rep.date).toLocaleString('fr-FR');
    $('ficheCount').textContent = rep.totalCount + ' fiches';
    $('dataVersion').textContent = (rep.remoteCount ? '3 (import distant ' : '2 (massive local ') + new Date(rep.date).toLocaleDateString('fr-FR') + ')';
    setTimeout(function () { if (confirm('Import terminé (' + rep.totalCount + ' fiches). Recharger la page ?')) location.reload(); }, 800);
  } catch (e) {
    st.className = 'status err'; st.innerHTML = '❌ Erreur import : ' + e.message; log('❌ ' + e.message);
  } finally {
    btn.disabled = false; btn.textContent = '🚀 Importer TOUTE la base (embarquée + distante)';
  }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', async function () {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      document.querySelectorAll('.tabcontent').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      $('tab-' + t.dataset.tab).classList.add('active');
    });
  });
  document.querySelectorAll('.pill').forEach(function (p) {
    p.addEventListener('click', function () {
      document.querySelectorAll('.pill').forEach(function (x) { x.classList.remove('active'); });
      p.classList.add('active');
      window.__ORIG_FILTER = p.dataset.orig;
      runSearch();
    });
  });
  var timer = null;
  $('searchInput').addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(runSearch, 140); });
  $('searchInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { $('suggBox').style.display = 'none'; runSearch(); }
    if (e.key === 'Escape') $('suggBox').style.display = 'none';
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.searchwrap')) $('suggBox').style.display = 'none'; });
  document.querySelectorAll('.ex').forEach(function (x) {
    x.addEventListener('click', function () { $('searchInput').value = x.textContent; runSearch(); });
  });

  var updNet = function () {
    var on = navigator.onLine;
    var et = (navigator.connection && navigator.connection.effectiveType) || '';
    $('netBadge').textContent = on ? ('En ligne' + (et ? ' • ' + et.toUpperCase() : ' • 4G/5G')) : 'Hors ligne';
    $('netInfo').textContent = on ? 'En ligne' : 'Hors ligne';
  };
  updNet(); window.addEventListener('online', updNet); window.addEventListener('offline', updNet);

  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  $('btnInstall').addEventListener('click', function () {
    if (deferred) deferred.prompt();
    else alert('Installation PWA : utilisez le menu du navigateur (« Ajouter à l\'écran d\'accueil »).');
  });
  $('btnShare').addEventListener('click', async function () {
    var data = { title: 'DiagAuto Pro', url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (e) {} }
    else { try { await navigator.clipboard.writeText(location.href); alert('Lien copié !'); } catch (e) { alert(location.href); } }
  });
  $('btnLock').addEventListener('click', function () {
    var code = prompt('Code propriétaire :');
    if (code === 'DIAGAUTO-OWNER') { $('btnLock').textContent = '🔓'; alert('Mode propriétaire activé.'); }
    else if (code !== null) alert('Code invalide.');
  });

  $('btnImportMassive').addEventListener('click', importMassiveUI);
  $('btnReloadData').addEventListener('click', importMassiveUI);
  $('btnExport').addEventListener('click', function () {
    var pool = window.__ALL_FICHES || FICHES;
    var clean = pool.map(function (f) {
      var o = {}; Object.keys(f).forEach(function (k) { if (k.charAt(0) !== '_') o[k] = f[k]; }); return o;
    });
    var blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'diagauto-base-massive.json'; a.click();
  });
  $('btnImportFile').addEventListener('click', function () { $('fileJson').click(); });
  $('fileJson').addEventListener('change', async function (e) {
    var file = e.target.files[0]; if (!file) return;
    try {
      var arr = JSON.parse(await file.text());
      if (!Array.isArray(arr)) throw new Error('format invalide');
      arr.forEach(function (f) { prepFiche(f, true); });
      await db.open(); await db.seed(arr);
      alert('✅ ' + arr.length + ' fiches importées depuis le fichier.');
      location.reload();
    } catch (err) { alert('❌ Fichier invalide : ' + err.message); }
  });

  // Boot : seed massif puis recharge éventuelle (fusion distante précédente)
  try {
    await db.open();
    var n = await db.count();
    if (n < 1000) { await db.seed(FICHES); n = FICHES.length; window.__ALL_FICHES = FICHES; }
    else {
      var stored = await db.getAll();
      if (stored.length) {
        stored.forEach(function (f) { prepFiche(f, !!f._remote); });
        window.__ALL_FICHES = stored;
        n = stored.length;
      }
    }
    $('ficheCount').textContent = n + ' fiches';
    var rep = null;
    try { rep = JSON.parse(localStorage.getItem(CONFIG.LS_IMPORT) || 'null'); } catch (e) {}
    if (rep && rep.remoteCount) $('dataVersion').textContent = '3 (import distant ' + new Date(rep.date).toLocaleDateString('fr-FR') + ')';
    else $('dataVersion').textContent = '2 (massive local — ' + STATS.makesCount + ' marques)';
  } catch (e) {
    console.warn('IndexedDB indisponible, mode mémoire.', e);
    window.__ALL_FICHES = FICHES;
    $('ficheCount').textContent = FICHES.length + ' fiches (mémoire)';
  }
});

window.DiagAuto = { FICHES: FICHES, PANNES: PANNES, MARQUES: MARQUES_COMPLETE, stats: STATS, search: search, buildCtx: buildCtx, CONFIG: CONFIG, VERSION: VERSION };
window.DiagImporter = {
  importRemote: importRemote,
  lastReport: function () { try { return JSON.parse(localStorage.getItem(CONFIG.LS_IMPORT)); } catch (e) { return null; } }
};

})();
