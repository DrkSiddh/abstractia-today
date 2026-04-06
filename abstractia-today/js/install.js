// ABSTRACTIA — Installation Inquiry Form

let currentPath = null;
let currentTier = null;

function selectPath(path) {
  currentPath = path;
  document.getElementById('pathScreen').classList.toggle('selected', path === 'screen');
  document.getElementById('pathInstall').classList.toggle('selected', path === 'install');

  const ownerBox = document.getElementById('ownershipBox');
  ownerBox.style.display = 'block';

  if (path === 'screen') {
    document.getElementById('ownershipText').textContent =
      'Displaying ABSTRACTIA on your own screen is straightforward once you collect the work. If you\'re showing it at a commercial venue or ticketed event, a display agreement applies — reach out and we\'ll make it simple.';
  } else {
    document.getElementById('ownershipText').textContent =
      'Every installation begins with ownership of the work. The $15,000 minimum covers Maxximillian and a small crew traveling to your location, hardware coordination, and on-site setup. If you haven\'t yet collected the work, we can discuss that as part of the engagement.';
  }

  document.getElementById('contactSection').style.display = 'block';
  document.getElementById('screenSection').style.display = path === 'screen' ? 'block' : 'none';
  document.getElementById('installSection').style.display = path === 'install' ? 'block' : 'none';
  document.getElementById('curateSection').style.display = 'block';

  updateProgress(2);
  setTimeout(() => {
    document.getElementById('contactSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function selectTier(tier) {
  currentTier = tier;
  document.getElementById('tierTemp').classList.toggle('selected', tier === 'temporary');
  document.getElementById('tierSemi').classList.toggle('selected', tier === 'semi');
  document.getElementById('tierPerm').classList.toggle('selected', tier === 'permanent');
  updateProgress(3);
}

function updateProgress(step) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('ps' + i).classList.toggle('done', i <= step);
  }
}

async function submitForm() {
  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const owns = document.getElementById('chkOwns').checked;
  const consent = document.getElementById('chkConsent').checked;

  if (!name || !email) { alert('Please fill in your name and email.'); return; }
  if (!currentPath) { alert('Please select how you\'d like to engage.'); return; }
  if (!owns || !consent) { alert('Please confirm ownership and usage terms before submitting.'); return; }

  const payload = {
    inquiry_type: currentPath === 'screen' ? 'screen' : 'install',
    venue_type: document.getElementById('fSpaceType').value || null,
    name,
    organization: document.getElementById('fOrg').value.trim() || null,
    email,
    phone: document.getElementById('fPhone').value.trim() || null,
    location: document.getElementById('fLocation').value.trim() || null,
    install_type: currentTier || null,
    owns_work: owns,
    works_owned: currentPath === 'screen'
      ? document.getElementById('fWorks').value.trim()
      : document.getElementById('fInstallWorks').value.trim(),
    budget_range: currentPath === 'install'
      ? document.getElementById('fBudget').value
      : null,
    space_dims: currentPath === 'install'
      ? document.getElementById('fDims').value.trim()
      : null,
    display_context: currentPath === 'screen'
      ? document.getElementById('fDisplayCtx').value
      : null,
    screen_setup: currentPath === 'screen'
      ? document.getElementById('fScreen').value.trim()
      : null,
    wants_curation: document.getElementById('chkCurate').checked,
    notes: currentPath === 'screen'
      ? document.getElementById('fScreenNotes').value.trim()
      : document.getElementById('fInstallNotes').value.trim(),
    status: 'new'
  };

  // Submit to Supabase
  try {
    if (window.sb) {
      const { error } = await window.sb.from('inquiries').insert([payload]);
      if (error) throw error;
    }
  } catch (err) {
    console.error('Supabase submission error:', err);
    // Still show success — don't block the user
  }

  updateProgress(4);
  document.getElementById('formWrap').style.display = 'none';
  const success = document.getElementById('successPanel');
  success.style.display = 'block';
  success.classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
