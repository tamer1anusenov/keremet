// Doctor Dashboard System
let currentWeek = new Date();
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const doctorsGrid = document.querySelector('.doctors-grid');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

// Sample doctors data (replace with API call)
const doctors = [
    {
        id: 1,
        name: 'Ronald Specter',
        specialization: 'Anesthesiology',
        credentials: 'MBBS, FCPS, FICS (USA)',
        image: 'images/doctor1.jpg',
        rating: 4.5,
        schedule: {
            days: 'Sun - Fri',
            time: '10:00 am to 1:00 pm'
        }
    },
    // Add more doctors here
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    loadAppointments();
    loadTasks();
    updateQuickStats();
    fetchDoctors();
    setupEventListeners();
});

// Calendar Functions
function initializeCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const weekStart = getWeekStart(currentWeek);
    
    // Update week display
    document.querySelector('.schedule-calendar h4').textContent = 
        `Week of ${formatDate(weekStart)}`;
    
    // Generate calendar days
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.innerHTML = `
            <div class="day-header">${formatDay(day)}</div>
            <div class="day-date">${formatDate(day)}</div>
            <div class="day-appointments"></div>
        `;
        
        calendarGrid.appendChild(dayElement);
        loadDayAppointments(day, dayElement.querySelector('.day-appointments'));
    }
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatDay(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short'
    });
}

function loadDayAppointments(date, container) {
    const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === date.toDateString();
    });
    
    dayAppointments.forEach(apt => {
        const aptElement = document.createElement('div');
        aptElement.className = 'appointment-slot';
        aptElement.innerHTML = `
            <div class="time">${formatTime(apt.time)}</div>
            <div class="patient">${apt.patientName}</div>
        `;
        container.appendChild(aptElement);
    });
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Navigation buttons
document.querySelector('.prev-week').addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() - 7);
    document.querySelector('.calendar-grid').innerHTML = '';
    initializeCalendar();
});

document.querySelector('.next-week').addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() + 7);
    document.querySelector('.calendar-grid').innerHTML = '';
    initializeCalendar();
});

// Appointment Management
function loadAppointments() {
    const appointmentList = document.querySelector('.appointment-list');
    const today = new Date().toDateString();
    
    const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === today;
    });
    
    appointmentList.innerHTML = '';
    todayAppointments.forEach(apt => {
        const aptElement = document.createElement('div');
        aptElement.className = 'appointment-item';
        aptElement.innerHTML = `
            <div class="time">${formatTime(apt.time)}</div>
            <div class="patient-info">
                <h4>${apt.patientName}</h4>
                <p>${apt.type}</p>
            </div>
            <div class="status ${apt.status.toLowerCase()}">${apt.status}</div>
        `;
        appointmentList.appendChild(aptElement);
    });
}

// Task Management
function loadTasks() {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input type="checkbox" id="task${index}" ${task.completed ? 'checked' : ''}>
            <label for="task${index}">${task.text}</label>
        `;
        
        const checkbox = taskElement.querySelector('input');
        checkbox.addEventListener('change', () => toggleTask(index));
        
        taskList.appendChild(taskElement);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Quick Stats
function updateQuickStats() {
    const totalPatients = appointments.reduce((unique, apt) => {
        if (!unique.includes(apt.patientName)) {
            unique.push(apt.patientName);
        }
        return unique;
    }, []).length;
    
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === today;
    }).length;
    
    const nextAppointment = appointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    
    document.querySelector('.stat-card:nth-child(1) p').textContent = totalPatients;
    document.querySelector('.stat-card:nth-child(2) p').textContent = todayAppointments;
    document.querySelector('.stat-card:nth-child(3) p').textContent = 
        nextAppointment ? formatTime(nextAppointment.time) : 'No upcoming appointments';
}

// Add new task
function addTask(text) {
    tasks.push({
        text,
        completed: false,
        date: new Date().toISOString()
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Add new appointment
function addAppointment(appointment) {
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadAppointments();
    updateQuickStats();
    initializeCalendar();
}

// Setup event listeners
function setupEventListeners() {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
}

// Fetch doctors from API
async function fetchDoctors() {
    try {
        // Replace with actual API call
        // const response = await fetch('your-api-endpoint');
        // const doctors = await response.json();
        populateDoctorsGrid(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        // Show error message to user
    }
}

// Populate doctors grid
function populateDoctorsGrid(doctors) {
    doctorsGrid.innerHTML = doctors.map(doctor => createDoctorCard(doctor)).join('');
}

// Create doctor card HTML
function createDoctorCard(doctor) {
    return `
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-image">
                    <img src="${doctor.image}" alt="Dr. ${doctor.name}">
                </div>
                <div class="rating">
                    ${doctor.rating} <i class="fas fa-star"></i>
                </div>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialization">${doctor.specialization}</p>
                <p class="credentials">${doctor.credentials}</p>
                <div class="schedule">
                    <span class="days">${doctor.schedule.days}</span>
                    <span class="time">${doctor.schedule.time}</span>
                </div>
            </div>
        </div>
    `;
}

// Filter doctors by specialization (can be implemented later)
function filterDoctors(specialization) {
    const filtered = doctors.filter(doctor => 
        specialization === 'all' || doctor.specialization === specialization
    );
    populateDoctorsGrid(filtered);
}

// Search doctors by name (can be implemented later)
function searchDoctors(query) {
    const filtered = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(query.toLowerCase())
    );
    populateDoctorsGrid(filtered);
}

// Sort doctors by rating (can be implemented later)
function sortDoctorsByRating() {
    const sorted = [...doctors].sort((a, b) => b.rating - a.rating);
    populateDoctorsGrid(sorted);
} 