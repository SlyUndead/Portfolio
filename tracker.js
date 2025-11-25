// analytics-tracker.js - Standalone Version
// This version sends data to a Google Sheet via Google Apps Script
// analytics-tracker.js - Debug Version with Better Error Logging

(async function() {
    // ⚠️ IMPORTANT: Replace this URL with your own Google Apps Script Web App URL
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxjcuWJOl7QimSZFbBiIFNwGGYeu0bshcRWFp-ep_xBLh8w_eTLCgft9-PU6-_4PIfQpQ/exec';

    // Function to get URL parameters
    function getURLParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utmSource: params.get('utm_source') || '',
            utmMedium: params.get('utm_medium') || '',
            utmCampaign: params.get('utm_campaign') || '',
            utmTerm: params.get('utm_term') || '',
            utmContent: params.get('utm_content') || ''
        };
    }

    // Function to get device info
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        let device = 'Desktop';
        
        if (/mobile/i.test(ua)) device = 'Mobile';
        else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
        
        return device;
    }

    // Function to get browser info
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'Chrome';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        
        return browser;
    }

    // Function to get approximate location (using a free IP API)
    async function getLocationData() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                ip: data.ip || 'Unknown',
                city: data.city || 'Unknown',
                region: data.region || 'Unknown',
                country: data.country_name || 'Unknown',
                countryCode: data.country_code || 'Unknown'
            };
        } catch (error) {
            console.log('Could not fetch location data:', error);
            return {
                ip: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                countryCode: 'Unknown'
            };
        }
    }

    // Track the visit
    async function trackVisit() {
        try {
            // Check if webhook URL is configured
            if (WEBHOOK_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
                console.log('⚠️ Analytics not configured. Please add your webhook URL.');
                console.log('Steps:');
                console.log('1. Deploy your Google Apps Script as a Web App');
                console.log('2. Copy the Web App URL');
                console.log('3. Replace WEBHOOK_URL in analytics-tracker.js');
                return;
            }

            console.log('🔄 Starting analytics tracking...');
            console.log('Webhook URL:', WEBHOOK_URL);

            // Get all data
            const urlParams = getURLParams();
            const locationData = await getLocationData();
            
            const visitData = {
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                referrer: document.referrer || 'Direct',
                currentPage: window.location.pathname,
                fullUrl: window.location.href,
                device: getDeviceInfo(),
                browser: getBrowserInfo(),
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                ...urlParams,
                ...locationData
            };

            console.log('📊 Visit data prepared:', visitData);

            // Try to send with better error handling
            console.log('📤 Sending data to Google Apps Script...');
            
            // First attempt: with no-cors (for deployed sites)
            try {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(visitData)
                });
                console.log('✅ Visit tracked successfully (no-cors mode)');
            } catch (noCorsError) {
                console.log('⚠️ no-cors failed, trying with cors...');
                
                // Second attempt: without no-cors (for testing)
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(visitData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Visit tracked successfully:', result);
                } else {
                    console.error('❌ Server responded with error:', response.status);
                }
            }

            // Log for development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🔍 Development mode - Full data:', visitData);
            }
            
        } catch (error) {
            console.error('❌ Error tracking visit:', error);
            console.error('Error details:', error.message);
            console.log('');
            console.log('Troubleshooting steps:');
            console.log('1. Check that your WEBHOOK_URL is correct');
            console.log('2. Make sure Google Apps Script is deployed as "Anyone can access"');
            console.log('3. Test the webhook URL directly in a browser');
        }
    }

    // Track when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }

    // Track time on page
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log(`⏱️ Time on page: ${timeSpent} seconds`);
    });
})();
// (async function() {
//     // ⚠️ IMPORTANT: Replace this URL with your own Google Apps Script Web App URL
//     // See setup instructions in the guide
//     const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzzBlBRdTbpBzvXogc4w0BX57L64dx4CvgyZU9psXwkHcoljRG4k3p-vLYK7XZ6M6SRfg/exec';

//     // Function to get URL parameters
//     function getURLParams() {
//         const params = new URLSearchParams(window.location.search);
//         return {
//             utmSource: params.get('utm_source') || '',
//             utmMedium: params.get('utm_medium') || '',
//             utmCampaign: params.get('utm_campaign') || '',
//             utmTerm: params.get('utm_term') || '',
//             utmContent: params.get('utm_content') || ''
//         };
//     }

//     // Function to get device info
//     function getDeviceInfo() {
//         const ua = navigator.userAgent;
//         let device = 'Desktop';
        
//         if (/mobile/i.test(ua)) device = 'Mobile';
//         else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
        
//         return device;
//     }

//     // Function to get browser info
//     function getBrowserInfo() {
//         const ua = navigator.userAgent;
//         let browser = 'Unknown';
        
//         if (ua.includes('Firefox')) browser = 'Firefox';
//         else if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'Chrome';
//         else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
//         else if (ua.includes('Edge')) browser = 'Edge';
        
//         return browser;
//     }

//     // Function to get approximate location (using a free IP API)
//     async function getLocationData() {
//         try {
//             const response = await fetch('https://ipapi.co/json/');
//             const data = await response.json();
//             return {
//                 ip: data.ip || 'Unknown',
//                 city: data.city || 'Unknown',
//                 region: data.region || 'Unknown',
//                 country: data.country_name || 'Unknown',
//                 countryCode: data.country_code || 'Unknown'
//             };
//         } catch (error) {
//             console.log('Could not fetch location data');
//             return {
//                 ip: 'Unknown',
//                 city: 'Unknown',
//                 region: 'Unknown',
//                 country: 'Unknown',
//                 countryCode: 'Unknown'
//             };
//         }
//     }

//     // Track the visit
//     async function trackVisit() {
//         try {
//             // Skip tracking if no webhook URL is configured
//             if (WEBHOOK_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
//                 console.log('⚠️ Analytics not configured. Please add your webhook URL.');
//                 return;
//             }

//             // Get all data
//             const urlParams = getURLParams();
//             const locationData = await getLocationData();
            
//             const visitData = {
//                 timestamp: new Date().toISOString(),
//                 date: new Date().toLocaleDateString(),
//                 time: new Date().toLocaleTimeString(),
//                 referrer: document.referrer || 'Direct',
//                 currentPage: window.location.pathname,
//                 fullUrl: window.location.href,
//                 device: getDeviceInfo(),
//                 browser: getBrowserInfo(),
//                 screenWidth: window.innerWidth,
//                 screenHeight: window.innerHeight,
//                 ...urlParams,
//                 ...locationData
//             };

//             // Send data to webhook
//             const response = await fetch(WEBHOOK_URL, {
//                 method: 'POST',
//                 mode: 'no-cors', // Required for Google Apps Script
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(visitData)
//             });

//             console.log('✅ Visit tracked successfully');
            
//             // Optional: Log to console in development
//             if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//                 console.log('Visit Data:', visitData);
//             }
//         } catch (error) {
//             console.error('❌ Error tracking visit:', error);
//         }
//     }

//     // Track when page loads
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', trackVisit);
//     } else {
//         trackVisit();
//     }

//     // Track time on page
//     let startTime = Date.now();
    
//     window.addEventListener('beforeunload', function() {
//         const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
//         console.log(`Time on page: ${timeSpent} seconds`);
//     });
// })();