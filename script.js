document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');

      // Also toggle dashboard sidebar if it exists
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('active');
      }

      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Theme Toggle Logic
  const themeToggle = document.querySelector('.theme-toggle');
  const icon = themeToggle?.querySelector('i');

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateIcon(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme === 'dark');
    });
  }

  function updateIcon(isDark) {
    if (icon) {
      icon.className = isDark ? 'ph-fill ph-sun' : 'ph-fill ph-moon';
    }
  }

  // Auth Tabs Logic
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));

      // Add active class to clicked
      tab.classList.add('active');

      // Show corresponding form
      const targetId = tab.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Scroll Spy Logic for Index Page
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0 && mainNavLinks.length > 0) {
    // Options to create a "trigger line" around the middle-top of the viewport
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Active when element is in the top part of screen
      threshold: 0
    };

    // Counter Animation
    const speed = 200; // The lower the slower

    const animateCounters = (container = document) => {
      const counters = container.querySelectorAll('.counter-value');
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;

        const updateCount = () => {
          const inc = target / speed;
          if (count < target) {
            count += inc;
            counter.innerText = Math.ceil(count).toLocaleString();
            setTimeout(updateCount, 10);
          } else {
            counter.innerText = target.toLocaleString() + (counter.getAttribute('data-suffix') || '');
          }
        };
        updateCount();
      });
    };

    // Intersection Observer for Counters (Initial load)
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.dashboard-section, .stats-section').forEach(section => {
      counterObserver.observe(section);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // Scroll Animations
  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.1
  });

  scrollElements.forEach(el => scrollObserver.observe(el));


  // =====================================================
  // MONGODB API AUTH LOGIC
  // =====================================================
  const API_BASE = 'http://localhost:5000/api';

  // Dashboard redirects per role
  const DASHBOARD_MAP = {
    citizen: 'citizen-dashboard.html',
    volunteer: 'volunteer-dashboard.html',
    admin: 'admin-dashboard.html',
  };

  const authForms = document.querySelectorAll('.auth-form[data-action]');
  authForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const role = form.getAttribute('data-role');     // citizen | volunteer | admin
      const action = form.getAttribute('data-action'); // login | register

      // Determine error div
      const prefix = role + '-' + action;
      const errorDiv = document.getElementById(prefix + '-error');
      if (errorDiv) { errorDiv.style.display = 'none'; errorDiv.textContent = ''; }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Please wait...';
      submitBtn.disabled = true;

      try {
        let url, body;

        if (action === 'register') {
          const nameEl = document.getElementById(`${role}-register-name`);
          const emailEl = document.getElementById(`${role}-register-email`);
          const passEl = document.getElementById(`${role}-register-password`);
          const locationEl = document.getElementById(`${role}-register-location`);
          const skillsEl = document.getElementById(`${role}-register-skills`);

          url = `${API_BASE}/auth/register`;
          body = {
            name: nameEl ? nameEl.value : '',
            email: emailEl ? emailEl.value : '',
            password: passEl ? passEl.value : '',
            role,
            location: locationEl ? locationEl.value : '',
            skills: skillsEl ? skillsEl.value : '',
          };
        } else {
          // login
          const emailEl = document.getElementById(`${role}-login-email`);
          const passEl = document.getElementById(`${role}-login-password`);

          url = `${API_BASE}/auth/login`;
          body = {
            email: emailEl ? emailEl.value : '',
            password: passEl ? passEl.value : '',
            role,
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          if (errorDiv) {
            errorDiv.textContent = data.message || 'Something went wrong.';
            errorDiv.style.display = 'block';
          }
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          return;
        }

        // Success — store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', data.user.name);
        localStorage.setItem('currentUserRole', data.user.role);
        localStorage.setItem('currentUserId', data.user.id);

        submitBtn.innerHTML = '<i class="ph ph-check"></i> Success!';
        setTimeout(() => {
          window.location.href = DASHBOARD_MAP[data.user.role] || 'index.html';
        }, 800);

      } catch (err) {
        console.error('Auth error:', err);
        if (errorDiv) {
          errorDiv.textContent = 'Cannot reach server. Make sure the backend is running on port 5000.';
          errorDiv.style.display = 'block';
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  });

  // Display Name on Dashboard
  const welcomeMsg = document.querySelector('#welcome-message');
  if (welcomeMsg) {
    const storedName = localStorage.getItem('currentUser');
    if (storedName) {
      welcomeMsg.textContent = `Welcome, ${storedName}!`;
    }
  }


  // Modal Logic for "New Report"
  const openModalBtn = document.querySelector('[data-open-modal]');
  const closeModalBtn = document.querySelector('[data-close-modal]');
  const modalOverlay = document.querySelector('.modal-overlay');
  const reportForm = document.getElementById('newReportForm');

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = reportForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first to submit a report.');
        return;
      }

      submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Submitting...';
      submitBtn.disabled = true;

      const formData = new FormData(reportForm);
      const body = {
        location: formData.get('location'),
        issue: formData.get('issue'),
        description: formData.get('description'),
      };

      try {
        const res = await fetch('http://localhost:5000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || 'Failed to submit report.');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          return;
        }

        submitBtn.innerHTML = '<i class="ph ph-check"></i> Submitted!';
        submitBtn.style.background = '#059669';

        setTimeout(() => {
          modalOverlay.style.display = 'none';
          document.body.style.overflow = '';
          reportForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          alert('✅ Your report has been saved to the database and is pending review!');
        }, 1500);

      } catch (err) {
        console.error('Report submit error:', err);
        alert('Cannot reach server. Make sure the backend is running on port 5000.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Dashboard Sidebar Tab Switching
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const dashboardSections = document.querySelectorAll('.dashboard-section');

  if (sidebarLinks.length > 0 && dashboardSections.length > 0) {
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');

        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        dashboardSections.forEach(section => {
          if (section.id === targetTab) {
            section.classList.add('active');
            // Re-trigger counters for this section
            if (typeof animateCounters === 'function') animateCounters(section);
          } else {
            section.classList.remove('active');
          }
        });

        // Close mobile sidebar
        const navLinks = document.querySelector('.nav-links');
        const sidebar = document.querySelector('.sidebar');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (sidebar) sidebar.classList.remove('active');
        }
      });
    });
  }

  // Initialize Maps with multiple markers
  const activeMaps = {};
  const initMap = (id, coords, zoom = 13, markers = []) => {
    const container = document.getElementById(id);
    if (container && typeof L !== 'undefined') {
      const map = L.map(id).setView(coords, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add markers
      const customMarkers = markers.length > 0 ? markers : [coords];
      customMarkers.forEach((m, index) => {
        const mCoords = Array.isArray(m) ? m : coords;
        const msg = typeof m === 'string' ? m : `Active monitoring point #${index + 1}`;
        L.marker(mCoords).addTo(map).bindPopup(msg);
      });

      activeMaps[id] = map;
      return map;
    }
    return null;
  };

  // Sample data for maps
  const citizenMarkers = [
    { coords: [40.7128, -74.0060], msg: "Recent leakage reported here." },
    { coords: [40.7150, -74.0100], msg: "Status: Investigating" }
  ];

  const adminMarkers = [
    { coords: [40.7128, -74.0060], msg: "District HQ" },
    { coords: [40.7200, -74.0000], msg: "Alert: High Turbidity" },
    { coords: [40.7050, -74.0200], msg: "Maintenance in progress" }
  ];

  // Citizen Dashboard Map
  initMap('reportsMap', [40.7128, -74.0060], 13, citizenMarkers.map(m => m.coords));

  // Admin Dashboard Map
  initMap('adminMap', [40.7128, -74.0060], 12, adminMarkers.map(m => m.coords));

  // Volunteer Dashboard Map
  initMap('volunteerMap', [40.7128, -74.0060], 14, [
    [40.7128, -74.0060], [40.7180, -74.0080]
  ]);

  // Fix Leaflet map sizing issue on tab switch
  if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => {
          Object.values(activeMaps).forEach(map => {
            map.invalidateSize();
          });
          window.dispatchEvent(new Event('resize'));
        }, 150);
      });
    });
  }

  // Global Interactivity for Buttons
  const globalButtons = document.querySelectorAll('button:not(.theme-toggle):not(.menu-toggle):not([data-open-modal]):not([data-close-modal]):not(.auth-tab):not([type="submit"]), .btn:not(.btn-primary[href^="#"]):not([type="submit"]), .sidebar-link:not([data-tab])');

  const showFeatureNotice = (title, description) => {
    const notice = document.createElement('div');
    notice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white);
            color: var(--text-dark);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            box-shadow: var(--shadow-lg);
            border-left: 5px solid var(--secondary-color);
            z-index: 10001;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

    notice.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <i class="ph-fill ph-info" style="font-size: 1.5rem; color: var(--secondary-color);"></i>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0;">${title}</h4>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">${description}</p>
                </div>
                <button class="close-notice" style="background: none; border: none; cursor: pointer; color: var(--text-light);"><i class="ph ph-x"></i></button>
            </div>
        `;

    document.body.appendChild(notice);

    const closeBtn = notice.querySelector('.close-notice');
    closeBtn.onclick = () => notice.remove();

    setTimeout(() => {
      if (notice.parentElement) notice.remove();
    }, 5000);
  };

  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
  document.head.appendChild(styleSheet);

  globalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's a link to a section or page, let it handle itself
      if (btn.tagName === 'A' && (btn.getAttribute('href')?.startsWith('#') || btn.getAttribute('href')?.endsWith('.html'))) {
        return;
      }

      e.preventDefault();
      const text = btn.innerText.trim();
      let title = "Feature Information";
      let desc = `You clicked on "${text}". This feature is currently being processed and will be fully operational shortly.`;

      if (text.includes('View More') || text.includes('Read More')) {
        title = text;
        desc = "Expanding content for more details. Our data is being synchronized for the latest updates.";
      } else if (text.includes('Connect') || text.includes('Contact')) {
        title = "Contact Support";
        desc = "Initializing secure connection to our support team...";
      } else if (text.includes('Logout') || text.includes('Sign Out')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
        return;
      }

      showFeatureNotice(title, desc);
    });
  });
});

