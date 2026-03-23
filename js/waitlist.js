// ── Waitlist Form ──────────────────────────────────────────────────────
const ZAPIER_WAITLIST_HOOK =
  'https://hooks.zapier.com/hooks/catch/13711388/upqvxww/';

function closeWaitlistSuccessModal() {
  const modal = $('waitlistSuccessModal');
  if (!modal?.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openWaitlistSuccessModal(name) {
  const modal = $('waitlistSuccessModal');
  const messageEl = $('waitlistSuccessMessage');
  if (!modal || !messageEl) return;
  messageEl.textContent = `Thanks, ${name}. We'll contact you soon with updates.`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const dismiss = $('waitlistSuccessDismiss');
  dismiss?.focus();
}

function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  const nameInput = form.querySelector('#waitlistName');
  const phoneInput = form.querySelector('#waitlistPhone');
  const experienceInput = form.querySelector('#waitlistExperience');
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
    experienceInput?.classList.remove('error');
  };

  nameInput?.addEventListener('input', () => {
    nameInput.classList.remove('error');
  });

  experienceInput?.addEventListener('change', () => {
    experienceInput.classList.remove('error');
  });

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

  const successModal = $('waitlistSuccessModal');
  const successDismiss = $('waitlistSuccessDismiss');
  successDismiss?.addEventListener('click', closeWaitlistSuccessModal);
  successModal?.addEventListener('click', () => closeWaitlistSuccessModal());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors();

    const validateAndFinish = () => {
      const name = (nameInput?.value || '').trim();
      const phoneTrimmed = (phoneInput.value || '').trim();
      const experience = experienceInput?.value || '';
      let valid = true;

      if (!name) {
        nameInput?.classList.add('error');
        valid = false;
      }

      if (!experience) {
        experienceInput?.classList.add('error');
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
        if (phoneInvalidFormat) {
          showToast('Please enter a valid phone number.');
        } else {
          showToast(
            'Please fill in your name, phone number, and playing experience.'
          );
        }
        return;
      }

      const phonePayload = iti ? iti.getNumber() : phoneTrimmed;
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
      }

      const payload = {
        name,
        phone: phonePayload,
        playingExperience: experience,
      };

      fetch(ZAPIER_WAITLIST_HOOK, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(payload),
      })
        .then(() => {
          openWaitlistSuccessModal(name);
          form.reset();
          if (iti) iti.setNumber('');
        })
        .catch(() => {
          showToast(
            'Something went wrong. Please try again in a moment.'
          );
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
          }
        });
    };

    if (iti?.promise) {
      iti.promise.then(validateAndFinish).catch(validateAndFinish);
    } else {
      validateAndFinish();
    }
  });
}
