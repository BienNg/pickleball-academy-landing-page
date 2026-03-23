// ── Waitlist Form ──────────────────────────────────────────────────────
function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  const nameInput = form.querySelector('#waitlistName');
  const phoneInput = form.querySelector('#waitlistPhone');
  if (!phoneInput) return;

  let iti = null;
  if (typeof intlTelInput === 'function') {
    iti = intlTelInput(phoneInput, {
      initialCountry: 'vn',
      preferredCountries: ['vn', 'us', 'ca', 'gb', 'au'],
      separateDialCode: true,
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@22.0.2/build/js/utils.js',
    });
  }

  const clearFieldErrors = () => {
    nameInput?.classList.remove('error');
    phoneInput.classList.remove('error');
    phoneInput.closest('.iti')?.classList.remove('iti--error');
  };

  const setPhoneError = (on) => {
    phoneInput.classList.toggle('error', on);
    phoneInput.closest('.iti')?.classList.toggle('iti--error', on);
  };

  phoneInput.addEventListener('input', () => {
    phoneInput.classList.remove('error');
    phoneInput.closest('.iti')?.classList.remove('iti--error');
  });
  phoneInput.addEventListener('countrychange', () => {
    phoneInput.classList.remove('error');
    phoneInput.closest('.iti')?.classList.remove('iti--error');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors();

    const validateAndFinish = () => {
      const name = (nameInput?.value || '').trim();
      const phoneTrimmed = (phoneInput.value || '').trim();
      let valid = true;

      if (!name) {
        nameInput?.classList.add('error');
        valid = false;
      }

      const phoneEmpty = !phoneTrimmed;
      let phoneInvalidFormat = false;

      if (phoneEmpty) {
        setPhoneError(true);
        valid = false;
      } else if (iti) {
        if (!iti.isValidNumber()) {
          setPhoneError(true);
          valid = false;
          phoneInvalidFormat = true;
        }
      } else if (phoneTrimmed.replace(/\D/g, '').length < 7) {
        setPhoneError(true);
        valid = false;
        phoneInvalidFormat = true;
      }

      if (!valid) {
        if (!name && phoneEmpty) {
          showToast('Please enter your name and phone number.');
        } else if (!name) {
          showToast('Please enter your name.');
        } else if (phoneEmpty) {
          showToast('Please enter your phone number.');
        } else if (phoneInvalidFormat) {
          showToast('Please enter a valid phone number.');
        } else {
          showToast('Please enter your name and phone number.');
        }
        return;
      }

      // TODO: send { name, phone: iti ? iti.getNumber() : phoneTrimmed } to backend
      showToast(`Thanks, ${name}! You're on the waitlist. We'll be in touch soon.`);
      form.reset();
      if (iti) iti.setNumber('');
    };

    if (iti?.promise) {
      iti.promise.then(validateAndFinish).catch(validateAndFinish);
    } else {
      validateAndFinish();
    }
  });
}
