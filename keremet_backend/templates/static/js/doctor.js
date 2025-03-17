document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const iinInput = document.getElementById('iinInput');
    const searchBtn = document.getElementById('searchBtn');
    const patientForm = document.getElementById('patientForm');
    const loadingState = document.getElementById('loadingState');
    const clearBtn = document.getElementById('clearBtn');
    const historyBtn = document.getElementById('historyBtn');
    const birthDateInput = document.getElementById('birthDate');
    const ageDisplay = document.getElementById('ageDisplay');
    const genderButtons = document.querySelectorAll('.gender-btn');

    // Format IIN as user types
    iinInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
    });

    // Handle IIN search
    searchBtn.addEventListener('click', async function() {
        const iin = iinInput.value;
        
        if (iin.length !== 12) {
            alert('Пожалуйста, введите 12-значный ИИН');
            return;
        }

        // Show loading state
        loadingState.style.display = 'flex';
        
        // Simulate API call
        setTimeout(() => {
            loadingState.style.display = 'none';
            
            // For demo purposes, show existing patient for specific IIN
            if (iin === '123456789012') {
                // Populate form with existing data
                populateFormWithExistingData({
                    lastName: 'Иванов',
                    firstName: 'Иван',
                    birthDate: '1990-05-15',
                    gender: 'male',
                    diagnosis: 'Гипертоническая болезнь',
                    hemoglobin: 145,
                    glucose: 5.2,
                    complaints: 'Головная боль, повышенное давление',
                    treatment: 'Лизиноприл 10мг 1 раз в день\nАспирин 100мг 1 раз в день',
                    doctorNotes: 'Пациент соблюдает режим приема препаратов. Контроль АД.'
                });
            } else {
                // Reset form for new patient
                resetForm();
            }
        }, 1500);
    });

    // Calculate and display age when birth date changes
    birthDateInput.addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Adjust age if birthday hasn't occurred this year
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        ageDisplay.textContent = age ? `${age} лет` : '';
    });

    // Handle gender button selection
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            genderButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle form submission
    patientForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        if (!validateForm()) {
            return;
        }

        // Show loading state
        loadingState.style.display = 'flex';
        
        // Simulate form submission
        setTimeout(() => {
            loadingState.style.display = 'none';
            alert('Данные успешно сохранены!');
        }, 1000);
    });

    // Handle clear button click
    clearBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить форму?')) {
            resetForm();
        }
    });

    // Handle history button click
    historyBtn.addEventListener('click', function() {
        const iin = iinInput.value;
        if (!iin) {
            alert('Пожалуйста, сначала выполните поиск пациента по ИИН');
            return;
        }
        // Redirect to analysis history page
        window.location.href = `analyzes.html?iin=${iin}`;
    });
});

// Function to populate form with existing patient data
function populateFormWithExistingData(data) {
    document.getElementById('lastName').value = data.lastName;
    document.getElementById('firstName').value = data.firstName;
    document.getElementById('birthDate').value = data.birthDate;
    document.getElementById('diagnosis').value = data.diagnosis;
    document.getElementById('hemoglobin').value = data.hemoglobin;
    document.getElementById('glucose').value = data.glucose;
    document.getElementById('complaints').value = data.complaints;
    document.getElementById('treatment').value = data.treatment;
    document.getElementById('doctorNotes').value = data.doctorNotes;
    
    // Set gender
    const genderBtn = document.querySelector(`[data-gender="${data.gender}"]`);
    if (genderBtn) {
        document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
        genderBtn.classList.add('active');
    }
    
    // Trigger age calculation
    document.getElementById('birthDate').dispatchEvent(new Event('change'));
}

// Function to reset form
function resetForm() {
    patientForm.reset();
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
    ageDisplay.textContent = '';
}

// Function to validate form
function validateForm() {
    const requiredFields = ['lastName', 'firstName', 'birthDate', 'diagnosis'];
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

    if (!document.querySelector('.gender-btn.active')) {
        alert('Пожалуйста, выберите пол пациента');
        isValid = false;
    }

    if (!isValid) {
        alert('Пожалуйста, заполните все обязательные поля');
    }

    return isValid;
} 