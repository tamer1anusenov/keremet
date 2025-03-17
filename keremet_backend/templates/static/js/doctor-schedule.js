document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    
    // Initialize UI elements
    const weekView = document.getElementById('weekView');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const currentWeekSpan = document.getElementById('currentWeek');
    const modal = document.getElementById('appointmentModal');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Add event listeners
    prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
    nextWeekBtn.addEventListener('click', () => navigateWeek(1));
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveAppointment);

    // Initial render
    renderWeek(currentDate);

    // Week navigation
    function navigateWeek(offset) {
        currentDate.setDate(currentDate.getDate() + (offset * 7));
        renderWeek(currentDate);
    }

    // Render week view
    function renderWeek(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

        // Update week display
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        currentWeekSpan.textContent = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

        // Clear previous week view
        weekView.innerHTML = '';

        // Create columns for each day
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            
            const dayColumn = createDayColumn(currentDay);
            weekView.appendChild(dayColumn);
        }

        // Load appointments for the week
        loadAppointments(startOfWeek, endOfWeek);
    }

    // Create a column for a day
    function createDayColumn(date) {
        const column = document.createElement('div');
        column.className = 'day-column';

        const header = document.createElement('div');
        header.className = 'day-header';

        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = date.toLocaleDateString('ru-RU', { weekday: 'long' });

        const dayDate = document.createElement('div');
        dayDate.className = 'day-date';
        if (isToday(date)) {
            dayDate.classList.add('today');
        }
        dayDate.textContent = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

        header.appendChild(dayName);
        header.appendChild(dayDate);
        column.appendChild(header);

        return column;
    }

    // Load appointments for the week
    function loadAppointments(startDate, endDate) {
        // This would typically fetch from an API
        // For demo purposes, we'll use mock data
        const mockAppointments = [
            {
                id: 1,
                patientName: 'Иванов Александр',
                date: new Date(startDate.getTime() + (2 * 24 * 60 * 60 * 1000)),
                time: '09:00',
                type: 'Первичный прием',
                status: 'upcoming',
                notes: ''
            },
            {
                id: 2,
                patientName: 'Петрова Елена',
                date: new Date(startDate.getTime() + (2 * 24 * 60 * 60 * 1000)),
                time: '10:30',
                type: 'Повторный прием',
                status: 'upcoming',
                notes: ''
            },
            // Add more mock appointments as needed
        ];

        mockAppointments.forEach(appointment => {
            const dayColumn = weekView.children[appointment.date.getDay()];
            const appointmentElement = createAppointmentElement(appointment);
            dayColumn.appendChild(appointmentElement);
        });
    }

    // Create an appointment element
    function createAppointmentElement(appointment) {
        const element = document.createElement('div');
        element.className = 'appointment-slot';
        element.dataset.appointmentId = appointment.id;

        const time = document.createElement('div');
        time.className = 'appointment-time';
        time.textContent = appointment.time;

        const patient = document.createElement('div');
        patient.className = 'appointment-patient';
        patient.textContent = appointment.patientName;

        const type = document.createElement('div');
        type.className = 'appointment-type';
        type.textContent = appointment.type;

        element.appendChild(time);
        element.appendChild(patient);
        element.appendChild(type);

        element.addEventListener('click', () => showAppointmentDetails(appointment));

        return element;
    }

    // Show appointment details modal
    function showAppointmentDetails(appointment) {
        document.getElementById('patientName').value = appointment.patientName;
        document.getElementById('appointmentTime').value = `${formatDate(appointment.date)} ${appointment.time}`;
        document.getElementById('appointmentType').value = appointment.type;
        document.getElementById('appointmentStatus').value = appointment.status;
        document.getElementById('appointmentNotes').value = appointment.notes;

        modal.style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Save appointment changes
    function saveAppointment() {
        // This would typically send to an API
        // For demo purposes, we'll just close the modal
        alert('Изменения сохранены');
        closeModal();
    }

    // Helper function to format date
    function formatDate(date) {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }

    // Helper function to check if date is today
    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
}); 