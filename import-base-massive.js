// ============================================================
// IMPORT-BASE-MASSIVE.JS — v9.7.0-fullcheck (FICHIER INTÉGRAL)
// CORRECTIONS v9.7 :
//  1) validatePool : allTxt NORMALISÉ (accents/Škoda) → plus de faux négatif
//  2) Checks JLR sur chaînes normées ('pompe a huile', 'equilibrage')
//  3) validatePoolDetail() expose les raisons d'échec (affichées T22)
//  4) Nouvelle génération gen-9.7 → auto-reseed IndexedDB propre
// Contient TOUT : base massive, JLR massifs, attribution réelle,
// import distant S1/S2/S3, sauvegarde locale meta.gen, recherche.
// ============================================================
(function () {
'use strict';
var VERSION = '9.7.0-fullcheck';

var CONFIG = {
  SOURCE_URL: 'https://expertkevin06-cell.github.io/appli-aide-technique/',
  JSON_ENDPOINTS: [
    'https://expertkevin06-cell.github.io/appli-aide-technique/data.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/base.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/db.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/fiches.json',
    'https://expertkevin06-cell.github.io/appli-aide-technique/pannes.json'
  ],
  MAX_REMOTE: 20000, MAX_EMBEDDED: 22000,
  LS_IMPORT: 'diagauto_last_import',
  DB_NAME: 'DiagAutoDB', DB_VERSION: 9, STORE: 'fiches'
};

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]+/g, ' ').replace(/\s+/g, ' ').trim();
}

var MARQUES_COMPLETE = [
  ['Aixam','fr'],['Alpine','fr'],['Bolloré','fr'],['Bugatti','fr'],['Citroën','fr'],['DS Automobiles','fr'],['Ligier','fr'],['Microcar','fr'],['Peugeot','fr'],['Renault','fr'],
  ['Alfa Romeo','eu'],['Aston Martin','eu'],['Audi','eu'],['Bentley','eu'],['BMW','eu'],['CUPRA','eu'],['Dacia','eu'],['Ferrari','eu'],['Fiat','eu'],['Ineos','eu'],['Jaguar','eu'],['Lamborghini','eu'],['Lancia','eu'],['Land Rover','eu'],['Lotus','eu'],['Maserati','eu'],['McLaren','eu'],['Mercedes-Benz','eu'],['MINI','eu'],['Opel','eu'],['Polestar','eu'],['Porsche','eu'],['Rolls-Royce','eu'],['Saab','eu'],['SEAT','eu'],['Škoda','eu'],['Smart','eu'],['Volkswagen','eu'],['Volvo','eu'],['Range Rover','eu'],
  ['Acura','as'],['Aion','as'],['AITO','as'],['Aiways','as'],['Arcfox','as'],['Avatr','as'],['BAIC','as'],['Baidu Jiyue','as'],['Baojun','as'],['Beijing','as'],['Bestune','as'],['Borgward','as'],['BYD','as'],['Changan','as'],['Chery','as'],['Daihatsu','as'],['Deepal','as'],['Denza','as'],['DFSK','as'],['Dongfeng','as'],['Enovate','as'],['Exeed','as'],['Fangchengbao','as'],['FAW','as'],['Forthing','as'],['GAC','as'],['Geely','as'],['Geely Galaxy','as'],['Genesis','as'],['Geometry','as'],['Great Wall','as'],['Haima','as'],['Haval','as'],['Hengchi','as'],['HiPhi','as'],['Honda','as'],['Hongqi','as'],['Hozon','as'],['Human Horizons','as'],['Hycan','as'],['Hyundai','as'],['IM Motors','as'],['Infiniti','as'],['Isuzu','as'],['JAC','as'],['Jaecoo','as'],['Jetour','as'],['Kaiyi','as'],['Kandi','as'],['Kia','as'],['Leapmotor','as'],['Lexus','as'],['Li Auto','as'],['Livan','as'],['Luxgen','as'],['Lynk & Co','as'],['Mahindra','as'],['Maxus','as'],['Mazda','as'],['MG','as'],['Mitsubishi','as'],['Neta','as'],['NIO','as'],['Nissan','as'],['Omoda','as'],['Ora','as'],['Qiantu','as'],['Qoros','as'],['Radar','as'],['Rising Auto','as'],['Roewe','as'],['SAIC','as'],['Seres','as'],['Singulato','as'],['Skyworth','as'],['Soueast','as'],['SsangYong','as'],['Subaru','as'],['Suzuki','as'],['SWM','as'],['Tank','as'],['Tata','as'],['Toyota','as'],['VinFast','as'],['Voyah','as'],['Weltmeister','as'],['Wey','as'],['WM Motor','as'],['Wuling','as'],['Xiaomi Auto','as'],['XPeng','as'],['Yangwang','as'],['Yudo','as'],['Zeekr','as'],['Zhiji Auto','as'],['Zotye','as'],
  ['Buick','us'],['Cadillac','us'],['Chevrolet','us'],['Chrysler','us'],['Dodge','us'],['Fisker','us'],['Ford','us'],['GMC','us'],['Hummer','us'],['Jeep','us'],['Lincoln','us'],['Lucid','us'],['Pontiac','us'],['Ram','us'],['Rivian','us'],['Tesla','us']
].map(function (a) { return { nom: a[0], orig: a[1] }; });

var MARQUE_ORIG = {}, NORM_ORIG = {}, MAKE_FIRST = {};
MARQUES_COMPLETE.forEach(function (m) {
  MARQUE_ORIG[m.nom] = m.orig;
  var nm = norm(m.nom); NORM_ORIG[nm] = m.orig;
  var w = nm.split(' ')[0]; (MAKE_FIRST[w] = MAKE_FIRST[w] || []).push(nm);
});

var MODELES_CATALOG = {
  'Peugeot': ['208','2008','308','3008','408','508','5008','Partner','Rifter','Expert','Boxer','e-208','e-2008','e-3008','e-308','e-5008'],
  'Citroën': ['C3','C3 Aircross','C4','C4 X','C5 Aircross','C5 X','Berlingo','Jumpy','SpaceTourer','ë-C3','ë-C4','ë-Berlingo'],
  'DS Automobiles': ['DS 3','DS 4','DS 7','DS 9','DS N°4','DS N°8'],
  'Renault': ['Clio','Megane','Scenic','Captur','Kadjar','Austral','Espace','Zoe','Twingo','Kangoo','Trafic','Master','Rafale','Symbioz','Renault 5 E-Tech','Megane E-Tech','Scenic E-Tech'],
  'Dacia': ['Sandero','Duster','Logan','Jogger','Spring','Bigster'],
  'Volkswagen': ['Polo','Golf','Passat','Tiguan','Touareg','T-Roc','Caddy','Transporter','ID.3','ID.4','ID.5','ID.7','ID.Buzz','Taigo','T-Cross'],
  'Audi': ['A1','A3','A4','A5','A6','Q2','Q3','Q4 e-tron','Q5','Q6 e-tron','Q7','Q8','e-tron','e-tron GT'],
  'BMW': ['Serie 1','Serie 2','Serie 3','Serie 4','Serie 5','Serie 7','X1','X2','X3','X4','X5','X6','X7','iX1','iX3','i4','i5','i7','iX','M3','M5'],
  'Mercedes-Benz': ['Classe A','Classe B','Classe C','Classe E','Classe S','GLA','GLB','GLC','GLE','GLS','CLA','EQE','EQS','EQA','EQB','EQC'],
  'Opel': ['Corsa','Astra','Mokka','Grandland','Insignia','Vivaro','Combo','Corsa-e','Mokka-e'],
  'SEAT': ['Ibiza','Leon','Arona','Ateca','Tarraco'],
  'CUPRA': ['Born','Formentor','Leon','Tavascan','Terramar'],
  'Škoda': ['Fabia','Octavia','Superb','Kamiq','Karoq','Kodiaq','Enyaq','Enyaq Coupé','Elroq','Scala'],
  'Porsche': ['911','718 Cayman','Macan','Cayenne','Panamera','Taycan'],
  'Volvo': ['XC40','XC60','XC90','C40','EX30','EX90','EM90','S60','S90','V60','V90'],
  'Polestar': ['Polestar 2','Polestar 3','Polestar 4'],
  'Fiat': ['500','Panda','Tipo','500X','600','Topolino','Ducato','500e'],
  'Toyota': ['Yaris','Corolla','Camry','C-HR','RAV4','Hilux','Land Cruiser','Prius','bZ4X','Aygo','Highlander','GR Yaris'],
  'Lexus': ['IS','ES','LS','NX','RX','RZ','UX','LBX','LC'],
  'Honda': ['Civic','Accord','CR-V','HR-V','Jazz','Pilot','e:Ny1','ZR-V'],
  'Nissan': ['Micra','Juke','Qashqai','X-Trail','Leaf','Ariya','Navara','Townstar'],
  'Mazda': ['Mazda2','Mazda3','Mazda6','CX-3','CX-30','CX-5','CX-60','CX-80','MX-5','MX-30'],
  'Mitsubishi': ['Space Star','ASX','Eclipse Cross','Outlander','L200','Colt'],
  'Subaru': ['Impreza','WRX','Crosstrek','Forester','Outback','Solterra'],
  'Suzuki': ['Swift','Ignis','Baleno','S-Cross','Vitara','Jimny','e Vitara'],
  'Hyundai': ['i10','i20','i30','Kona','Tucson','Santa Fe','Ioniq 5','Ioniq 6','Ioniq 9','Inster','Casper','Bayon'],
  'Kia': ['Picanto','Rio','Ceed','Stonic','Sportage','Sorento','Niro','EV6','EV9','EV5','Carnival'],
  'Ford': ['Fiesta','Focus','Puma','Kuga','Mustang Mach-E','Ranger','Transit','Explorer EV','Capri EV','Bronco'],
  'Chevrolet': ['Spark','Cruze','Bolt EV','Bolt EUV','Equinox EV','Blazer EV','Traverse','Tahoe','Silverado EV'],
  'Jeep': ['Renegade','Compass','Cherokee','Wrangler','Gladiator','Grand Cherokee','Avenger'],
  'Tesla': ['Model 3','Model 3 Highland','Model Y','Model Y Juniper','Model S','Model X','Cybertruck'],
  'BYD': ['Atto 3','Atto 2','Dolphin','Dolphin U','Seal','Seal U','Seagull','Han','Tang','Song Plus'],
  'MG': ['MG3','MG4','MG4 XPOWER','MG5','MG HS','MG ZS','MG S5','Cyberster'],
  'Chery': ['Tiggo 4','Tiggo 7','Tiggo 8','Arrizo 8','Omoda 5','Jaecoo 7'],
  'Geely': ['Coolray','Emgrand','Monjaro','Galaxy L7','Galaxy E8'],
  'Great Wall': ['Cannon','Poer','Haval H6','Tank 300','Tank 500'],
  'Xiaomi Auto': ['SU7','SU7 Ultra','YU7'],
  'NIO': ['ET7','ET5','ES6','ES8','EL7'],
  'XPeng': ['G3','G6','G9','P7','MONA M03'],
  'Zeekr': ['Zeekr 001','Zeekr 007','Zeekr 009','Zeekr X'],
  'Li Auto': ['L6','L7','L8','L9','Mega'],
  'Leapmotor': ['C01','C10','C11','T03','B10'],
  'VinFast': ['VF 5','VF 6','VF 7','VF 8','VF 9'],
  'Smart': ['Smart #1','Smart #3','Smart #5'],
  'Land Rover': ['Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport'],
  'Range Rover': ['Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','Range Rover Electric']
};

var ENG_RAW = {
  'Peugeot': [['1.2 PureTech','essence',[82,110,130],'EB2'],['1.6 PureTech','essence',[150,180],'EP6'],['1.5 BlueHDi','diesel',[100,130],'DV5'],['2.0 BlueHDi','diesel',[150,180],'DW10'],['Électrique','ev',[136,156],'BEV']],
  'Citroën': [['1.2 PureTech','essence',[82,110,130],'EB2'],['1.5 BlueHDi','diesel',[100,130],'DV5'],['2.0 BlueHDi','diesel',[150,180],'DW10'],['Électrique','ev',[136],'BEV']],
  'DS Automobiles': [['1.2 PureTech','essence',[100,130],'EB2'],['1.6 PureTech','essence',[180,225],'EP6'],['1.5 BlueHDi','diesel',[130],'DV5'],['Hybride rechargeable','hybride',[225,300],'PHEV']],
  'Opel': [['1.2 Turbo','essence',[100,130],'EB2'],['1.5 Diesel','diesel',[100,130],'DV5'],['Électrique','ev',[136],'BEV']],
  'Renault': [['1.0 TCe','essence',[90,100],'H4D'],['1.3 TCe','essence',[140,160],'H5H'],['1.5 dCi','diesel',[90,115],'K9K'],['2.0 Blue dCi','diesel',[150,180],'M9R'],['Hybride E-Tech','hybride',[145,160],'HEV'],['Électrique','ev',[130,220],'BEV']],
  'Dacia': [['1.0 TCe','essence',[90,100],'H4D'],['1.5 dCi','diesel',[95,115],'K9K'],['Électrique','ev',[65],'BEV']],
  'Volkswagen': [['1.0 TSI','essence',[95,110],'EA211'],['1.5 TSI','essence',[130,150],'EA211-Evo'],['2.0 TSI','essence',[190,245],'EA888'],['1.6 TDI','diesel',[95,115],'EA288'],['2.0 TDI','diesel',[150,190],'EA288'],['Électrique','ev',[150,204,299],'MEB']],
  'Audi': [['1.5 TFSI','essence',[150],'EA211-Evo'],['2.0 TFSI','essence',[190,245],'EA888'],['3.0 TFSI','essence',[340],'EA839'],['2.0 TDI','diesel',[150,190],'EA288-Evo'],['3.0 TDI','diesel',[286],'EA897'],['Électrique','ev',[313,408],'PPE']],
  'Škoda': [['1.0 TSI','essence',[95,110],'EA211'],['1.5 TSI','essence',[150],'EA211-Evo'],['2.0 TSI','essence',[190],'EA888'],['2.0 TDI','diesel',[150,190],'EA288'],['Électrique','ev',[150,204,299],'MEB']],
  'SEAT': [['1.0 TSI','essence',[95,110],'EA211'],['1.5 TSI','essence',[150],'EA211-Evo'],['2.0 TSI','essence',[190,245],'EA888'],['2.0 TDI','diesel',[150],'EA288']],
  'CUPRA': [['1.5 TSI','essence',[150],'EA211-Evo'],['2.0 TSI','essence',[245,300],'EA888'],['Électrique','ev',[204,231],'MEB']],
  'BMW': [['1.5 B38','essence',[136],'B38'],['2.0 B48','essence',[184,245],'B48'],['3.0 B58','essence',[340,374],'B58'],['2.0 B47','diesel',[150,190],'B47'],['3.0 B57','diesel',[286,340],'B57'],['Électrique','ev',[272,340,544],'BEV']],
  'MINI': [['1.5 B38','essence',[102,136],'B38'],['2.0 B48','essence',[178,231],'B48'],['2.0 B47','diesel',[150],'B47'],['Électrique','ev',[184],'BEV']],
  'Mercedes-Benz': [['1.3 M282','essence',[136,163],'M282'],['2.0 M264','essence',[184,258],'M264'],['3.0 M256','essence',[367,435],'M256'],['2.0 OM654','diesel',[150,194,265],'OM654'],['3.0 OM656','diesel',[286],'OM656'],['Électrique','ev',[228,333,523],'EVA']],
  'Smart': [['Électrique','ev',[272,428],'SEA']],
  'Porsche': [['2.9 V6','essence',[330,440],'V6'],['3.0 Turbo','essence',[385,440],'Flat6'],['4.0 V8','essence',[650],'V8'],['Électrique','ev',[408,761],'BEV']],
  'Volvo': [['2.0 B4','essence',[197],'B4'],['2.0 B5','essence',[250],'B5'],['2.0 B4 Diesel','diesel',[197],'B4D'],['T8 Hybride','hybride',[455],'T8'],['Électrique','ev',[238,408],'BEV']],
  'Polestar': [['Électrique','ev',[231,408,476],'BEV']],
  'Fiat': [['1.0 FireFly','essence',[70,100],'FireFly'],['1.3 FireFly','essence',[150],'FireFly-T'],['1.6 Multijet','diesel',[120,130],'Multijet'],['Électrique','ev',[118],'BEV']],
  'Toyota': [['1.0 VVT-i','essence',[72],'1KR'],['1.8 Hybrid','hybride',[122,140],'2ZR-FXE'],['2.0 Hybrid','hybride',[184,197],'M20A'],['2.5 Hybrid','hybride',[218,222],'A25A'],['2.2 D-4D','diesel',[177],'2AD'],['Électrique','ev',[204,308],'e-TNGA']],
  'Lexus': [['2.0 Hybrid','hybride',[184],'M20A'],['2.5 Hybrid','hybride',[197,218],'A25A'],['3.5 Hybrid','hybride',[313],'2GR'],['Électrique','ev',[204,544],'e-TNGA']],
  'Honda': [['1.0 VTEC Turbo','essence',[126],'P10A'],['1.5 VTEC Turbo','essence',[182,204],'L15B'],['2.0 Hybrid','hybride',[184,204],'i-MMD'],['Électrique','ev',[204],'BEV']],
  'Nissan': [['1.0 DIG-T','essence',[92,114],'HR10'],['1.3 DIG-T','essence',[140,158],'HR13'],['1.5 dCi','diesel',[110,115],'K9K'],['e-Power','hybride',[190,213],'e-Power'],['Électrique','ev',[150,242,394],'BEV']],
  'Mazda': [['1.5 Skyactiv-G','essence',[120],'SKY-G'],['2.0 Skyactiv-G','essence',[150,165],'SKY-G'],['2.5 Skyactiv-G','essence',[194],'SKY-G'],['2.2 Skyactiv-D','diesel',[150],'SKY-D'],['3.3 Skyactiv-D','diesel',[254],'SKY-D6']],
  'Mitsubishi': [['1.2 MIVEC','essence',[80],'3A92'],['2.2 DI-D','diesel',[150,177],'4N14'],['2.4 PHEV','hybride',[224,253],'PHEV']],
  'Subaru': [['2.0 Boxer','essence',[156],'FB20'],['2.5 Boxer','essence',[182],'FB25'],['2.4 Boxer Turbo','essence',[260],'FA24'],['2.0 e-Boxer','hybride',[150],'FB20H'],['Électrique','ev',[217,375],'e-TNGA']],
  'Suzuki': [['1.2 Dualjet','essence',[83,90],'K12C'],['1.4 Boosterjet','essence',[129],'K14D'],['1.5 Hybrid','hybride',[115,135],'K15B']],
  'Hyundai': [['1.0 T-GDi','essence',[100,120],'Kappa'],['1.6 T-GDi','essence',[150,180],'Smartstream'],['1.6 CRDi','diesel',[115,136],'U-II'],['2.0 CRDi','diesel',[150,185],'R-II'],['Hybride','hybride',[141,230],'Smartstream-H'],['Électrique','ev',[136,217,325,650],'E-GMP']],
  'Kia': [['1.0 T-GDi','essence',[100,120],'Kappa'],['1.6 T-GDi','essence',[150,180],'Smartstream'],['1.6 CRDi','diesel',[115,136],'U-II'],['2.0 CRDi','diesel',[150,185],'R-II'],['Hybride','hybride',[141,230],'Smartstream-H'],['Électrique','ev',[136,217,325,585],'E-GMP']],
  'Ford': [['1.0 EcoBoost','essence',[100,125,155],'EcoBoost1'],['1.5 EcoBoost','essence',[150,182],'EcoBoost15'],['2.0 EcoBoost','essence',[250],'EcoBoost2'],['1.5 TDCi','diesel',[95,120],'TDCi15'],['2.0 TDCi','diesel',[150,185,240],'TDCi20'],['Électrique','ev',[269,351,487],'BEV']],
  'Chevrolet': [['1.2 Turbo','essence',[137],'Ecotec'],['1.5 Turbo','essence',[175],'Ecotec15'],['2.0 Turbo','essence',[237],'Ecotec20'],['5.3 V8','essence',[355],'EcoTec3'],['Électrique','ev',[200,288,510,754],'Ultium']],
  'Jeep': [['1.0 FireFly','essence',[100,120],'FireFly'],['1.3 FireFly Turbo','essence',[150,180],'FireFlyT'],['2.0 Multijet','diesel',[140,170,200],'Multijet2'],['3.6 Pentastar','essence',[272,285],'Pentastar'],['4xe Hybride','hybride',[240,380],'4xe']],
  'Tesla': [['Électrique','ev',[283,346,441,615,838,1020],'BEV']],
  'BYD': [['1.5 TI','essence',[170,197],'BYD472'],['DM-i Hybride','hybride',[197,218,326],'DM-i'],['Blade Battery','ev',[150,204,313,530],'Blade-LFP']],
  'MG': [['1.5 VTi','essence',[120],'SAIC15'],['1.5 Turbo','essence',[169,173],'SAIC15T'],['2.0 Turbo','essence',[220,261],'SAIC20T'],['1.5 Hybride','hybride',[190],'MG-H'],['Électrique','ev',[170,204,435,544],'BEV']],
  'Chery': [['1.5 TGDi','essence',[147,156,181],'Acteco'],['1.6 TGDi','essence',[197],'Acteco16'],['2.0 TGDi','essence',[254],'Acteco20'],['1.5 Hybride','hybride',[245,326],'DHT']],
  'Geely': [['1.5 TGDi','essence',[150,177],'GEP3'],['2.0 TGDi','essence',[238],'GEP3-20'],['1.5 Hybride','hybride',[245],'Thor-H'],['Électrique','ev',[204,272,544],'SEA']],
  'Great Wall': [['1.5 TGDi','essence',[150,184],'GW4B15'],['2.0 TGDi','essence',[220,245],'GW4C20'],['2.0 Diesel','diesel',[163,190],'GW4D20'],['2.0 Hybride','hybride',[245,326],'Lemon-DHT']],
  'Xiaomi Auto': [['Électrique','ev',[299,673,1548],'HyperEngine']],
  'NIO': [['Électrique','ev',[435,544,653,1150],'BEV']],
  'XPeng': [['Électrique','ev',[258,313,480,540],'BEV']],
  'Zeekr': [['Électrique','ev',[272,428,544,762],'SEA']],
  'Li Auto': [['1.5 Range Extender','hybride',[330,449,544],'EREV']],
  'Leapmotor': [['Électrique','ev',[170,231,272,544],'BEV']],
  'VinFast': [['Électrique','ev',[177,201,300,402,550],'BEV']],
  'Land Rover': [
    ['2.0 Ingenium P200','essence',[200],'Ingenium-I4-P'],['2.0 Ingenium P250','essence',[249],'Ingenium-I4-P'],['2.0 Ingenium P300','essence',[300],'Ingenium-I4-P'],
    ['2.0 Ingenium D200','diesel',[200],'Ingenium-I4-D'],['2.0 Ingenium D240','diesel',[240],'Ingenium-I4-D'],
    ['3.0 I6 Ingenium P400 MHEV','essence',[400],'Ingenium-I6-P-MHEV'],['3.0 I6 Ingenium P500 MHEV','essence',[500],'Ingenium-I6-P-MHEV'],
    ['3.0 I6 Ingenium D250 MHEV','diesel',[249],'Ingenium-I6-D-MHEV'],['3.0 I6 Ingenium D300 MHEV','diesel',[300],'Ingenium-I6-D-MHEV'],['3.0 I6 Ingenium D350 MHEV','diesel',[350],'Ingenium-I6-D-MHEV'],
    ['2.0 P400e PHEV','hybride',[404],'P400e-PHEV'],
    ['3.0 V6 SC P340','essence',[340],'V6-SC'],['3.0 V6 SC P380','essence',[380],'V6-SC'],['3.0 V6 SDV6 D300','diesel',[300],'SDV6'],
    ['4.4 V8 BMW P530','essence',[530],'BMW-N63'],['5.0 V8 SC P525','essence',[525],'V8-SC-AJ'],['5.0 V8 SC P575 SVR','essence',[575],'V8-SC-AJ-SVR']
  ],
  'Range Rover': [
    ['3.0 I6 Ingenium P400 MHEV','essence',[400],'Ingenium-I6-P-MHEV'],['3.0 I6 Ingenium P500 MHEV','essence',[500],'Ingenium-I6-P-MHEV'],
    ['3.0 I6 Ingenium D250 MHEV','diesel',[249],'Ingenium-I6-D-MHEV'],['3.0 I6 Ingenium D300 MHEV','diesel',[300],'Ingenium-I6-D-MHEV'],['3.0 I6 Ingenium D350 MHEV','diesel',[350],'Ingenium-I6-D-MHEV'],
    ['4.4 V8 BMW P530','essence',[530],'BMW-N63'],['4.4 V8 BMW P615 SV','essence',[615],'BMW-S68'],
    ['5.0 V8 SC P525','essence',[525],'V8-SC-AJ'],['5.0 V8 SC P550','essence',[550],'V8-SC-AJ'],['5.0 V8 SC P575 SVR','essence',[575],'V8-SC-AJ-SVR'],
    ['2.0 P400e PHEV','hybride',[404],'P400e-PHEV'],['3.0 P440e PHEV','hybride',[440],'P440e-PHEV'],['3.0 P460e PHEV','hybride',[460],'P460e-PHEV'],['3.0 P510e PHEV','hybride',[510],'P510e-PHEV'],
    ['2.0 Ingenium P200','essence',[200],'Ingenium-I4-P'],['2.0 Ingenium P250','essence',[249],'Ingenium-I4-P'],['2.0 Ingenium P300','essence',[300],'Ingenium-I4-P'],
    ['2.0 Ingenium D200','diesel',[200],'Ingenium-I4-D'],['2.0 Ingenium D240','diesel',[240],'Ingenium-I4-D'],
    ['3.0 V6 SC P340','essence',[340],'V6-SC'],['3.0 V6 SC P380','essence',[380],'V6-SC'],['3.0 V6 SDV6 D300','diesel',[300],'SDV6'],
    ['Électrique','ev',[550],'RR-EMA']
  ],
  'Jaguar': [
    ['2.0 Ingenium P200','essence',[200],'Ingenium-I4-P'],['2.0 Ingenium P250','essence',[249],'Ingenium-I4-P'],['2.0 Ingenium P300','essence',[300],'Ingenium-I4-P'],
    ['2.0 Ingenium D200','diesel',[200],'Ingenium-I4-D'],
    ['3.0 V6 SC P340','essence',[340],'V6-SC'],['3.0 V6 SC P380','essence',[380],'V6-SC'],
    ['5.0 V8 SC P450','essence',[450],'V8-SC-AJ'],['5.0 V8 SC P575 SVR','essence',[575],'V8-SC-AJ-SVR'],
    ['Électrique I-Pace','ev',[400],'BEV-J']
  ]
};
var MOTORISATIONS_PAR_MARQUE = {};
Object.keys(ENG_RAW).forEach(function (k) {
  MOTORISATIONS_PAR_MARQUE[k] = ENG_RAW[k].map(function (a) { return { label: a[0], carbu: a[1], powers: a[2], famille: a[3] }; });
});

var EV_ONLY_RAW = [
  'e-208','e-2008','e-3008','e-308','e-5008','e-Rifter','ë-C3','ë-C4','ë-Berlingo',
  'Renault 5 E-Tech','Megane E-Tech','Scenic E-Tech','Zoe','Spring',
  'ID.3','ID.4','ID.5','ID.7','ID.Buzz','ID.2all','Q4 e-tron','Q6 e-tron','Q8 e-tron','e-tron','e-tron GT',
  'iX1','iX3','i4','i5','i7','iX','Elroq','Enyaq','Enyaq Coupé','Born','Tavascan','Taycan',
  'EX30','EX90','EM90','C40','Polestar 2','Polestar 3','Polestar 4','500e','bZ4X','e:Ny1','Leaf','Ariya','MX-30','Solterra','e Vitara',
  'Ioniq 5','Ioniq 6','Ioniq 9','Inster','EV6','EV9','EV5','Mustang Mach-E','Explorer EV','Capri EV','E-Transit',
  'Bolt EV','Bolt EUV','Equinox EV','Blazer EV','Silverado EV',
  'Model 3','Model 3 Highland','Model Y','Model Y Juniper','Model S','Model X','Cybertruck',
  'Atto 3','Atto 2','Dolphin','Dolphin U','Seal','Seal U','Seagull','MG4','MG4 XPOWER','Cyberster',
  'SU7','SU7 Ultra','YU7','ET7','ET5','ES6','ES8','EL7','G6','G9','P7','MONA M03',
  'Zeekr 001','Zeekr 007','Zeekr 009','Zeekr X','Mega','C01','C10','C11','T03','B10',
  'VF 5','VF 6','VF 7','VF 8','VF 9','Smart #1','Smart #3','Smart #5','Corsa-e','Mokka-e','Topolino','500e','Galaxy E8','MG S5','Han','Tang',
  'Range Rover Electric'
];
var HYBRID_ONLY_RAW = ['Prius'];
var ICE_ONLY_RAW = {
  '911': ['essence'], 'GR Yaris': ['essence'], 'Jimny': ['essence'], 'MX-5': ['essence'],
  'Hilux': ['diesel'], 'Land Cruiser': ['diesel', 'hybride'], 'Wrangler': ['essence', 'hybride'],
  'Corvette': ['essence'], 'Camaro': ['essence'], 'Silverado 1500': ['essence'], 'Tahoe': ['essence'], 'Traverse': ['essence'],
  'Master': ['diesel', 'ev'], 'Trafic': ['diesel', 'ev'], 'Ducato': ['diesel'], 'Transporter': ['diesel', 'essence', 'ev'],
  'Caddy': ['diesel', 'essence'], 'Sprinter': ['diesel', 'ev'], 'V-Class': ['diesel', 'ev'], 'Citan': ['diesel', 'ev'],
  'Combo': ['diesel', 'essence'], 'Vivaro': ['diesel', 'essence', 'ev'], 'Boxer': ['diesel'], 'Jumpy': ['diesel'],
  'SpaceTourer': ['diesel', 'essence'], 'Cannon': ['diesel'], 'Poer': ['diesel'],
  'Tank 300': ['essence', 'diesel', 'hybride'], 'Tank 500': ['essence', 'hybride'], 'Haval H6': ['essence', 'hybride']
};
var RESTRICTED_RAW = {
  'Megane': ['essence','diesel','hybride'], 'Scenic': ['essence','diesel','hybride'], 'Clio': ['essence','diesel','hybride'],
  'Captur': ['essence','hybride'], 'Kadjar': ['diesel','essence'], 'Austral': ['essence','hybride'], 'Espace': ['essence','hybride'],
  'Rafale': ['essence','hybride'], 'Symbioz': ['essence','hybride'], 'Kangoo': ['diesel','essence','ev'], 'Twingo': ['essence','ev'],
  '208': ['essence','diesel','ev'], '2008': ['essence','diesel','ev'], '308': ['essence','diesel','hybride'], '3008': ['essence','diesel','hybride'],
  '408': ['essence','hybride'], '508': ['diesel','hybride'], '5008': ['diesel','hybride'], 'Partner': ['diesel','ev'], 'Rifter': ['diesel','ev'],
  'Expert': ['diesel','ev'], 'Boxer': ['diesel'],
  'C3': ['essence','hybride'], 'C3 Aircross': ['essence','hybride'], 'C4': ['essence','hybride'], 'C5 Aircross': ['diesel','hybride'],
  'Berlingo': ['diesel','ev'], 'Jumpy': ['diesel','ev'],
  'Polo': ['essence'], 'Taigo': ['essence'], 'T-Cross': ['essence'], 'Golf': ['essence','diesel','hybride'], 'Passat': ['essence','diesel','hybride'],
  'Tiguan': ['essence','diesel','hybride'], 'Touareg': ['essence','diesel','hybride'], 'Caddy': ['diesel','essence'], 'Transporter': ['diesel','essence','ev'],
  'Fabia': ['essence'], 'Octavia': ['essence','diesel'], 'Superb': ['essence','diesel','hybride'], 'Kamiq': ['essence'], 'Karoq': ['essence','diesel'],
  'Kodiaq': ['essence','diesel'], 'Scala': ['essence'],
  'Ibiza': ['essence'], 'Leon': ['essence','hybride'], 'Arona': ['essence'], 'Ateca': ['essence','diesel'], 'Tarraco': ['essence','diesel'],
  'Formentor': ['essence','hybride'], 'Terramar': ['essence','hybride'],
  'A1': ['essence'], 'A3': ['essence','hybride'], 'A4': ['essence','diesel'], 'A5': ['essence','diesel'], 'A6': ['essence','diesel','hybride'],
  'Q2': ['essence'], 'Q3': ['essence','hybride'], 'Q5': ['diesel','hybride'], 'Q7': ['diesel','hybride'],
  'Serie 1': ['essence','diesel'], 'Serie 2': ['essence','diesel'], 'Serie 3': ['essence','diesel','hybride'], 'Serie 4': ['essence','diesel','hybride'],
  'Serie 5': ['essence','diesel','hybride'], 'Serie 7': ['essence','hybride'], 'X1': ['essence','diesel'], 'X2': ['essence'], 'X3': ['essence','diesel'],
  'X4': ['essence','diesel'], 'X5': ['diesel','hybride'], 'X6': ['diesel','hybride'], 'X7': ['diesel','hybride'], 'M3': ['essence'], 'M5': ['essence','hybride'],
  'Classe A': ['essence','diesel'], 'Classe B': ['essence','diesel'], 'Classe C': ['essence','diesel','hybride'], 'Classe E': ['essence','diesel','hybride'],
  'Classe S': ['essence','hybride'], 'GLA': ['essence','diesel'], 'GLB': ['essence','diesel'], 'GLC': ['diesel','hybride'], 'GLE': ['diesel','hybride'],
  'GLS': ['diesel'], 'CLA': ['essence','diesel'],
  'Corsa': ['essence'], 'Astra': ['essence','hybride'], 'Mokka': ['essence'], 'Grandland': ['essence','hybride'], 'Insignia': ['diesel','essence'],
  'Vivaro': ['diesel','ev'], 'Combo': ['diesel','essence'],
  '500': ['essence','hybride'], 'Panda': ['essence','hybride'], 'Tipo': ['diesel','essence'], '500X': ['essence','hybride'], '600': ['essence','hybride'], 'Ducato': ['diesel'],
  'XC40': ['essence','hybride'], 'XC60': ['hybride'], 'XC90': ['hybride'], 'S60': ['hybride'], 'S90': ['hybride'], 'V60': ['hybride','diesel'], 'V90': ['hybride','diesel'],
  'Macan': ['essence','ev'], 'Cayenne': ['essence','hybride'], 'Panamera': ['hybride'],
  'Yaris': ['essence','hybride'], 'Corolla': ['hybride'], 'Camry': ['hybride'], 'C-HR': ['hybride'], 'RAV4': ['hybride'], 'Aygo': ['essence'], 'Highlander': ['hybride'],
  'Civic': ['essence','hybride'], 'Accord': ['hybride'], 'CR-V': ['hybride'], 'HR-V': ['hybride'], 'Jazz': ['hybride'],
  'Qashqai': ['essence','hybride'], 'Juke': ['essence','hybride'], 'Micra': ['essence'], 'X-Trail': ['essence','hybride'], 'Navara': ['diesel'], 'Townstar': ['essence','diesel','ev'],
  'Mazda2': ['essence','hybride'], 'Mazda3': ['essence'], 'Mazda6': ['essence'], 'CX-3': ['essence'], 'CX-30': ['essence'], 'CX-5': ['diesel','essence'],
  'CX-60': ['diesel','hybride'], 'CX-80': ['diesel','hybride'],
  'Impreza': ['essence','hybride'], 'WRX': ['essence'], 'Crosstrek': ['hybride'], 'Forester': ['hybride'], 'Outback': ['essence'],
  'Swift': ['hybride'], 'Ignis': ['hybride'], 'Baleno': ['hybride'], 'S-Cross': ['hybride'], 'Vitara': ['hybride'],
  'Space Star': ['essence'], 'ASX': ['hybride'], 'Eclipse Cross': ['hybride'], 'Outlander': ['hybride'], 'L200': ['diesel'], 'Colt': ['hybride'],
  'i10': ['essence'], 'i20': ['essence','hybride'], 'i30': ['essence','hybride'], 'Kona': ['essence','hybride','ev'], 'Tucson': ['essence','hybride'],
  'Santa Fe': ['hybride'], 'Casper': ['essence','ev'], 'Bayon': ['essence','hybride'],
  'Picanto': ['essence'], 'Rio': ['essence'], 'Ceed': ['essence','hybride'], 'Stonic': ['essence','hybride'], 'Sportage': ['essence','hybride'],
  'Sorento': ['hybride'], 'Niro': ['hybride','ev'], 'Carnival': ['diesel','hybride'],
  'Fiesta': ['essence'], 'Focus': ['essence','diesel'], 'Puma': ['essence','hybride'], 'Kuga': ['essence','hybride'], 'Ranger': ['diesel'],
  'Transit': ['diesel','ev'], 'Bronco': ['essence'],
  'Renegade': ['essence','hybride'], 'Compass': ['essence','hybride'], 'Cherokee': ['essence'], 'Wrangler': ['essence','hybride'], 'Gladiator': ['diesel'],
  'Grand Cherokee': ['essence','hybride'], 'Avenger': ['essence','ev'],
  'Spark': ['essence'], 'Cruze': ['essence'], 'Traverse': ['essence'], 'Tahoe': ['essence'],
  'Song Plus': ['hybride','ev'], 'Han': ['ev'], 'Tang': ['ev'],
  'MG3': ['hybride'], 'MG5': ['essence','ev'], 'MG HS': ['essence','hybride'], 'MG ZS': ['essence','ev'], 'MG S5': ['ev'],
  'Tiggo 4': ['essence'], 'Tiggo 7': ['essence','hybride'], 'Tiggo 8': ['essence','hybride'], 'Arrizo 8': ['essence'], 'Omoda 5': ['essence','hybride'], 'Jaecoo 7': ['hybride'],
  'Coolray': ['essence'], 'Emgrand': ['essence'], 'Monjaro': ['essence','hybride'], 'Galaxy L7': ['hybride'], 'Galaxy E8': ['ev'],
  'L6': ['hybride'], 'L7': ['hybride'], 'L8': ['hybride'], 'L9': ['hybride'],
  'Defender 90': ['essence','diesel','hybride'], 'Defender 110': ['essence','diesel','hybride'], 'Defender 130': ['essence','diesel','hybride'],
  'Discovery': ['diesel','essence','hybride'], 'Discovery Sport': ['diesel','essence','hybride'],
  'Range Rover': ['essence','diesel','hybride','ev'], 'Range Rover Sport': ['essence','diesel','hybride'],
  'Range Rover Velar': ['essence','diesel','hybride'], 'Range Rover Evoque': ['essence','diesel','hybride'],
  'Range Rover Electric': ['ev']
};
var MODEL_ENERGY = {};
EV_ONLY_RAW.forEach(function (n) { MODEL_ENERGY[norm(n)] = ['ev']; });
HYBRID_ONLY_RAW.forEach(function (n) { MODEL_ENERGY[norm(n)] = ['hybride']; });
Object.keys(ICE_ONLY_RAW).forEach(function (n) { MODEL_ENERGY[norm(n)] = ICE_ONLY_RAW[n]; });
Object.keys(RESTRICTED_RAW).forEach(function (n) { MODEL_ENERGY[norm(n)] = RESTRICTED_RAW[n]; });

var PANNES = [
  { id:'fap', cat:'Échappement', carbu:['diesel'], titre:'FAP colmaté', court:'FAP colmaté', sym:'Voyant FAP, mode dégradé.', dtc:['P2002','P242F'], sol:'Régénération forcée, contrôle pression.', kw:['fap','dpf','particules','colmate'], prio:3 },
  { id:'egr', cat:'Dépollution', carbu:['diesel'], titre:'Vanne EGR encrassée', court:'Vanne EGR encrassée', sym:'Perte puissance, ralenti instable.', dtc:['P0401','P0402'], sol:'Nettoyage/remplacement vanne EGR.', kw:['egr','vanne','ralenti'], prio:2 },
  { id:'inj', cat:'Injection', carbu:['diesel'], titre:'Injecteurs : retour / fuite', court:'Injecteurs', sym:'Claquement, fumée noire, ratés.', dtc:['P0201','P0204'], sol:'Test retour, remplacement + codage.', kw:['injecteur','fuite','fumee noire'], prio:6 },
  { id:'hp', cat:'Injection', carbu:['diesel'], titre:'Pompe HP / régulation rail', court:'Pompe HP', sym:'Démarrage difficile, calage.', dtc:['P0087','P0088'], sol:'Contrôle pression rail, pompe HP.', kw:['pompe','hp','rail','pression'], prio:1 },
  { id:'adblue', cat:'Dépollution', carbu:['diesel'], titre:'Système AdBlue / SCR défaillant', court:'AdBlue / SCR', sym:'Voyant défaut, démarrage interdit après compte à rebours.', dtc:['P20EE','P204F'], sol:'Pompe / capteur AdBlue, MAJ calc.', kw:['adblue','scr','uree'], prio:4 },
  { id:'td', cat:'Admission', carbu:['diesel'], titre:'Turbo diesel : géométrie / wastegate', court:'Turbo diesel', sym:'Sifflement, perte puissance, fumée.', dtc:['P0299','P0234'], sol:'Contrôle turbo, durites, remplacement.', kw:['turbo','sifflement','wastegate'], prio:5 },
  { id:'chd', cat:'Moteur', carbu:['diesel'], titre:'Chaîne de distribution (diesel)', court:'Chaîne de distribution', sym:'Bruit métallique, casse possible.', dtc:['P0016'], sol:'Kit chaîne + tendeur + guides.', kw:['chaine','distribution','bruit'], prio:0 },
  { id:'cou', cat:'Moteur', carbu:['essence','hybride'], titre:'Courroie de distribution', court:'Courroie de distribution', sym:'Usure, risque casse, échéance km.', dtc:[], sol:'Kit courroie + pompe à eau.', kw:['courroie','distribution','usure'], prio:1 },
  { id:'bob', cat:'Moteur', carbu:['essence','hybride'], titre:'Bobines / bougies (ratés)', court:'Bobines / bougies', sym:'Ratés, voyant moteur, à-coups.', dtc:['P0300','P0301'], sol:'Bobines + bougies.', kw:['bobine','bougie','rate','allumage'], prio:7 },
  { id:'te', cat:'Admission', carbu:['essence','hybride'], titre:'Turbo essence / wastegate', court:'Turbo essence', sym:'Perte puissance, sifflement.', dtc:['P0299'], sol:'Contrôle turbo + durites.', kw:['turbo','wastegate','puissance'], prio:5 },
  { id:'che', cat:'Moteur', carbu:['essence'], titre:'Chaîne de distribution (essence)', court:'Chaîne de distribution', sym:'Bruit chaîne à froid, tendeur fatigué.', dtc:['P0016'], sol:'Kit chaîne + tendeur.', kw:['chaine','distribution','tendeur'], prio:0 },
  { id:'bht', cat:'Électrique', carbu:['ev'], titre:'Batterie HT / BMS véhicule électrique', court:'Batterie HT', sym:'Perte autonomie, voyant HV, recharge lente.', dtc:['P0A80'], sol:'Diagnostic modules HT, équilibrage.', kw:['batterie','ht','bms','electrique'], prio:2 },
  { id:'rec', cat:'Électrique', carbu:['ev'], titre:'Recharge / chargeur embarqué', court:'Recharge / chargeur', sym:'Recharge impossible, coupures.', dtc:[], sol:'Contrôle chargeur, câble, borne.', kw:['recharge','chargeur','borne'], prio:3 },
  { id:'bhv', cat:'Électrique', carbu:['hybride'], titre:'Batterie hybride / ventilation', court:'Batterie hybride', sym:'Voyant HV, perte mode EV.', dtc:['P0A80','P0C00'], sol:'Modules HV, ventilation batterie.', kw:['batterie','hybride','ventilation'], prio:2 },
  { id:'alt', cat:'Électrique', carbu:['all'], titre:'Alternateur / circuit de charge', court:'Alternateur', sym:'Voyant batterie, décharge, phares faibles.', dtc:['P0562'], sol:'Alternateur + courroie accessoire.', kw:['alternateur','charge','voyant'], prio:8 },
  { id:'dem', cat:'Électrique', carbu:['all'], titre:'Démarreur / solénoïde', court:'Démarreur', sym:'Clic, ne démarre pas.', dtc:['P0615'], sol:'Démarreur / solénoïde.', kw:['demarreur','clic','demarre'], prio:8 },
  { id:'bat', cat:'Électrique', carbu:['all'], titre:'Batterie 12V / codage BMS', court:'Batterie 12V', sym:'Démarrage difficile, voyant.', dtc:[], sol:'Batterie + codage BMS.', kw:['batterie','bms','demarrage'], prio:9 },
  { id:'pea', cat:'Refroidissement', carbu:['all'], titre:'Pompe à eau / fuite LDR', court:'Pompe à eau', sym:'Fuite, surchauffe, voyant température.', dtc:['P0217'], sol:'Pompe à eau + LDR.', kw:['pompe a eau','fuite','surchauffe'], prio:8 },
  { id:'rad', cat:'Refroidissement', carbu:['all'], titre:'Radiateur / thermostat', court:'Radiateur / thermostat', sym:'Surchauffe, ventilateur permanent.', dtc:['P0217'], sol:'Radiateur, thermostat, LDR.', kw:['radiateur','thermostat','surchauffe'], prio:8 },
  { id:'plq', cat:'Freinage', carbu:['all'], titre:'Plaquettes / disques usés', court:'Plaquettes / disques', sym:'Grincement, voyant frein, pédale longue.', dtc:[], sol:'Remplacement plaquettes/disques.', kw:['frein','plaquette','disque'], prio:9 },
  { id:'abs', cat:'Freinage', carbu:['all'], titre:'ABS / capteur de roue', court:'ABS / capteur', sym:'Voyant ABS/ESP, perte assistance.', dtc:['C0035','C0040'], sol:'Capteur ABS / bague.', kw:['abs','esp','capteur'], prio:9 },
  { id:'emb', cat:'Transmission', carbu:['all'], titre:'Embrayage / volant moteur', court:'Embrayage / volant', sym:'Patine, pédale dure, bruits.', dtc:[], sol:'Kit embrayage + volant bi-masse.', kw:['embrayage','volant moteur','patine'], prio:9 },
  { id:'bot', cat:'Transmission', carbu:['all'], titre:'Boîte : à-coups / mécatronique', court:'Boîte :', sym:'À-coups, voyant boîte, mode dégradé.', dtc:['P17BF','P0730'], sol:'Huile boîte, mécatronique, MAJ.', kw:['boite','mecatronique','a coups'], prio:9 },
  { id:'dir', cat:'Direction', carbu:['all'], titre:'Direction assistée / crémaillère', court:'Direction assistée', sym:'Dureté, bruit, jeu.', dtc:[], sol:'Crémaillère / pompe DA.', kw:['direction','cremaillere','durete'], prio:9 },
  { id:'cli', cat:'Entretien', carbu:['all'], titre:'Climatisation : compresseur / gaz', court:'Climatisation', sym:'Froid insuffisant, bruit compresseur.', dtc:[], sol:'Recharge / compresseur.', kw:['clim','compresseur','froid'], prio:9 },
  { id:'lam', cat:'Échappement', carbu:['all'], titre:'Sonde lambda / catalyseur', court:'Sonde lambda', sym:'Voyant, conso, échec contrôle technique.', dtc:['P0420','P0130'], sol:'Sonde lambda / catalyseur.', kw:['sonde lambda','catalyseur','p0420'], prio:8 },
  { id:'dbm', cat:'Admission', carbu:['all'], titre:'Débitmètre / prise d\'air', court:'Débitmètre', sym:'Ralenti instable, trou à l\'accélération.', dtc:['P0101','P0171'], sol:'Débitmètre, durites admission.', kw:['debitmetre','prise air','ralenti'], prio:8 },
  { id:'sus', cat:'Suspension', carbu:['all'], titre:'Amortisseurs / rotules / silentblocs', court:'Amortisseurs / rotules', sym:'Bruit, jeu, tenue de route.', dtc:[], sol:'Remplacement + géométrie.', kw:['amortisseur','rotule','silentbloc'], prio:9 }
];
var PANNE_BY_ID = {};
PANNES.forEach(function (p) { PANNE_BY_ID[p.id] = p; });

function computeOrig(f) {
  if (f.veh) return MARQUE_ORIG[f.veh.marques[0]] || null;
  var ml = f.marqueLibre || '';
  if (!ml) return null;
  var cands = MAKE_FIRST[ml.split(' ')[0]] || [];
  for (var i = 0; i < cands.length; i++) {
    var nm = cands[i];
    if (ml === nm || ml.indexOf(nm + ' ') === 0) return NORM_ORIG[nm];
  }
  return null;
}
function prepFiche(f, remote) {
  var vehTxt = f.veh ? [f.veh.marques.join(' '), f.veh.modeles.join(' '), f.veh.mot.join(' ')].join(' ') : '';
  f._search = norm([f.titre, f.sym, f.sol, f.kw.join(' '), f.dtc.join(' '), f.cat, vehTxt, f.marqueLibre || ''].join(' '));
  f._titreN = norm(f.titre);
  f._catN = norm(f.cat).replace(/[^a-z]/g, '');
  f._label = f.veh ? (f.veh.marques[0] + ' ' + f.veh.modeles[0] + ' ' + f.veh.mot[0] + ' — ' + f.titre) : f.titre;
  f._key = norm(f.titre) + '|' + (f.veh ? norm(f.veh.marques[0]) + '|' + norm(f.veh.modeles[0]) : norm(f.marqueLibre || ''));
  f._orig = computeOrig(f);
  f._remote = !!remote;
}

var FICHES_CURATED = [
  { cat:'Moteur', titre:'1.5 BlueHDi (DV5) : chaîne arbre à cames', src:'Campagnes Stellantis', sym:'Bruit métallique, casse.', dtc:['P0016'], sol:'Chaîne renforcée.', veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['3008','5008','208','2008','308','408','508','Partner','Rifter','C3 Aircross','C4','Berlingo','DS 3','DS 4','Grandland','Astra'], mot:['1.5','bluehdi','dv5']}, carbu:'diesel', kw:['chaine','distribution','arbre a cames','bruit metallique','casse','dv5'], prio:0 },
  { cat:'Moteur', titre:'1.2 PureTech : courroie de distribution humide', src:'Campagnes Stellantis', sym:'Usure prématurée, débris dans l\'huile, voyant.', dtc:['P0016'], sol:'Courroie revisitée + intervalle 60 000 km.', veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['208','2008','308','3008','C3','C3 Aircross','C4','C5 Aircross','DS 3','DS 4','Corsa','Mokka'], mot:['1.2','puretech','eb2']}, carbu:'essence', kw:['courroie','distribution','puretech','humide','usure','eb2'], prio:1 },
  { cat:'Moteur', titre:'1.6 THP : tendeur de chaîne', src:'Campagne PSA', sym:'Claquement à froid, voyant moteur.', dtc:['P0016'], sol:'Tendeur + chaîne revisités.', veh:{marques:['Peugeot','Citroën','DS Automobiles'], modeles:['308','3008','508','C4','C5 Aircross','DS 4','DS 7'], mot:['1.6','thp','ep6']}, carbu:'essence', kw:['chaine','tendeur','thp','claquement','ep6'], prio:2 },
  { cat:'Transmission', titre:'Boîte EAT8 : à-coups basse vitesse', src:'TSB Stellantis', sym:'À-coups, vibrations en manœuvre.', dtc:[], sol:'Mise à jour logiciel boîte.', veh:{marques:['Peugeot','Citroën','DS Automobiles','Opel'], modeles:['3008','5008','308','508','208','C4','C5 Aircross','DS 7','Grandland'], mot:['eat8']}, carbu:'all', kw:['boite','eat8','a coups','vibration'], prio:3 },
  { cat:'Injection', titre:'1.5 dCi (K9K) : injecteurs', src:'Campagnes Renault', sym:'Claquement diesel, fumée, ratés.', dtc:['P0201','P0203'], sol:'Injecteurs neufs + codage.', veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Scenic','Captur','Kadjar','Kangoo','Trafic','Duster','Sandero','Logan','Jogger'], mot:['1.5','dci','k9k']}, carbu:'diesel', kw:['injecteur','k9k','claquement','fumee','rate'], prio:1 },
  { cat:'Moteur', titre:'1.2 TCe (H5F) : chaîne de distribution', src:'Campagnes Renault', sym:'Bruit de chaîne, voyant, risque casse.', dtc:['P0016'], sol:'Kit chaîne + crépine.', veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Captur','Kadjar','Jogger','Duster'], mot:['1.2','tce','h5f']}, carbu:'essence', kw:['chaine','distribution','tce','h5f','bruit'], prio:1 },
  { cat:'Moteur', titre:'1.5 dCi : coussinets de bielle', src:'Problème connu K9K', sym:'Claquement bas moteur, casse.', dtc:[], sol:'Contrôle pression huile, coussinets.', veh:{marques:['Renault','Dacia'], modeles:['Clio','Megane','Scenic','Captur','Kangoo','Duster','Sandero','Logan'], mot:['1.5','dci','k9k']}, carbu:'diesel', kw:['coussinet','bielle','claquement','casse','pression huile'], prio:2 },
  { cat:'Moteur', titre:'TSI (EA888) : tendeur de chaîne', src:'Campagne VAG', sym:'Claquement à froid, voyant.', dtc:['P0016'], sol:'Tendeur revisité + chaîne.', veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Passat','Tiguan','A3','A4','A5','Q3','Q5','Leon','Ateca','Octavia','Superb','Enyaq','Elroq','Fabia'], mot:['1.8','2.0','tsi','ea888']}, carbu:'essence', kw:['chaine','tendeur','tsi','ea888','claquement'], prio:1 },
  { cat:'Dépollution', titre:'2.0 TDI (EA189) : campagne NOx', src:'Campagne VAG', sym:'Voyant, conso, rappel constructeur.', dtc:[], sol:'Mise à jour calculateur (rappel).', veh:{marques:['Volkswagen','Audi','SEAT','Škoda'], modeles:['Golf','Passat','Tiguan','A3','A4','Q3','Q5','Leon','Octavia','Elroq','Enyaq'], mot:['2.0','tdi','ea189']}, carbu:'diesel', kw:['tdi','ea189','nox','rappel','campagne'], prio:2 },
  { cat:'Moteur', titre:'N47 / B47 : chaîne de distribution', src:'Problème connu BMW', sym:'Bruit métallique arrière moteur, casse.', dtc:['P0016'], sol:'Remplacement préventif chaîne complet.', veh:{marques:['BMW','MINI'], modeles:['Serie 1','Serie 3','Serie 5','X1','X3','X5','Cooper','Countryman'], mot:['n47','b47','2.0']}, carbu:'diesel', kw:['chaine','distribution','n47','b47','bruit metallique','casse'], prio:0 },
  { cat:'Dépollution', titre:'N47 : refroidisseur EGR fissuré', src:'Rappel BMW', sym:'Fuite LDR, fumée blanche, risque incendie.', dtc:['P0401'], sol:'Remplacement refroidisseur EGR (rappel).', veh:{marques:['BMW','MINI'], modeles:['Serie 1','Serie 3','Serie 5','X1','X3','Cooper','Countryman'], mot:['n47','2.0']}, carbu:'diesel', kw:['egr','refroidisseur','fuite','fumee blanche','rappel'], prio:1 },
  { cat:'Injection', titre:'OM651 : injecteurs Delphi', src:'Problème connu Mercedes', sym:'Fumée, claquement, retour gasoil.', dtc:['P0201'], sol:'Injecteurs + rondelles pare-feu.', veh:{marques:['Mercedes-Benz'], modeles:['Classe A','Classe C','Classe E','GLA','GLC'], mot:['om651','2.1','2.2','cdi']}, carbu:'diesel', kw:['injecteur','om651','delphi','fumee','claquement'], prio:1 },
  { cat:'Moteur', titre:'2.2 D-4D (136) : joint de culasse', src:'Problème connu Toyota', sym:'Surchauffe, bulles dans LDR, conso LDR.', dtc:[], sol:'Joint culasse / bloc (campagne).', veh:{marques:['Toyota'], modeles:['RAV4','Corolla','Hilux'], mot:['2.2','d 4d','d4d']}, carbu:'diesel', kw:['joint culasse','surchauffe','ldr','d 4d'], prio:1 },
  { cat:'Moteur', titre:'1.0 EcoBoost : courroie immergée', src:'Campagne Ford', sym:'Usure courroie, débris, pompe à vide HS.', dtc:[], sol:'Kit courroie + huile spécifiée.', veh:{marques:['Ford'], modeles:['Fiesta','Focus','Puma','Kuga'], mot:['1.0','ecoboost']}, carbu:'essence', kw:['courroie','distribution','ecoboost','immergee','usure'], prio:1 },
  { cat:'Moteur', titre:'Theta II : coussinets / casse moteur', src:'Rappel Hyundai-Kia', sym:'Claquement, casse moteur, voyant huile.', dtc:['P0520'], sol:'Campagne moteur long block.', veh:{marques:['Hyundai','Kia'], modeles:['Tucson','Santa Fe','Sportage','Sorento'], mot:['2.0','2.4','theta']}, carbu:'essence', kw:['coussinet','casse','theta','claquement','huile'], prio:1 },
  { cat:'Électrique', titre:'Škoda Elroq : batterie HT / autonomie', src:'VAG MEB — EV récent', sym:'Autonomie en baisse, voyant HV, cellules déséquilibrées.', dtc:['P0A80','P0A1F'], sol:'Diagnostic modules HT, équilibrage, vérif BMS.', veh:{marques:['Škoda'], modeles:['Elroq','Enyaq','Enyaq Coupé'], mot:['électrique','ht','bev']}, carbu:'ev', kw:['batterie','ht','autonomie','elroq','enyaq','bms'], prio:2 },
  { cat:'Électrique', titre:'Škoda Elroq : recharge lente / chargeur embarqué', src:'VAG MEB', sym:'Recharge AC lente, coupures, défaut chargeur.', dtc:['P0CF0','P0C79'], sol:'Contrôle chargeur embarqué, câble type 2, borne.', veh:{marques:['Škoda'], modeles:['Elroq','Enyaq'], mot:['électrique','chargeur']}, carbu:'ev', kw:['recharge','chargeur','elroq','borne','type 2'], prio:3 },
  { cat:'Électrique', titre:'Renault 5 E-Tech / Megane E-Tech : batterie LFP', src:'Renault AmpR Small', sym:'Autonomie, calibration BMS, préconditionnement.', dtc:['P0A80'], sol:'Calibration BMS, MAJ logicielle, préchauffage.', veh:{marques:['Renault'], modeles:['Renault 5 E-Tech','Megane E-Tech','Scenic E-Tech'], mot:['électrique','lfp']}, carbu:'ev', kw:['batterie','lfp','bms','renault 5','megane e tech'], prio:2 },
  { cat:'Électrique', titre:'Tesla Model 3 Highland / Model Y Juniper : 12V LiFePO4', src:'Tesla', sym:'Batterie 12V faible, défauts électroniques.', dtc:['P0562'], sol:'Remplacement batterie 12V LiFePO4 OEM.', veh:{marques:['Tesla'], modeles:['Model 3','Model 3 Highland','Model Y','Model Y Juniper'], mot:['électrique','12v']}, carbu:'ev', kw:['batterie','12v','lifepo4','tesla'], prio:8 },
  { cat:'Électrique', titre:'BYD Seal U / Atto 3 : Blade Battery', src:'BYD', sym:'Équilibrage modules, perte autonomie.', dtc:['P0A80'], sol:'Équilibrage cellules Blade, diag BMS.', veh:{marques:['BYD'], modeles:['Atto 3','Atto 2','Seal','Seal U','Dolphin','Dolphin U'], mot:['électrique','blade']}, carbu:'ev', kw:['batterie','blade','bms','byd','seal u','atto 3'], prio:2 },
  { cat:'Moteur', titre:'2.0 Ingenium (AJ200) : chaîne de distribution / tendeur', src:'TSB JLR connu', sym:'Bruit métallique à froid, claquement, risque casse moteur.', dtc:['P0016','P0017'], sol:'Remplacement kit chaîne complet (tendeur, guides, chaîne) + crépine + vidange.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','E-Pace','XE','XF'], mot:['2.0','ingenium','aj200','p200','p250','p300','d200','d240']}, carbu:'all', kw:['chaine','distribution','tendeur','ingenium','aj200','claquement','casse'], prio:0 },
  { cat:'Moteur', titre:'2.0 Ingenium : chaîne pompe à huile / arbre d\'équilibrage', src:'Campagne JLR', sym:'Bruit sourd bas moteur, pression huile faible, casse possible.', dtc:['P0520','P0522'], sol:'Kit chaîne pompe à huile + arbre d\'équilibrage + crépine.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover Velar','Range Rover Evoque','F-Pace','E-Pace','XE','XF'], mot:['2.0','ingenium','aj200']}, carbu:'all', kw:['chaine','pompe huile','arbre equilibrage','pression huile','ingenium'], prio:0 },
  { cat:'Admission', titre:'2.0 Ingenium : turbo wastegate / actuateur', src:'TSB JLR', sym:'Sifflement, perte puissance, mode dégradé.', dtc:['P0299','P0234'], sol:'Actuateur turbo wastegate + contrôle durites.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','E-Pace','XE','XF'], mot:['2.0','ingenium','p200','p250','p300']}, carbu:'all', kw:['turbo','wastegate','actuateur','sifflement','ingenium'], prio:4 },
  { cat:'Dépollution', titre:'2.0 Ingenium Diesel : vanne EGR colmatée', src:'Problème connu AJ200D', sym:'Perte puissance, ralenti instable, fumée noire.', dtc:['P0401','P0402','P0404'], sol:'Nettoyage / remplacement EGR + refroidisseur.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','E-Pace','XE','XF'], mot:['2.0','ingenium','d200','d240','d180']}, carbu:'diesel', kw:['egr','vanne','colmate','ralenti','ingenium'], prio:2 },
  { cat:'Échappement', titre:'2.0 Ingenium Diesel : FAP colmaté / régénération', src:'TSB JLR', sym:'Voyant FAP, mode dégradé, consommation élevée.', dtc:['P2002','P242F','P2463'], sol:'Régénération forcée + sonde pression + contrôle additif.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','E-Pace','XE','XF'], mot:['2.0','ingenium','d200','d240']}, carbu:'diesel', kw:['fap','dpf','colmate','regenération','ingenium'], prio:3 },
  { cat:'Injection', titre:'2.0 Ingenium : injecteurs / pompe HP', src:'Problème connu AJ200', sym:'Ratés, claquement, perte puissance.', dtc:['P0201','P0202','P0087'], sol:'Diagnostic injecteurs + pompe HP + codage.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','E-Pace','XE','XF'], mot:['2.0','ingenium']}, carbu:'all', kw:['injecteur','pompe hp','rail','claquement','ingenium'], prio:5 },
  { cat:'Moteur', titre:'3.0 V6 SC (AJ126/AJ206) : rupture chaîne distribution', src:'Campagne JLR', sym:'Bruit métallique fort, calage, casse moteur.', dtc:['P0016','P0017','P0018'], sol:'Kit chaînes + tendeurs + guides complet (opération lourde).', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','Discovery','Discovery Sport','Range Rover Velar','F-Pace','XE','XF','XJ','F-Type'], mot:['3.0','v6','sc','aj126','aj206','p340','p380']}, carbu:'essence', kw:['chaine','distribution','rupture','v6','aj126','aj206'], prio:0 },
  { cat:'Moteur', titre:'3.0 V6 SC : rupture poulie vilebrequin / damper', src:'Campagne JLR', sym:'Bruit claquement avant, vibration, arrêt moteur.', dtc:[], sol:'Poulie damper + courroies accessoires + contrôle vilebrequin.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','Discovery','Discovery Sport','Range Rover Velar','F-Pace','XE','XF','XJ'], mot:['3.0','v6','sc']}, carbu:'essence', kw:['poulie','damper','vilebrequin','rupture','v6'], prio:0 },
  { cat:'Refroidissement', titre:'3.0 V6 SC : surchauffe / joint collecteur admission', src:'TSB JLR', sym:'Surchauffe, fuite LDR, voyant température.', dtc:['P0217'], sol:'Collecteur admission + joints + pompe à eau + thermostat.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','Discovery','Discovery Sport','Range Rover Velar','F-Pace'], mot:['3.0','v6','sc']}, carbu:'essence', kw:['surchauffe','collecteur','joint','fuite ldr','v6'], prio:2 },
  { cat:'Admission', titre:'3.0 V6 SC : compresseur / actuateur SC', src:'TSB JLR', sym:'Perte suralimentation, sifflement, puissance.', dtc:['P0299'], sol:'Diagnostic compresseur + embrayage SC + durites.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','Discovery','Discovery Sport','F-Pace','XE','XF','F-Type'], mot:['3.0','v6','sc']}, carbu:'essence', kw:['compresseur','supercharge','sc','v6','sifflement'], prio:4 },
  { cat:'Moteur', titre:'3.0 I6 Ingenium MHEV : chaîne distribution', src:'Problème connu JLR', sym:'Bruit métallique, déphasage arbres, voyant.', dtc:['P0016','P0017'], sol:'Kit chaînes + tendeurs (opération longue, accès complexe).', veh:{marques:['Land Rover','Range Rover'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar'], mot:['3.0','i6','ingenium','p400','p500','d250','d300','d350','mhev']}, carbu:'all', kw:['chaine','distribution','i6','ingenium','mhev'], prio:0 },
  { cat:'Électrique', titre:'3.0 I6 Ingenium MHEV : batterie 48V / ISG', src:'TSB JLR', sym:'Voyant MHEV, défaut ISG, mode dégradé.', dtc:['P0A0F','P0A1F'], sol:'Diagnostic batterie 48V + ISG + convertisseur DC/DC.', veh:{marques:['Land Rover','Range Rover'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar'], mot:['3.0','i6','mhev','p400','d250','d300','d350']}, carbu:'hybride', kw:['mhev','batterie 48v','isg','ingenium'], prio:3 },
  { cat:'Moteur', titre:'5.0 V8 SC : chaînes distribution / tendeurs', src:'Campagne JLR', sym:'Bruit claquement à froid, déphasage, casse moteur.', dtc:['P0011','P0014','P0016'], sol:'Kit 4 chaînes + tendeurs + guides (main d\'œuvre lourde).', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','Range Rover Sport SVR','F-Pace','F-Pace SVR','F-Type','XJ'], mot:['5.0','v8','sc','aj133','p525','p550','p575','svr']}, carbu:'essence', kw:['chaine','distribution','tendeur','v8','svr','aj133'], prio:0 },
  { cat:'Refroidissement', titre:'5.0 V8 SC : pompe à eau / fuite LDR', src:'Problème connu AJ133', sym:'Surchauffe, fuite LDR, bruit pompe.', dtc:['P0217'], sol:'Pompe à eau + joints + thermostat + vidange LDR.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','F-Pace','F-Type','XJ'], mot:['5.0','v8','sc','aj133']}, carbu:'essence', kw:['pompe a eau','fuite ldr','surchauffe','v8'], prio:3 },
  { cat:'Admission', titre:'5.0 V8 SC : compresseur Eaton / embrayage', src:'TSB JLR', sym:'Bruit, perte suralimentation, à-coups.', dtc:['P0299'], sol:'Embrayage compresseur SC + diagnostic Eaton.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','F-Pace','F-Pace SVR','F-Type'], mot:['5.0','v8','sc','svr']}, carbu:'essence', kw:['compresseur','sc','eaton','embrayage','v8','svr'], prio:4 },
  { cat:'Moteur', titre:'5.0 V8 SC : consommation huile / segments', src:'Problème connu V8 JLR', sym:'Consommation huile élevée, fumée bleue, niveau bas.', dtc:[], sol:'Diagnostic consommation huile, segments, reniflard.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Range Rover','Range Rover Sport','F-Pace','F-Type','XJ'], mot:['5.0','v8','sc']}, carbu:'essence', kw:['consommation huile','segments','reniflard','v8'], prio:5 },
  { cat:'Moteur', titre:'4.4 V8 BMW N63/S68 : chaînes distribution', src:'Problème connu N63/S68', sym:'Bruit métallique, déphasage, casse possible.', dtc:['P0011','P0014'], sol:'Kit chaînes + tendeurs BMW OEM + huile spécifiée.', veh:{marques:['Range Rover'], modeles:['Range Rover','Range Rover Sport'], mot:['4.4','v8','n63','s68','p530','p615','sv']}, carbu:'essence', kw:['chaine','distribution','v8','n63','s68','bmw','p530','p615'], prio:0 },
  { cat:'Refroidissement', titre:'4.4 V8 BMW : surchauffe / fuite LDR', src:'TSB JLR/BMW', sym:'Surchauffe, voyant, consommation LDR.', dtc:['P0217'], sol:'Diagnostic circuit refroidissement, pompe, thermostat, joints.', veh:{marques:['Range Rover'], modeles:['Range Rover','Range Rover Sport'], mot:['4.4','v8','n63','s68','p530','p615']}, carbu:'essence', kw:['surchauffe','ldr','fuite','v8','n63','s68'], prio:3 },
  { cat:'Moteur', titre:'4.4 V8 BMW : consommation huile excessive', src:'Problème connu N63', sym:'Conso huile, fumée bleue, catalyseur.', dtc:[], sol:'Segments, reniflard, turbos, diagnostic complet.', veh:{marques:['Range Rover'], modeles:['Range Rover','Range Rover Sport'], mot:['4.4','v8','n63','p530']}, carbu:'essence', kw:['consommation huile','v8','n63','bmw','fumee bleue'], prio:4 },
  { cat:'Admission', titre:'4.4 V8 BMW : turbos / wastegate', src:'Problème N63', sym:'Perte puissance, défaut suralimentation.', dtc:['P0299','P0234'], sol:'Diagnostic turbos + actuateurs wastegate.', veh:{marques:['Range Rover'], modeles:['Range Rover','Range Rover Sport'], mot:['4.4','v8','n63','s68']}, carbu:'essence', kw:['turbo','wastegate','v8','n63','suralimentation'], prio:4 },
  { cat:'Électrique', titre:'P400e PHEV : batterie HT / perte autonomie', src:'TSB JLR', sym:'Autonomie EV en baisse, voyant HV, déséquilibre cellules.', dtc:['P0A80','P0A1F','P0A0F'], sol:'Diagnostic modules HT, équilibrage, vérification BMS.', veh:{marques:['Land Rover','Range Rover'], modeles:['Range Rover','Range Rover Sport','Range Rover Velar','Discovery','Discovery Sport','F-Pace'], mot:['p400e','p440e','p460e','p510e','phev']}, carbu:'hybride', kw:['batterie','ht','autonomie','p400e','p440e','p460e','phev','bms'], prio:2 },
  { cat:'Électrique', titre:'P400e PHEV : chargeur embarqué / défaut recharge', src:'TSB JLR', sym:'Recharge AC impossible, défaut chargeur, coupures.', dtc:['P0CF0','P0C79'], sol:'Contrôle chargeur embarqué + câble + borne + MAJ logicielle.', veh:{marques:['Land Rover','Range Rover'], modeles:['Range Rover','Range Rover Sport','Range Rover Velar','Discovery','Discovery Sport','F-Pace'], mot:['p400e','p440e','p460e','phev']}, carbu:'hybride', kw:['recharge','chargeur','p400e','phev','borne','defaut'], prio:3 },
  { cat:'Électrique', titre:'P400e PHEV : système haute tension / onduleur', src:'TSB JLR', sym:'Voyant système HT, mode dégradé, refus EV.', dtc:['P0A0F','P0A80'], sol:'Diagnostic onduleur + câblage HT + isolation.', veh:{marques:['Land Rover','Range Rover'], modeles:['Range Rover','Range Rover Sport','Range Rover Velar','Discovery','Discovery Sport'], mot:['p400e','phev']}, carbu:'hybride', kw:['ht','onduleur','p400e','isolation','phev'], prio:2 },
  { cat:'Transmission', titre:'Boîte ZF 8HP : à-coups / mécatronique', src:'TSB JLR', sym:'À-coups basse vitesse, mode dégradé boîte, voyant.', dtc:['P17BF','P0730','P0731'], sol:'Huile ZF Lifeguard 8 + MAJ logicielle + diagnostic mécatronique.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','XE','XF','F-Type','XJ'], mot:['zf','8hp','8 speed','automatique']}, carbu:'all', kw:['boite','zf','8hp','mecatronique','a coups','automatique'], prio:5 },
  { cat:'Transmission', titre:'Boîte ZF 8HP : embrayage usé / convertisseur', src:'Problème connu', sym:'Patine, à-coups, vibrations, mode dégradé.', dtc:['P0730'], sol:'Diagnostic convertisseur + embrayage + vidange huile.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','F-Pace'], mot:['zf','8hp']}, carbu:'all', kw:['embrayage','convertisseur','zf','8hp','patinage'], prio:6 },
  { cat:'Suspension', titre:'Suspension pneumatique : compresseur HS', src:'Problème connu JLR', sym:'Véhicule affaissé, bruit compresseur, défaut suspension.', dtc:['C0179','C0186'], sol:'Compresseur AMK / WABCO + relais + filtre dessiccateur.', veh:{marques:['Land Rover','Range Rover'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar'], mot:['suspension','pneumatique','air']}, carbu:'all', kw:['suspension','pneumatique','compresseur','amk','wabco','affaissement'], prio:7 },
  { cat:'Suspension', titre:'Suspension pneumatique : fuite ballon / capteur hauteur', src:'TSB JLR', sym:'Affaissement d\'un côté, voyant suspension, défaut.', dtc:['C0179','C0191'], sol:'Diagnostic ballon + capteurs hauteur + bloc valves.', veh:{marques:['Land Rover','Range Rover'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar'], mot:['suspension','pneumatique']}, carbu:'all', kw:['fuite','ballon','capteur','hauteur','suspension','pneumatique'], prio:7 },
  { cat:'Électrique', titre:'Infotainment Pivi Pro : bugs / écran noir / freeze', src:'TSB JLR', sym:'Écran tactile gelé, reboot, perte fonctionnalités.', dtc:[], sol:'MAJ logicielle Pivi Pro + réinitialisation + diagnostic module.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','XE','XF'], mot:['pivi','pivi pro','infotainment']}, carbu:'all', kw:['pivi','pivi pro','ecran','freeze','infotainment','bug'], prio:8 },
  { cat:'Électrique', titre:'Terrain Response : défaut système', src:'TSB JLR', sym:'Modes terrain inopérants, voyant 4x4.', dtc:['C0700'], sol:'Diagnostic module Terrain Response + MAJ + capteurs.', veh:{marques:['Land Rover','Range Rover'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque'], mot:['terrain response','4x4','4wd']}, carbu:'all', kw:['terrain response','4x4','4wd','defaut'], prio:8 },
  { cat:'Électrique', titre:'Batterie 12V AGM JLR : décharge / codage BMS', src:'TSB JLR', sym:'Défauts électroniques multiples, démarrage difficile.', dtc:['P0562'], sol:'Batterie AGM OEM + codage BMS obligatoire.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace','XE','XF'], mot:['12v','agm','bms']}, carbu:'all', kw:['batterie','12v','agm','bms','codage','jlr'], prio:8 },
  { cat:'Freinage', titre:'Freinage : servo-frein / maître-cylindre', src:'TSB JLR', sym:'Pédale dure, perte assistance, voyant.', dtc:['C0100'], sol:'Diagnostic servo-frein + maître-cylindre + capteurs.', veh:{marques:['Land Rover','Range Rover','Jaguar'], modeles:['Defender','Defender 90','Defender 110','Defender 130','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque','F-Pace'], mot:['frein','servo']}, carbu:'all', kw:['frein','servo','maitre cylindre','pedale dure'], prio:7 }
];
FICHES_CURATED.forEach(function (f) { prepFiche(f, false); });

function getEnginesForBrand(nom) { return MOTORISATIONS_PAR_MARQUE[nom] || null; }
function subsetFor(carbu) {
  if (carbu === 'diesel') return ['chd', 'fap'];
  if (carbu === 'essence') return ['cou', 'bob'];
  if (carbu === 'hybride') return ['bhv', 'cou'];
  return ['bht', 'rec'];
}
function buildMassiveBase() {
  var out = FICHES_CURATED.slice();
  var stats = { makes: {}, models: 0, powers: {}, pannes: {}, engines: {}, errors: [], skipped: 0 };
  MARQUES_COMPLETE.forEach(function (m) {
    var engines = getEnginesForBrand(m.nom);
    var fuels = [];
    if (engines) {
      engines.forEach(function (e) { if (fuels.indexOf(e.carbu) < 0) fuels.push(e.carbu); stats.engines[m.nom + '|' + e.label] = 1; });
    } else {
      fuels = m.orig === 'us' ? ['essence', 'hybride', 'ev'] : ['diesel', 'essence', 'hybride', 'ev'];
      stats.errors.push(m.nom + ' : moteurs non définis → pannes génériques uniquement');
    }
    PANNES.forEach(function (p) {
      if (out.length >= CONFIG.MAX_EMBEDDED) return;
      var ok = p.carbu[0] === 'all' || p.carbu.some(function (c) { return fuels.indexOf(c) >= 0; });
      if (!ok) return;
      var f = { cat: p.cat, titre: m.nom + ' — ' + p.titre, src: 'Base massive — pannes connues', sym: p.sym, dtc: p.dtc.slice(), sol: p.sol, veh: null, carbu: p.carbu[0] === 'all' ? 'all' : p.carbu[0], kw: p.kw.concat([norm(m.nom)]).slice(0, 14), prio: p.prio, marqueLibre: norm(m.nom) };
      prepFiche(f, false); out.push(f);
      stats.makes[m.nom] = 1; stats.pannes[p.id] = 1;
    });
  });
  Object.keys(MODELES_CATALOG).forEach(function (nom) {
    var m = null;
    for (var i = 0; i < MARQUES_COMPLETE.length; i++) if (MARQUES_COMPLETE[i].nom === nom) { m = MARQUES_COMPLETE[i]; break; }
    if (!m) return;
    var engines = getEnginesForBrand(nom);
    if (!engines) { stats.errors.push(nom + ' : moteurs non définis, modèles ignorés'); return; }
    MODELES_CATALOG[nom].forEach(function (modele) {
      var allow = MODEL_ENERGY[norm(modele)] || null;
      var used = 0;
      engines.forEach(function (en) {
        if (allow && allow.indexOf(en.carbu) < 0) return;
        en.powers.slice(0, 2).forEach(function (pw) {
          if (out.length >= CONFIG.MAX_EMBEDDED) return;
          subsetFor(en.carbu).forEach(function (pid) {
            if (out.length >= CONFIG.MAX_EMBEDDED) return;
            var p = PANNE_BY_ID[pid]; if (!p) return;
            var f = {
              cat: p.cat,
              titre: nom + ' ' + modele + ' ' + en.label + ' ' + pw + ' ch — ' + p.court,
              src: 'Base massive — motorisations réelles',
              sym: p.sym, dtc: p.dtc.slice(), sol: p.sol, veh: null,
              carbu: en.carbu,
              kw: p.kw.concat(norm(nom + ' ' + modele + ' ' + en.label + ' ' + en.famille).split(' ')).concat([String(pw)]).slice(0, 18),
              prio: p.prio,
              marqueLibre: norm(nom + ' ' + modele + ' ' + en.label + ' ' + pw + ' ch')
            };
            prepFiche(f, false); out.push(f); used++;
            stats.makes[nom] = 1; stats.models++; stats.powers[pw] = 1; stats.pannes[p.id] = 1;
          });
        });
      });
      if (used === 0) stats.skipped++;
    });
  });
  stats.makesCount = Object.keys(stats.makes).length;
  stats.powersCount = Object.keys(stats.powers).length;
  stats.pannesCount = PANNES.filter(function (p) { return stats.pannes[p.id]; }).length;
  stats.modelsCatalogCount = Object.keys(MODELES_CATALOG).reduce(function (a, k) { return a + MODELES_CATALOG[k].length; }, 0);
  stats.enginesCount = Object.keys(stats.engines).length;
  stats.overridesCount = Object.keys(MODEL_ENERGY).length;
  return { fiches: out, stats: stats };
}
var MASSIVE = buildMassiveBase();
var FICHES = MASSIVE.fiches;
var STATS = MASSIVE.stats;
var GENERATION_ID = 'gen-9.7-full-p' + STATS.powersCount + '-m' + STATS.makesCount + '-o' + STATS.overridesCount + '-f' + FICHES.length;

var SAMPLE_MAKES = ['peugeot','renault','bmw','toyota','ford','byd','zeekr','rivian','aixam','maserati','xiaomi','tank','tesla','hyundai','skoda','land rover','range rover','jaguar'];
var REQUIRED_MODELS = ['elroq','enyaq','renault 5 e tech','rafale','e 3008','e 5008','atto 3','seal u','model 3 highland','model y juniper','ev9','ioniq 9','inster','defender 110','discovery','range rover','range rover sport','range rover velar','range rover evoque','range rover electric'];

// CORRECTIONS v9.7 : allTxt NORMALISÉ + raisons détaillées
function validatePoolDetail(pool) {
  var reasons = [];
  if (!pool || !pool.length || pool.length < 1000) return { ok: false, reasons: ['taille pool = ' + (pool ? pool.length : 0)] };
  var powers = {}, i, m;
  for (i = 0; i < pool.length; i++) { m = (pool[i].titre || '').match(/(\d{2,3}) ch /); if (m) powers[m[1]] = 1; }
  if (Object.keys(powers).length < 15) reasons.push('puissances=' + Object.keys(powers).length);
  var allTxt = pool.map(function (f) { return norm((f.marqueLibre || '') + ' ' + (f.titre || '')); }).join(' | ');
  for (i = 0; i < SAMPLE_MAKES.length; i++) if (allTxt.indexOf(SAMPLE_MAKES[i]) < 0) reasons.push('marque:' + SAMPLE_MAKES[i]);
  for (i = 0; i < PANNES.length; i++) {
    var needle = PANNES[i].court, found = false;
    for (var j = 0; j < pool.length; j++) { if ((pool[j].titre || '').indexOf(needle) >= 0) { found = true; break; } }
    if (!found) reasons.push('panne:' + PANNES[i].id);
  }
  for (i = 0; i < REQUIRED_MODELS.length; i++) if (allTxt.indexOf(REQUIRED_MODELS[i]) < 0) reasons.push('modele:' + REQUIRED_MODELS[i]);
  if (allTxt.indexOf('ingenium') < 0) reasons.push('ingenium absent');
  if (allTxt.indexOf('pompe a huile') < 0 && allTxt.indexOf('equilibrage') < 0) reasons.push('pannes JLR moteur absentes');
  return { ok: reasons.length === 0, reasons: reasons };
}
function validatePool(pool) { return validatePoolDetail(pool).ok; }

function hasWord(hay, w) {
  return new RegExp('(^|[^a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(hay);
}
function validateEngines() {
  var pool = window.__ALL_FICHES || FICHES;
  if (!pool || !pool.length) return { ok: false, detail: 'Pool vide' };
  var BLACKLIST = {
    'peugeot': ['tdi','tfsi','dci','tce','tsi','ea888','n47','b47','k9k','ecoboost','skyactiv','vtec','ingenium'],
    'citroen': ['tdi','tfsi','dci','tce','tsi','ea888','n47','b47','k9k','ecoboost','skyactiv','vtec','ingenium'],
    'ds automobiles': ['tdi','tfsi','dci','tce','tsi','ea888','n47','b47','k9k','ecoboost','ingenium'],
    'opel': ['tdi','tfsi','dci','tce','tsi','ea888','n47','b47','k9k','ecoboost','ingenium'],
    'renault': ['tdi','tsi','tfsi','ea888','bluehdi','puretech','n47','b47','ecoboost','skyactiv','ingenium'],
    'dacia': ['tdi','tsi','tfsi','ea888','bluehdi','puretech','n47','b47','ingenium'],
    'volkswagen': ['dci','tce','bluehdi','puretech','k9k','n47','b47','ecoboost','skyactiv','vtec','ingenium'],
    'audi': ['dci','tce','bluehdi','puretech','k9k','n47','b47','ecoboost','skyactiv','ingenium'],
    'skoda': ['dci','tce','bluehdi','puretech','k9k','n47','b47','ecoboost','ingenium'],
    'seat': ['dci','tce','bluehdi','puretech','k9k','n47','b47','ecoboost','ingenium'],
    'cupra': ['dci','tce','bluehdi','puretech','k9k','n47','b47','ecoboost','ingenium'],
    'bmw': ['dci','tce','bluehdi','puretech','tdi','ea888','ea211','k9k','ecoboost','skyactiv','ingenium'],
    'mini': ['dci','tce','bluehdi','puretech','tdi','ea888','k9k','ecoboost','ingenium'],
    'mercedes benz': ['dci','tce','puretech','tdi','ea888','n47','k9k','ecoboost','ingenium'],
    'toyota': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','tsi','tfsi','ecoboost','vtec','ingenium'],
    'lexus': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','tsi','tfsi','ecoboost','ingenium'],
    'honda': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','skyactiv','ingenium'],
    'nissan': ['tdi','tsi','tfsi','ea888','bluehdi','puretech','skyactiv','ingenium'],
    'mazda': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','ecoboost','vtec','ingenium'],
    'subaru': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','ecoboost','ingenium'],
    'suzuki': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','ecoboost','ingenium'],
    'mitsubishi': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','ecoboost','ingenium'],
    'hyundai': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','skyactiv','vtec','ingenium'],
    'kia': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','skyactiv','vtec','ingenium'],
    'ford': ['tdi','dci','bluehdi','puretech','ea888','tsi','tfsi','skyactiv','vtec','ingenium'],
    'chevrolet': ['tdi','dci','bluehdi','puretech','ea888','tsi','tfsi','skyactiv','ingenium'],
    'jeep': ['tdi','dci','bluehdi','puretech','ea888','tsi','tfsi','skyactiv','ingenium'],
    'tesla': ['tdi','dci','tce','bluehdi','puretech','ea888','tsi','tfsi','essence','diesel','hybride','crdi','tdci','ingenium'],
    'byd': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','ecoboost','skyactiv','vtec','ingenium'],
    'mg': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','ecoboost','skyactiv','ingenium'],
    'chery': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','ecoboost','ingenium'],
    'geely': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','ecoboost','ingenium'],
    'great wall': ['tdi','dci','tce','bluehdi','puretech','ea888','n47','ecoboost','ingenium'],
    'xiaomi auto': ['tdi','dci','tce','bluehdi','puretech','ea888','essence','diesel','hybride','ingenium'],
    'nio': ['tdi','dci','tce','bluehdi','puretech','ea888','essence','diesel','hybride','ingenium'],
    'xpeng': ['tdi','dci','tce','bluehdi','puretech','ea888','essence','diesel','hybride','ingenium'],
    'zeekr': ['tdi','dci','tce','bluehdi','puretech','ea888','essence','diesel','hybride','ingenium']
  };
  var POSITIVE = [
    ['peugeot', ['puretech','bluehdi']],
    ['renault', ['tce','dci']],
    ['volkswagen', ['tsi','tdi']],
    ['bmw', ['b47','b48']],
    ['toyota', ['hybrid','d 4d']],
    ['tesla', ['electrique']],
    ['land rover', ['ingenium','aj200']],
    ['range rover', ['v8','p530','p400e']]
  ];
  var bad = [];
  pool.forEach(function (f, idx) {
    var hay = norm((f.titre || '') + ' ' + (f.marqueLibre || ''));
    Object.keys(BLACKLIST).forEach(function (b) {
      if (hay.indexOf(b) !== 0 && hay.indexOf(b + ' ') !== 0) return;
      BLACKLIST[b].forEach(function (t) { if (hasWord(hay, t)) bad.push(idx + ':' + b + '+' + t); });
    });
  });
  var posOk = 0;
  POSITIVE.forEach(function (pp) {
    var found = pool.some(function (f) {
      var hay = norm((f.titre || '') + ' ' + (f.marqueLibre || ''));
      if (hay.indexOf(pp[0]) !== 0) return false;
      return pp[1].some(function (tok) { return hay.indexOf(tok) >= 0; });
    });
    if (found) posOk++;
  });
  if (bad.length > 0) return { ok: false, detail: bad.length + ' violations : ' + bad.slice(0, 3).join(' | ') };
  if (posOk < POSITIVE.length) return { ok: false, detail: 'Moteurs réels absents : ' + posOk + '/' + POSITIVE.length };
  return { ok: true, detail: '0 violation · ' + posOk + '/' + POSITIVE.length + ' moteurs réels (incl. JLR) · ' + STATS.enginesCount + ' motorisations · ' + STATS.overridesCount + ' attributions modèle' };
}

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
      if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'k' });
    };
  });
};
DB.prototype.count = function () {
  var self = this;
  return new Promise(function (res) {
    try { var q = self.db.transaction(CONFIG.STORE, 'readonly').objectStore(CONFIG.STORE).count(); q.onsuccess = function () { res(q.result); }; q.onerror = function () { res(0); }; } catch (e) { res(0); }
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
    try { var q = self.db.transaction(CONFIG.STORE, 'readonly').objectStore(CONFIG.STORE).getAll(); q.onsuccess = function () { res(q.result || []); }; q.onerror = function () { res([]); }; } catch (e) { res([]); }
  });
};
DB.prototype.getMeta = function () {
  var self = this;
  return new Promise(function (res) {
    try { var q = self.db.transaction('meta', 'readonly').objectStore('meta').get('gen'); q.onsuccess = function () { res(q.result || null); }; q.onerror = function () { res(null); }; } catch (e) { res(null); }
  });
};
DB.prototype.setMeta = function (v) {
  var self = this;
  return new Promise(function (res) {
    try {
      var t = self.db.transaction('meta', 'readwrite');
      var rec = { k: 'gen' };
      Object.keys(v).forEach(function (k) { rec[k] = v[k]; });
      t.objectStore('meta').put(rec);
      t.oncomplete = function () { res(true); }; t.onerror = function () { res(false); };
    } catch (e) { res(false); }
  });
};
var db = new DB();

async function loadOrSeed() {
  await db.open();
  var meta = await db.getMeta();
  var n = await db.count();
  var pool = null;
  if (meta && meta.gen === GENERATION_ID && n >= 1000) {
    var stored = await db.getAll();
    if (stored.length >= 1000) {
      stored.forEach(function (f) { prepFiche(f, !!f._remote); });
      if (validatePool(stored)) pool = stored;
    }
  }
  if (!pool) {
    await db.seed(FICHES);
    await db.setMeta({ gen: GENERATION_ID, date: Date.now() });
    pool = FICHES;
  }
  window.__ALL_FICHES = pool;
  return pool.length;
}

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
  if (/hybride|hybrid|hsd|phev/.test(t)) return 'hybride';
  if (/essence|tsi|tfsi|tce|puretech|thp|ecoboost|vti|gdi|tgdi/.test(t)) return 'essence';
  if (/electrique|ev|bev|blade|meb|e gmp|egmp|ultium/.test(t)) return 'ev';
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
  var carbu = guessCarbu(motor + ' ' + titre);
  var allow = MODEL_ENERGY[norm(modele)] || null;
  if (allow && allow.indexOf(carbu) < 0) carbu = allow[0];
  var kw = norm([marque, modele, motor, titre].join(' ')).split(' ').filter(function (t) { return t.length >= 3; }).slice(0, 12);
  var f = { cat: cat || 'Moteur', titre: titre, src: src || 'Import appli-aide-technique', sym: sym || 'Voir détail fiche.', dtc: toDtc(pick(r, ['dtc','codes','codes_defaut','code','fault_codes'])), sol: sol || 'Diagnostic complet recommandé.', veh: null, carbu: carbu, kw: kw, prio: 5, marqueLibre: norm([marque, modele, motor].join(' ')) };
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
  log('📦 Base embarquée JLR : ' + FICHES.length + ' fiches (' + STATS.makesCount + ' marques · ' + STATS.modelsCatalogCount + ' modèles · ' + STATS.enginesCount + ' motorisations · ' + STATS.overridesCount + ' attributions · ' + STATS.pannesCount + ' pannes + ' + FICHES_CURATED.length + ' curated) · gen ' + GENERATION_ID);
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
    log('S2 · Analyse HTML + scripts de la source…'); prog(35);
    try {
      var html = await fetchText(CONFIG.SOURCE_URL);
      var ex = extractJsonBlocks(html);
      log('🔎 ' + ex.blocks.length + ' bloc(s) inline · ' + ex.externals.length + ' script(s) externe(s)');
      ex.blocks.forEach(function (b) { var d = parseAny(b.raw); if (d && d.length > remote.length) { remote = d; report.strategy = 'S2:' + b.src; } });
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
    prog(60); log('🧬 Normalisation (attribution énergie appliquée) & fusion…');
    var rf = remoteToFiches(remote, CONFIG.MAX_REMOTE);
    report.remoteCount = rf.length;
    var keys = {};
    FICHES.forEach(function (f) { keys[f._key] = 1; });
    mergedExtra = rf.filter(function (f) { return !keys[f._key]; });
    log('🧬 ' + rf.length + ' fiches distantes · ' + mergedExtra.length + ' nouvelles');
  } else {
    report.strategy = 'S3:base-embarquée-massive-jlr';
    log('⚠️ Distant injoignable → S3 : base JLR embarquée conservée (' + FICHES.length + ' fiches)');
  }
  prog(80);
  var all = FICHES.concat(mergedExtra);
  await db.open();
  var n = await db.seed(all);
  await db.setMeta({ gen: GENERATION_ID, date: Date.now(), remote: report.remoteCount });
  window.__ALL_FICHES = all;
  report.totalCount = n;
  prog(100);
  try { localStorage.setItem(CONFIG.LS_IMPORT, JSON.stringify(report)); } catch (e5) {}
  log('✅ IndexedDB mise à jour : ' + n + ' fiches (sauvegarde locale persistante)');
  return report;
}

var VEH = [
  ['3008','Peugeot','3008'],['e 3008','Peugeot','e-3008'],['2008','Peugeot','2008'],['5008','Peugeot','5008'],['e 5008','Peugeot','e-5008'],['408','Peugeot','408'],['208','Peugeot','208'],['e 208','Peugeot','e-208'],['308','Peugeot','308'],['e 308','Peugeot','e-308'],['508','Peugeot','508'],['partner','Peugeot','Partner'],['rifter','Peugeot','Rifter'],['expert','Peugeot','Expert'],['boxer','Peugeot','Boxer'],
  ['clio','Renault','Clio'],['megane e tech','Renault','Megane E-Tech'],['megane','Renault','Megane'],['scenic e tech','Renault','Scenic E-Tech'],['scenic','Renault','Scenic'],['captur','Renault','Captur'],['kadjar','Renault','Kadjar'],['austral','Renault','Austral'],['espace','Renault','Espace'],['renault 5 e tech','Renault','Renault 5 E-Tech'],['renault 5','Renault','Renault 5 E-Tech'],['5 e tech','Renault','Renault 5 E-Tech'],['rafale','Renault','Rafale'],['symbioz','Renault','Symbioz'],['zoe','Renault','Zoe'],['twingo','Renault','Twingo'],['kangoo','Renault','Kangoo'],['trafic','Renault','Trafic'],['master','Renault','Master'],
  ['duster','Dacia','Duster'],['bigster','Dacia','Bigster'],['sandero','Dacia','Sandero'],['logan','Dacia','Logan'],['jogger','Dacia','Jogger'],['spring','Dacia','Spring'],
  ['c3 aircross','Citroën','C3 Aircross'],['e c3','Citroën','ë-C3'],['c3','Citroën','C3'],['c4','Citroën','C4'],['c5 aircross','Citroën','C5 Aircross'],['berlingo','Citroën','Berlingo'],['jumpy','Citroën','Jumpy'],
  ['ds3','DS Automobiles','DS 3'],['ds4','DS Automobiles','DS 4'],['ds7','DS Automobiles','DS 7'],['ds9','DS Automobiles','DS 9'],['ds n4','DS Automobiles','DS N°4'],['ds n8','DS Automobiles','DS N°8'],
  ['golf','Volkswagen','Golf'],['polo','Volkswagen','Polo'],['passat','Volkswagen','Passat'],['tiguan','Volkswagen','Tiguan'],['touareg','Volkswagen','Touareg'],['t roc','Volkswagen','T-Roc'],['id 3','Volkswagen','ID.3'],['id 4','Volkswagen','ID.4'],['id 5','Volkswagen','ID.5'],['id 7','Volkswagen','ID.7'],['id buzz','Volkswagen','ID.Buzz'],
  ['a3','Audi','A3'],['a4','Audi','A4'],['a5','Audi','A5'],['a6','Audi','A6'],['q3','Audi','Q3'],['q4','Audi','Q4 e-tron'],['q5','Audi','Q5'],['q6','Audi','Q6 e-tron'],['q7','Audi','Q7'],['q8','Audi','Q8'],
  ['octavia','Škoda','Octavia'],['fabia','Škoda','Fabia'],['superb','Škoda','Superb'],['kodiaq','Škoda','Kodiaq'],['karoq','Škoda','Karoq'],['kamiq','Škoda','Kamiq'],['enyaq coupe','Škoda','Enyaq Coupé'],['enyaq','Škoda','Enyaq'],['elroq','Škoda','Elroq'],['scala','Škoda','Scala'],
  ['leon','SEAT','Leon'],['ibiza','SEAT','Ibiza'],['ateca','SEAT','Ateca'],['arona','SEAT','Arona'],
  ['born','CUPRA','Born'],['formentor','CUPRA','Formentor'],['tavascan','CUPRA','Tavascan'],
  ['serie 1','BMW','Serie 1'],['serie 3','BMW','Serie 3'],['serie 5','BMW','Serie 5'],['x1','BMW','X1'],['x3','BMW','X3'],['x5','BMW','X5'],['ix3','BMW','iX3'],['ix','BMW','iX'],['i4','BMW','i4'],['i5','BMW','i5'],['i7','BMW','i7'],
  ['countryman','MINI','Countryman'],['mini aceman','MINI','Aceman'],['mini','MINI','Cooper'],
  ['classe a','Mercedes-Benz','Classe A'],['classe c','Mercedes-Benz','Classe C'],['classe e','Mercedes-Benz','Classe E'],['classe s','Mercedes-Benz','Classe S'],['gla','Mercedes-Benz','GLA'],['glc','Mercedes-Benz','GLC'],['gle','Mercedes-Benz','GLE'],['eqe','Mercedes-Benz','EQE'],['eqs','Mercedes-Benz','EQS'],['eqa','Mercedes-Benz','EQA'],['eqb','Mercedes-Benz','EQB'],
  ['xc40','Volvo','XC40'],['xc60','Volvo','XC60'],['xc90','Volvo','XC90'],['ex30','Volvo','EX30'],['ex90','Volvo','EX90'],['em90','Volvo','EM90'],['c40','Volvo','C40'],
  ['polestar 2','Polestar','Polestar 2'],['polestar 3','Polestar','Polestar 3'],['polestar 4','Polestar','Polestar 4'],
  ['911','Porsche','911'],['taycan','Porsche','Taycan'],['macan','Porsche','Macan'],['cayenne','Porsche','Cayenne'],
  ['yaris','Toyota','Yaris'],['corolla','Toyota','Corolla'],['camry','Toyota','Camry'],['c hr','Toyota','C-HR'],['rav4','Toyota','RAV4'],['hilux','Toyota','Hilux'],['land cruiser','Toyota','Land Cruiser'],['prius','Toyota','Prius'],['bz4x','Toyota','bZ4X'],
  ['is','Lexus','IS'],['es','Lexus','ES'],['nx','Lexus','NX'],['rx','Lexus','RX'],['rz','Lexus','RZ'],['lbx','Lexus','LBX'],
  ['civic','Honda','Civic'],['accord','Honda','Accord'],['cr v','Honda','CR-V'],['hr v','Honda','HR-V'],['jazz','Honda','Jazz'],
  ['qashqai','Nissan','Qashqai'],['juke','Nissan','Juke'],['micra','Nissan','Micra'],['leaf','Nissan','Leaf'],['ariya','Nissan','Ariya'],['x trail','Nissan','X-Trail'],
  ['mazda3','Mazda','Mazda3'],['mazda2','Mazda','Mazda2'],['cx 5','Mazda','CX-5'],['cx 60','Mazda','CX-60'],['cx 80','Mazda','CX-80'],['mx 5','Mazda','MX-5'],
  ['outback','Subaru','Outback'],['forester','Subaru','Forester'],['solterra','Subaru','Solterra'],
  ['swift','Suzuki','Swift'],['vitara','Suzuki','Vitara'],['s cross','Suzuki','S-Cross'],['jimny','Suzuki','Jimny'],['e vitara','Suzuki','e Vitara'],
  ['outlander','Mitsubishi','Outlander'],['eclipse cross','Mitsubishi','Eclipse Cross'],
  ['i10','Hyundai','i10'],['i20','Hyundai','i20'],['i30','Hyundai','i30'],['kona','Hyundai','Kona'],['tucson','Hyundai','Tucson'],['santa fe','Hyundai','Santa Fe'],['ioniq 5','Hyundai','Ioniq 5'],['ioniq 6','Hyundai','Ioniq 6'],['ioniq 9','Hyundai','Ioniq 9'],['inster','Hyundai','Inster'],
  ['picanto','Kia','Picanto'],['rio','Kia','Rio'],['ceed','Kia','Ceed'],['stonic','Kia','Stonic'],['sportage','Kia','Sportage'],['sorento','Kia','Sorento'],['niro','Kia','Niro'],['ev6','Kia','EV6'],['ev9','Kia','EV9'],['ev5','Kia','EV5'],
  ['fiesta','Ford','Fiesta'],['focus','Ford','Focus'],['kuga','Ford','Kuga'],['puma','Ford','Puma'],['mustang mach e','Ford','Mustang Mach-E'],['ranger','Ford','Ranger'],['transit','Ford','Transit'],['explorer ev','Ford','Explorer EV'],['capri ev','Ford','Capri EV'],
  ['renegade','Jeep','Renegade'],['compass','Jeep','Compass'],['wrangler','Jeep','Wrangler'],['grand cherokee','Jeep','Grand Cherokee'],['avenger','Jeep','Avenger'],
  ['bolt ev','Chevrolet','Bolt EV'],['bolt euv','Chevrolet','Bolt EUV'],['equinox ev','Chevrolet','Equinox EV'],['blazer ev','Chevrolet','Blazer EV'],['silverado ev','Chevrolet','Silverado EV'],
  ['model 3 highland','Tesla','Model 3 Highland'],['model 3','Tesla','Model 3'],['model y juniper','Tesla','Model Y Juniper'],['model y','Tesla','Model Y'],['model s','Tesla','Model S'],['model x','Tesla','Model X'],['cybertruck','Tesla','Cybertruck'],
  ['atto 3','BYD','Atto 3'],['atto 2','BYD','Atto 2'],['dolphin u','BYD','Dolphin U'],['dolphin','BYD','Dolphin'],['seal u','BYD','Seal U'],['seal','BYD','Seal'],['seagull','BYD','Seagull'],['han','BYD','Han'],['tang','BYD','Tang'],
  ['mg3','MG','MG3'],['mg4 xpower','MG','MG4 XPOWER'],['mg4','MG','MG4'],['mg5','MG','MG5'],['mg hs','MG','MG HS'],['mg zs','MG','MG ZS'],['mg s5','MG','MG S5'],['cyberster','MG','Cyberster'],
  ['tiggo 4','Chery','Tiggo 4'],['tiggo 7','Chery','Tiggo 7'],['tiggo 8','Chery','Tiggo 8'],['omoda 5','Chery','Omoda 5'],['jaecoo 7','Chery','Jaecoo 7'],
  ['coolray','Geely','Coolray'],['monjaro','Geely','Monjaro'],['galaxy l7','Geely','Galaxy L7'],
  ['tank 300','Great Wall','Tank 300'],['tank 500','Great Wall','Tank 500'],['haval h6','Great Wall','Haval H6'],
  ['su7 ultra','Xiaomi Auto','SU7 Ultra'],['su7','Xiaomi Auto','SU7'],['yu7','Xiaomi Auto','YU7'],
  ['et7','NIO','ET7'],['et5','NIO','ET5'],['es6','NIO','ES6'],['es8','NIO','ES8'],
  ['g6','XPeng','G6'],['g9','XPeng','G9'],['p7','XPeng','P7'],
  ['zeekr 001','Zeekr','Zeekr 001'],['zeekr x','Zeekr','Zeekr X'],['zeekr 007','Zeekr','Zeekr 007'],
  ['l9','Li Auto','L9'],['l8','Li Auto','L8'],['l7','Li Auto','L7'],
  ['c10','Leapmotor','C10'],['c11','Leapmotor','C11'],['b10','Leapmotor','B10'],
  ['vf 8','VinFast','VF 8'],['vf 9','VinFast','VF 9'],['vf 7','VinFast','VF 7'],
  ['smart 1','Smart','Smart #1'],['smart 3','Smart','Smart #3'],['smart 5','Smart','Smart #5'],
  ['defender 90','Land Rover','Defender 90'],['defender 110','Land Rover','Defender 110'],['defender 130','Land Rover','Defender 130'],['defender','Land Rover','Defender'],
  ['discovery sport','Land Rover','Discovery Sport'],['discovery','Land Rover','Discovery'],
  ['range rover sport svr','Range Rover','Range Rover Sport SVR'],['range rover sport','Range Rover','Range Rover Sport'],
  ['range rover velar','Range Rover','Range Rover Velar'],['range rover evoque','Range Rover','Range Rover Evoque'],
  ['range rover electric','Range Rover','Range Rover Electric'],['range rover','Range Rover','Range Rover']
].sort(function (a, b) { return b[0].length - a[0].length; });

var MARQUES = [
  ['peugeot','Peugeot'],['renault','Renault'],['citroen','Citroën'],['ds automobiles','DS Automobiles'],['dacia','Dacia'],
  ['volkswagen','Volkswagen'],['vw','Volkswagen'],['audi','Audi'],['skoda','Škoda'],['seat','SEAT'],['cupra','CUPRA'],
  ['bmw','BMW'],['mini','MINI'],['mercedes','Mercedes-Benz'],['opel','Opel'],['volvo','Volvo'],['porsche','Porsche'],['polestar','Polestar'],
  ['toyota','Toyota'],['lexus','Lexus'],['honda','Honda'],['nissan','Nissan'],['mazda','Mazda'],['subaru','Subaru'],['suzuki','Suzuki'],['mitsubishi','Mitsubishi'],
  ['hyundai','Hyundai'],['kia','Kia'],['ford','Ford'],['jeep','Jeep'],['chevrolet','Chevrolet'],['tesla','Tesla'],
  ['byd','BYD'],['mg','MG'],['chery','Chery'],['geely','Geely'],['great wall','Great Wall'],['xiaomi','Xiaomi Auto'],['nio','NIO'],['xpeng','XPeng'],['zeekr','Zeekr'],['li auto','Li Auto'],['leapmotor','Leapmotor'],['vinfast','VinFast'],['smart','Smart'],
  ['rivian','Rivian'],['lucid','Lucid'],['fisker','Fisker'],['aixam','Aixam'],['maserati','Maserati'],['tank','Tank'],['fiat','Fiat'],
  ['land rover','Land Rover'],['range rover','Range Rover'],['jaguar','Jaguar']
].sort(function (a, b) { return b[0].length - a[0].length; });

var FAMILLES = [
  { tok: ['bluehdi','hdi','dv5','dv6'], carbu: 'diesel' },
  { tok: ['tdi'], carbu: 'diesel' },
  { tok: ['dci','k9k'], carbu: 'diesel' },
  { tok: ['crdi'], carbu: 'diesel' },
  { tok: ['tdci'], carbu: 'diesel' },
  { tok: ['d 4d','d4d'], carbu: 'diesel' },
  { tok: ['puretech','eb2','thp','ep6','tsi','tfsi','ea888','ea211','tce','ecoboost','vti'], carbu: 'essence' },
  { tok: ['hybride','hsd'], carbu: 'hybride' },
  { tok: ['ev','electrique','bev'], carbu: 'ev' },
  { tok: ['ingenium','aj200','p200','p250','p300','d200','d240','d250','d300','d350'], carbu: 'all' },
  { tok: ['p400','p500','p400e','p440e','p460e','p510e','mhev'], carbu: 'all' },
  { tok: ['v6','sc','sdv6','aj126','aj206'], carbu: 'all' },
  { tok: ['v8','aj133','p525','p550','p575','svr','n63','s68','p530','p615'], carbu: 'essence' }
];
var ORGANES = [
  'courroie de distribution','courroie d\'accessoire','chaîne de distribution','fap (filtre à particules)',
  'vanne egr','turbo','injecteurs','pompe haute pression','pompe à eau','alternateur','démarreur',
  'embrayage','volant moteur','sonde lambda','catalyseur','débitmètre','bobines d\'allumage','bougies',
  'amortisseurs','plaquettes de frein','disques de frein','capteur abs','crémaillère direction',
  'radiateur','thermostat','compresseur clim','batterie','système adblue scr',
  'chaîne distribution ingenium','tendeur chaîne','compresseur supercharged','pompe à huile','arbre d\'équilibrage',
  'suspension pneumatique','boîte zf 8hp','batterie 48v mhev','pivi pro','terrain response'
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
  if (!carbu && veh) {
    var allow = MODEL_ENERGY[norm(veh.modele)] || null;
    if (allow && allow.length === 1) carbu = allow[0];
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
  var fuelLock = (ctx.carbu && ctx.carbu !== 'all') ? ctx.carbu : null;
  var s = 0;
  if (ctx.veh) {
    if (f.veh) {
      var mOk = f.veh.marques.indexOf(ctx.veh.marque) >= 0;
      var moOk = f.veh.modeles.indexOf(ctx.veh.modele) >= 0;
      if (!moOk) {
        for (var mi = 0; mi < f.veh.modeles.length; mi++) {
          var mm = f.veh.modeles[mi];
          if (mm && ctx.veh.modele && (mm.indexOf(ctx.veh.modele) === 0 || ctx.veh.modele.indexOf(mm) === 0)) { moOk = true; break; }
        }
      }
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
      if (fuelLock && f.carbu && f.carbu !== 'all' && f.carbu !== fuelLock) return null;
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
      if (fuelLock && f.carbu && f.carbu !== 'all' && f.carbu !== fuelLock) return null;
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
      var o = f._orig;
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
    if (ctx.carbu && ctx.carbu !== 'all') label += ' (' + ctx.carbu + ')';
    dB.innerHTML = '<div class="detect">🚗 <b>Véhicule détecté :</b> ' + label + ' — fiches ciblées ci-dessous.</div>';
  } else dB.innerHTML = '';
  var box = $('resultsBox');
  if (!results.length) {
    box.innerHTML = '<div class="empty">Aucun résultat pour « ' + q + ' ». Essayez : modèle (3008, elroq, defender, range rover sport…), organe (courroie, fap, egr, ingenium…), DTC (p0016)…</div>';
    return;
  }
  box.innerHTML = results.map(function (r) {
    var f = r.f;
    var catCls = 'cat-' + f._catN.charAt(0).toUpperCase() + f._catN.slice(1);
    return '<div class="fiche"><div class="f-head"><span class="cat ' + catCls + '">' + f.cat + '</span><span class="f-titre">' + hl(f.titre, q) + '</span><span class="f-src">' + f.src + '</span></div><div class="f-line"><span class="ico">📋</span>' + f.sym + '</div><div class="f-line"><span class="ico">🔧</span>DTC : ' + (f.dtc.length ? f.dtc.join(' • ') : '—') + '</div><div class="f-line"><span class="ico">✅</span>' + f.sol + '</div></div>';
  }).join('');
}
function renderSugg(list, q) {
  var box = $('suggBox');
  if (!list.length) { box.style.display = 'none'; return; }
  box.innerHTML = list.map(function (s, i) {
    var plain = s.label.replace(/"/g, '&quot;');
    return '<div class="sugg-item" data-i="' + i + '" data-plain="' + plain + '"><span class="s-ico">' + (s.type === 'terme' ? '🔤' : '🩺') + '</span><span><div class="s-main">' + hl(s.label, q) + '</div><div class="s-sub">' + (s.type === 'terme' ? 'complétion organe' : s.f.sym) + '</div></span></div>';
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
    $('resultsBox').innerHTML = '<div class="empty">Tapez un mot-clé : marque, modèle, motorisation, puissance, organe (courroie, fap, egr, ingenium…), symptôme ou code DTC.</div>';
    return;
  }
  var r = search(q, window.__ORIG_FILTER || 'toutes');
  renderSugg(suggestions(r.ctx, r.results), q);
  renderResults(r.results, r.ctx, q);
}

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
    st.className = 'status inf'; st.innerHTML = '🔄 Import base massive JLR (embarquée + distante)…';
    var rep = await importRemote(log, function (p) { bar.style.width = p + '%'; });
    st.className = 'status ok';
    st.innerHTML = '✅ <b>Import terminé</b> · stratégie ' + rep.strategy + ' · ' + rep.remoteCount + ' fiches distantes · base totale ' + rep.totalCount + ' · ' + new Date(rep.date).toLocaleString('fr-FR');
    $('ficheCount').textContent = rep.totalCount + ' fiches';
    $('genVersion').textContent = GENERATION_ID;
    $('modelCount').textContent = STATS.modelsCatalogCount + ' modèles (incl. JLR massifs)';
    $('dataVersion').textContent = (rep.remoteCount ? '3 (import distant ' : '2 (massive JLR local ') + new Date(rep.date).toLocaleDateString('fr-FR') + ')';
    setTimeout(function () { if (confirm('Import terminé (' + rep.totalCount + ' fiches). Recharger la page ?')) location.reload(); }, 800);
  } catch (e) {
    st.className = 'status err'; st.innerHTML = '❌ Erreur import : ' + e.message; log('❌ ' + e.message);
  } finally {
    btn.disabled = false; btn.textContent = '🚀 Importer TOUTE la base (embarquée + distante)';
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      document.querySelectorAll('.tabcontent').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var c = $('tab-' + t.dataset.tab);
      if (c) c.classList.add('active');
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
    a.href = URL.createObjectURL(blob); a.download = 'diagauto-base-massive-jlr.json'; a.click();
  });
  $('btnImportFile').addEventListener('click', function () { $('fileJson').click(); });
  $('fileJson').addEventListener('change', async function (e) {
    var file = e.target.files[0]; if (!file) return;
    try {
      var arr = JSON.parse(await file.text());
      if (!Array.isArray(arr)) throw new Error('format invalide');
      arr.forEach(function (f) { prepFiche(f, true); });
      await db.open(); await db.seed(arr);
      await db.setMeta({ gen: GENERATION_ID, date: Date.now(), custom: arr.length });
      alert('✅ ' + arr.length + ' fiches importées depuis le fichier.');
      location.reload();
    } catch (err) { alert('❌ Fichier invalide : ' + err.message); }
  });
  try {
    var loaded = await loadOrSeed();
    $('ficheCount').textContent = loaded + ' fiches';
    $('genVersion').textContent = GENERATION_ID;
    $('modelCount').textContent = STATS.modelsCatalogCount + ' modèles (incl. JLR massifs)';
    var rep = null;
    try { rep = JSON.parse(localStorage.getItem(CONFIG.LS_IMPORT) || 'null'); } catch (e) {}
    if (rep && rep.remoteCount) $('dataVersion').textContent = '3 (import distant ' + new Date(rep.date).toLocaleDateString('fr-FR') + ')';
    else $('dataVersion').textContent = '2 (massive JLR local — ' + STATS.makesCount + ' marques · ' + FICHES_CURATED.length + ' curated)';
  } catch (e) {
    console.warn('IndexedDB indisponible, mode mémoire.', e);
    window.__ALL_FICHES = FICHES;
    $('ficheCount').textContent = FICHES.length + ' fiches (mémoire)';
    $('genVersion').textContent = GENERATION_ID + ' (mémoire)';
    $('modelCount').textContent = STATS.modelsCatalogCount + ' modèles (mémoire)';
  }
});

window.DiagAuto = { FICHES: FICHES, PANNES: PANNES, MARQUES: MARQUES_COMPLETE, stats: STATS, search: search, buildCtx: buildCtx, validatePool: validatePool, validatePoolDetail: validatePoolDetail, validateEngines: validateEngines, GEN: GENERATION_ID, CONFIG: CONFIG, VERSION: VERSION };
window.DiagImporter = {
  importRemote: importRemote,
  lastReport: function () { try { return JSON.parse(localStorage.getItem(CONFIG.LS_IMPORT)); } catch (e) { return null; } }
};
})();
