const API_BASE_URL = 'http://localhost:5000/api';

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

  // User Personalization Logic
  // 1. Capture Name on Login/Register
  const authForms = document.querySelectorAll('.auth-form');
  authForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isRegister = form.id === 'register-form';
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('currentUser', result.user.name);
          localStorage.setItem('currentUserId', result.user.id);
          localStorage.setItem('userRole', result.user.role);
          localStorage.setItem('token', result.token);

          // Redirect based on role
          if (result.user.role === 'admin') window.location.href = 'admin-dashboard.html';
          else if (result.user.role === 'volunteer') window.location.href = 'volunteer-dashboard.html';
          else window.location.href = 'citizen-dashboard.html';
        } else {
          alert(result.msg || 'Authentication failed');
        }
      } catch (err) {
        console.error('Auth error:', err);
        alert('Connection error. Is the server running?');
      }
    });
  });

  // 2. Display Name on Dashboard
  const welcomeMsg = document.querySelector('#welcome-message');
  if (welcomeMsg) {
    const storedName = localStorage.getItem('currentUser');
    if (storedName) {
      welcomeMsg.textContent = welcomeMsg.textContent.includes('!') ? `Welcome, ${storedName}!` : `Welcome, ${storedName}!`;
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

      const formData = new FormData(reportForm);
      const data = Object.fromEntries(formData.entries());
      data.reporterId = localStorage.getItem('currentUserId');

      if (!data.reporterId) {
        alert('Please login to submit a report');
        return;
      }

      submitBtn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          submitBtn.innerHTML = '<i class="ph ph-check"></i> Submitted!';
          submitBtn.style.background = '#059669';

          setTimeout(() => {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
            reportForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            alert('Thank you! Your report has been submitted and is pending review.');
          }, 1500);
        } else {
          throw new Error('Failed to submit report');
        }
      } catch (err) {
        console.error('Report error:', err);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Failed to submit report. Please try again.');
      }
    });
  }

  // Dashboard Sidebar Tab Switching
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const dashboardSections = document.querySelectorAll('.dashboard-section');

  if (sidebarLinks.length > 0 && dashboardSections.length > 0) {
    // Load data based on role/dashboard
    loadReports();
    loadUsers();

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

  async function loadReports() {
    const reportTableBody = document.querySelector('#reports tbody');
    if (!reportTableBody) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      const reports = await response.json();

      const currentUserId = localStorage.getItem('currentUserId');
      const userRole = localStorage.getItem('userRole');

      // Update Overview Stats
      const myReports = reports.filter(r => r.reporter?._id === currentUserId);
      const totalReportsCounter = document.querySelector('.stats-card.stats-primary .counter-value, .chart-card .counter-value[data-target="12"], .chart-card .counter-value[data-target="1248"]');
      if (totalReportsCounter) {
        totalReportsCounter.setAttribute('data-target', userRole === 'citizen' ? myReports.length : reports.length);
        if (typeof animateCounters === 'function') animateCounters(totalReportsCounter.closest('.dashboard-section') || document.body);
      }

      const resolvedReports = reports.filter(r => r.status === 'resolved' && (r.reporter?._id === currentUserId || userRole !== 'citizen'));
      const resolvedCounter = document.querySelector('.stats-card.stats-success .counter-value, .chart-card .counter-value[data-target="8"], .chart-card .counter-value[data-target="18"]');
      if (resolvedCounter) {
        resolvedCounter.setAttribute('data-target', resolvedReports.length);
      }

      // Filter reports for the current user if they are a citizen
      const filteredReports = reports.filter(r => r.reporter?._id === currentUserId || userRole !== 'citizen');

      if (userRole === 'admin') {
        // Handle Admin Table Structure
        reportTableBody.innerHTML = filteredReports.map(r => `
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 1.25rem;">
              <strong>${r.type.charAt(0).toUpperCase() + r.type.slice(1)}</strong><br>
              <span style="font-size: 0.875rem; color: var(--text-light);">${r.location}</span>
            </td>
            <td style="padding: 1.25rem;">${r.reporter?.name || 'Unknown'}</td>
            <td style="padding: 1.25rem;"><span
                style="background: #fff7ed; color: #9a3412; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">MEDIUM</span>
            </td>
            <td style="padding: 1.25rem;"><span
                style="color: ${r.status === 'resolved' ? '#10b981' : '#f59e0b'}; font-weight: 600;">
                ${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
            </td>
            <td style="padding: 1.25rem;">
              <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View</button>
            </td>
          </tr>
        `).join('');
      } else {
        // Handle Citizen/Volunteer Table Structure
        reportTableBody.innerHTML = filteredReports.map(r => `
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 1.25rem; font-weight: 600;">#${r.id?.slice(-6).toUpperCase() || 'N/A'}</td>
            <td style="padding: 1.25rem;">${r.location}</td>
            <td style="padding: 1.25rem;">${r.type.charAt(0).toUpperCase() + r.type.slice(1)}</td>
            <td style="padding: 1.25rem;"><span
                    style="background: ${r.status === 'resolved' ? '#d1fae5' : '#fff7ed'}; 
                           color: ${r.status === 'resolved' ? '#065f46' : '#9a3412'}; 
                           padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.875rem; font-weight: 600;">
                    ${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
            </td>
            <td style="padding: 1.25rem; color: var(--text-light);">${new Date(r.createdAt).toLocaleDateString()}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  }

  async function loadUsers() {
    const userTableBody = document.querySelector('#users tbody');
    if (!userTableBody) return;

    try {
      console.log('Fetching users from API...');
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();
      console.log('Users loaded:', users.length);

      userTableBody.innerHTML = users.map(u => {
        const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const avatarBg = u.role === 'admin' ? 'var(--primary-color)' : (u.role === 'volunteer' ? '#a855f7' : 'var(--secondary-color)');

        return `
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 1rem 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${avatarBg}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                ${initials}
              </div>
              <div>
                <div style="font-weight: 600;">${u.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-light);">${u.email}</div>
              </div>
            </td>
            <td style="padding: 1rem 1.5rem;">
              <span class="pill pill-${u.role}" style="font-size: 0.75rem; font-weight: 700;">${u.role.toUpperCase()}</span>
            </td>
            <td style="padding: 1rem 1.5rem;"><span style="color: #10b981; font-weight: 600;">Active</span></td>
            <td style="padding: 1rem 1.5rem; color: var(--text-light);">Recent</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      console.error('Failed to load users:', err);
    }
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

