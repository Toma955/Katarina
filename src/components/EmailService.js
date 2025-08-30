// src/components/EmailService.js
import emailjs from '@emailjs/browser';

// EmailJS konfiguracija
const EMAILJS_SERVICE_ID = 'service_iwt8v2d';
const EMAILJS_TEMPLATE_ID = 'template_dszdehd';
const EMAILJS_PUBLIC_KEY = '3AMTXipsxA2xeCi_5';

// Email konfiguracija - OVDJE SE ŠALJU OBAVIJESTI
const NOTIFICATION_EMAIL = 'tomas.babich75@gmail.com';

export const sendEmail = async (userResponse, userChoice, additionalData = {}) => {
  try {
    // Check if EmailJS is initialized
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS is not loaded!');
    }
    
    // Initialize EmailJS if not already initialized
    if (!emailjs.isInit) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    
    // Collect user information
    const userInfo = {
      // Screen dimensions
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      
      // Device info
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookie_enabled: navigator.cookieEnabled,
      
      // Time info
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      local_time: new Date().toLocaleString(),
      
      // Connection info
      connection_type: navigator.connection ? navigator.connection.effectiveType : 'Unknown',
      online_status: navigator.onLine ? 'Online' : 'Offline'
    };

    const templateParams = {
      // EmailJS template parametri - OBAVEZNI za slanje email-a
      // Pokušavamo različite varijante parametara koje EmailJS može očekivati
      to_name: 'Tomas Babich',
      to_email: NOTIFICATION_EMAIL,
      from_name: 'KatarinaApp',
      from_email: 'noreply@katarinaapp.com',
      
      // Alternativni parametri koje EmailJS može očekivati
      recipient_name: 'Tomas Babich',
      recipient_email: NOTIFICATION_EMAIL,
      sender_name: 'KatarinaApp',
      sender_email: 'noreply@katarinaapp.com',
      
      // Dodatni parametri koje EmailJS može očekivati
      reply_to: NOTIFICATION_EMAIL,
      user_email: NOTIFICATION_EMAIL,
      email: NOTIFICATION_EMAIL,
      contact_email: NOTIFICATION_EMAIL,
      
      // Sadržaj emaila
      user_response: userResponse,
      user_choice: userChoice,
      timestamp: new Date().toISOString(),
      app_name: 'KatarinaApp - Svemirski Romantični WebApp',
      
      // User device info - pojednostavljeno
      screen_info: `${userInfo.screen_width}x${userInfo.screen_height}`,
      device_info: userInfo.platform,
      browser_info: userInfo.user_agent,
      timezone_info: userInfo.timezone,
      connection_info: userInfo.online_status,
      cookie_status: userInfo.cookie_enabled ? 'Enabled' : 'Disabled'
    };

    // EmailJS OBAVEZNO treba to_email parametar
    const finalParams = {
      ...templateParams
    };
    
    // Šaljemo sve parametre uključujući to_email
    const emailParams = {
      ...finalParams
    };
    
    // Provjeri da li su obavezni parametri postavljeni
    if (!emailParams.to_email || !emailParams.to_name) {
      throw new Error('to_email ili to_name parametri nisu postavljeni');
    }
    
    // Dodatna provjera - EmailJS može očekivati bilo koji od ovih parametara
    const hasValidEmail = emailParams.to_email || emailParams.recipient_email || 
                         emailParams.user_email || emailParams.email || 
                         emailParams.contact_email || emailParams.reply_to;
    
    if (!hasValidEmail) {
      throw new Error('Nijedan email parametar nije postavljen');
    }
    
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams,
      EMAILJS_PUBLIC_KEY
    );
    
    return { success: true, message: 'Email poslan!', result: result };
  } catch (error) {
    // Ako je problem s recipient adresom, dajemo specifičnu poruku
    if (error.text && error.text.includes('recipients address is empty')) {
      return { 
        success: false, 
        message: 'EmailJS template nije ispravno konfiguriran - nedostaje recipient adresa. Provjeri template konfiguraciju.' 
      };
    }
    
    return { success: false, message: 'Greška pri slanju emaila' };
  }
};

export const EmailService = {
  sendUserResponse: async (isPositive) => {
    const response = isPositive ? 'DA - Korisnik je pristao' : 'NE - Korisnik je odbio';
    const choice = isPositive ? 'Pozitivan odgovor' : 'Negativan odgovor';
    
    try {
      const result = await sendEmail(response, choice);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default EmailService;
