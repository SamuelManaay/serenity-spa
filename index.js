// Function to fetch spa services and display them in the services section
async function loadSpaServices() {
  try {
    // Show loading animation
    const loadingElement = document.getElementById('loading-services');
    if (loadingElement) {
      loadingElement.style.display = 'block';
    }
    
    const response = await fetch('/.netlify/functions/getSpaServices');
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    const data = await response.json();
    const services = data.data;
    
    // Clear existing services
    const servicesContainer = document.querySelector('#services .row');
    if (!servicesContainer) {
      console.error('Services container not found');
      return;
    }
    
    servicesContainer.innerHTML = '';
    
    if (services && services.length > 0) {
      // Add services to the services section
      services.forEach(service => {
        if (service.active) {
          const serviceCard = document.createElement('div');
          serviceCard.className = 'col-lg-4 col-md-6 scroll-fade';
          
          // Use the icon from the database, or default to fa-spa if not available
          const iconClass = service.icon || 'fa-spa';
          
          serviceCard.innerHTML = `
            <div class="service-card text-center">
              <i class="fas ${iconClass} service-icon"></i>
              <h4>${service.name}</h4>
              <p>${service.description}</p>
              <div class="mt-3">
                <span class="badge bg-primary me-2">${service.duration} mins</span>
                <span class="badge bg-secondary">$${parseFloat(service.price).toFixed(2)}</span>
              </div>
            </div>
          `;
          servicesContainer.appendChild(serviceCard);
        }
      });
      
      // Add services to the dropdown in the booking form
      const servicesList = document.querySelector('.dropdown-check-list .items');
      if (servicesList) {
        servicesList.innerHTML = '';
        
        services.forEach((service, index) => {
          if (service.active) {
            const listItem = document.createElement('li');
            listItem.className = 'form-check mb-2';
            listItem.innerHTML = `
              <input class="form-check-input service-checkbox" type="checkbox" value="${service.name}" id="service${index + 1}">
              <label class="form-check-label ms-2" for="service${index + 1}">${service.name}</label>
            `;
            servicesList.appendChild(listItem);
          }
        });
        
        // Re-initialize the dropdown checklist
        initImprovedDropdown();
      }
      
      // Re-initialize scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);
      
      document.querySelectorAll('.scroll-fade').forEach(el => {
        observer.observe(el);
      });
      
      // Add hover effect to service cards
      document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
        });
      });
    } else {
      // No services found
      servicesContainer.innerHTML = '<div class="col-12 text-center"><p>No services available at the moment. Please check back later.</p></div>';
    }
    
    // Hide loading message
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
  } catch (error) {
    console.error('Error loading services:', error);
    // Show error message
    const servicesContainer = document.querySelector('#services .row');
    if (servicesContainer) {
      servicesContainer.innerHTML = '<div class="col-12 text-center"><p>Unable to load services. Please try again later.</p></div>';
    }
    
    // Hide loading message
    const loadingElement = document.getElementById('loading-services');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
}

// Function to initialize an improved dropdown that only responds to direct clicks
function initImprovedDropdown() {
  const checkList = document.querySelector('.dropdown-check-list');
  if (!checkList) return;

  // Get elements
  const anchor = checkList.querySelector('.anchor');
  const items = checkList.querySelector('.items');
  
  if (!anchor || !items) return;
  
  // Remove any existing event listeners
  const newAnchor = anchor.cloneNode(true);
  anchor.parentNode.replaceChild(newAnchor, anchor);
  
  const newItems = items.cloneNode(true);
  items.parentNode.replaceChild(newItems, items);
  
  // Get the new checkboxes
  const newCheckboxes = newItems.querySelectorAll('.service-checkbox');
  const selectedTextSpan = document.getElementById('selectedServicesText');
  
  if (!selectedTextSpan) return;
  
  // Toggle dropdown on anchor click - fixed to be immediate
  newAnchor.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle visibility class
    checkList.classList.toggle('visible');
    
    // Set display style based on visibility
    if (checkList.classList.contains('visible')) {
      newItems.style.display = 'block';
    } else {
      newItems.style.display = 'none';
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    // Only close if click is outside the dropdown and not on the datetime picker
    if (!checkList.contains(e.target) && 
        e.target.id !== 'datetime-picker' && 
        !e.target.closest('.flatpickr-calendar')) {
      checkList.classList.remove('visible');
      newItems.style.display = 'none';
    }
  });
  
  // Prevent clicks inside the items list from closing the dropdown
  newItems.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  // Update selected text when checkboxes change
  newCheckboxes.forEach(function(checkbox) {
    // Make the entire list item clickable
    checkbox.parentElement.addEventListener('click', function(e) {
      if (e.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
        updateSelectedText();
      }
    });
    
    checkbox.addEventListener('change', updateSelectedText);
  });
  
  // Initial update
  updateSelectedText();
  
  function updateSelectedText() {
    const selected = Array.from(newCheckboxes)
      .filter(c => c.checked)
      .map(c => c.value);
      
    if (selected.length === 0) {
      selectedTextSpan.textContent = '';
      checkList.classList.remove('has-selection');
    } else if (selected.length === 1) {
      selectedTextSpan.textContent = selected[0];
      checkList.classList.add('has-selection');
    } else {
      selectedTextSpan.textContent = `${selected.length} services selected`;
      checkList.classList.add('has-selection');
    }
  }
  
  // Ensure datetime picker doesn't interfere with dropdown
  const datetimePicker = document.getElementById('datetime-picker');
  if (datetimePicker) {
    datetimePicker.addEventListener('click', function(e) {
      // Close the services dropdown if it's open
      if (checkList.classList.contains('visible')) {
        checkList.classList.remove('visible');
        newItems.style.display = 'none';
      }
      e.stopPropagation();
    });
  }
}

// Load spa services when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Show loading animation immediately
  const loadingElement = document.getElementById('loading-services');
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
  
  // Load services with a slight delay to show the animation
  setTimeout(() => {
    loadSpaServices();
  }, 1000);
});