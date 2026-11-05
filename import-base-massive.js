// ============================================
// IMPORT-BASE-MASSIVE.JS
// Module d'import de la base de données massive
// depuis appli-aide-technique vers diagauto-pro
// Version: 1.0.0
// ============================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        SOURCE_URL: 'https://expertkevin06-cell.github.io/appli-aide-technique/',
        DB_NAME: 'DiagAutoDB',
        DB_VERSION: 1,
        STORES: {
            MARQUES: 'marques',
            VEHICULES: 'vehicules',
            INTERVENTIONS: 'interventions'
        }
    };

    // Base de données complète des marques automobiles
    const MARQUES_DATABASE = [
        // Françaises 🇫🇷
        {marque: "Aixam", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Alpine", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Bolloré", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Bugatti", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Citroën", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "DS Automobiles", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Ligier", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Microcar", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Peugeot", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        {marque: "Renault", origine: "🇫🇷 Françaises", pays: "FR", continent: "europe"},
        
        // Européennes 🇪🇺
        {marque: "Alfa Romeo", origine: "🇪🇺 Européennes", pays: "IT", continent: "europe"},
        {marque: "Aston Martin", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Audi", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "Bentley", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "BMW", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "CUPRA", origine: "🇪🇺 Européennes", pays: "ES", continent: "europe"},
        {marque: "Dacia", origine: "🇪🇺 Européennes", pays: "RO", continent: "europe"},
        {marque: "Ferrari", origine: "🇪🇺 Européennes", pays: "IT", continent: "europe"},
        {marque: "Fiat", origine: "🇪🇺 Européennes", pays: "IT", continent: "europe"},
        {marque: "Ineos", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Jaguar", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Lamborghini", origine: "🇪🇺 Européennes", pays: "IT", continent: "europe"},
        {marque: "Lancia", origine: "🇪🇺 Européennes", pays: "IT", continent: "europe"},
        {marque: "Land Rover", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Lotus", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Maserati", origine: "🇪🇺 Européennes", pays: "IT", continent: "europe"},
        {marque: "McLaren", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Mercedes-Benz", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "MINI", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Opel", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "Polestar", origine: "🇪🇺 Européennes", pays: "SE", continent: "europe"},
        {marque: "Porsche", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "Rolls-Royce", origine: "🇪🇺 Européennes", pays: "GB", continent: "europe"},
        {marque: "Saab", origine: "🇪🇺 Européennes", pays: "SE", continent: "europe"},
        {marque: "SEAT", origine: "🇪🇺 Européennes", pays: "ES", continent: "europe"},
        {marque: "Škoda", origine: "🇪🇺 Européennes", pays: "CZ", continent: "europe"},
        {marque: "Smart", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "Volkswagen", origine: "🇪🇺 Européennes", pays: "DE", continent: "europe"},
        {marque: "Volvo", origine: "🇪🇺 Européennes", pays: "SE", continent: "europe"},
        
        // Asiatiques 🌏
        {marque: "Acura", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Aion", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "AITO", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Aiways", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Arcfox", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Avatr", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "BAIC", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Baidu Jiyue", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Baojun", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Beijing", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Bestune", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Borgward", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "BYD", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Changan", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Chery", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Daihatsu", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Deepal", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Denza", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "DFSK", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Dongfeng", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Enovate", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Exeed", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Fangchengbao", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "FAW", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Forthing", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "GAC", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Geely", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Geely Galaxy", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Genesis", origine: "🌏 Asiatiques", pays: "KR", continent: "asie"},
        {marque: "Geometry", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Great Wall", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Haima", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Haval", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Hengchi", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "HiPhi", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Honda", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Hongqi", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Hozon", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Human Horizons", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Hycan", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Hyundai", origine: "🌏 Asiatiques", pays: "KR", continent: "asie"},
        {marque: "IM Motors", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Infiniti", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Isuzu", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "JAC", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Jaecoo", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Jetour", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Kaiyi", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Kandi", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Kia", origine: "🌏 Asiatiques", pays: "KR", continent: "asie"},
        {marque: "Leapmotor", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Lexus", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Li Auto", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Livan", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Luxgen", origine: "🌏 Asiatiques", pays: "TW", continent: "asie"},
        {marque: "Lynk & Co", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Mahindra", origine: "🌏 Asiatiques", pays: "IN", continent: "asie"},
        {marque: "Maxus", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Mazda", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "MG", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Mitsubishi", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Neta", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "NIO", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Nissan", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Omoda", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Ora", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Qiantu", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Qoros", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Radar", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Rising Auto", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Roewe", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "SAIC", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Seres", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Singulato", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Skyworth", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Soueast", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "SsangYong", origine: "🌏 Asiatiques", pays: "KR", continent: "asie"},
        {marque: "Subaru", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "Suzuki", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "SWM", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Tank", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Tata", origine: "🌏 Asiatiques", pays: "IN", continent: "asie"},
        {marque: "Toyota", origine: "🌏 Asiatiques", pays: "JP", continent: "asie"},
        {marque: "VinFast", origine: "🌏 Asiatiques", pays: "VN", continent: "asie"},
        {marque: "Voyah", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Weltmeister", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Wey", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "WM Motor", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Wuling", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Xiaomi Auto", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "XPeng", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Yangwang", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Yudo", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Zeekr", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Zhiji Auto", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        {marque: "Zotye", origine: "🌏 Asiatiques", pays: "CN", continent: "asie"},
        
        // Américaines 🇺🇸
        {marque: "Buick", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Cadillac", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Chevrolet", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Chrysler", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Dodge", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Fisker", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Ford", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "GMC", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Hummer", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Jeep", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Lincoln", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Lucid", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Pontiac", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Ram", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Rivian", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"},
        {marque: "Tesla", origine: "🇺🇸 Américaines", pays: "US", continent: "amerique"}
    ];

    // ============================================
    // GESTION IndexedDB
    // ============================================

    class DatabaseManager {
        constructor() {
            this.db = null;
        }

        async open() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);
                
                request.onerror = () => {
                    console.error('Erreur ouverture IndexedDB:', request.error);
                    reject(request.error);
                };
                
                request.onsuccess = () => {
                    this.db = request.result;
                    console.log('✅ IndexedDB ouvert avec succès');
                    resolve(this.db);
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    console.log('🔧 Mise à jour structure IndexedDB...');
                    
                    // Store Marques
                    if (!db.objectStoreNames.contains(CONFIG.STORES.MARQUES)) {
                        const marquesStore = db.createObjectStore(CONFIG.STORES.MARQUES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        marquesStore.createIndex('marque', 'marque', { unique: true });
                        marquesStore.createIndex('pays', 'pays', { unique: false });
                        marquesStore.createIndex('continent', 'continent', { unique: false });
                        console.log('  ✓ Store marques créé');
                    }
                    
                    // Store Véhicules
                    if (!db.objectStoreNames.contains(CONFIG.STORES.VEHICULES)) {
                        const vehiculesStore = db.createObjectStore(CONFIG.STORES.VEHICULES, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        vehiculesStore.createIndex('immatriculation', 'immatriculation', { unique: false });
                        vehiculesStore.createIndex('vin', 'vin', { unique: false });
                        vehiculesStore.createIndex('marque', 'marque', { unique: false });
                        console.log('  ✓ Store vehicules créé');
                    }
                    
                    // Store Interventions
                    if (!db.objectStoreNames.contains(CONFIG.STORES.INTERVENTIONS)) {
                        const interventionsStore = db.createObjectStore(CONFIG.STORES.INTERVENTIONS, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        interventionsStore.createIndex('vehiculeId', 'vehiculeId', { unique: false });
                        interventionsStore.createIndex('date', 'date', { unique: false });
                        console.log('  ✓ Store interventions créé');
                    }
                };
            });
        }

        async importMarques(marques) {
            if (!this.db) await this.open();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.MARQUES], 'readwrite');
                const store = transaction.objectStore(CONFIG.STORES.MARQUES);
                
                // Vider d'abord la table
                const clearRequest = store.clear();
                clearRequest.onerror = () => reject(new Error('Erreur nettoyage table marques'));
                
                let imported = 0;
                const total = marques.length;
                
                // Ajouter toutes les marques
                marques.forEach((marque, index) => {
                    const request = store.add({
                        marque: marque.marque,
                        origine: marque.origine,
                        pays: marque.pays,
                        continent: marque.continent,
                        dateImport: new Date().toISOString(),
                        actif: true
                    });
                    
                    request.onsuccess = () => {
                        imported++;
                        if (imported === total) {
                            console.log(`✅ ${imported} marques importées`);
                        }
                    };
                    
                    request.onerror = () => {
                        console.warn(`⚠️ Erreur import marque ${marque.marque}:`, request.error);
                    };
                });
                
                transaction.oncomplete = () => {
                    console.log('✅ Transaction import marques terminée');
                    resolve({ success: true, count: imported });
                };
                
                transaction.onerror = () => {
                    console.error('❌ Erreur transaction import:', transaction.error);
                    reject(transaction.error);
                };
            });
        }

        async getMarques() {
            if (!this.db) await this.open();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.MARQUES], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.MARQUES);
                const request = store.getAll();
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async getMarqueByName(nom) {
            if (!this.db) await this.open();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([CONFIG.STORES.MARQUES], 'readonly');
                const store = transaction.objectStore(CONFIG.STORES.MARQUES);
                const index = store.index('marque');
                const request = index.get(nom);
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async close() {
            if (this.db) {
                this.db.close();
                this.db = null;
                console.log('🔒 IndexedDB fermé');
            }
        }
    }

    // ============================================
    // FONCTION D'IMPORT PRINCIPALE
    // ============================================

    async function importerBaseMassive() {
        const statusDiv = document.getElementById('importStatus');
        const btnImport = document.getElementById('btnImportMassive');
        
        if (!statusDiv || !btnImport) {
            console.error('❌ Éléments HTML manquants (importStatus, btnImportMassive)');
            return;
        }
        
        try {
            btnImport.disabled = true;
            btnImport.textContent = '⏳ Import en cours...';
            
            updateStatus('🔌 Connexion à la base de données...', 'orange');
            
            const dbManager = new DatabaseManager();
            await dbManager.open();
            
            updateStatus(`📦 Import de ${MARQUES_DATABASE.length} marques en cours...`, 'orange');
            
            const result = await dbManager.importMarques(MARQUES_DATABASE);
            
            if (result.success) {
                updateStatus(
                    `✅ <strong>Import réussi !</strong><br>` +
                    `📊 ${result.count} marques importées dans IndexedDB<br>` +
                    `🔗 Source: <a href="${CONFIG.SOURCE_URL}" target="_blank">${CONFIG.SOURCE_URL}</a><br>` +
                    `<small>Rechargez la page pour voir les nouvelles marques dans les menus.</small>`,
                    'green'
                );
                
                console.log(`[${new Date().toISOString()}] ✅ Import réussi: ${result.count} marques`);
                
                // Recharger la page après confirmation
                setTimeout(() => {
                    if (confirm(`Import terminé !\n\n${result.count} marques ont été importées.\n\nVoulez-vous recharger la page pour voir les nouvelles marques ?`)) {
                        location.reload();
                    }
                }, 1500);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'import:', error);
            updateStatus(
                `❌ <strong>Erreur lors de l'import</strong><br>` +
                `<code>${error.message}</code><br>` +
                `<small>Vérifiez la console pour plus de détails.</small>`,
                'red'
            );
        } finally {
            btnImport.disabled = false;
            btnImport.textContent = '🚀 Importer depuis appli-aide-technique';
        }
    }

    function updateStatus(message, color) {
        const statusDiv = document.getElementById('importStatus');
        if (statusDiv) {
            statusDiv.innerHTML = message;
            statusDiv.style.color = color;
            statusDiv.style.fontWeight = 'bold';
        }
    }

    // ============================================
    // INITIALISATION
    // ============================================

    function initImportModule() {
        console.log('📥 Module import base massive initialisé');
        console.log(`📊 Base de données: ${MARQUES_DATABASE.length} marques disponibles`);
        console.log(`🔗 Source: ${CONFIG.SOURCE_URL}`);
        
        const btnImport = document.getElementById('btnImportMassive');
        if (btnImport) {
            btnImport.addEventListener('click', importerBaseMassive);
            console.log('✅ Bouton import attaché');
        } else {
            console.warn('⚠️ Bouton btnImportMassive non trouvé dans le HTML');
        }
    }

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImportModule);
    } else {
        initImportModule();
    }

    // Export pour utilisation externe
    window.ImportBaseMassive = {
        importer: importerBaseMassive,
        getDatabase: () => new DatabaseManager(),
        getMarques: () => MARQUES_DATABASE,
        config: CONFIG
    };

})();
