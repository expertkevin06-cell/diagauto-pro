// ============================================================
// IMPORT-BASE-MASSIVE.JS — v4.0
// Recherche prédictive + réponse automatisée type
// "appli-aide-technique" : véhicule détecté + fiches ciblées
// ============================================================
(function () {
'use strict';

const CONFIG = {
  SOURCE_URL: 'https://expertkevin06-cell.github.io/appli-aide-technique/',
  DB_NAME: 'DiagAutoDB', DB_VERSION: 4, STORE: 'fiches'
};

// ---------- Utilitaires ----------
const norm = s => (s || '').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9.]+/g, ' ').replace(/\s+/g, ' ').trim();

// ---------- Origine des marques ----------
const ORIG = {
  'Peugeot':'fr','Citroën':'fr','DS Automobiles':'fr','Renault':'fr',
  'Dacia':'eu','Volkswagen':'eu','Audi':'eu','Škoda':'eu','SEAT':'eu','BMW':'eu',
  'MINI':'eu','Mercedes-Benz':'eu','Opel':'eu','Volvo':'eu','Porsche':'eu','Fiat':'eu',
  'Toyota':'as','Lexus':'as','Hyundai':'as','Kia':'as','Nissan':'as','Honda':'as','Mitsubishi':'as','Suzuki':'as',
  'Ford':'us','Chevrolet':'us','Jeep':'us','Tesla':'us','Ram':'us'
};

// ---------- Détection véhicules (alias → marque/modèle) ----------
const VEH = [
  ['3008','Peugeot','3008'],['2008','Peugeot','2008'],['5008','Peugeot','5008'],['408','Peugeot','408'],
  ['208','Peugeot','208'],['308','Peugeot','308'],['508','Peugeot','508'],['partner','Peugeot','Partner'],['rifter','Peugeot','Rifter'],['expert','Peugeot','Expert'],
  ['clio','Renault','Clio'],['megane','Renault','Megane'],['scenic','Renault','Scenic'],['captur','Renault','Captur'],['kadjar','Renault','Kadjar'],['austral','Renault','Austral'],['zoe','Renault','Zoe'],['twingo','Renault','Twingo'],['kangoo','Renault','Kangoo'],['trafic','Renault','Trafic'],['master','Renault','Master'],
  ['duster','Dacia','Duster'],['sandero','Dacia','Sandero'],['logan','Dacia','Logan'],['jogger','Dacia','Jogger'],['spring','Dacia','Spring'],
  ['c3 aircross','Citroën','C3 Aircross'],['c3','Citroën','C3'],['c4','Citroën','C4'],['c5 aircross','Citroën','C5 Aircross'],['berlingo','Citroën','Berlingo'],['jumpy','Citroën','Jumpy'],
  ['ds3','DS Automobiles','DS 3'],['ds4','DS Automobiles','DS 4'],['ds7','DS Automobiles','DS 7'],
  ['golf','Volkswagen','Golf'],['polo','Volkswagen','Polo'],['passat','Volkswagen','Passat'],['tiguan','Volkswagen','Tiguan'],['touareg','Volkswagen','Touareg'],['t roc','Volkswagen','T-Roc'],
  ['a3','Audi','A3'],['a4','Audi','A4'],['a5','Audi','A5'],['a6','Audi','A6'],['q3','Audi','Q3'],['q5','Audi','Q5'],['q7','Audi','Q7'],
  ['octavia','Škoda','Octavia'],['fabia','Škoda','Fabia'],['superb','Škoda','Superb'],['kodiaq','Škoda','Kodiaq'],['kamiq','Škoda','Kamiq'],
  ['leon','SEAT','Leon'],['ibiza','SEAT','Ibiza'],['ateca','SEAT','Ateca'],['arona','SEAT','Arona'],
  ['serie 1','BMW','Serie 1'],['serie 3','BMW','Serie 3'],['serie 5','BMW','Serie 5'],['x1','BMW','X1'],['x3','BMW','X3'],['x5','BMW','X5'],
  ['countryman','MINI','Countryman'],['mini','MINI','Cooper'],
  ['classe a','Mercedes-Benz','Classe A'],['classe c','Mercedes-Benz','Classe C'],['classe e','Mercedes-Benz','Classe E'],['gla','Mercedes-Benz','GLA'],['glc','Mercedes-Benz','GLC'],
  ['yaris','Toyota','Yaris'],['corolla','Toyota','Corolla'],['rav4','Toyota','RAV4'],['c hr','Toyota','C-HR'],['hilux','Toyota','Hilux'],['prius','Toyota','Prius'],
  ['fiesta','Ford','Fiesta'],['focus','Ford','Focus'],['kuga','Ford','Kuga'],['puma','Ford','Puma'],['transit','Ford','Transit'],
  ['i20','Hyundai','i20'],['i30','Hyundai','i30'],['tucson','Hyundai','Tucson'],['santa fe','Hyundai','Santa Fe'],['kona','Hyundai','Kona'],
  ['ceed','Kia','Ceed'],['sportage','Kia','Sportage'],['niro','Kia','Niro'],['sorento','Kia','Sorento'],['picanto','Kia','Picanto'],
  ['qashqai','Nissan','Qashqai'],['juke','Nissan','Juke'],['micra','Nissan','Micra'],['leaf','Nissan','Leaf'],['x trail','Nissan','X-Trail'],
  ['corsa','Opel','Corsa'],['astra','Opel','Astra'],['mokka','Opel','Mokka'],['grandland','Opel','Grandland']
].sort((a, b) => b[0].length - a[0].length);

const MARQUES = [
  ['peugeot','Peugeot'],['renault','Renault'],['citroen','Citroën'],['ds automobiles','DS Automobiles'],
  ['dacia','Dacia'],['volkswagen','Volkswagen'],['vw','Volkswagen'],['audi','Audi'],['skoda','Škoda'],['seat','SEAT'],
  ['bmw','BMW'],['mini','MINI'],['mercedes','Mercedes-Benz'],['toyota','Toyota'],['lexus','Lexus'],['ford','Ford'],
  ['hyundai','Hyundai'],['kia','Kia'],['nissan','Nissan'],['opel','Opel'],['tesla','Tesla'],['jeep','Jeep'],
  ['chevrolet','Chevrolet'],['honda','Honda'],['mazda','Mazda'],['volvo','Volvo'],['porsche','Porsche'],['fiat','Fiat']
].sort((a, b) => b[0].length - a[0].length);

// ---------- Familles moteurs ----------
const FAMILLES = [
  { tok: ['bluehdi','hdi','dv5','dv6'], carbu: 'diesel' },
  { tok: ['tdi'], carbu: 'diesel' },
  { tok: ['dci','k9k'], carbu: 'diesel' },
  { tok: ['crdi'], carbu: 'diesel' },
  { tok: ['tdci'], carbu: 'diesel' },
  { tok: ['d 4d','d4d'], carbu: 'diesel' },
  { tok: ['puretech','eb2','thp','ep6','tsi','tfsi','ea888','ea211','tce','ecoboost','vti'], carbu: 'essence' },
  { tok: ['hybride','hsd','e tech','etech'], carbu: 'hybride' }
];

// ---------- Termes organes (prédictif) ----------
const ORGANES = [
  'courroie de distribution','courroie d\'accessoire','chaîne de distribution','fap (filtre à particules)',
  'vanne egr','turbo','injecteurs','pompe haute pression','pompe à eau','alternateur','démarreur',
  'embrayage','volant moteur','sonde lambda','catalyseur','débitmètre','bobines d\'allumage','bougies',
  'amortisseurs','plaquettes de frein','disques de frein','capteur abs','crémaillère direction',
  'radiateur','thermostat','compresseur clim','batterie','système adblue scr'
];

// ============================================================
// BASE DE FICHES (format identique à la référence)
// cat | titre | src | sym | dtc | sol | veh | carbu | kw | prio
// ============================================================
const FICHES = [
  // ----- Stellantis -----
  { cat:'Moteur', titre:'1.5 BlueHDi (DV5) : chaîne arbre à cames', src:'Campagnes Stellantis',
    sym:'Bruit métallique, casse.', dtc:['P0016'], sol:'Chaîne renforcée.',
    veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['3008','5008','208','2008','308','408','508','Partner','Rifter','C3 Aircross','C4','Berlingo','DS 3','DS 4','Grandland','Astra'], mot:['1.5','bluehdi','dv5']},
    carbu:'diesel', kw:['chaine','distribution','arbre a cames','bruit metallique','casse','dv5'], prio:0 },

  { cat:'Moteur', titre:'1.2 PureTech : courroie de distribution humide', src:'Campagnes Stellantis',
    sym:'Usure prématurée, débris dans l\'huile, voyant.', dtc:['P0016'], sol:'Courroie revisitée + intervalle 60 000 km.',
    veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['208','2008','308','3008','C3','C3 Aircross','C4','C5 Aircross','DS 3','DS 4','Corsa','Mokka'], mot:['1.2','puretech','eb2']},
    carbu:'essence', kw:['courroie','distribution','puretech','humide','usure','eb2'], prio:1 },

  { cat:'Moteur', titre:'1.6 THP : tendeur de chaîne', src:'Campagne PSA',
    sym:'Claquement à froid, voyant moteur.', dtc:['P0016'], sol:'Tendeur + chaîne revisités.',
    veh:{marques:['Peugeot','Citroën','DS Automobiles'], modeles:['308','3008','508','C4','C5 Aircross','DS 4','DS 7'], mot:['1.6','thp','ep6']},
    carbu:'essence', kw:['chaine','tendeur','thp','claquement','ep6'], prio:2 },

  { cat:'Transmission', titre:'Boîte EAT8 : à-coups basse vitesse', src:'TSB Stellantis',
    sym:'À-coups, vibrations en manœuvre.', dtc:[], sol:'Mise à jour logiciel boîte.',
    veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['3008','5008','308','508','208','C4','C5 Aircross','DS 7','Grandland'], mot:['eat8']},
    carbu:'all', kw:['boite','eat8','a coups','vibration'], prio:3 },

  // ----- Renault / Dacia -----
  { cat:'Injection', titre:'1.5 dCi (K9K) : injecteurs', src:'Campagnes Renault',
    sym:'Claquement diesel, fumée, ratés.', dtc:['P0201','P0203'], sol:'Injecteurs neufs + codage.',
    veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Scenic','Captur','Kadjar','Kangoo','Trafic','Duster','Sandero','Logan','Jogger'], mot:['1.5','dci','k9k']},
    carbu:'diesel', kw:['injecteur','k9k','claquement','fumee','rate'], prio:1 },

  { cat:'Moteur', titre:'1.2 TCe (H5F) : chaîne de distribution', src:'Campagnes Renault',
    sym:'Bruit de chaîne, voyant, risque casse.', dtc:['P0016'], sol:'Kit chaîne + crépine.',
    veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Captur','Kadjar','Jogger','Duster'], mot:['1.2','tce','h5f']},
    carbu:'essence', kw:['chaine','distribution','tce','h5f','bruit'], prio:1 },

  { cat:'Moteur', titre:'1.5 dCi : coussinets de bielle', src:'Problème connu K9K',
    sym:'Claquement bas moteur, casse.', dtc:[], sol:'Contrôle pression huile, coussinets.',
    veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Scenic','Captur','Kangoo','Duster','Sandero','Logan'], mot:['1.5','dci','k9k']},
    carbu:'diesel', kw:['coussinet','bielle','claquement','casse','pression huile'], prio:2 },

  { cat:'Transmission', titre:'Boîte EDC : mécatronique', src:'TSB Renault',
    sym:'À-coups, vitesses qui sautent.', dtc:['P17BF'], sol:'Mécatronique / mise à jour.',
    veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Captur','Scenic','Kadjar','Duster'], mot:['edc']},
    carbu:'all', kw:['boite','edc','mecatronique','a coups'], prio:3 },

  // ----- VAG -----
  { cat:'Moteur', titre:'TSI (EA888) : tendeur de chaîne', src:'Campagne VAG',
    sym:'Claquement à froid, voyant.', dtc:['P0016'], sol:'Tendeur revisité + chaîne.',
    veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Passat','Tiguan','A3','A4','A5','Q3','Q5','Leon','Ateca','Octavia','Superb'], mot:['1.8','2.0','tsi','ea888']},
    carbu:'essence', kw:['chaine','tendeur','tsi','ea888','claquement'], prio:1 },

  { cat:'Dépollution', titre:'2.0 TDI (EA189) : campagne NOx', src:'Campagne VAG',
    sym:'Voyant, conso, rappel constructeur.', dtc:[], sol:'Mise à jour calculateur (rappel).',
    veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Passat','Tiguan','A3','A4','Q3','Q5','Leon','Octavia'], mot:['2.0','tdi','ea189']},
    carbu:'diesel', kw:['tdi','ea189','nox','rappel','campagne'], prio:2 },

  { cat:'Refroidissement', titre:'Pompe à eau EA211 : fuite', src:'Campagne VAG',
    sym:'Fuite LDR, témoin niveau.', dtc:[], sol:'Pompe à eau revisitée.',
    veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Polo','Passat','Tiguan','A1','A3','Leon','Ibiza','Octavia','Fabia'], mot:['1.0','1.2','1.4','tsi','ea211']},
    carbu:'essence', kw:['pompe a eau','fuite','ldr','ea211'], prio:3 },

  // ----- BMW / Mercedes -----
  { cat:'Moteur', titre:'N47 / B47 : chaîne de distribution', src:'Problème connu BMW',
    sym:'Bruit métallique arrière moteur, casse.', dtc:['P0016'], sol:'Remplacement préventif chaîne complet.',
    veh:{marques:['BMW','MINI'], modeles:['Serie 1','Serie 3','Serie 5','X1','X3','X5','Cooper','Countryman'], mot:['n47','b47','2.0']},
    carbu:'diesel', kw:['chaine','distribution','n47','b47','bruit metallique','casse'], prio:0 },

  { cat:'Dépollution', titre:'N47 : refroidisseur EGR fissuré', src:'Rappel BMW',
    sym:'Fuite LDR, fumée blanche, risque incendie.', dtc:['P0401'], sol:'Remplacement refroidisseur EGR (rappel).',
    veh:{marques:['BMW','MINI'], modeles:['Serie 1','Serie 3','Serie 5','X1','X3','Cooper','Countryman'], mot:['n47','2.0']},
    carbu:'diesel', kw:['egr','refroidisseur','fuite','fumee blanche','rappel'], prio:1 },

  { cat:'Injection', titre:'OM651 : injecteurs Delphi', src:'Problème connu Mercedes',
    sym:'Fumée, claquement, retour gasoil.', dtc:['P0201'], sol:'Injecteurs + rondelles pare-feu.',
    veh:{marques:['Mercedes-Benz'], modeles:['Classe A','Classe C','Classe E','GLA','GLC'], mot:['om651','2.1','2.2','cdi']},
    carbu:'diesel', kw:['injecteur','om651','delphi','fumee','claquement'], prio:1 },

  { cat:'Dépollution', titre:'OM651 : refroidisseur EGR', src:'Rappel Mercedes',
    sym:'Fuite LDR, voyant.', dtc:['P0401'], sol:'Rappel refroidisseur EGR.',
    veh:{marques:['Mercedes-Benz'], modeles:['Classe A','Classe C','Classe E','GLA','GLC'], mot:['om651','2.1','2.2','cdi']},
    carbu:'diesel', kw:['egr','refroidisseur','fuite','rappel'], prio:2 },

  // ----- Toyota / Ford / Hyundai-Kia -----
  { cat:'Moteur', titre:'2.2 D-4D (136) : joint de culasse', src:'Problème connu Toyota',
    sym:'Surchauffe, bulles dans LDR, conso LDR.', dtc:[], sol:'Joint culasse / bloc (campagne).',
    veh:{marques:['Toyota'], modeles:['RAV4','Corolla','Hilux'], mot:['2.2','d 4d','d4d']},
    carbu:'diesel', kw:['joint culasse','surchauffe','ldr','d 4d'], prio:1 },

  { cat:'Moteur', titre:'1.0 EcoBoost : courroie immergée', src:'Campagne Ford',
    sym:'Usure courroie, débris, pompe à vide HS.', dtc:[], sol:'Kit courroie + huile spécifiée.',
    veh:{marques:['Ford'], modeles:['Fiesta','Focus','Puma','Kuga'], mot:['1.0','ecoboost']},
    carbu:'essence', kw:['courroie','distribution','ecoboost','immergee','usure'], prio:1 },

  { cat:'Moteur', titre:'Theta II : coussinets / casse moteur', src:'Rappel Hyundai-Kia',
    sym:'Claquement, casse moteur, voyant huile.', dtc:['P0520'], sol:'Campagne moteur long block.',
    veh:{marques:['Hyundai','Kia'], modeles:['Tucson','Santa Fe','Sportage','Sorento'], mot:['2.0','2.4','theta']},
    carbu:'essence', kw:['coussinet','casse','theta','claquement','huile'], prio:1 },

  // ----- FICHES GÉNÉRIQUES (base) -----
  { cat:'Injection', titre:'Pompe HP / régulation rail', src:'Panne diesel — base',
    sym:'Démarrage difficile, calage.', dtc:['P0087','P0088'], sol:'Contrôle pression rail, pompe HP.',
    veh:null, carbu:'diesel', kw:['pompe','hp','rail','pression','demarrage','calage'], prio:1 },

  { cat:'Dépollution', titre:'Vanne EGR encrassée', src:'Panne diesel — base',
    sym:'Perte puissance, ralenti instable.', dtc:['P0401','P0402'], sol:'Nettoyage/remplacement vanne EGR.',
    veh:null, carbu:'diesel', kw:['egr','vanne','ralenti','puissance','encrassee'], prio:2 },

  { cat:'Échappement', titre:'FAP colmaté', src:'Panne diesel — base',
    sym:'Voyant FAP, mode dégradé.', dtc:['P2002','P242F'], sol:'Régénération forcée, contrôle pression.',
    veh:null, carbu:'diesel', kw:['fap','filtre particules','colmate','voyant','mode degrade','dpf'], prio:3 },

  { cat:'Dépollution', titre:'Système AdBlue / SCR défaillant', src:'Panne diesel — base',
    sym:'Voyant défaut, démarrage interdit après compte à rebours.', dtc:['P20EE','P204F'], sol:'Pompe / capteur AdBlue, mise à jour calc.',
    veh:null, carbu:'diesel', kw:['adblue','scr','uree','voyant','demarrage interdit'], prio:4 },

  { cat:'Admission', titre:'Turbo : géométrie / wastegate', src:'Panne base',
    sym:'Sifflement, perte puissance, fumée.', dtc:['P0299','P0234'], sol:'Contrôle turbo, durites, remplacement.',
    veh:null, carbu:'all', kw:['turbo','sifflement','puissance','fumee','wastegate'], prio:5 },

  { cat:'Injection', titre:'Injecteurs : retour / fuite', src:'Panne diesel — base',
    sym:'Claquement, fumée noire, ratés.', dtc:['P0201','P0204'], sol:'Test retour, remplacement + codage.',
    veh:null, carbu:'diesel', kw:['injecteur','fuite','fumee noire','rate','retour'], prio:6 },

  { cat:'Moteur', titre:'Distribution : courroie (préventif)', src:'Entretien — base',
    sym:'Échéance km/ans, risque casse.', dtc:[], sol:'Kit courroie + pompe à eau.',
    veh:null, carbu:'all', kw:['courroie','distribution','entretien','kit','preventif'], prio:7 },

  { cat:'Moteur', titre:'Distribution : chaîne (préventif)', src:'Entretien — base',
    sym:'Bruit chaîne à froid, tendeur fatigué.', dtc:['P0016'], sol:'Kit chaîne + tendeur.',
    veh:null, carbu:'all', kw:['chaine','distribution','tendeur','bruit','preventif'], prio:8 },

  { cat:'Moteur', titre:'Essence : bobines / bougies', src:'Panne essence — base',
    sym:'Ratés, voyant moteur, à-coups.', dtc:['P0300','P0301'], sol:'Bobines + bougies.',
    veh:null, carbu:'essence', kw:['bobine','bougie','rate','allumage','a coups'], prio:7 },

  { cat:'Admission', titre:'Débitmètre / prise d\'air', src:'Panne base',
    sym:'Ralenti instable, trou à l\'accélération.', dtc:['P0101','P0171'], sol:'Débitmètre, durites admission.',
    veh:null, carbu:'all', kw:['debitmetre','prise air','ralenti','trou'], prio:8 },

  { cat:'Échappement', titre:'Sonde lambda / catalyseur', src:'Panne base',
    sym:'Voyant, conso, échec contrôle technique.', dtc:['P0420','P0130'], sol:'Sonde lambda / catalyseur.',
    veh:null, carbu:'all', kw:['sonde lambda','catalyseur','p0420','voyant'], prio:8 },

  { cat:'Électrique', titre:'Alternateur / circuit de charge', src:'Panne électrique — base',
    sym:'Voyant batterie, décharge, phares faibles.', dtc:['P0562'], sol:'Alternateur + courroie accessoire.',
    veh:null, carbu:'all', kw:['alternateur','batterie','charge','voyant','courroie accessoire'], prio:8 },

  { cat:'Électrique', titre:'Démarreur / solénoïde', src:'Panne base',
    sym:'Clic, ne démarre pas.', dtc:['P0615'], sol:'Démarreur / solénoïde.',
    veh:null, carbu:'all', kw:['demarreur','clic','demarre','solenoide'], prio:8 },

  { cat:'Électrique', titre:'Batterie / codage BMS', src:'Panne base',
    sym:'Démarrage difficile, voyant.', dtc:[], sol:'Batterie + codage BMS.',
    veh:null, carbu:'all', kw:['batterie','bms','demarrage','codage'], prio:9 },

  { cat:'Refroidissement', titre:'Pompe à eau / fuite LDR', src:'Panne base',
    sym:'Fuite, surchauffe, voyant température.', dtc:['P0217'], sol:'Pompe à eau + LDR.',
    veh:null, carbu:'all', kw:['pompe a eau','fuite','surchauffe','temperature','ldr'], prio:8 },

  { cat:'Freinage', titre:'Plaquettes / disques usés', src:'Entretien — base',
    sym:'Grincement, voyant frein, pédale longue.', dtc:[], sol:'Remplacement plaquettes/disques.',
    veh:null, carbu:'all', kw:['frein','plaquette','disque','grincement','pedale'], prio:9 },

  { cat:'Freinage', titre:'ABS / capteur de roue', src:'Panne base',
    sym:'Voyant ABS/ESP, perte assistance.', dtc:['C0035','C0040'], sol:'Capteur ABS / bague.',
    veh:null, carbu:'all', kw:['abs','esp','capteur','voyant','roue'], prio:9 },

  { cat:'Transmission', titre:'Embrayage / volant moteur', src:'Entretien — base',
    sym:'Patine, pédale dure, bruits.', dtc:[], sol:'Kit embrayage + volant bi-masse.',
    veh:null, carbu:'all', kw:['embrayage','volant moteur','patine','pedale','bruit'], prio:9 },

  { cat:'Transmission', titre:'Boîte double embrayage (DSG/EDC/EAT)', src:'Panne base',
    sym:'À-coups, voyant boîte, mode dégradé.', dtc:['P17BF','P0730'], sol:'Huile boîte, mécatronique, MAJ.',
    veh:null, carbu:'all', kw:['boite','dsg','edc','eat','mecatronique','a coups'], prio:9 },

  { cat:'Direction', titre:'Direction assistée / crémaillère', src:'Panne base',
    sym:'Dureté, bruit, jeu.', dtc:[], sol:'Crémaillère / pompe DA.',
    veh:null, carbu:'all', kw:['direction','cremaillere','durete','jeu','bruit'], prio:9 },

  { cat:'Entretien', titre:'Climatisation : compresseur / gaz', src:'Panne base',
    sym:'Froid insuffisant, bruit compresseur.', dtc:[], sol:'Recharge / compresseur.',
    veh:null, carbu:'all', kw:['clim','compresseur','froid','gaz','recharge'], prio:9 }
];

// Pré-calculs
FICHES.forEach(f => {
  const vehTxt = f.veh ? [f.veh.marques.join(' '), f.veh.modeles.join(' '), f.veh.mot.join(' ')].join(' ') : '';
  f._search = norm([f.titre, f.sym, f.sol, f.kw.join(' '), f.dtc.join(' '), f.cat, vehTxt].join(' '));
  f._titreN = norm(f.titre);
  f._catN = norm(f.cat).replace(/[^a-z]/g, '');
  f._label = f.veh ? `${f.veh.marques[0]} ${f.veh.modeles[0]} ${f.veh.mot[0]} — ${f.titre}` : f.titre;
});

// ============================================================
// IndexedDB
// ============================================================
class DB {
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);
      r.onerror = () => rej(r.error);
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(CONFIG.STORE)) d.createObjectStore(CONFIG.STORE, { keyPath: 'id', autoIncrement: true });
      };
    });
  }
  count() {
    return new Promise(res => {
      const t = this.db.transaction(CONFIG.STORE, 'readonly');
      const q = t.objectStore(CONFIG.STORE).count();
      q.onsuccess = () => res(q.result); q.onerror = () => res(0);
    });
  }
  seed(list) {
    return new Promise((res, rej) => {
      const t = this.db.transaction(CONFIG.STORE, 'readwrite');
      const s = t.objectStore(CONFIG.STORE);
      s.clear();
      list.forEach(f => { const { _search, _titreN, _catN, _label, ...clean } = f; s.add(clean); });
      t.oncomplete = () => res(list.length); t.onerror = () => rej(t.error);
    });
  }
}

// ============================================================
// Moteur de recherche prédictif
// ============================================================
function buildCtx(q) {
  const nq = norm(q);
  const tokens = nq.split(' ').filter(t => t.length >= 2);
  let veh = null;
  for (const v of VEH) { if ((' ' + nq + ' ').includes(' ' + v[0] + ' ')) { veh = { marque: v[1], modele: v[2] }; break; } }
  let marque = veh ? veh.marque : null;
  if (!marque) for (const m of MARQUES) { if ((' ' + nq + ' ').includes(' ' + m[0] + ' ')) { marque = m[1]; break; } }
  const cyl = tokens.find(t => /^\d\.\d$/.test(t)) || null;
  let fam = null, carbu = null;
  for (const f of FAMILLES) { if (f.tok.some(tk => tokens.includes(tk))) { fam = f.tok; carbu = f.carbu; break; } }
  if (!carbu && cyl && veh) {
    const cars = FICHES.filter(f => f.veh && f.veh.marques.includes(veh.marque) && f.veh.modeles.includes(veh.modele) && f.veh.mot.includes(cyl)).map(f => f.carbu);
    if (cars.length) carbu = cars.sort((a, b) => cars.filter(x => x === a).length - cars.filter(x => x === b).length)[0];
  }
  return { nq, tokens, veh, marque, cyl, fam, carbu };
}

function evalFiche(f, ctx) {
  if (!ctx.tokens.length) return null;
  let s = 0;
  if (ctx.veh) {
    if (f.veh) {
      const mOk = f.veh.marques.includes(ctx.veh.marque);
      const moOk = f.veh.modeles.includes(ctx.veh.modele);
      if (!(mOk && moOk)) return null;              // fiche d'un autre véhicule → écartée
      s += 60;
      if (ctx.cyl) {
        const cyls = f.veh.mot.filter(m => /^\d\.\d$/.test(m));
        if (cyls.length && !cyls.includes(ctx.cyl)) return null;  // cylindrée différente → écartée
        if (f.veh.mot.includes(ctx.cyl)) s += 30;
      }
      if (ctx.fam && f.veh.mot.some(m => ctx.fam.includes(m))) s += 20;
    } else {
      s += 25;                                       // fiche "base" applicable au véhicule détecté
      if (ctx.carbu && f.carbu && f.carbu !== 'all' && f.carbu !== ctx.carbu) return null;
    }
  } else {
    if (f.veh) {
      s += 5;
      if (ctx.marque) {
        if (!f.veh.marques.includes(ctx.marque)) return null;
        s += 25;
      }
      if (ctx.cyl) {
        const cyls = f.veh.mot.filter(m => /^\d\.\d$/.test(m));
        if (cyls.length && !cyls.includes(ctx.cyl)) return null;
        if (f.veh.mot.includes(ctx.cyl)) s += 20;
      }
    } else {
      s += 15;
      if (ctx.marque) s += 5;
      if (ctx.carbu && f.carbu && f.carbu !== 'all' && f.carbu !== ctx.carbu) return null;
    }
  }
  let hits = 0;
  ctx.tokens.forEach(tok => {
    if (f._search.includes(tok)) { s += 8; hits++; }
    if (f._titreN.includes(tok)) s += 6;
    if (f.dtc.some(d => d.toLowerCase() === tok)) s += 40;
    if (tok.length >= 3 && f.kw.some(k => k.startsWith(tok))) s += 6;
  });
  if (hits === 0 && !(ctx.veh && !f.veh) && s < 60) return null;
  return s;
}

function search(q, origFilter) {
  const ctx = buildCtx(q);
  let out = [];
  FICHES.forEach(f => {
    const s = evalFiche(f, ctx);
    if (s === null) return;
    if (origFilter && origFilter !== 'toutes' && f.veh && ORIG[f.veh.marques[0]] !== origFilter) return;
    out.push({ f, s });
  });
  out.sort((a, b) => b.s - a.s || a.f.prio - b.f.prio);
  return { ctx, results: out.slice(0, 30) };
}

function suggestions(ctx, results) {
  const sugg = [];
  const last = ctx.tokens[ctx.tokens.length - 1] || '';
  if (last.length >= 2) {
    ORGANES.forEach(o => {
      const on = norm(o);
      if (on.startsWith(last) && on !== last && sugg.length < 4) sugg.push({ type: 'terme', label: o });
    });
  }
  results.slice(0, 6).forEach(r => sugg.push({ type: 'fiche', label: r.f._label, f: r.f }));
  return sugg.slice(0, 8);
}

// ============================================================
// Rendu UI
// ============================================================
const $ = id => document.getElementById(id);
let currentOrig = 'toutes';

function hl(text, q) {
  const toks = norm(q).split(' ').filter(t => t.length >= 2);
  let out = text;
  toks.forEach(t => { out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<b>$1</b>'); });
  return out;
}

function renderResults(results, ctx, q) {
  $('resCount').textContent = results.length ? `(${results.length} résultat${results.length > 1 ? 's' : ''})` : '';
  const dB = $('detectBox');
  if (ctx.veh) {
    let label = `${ctx.veh.marque} ${ctx.veh.modele}`;
    if (ctx.cyl) label += ` ${ctx.cyl}`;
    if (ctx.carbu) label += ` (${ctx.carbu})`;
    dB.innerHTML = `<div class="detect">🚗 <b>Véhicule détecté :</b> ${label} — fiches ciblées ci-dessous.</div>`;
  } else dB.innerHTML = '';

  const box = $('resultsBox');
  if (!results.length) {
    box.innerHTML = `<div class="empty">Aucun résultat pour « ${q} ». Essayez : modèle (3008, clio…), organe (courroie, fap, egr…), DTC (p0016)…</div>`;
    return;
  }
  box.innerHTML = results.map(r => {
    const f = r.f;
    const catCls = 'cat-' + norm(f.cat).replace(/[^a-z]/g, '').replace('depollution','Depollution').replace('echappement','Echappement').replace('electrique','Electrique').replace('refroidissement','Refroidissement');
    return `
    <div class="fiche">
      <div class="f-head">
        <span class="cat ${catCls}">${f.cat}</span>
        <span class="f-titre">${hl(f.titre, q)}</span>
        <span class="f-src">${f.src}</span>
      </div>
      <div class="f-line"><span class="ico">📋</span>${f.sym}</div>
      <div class="f-line"><span class="ico">🔧</span>DTC : ${f.dtc.length ? f.dtc.join(' • ') : '—'}</div>
      <div class="f-line"><span class="ico">✅</span>${f.sol}</div>
    </div>`;
  }).join('');
}

function renderSugg(list, q) {
  const box = $('suggBox');
  if (!list.length) { box.style.display = 'none'; return; }
  box.innerHTML = list.map((s, i) => `
    <div class="sugg-item" data-i="${i}">
      <span class="s-ico">${s.type === 'terme' ? '🔤' : '🩺'}</span>
      <span>
        <div class="s-main">${hl(s.label, q)}</div>
        <div class="s-sub">${s.type === 'terme' ? 'complétion organe' : (s.f.sym)}</div>
      </span>
    </div>`).join('');
  box.style.display = 'block';
  box.querySelectorAll('.sugg-item').forEach(el => {
    el.addEventListener('mousedown', e => {
      e.preventDefault();
      const s = list[+el.dataset.i];
      $('searchInput').value = s.label;
      box.style.display = 'none';
      runSearch();
    });
  });
}

function runSearch() {
  const q = $('searchInput').value.trim();
  if (q.length < 2) {
    $('suggBox').style.display = 'none';
    $('resCount').textContent = '';
    $('detectBox').innerHTML = '';
    $('resultsBox').innerHTML = '<div class="empty">Tapez un mot-clé : marque, modèle, motorisation, organe (courroie, fap, egr…), symptôme ou code DTC.</div>';
    return;
  }
  const { ctx, results } = search(q, currentOrig);
  renderSugg(suggestions(ctx, results), q);
  renderResults(results, ctx, q);
}

// ============================================================
// Import / export
// ============================================================
const db = new DB();

function setStatus(msg, cls) { const el = $('importStatus'); el.className = 'status ' + cls; el.innerHTML = msg; }

async function importMassive() {
  const btn = $('btnImportMassive');
  try {
    btn.disabled = true; btn.textContent = '⏳ Import en cours…';
    setStatus('🔌 Connexion IndexedDB…', 'inf');
    await db.open();
    setStatus(`📦 Import de ${FICHES.length} fiches depuis appli-aide-technique…`, 'inf');
    const n = await db.seed(FICHES);
    setStatus(`✅ <b>Import réussi :</b> ${n} fiches diagnostics importées.<br>Source : <a href="${CONFIG.SOURCE_URL}" target="_blank" style="color:#93c5fd">${CONFIG.SOURCE_URL}</a>`, 'ok');
    $('ficheCount').textContent = n + ' fiches';
    $('dataVersion').textContent = '2 (import ' + new Date().toLocaleDateString('fr-FR') + ')';
    setTimeout(() => { if (confirm('Import terminé ! Recharger la page ?')) location.reload(); }, 1200);
  } catch (e) {
    setStatus('❌ Erreur import : ' + e.message, 'err');
  } finally {
    btn.disabled = false; btn.textContent = '🚀 Importer depuis appli-aide-technique';
  }
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Onglets
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tabcontent').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    $('tab-' + t.dataset.tab).classList.add('active');
  }));

  // Pills origine
  document.querySelectorAll('.pill').forEach(p => p.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    currentOrig = p.dataset.orig;
    runSearch();
  }));

  // Recherche live + prédictive
  let timer = null;
  $('searchInput').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(runSearch, 120); });
  $('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { $('suggBox').style.display = 'none'; runSearch(); }
    if (e.key === 'Escape') $('suggBox').style.display = 'none';
  });
  document.addEventListener('click', e => { if (!e.target.closest('.searchwrap')) $('suggBox').style.display = 'none'; });

  // Exemples
  document.querySelectorAll('.ex').forEach(x => x.addEventListener('click', () => {
    $('searchInput').value = x.textContent; runSearch();
  }));

  // Header
  const updNet = () => {
    const on = navigator.onLine;
    const et = (navigator.connection && navigator.connection.effectiveType) || '';
    $('netBadge').textContent = on ? ('En ligne' + (et ? ' • ' + et.toUpperCase() : ' • 4G/5G')) : 'Hors ligne';
    $('netInfo').textContent = on ? 'En ligne' : 'Hors ligne';
  };
  updNet(); window.addEventListener('online', updNet); window.addEventListener('offline', updNet);

  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; });
  $('btnInstall').addEventListener('click', async () => {
    if (deferred) { deferred.prompt(); } else alert('Installation PWA : utilisez le menu du navigateur (« Ajouter à l\'écran d\'accueil »).');
  });
  $('btnShare').addEventListener('click', async () => {
    const data = { title: 'DiagAuto Pro', url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (e) {} }
    else { try { await navigator.clipboard.writeText(location.href); alert('Lien copié !'); } catch (e) { alert(location.href); } }
  });
  $('btnLock').addEventListener('click', () => {
    const code = prompt('Code propriétaire :');
    if (code === 'DIAGAUTO-OWNER') { $('btnLock').textContent = '🔓'; alert('Mode propriétaire activé.'); }
    else if (code !== null) alert('Code invalide.');
  });

  // Admin
  $('btnImportMassive').addEventListener('click', importMassive);
  $('btnReloadData').addEventListener('click', importMassive);
  $('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(FICHES, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'diagauto-base.json'; a.click();
  });
  $('btnImportFile').addEventListener('click', () => $('fileJson').click());
  $('fileJson').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const arr = JSON.parse(await file.text());
      if (!Array.isArray(arr)) throw new Error('format invalide');
      await db.open(); await db.seed(arr);
      alert('✅ ' + arr.length + ' fiches importées depuis le fichier.');
      location.reload();
    } catch (err) { alert('❌ Fichier invalide : ' + err.message); }
  });

  // Boot : seed auto si base vide (fonctionne sans action)
  try {
    await db.open();
    const n = await db.count();
    if (n === 0) await db.seed(FICHES);
    $('ficheCount').textContent = (await db.count()) + ' fiches';
  } catch (e) { console.warn('IndexedDB indisponible, mode mémoire.', e); }
});

})();
