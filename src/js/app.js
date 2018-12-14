let mainNav = document.getElementById('main-nav');
let navbarToggle = document.getElementById('navbar-toggle');

navbarToggle.addEventListener('click', function () {
  if (this.classList.contains('active')) {
    // mainNav.style.display = "none";
    mainNav.classList.remove('active-nav');
    this.classList.remove('active');
  } else {
    // mainNav.style.display = "flex";
    mainNav.classList.add('active-nav');
    this.classList.add('active');
  }
});