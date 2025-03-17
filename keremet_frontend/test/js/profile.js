document.addEventListener('DOMContentLoaded', function() {
    // Handle profile picture change
    const profilePicture = document.getElementById('profilePicture');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    
    changeAvatarBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicture.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Handle form submission
    const saveChangesBtn = document.querySelector('.save-changes-btn');
    
    saveChangesBtn.addEventListener('click', function() {
        // Collect form data
        const formData = {
            personalInfo: {
                firstName: document.querySelector('input[value="John"]').value,
                lastName: document.querySelector('input[value="Doe"]').value,
                dateOfBirth: document.querySelector('input[type="date"]').value,
                gender: document.querySelector('select').value
            },
            contactInfo: {
                email: document.querySelector('input[type="email"]').value,
                phone: document.querySelector('input[type="tel"]').value,
                address: document.querySelector('input[value*="Main Street"]').value
            },
            medicalInfo: {
                bloodType: document.querySelector('select[class="profile-input"]').value,
                allergies: document.querySelector('input[value="None"]').value,
                conditions: document.querySelector('textarea').value
            }
        };

        // Show success message
        showNotification('Profile updated successfully!');
    });

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#00a3b4',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}); 