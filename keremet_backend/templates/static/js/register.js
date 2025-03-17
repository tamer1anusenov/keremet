document.addEventListener('DOMContentLoaded', function() {
    // Role selector functionality
    const roleOptions = document.querySelectorAll('.role-option');
    const roleInput = document.getElementById('role');
    const doctorFields = document.querySelectorAll('.doctor-field');

    if (roleOptions && roleInput && doctorFields) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Set the role value in the hidden field
                roleInput.value = option.textContent.toLowerCase();
                
                // Toggle doctor's fields visibility
                const isDoctor = roleInput.value === 'doctor';
                doctorFields.forEach(field => {
                    field.style.display = isDoctor ? 'block' : 'none';
                    const inputs = field.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.required = isDoctor;
                    });
                });
            });
        });
    }

    // Form validation
    const form = document.querySelector('form'); // Use the form element directly
    if (form) {
        form.addEventListener('submit', function(e) {
            const password = document.querySelector('input[name="password"]').value;
            const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
            
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
                return false;
            }
            
            const role = roleInput.value;
            if (role === 'doctor') {
                const doctorId = document.querySelector('input[name="doctorId"]').value;
                const specialization = document.querySelector('select[name="specialization"]').value;
                const experience = document.querySelector('input[name="experience"]').value;
                
                if (!doctorId || !specialization || !experience) {
                    e.preventDefault();
                    alert('Please fill in all doctor-specific fields');
                    return false;
                }
            }
            
            return true;
        });
    }

    // Real-time password confirmation validation
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.querySelector('input[name="password"]').value;
            const confirmPassword = this.value;
            
            if (password !== confirmPassword) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});