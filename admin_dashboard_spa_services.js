// Function to load spa services for admin dashboard
async function loadSpaServices() {
  try {
    const servicesTableBody = document.getElementById('spaServicesTableBody');
    const serviceCardsMobile = document.getElementById('serviceCardsMobile');
    
    servicesTableBody.innerHTML = ''; // Clear previous entries
    serviceCardsMobile.innerHTML = ''; // Clear previous mobile entries
    
    const response = await fetch('/.netlify/functions/getSpaServices');
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    const data = await response.json();
    const services = data.data;
    
    if (services.length === 0) {
      document.getElementById('noSpaServicesMessage').style.display = 'block';
    } else {
      document.getElementById('noSpaServicesMessage').style.display = 'none';
      
      // Populate desktop table
      services.forEach(service => {
        const iconClass = service.icon || 'fa-spa';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <i class="fas ${iconClass} me-2"></i>
            ${service.name}
          </td>
          <td>${service.duration} mins</td>
          <td>$${parseFloat(service.price).toFixed(2)}</td>
          <td>${service.description.substring(0, 50)}${service.description.length > 50 ? '...' : ''}</td>
          <td>
            <span class="badge ${service.active ? 'bg-success' : 'bg-secondary'}">
              ${service.active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-info me-2 edit-spa-service-btn" data-id="${service.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-spa-service-btn" data-id="${service.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        servicesTableBody.appendChild(row);
        
        // Create card for mobile view
        const card = document.createElement('div');
        card.className = 'booking-card';
        card.innerHTML = `
          <div class="booking-card-header">
            <div class="booking-card-name">
              <i class="fas ${iconClass} me-2"></i>
              ${service.name}
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge ${service.active ? 'bg-success' : 'bg-secondary'}">
                ${service.active ? 'Active' : 'Inactive'}
              </span>
              <span class="badge badge-primary-custom">$${parseFloat(service.price).toFixed(2)}</span>
            </div>
          </div>
          <div class="mb-2"><strong>Duration:</strong> ${service.duration} mins</div>
          <div class="mb-3"><strong>Description:</strong> ${service.description.substring(0, 100)}${service.description.length > 100 ? '...' : ''}</div>
          <div class="booking-card-actions">
            <button class="btn btn-sm btn-info edit-spa-service-btn" data-id="${service.id}">
              <i class="fas fa-edit me-1"></i>Edit
            </button>
            <button class="btn btn-sm btn-danger delete-spa-service-btn" data-id="${service.id}">
              <i class="fas fa-trash-alt me-1"></i>Delete
            </button>
          </div>
        `;
        serviceCardsMobile.appendChild(card);
      });
      
      // Add event listeners for edit and delete buttons (desktop)
      document.querySelectorAll('#spaServicesTableBody .edit-spa-service-btn').forEach(button => {
        button.addEventListener('click', function() {
          const serviceId = this.dataset.id;
          const serviceToEdit = services.find(s => s.id === serviceId);
          if (serviceToEdit) {
            populateEditSpaServiceModal(serviceToEdit);
            const editSpaServiceModal = new bootstrap.Modal(document.getElementById('editSpaServiceModal'));
            editSpaServiceModal.show();
          }
        });
      });
      
      document.querySelectorAll('#spaServicesTableBody .delete-spa-service-btn').forEach(button => {
        button.addEventListener('click', function() {
          const serviceId = this.dataset.id;
          if (confirm('Are you sure you want to delete this service?')) {
            deleteSpaService(serviceId);
          }
        });
      });
      
      // Add event listeners for edit and delete buttons (mobile)
      document.querySelectorAll('#serviceCardsMobile .edit-spa-service-btn').forEach(button => {
        button.addEventListener('click', function() {
          const serviceId = this.dataset.id;
          const serviceToEdit = services.find(s => s.id === serviceId);
          if (serviceToEdit) {
            populateEditSpaServiceModal(serviceToEdit);
            const editSpaServiceModal = new bootstrap.Modal(document.getElementById('editSpaServiceModal'));
            editSpaServiceModal.show();
          }
        });
      });
      
      document.querySelectorAll('#serviceCardsMobile .delete-spa-service-btn').forEach(button => {
        button.addEventListener('click', function() {
          const serviceId = this.dataset.id;
          if (confirm('Are you sure you want to delete this service?')) {
            deleteSpaService(serviceId);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error loading services:', error);
    showMessageBox('Failed to load services. Please try again.', 'error');
  }
}

// Function to populate the edit service modal
function populateEditSpaServiceModal(service) {
  document.getElementById('editSpaServiceId').value = service.id;
  document.getElementById('editSpaServiceName').value = service.name;
  document.getElementById('editSpaServiceDuration').value = service.duration;
  document.getElementById('editSpaServicePrice').value = service.price;
  document.getElementById('editSpaServiceDescription').value = service.description;
  document.getElementById('editSpaServiceActive').checked = service.active;
  
  // Set the icon if available, otherwise default to fa-spa
  const iconValue = service.icon || 'fa-spa';
  
  // First set the value of the select element
  const iconSelect = document.getElementById('editSpaServiceIcon');
  iconSelect.value = iconValue;
  
  // If the option doesn't exist (for older icons), add it
  if (iconSelect.value !== iconValue) {
    const newOption = document.createElement('option');
    newOption.value = iconValue;
    newOption.textContent = iconValue.replace('fa-', '');
    iconSelect.appendChild(newOption);
    iconSelect.value = iconValue;
  }
  
  // Update the preview icon
  document.getElementById('editIconPreview').className = `fas ${iconValue}`;
}

// Function to add a new service
async function addSpaService(serviceData) {
  try {
    // Add the icon to the service data
    serviceData.icon = document.getElementById('addSpaServiceIcon').value;
    
    const response = await fetch('/.netlify/functions/createSpaService', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add service.');
    }
    
    showMessageBox('Service added successfully!', 'success');
    loadSpaServices(); // Reload services list
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addSpaServiceModal'));
    modal.hide();
    
    // Clear the form
    document.getElementById('addSpaServiceForm').reset();
    document.getElementById('addIconPreview').className = 'fas fa-spa';
  } catch (error) {
    console.error('Error adding service:', error);
    showMessageBox(`Failed to add service: ${error.message}`, 'error');
  }
}

// Function to update a service
async function updateSpaService(serviceId, serviceData) {
  try {
    // Add the icon to the service data
    serviceData.icon = document.getElementById('editSpaServiceIcon').value;
    
    const response = await fetch('/.netlify/functions/updateSpaService', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: serviceId,
        service: serviceData
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update service.');
    }
    
    showMessageBox('Service updated successfully!', 'success');
    loadSpaServices(); // Reload services list
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editSpaServiceModal'));
    modal.hide();
  } catch (error) {
    console.error('Error updating service:', error);
    showMessageBox(`Failed to update service: ${error.message}`, 'error');
  }
}

// Function to delete a service
async function deleteSpaService(serviceId) {
  try {
    const response = await fetch('/.netlify/functions/deleteSpaService', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: serviceId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete service.');
    }
    
    showMessageBox('Service deleted successfully!', 'success');
    loadSpaServices(); // Reload services list
  } catch (error) {
    console.error('Error deleting service:', error);
    showMessageBox(`Failed to delete service: ${error.message}`, 'error');
  }
}

// Initialize icon preview functionality
document.addEventListener('DOMContentLoaded', function() {
  // For Add Service form
  const addIconSelect = document.getElementById('addSpaServiceIcon');
  const addIconPreview = document.getElementById('addIconPreview');
  
  addIconSelect.addEventListener('change', function() {
    addIconPreview.className = `fas ${this.value}`;
  });
  
  // For Edit Service form
  const editIconSelect = document.getElementById('editSpaServiceIcon');
  const editIconPreview = document.getElementById('editIconPreview');
  
  editIconSelect.addEventListener('change', function() {
    editIconPreview.className = `fas ${this.value}`;
  });
});