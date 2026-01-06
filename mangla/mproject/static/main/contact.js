
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  alert('Message sent successfully! We will get back to you soon.');
  this.reset(); 
});


document.querySelectorAll('.dropdown-submenu > a').forEach(function(element) {
  element.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation(); 
    const submenu = this.nextElementSibling;
    if (submenu && submenu.classList.contains('dropdown-menu')) {
      submenu.classList.toggle('show');
    }
  });
});


document.addEventListener('click', function(e) {
  document.querySelectorAll('.dropdown-submenu .dropdown-menu.show').forEach(function(submenu) {
    if (!submenu.contains(e.target)) {
      submenu.classList.remove('show');
    }
  });
});
