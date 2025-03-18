document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  const userList = document.getElementById('user-list');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  // Form elements
  const userIdInput = document.getElementById('user-id');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const ageInput = document.getElementById('age');

  // Current mode (add or edit)
  let isEditMode = false;

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      renderUsers(users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Render users in the table
  const renderUsers = (users) => {
    userList.innerHTML = '';
    
    if (users.length === 0) {
      userList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
      return;
    }
    
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.age || '-'}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${user.id}">Edit</button>
          <button class="action-btn delete-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      userList.appendChild(tr);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editUser(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
  };

  // Add a new user
  const addUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add user');
      }
      
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error('Error adding user:', err);
      alert(err.message);
    }
  };

  // Edit user
  const editUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      
      // Fill the form with user data
      userIdInput.value = user.id;
      nameInput.value = user.name;
      emailInput.value = user.email;
      ageInput.value = user.age || '';
      
      // Update form state
      formTitle.textContent = 'Edit User';
      submitBtn.textContent = 'Update User';
      cancelBtn.style.display = 'inline-block';
      isEditMode = true;
      
      // Scroll to form
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error fetching user for edit:', err);
    }
  };

  // Update user
  const updateUser = async (userId, userData) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }
      
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.message);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.message);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    userForm.reset();
    userIdInput.value = '';
    formTitle.textContent = 'Add New User';
    submitBtn.textContent = 'Add User';
    cancelBtn.style.display = 'none';
    isEditMode = false;
  };

  // Form submit handler
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userData = {
      name: nameInput.value,
      email: emailInput.value,
      age: ageInput.value ? parseInt(ageInput.value) : null
    };
    
    if (isEditMode) {
      updateUser(userIdInput.value, userData);
    } else {
      addUser(userData);
    }
  });

  // Cancel button handler
  cancelBtn.addEventListener('click', resetForm);

  // Initial data load
  fetchUsers();
}); 