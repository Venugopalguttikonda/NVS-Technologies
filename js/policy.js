// Money Ledgr Privacy Policy popup.
// Any link with data-open-policy opens it, and so does the address ending in #privacy.
(function () {
  const BODY = "<p>MoneyLedgr (\"we\", \"us\", or \"our\") is a personal finance management application that helps users track transactions, budgets, accounts/assets, loans, investments, split groups, reports and related financial records.</p>\n<aside class=\"policy-note\"><strong>Important:</strong> MoneyLedgr is a financial tracking tool and does not provide banking, lending, investment advisory, tax, legal, or other regulated financial services.</aside>\n<h2>1. Information You Provide</h2>\n<p>Depending on the features you use, you may enter information including transaction amounts, dates, categories, descriptions and notes; budgets; account and asset records; loan principal, interest, dates and payments; investment records; split-group details and messages; and information contained in reports or exports you choose to create.</p>\n<h2>2. Information Stored on Your Device</h2>\n<p>MoneyLedgr may store app data locally on your device to provide its features. This can include financial records and preferences that you create. You are responsible for protecting access to your device.</p>\n<h2>3. Cloud Services</h2>\n<p>Some online features may use cloud services for synchronization, split groups, messaging, backups, or other functionality. Information required for those features may be transmitted to the relevant service provider. MoneyLedgr does not sell your personal financial information.</p>\n<h2>4. Advertising</h2>\n<p>The Free plan may display advertisements. MoneyLedgr uses Google AdMob for advertising. Google and its advertising partners may process information such as device identifiers, IP address, app/device information, advertising interactions and other information permitted by applicable law and the relevant Google services.</p>\n<p>Base and Premium subscriptions are designed to provide an ad-free experience.</p>\n<p>For information about Google's use of data, please review Google's applicable privacy information.</p>\n<h2>5. Consent and Personalized Advertising</h2>\n<p>Where required, MoneyLedgr may use Google's consent management tools to obtain and manage consent for advertising and related technologies. Depending on your location and choices, advertising may be personalized or non-personalized. Where applicable, users may be given controls to change or withdraw advertising consent.</p>\n<h2>6. Subscriptions and In-App Purchases</h2>\n<p>MoneyLedgr offers optional Base and Premium subscriptions through Google Play Billing. Google Play processes purchases and payments. MoneyLedgr may receive information necessary to determine whether a subscription is active and which subscription tier applies. MoneyLedgr does not receive or store your full payment card or bank account details through Google Play Billing.</p>\n<h2>7. How We Use Information</h2>\n<ul>\n<li>Provide and operate MoneyLedgr features.</li>\n<li>Save and display records you create.</li>\n<li>Provide budgets, loans, investments, accounts/assets and split groups.</li>\n<li>Generate reports and exports requested by you.</li>\n<li>Provide subscription features and enforce plan limits.</li>\n<li>Display advertisements on plans that include advertising.</li>\n<li>Maintain security and troubleshoot technical problems.</li>\n<li>Comply with applicable legal obligations.</li>\n</ul>\n<h2>8. Data Retention</h2>\n<p>We retain information for as long as reasonably necessary to provide relevant functionality, maintain requested records, comply with legal obligations, resolve disputes and enforce applicable agreements. Data stored only on your device may remain until you delete it, clear app data, uninstall the app, or otherwise remove it.</p>\n<h2>9. Data Deletion</h2>\n<p>If MoneyLedgr provides cloud/account-based storage, you may request deletion of applicable account data by contacting us using the email below. Eligible requests will be processed subject to applicable law and legitimate retention requirements.</p>\n<p>For data stored only locally, you can generally remove it by deleting records, clearing app data, or uninstalling the app, subject to device and backup behavior.</p>\n<h2>10. Data Security</h2>\n<p>We take reasonable measures designed to protect information handled by MoneyLedgr. However, no electronic storage or transmission method can be guaranteed completely secure.</p>\n<h2>11. Third-Party Services</h2>\n<ul>\n<li><strong>Google AdMob</strong> for advertising.</li>\n<li><strong>Google Play Billing</strong> for subscriptions and purchases.</li>\n<li><strong>Google consent management services</strong> where required for advertising consent.</li>\n<li>Other infrastructure or cloud services where required by implemented app features.</li>\n</ul>\n<p>Third-party services have their own privacy policies and terms.</p>\n<h2>12. Children's Privacy</h2>\n<p>MoneyLedgr is intended for a general audience and is not specifically directed toward children. We do not knowingly collect children's personal information in violation of applicable law.</p>\n<h2>13. Your Choices and Rights</h2>\n<p>Depending on applicable law, you may have rights concerning access, correction, deletion, restriction or other processing of your personal information. You may also control certain advertising and consent choices through the app and your device.</p>\n<h2>14. Changes to This Policy</h2>\n<p>We may update this Privacy Policy when our app, services, legal requirements or data practices change. The updated version will be published at this URL with a revised effective date.</p>\n<h2>15. Contact Us</h2>\n<p><strong>MoneyLedgr</strong><br>\nPrivacy contact: <a href=\"mailto:support.nvstechnologies@gmail.com\"><strong>support.nvstechnologies@gmail.com</strong></a></p>\n<h2>16. Disclaimer</h2>\n<p>Information entered into MoneyLedgr is provided by you for personal tracking and management. MoneyLedgr does not provide financial, investment, tax, legal, lending or other professional advice.</p>\n<p class=\"policy-copy\">&copy; 2026 MoneyLedgr. All rights reserved.</p>";

  const dlg = document.createElement('dialog');
  dlg.className = 'policy-dialog';
  dlg.setAttribute('aria-labelledby', 'policy-title');
  dlg.innerHTML =
    '<div class="pd-head">' +
      '<div><h2 id="policy-title">MoneyLedgr Privacy Policy</h2>' +
      '<p><strong>Effective date:</strong> August 14, 2026</p></div>' +
      '<button type="button" class="pd-close" aria-label="Close privacy policy">&times;</button>' +
    '</div>' +
    '<div class="pd-body policy">' + BODY + '</div>';
  document.body.appendChild(dlg);

  const body = dlg.querySelector('.pd-body');

  function open() {
    if (dlg.open) return;
    body.scrollTop = 0;
    dlg.showModal();
    document.documentElement.classList.add('modal-open');
  }

  dlg.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');
    if (location.hash === '#privacy') history.replaceState(null, '', location.pathname + location.search);
  });
  dlg.querySelector('.pd-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });  // click outside

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-open-policy]');
    if (!link) return;
    e.preventDefault();
    open();
  });

  if (location.hash === '#privacy') open();
  window.addEventListener('hashchange', () => { if (location.hash === '#privacy') open(); });
})();
