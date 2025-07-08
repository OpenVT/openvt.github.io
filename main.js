document.addEventListener('DOMContentLoaded', () => {
  fetch('/navbar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
      activateMenuToggle();
      enableMobileDropdowns();
    });

  fetch('/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
});

function activateMenuToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}
function enableMobileDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });
} 
function toggleMobileMenu() {
  document.getElementById("mobileMenu").classList.toggle("active");
}
