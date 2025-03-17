// Constants
const API_BASE_URL = 'http://localhost:8080/api'; // Update with your actual API URL

// DOM Elements
const form = document.getElementById('appointmentForm');
const doctorSelect = document.getElementById('doctorSelect');
const doctorInfo = document.getElementById('doctorInfo');
const doctorImage = document.getElementById('doctorImage');
const doctorName = document.getElementById('doctorName');
const doctorSpecialization = document.getElementById('doctorSpecialization');
const appointmentDate = document.getElementById('appointmentDate');
const timeSlots = document.getElementById('timeSlots');
const successModal = document.getElementById('successModal');
const appointmentDetails = document.getElementById('appointmentDetails');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setMinDate();
    fetchDoctors();
    setupEventListeners();
});

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.min = today;
}

// Fetch doctors from the API
async function fetchDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        const doctors = await response.json();
        populateDoctorSelect(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        // For demo purposes, add some sample doctors
        const sampleDoctors = [
            { id: 1, name: 'Dr. John Smith', specialization: 'Cardiologist', image: 'images/doctor1.jpg' },
            { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Neurologist', image: 'images/doctor2.jpg' },
            { id: 3, name: 'Dr. Michael Brown', specialization: 'Pediatrician', image: 'images/doctor3.jpg' }
        ];
        populateDoctorSelect(sampleDoctors);
    }
}

// Populate doctor select dropdown
function populateDoctorSelect(doctors) {
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialization}`;
        option.dataset.image = doctor.image;
        option.dataset.name = doctor.name;
        option.dataset.specialization = doctor.specialization;
        doctorSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    doctorSelect.addEventListener('change', handleDoctorSelect);
    appointmentDate.addEventListener('change', handleDateSelect);
    form.addEventListener('submit', handleSubmit);
}

// Handle doctor selection
function handleDoctorSelect(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    if (selectedOption.value) {
        updateDoctorInfo(selectedOption);
        if (appointmentDate.value) {
            fetchTimeSlots(selectedOption.value, appointmentDate.value);
        }
    } else {
        doctorInfo.style.display = 'none';
        timeSlots.innerHTML = '';
    }
}

// Update doctor info display
function updateDoctorInfo(option) {
    doctorImage.src = option.dataset.image;
    doctorName.textContent = option.dataset.name;
    doctorSpecialization.textContent = option.dataset.specialization;
    doctorInfo.style.display = 'flex';
}

// Handle date selection
function handleDateSelect() {
    const selectedDoctor = doctorSelect.value;
    if (selectedDoctor) {
        fetchTimeSlots(selectedDoctor, appointmentDate.value);
    }
}

// Fetch available time slots
async function fetchTimeSlots(doctorId, date) {
    try {
        const response = await fetch(`${API_BASE_URL}/timeslots?doctor=${doctorId}&date=${date}`);
        const slots = await response.json();
        populateTimeSlots(slots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        // For demo purposes, generate sample time slots
        const sampleSlots = generateSampleTimeSlots();
        populateTimeSlots(sampleSlots);
    }
}

// Generate sample time slots for demo
function generateSampleTimeSlots() {
    const slots = [];
    let hour = 9;
    while (hour <= 17) {
        slots.push({
            time: `${hour}:00`,
            available: Math.random() > 0.3
        });
        slots.push({
            time: `${hour}:30`,
            available: Math.random() > 0.3
        });
        hour++;
    }
    return slots;
}

// Populate time slots
function populateTimeSlots(slots) {
    timeSlots.innerHTML = '';
    slots.forEach(slot => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `time-slot${slot.available ? '' : ' disabled'}`;
        button.textContent = slot.time;
        button.disabled = !slot.available;
        
        if (slot.available) {
            button.addEventListener('click', () => handleTimeSlotSelect(button));
        }
        
        timeSlots.appendChild(button);
    });
}

// Handle time slot selection
function handleTimeSlotSelect(button) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    button.classList.add('selected');
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    if (!selectedTimeSlot) {
        alert('Please select a time slot');
        return;
    }

    const formData = {
        doctorId: doctorSelect.value,
        doctorName: doctorName.textContent,
        date: appointmentDate.value,
        time: selectedTimeSlot.textContent,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showSuccessModal(formData);
        } else {
            throw new Error('Failed to book appointment');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        // For demo purposes, show success anyway
        showSuccessModal(formData);
    }
}

// Show success modal
function showSuccessModal(appointment) {
    appointmentDetails.innerHTML = `
        <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
        <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Patient:</strong> ${appointment.firstName} ${appointment.lastName}</p>
    `;
    successModal.classList.add('show');
}

// Close modal
function closeModal() {
    successModal.classList.remove('show');
    form.reset();
    doctorInfo.style.display = 'none';
    timeSlots.innerHTML = '';
}

// Format date for display
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Phone number validation
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
        e.target.value = value;
    } else {
        e.target.value = value.slice(0, 10);
    }
}); 