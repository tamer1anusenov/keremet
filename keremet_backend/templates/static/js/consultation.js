document.addEventListener('DOMContentLoaded', function() {
    // Initialize Flatpickr for date/time selection
    flatpickr("#consultation-date", {
        enableTime: true,
        minDate: "today",
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        minTime: "09:00",
        maxTime: "18:00",
        disable: [
            function(date) {
                // Disable weekends
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ]
    });

    // Handle consultation type selection
    const typeButtons = document.querySelectorAll('.select-btn');
    const specializationSection = document.querySelector('.specialization-section');

    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            typeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show specialization section
            specializationSection.style.display = 'block';
            specializationSection.scrollIntoView({ behavior: 'smooth' });

            // Hide doctors section if visible
            const doctorsSection = document.querySelector('.doctors-section');
            doctorsSection.style.display = 'none';
        });
    });

    // Doctor data with actual images
    const doctors = {
        therapist: [
            {
                id: 1,
                name: "Ronald Specter",
                specialty: "Therapist",
                photo: "images/doctor1.webp",
                schedule: "Sun - Fri, 10:00 AM - 1:00 PM",
                rating: 4.5
            },
            {
                id: 2,
                name: "David Chen",
                specialty: "Therapist",
                photo: "images/doctor6.webp",
                schedule: "Tue - Sat, 9:00 AM - 3:00 PM",
                rating: 4.8
            }
        ],
        cardiologist: [
            {
                id: 3,
                name: "James Smith",
                specialty: "Cardiologist",
                photo: "images/doctor3.webp",
                schedule: "Tue - Sun, 8:00 AM - 3:00 PM",
                rating: 4.6
            },
            {
                id: 4,
                name: "Sarah Johnson",
                specialty: "Cardiologist",
                photo: "images/doctor7.webp",
                schedule: "Mon - Fri, 10:00 AM - 5:00 PM",
                rating: 4.7
            }
        ],
        dermatologist: [
            {
                id: 5,
                name: "Michael Kim",
                specialty: "Dermatologist",
                photo: "images/doctor8.webp",
                schedule: "Wed - Sun, 8:00 AM - 2:00 PM",
                rating: 4.8
            }
        ]
    };

    // Handle specialization card selection
    const specializationCards = document.querySelectorAll('.specialization-card');
    const doctorsSection = document.querySelector('.doctors-section');
    const doctorsGrid = document.querySelector('.doctors-grid');

    specializationCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            specializationCards.forEach(c => c.classList.remove('active'));
            // Add active class to selected card
            this.classList.add('active');
            
            const specialty = this.getAttribute('data-specialty');
            showDoctors(specialty);
        });
    });

    function showDoctors(specialty) {
        const specialtyDoctors = doctors[specialty];
        doctorsGrid.innerHTML = '';

        specialtyDoctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            doctorCard.innerHTML = `
                <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p>${doctor.specialty}</p>
                    <p class="schedule">${doctor.schedule}</p>
                    <p class="rating">⭐ ${doctor.rating}</p>
                </div>
            `;

            doctorCard.addEventListener('click', () => showBookingModal(doctor));
            doctorsGrid.appendChild(doctorCard);
        });

        doctorsSection.style.display = 'block';
        doctorsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Handle specialization search
    const searchInput = document.getElementById('specialization-search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.specialization-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Handle payment method selection
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            paymentCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Modal functionality
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-modal');

    function showBookingModal(doctor) {
        const modalContent = modal.querySelector('.modal-content');
        const doctorPhoto = modalContent.querySelector('.doctor-photo');
        const doctorName = modalContent.querySelector('.doctor-name');
        const doctorSpecialty = modalContent.querySelector('.doctor-specialty');

        doctorPhoto.src = doctor.photo;
        doctorName.textContent = doctor.name;
        doctorSpecialty.textContent = doctor.specialty;

        modal.classList.add('show');
    }

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Handle form submission
    const bookingForm = document.querySelector('.modal-content');
    const bookButton = bookingForm.querySelector('.book-appointment');

    bookButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phone: document.getElementById('phone-number').value,
            email: document.getElementById('email').value,
            notes: document.getElementById('additional-notes').value,
            dateTime: document.getElementById('consultation-date').value
        };

        // Here you would typically send this data to your backend
        console.log('Booking data:', formData);
        
        // Show success message
        alert('Appointment booked successfully!');
        modal.classList.remove('show');
        
        // Reset form
        document.getElementById('first-name').value = '';
        document.getElementById('last-name').value = '';
        document.getElementById('phone-number').value = '';
        document.getElementById('email').value = '';
        document.getElementById('additional-notes').value = '';
        document.getElementById('consultation-date').value = '';
    });
}); 