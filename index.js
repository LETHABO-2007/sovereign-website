// DOM Frame Selectors
const bookingForm = document.getElementById('bookingForm');
const recordsList = document.getElementById('recordsList');
const successMessage = document.getElementById('successMessage');
const bookingCountBadge = document.getElementById('bookingCount');

// Multi-View Control Panels
const clientView = document.getElementById('clientView');
const adminView = document.getElementById('adminView');
const adminLoginForm = document.getElementById('adminLoginForm');
const recordsContainer = document.getElementById('recordsContainer');

// Interface Navigation Buttons
const goToAdminBtn = document.getElementById('goToAdminBtn');
const backToBookingBtn = document.getElementById('backToBookingBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');

// CONFIGURATION: Set the master password for the business owner
const ADMIN_PASSWORD = "Refiloe123";

// --- SYSTEM INITIALIZATION & EVENTS ---

// Client Form Registration Event
bookingForm.addEventListener('submit', captureNewAppointment);

// Router View Navigation Handlers
goToAdminBtn.addEventListener('click', () => {
    clientView.classList.add('hidden');
    adminView.classList.remove('hidden');
    evaluateAdminSession(); 
});

backToBookingBtn.addEventListener('click', () => {
    adminView.classList.add('hidden');
    clientView.classList.remove('hidden');
    clearLoginState();
});

// Authentication System Hook
adminLoginForm.addEventListener('submit', authorizeAdminAccess);

// Administrative Session Exits
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isAdminAuthorized');
    recordsContainer.classList.add('hidden');
    adminLoginForm.classList.remove('hidden');
    clearLoginState();
});

// --- ENGINE CAPABILITIES ---

/**
 * Executes appointment booking generation from client entries
 */
function captureNewAppointment(event) {
    event.preventDefault();

    // Extracting sanitized input string models
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;

    // Build decoupled atomic data payload object
    const appointmentPayload = {
        id: Date.now(), // Secure incremental unique key variant
        name: name,
        phone: phone,
        date: date,
        time: time
    };

    // Store inside structured LocalStorage collection
    const databaseArchive = JSON.parse(localStorage.getItem('secure_bookings')) || [];
    databaseArchive.push(appointmentPayload);
    localStorage.setItem('secure_bookings', JSON.stringify(databaseArchive));

    // Reset layout fields state cleanly
    bookingForm.reset();
    
    // Display interactive modal notification sequence
    successMessage.textContent = `Appointment booked successfully for ${name}!`;
    successMessage.classList.remove('hidden');
    
    // Auto collapse banner following visual threshold completion
    setTimeout(() => { 
        successMessage.classList.add('hidden');
        successMessage.textContent = ""; 
    }, 4500);
}

/**
 * Evaluates administrative authentication input challenge values
 */
function authorizeAdminAccess(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('adminPassword');

    if (passwordInput.value === ADMIN_PASSWORD) {
        // Create transient context runtime session variables flag
        sessionStorage.setItem('isAdminAuthorized', 'true');
        evaluateAdminSession();
        passwordInput.value = '';
    } else {
        loginError.textContent = "Invalid Security Key. Authorization Denied.";
        loginError.classList.remove('hidden');
        passwordInput.focus();
    }
}

/**
 * Context router state switcher evaluation algorithm
 */
function evaluateAdminSession() {
    const isAuthorized = sessionStorage.getItem('isAdminAuthorized');

    if (isAuthorized === 'true') {
        adminLoginForm.classList.add('hidden');
        recordsContainer.classList.remove('hidden');
        clearLoginState();
        renderAdministrativeRecords();
    } else {
        adminLoginForm.classList.remove('hidden');
        recordsContainer.classList.add('hidden');
    }
}

/**
 * Pulls raw payloads from Storage block and updates owner dashboard UI components
 */
function renderAdministrativeRecords() {
    recordsList.innerHTML = '';
    const datasets = JSON.parse(localStorage.getItem('secure_bookings')) || [];
    
    // Dynamically tracking total item parameters count badge metric
    bookingCountBadge.textContent = `${datasets.length} Appointment${datasets.length !== 1 ? 's' : ''}`;

    if (datasets.length === 0) {
        recordsList.innerHTML = '<li class="no-records">No active client sessions on record.</li>';
        return;
    }

    // Map rows elements arrays safely out onto lists UI components
    datasets.forEach(record => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="booking-info">
                <strong>${escapeHtml(record.name)}</strong>
                <div><span></span> ${escapeHtml(record.phone)}</div>
                <div><span></span> ${formatHumanDate(record.date)} at ${record.time}</div>
            </div>
            <button class="delete-btn" onclick="terminateAppointment(${record.id})">Cancel</button>
        `;
        recordsList.appendChild(li);
    });
}

// --- UTILITY COMPONENT HOOKS ---

function clearLoginState() {
    loginError.textContent = '';
    loginError.classList.add('hidden');
    document.getElementById('adminPassword').value = '';
}

function formatHumanDate(rawInputStringDate) {
    const formatSettings = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(rawInputStringDate).toLocaleDateString(undefined, formatSettings);
}

// XSS Sanitizer helper function
function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
}

// Gallery lightbox is implemented in a separate file (gallery-lightbox.js)
// so that it doesn't affect booking/admin pages.

