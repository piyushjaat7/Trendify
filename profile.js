document.addEventListener('DOMContentLoaded', () => {
    const profileContent = document.getElementById('profile-content');
    // Only run this script if we are on a page with a #profile-content element
    if (!profileContent) return;

    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
        // If not logged in, show a message and a link to the login page
        profileContent.innerHTML = `
            <h1>Access Denied</h1>
            <p style="text-align: center; font-size: 1.1em; margin-bottom: 30px;">
                You must be logged in to view this page.
            </p>
            <a href="index1.html" class="btn" style="display: block; text-align: center; max-width: 200px; margin: 0 auto;">Login Now</a>
        `;
    } else {
        // If logged in, display the profile information
        // Try to get user data from sessionStorage, otherwise use a default.
        let user = JSON.parse(sessionStorage.getItem('user'));

        if (!user) {
            // In a real app, this data would come from a server. This is a fallback.
            user = {
                name: 'Tej Singh',
                username: 'tejsingh',
                email: 'tej.singh11icloud.com',
            };
        }
        // Add a join date for display purposes
        user.joinDate = user.joinDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        // Function to render the profile in "view" mode
        function renderProfileView() {
            profileContent.innerHTML = `
                <h1>My Profile</h1>
                <div class="profile-section">
                    <h2>Account Details</h2>
                    <div class="profile-details">
                        <p><strong>Name:</strong> ${user.name}</p>
                        <p><strong>Username:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Member Since:</strong> ${user.joinDate}</p>
                    </div>
                    <div class="profile-actions">
                        <button id="edit-profile-btn" class="btn">Edit Profile</button>
                    </div>
                </div>
                <div class="profile-section">
                    <h2>Order History</h2>
                    <div class="order-history-list">
                        <!-- This is a placeholder. In a real app, you'd loop through user orders. -->
                        <p>You have no past orders.</p>
                    </div>
                </div>
            `;
        }

        // Function to render the profile in "edit" mode
        function renderProfileEdit() {
            profileContent.innerHTML = `
                <h1>Edit Profile</h1>
                <form id="profile-form" novalidate>
                    <div class="profile-section">
                        <h2>Account Details</h2>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" value="${user.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" value="${user.email}" required>
                        </div>
                        <div class="profile-actions">
                            <button type="submit" class="btn">Save Changes</button>
                            <button type="button" id="cancel-edit-btn" class="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                    <div class="profile-section">
                        <h2>Change Password</h2>
                        <p style="font-size: 0.9em; color: #777; margin-bottom: 20px;">Leave these fields blank to keep your current password.</p>
                        <div class="form-group">
                            <label for="new-password">New Password</label>
                            <input type="password" id="new-password" placeholder="Enter a new password">
                        </div>
                        <div class="form-group">
                            <label for="confirm-password">Confirm New Password</label>
                            <input type="password" id="confirm-password" placeholder="Confirm your new password">
                        </div>
                        <div class="profile-actions">
                            <button type="submit" class="btn">Save Changes</button>
                            <button type="button" id="cancel-edit-btn" class="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </form>
            `;
        }

        // Event delegation to handle clicks within the profile container
        profileContent.addEventListener('click', (e) => {
            if (e.target.id === 'edit-profile-btn') {
                renderProfileEdit();
            }

            if (e.target.id === 'cancel-edit-btn') {
                renderProfileView();
            }
        });

        // Handle form submission
        profileContent.addEventListener('submit', (e) => {
            if (e.target.id === 'profile-form') {
                e.preventDefault();
                const nameInput = profileContent.querySelector('#name');
                const emailInput = profileContent.querySelector('#email');
                const newPasswordInput = profileContent.querySelector('#new-password');
                const confirmPasswordInput = profileContent.querySelector('#confirm-password');

                let changesSaved = false;

                // Update the user object with the new values
                if (user.name !== nameInput.value || user.email !== emailInput.value) {
                    user.name = nameInput.value;
                    user.email = emailInput.value;
                    changesSaved = true;
                }

                // Handle password change
                if (newPasswordInput.value) {
                    if (newPasswordInput.value !== confirmPasswordInput.value) {
                        alert('New passwords do not match. Please try again.');
                        return; // Stop the submission
                    }
                    // In a real app, you'd also validate the current password here.
                    changesSaved = true;
                }

                // In a real app, you would send this to the server.
                // For now, we just re-render the view.
                alert(changesSaved ? 'Profile updated successfully! (This is a demo)' : 'No changes were made.');
                renderProfileView();
            }
        });

        // Initial render of the profile
        renderProfileView();
    }
});