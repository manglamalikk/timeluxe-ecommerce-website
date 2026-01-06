// Initialize cart and login state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Main DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
    // Clickable titles functionality
    const clickableTitles = document.querySelectorAll('.card-discover .card-title.clickable');
    clickableTitles.forEach(title => {
        title.addEventListener('mousedown', () => {
            title.classList.add('clicked');
        });

        title.addEventListener('mouseup', () => {
            title.classList.remove('clicked');
            const link = title.dataset.link;
            if (link) {
                window.location.href = link;
            }
        });

        title.addEventListener('mouseleave', () => {
            title.classList.remove('clicked');
        });

        title.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    });

    // Carousel initialization
    const carousel = document.getElementById('carouselExampleFade');
    if (carousel) {
        new bootstrap.Carousel(carousel, {
            interval: 0,
            wrap: true
        });
    }

    // Dropdown submenu functionality
    document.querySelectorAll('.dropdown-submenu > a').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('dropdown-menu')) {
                submenu.classList.toggle('show');
            }
        });
    });

    // Close submenus when clicking outside
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.dropdown-submenu .dropdown-menu.show').forEach(submenu => {
            if (!submenu.contains(e.target)) {
                submenu.classList.remove('show');
            }
        });
    });

    updateCartCount();
});

// === LOGIN PAGE FORMS ===
document.getElementById('loginForm')?.addEventListener('submit', handleAuthForm);
document.getElementById('signupForm')?.addEventListener('submit', handleAuthForm);

// === MODAL FORMS ===
document.getElementById('modalLoginForm')?.addEventListener('submit', handleAuthForm);
document.getElementById('modalSignupForm')?.addEventListener('submit', handleAuthForm);

function handleAuthForm(event) {
  event.preventDefault();

  const isModal = event.target.id.includes('modal');
  const isLogin = event.target.id.toLowerCase().includes('login');

  const email = document.getElementById(isModal ? 'modalLoginEmail' : 'loginEmail')?.value ||
                document.getElementById(isModal ? 'modalSignupEmail' : 'signupEmail')?.value;
  const password = document.getElementById(isModal ? 'modalLoginPassword' : 'loginPassword')?.value ||
                   document.getElementById(isModal ? 'modalSignupPassword' : 'signupPassword')?.value;

  if (!email || !password) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!isLogin) {
    const confirmPassword = document.getElementById(isModal ? 'modalConfirmPassword' : 'confirmPassword')?.value;
    if (!confirmPassword || confirmPassword !== password) {
      alert('Passwords do not match.');
      return;
    }
  }

  // ✅ Set login flag
  localStorage.setItem('isLoggedIn', 'true');

  // ✅ Close modal if open
  const modalEl = document.getElementById('loginRequiredModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  // ✅ Check for any pending actions
  const pendingAction = localStorage.getItem('pendingAction');
  const pendingProduct = JSON.parse(localStorage.getItem('pendingProduct'));
  const pendingCheckout = localStorage.getItem('pendingCheckout');

  // 🛒 Handle Add to Cart after login
  if (pendingAction === 'addToCart' && pendingProduct) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === pendingProduct.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...pendingProduct, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.removeItem('pendingAction');
    localStorage.removeItem('pendingProduct');
    localStorage.removeItem('pendingCheckout');
    window.location.href = 'cart.html';
    return;
  }

  // 🧾 Handle Buy Now after login
  if (pendingAction === 'buyNow' && pendingProduct) {
    const cart = [{ ...pendingProduct, quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.removeItem('pendingAction');
    localStorage.removeItem('pendingProduct');
    localStorage.removeItem('pendingCheckout');
    window.location.href = 'checkout.html';
    return;
  }

  // 🛒 Handle direct checkout
  if (pendingCheckout === 'true') {
    localStorage.removeItem('pendingCheckout');
    window.location.href = 'checkout.html';
    return;
  }

  // ✅ Default fallback if no action pending
  window.location.href = 'index.html'; // or 'products.html' if you prefer
}



   

// Update cart count function (should be accessible globally)
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'block' : 'none';
    }
}
function showLoginModal() {
  const modalEl = document.getElementById('loginRequiredModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// Buy Now functionality
function buyNow(productName, price, image) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    localStorage.setItem('pendingAction', 'buyNow');
    localStorage.setItem('pendingProduct', JSON.stringify({ name: productName, price, image }));
    showLoginModal();
    return;
  }
  cart = [{ name: productName, price, image, quantity: 1 }];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  window.location.href = 'checkout.html';
}

function addToCart(productName, price, image) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    localStorage.setItem('pendingAction', 'addToCart');
    localStorage.setItem('pendingProduct', JSON.stringify({ name: productName, price, image }));
    showLoginModal();
    return;
  }
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, price, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
  const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.textContent = `${productName} added to cart!`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);

// Initialize cart count on load
updateCartCount();

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    const modalEl = document.getElementById('loginRequiredModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
});
