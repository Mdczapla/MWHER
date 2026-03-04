import { TASK_HINTS_DATABASE } from '../config/constants.js';
import { HINT_CONTENT } from '../config/constantsHintContent.js';

const { ascii, parity, hex, negabinary, xor } = HINT_CONTENT;

// Virtual File System (VFS)
const fileTree = {
  type: 'dir', name: 'root',
  children: {
    'bin': { 
      type: 'dir', name: 'bin', locked: false,
      children: {
        'shutdown.exe': { type: 'exe', name: 'shutdown.exe', locked: true }
      }
    },
    'etc': { 
      type: 'dir', name: 'etc', locked: true,
      children: {
        'init.d': {
          type: 'dir', name: 'init.d', locked: false,
          children: {
            'arch_neg.ini': { type: 'txt', name: 'arch_neg.ini', content: "" }
          }
        },
        'ssl': {
          type: 'dir', name: 'ssl', locked: true,
          children: {
            'm_cert.pem': { type: 'txt', name: 'm_cert.pem', content: "" },
            'x_gate.enc': { type: 'txt', name: 'x_gate.enc', content: "" }
          }
        }
      }
    },
    'var': { 
      type: 'dir', name: 'var', locked: true,
      children: {
        'lib': {
          type: 'dir', name: 'lib', locked: false,
          children: {
            'p_vault.dbase': { type: 'txt', name: 'p_vault.dbase', content: "" }
          }
        },
        'crash': {
          type: 'dir', name: 'crash', locked: false,
          children: {
            'dump_0x4a.hex': { type: 'txt', name: 'dump_0x4a.hex', content: "" }
          }
        },
        'log': {
          type: 'dir', name: 'log', locked: false,
          children: {
            'err_parity.log': { type: 'txt', name: 'err_parity.log', content: "" }
          }
        }
      }
    },
    'usr': { 
      type: 'dir', name: 'usr', locked: false,
      children: {
        'spool': {
          type: 'dir', name: 'spool', locked: true,
          children: {
            'comm_raw.txt': { type: 'txt', name: 'comm_raw.txt', content: "" }
          }
        },
        'share': {
          type: 'dir', name: 'share', locked: false,
          children: {
            'docs': { 
              type: 'dir', name: 'docs', locked: false,
              children: {
                'std_enc.man': { type: 'man', name: 'std_enc.man', hidden: true, content: ascii.terminal_view },
                'err_corr.man': { type: 'man', name: 'err_corr.man', hidden: true, content: parity.terminal_view },
                'base16.man': { type: 'man', name: 'base16.man', hidden: true, content: hex.terminal_view },
                'rel_schema.jpg': { type: 'jpg', name: 'rel_schema.jpg', hidden: true },
                'spatial_det.jpg': { type: 'jpg', name: 'spatial_det.jpg', hidden: true },
                'base_m2.man': { type: 'man', name: 'base_m2.man', hidden: true, content: negabinary.terminal_view },
                'bool_log.man': { type: 'man', name: 'bool_log.man', hidden: true, content: xor.terminal_view }
              }
            }
          }
        }
      }
    },
    'net': { 
      type: 'dir', name: 'net', locked: true,
      children: {
        'conf': {
          type: 'dir', name: 'conf', locked: false,
          children: {
            'route_v4.conf': { type: 'txt', name: 'route_v4.conf', content: "" }
          }
        },
        'maps': {
          type: 'dir', name: 'maps', locked: false,
          children: {
            'topo_active_v4.jpg': { type: 'jpg', name: 'topo_active_v4.jpg', hidden: true },
            'topo_active_v6.jpg': { type: 'jpg', name: 'topo_active_v6.jpg', hidden: true }
          }
        }
      }
    }
  }
};

const channel = new BroadcastChannel('mher_sync');

let state = { 
  path: ['root'], 
  currentlyUsing: null 
};

/**
 * Resolve the current path in the virtual file system and return the corresponding node
 * @returns {object|null} The file or directory node at the current path, or null if not found
 */
export function resolvePath() {
  let node = fileTree;

  for (let i = 1; i < state.path.length; i++) {
    const part = state.path[i];
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  
  return node;
}

/**
 * Changing directory ('cd').
 * @param {string} target - file name, '..' (up) or '/' (root).
 * @returns {string} returns empty string for success or error message for failure
 */
export function changeDirectory(target) {
  if (!target) return '';
  target = target.trim();

  if (target === '/' || target === 'root') {
    state.path = ['root'];
    channel.postMessage({
      type: 'COMMAND_CD',
      payload: { path: state.path }
    });
    return '';
  }

  let tempPath = target.startsWith('/') ? ['root'] : [...state.path];
  const parts = target.split('/').filter(p => p !== '' && p !== '.');

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part === '..') {
      if (tempPath.length > 1) {
        tempPath.pop();
      }
      continue;
    }

    let currentNode = fileTree; 
    for (let j = 1; j < tempPath.length; j++) {
      currentNode = currentNode.children[tempPath[j]];
    }
    
    if (!currentNode.children || !currentNode.children[part]) {
      return `cd: ${target}: Nie ma takiego pliku ani katalogu.`;
    }

    const nextNode = currentNode.children[part];

    if (nextNode.type !== 'dir') {
      return `cd: ${target}: Nie jest katalogiem.`;
    }

    if (nextNode.locked) {
      return `cd: ${target}: Odmowa dostępu (${part}).`;
    }

    tempPath.push(part);
  }

  state.path = tempPath;
  channel.postMessage({
    type: 'COMMAND_CD',
    payload: { path: state.path }
  });
  
  return '';
}

const textTypes = ['txt', 'ascii', 'log', 'man'];

/**
 * Sets file as being used ('open', 'cat', 'view').
 * @param {string} target - File name
 * @returns {string} File content or message
 */
export function openFile(target) {
  const currentNode = resolvePath();

  if (!currentNode.children || !currentNode.children[target]) {
    return `BŁĄD: Nie znaleziono pliku '${target}'.`;
  }

  const targetNode = currentNode.children[target];

  if (targetNode.type === 'dir') {
    return `BŁĄD: '${target}' jest katalogiem. Użyj komendy 'cd', aby do niego wejść.`;
  }

  if (targetNode.locked) {
    return `BŁĄD: Odmowa dostępu. Plik '${target}' jest zablokowany.`;
  }

  state.currentlyUsing = targetNode;

  
  channel.postMessage({
    type: 'OPEN_FILE',
    payload: {
      name: targetNode.name,
      type: targetNode.type,
      content: targetNode.content || 'pusto'
    }
  });

  
  
  if (textTypes.includes(targetNode.type)) {
    return `[SYSTEM]: Odczytywanie pliku: ${targetNode.name}...`;
  } else if (targetNode.type === 'jpg') {
    return `[SYSTEM]: Inicjalizacja podglądu obrazu: ${targetNode.name}... (Wpisz 'exit', aby zamknąć)`;
  } else if (targetNode.type === 'exe') {
    return `[SYSTEM]: Uruchamianie procedury wykonywalnej...`;
  }
  
  return `[SYSTEM]: Otwarto plik: ${targetNode.name}.`;
}

export function closeFile() {

  if(!state.currentlyUsing){
    return "[SYSTEM]: Brak otwartego pliku";
  }else if (state.currentlyUsing.type === 'jpg') {
    const name = state.currentlyUsing.name;
    state.currentlyUsing = null;
    channel.postMessage({
      type: 'CLOSE_FILE',
    })
    return `[SYSTEM]: Zamknięto obrazek: '${name}'.`;
  }else if (textTypes.includes(state.currentlyUsing.type)) {
    const name = state.currentlyUsing.name;
    state.currentlyUsing = null;
    channel.postMessage({
      type: 'CLOSE_FILE',
    })
    return `[SYSTEM]: Zamknięto plik: '${name}'.`;
  }
  return '';
}
/**
 * Returns node by provided path (e.g. "var/lib/p_vault.dbase")
 */
function getNodeByPath(path) {
  const parts = path.split('/');
  let currentNode = fileTree;
  
  for (const part of parts) {
    if (currentNode.children && currentNode.children[part]) {
      currentNode = currentNode.children[part];
    } else {
      return null;
    }
  }
  return currentNode;
}

let currentDiff = null;

channel.onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SCENARIO_LOADED':
      currentDiff = payload.diff;
      if (!TASK_HINTS_DATABASE[currentDiff]) {
        console.error(`[VFS] Brak konfiguracji w bazie dla diff: ${currentDiff}`);
        return;
      }
      const scenarioHints = TASK_HINTS_DATABASE[currentDiff];
      
      Object.keys(scenarioHints).forEach(taskKey => {
        const taskData = scenarioHints[taskKey];
        if (taskData && taskData.targetFile) {
          const fileNode = getNodeByPath(taskData.targetFile);
          if (fileNode) {
            fileNode.content = taskData.content;
          }
        }
      });
      
      console.log(`[VFS] Pomyślnie załadowano treści plików dla poziomu: ${currentDiff}`);
      break;
    case 'TASK_START':
      const taskName = payload.name.toLowerCase();
      
      if (!currentDiff || !TASK_HINTS_DATABASE[currentDiff]) return;

      const taskData = TASK_HINTS_DATABASE[currentDiff][taskName];
      
      if (taskData && taskData.fileToUnlock) {
        const nodeToUnlock = getNodeByPath(taskData.fileToUnlock);
        if (nodeToUnlock) {
          nodeToUnlock.locked = false;
          console.log(`[VFS] Odblokowano zasób: /${taskData.fileToUnlock} (Zadanie: ${taskName})`);
        } else {
          console.warn(`[VFS] BŁĄD ODBLOKOWANIA: Nie znaleziono /${taskData.fileToUnlock}`);
        }
      }
      break;
    case 'COMMAND_CD':
      if (payload && payload.path) {
        state.path = payload.path;
        console.log(`[VFS] Zsynchronizowano ścieżkę:`, state.path);
      }
      break;
  }
};

/**
 * Returns Array of Strings for displaying visualization of VFS
 * @returns {string[]} Array of strings
 */
export function getTreeStructure() {
  const result = ["------VIEW------\n"];
  
  const currentNode = resolvePath();

  function traverse(node, prefix = '', isLast = true, isRoot = true) {
  const branch = isRoot ? '' : (isLast ? '└── ' : '├── ');
  const typeIndicator = node.type === 'dir' ? '/' : '';
  const lockIndicator = node.locked ? ' [LOCKED]' : '';

  const isCurrent = (node === currentNode);
  const currentIndicator = isCurrent ? '  <-- [AKTUALNA POZYCJA]' : '';

  result.push(`${prefix}${branch}${node.name}${typeIndicator}${lockIndicator}${currentIndicator}\n`);

  if (node.type === 'dir' && node.children) {
    const visibleKeys = Object.keys(node.children).filter(key => {
      const childNode = node.children[key];
      return !childNode.hidden && !childNode.locked;
    });
    
    visibleKeys.forEach((key, index) => {
      const childIsLast = index === visibleKeys.length - 1;
      const newPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');
      
      traverse(node.children[key], newPrefix, childIsLast, false);
    });
  }
}

traverse(fileTree);
return result;
}