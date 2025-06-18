// Application Data
const appData = {
  venues: [
    {
      id: 1,
      name: "Madison Square Garden",
      location: "New York, NY",
      capacity: 20000,
      seatingLayout: "arena"
    },
    {
      id: 2,
      name: "Hollywood Bowl",
      location: "Los Angeles, CA",
      capacity: 17500,
      seatingLayout: "amphitheater"
    },
    {
      id: 3,
      name: "Broadway Theater",
      location: "New York, NY",
      capacity: 1200,
      seatingLayout: "theater"
    }
  ],
  events: [
    {
      id: 1,
      title: "Taylor Swift - The Eras Tour",
      category: "Concerts",
      subcategory: "Pop",
      venue: "Madison Square Garden",
      location: "New York, NY",
      date: "2025-07-15",
      time: "8:00 PM",
      image: "https://cdn.prod.website-files.com/655e0fa544c67c1ee5ce01c7/655e0fa544c67c1ee5ce11c2_live-performance-tips-to-help-you-put-on-a-great-show-header.jpeg",
      description: "Join Taylor Swift for an unforgettable night of music spanning her entire career.",
      priceRange: "$75 - $350",
      availability: "On Sale Now"
    },
    {
      id: 2,
      title: "RCB vs CSK",
      category: "Sports",
      subcategory: "Cricket",
      venue: "Motera Stadium",
      location: "Ahemdabad, GJ",
      date: "2025-06-20",
      time: "7:30 PM",
      image: "https://pplx-res.cloudinary.com/image/upload/v1750189429/pplx_project_search_images/ab251d24a2c98183e2cd35d63be40a0e9d0660ed.jpg",
      description: "Classic rivalry matchup between two legendary NBA franchises.",
      priceRange: "$45 - $500",
      availability: "On Sale Now"
    },

    {
      id: 4,
      title: "Disney On Ice",
      category: "Family",
      subcategory: "Ice Shows",
      venue: "DLF Mall",
      location: "Noida, UP",
      date: "2025-07-01",
      time: "3:00 PM",
      image: "https://images.jdmagicbox.com/v2/comp/delhi/w7/011pxx11.xx11.190406144031.c2w7/catalogue/snow-world-dlf-mall-of-india-noida-sector-18-noida-parks-4fj5qp96m5.jpg",
      description: "A magical ice skating spectacular featuring beloved Disney characters.",
      priceRange: "$25 - $85",
      availability: "On Sale Now"
    },
    {
      id: 5,
      title: "Coldplay - Music of the Spheres World Tour",
      category: "Concerts",
      subcategory: "Alternative Rock",
      venue: "Mumbai Stadium",
      location: "Mumbai, MH",
      date: "2025-08-12",
      time: "7:00 PM",
      image: "https://i0.wp.com/clementinedelauney.com/wp-content/uploads/2020/07/VoA-BangYourHead2019-54-scaled.jpg?fit=2560%2C1707&ssl=1",
      description: "Experience Coldplay's spectacular live show with stunning visuals and hits.",
      priceRange: "$59 - $275",
      availability: "On Sale Now"
    }
  ],
  categories: [
    {
      name: "Concerts",
      subcategories: ["Pop", "Rock", "Hip-Hop", "Country", "Electronic", "Jazz", "Classical"]
    },
    {
      name: "Sports",
      subcategories: ["NFL", "NBA", "MLB", "NHL", "MLS", "College Sports", "Boxing"]
    },
    {
      name: "Arts & Theater",
      subcategories: ["Broadway", "Comedy", "Dance", "Opera", "Local Theater"]
    },
    {
      name: "Family",
      subcategories: ["Children's Shows", "Ice Shows", "Circus", "Educational"]
    }
  ],
  seatPricing: {
    premium: { price: 350, color: "#FFD700" },
    vip: { price: 250, color: "#FF6B6B" },
    standard: { price: 150, color: "#4ECDC4" },
    value: { price: 75, color: "#95E1D3" }
  }
};

// Application State
let currentState = {
  currentPage: 'home',
  currentEvent: null,
  selectedSeats: [],
  cart: [],
  searchResults: [],
  currentFilters: {
    category: 'all',
    date: 'all',
    price: 'all',
    location: ''
  },
  selectionTimer: null,
  timeRemaining: 600 // 10 minutes in seconds
};

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function generateSeatMap(eventId) {
  const sections = ['VIP', 'Premium', 'Standard', 'Value'];
  const seatMap = [];
  
  sections.forEach((section, sectionIndex) => {
    const rows = section === 'VIP' ? 5 : section === 'Premium' ? 8 : 12;
    const seatsPerRow = section === 'VIP' ? 10 : section === 'Premium' ? 15 : 20;
    
    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatId = `${section}-${row}-${seat}`;
        const isAvailable = Math.random() > 0.3; // 70% availability
        
        seatMap.push({
          id: seatId,
          section: section.toLowerCase(),
          row: row,
          seat: seat,
          price: appData.seatPricing[section.toLowerCase()].price,
          available: isAvailable,
          selected: false
        });
      }
    }
  });
  
  return seatMap;
}

// Navigation Functions
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const targetPage = document.getElementById(`${pageId}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
    currentState.currentPage = pageId;
  }
  
  // Update navigation state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function showEventDetail(eventId) {
  const event = appData.events.find(e => e.id === eventId);
  if (!event) return;
  
  currentState.currentEvent = event;
  
  const container = document.getElementById('event-detail-container');
  container.innerHTML = `
    <div class="event-detail-hero">
      <div class="event-detail-image-container">
        <img src="${event.image}" alt="${event.title}" class="event-detail-image">
      </div>
      <div class="event-detail-info">
        <h1>${event.title}</h1>
        <div class="event-detail-meta">
          <div>
            <i class="fas fa-calendar"></i>
            <span>${formatDate(event.date)} at ${event.time}</span>
          </div>
          <div>
            <i class="fas fa-map-marker-alt"></i>
            <span>${event.venue}, ${event.location}</span>
          </div>
          <div>
            <i class="fas fa-tag"></i>
            <span>${event.category} • ${event.subcategory}</span>
          </div>
          <div>
            <i class="fas fa-dollar-sign"></i>
            <span>${event.priceRange}</span>
          </div>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-actions">
          <button class="find-tickets-btn" onclick="showSeatSelection(${event.id})">
            Find Tickets
          </button>
          <button class="btn btn-secondary">
            <i class="fas fa-heart"></i> Add to Favorites
          </button>
        </div>
      </div>
    </div>
    
    <div class="event-additional-info">
      <div class="section">
        <h3>Venue Information</h3>
        <p>Learn more about ${event.venue} and plan your visit.</p>
      </div>
      
      <div class="section">
        <h3>Similar Events</h3>
        <div class="similar-events">
          ${appData.events
            .filter(e => e.id !== event.id && e.category === event.category)
            .slice(0, 3)
            .map(e => `
              <div class="similar-event" onclick="showEventDetail(${e.id})">
                <img src="${e.image}" alt="${e.title}">
                <div class="similar-event-info">
                  <h4>${e.title}</h4>
                  <p>${formatDate(e.date)}</p>
                  <p>${e.venue}</p>
                </div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>
  `;
  
  showPage('event-detail');
}

function showSeatSelection(eventId) {
  const event = appData.events.find(e => e.id === eventId);
  if (!event) return;
  
  currentState.currentEvent = event;
  currentState.selectedSeats = [];
  currentState.seatMap = generateSeatMap(eventId);
  
  // Update header info
  document.getElementById('seat-selection-event-title').textContent = event.title;
  document.getElementById('seat-selection-event-info').innerHTML = `
    <div>${formatDate(event.date)} at ${event.time}</div>
    <div>${event.venue}, ${event.location}</div>
  `;
  
  // Start selection timer
  startSelectionTimer();
  
  // Render seat map
  renderSeatMap();
  
  // Render price tiers
  renderPriceTiers();
  
  // Update selected seats display
  updateSelectedSeatsDisplay();
  
  showPage('seat-selection');
}

function renderSeatMap() {
  const seatMapContainer = document.getElementById('seat-map');
  
  const sections = ['vip', 'premium', 'standard', 'value'];
  let mapHTML = '<div class="stage">STAGE</div>';
  
  sections.forEach(section => {
    const sectionSeats = currentState.seatMap.filter(seat => seat.section === section);
    const rows = [...new Set(sectionSeats.map(seat => seat.row))].sort((a, b) => a - b);
    
    mapHTML += `<div class="seating-section">
      <div class="section-title-seat">${section.charAt(0).toUpperCase() + section.slice(1)} Section</div>`;
    
    rows.forEach(rowNum => {
      const rowSeats = sectionSeats.filter(seat => seat.row === rowNum);
      mapHTML += '<div class="seat-row">';
      
      rowSeats.forEach(seat => {
        const seatClass = seat.available 
          ? (seat.selected ? 'selected' : 'available')
          : 'unavailable';
        
        mapHTML += `<div class="seat ${seatClass}" 
          data-seat-id="${seat.id}" 
          data-price="${seat.price}"
          onclick="toggleSeat('${seat.id}')"
          title="Section: ${seat.section}, Row: ${seat.row}, Seat: ${seat.seat} - ${formatPrice(seat.price)}">
        </div>`;
      });
      
      mapHTML += '</div>';
    });
    
    mapHTML += '</div>';
  });
  
  seatMapContainer.innerHTML = mapHTML;
}

function renderPriceTiers() {
  const container = document.getElementById('price-tiers');
  const tiers = Object.entries(appData.seatPricing);
  
  container.innerHTML = tiers.map(([tier, info]) => `
    <div class="tier-item" onclick="highlightTier('${tier}')">
      <div class="tier-info">
        <div class="tier-color" style="background-color: ${info.color}"></div>
        <span>${tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
      </div>
      <div class="tier-price">${formatPrice(info.price)}</div>
    </div>
  `).join('');
}

function toggleSeat(seatId) {
  const seat = currentState.seatMap.find(s => s.id === seatId);
  if (!seat || !seat.available) return;
  
  if (seat.selected) {
    // Deselect seat
    seat.selected = false;
    currentState.selectedSeats = currentState.selectedSeats.filter(s => s.id !== seatId);
  } else {
    // Select seat (limit to 8 seats)
    if (currentState.selectedSeats.length >= 8) {
      alert('Maximum 8 seats can be selected at once.');
      return;
    }
    seat.selected = true;
    currentState.selectedSeats.push(seat);
  }
  
  // Re-render seat map and update display
  renderSeatMap();
  updateSelectedSeatsDisplay();
}

function updateSelectedSeatsDisplay() {
  const container = document.getElementById('selected-seats-list');
  
  if (currentState.selectedSeats.length === 0) {
    container.innerHTML = '<p class="no-seats-message">No seats selected</p>';
  } else {
    container.innerHTML = currentState.selectedSeats.map(seat => `
      <div class="selected-seat-item">
        <div class="seat-info">
          <strong>${seat.section.charAt(0).toUpperCase() + seat.section.slice(1)}</strong>
          Row ${seat.row}, Seat ${seat.seat}
        </div>
        <div class="seat-price">${formatPrice(seat.price)}</div>
        <button class="remove-seat-btn" onclick="toggleSeat('${seat.id}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }
  
  // Update totals
  const ticketTotal = currentState.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFees = ticketTotal * 0.15; // 15% service fee
  const orderTotal = ticketTotal + serviceFees;
  
  document.getElementById('ticket-total').textContent = formatPrice(ticketTotal);
  document.getElementById('service-fees').textContent = formatPrice(serviceFees);
  document.getElementById('order-total').textContent = formatPrice(orderTotal);
  
  // Enable/disable add to cart button
  const addToCartBtn = document.getElementById('add-to-cart');
  addToCartBtn.disabled = currentState.selectedSeats.length === 0;
}

function startSelectionTimer() {
  currentState.timeRemaining = 600; // 10 minutes
  updateTimerDisplay();
  
  if (currentState.selectionTimer) {
    clearInterval(currentState.selectionTimer);
  }
  
  currentState.selectionTimer = setInterval(() => {
    currentState.timeRemaining--;
    updateTimerDisplay();
    
    if (currentState.timeRemaining <= 0) {
      clearInterval(currentState.selectionTimer);
      alert('Time expired! Please start over.');
      showPage('home');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(currentState.timeRemaining / 60);
  const seconds = currentState.timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const timerElement = document.getElementById('selection-timer');
  if (timerElement) {
    timerElement.textContent = display;
  }
}

function proceedToCheckout() {
  if (currentState.selectedSeats.length === 0) return;
  
  // Clear selection timer
  if (currentState.selectionTimer) {
    clearInterval(currentState.selectionTimer);
  }
  
  // Update checkout page with order details
  updateCheckoutDisplay();
  showPage('checkout');
}

function updateCheckoutDisplay() {
  const event = currentState.currentEvent;
  
  // Event details
  document.getElementById('checkout-event-details').innerHTML = `
    <div class="checkout-event">
      <h4>${event.title}</h4>
      <p>${formatDate(event.date)} at ${event.time}</p>
      <p>${event.venue}, ${event.location}</p>
    </div>
  `;
  
  // Ticket details
  document.getElementById('checkout-tickets').innerHTML = `
    <div class="checkout-tickets">
      ${currentState.selectedSeats.map(seat => `
        <div class="checkout-ticket-item">
          <span>${seat.section.charAt(0).toUpperCase() + seat.section.slice(1)} - Row ${seat.row}, Seat ${seat.seat}</span>
          <span>${formatPrice(seat.price)}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Totals
  const ticketTotal = currentState.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFees = ticketTotal * 0.15;
  const processingFee = 2.95;
  const orderTotal = ticketTotal + serviceFees + processingFee;
  
  document.getElementById('checkout-ticket-total').textContent = formatPrice(ticketTotal);
  document.getElementById('checkout-service-fees').textContent = formatPrice(serviceFees);
  document.getElementById('checkout-processing-fee').textContent = formatPrice(processingFee);
  document.getElementById('checkout-order-total').textContent = formatPrice(orderTotal);
}

function completePurchase() {
  // Validate forms
  const contactForm = document.getElementById('contact-form');
  const paymentForm = document.getElementById('payment-form');
  
  if (!contactForm.checkValidity() || !paymentForm.checkValidity()) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Generate order number
  const orderNumber = 'TM-' + Math.floor(Math.random() * 100000000);
  document.getElementById('order-number').textContent = orderNumber;
  
  // Update confirmation page
  updateConfirmationDisplay();
  showPage('confirmation');
}

function updateConfirmationDisplay() {
  const event = currentState.currentEvent;
  
  // Event details
  document.getElementById('confirmation-event-details').innerHTML = `
    <div class="confirmation-event">
      <h4>${event.title}</h4>
      <p>${formatDate(event.date)} at ${event.time}</p>
      <p>${event.venue}, ${event.location}</p>
    </div>
  `;
  
  // Tickets
  document.getElementById('confirmation-tickets').innerHTML = `
    <div class="confirmation-tickets">
      ${currentState.selectedSeats.map(seat => `
        <div class="confirmation-ticket-item">
          <span>${seat.section.charAt(0).toUpperCase() + seat.section.slice(1)} Section - Row ${seat.row}, Seat ${seat.seat}</span>
          <span>${formatPrice(seat.price)}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Ticket preview
  document.getElementById('ticket-event-title').textContent = event.title;
  document.getElementById('ticket-event-details').innerHTML = `
    <p>${formatDate(event.date)} at ${event.time}</p>
    <p>${event.venue}, ${event.location}</p>
  `;
  document.getElementById('ticket-seat-details').innerHTML = `
    <p><strong>Section:</strong> ${currentState.selectedSeats[0].section.charAt(0).toUpperCase() + currentState.selectedSeats[0].section.slice(1)}</p>
    <p><strong>Row:</strong> ${currentState.selectedSeats[0].row} <strong>Seat:</strong> ${currentState.selectedSeats[0].seat}</p>
    <p><strong>Quantity:</strong> ${currentState.selectedSeats.length} ticket(s)</p>
  `;
}

// Search and Filter Functions
function performSearch(query, location = '') {
  const searchTerms = query.toLowerCase().split(' ');
  
  currentState.searchResults = appData.events.filter(event => {
    const matchesQuery = searchTerms.every(term => 
      event.title.toLowerCase().includes(term) ||
      event.category.toLowerCase().includes(term) ||
      event.subcategory.toLowerCase().includes(term) ||
      event.venue.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term)
    );
    
    const matchesLocation = !location || 
      event.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesQuery && matchesLocation;
  });
  
  displaySearchResults();
  showPage('search');
}

function filterEvents() {
  let filteredEvents = [...appData.events];
  
  // Apply category filter
  if (currentState.currentFilters.category !== 'all') {
    filteredEvents = filteredEvents.filter(event => 
      event.category === currentState.currentFilters.category
    );
  }
  
  // Apply other filters as needed
  currentState.searchResults = filteredEvents;
  displaySearchResults();
}

function displaySearchResults() {
  const container = document.getElementById('search-results');
  
  if (currentState.searchResults.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h3>No events found</h3>
        <p>Try adjusting your search criteria or browse our featured events.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = currentState.searchResults.map(event => `
    <div class="event-card" onclick="showEventDetail(${event.id})">
      <img src="${event.image}" alt="${event.title}" class="event-image">
      <div class="event-info">
        <div class="event-title">${event.title}</div>
        <div class="event-date">${formatDate(event.date)} • ${event.time}</div>
        <div class="event-venue">${event.venue}, ${event.location}</div>
        <div class="event-price">From ${event.priceRange.split(' - ')[0]}</div>
        <div class="event-availability ${event.availability.includes('Limited') ? 'limited' : 'on-sale'}">
          ${event.availability}
        </div>
      </div>
    </div>
  `).join('');
}

function displayFeaturedEvents() {
  const container = document.getElementById('featured-events-container');
  const featuredEvents = appData.events.slice(0, 3);
  
  container.innerHTML = featuredEvents.map(event => `
    <div class="event-card" onclick="showEventDetail(${event.id})">
      <img src="${event.image}" alt="${event.title}" class="event-image">
      <div class="event-info">
        <div class="event-title">${event.title}</div>
        <div class="event-date">${formatDate(event.date)} • ${event.time}</div>
        <div class="event-venue">${event.venue}, ${event.location}</div>
        <div class="event-price">From ${event.priceRange.split(' - ')[0]}</div>
        <div class="event-availability ${event.availability.includes('Limited') ? 'limited' : 'on-sale'}">
          ${event.availability}
        </div>
      </div>
    </div>
  `).join('');
}

function displayPopularEvents() {
  const container = document.getElementById('popular-events-container');
  const popularEvents = appData.events.slice(2, 5);
  
  container.innerHTML = popularEvents.map(event => `
    <div class="event-card" onclick="showEventDetail(${event.id})">
      <img src="${event.image}" alt="${event.title}" class="event-image">
      <div class="event-info">
        <div class="event-title">${event.title}</div>
        <div class="event-date">${formatDate(event.date)} • ${event.time}</div>
        <div class="event-venue">${event.venue}, ${event.location}</div>
        <div class="event-price">From ${event.priceRange.split(' - ')[0]}</div>
        <div class="event-availability ${event.availability.includes('Limited') ? 'limited' : 'on-sale'}">
          ${event.availability}
        </div>
      </div>
    </div>
  `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
  });
  
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Navigation links
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      
      if (page === 'home') {
        showPage('home');
      } else {
        // Filter by category
        currentState.currentFilters.category = page.charAt(0).toUpperCase() + page.slice(1);
        if (currentState.currentFilters.category === 'Arts') {
          currentState.currentFilters.category = 'Arts & Theater';
        }
        filterEvents();
        showPage('search');
      }
    });
  });
  
  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      currentState.currentFilters.category = category;
      filterEvents();
      showPage('search');
    });
  });
  
  // Search forms
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query.trim()) {
      performSearch(query);
    }
  });
  
  document.getElementById('hero-search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('hero-search-input').value;
    const location = document.getElementById('location-select').value;
    if (query.trim()) {
      performSearch(query, location);
    }
  });
  
  // Filter controls
  document.getElementById('filter-category').addEventListener('change', (e) => {
    currentState.currentFilters.category = e.target.value;
    filterEvents();
  });
  
  document.getElementById('filter-date').addEventListener('change', (e) => {
    currentState.currentFilters.date = e.target.value;
    filterEvents();
  });
  
  document.getElementById('filter-price').addEventListener('change', (e) => {
    currentState.currentFilters.price = e.target.value;
    filterEvents();
  });
  
  // Seat selection controls
  document.getElementById('clear-seats').addEventListener('click', () => {
    currentState.selectedSeats.forEach(seat => seat.selected = false);
    currentState.selectedSeats = [];
    renderSeatMap();
    updateSelectedSeatsDisplay();
  });
  
  document.getElementById('add-to-cart').addEventListener('click', () => {
    proceedToCheckout();
  });
  
  // Checkout controls
  document.getElementById('back-to-seats').addEventListener('click', () => {
    showPage('seat-selection');
    startSelectionTimer(); // Restart timer
  });
  
  document.getElementById('complete-purchase').addEventListener('click', () => {
    completePurchase();
  });
  
  // Confirmation controls
  document.getElementById('view-tickets').addEventListener('click', () => {
    alert('Ticket viewing functionality would open your mobile tickets here.');
  });
  
  document.getElementById('browse-more').addEventListener('click', () => {
    showPage('home');
  });
  
  // Initialize the application
  displayFeaturedEvents();
  displayPopularEvents();
  showPage('home');
});

// Global functions for inline event handlers
window.showEventDetail = showEventDetail;
window.showSeatSelection = showSeatSelection;
window.toggleSeat = toggleSeat;
window.highlightTier = function(tier) {
  // Highlight seats in the selected tier
  document.querySelectorAll('.seat').forEach(seat => {
    const seatData = currentState.seatMap.find(s => s.id === seat.getAttribute('data-seat-id'));
    if (seatData && seatData.section === tier) {
      seat.style.transform = 'scale(1.1)';
      setTimeout(() => {
        seat.style.transform = '';
      }, 500);
    }
  });
};