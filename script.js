/**
 * El Bypasser 3000 - Core Logic
 * Maneja la carga de sitios e interceptación de eventos de bloqueo.
 */

const urlInput = document.getElementById('url-input');
const frame = document.getElementById('target-frame');
const placeholder = document.getElementById('placeholder');
const statusMsg = document.getElementById('status-msg');

/**
 * Muestra mensajes de estado en la UI
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
    showStatus('🚀 CARGANDO OBJETIVO... LISTO PARA EL BYPASS');
}

/**
 * Activa la fase de captura para detener preventDefault()
 */
function bypassListeners() {
    // Código que se intenta inyectar o ejecutar localmente
    const scriptStr = `
        (function() {
            const handler = (e) => e.stopPropagation();
            document.addEventListener('contextmenu', handler, true);
            document.addEventListener('copy', handler, true);
            document.addEventListener('selectstart', handler, true);
            console.log('El Bypasser 3000 ha neutralizado los listeners.');
        })();
    `;
    
    try {
        // Enviar mensaje al iframe (requiere que el sitio permita comunicación)
        frame.contentWindow.postMessage({ type: 'unlock_scripts', code: scriptStr }, '*');
        
        // Aplicar bypass en el nivel superior también
        document.addEventListener('contextmenu', e => e.stopPropagation(), true);
        document.addEventListener('copy', e => e.stopPropagation(), true);
        document.addEventListener('selectstart', e => e.stopPropagation(), true);
        
        showStatus('🔥 BYPASS ACTIVADO. Prueba el clic derecho ahora.', 'success');
    } catch (e) {
        showStatus('❌ ERROR DE ORIGEN: Usa el comando manual de la derecha.', 'error');
    }
}

/**
 * Fuerza la selección de texto mediante inyección de CSS
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
        showStatus('✅ CSS DESBLOQUEADO: Selección habilitada.', 'success');
    } catch (e) {
        console.error("No se pudo aplicar el CSS de fuerza bruta.");
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
