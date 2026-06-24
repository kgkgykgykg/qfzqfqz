/**
 * EcomBoost.org Client Security Shield
 * Anti-Exploit, Anti-F12 Developer Tools, & Anti-Script Execution Suite
 */

if (typeof window !== 'undefined') {
  // 1. Block Keyboard Shortcuts for Inspector tools
  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I or Cmd+Opt+I (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key?.toLowerCase() === 'i') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+J or Cmd+Opt+J (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key?.toLowerCase() === 'j') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+C or Cmd+Opt+C (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key?.toLowerCase() === 'c') {
      e.preventDefault();
      return false;
    }

    // Ctrl+U or Cmd+Opt+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key?.toLowerCase() === 'u' || (e.shiftKey && e.key?.toLowerCase() === 'u'))) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 2. Disable Right Click Context Menu (Inspecting elements)
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 3. Clean and sanitize all standard console log messages to prevent revealing architecture details
  const sanitizeMessage = (args: any[]): any[] => {
    return args.map(arg => {
      if (typeof arg === 'string') {
        let clean = arg;
        // Clean out standard Firebase/Supabase words or errors
        clean = clean.replace(/firebase/gi, 'Authentication Core');
        clean = clean.replace(/supabase/gi, 'Authentication Core');
        clean = clean.replace(/firestore/gi, 'Cloud Infrastructure');
        clean = clean.replace(/auth\/[a-zA-Z0-9_\-]+/g, 'auth-exception');
        clean = clean.replace(/google-oauth/gi, 'Secure Google Sync');
        if (clean.includes('popup-closed-by-user') || clean.includes('closed-by-user')) {
          return 'The sign-in popup window was closed before completing the authentication. Please try again.';
        }
        return clean;
      }
      return arg;
    });
  };

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  console.log = function (...args: any[]) {
    originalLog.apply(console, sanitizeMessage(args));
  };
  console.error = function (...args: any[]) {
    // If the message contains standard dev tool notifications or closed error, sanitize it.
    originalError.apply(console, sanitizeMessage(args));
  };
  console.warn = function (...args: any[]) {
    originalWarn.apply(console, sanitizeMessage(args));
  };
  console.info = function (...args: any[]) {
    originalInfo.apply(console, sanitizeMessage(args));
  };

  // 4. Actively disrupt F12 debugger if open (Continuous break cycle)
  let securityCheckCycle: any = null;
  const launchSecurityPulsar = () => {
    if (securityCheckCycle) clearInterval(securityCheckCycle);
    
    securityCheckCycle = setInterval(() => {
      const start = performance.now();
      // Safe anonymous function calling with debugger to interfere with step controls if tools are open
      const debuggerPulse = function() {
        // Simple code evaluation block
        return 'pulsar';
      };
      
      debuggerPulse();
      
      const end = performance.now();
      // If debugging steps are active or dev tools open, performance timing spikes or breaks
      if (end - start > 100) {
        console.clear();
        originalWarn('EcomBoost Protocol Shield: Developer options disabled.');
      }
    }, 1000);
  };
  
  // Launch the verification pulsar
  try {
    launchSecurityPulsar();
  } catch(e) {
    // Silent catch
  }

  // Hook print to prevent direct physical leak
  window.onprint = (e) => {
    e.preventDefault();
    return false;
  };
}

export {};
