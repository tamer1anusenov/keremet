document.addEventListener('DOMContentLoaded', function() {
    // Initialize date display
    updateCurrentDate();
    
    // Initialize appointments list
    loadTodayAppointments();
});

// Update current date display
function updateCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('ru-RU', options);
}

// Load today's appointments
function loadTodayAppointments() {
    // This would typically fetch from an API
    // For demo purposes, we'll use mock data
    const mockAppointments = [
        {
            time: '09:00',
            patientName: 'Иванов Александр',
            type: 'Первичный прием',
            status: 'completed'
        },
        {
            time: '11:30',
            patientName: 'Петрова Елена',
            type: 'Повторный прием',
            status: 'completed'
        },
        {
            time: '14:30',
            patientName: 'Сидоров Михаил',
            type: 'Консультация',
            status: 'in-progress'
        },
        {
            time: '16:00',
            patientName: 'Козлова Анна',
            type: 'Первичный прием',
            status: 'upcoming'
        }
    ];

    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = ''; // Clear existing appointments

    mockAppointments.forEach(appointment => {
        const appointmentElement = createAppointmentElement(appointment);
        appointmentsList.appendChild(appointmentElement);
    });

    // Update quick stats
    updateQuickStats(mockAppointments);
}

// Create appointment list item
function createAppointmentElement(appointment) {
    const appointmentDiv = document.createElement('div');
    appointmentDiv.className = 'appointment-item';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'appointment-time';
    timeDiv.textContent = appointment.time;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'appointment-info';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'patient-name';
    nameDiv.textContent = appointment.patientName;

    const typeDiv = document.createElement('div');
    typeDiv.className = 'appointment-type';
    typeDiv.textContent = appointment.type;

    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(typeDiv);

    const statusDiv = document.createElement('div');
    statusDiv.className = `appointment-status status-${appointment.status}`;
    statusDiv.textContent = getStatusText(appointment.status);

    appointmentDiv.appendChild(timeDiv);
    appointmentDiv.appendChild(infoDiv);
    appointmentDiv.appendChild(statusDiv);

    // Add click handler to navigate to patient details
    appointmentDiv.addEventListener('click', () => {
        window.location.href = `doctor.html?patient=${encodeURIComponent(appointment.patientName)}`;
    });

    return appointmentDiv;
}

// Get status text in Russian
function getStatusText(status) {
    const statusMap = {
        'completed': 'Завершен',
        'in-progress': 'В процессе',
        'upcoming': 'Ожидается'
    };
    return statusMap[status] || status;
}

// Update quick stats
function updateQuickStats(appointments) {
    const todayPatients = appointments.length;
    document.getElementById('todayPatients').textContent = todayPatients;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Find next upcoming appointment
    const nextAppointment = appointments.find(appointment => {
        const [hours, minutes] = appointment.time.split(':').map(Number);
        return (hours > currentHour) || (hours === currentHour && minutes > currentMinute);
    });

    if (nextAppointment) {
        document.getElementById('nextAppointment').textContent = nextAppointment.time;
    } else {
        document.getElementById('nextAppointment').textContent = 'Нет записей';
    }
} 