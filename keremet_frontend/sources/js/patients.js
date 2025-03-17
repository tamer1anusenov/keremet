// Patient Management System
let patients = JSON.parse(localStorage.getItem('patients')) || [];

// Modal Functions
function openPatientModal() {
    const modal = document.getElementById('patientModal');
    modal.style.display = 'block';
}

function closePatientModal() {
    const modal = document.getElementById('patientModal');
    modal.style.display = 'none';
    document.getElementById('patientForm').reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('patientModal');
    if (event.target === modal) {
        closePatientModal();
    }
}

// Form Submission
document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const patient = {
        id: generatePatientId(),
        name: document.getElementById('patientName').value,
        age: document.getElementById('patientAge').value,
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        email: document.getElementById('patientEmail').value,
        address: document.getElementById('patientAddress').value,
        status: document.getElementById('patientStatus').value,
        dateAdded: new Date().toISOString()
    };
    
    patients.push(patient);
    savePatients();
    updatePatientTable();
    closePatientModal();
});

// Generate unique patient ID
function generatePatientId() {
    return 'PAT' + Date.now().toString().slice(-6);
}

// Save patients to localStorage
function savePatients() {
    localStorage.setItem('patients', JSON.stringify(patients));
}

// Update patient table
function updatePatientTable() {
    const tbody = document.getElementById('patientTableBody');
    tbody.innerHTML = '';
    
    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.phone}</td>
            <td><span class="status-badge ${patient.status}">${patient.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editPatient('${patient.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deletePatient('${patient.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit patient
function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
    
    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientAge').value = patient.age;
    document.getElementById('patientGender').value = patient.gender;
    document.getElementById('patientPhone').value = patient.phone;
    document.getElementById('patientEmail').value = patient.email;
    document.getElementById('patientAddress').value = patient.address;
    document.getElementById('patientStatus').value = patient.status;
    
    // Remove the old patient
    patients = patients.filter(p => p.id !== id);
    savePatients();
    updatePatientTable();
    
    // Open modal for editing
    openPatientModal();
}

// Delete patient
function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        patients = patients.filter(p => p.id !== id);
        savePatients();
        updatePatientTable();
    }
}

// Search functionality
document.getElementById('patientSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm) ||
        patient.phone.includes(searchTerm)
    );
    updatePatientTable(filteredPatients);
});

// Status filter
document.getElementById('statusFilter').addEventListener('change', function(e) {
    const status = e.target.value;
    const filteredPatients = status 
        ? patients.filter(patient => patient.status === status)
        : patients;
    updatePatientTable(filteredPatients);
});

// Sort functionality
document.getElementById('sortBy').addEventListener('change', function(e) {
    const sortBy = e.target.value;
    const sortedPatients = [...patients].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        }
        return 0;
    });
    updatePatientTable(sortedPatients);
});

// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updatePatientTable();
}); 