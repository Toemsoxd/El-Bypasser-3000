/**
 * El Bypasser 3000 - Core Logic (PRO Edition)
 * Maneja la carga de sitios e interceptación de eventos de bloqueo mediante bypass de prototipos.
 */

const urlInput = document.getElementById('url-input');
const frame = document.getElementById('target-frame');
const placeholder = document.getElementById('placeholder');
const statusMsg = document.getElementById('status-msg');

/**
 * Muestra mensajes de estado en la UI con estilo hacker
 */
function showStatus(text, type = 'info') {
    statusMsg.textContent = text;
    const colors = {
        info: 'bg-blue-900/50 text-blue-400 border border-blue-800/50',
        error: 'bg-red-900/50 text-red-400 border border-red-800/50',
        success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50'
    };
    statusMsg.className = `block mb-4 p-3 rounded-lg text-sm text-center font-bold uppercase tracking-wide ${colors[type]}`;
    
    // Auto-ocultar después de 6 segundos
    setTimeout(() => { statusMsg.className = 'hidden'; }, 6000);
}

/**
 * Carga la URL en el iframe
 */
function loadSite() {
    let url = urlInput.value.trim();
    if (!url) return showStatus('⚠️ ERROR: Ingresa una URL primero', 'error');
    
    // Asegurar protocolo
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    placeholder.style.display = 'none';
    frame.src = url;
    showStatus('🚀 CARGANDO OBJETIVO... LISTO PARA EL BYPASS PRO');
}

/**
 * Activa la fase de captura y anula el preventDefault() a nivel de prototipo
 */
function bypassListeners() {
    // Este código ataca la raíz del problema: la función preventDefault() misma
    const scriptStr = `
        (function() {
            // Técnica de Fuerza Bruta: Anular preventDefault en el prototipo del Evento
            const originalPreventDefault = Event.prototype.preventDefault;
            Event.prototype.preventDefault = function() {
                // Si el evento es de los que queremos liberar, ignoramos el bloqueo
                const blockedEvents = ['contextmenu', 'copy', 'selectstart', 'dragstart'];
                if (blockedEvents.includes(this.type)) {
                    console.log('Bypasser 3000: Bloqueo interceptado para evento ' + this.type);
                    return; 
                }
                return originalPreventDefault.apply(this, arguments);
            };

            // Aseguramos la fase de captura para detener propagación de otros listeners
            const handler = (e) => e.stopPropagation();
            ['contextmenu', 'copy', 'selectstart'].forEach(evt => {
                document.addEventListener(evt, handler, true);
            });

            console.log('El Bypasser 3000 PRO ha neutralizado los prototipos de bloqueo.');
        })();
    `;
    
    try {
        // Intentar inyección en el iframe (si el origen lo permite)
        frame.contentWindow.postMessage({ type: 'unlock_scripts', code: scriptStr }, '*');
        
        // Aplicar el bypass de prototipos localmente también
        const originalPreventDefault = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function() {
            if (['contextmenu', 'copy', 'selectstart'].includes(this.type)) return;
            return originalPreventDefault.apply(this, arguments);
        };

        // Detener propagación en fase de captura
        document.addEventListener('contextmenu', e => e.stopPropagation(), true);
        document.addEventListener('copy', e => e.stopPropagation(), true);
        document.addEventListener('selectstart', e => e.stopPropagation(), true);
        
        showStatus('🔥 BYPASS PRO ACTIVADO: Prototipos de eventos anulados.', 'success');
    } catch (e) {
        showStatus('❌ RESTRICCIÓN DE SEGURIDAD: Usa el comando manual de la consola.', 'error');
    }
}

/**
 * Fuerza la selección de texto mediante inyección de CSS agresivo
 */
function forceEnableCSS() {
    try {
        const style = document.createElement('style');
        style.innerHTML = `
            * { 
                -webkit-user-select: text !important; 
                -moz-user-select: text !important; 
                -ms-user-select: text !important;
                user-select: text !important; 
                cursor: auto !important;
            }
        `;
        document.head.appendChild(style);
        showStatus('✅ CSS DESBLOQUEADO: Selección habilitada por fuerza bruta.', 'success');
    } catch (e) {
        console.error("Error al inyectar CSS.");
    }
}

/**
 * Limpia el estado de la aplicación
 */
function clearIframe() {
    frame.src = "about:blank";
    placeholder.style.display = 'flex';
    urlInput.value = '';
    showStatus('🧹 SISTEMA RESETEADO');
}

/**
 * Event Listener para la tecla Enter
 */
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadSite();
    }
});
