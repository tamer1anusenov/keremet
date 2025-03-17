document.addEventListener("DOMContentLoaded", function () {
    const doctors = [
        { name: "Ronald Specter", specialty: "Therapist", rating: 4.5, image: "doctor1.webp", schedule: "Sun - Fri, 10:00 AM - 1:00 PM" },
        { name: "Emily Carter", specialty: "Pediatrics", rating: 4.7, image: "doctor2.webp", schedule: "Mon - Sat, 9:00 AM - 2:00 PM" },
        { name: "James Smith", specialty: "Cardiologist", rating: 4.6, image: "doctor3.webp", schedule: "Tue - Sun, 8:00 AM - 3:00 PM" },
        { name: "Sophia Lee", specialty: "Gynecology", rating: 4.8, image: "doctor4.webp", schedule: "Wed - Mon, 7:00 AM - 12:00 PM" },
        // New Pediatricians
        { name: "Maria Rodriguez", specialty: "Pediatrics", rating: 4.9, image: "doctor5.webp", schedule: "Mon - Fri, 8:00 AM - 4:00 PM" },
        { name: "David Chen", specialty: "Therapist", rating: 4.8, image: "doctor6.webp", schedule: "Tue - Sat, 9:00 AM - 3:00 PM" },
        // New Ophthalmologists
        { name: "Sarah Johnson", specialty: "Cardiologist", rating: 4.7, image: "doctor7.webp", schedule: "Mon - Fri, 10:00 AM - 5:00 PM" },
        { name: "Michael Kim", specialty: "Dermatologist", rating: 4.8, image: "doctor8.webp", schedule: "Wed - Sun, 8:00 AM - 2:00 PM" }
    ];

    const doctorList = document.getElementById("doctor-list");
    const doctorCount = document.getElementById("doctor-count");
    let selectedTimeSlot = null;
    let currentDoctor = null;

    // Update the doctor count
    doctorCount.textContent = doctors.length;

    // Initialize Flatpickr
    const datePicker = flatpickr("#datePicker", {
        minDate: "today",
        maxDate: new Date().fp_incr(30), // Allow booking up to 30 days in advance
        disable: [
            function(date) {
                // Disable weekends for example
                return date.getDay() === 0; // Disable Sundays
            }
        ],
        onChange: function(selectedDates, dateStr) {
            if (selectedDates.length > 0) {
                generateTimeSlots(selectedDates[0]);
            }
        }
    });

    // Generate time slots for selected date
    function generateTimeSlots(date) {
        const slotsGrid = document.getElementById('slotsGrid');
        slotsGrid.innerHTML = '';
        
        // Generate time slots from 9 AM to 5 PM
        const startHour = 9;
        const endHour = 17;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute of ['00', '30']) {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                
                const time = `${hour}:${minute}`;
                timeSlot.textContent = `${hour}:${minute}`;
                
                // Randomly disable some slots (you would replace this with actual availability data)
                if (Math.random() > 0.7) {
                    timeSlot.classList.add('disabled');
                } else {
                    timeSlot.addEventListener('click', () => selectTimeSlot(timeSlot, time));
                }
                
                slotsGrid.appendChild(timeSlot);
            }
        }
    }

    // Handle time slot selection
    function selectTimeSlot(slotElement, time) {
        if (slotElement.classList.contains('disabled')) return;
        
        // Remove selection from previously selected slot
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked slot
        slotElement.classList.add('selected');
        selectedTimeSlot = time;
    }

    // Generate doctor cards dynamically
    doctors.forEach(doctor => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="images/${doctor.image}" alt="${doctor.name}">
            <h3>${doctor.name}</h3>
            <p>${doctor.specialty}</p>
            <p>${doctor.schedule}</p>
            <span class="rating">⭐ ${doctor.rating}</span>
        `;

        // Add click event listener for appointment booking
        card.addEventListener('click', () => {
            const modal = document.getElementById('appointmentModal');
            const doctorImg = document.getElementById('selectedDoctorImg');
            const doctorName = document.getElementById('selectedDoctorName');
            const doctorSpecialty = document.getElementById('selectedDoctorSpecialty');

            doctorImg.src = `images/${doctor.image}`;
            doctorName.textContent = doctor.name;
            doctorSpecialty.textContent = doctor.specialty;
            currentDoctor = doctor;

            // Reset date and time selection
            datePicker.clear();
            const slotsGrid = document.getElementById('slotsGrid');
            slotsGrid.innerHTML = '';
            selectedTimeSlot = null;

            modal.classList.add('show');
        });

        doctorList.appendChild(card);
    });

    // Handle form submission
    document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedTimeSlot) {
            alert('Please select a time slot');
            return;
        }

        const formData = {
            doctor: currentDoctor.name,
            specialty: currentDoctor.specialty,
            date: datePicker.selectedDates[0],
            time: selectedTimeSlot,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            notes: document.getElementById('notes').value
        };

        // Show success modal with confirmation details
        const successModal = document.getElementById('successModal');
        const appointmentModal = document.getElementById('appointmentModal');
        const confirmationDetails = document.querySelector('.confirmation-details');

        confirmationDetails.innerHTML = `
            <p><strong>Doctor:</strong> ${formData.doctor}</p>
            <p><strong>Date:</strong> ${formData.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${formData.time}</p>
            <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Contact:</strong> ${formData.phone}</p>
        `;

        appointmentModal.classList.remove('show');
        successModal.classList.add('show');
    });

    // Close modal functionality
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
            });
        });
    });

    // Handle OK button in success modal
    document.querySelector('.ok-btn').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('show');
        // Reset form
        document.getElementById('appointmentForm').reset();
    });
});
