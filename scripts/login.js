document.addEventListener('DOMContentLoaded', () => {
  const loginFormPanel = document.querySelector('.login-form-panel');
  const loginImagePanel = document.getElementById('login-image-panel');
  const showLoginBtn = document.getElementById('show-login-btn');
  const showRegisterBtn = document.getElementById('show-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const activeIndicator = document.querySelector('.active-indicator');
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');
  const userInfoUsername = document.getElementById('user-info-username');
  const userInfoPhone = document.getElementById('user-info-phone');
  const logoutBtn = document.getElementById('logout-btn');
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  const userInfoMessage = document.getElementById('user-info-message');

  const USER_ACCOUNTS_KEY = 'userAccounts';
  const LOGGED_IN_USER_KEY = 'loggedInUser';
  const IMAGE_BASE = 'images/login_bg';
  const IMAGE_COUNT = 5;

  const getAccounts = () => JSON.parse(localStorage.getItem(USER_ACCOUNTS_KEY) || '{}');
  const saveAccounts = (accounts) => localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
  const clearMessage = (element) => displayMessage(element, '', 'info');

  function displayMessage(element, message, type = 'info') {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`;
  }

  function setBackgroundImage() {
    let visitCount = parseInt(localStorage.getItem('loginVisitCount') || '0') + 1;
    localStorage.setItem('loginVisitCount', visitCount);
    const imageIndex = (visitCount % IMAGE_COUNT) + 1;
    loginImagePanel && (loginImagePanel.style.backgroundImage = `url('${IMAGE_BASE}${imageIndex}.webp')`);
  }

  function showUserInfo(username) {
    const accounts = getAccounts();
    const user = accounts[username];
    if (user) {
      userInfoUsername.textContent = username;
      userInfoPhone.textContent = user.phone || 'Không có sẵn';
      loginFormPanel.classList.add('logged-in');
      clearMessage(userInfoMessage);
    } else {
      console.error('Không tìm thấy dữ liệu người dùng:', username);
      logout();
    }
  }

  function showAuthForms() {
    loginFormPanel.classList.remove('logged-in');
    switchForm(true);
  }

  function switchForm(showLogin) {
    if (loginFormPanel.classList.contains('logged-in')) return;

    loginForm?.classList.toggle('active-form', showLogin);
    registerForm?.classList.toggle('active-form', !showLogin);
    showLoginBtn?.classList.toggle('active', showLogin);
    showRegisterBtn?.classList.toggle('active', !showLogin);
    activeIndicator?.classList.toggle('show-register', !showLogin);
    clearMessage(loginMessage);
    clearMessage(registerMessage);
  }

  showLoginBtn?.addEventListener('click', () => switchForm(true));
  showRegisterBtn?.addEventListener('click', () => switchForm(false));

  forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Đây chỉ là một mô phỏng, vì vậy rất tiếc chúng tôi không thể cung cấp dịch vụ này ngay bây giờ.\n\nTuy nhiên, bạn có thể xóa sạch localStorage, xóa tất cả các tài khoản mô phỏng!\n\nXóa tất cả tài khoản?')) {
      localStorage.removeItem(USER_ACCOUNTS_KEY);
      alert('Tất cả tài khoản mô phỏng đã bị xóa khỏi localStorage.');
      displayMessage(loginMessage, 'Đã xóa tài khoản.', 'info');
    }
  });

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage(loginMessage);

    const { username, password } = loginForm.elements;
    if (!username.value.trim() || !password.value) {
      return displayMessage(loginMessage, 'Vui lòng nhập tên đăng nhập và mật khẩu.', 'error');
    }

    const user = getAccounts()[username.value];
    if (user && user.password === password.value) {
      sessionStorage.setItem(LOGGED_IN_USER_KEY, username.value);
      showUserInfo(username.value);
      loginForm.reset();
    } else {
      displayMessage(loginMessage, 'Tên đăng nhập hoặc mật khẩu không hợp lệ.', 'error');
    }
  });

  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage(registerMessage);

    const { phone, username, password, repeatPassword } = registerForm.elements;
    if (!phone.value.trim() || !username.value.trim() || !password.value || !repeatPassword.value) {
      return displayMessage(registerMessage, 'Tất cả các trường là bắt buộc.', 'error');
    }
    if (password.value !== repeatPassword.value) {
      return displayMessage(registerMessage, 'Mật khẩu không khớp.', 'error');
    }
    if (getAccounts()[username.value]) {
      return displayMessage(registerMessage, 'Tên đăng nhập đã tồn tại.', 'error');
    }

    const accounts = getAccounts();
    accounts[username.value] = { password: password.value, phone: phone.value };
    saveAccounts(accounts);

    displayMessage(registerMessage, 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.', 'success');
    registerForm.reset();
    setTimeout(() => switchForm(true), 1500);
  });

  function logout() {
    sessionStorage.removeItem(LOGGED_IN_USER_KEY);
    showAuthForms();
  }
  logoutBtn?.addEventListener('click', logout);

  deleteAccountBtn?.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản của mình? Hành động này không thể hoàn tác.')) {
      const user = sessionStorage.getItem(LOGGED_IN_USER_KEY);
      if (user) {
        const accounts = getAccounts();
        delete accounts[user];
        saveAccounts(accounts);
        displayMessage(userInfoMessage, 'Đã xóa tài khoản thành công.', 'success');
        logout();
      } else {
        console.error('Không có người dùng để xóa.');
        logout();
      }
    }
  });

  const handleEnterKey = (e, form) => e.key === 'Enter' && (e.preventDefault(), form.dispatchEvent(new Event('submit')));
  loginForm?.querySelectorAll('input').forEach(input => input.addEventListener('keydown', (e) => handleEnterKey(e, loginForm)));
  registerForm?.querySelectorAll('input').forEach(input => input.addEventListener('keydown', (e) => handleEnterKey(e, registerForm)));

  sessionStorage.getItem(LOGGED_IN_USER_KEY) ? showUserInfo(sessionStorage.getItem(LOGGED_IN_USER_KEY)) : showAuthForms();
  setBackgroundImage();
});