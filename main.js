/* main.js */
document.addEventListener('DOMContentLoaded', () => {
  // Use a cache buster to ensure Chrome doesn't serve old versions of components
  const v = new Date().getTime();
  
  // We use root-relative paths for the fetch. 
  // If the site is hosted in a subdirectory (e.g. GitHub Pages project site), 
  // you might need to adjust these paths.
  Promise.all([
    fetch('/navbar.html?v=' + v).then(res => res.text()),
    fetch('/footer.html?v=' + v).then(res => res.text())
  ]).then(([navData, footerData]) => {
    const navbarContainer = document.getElementById('navbar');
    const footerContainer = document.getElementById('footer');

    if (navbarContainer) {
      navbarContainer.innerHTML = navData;
      // Initialize everything AFTER insertion
      fixLogoPath();
      fixHamburgerVisibility();
      initNavigation();
    }
    if (footerContainer) {
      footerContainer.innerHTML = footerData;
    }
  }).catch(err => {
    console.error('Error loading navigation components:', err);
    // Fallback if root-relative fails: try fetching relative to current directory
    if (window.location.pathname.includes('/pages/')) {
       console.log('Retrying fetch from relative path...');
       // Implementation of retry could go here if needed
    }
  });
});

/**
 * Ensures the logo path is resolved correctly in all browsers, 
 * especially Google Chrome which can be aggressive with caching and relative resolution.
 */
function fixLogoPath() {
  const logo = document.getElementById('navbar-logo');
  if (logo) {
    const targetPath = '/images/logos/DeNovoInPSOctober31-2025.png';
    // Ensure the logo source is always root-relative to fix subpage 404s
    if (logo.getAttribute('src') !== targetPath) {
      logo.src = targetPath;
    }
  }
}



/**
 * Programmatically enforces hamburger visibility to prevent CSS leaks on desktop.
 */
function fixHamburgerVisibility() {
  const toggleBtn = document.getElementById('menu-toggle');
  if (toggleBtn) {
    if (window.innerWidth > 1024) {
      toggleBtn.style.setProperty('display', 'none', 'important');
    } else {
      toggleBtn.style.setProperty('display', 'block', 'important');
    }
  }
}



// Ensure visibility is updated on window resize
window.addEventListener('resize', fixHamburgerVisibility);

function initNavigation() {
  const toggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggleBtn && mobileMenu) {
    // Remove any existing listeners (just in case) then add
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
    };
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    }
  });

  enableMobileDropdowns();
}

function enableMobileDropdowns() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (!mobileMenu) return;

  const dropdowns = mobileMenu.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    if (!link) return;
    
    link.addEventListener('click', (e) => {
      // Only apply mobile logic on appropriate screen sizes
      if (window.innerWidth <= 1024) {
        // Stop propagation so the 'click outside' listener doesn't fire
        e.stopPropagation();
        
        // If not already active, open it
        if (!dropdown.classList.contains('active')) {
          e.preventDefault();
          
          // Close other open dropdowns at the same level
          dropdowns.forEach(other => {
            if (other !== dropdown) other.classList.remove('active');
          });
          
          dropdown.classList.add('active');
        } else {
          // If already active and it's just a toggle link (#), close it
          const href = link.getAttribute('href');
          if (href === '#' || href === '') {
            e.preventDefault();
            dropdown.classList.remove('active');
          }
          // Otherwise, allow standard navigation on the second click
        }
      }
    });
  });
}
