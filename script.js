// WARNING: This OTP implementation is for demonstration ONLY. It is NOT secure.
// For a real application, OTP generation and verification MUST be done on a server.
let generatedOTP = "";

function sendOTP() {
  const contact = document.getElementById("signup-contact").value;
  const name = document.getElementById("signup-name").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !contact || !password) {
    alert("Please fill all fields!");
    return;
  }

  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  // In a real app, this alert would be replaced with a server call to send the OTP via SMS/Email.
  alert("DEMO ONLY - OTP sent to " + contact + ": " + generatedOTP);
  document.getElementById("otp-section").style.display = "block";
}

function verifyOTP() {
  const otp = document.getElementById("otp-input").value;
  if (otp === generatedOTP) {
    alert("User Registered Successfully!");
    window.location.href = "landing.html";
  } else {
    alert("Invalid OTP, try again!");
  }
}

function loginUser() {
  const contact = document.getElementById("login-contact").value;
  const password = document.getElementById("login-password").value;

  // WARNING: This is also insecure. Real login validation must happen on the server.
  if (contact && password) {
    alert("Login successful!");
    window.location.href = "landing.html";
  } else {
    alert("Enter login details!");
  }
}

function showLogin() {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}

function showSignup() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
}

const profile = document.getElementById("profile");
const sidebar = document.getElementById("sidebar");

// Check if profile and sidebar exist before adding event listeners
// This prevents errors on pages where they don't exist.
if (profile && sidebar) {
  profile.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
  document.addEventListener("click", (event) => {
    if (sidebar.classList.contains("active") && !sidebar.contains(event.target) && event.target !== profile) {
      sidebar.classList.remove("active");
    }
  });
}

// START: AYU-Sync Tool Logic
document.addEventListener('DOMContentLoaded', () => {
  const lookupInput = document.getElementById('lookup-input');
  // This check ensures the code only runs on the landing page where the tool exists.
  if (lookupInput) {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const LOOKUP_MIN_CHARS = 3;

    const lookupResults = document.getElementById('lookup-results');
    const translateInput = document.getElementById('translate-input');
    const translateBtn = document.getElementById('translate-btn');
    const translateResult = document.getElementById('translate-result');

    const displayMessage = (element, text, type = 'message') => {
      // CORRECTED: Using backticks for the template literal
      element.innerHTML = `<p class="${type}">${text}</p>`;
    };

    const handleLookup = async () => {
      const query = lookupInput.value.trim();
      if (query.length < LOOKUP_MIN_CHARS) {
        lookupResults.innerHTML = '';
        return;
      }
      try {
        // CORRECTED: Using backticks for the template literal
        const response = await fetch(`${API_BASE_URL}/lookup?q=${encodeURIComponent(query)}`);
        // CORRECTED: Using backticks for the template literal
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const data = await response.json();
        if (data.length === 0) {
          displayMessage(lookupResults, 'No matching terms found.');
        } else {
          lookupResults.innerHTML = data.map(item => `
            <div class="result-item">
              <strong>${item.NAMASTE_Term}</strong> (NAMASTE: ${item.NAMASTE_Code})
              &harr;
              <strong>${item.ICD11_Term}</strong> (ICD-11: ${item.ICD11_Code})
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Lookup failed:', error);
        displayMessage(lookupResults, 'Failed to fetch data. Is the backend server running?', 'error-message');
      }
    };

    const handleTranslate = async () => {
      const code = translateInput.value.trim();
      if (!code) {
        displayMessage(translateResult, 'Please enter a code to translate.');
        return;
      }
      displayMessage(translateResult, 'Translating...');
      try {
        // CORRECTED: Using backticks for the template literal
        const response = await fetch(`${API_BASE_URL}/translate?code=${encodeURIComponent(code)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Translation failed.');
        const resultHtml = `
          <div class="result-item">
            Input: <strong>${data.input_code}</strong> (System: ${data.input_system})
            <br>
            Translation: <strong>${data.translation.term}</strong> (System: ${data.translation.system}, Code: ${data.translation.code})
          </div>
        `;
        translateResult.innerHTML = resultHtml;
      } catch (error) {
        console.error('Translate failed:', error);
        // CORRECTED: Using backticks for the template literal
        displayMessage(translateResult, `Error: ${error.message}`, 'error-message');
      }
    };

    lookupInput.addEventListener('keyup', handleLookup);
    translateBtn.addEventListener('click', handleTranslate);
    translateInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') handleTranslate();
    });

    displayMessage(lookupResults, 'Results will appear here.');
    displayMessage(translateResult, 'Translation will appear here.');
  }
});