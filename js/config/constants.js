/**
 * Global constants for RetroTerminal
 * Centralizes magic numbers and configuration values
 */
import { SQLTable_1, SQLTable_2, SQLTable_3 } from './constantsSQLTable.js';

// Scenario Definitions
export const SCENARIO_DEFINITIONS = {
    1: {
        diff: 1,
        time: 20 * 60,
        tasks: [
            { type: 'sql', config: { difficulty: 'easy', query: 'SELECT name FROM system', table: SQLTable_1 }},
            { type: 'negabinary', config: { length: 4 }},
            { type: 'ascii', config: { chars: 'HOPE' }},
            { type: 'final_exec', config: { script: 'shutdown.exe' }}
        ]
    },
    2: {
        diff: 2,
        time: 40 * 60,
        tasks: [
            { type: 'hamilton', config: { graphData: {
            "ALPHA":   { "BRAVO": 75, "CHARLIE": 90 },
            "BRAVO":   { "ALPHA": 75, "CHARLIE": 12, "DELTA": 65 },
            "CHARLIE": { "ALPHA": 90, "BRAVO": 12, "DELTA": 110 },
            "DELTA":   { "BRAVO": 65, "CHARLIE": 110 }
            }, startNode: "ALPHA", optimalPing: 167 } },
            { type: 'sql', config: { difficulty: 'medium', query: 'SELECT key FROM system WHERE id=6', table: SQLTable_2 }},
            { type: 'parity', config: { bits: 8, length: 16 }},
            { type: 'negabinary', config: { length: 6 }},
            { type: 'matrix', config: { size: 2 }},
            { type: 'final_exec', config: { script: 'shutdown.exe' }}
        ]
    },
    3: {
        diff: 3,
        time: 60 * 60,
        tasks: [
            { type: 'sql', config: { difficulty: 'hard', query: 'SELECT key FROM sys INNER JOIN tem ON sys.id = tem.id WHERE sys.id=12 ', table: SQLTable_3 }},
            { type: 'matrix', config: { size: 3 }},
            { type: 'hamilton', config: { graphData: {
            "ALPHA":   { "BRAVO": 55, "CHARLIE": 41, "ECHO": 12 },
            "BRAVO":   { "ALPHA": 55, "CHARLIE": 25, "DELTA": 18 },
            "CHARLIE": { "ALPHA": 41, "BRAVO": 25, "DELTA": 62 },
            "DELTA":   { "BRAVO": 18, "CHARLIE": 62, "FOXTROT": 30 },
            "ECHO":    { "ALPHA": 12, "FOXTROT": 34 },
            "FOXTROT": { "ECHO": 34, "DELTA": 30 }
            }, startNode: "ALPHA", optimalPing: 119 } },
            { type: 'negabinary', config: { length: 16 }},
            { type: 'hex', config: { mode: 'full-word' }},
            { type: 'xor', config: { keyLength: 8 }},
            { type: 'final_exec', config: { script: 'shutdown.exe' }}
        ]
    },
    4: { //tutorial
        diff: 4,
        time : 10 * 60,
        tasks: [
            { type: 'hex', config: { mode: 'single-char' }},
            { type: 'final_exec', config: { script: 'shutdown.exe' }}
        ]
    }
};

//Task Hints
export const TASK_HINTS_DATABASE = {
    // =========================================================
    // 1: CAN I HACK, DADDY? 
    // =========================================================
    1: {
        'sql': {
            fileToUnlock: 'var/lib', 
            targetFile: 'var/lib/p_vault.dbase',
            content: "[LOG: 12.04] Jeśli to czytasz, to znaczy, że zablokowano mi dostęp. Zostawiłem ci furtkę w systemie plików.\nWejdź do bazy i wydobądź ukryte dane, abyś mógł ruszyć dalej.\nZostawiłem stary szkic schematu w /usr/share/docs/rel_schema.jpg. Pospiesz się."
        },
        'negabinary': {
            fileToUnlock: 'etc/init.d', 
            targetFile: 'etc/init.d/arch_neg.ini',
            content: "[LOG: URZĄDZENIE ZASILAJĄCE] Przełączyłem zasilanie na stary bezpiecznik NegaBinary (baza -2), aby zmylić algorytmy tropiące.\nMusisz przeliczyć odczyt z rejestru na normalny system dziesiętny. Notatki schowałem tutaj: /usr/share/docs/base_m2.man"
        },
        'ascii': {
            fileToUnlock: 'usr/spool', 
            targetFile: 'usr/spool/comm_raw.txt',
            content: "[PRZECHWYCONA TRANSMISJA] Udało mi się wyrwać to z bufora, zanim ucięto sygnał.\nMusisz zdekodować te wartości. Tabela ASCII wisi tam, gdzie zawsze: /usr/share/docs/std_enc.man."
        },
        'final_exec': {
            fileToUnlock: 'bin/shutdown.exe',
            targetFile: 'bin/shutdown.exe',
            content: "Udało ci się. Masz dostęp, ale czas ucieka.\nMusisz uruchomić shutdown.exe, aby zatrzeć ślady."
        }
    },

    // =========================================================
    // 2: BRING 'EM ON! 
    // =========================================================
    2: {
        'hamilton': {
            fileToUnlock: 'net/conf',
            targetFile: 'net/conf/route_v4.conf',
            content: "[OSTRZEŻENIE] System cię namierza. Zablokowałem routing, musisz wytyczyć ścieżkę Hamiltona ręcznie.\nOtwórz starą mapę topologii: /net/maps/topo_active_v4.jpg.\nZnajdź drogę przez wszystkie węzły, przechodząc przez każdy dokładnie jeden raz. Liczę na ciebie."
        },
        'sql': {
            fileToUnlock: 'var/lib',
            targetFile: 'var/lib/p_vault.dbase',
            content: "[DANE KRYTYCZNE] Potrzebujesz tego konkretnego wpisu. Zszedłem głębiej do bazy.\nMusisz skonstruować odpowiednią kwerendę, by to wyciągnąć. \nPamiętam jedynie, że uwielbiałem z nim grać w golfa... \nSprawdź schemat w /usr/share/docs/rel_schema.jpg. Nie pomyl się."
        },
        'parity': {
            fileToUnlock: 'var/log',
            targetFile: 'var/log/err_parity.log',
            content: "[LOG KRYTYCZNY] Logi uległy uszkodzeniu podczas próby wyśledzenia mojego sygnału. Został tylko strzęp danych.\nBrakuje ostatniego bitu parzystości. Sprawdź manual (/usr/share/docs/err_corr.man) i zrekonstruuj ten sektor. Musisz dowiedzieć się, co tam ukryto."
        },
        'negabinary': {
            fileToUnlock: 'etc/init.d',
            targetFile: 'etc/init.d/arch_neg.ini',
            content: "[ZASILANIE GŁÓWNE] Moduł zasilania jest chroniony przez zaawansowaną blokadę NegaBinary.\nMusisz przeliczyć ten ciąg na system dziesiętny, aby odzyskać kontrolę. W razie problemów otwórz plik /usr/share/docs/base_m2.man."
        },
        'matrix': {
            fileToUnlock: 'etc/ssl', 
            targetFile: 'etc/ssl/m_cert.pem',
            content: "[KRYPTOGRAFIA] Aktywowano blokadę przestrzenną. To szyfr macierzowy.\nMusisz to rozwiązać i podać wyznacznik.\nWzór znajduje się pod /usr/share/docs/spatial_det.jpg. Nie zawiedź mnie."
        },
        'final_exec': {
            fileToUnlock: 'bin/shutdown.exe',
            targetFile: 'bin/shutdown.exe',
            content: "Udało ci się zdobyć dostęp do roota. Jesteś o krok. Uruchom shutdown.exe i znikaj."
        }
    },

    // =========================================================
    // 3: I AM ROOT INCARNATE!
    // =========================================================
    3: {
        'sql': {
            fileToUnlock: 'var/lib',
            targetFile: 'var/lib/p_vault.dbase',
            content: "[OSTATNI BASTION] Jeśli tu dotarłeś, to znaczy, że system nie zdążył mnie powstrzymać.\nMusisz połączyć odpowiednie tabele, aby wyciągnąć klucz. Użyj schematu /usr/share/docs/rel_schema.jpg. \n ~~Oskar"
        },
        'matrix': {
            fileToUnlock: 'etc/ssl',
            targetFile: 'etc/ssl/m_cert.pem',
            content: "[KRYPTOGRAFIA] Krytyczny poziom przestrzenny.\nMusisz obliczyć wyznacznik zaawansowanej macierzy. Wzór znajdziesz w /usr/share/docs/spatial_det.jpg.\nTo jest właściwy klucz."
        },
        'hamilton': {
            fileToUnlock: 'net/conf',
            targetFile: 'net/conf/route_v4.conf',
            content: "[ODCIĘCIE SIECI] Protokół bezpieczeństwa wygenerował pełno ślepych zaułków w /net/maps/topo_active_v6.jpg.\nWyznacz pełny i najszybszy cykl Hamiltona w sieci. Uważaj na fałszywe ścieżki. Na pewno potrafisz to dostrzec."
        },
        'negabinary': {
            fileToUnlock: 'etc/init.d', 
            targetFile: 'etc/init.d/arch_neg.ini',
            content: "[RDZEŃ ZASILANIA] Wszystko albo nic. Główny klucz zasilania został ukryty w kodzie NegaBinary.\nMusisz go przeliczyć na system dziesiętny. Dasz radę. Szukaj wskazówek w /usr/share/docs/base_m2.man."
        },
        'hex': {
            fileToUnlock: 'var/crash',
            targetFile: 'var/crash/dump_0x4a.hex',
            content: "[KRYTYCZNY ZRZUT] Zrobiłem zrzut pamięci przed samym krachem.\nMusisz przetłumaczyć go na tekst (ściąga: /usr/share/docs/base16.man). To najważniejsza wartość ze wszystkich."
        },
        'xor': {
            fileToUnlock: 'etc/ssl',
            targetFile: 'etc/ssl/x_gate.enc',
            content: "[BRAMA] Ostatni zamek. Aktywowano bramkę logiczną XOR.\nMusisz zdekodować ukryty ciąg. Instrukcja znajduje się w /usr/share/docs/bool_log.man."
        },
        'final_exec': {
            fileToUnlock: 'bin/shutdown.exe',
            targetFile: 'bin/shutdown.exe',
            content: "Zrobiłeś to. Masz rdzeń. Wykonaj shutdown.exe. Zakończ projekt 'Cisza'. Powodzenia."
        }
    },

    // =========================================================
    // 4: TUTORIAL
    // =========================================================
    4: {
        'hex': {
            fileToUnlock: 'var/crash',
            targetFile: 'var/crash/dump_0x4a.hex',
            content: "Wiedziałem, że kiedyś tu trafisz. Musisz zacząć od czegoś prostego, aby ożywić system.\nTabela pomocnicza schowana jest w /usr/share/docs/base16.man. Pokaż, na co cię stać."
        },
        'final_exec': {
            fileToUnlock: 'bin/shutdown.exe',
            targetFile: 'bin/shutdown.exe',
            content: "Rozgrzewka za tobą. Uruchom shutdown.exe i przygotuj się na to, co nadejdzie. Zaczynaj."
        }
    }
};

// Audio Configuration
export const AUDIO = {
  POOL_SIZE: 6,  // Number of audio instances to prevent sound cutoff
  DEFAULT_VOLUME: 0.3,
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  STEP_VOLUME: 0.1
};

// Font Configuration
export const FONT = {
  SIZE_MIN: 10,     // Minimum readable font size (px)
  SIZE_MAX: 25,     // Maximum comfortable font size (px)
  SIZE_DEFAULT: 16, // Default font size (px)
  SIZE_STEP: 0.5,   // Font size increment step
  FAMILIES: ['Courier New', 'Roboto Mono', 'Fira Code', 'monospace']
};

// Text Animation Configuration
export const ANIMATION = {
  DELAY_DEFAULT: 10,  // Default animation delay (ms)
  THRESHOLDS: {
    SHORT: 50,        // Characters threshold for short text
    MEDIUM: 100       // Characters threshold for medium text
  },
  SPEED_MULTIPLIERS: {
    SHORT: 1,         // 1x speed for short text
    MEDIUM: 10,       // 10x speed for medium text
    LONG: 20,         // 20x speed for long text
    TUTORIAL: 0.5     // 0.5x speed for tutorial text
  },
};

// Theme Configuration
export const THEMES = ['Orange', 'Green', 'Red'];
export const DEFAULT_THEME = 'Orange';

// Storage Keys
export const STORAGE_KEY = 'retro-terminal-settings';

// DOM Element IDs
export const DOM_IDS = {
  TERMINAL_INPUT: 'terminal-input',
  TERMINAL_OUTPUT: 'terminal-output',
  INPUT_PREFIX: 'input-prefix'
};