document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    const dayButtons = document.querySelectorAll('.day-btn');
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Store initial values for reset
    const initialValues = {
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        specialization: document.getElementById('specialization').value,
        experience: document.getElementById('experience').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        workHoursStart: document.getElementById('workHoursStart').value,
        workHoursEnd: document.getElementById('workHoursEnd').value,
        appointmentDuration: document.getElementById('appointmentDuration').value,
        workDays: Array.from(dayButtons).map(btn => btn.classList.contains('active'))
    };

    // Add event listeners for day buttons
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 1) {
                value = '+7 (' + value;
            } else if (value.length <= 4) {
                value = '+7 (' + value.substring(1);
            } else if (value.length <= 7) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
            } else if (value.length <= 11) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
            } else {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }
        }
        e.target.value = value;
    });

    // Reset form to initial values
    resetBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите отменить все изменения?')) {
            document.getElementById('lastName').value = initialValues.lastName;
            document.getElementById('firstName').value = initialValues.firstName;
            document.getElementById('middleName').value = initialValues.middleName;
            document.getElementById('specialization').value = initialValues.specialization;
            document.getElementById('experience').value = initialValues.experience;
            document.getElementById('phone').value = initialValues.phone;
            document.getElementById('email').value = initialValues.email;
            document.getElementById('workHoursStart').value = initialValues.workHoursStart;
            document.getElementById('workHoursEnd').value = initialValues.workHoursEnd;
            document.getElementById('appointmentDuration').value = initialValues.appointmentDuration;

            // Reset work days
            dayButtons.forEach((btn, index) => {
                if (initialValues.workDays[index]) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });

    // Save profile changes
    saveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['lastName', 'firstName', 'specialization', 'experience', 'phone', 'email', 'workHoursStart', 'workHoursEnd', 'appointmentDuration'];
        let isValid = true;

        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                element.classList.add('error');
                isValid = false;
            } else {
                element.classList.remove('error');
            }
        });

        if (!isValid) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        // Get selected work days
        const selectedDays = Array.from(dayButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.textContent)
            .join(', ');

        if (selectedDays.length === 0) {
            alert('Пожалуйста, выберите хотя бы один рабочий день');
            return;
        }

        // This would typically send to an API
        // For demo purposes, we'll just show a success message
        alert('Изменения успешно сохранены');
    });
}); 