(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Scroll animations
  const animated = $$('.animate-in');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('appear');
        io.unobserve(e.target);
      }
    })
  },{ rootMargin: '0px 0px -10% 0px' });
  animated.forEach(el=>io.observe(el));

  // Counters
  function animateCounter(el){
    const target = Number(el.getAttribute('data-target')) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start)/duration);
      const val = Math.floor(p * target);
      el.textContent = val.toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  $$('.impact-value, .stat-value').forEach(el=>{
    const obs = new IntersectionObserver((entries)=>{
      if(entries.some(e=>e.isIntersecting)){
        animateCounter(el);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  // Gallery using all images from images folder (static list)
  const allImages = [
    {src:'./images/Gallery/plantation-2.jpg', alt:'Meal distribution'},
    {src:'./images/Gallery/plantation-3.jpg', alt:'Tree plantation'},
    {src:'./images/Gallery/plantation-4.jpg', alt:'Plantation team'},
    {src:'./images/Gallery/plantation-5.jpg', alt:'Watering saplings'},
    {src:'./images/Gallery/plantation-6.jpg', alt:'Volunteers group'},
    {src:'./images/Gallery/plantation-7.jpg', alt:'Serving meals'},
    {src:'./images/Gallery/plantation-8.jpg', alt:'Raskbind Foundation'},
    {src:'./images/Gallery/plantation-9.jpg', alt:'Raskbind Foundation logo'},
    {src:'./images/Gallery/plantation-10.jpg', alt:'Community'},
    {src:'./images/Gallery/plantation-11.jpg', alt:'Community'},
    {src:'./images/Gallery/plantation-12.jpg', alt:'Community'},
    {src:'./images/Gallery/plantation-13.jpg', alt:'Community'},
    {src:'./images/Gallery/plantation-14.jpg', alt:'Community'},
    {src:'./images/Gallery/plantation-15.jpg', alt:'Background'},
    {src:'./images/Gallery/plantation-16.jpg', alt:'Raskbind Foundation'},
    {src:'./images/Gallery/plantation-17.jpg', alt:'Raskbind Foundation'}
  ];

  function populateGallery(gridId){
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const frag = document.createDocumentFragment();
    allImages.forEach((img,i)=>{
      const item = document.createElement('figure');
      item.className = 'gallery-item';
      const image = document.createElement('img');
      image.loading = 'lazy';
      image.src = img.src;
      image.alt = img.alt + ' ' + (i+1);
      item.appendChild(image);
      frag.appendChild(item);
    });
    grid.appendChild(frag);
  }

  populateGallery('galleryGrid');
  populateGallery('plantationGallery');
  populateGallery('mealsGallery');

  // Donation form logic
  const donationForm = $('#donationForm');
  if (donationForm) {
    const amountButtons = $$('.amount', donationForm);
    const customAmount = $('#customAmount', donationForm);
    let selectedAmount = 500;

    amountButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        amountButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        selectedAmount = Number(btn.dataset.amount);
        if (customAmount) customAmount.value = '';
      });
    });
    // Default select ₹500
    const defaultBtn = amountButtons.find(b=>b.dataset.amount === '500');
    if (defaultBtn) defaultBtn.classList.add('active');

    customAmount?.addEventListener('input', ()=>{
      const v = Number(customAmount.value || '0');
      if (v > 0) {
        selectedAmount = v;
        amountButtons.forEach(b=>b.classList.remove('active'));
      }
    });

    donationForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const cause = $('#cause', donationForm).value;
      const name = $('#name', donationForm)?.value?.trim() || '';
      const email = $('#email', donationForm)?.value?.trim() || '';
      const data = { cause, amount: selectedAmount, name, email };
      localStorage.setItem('rf_donation', JSON.stringify(data));
      window.location.href = 'checkout.html';
    });
  }

  // Checkout summary
  if (location.pathname.endsWith('checkout.html')){
    try{
      const data = JSON.parse(localStorage.getItem('rf_donation')||'{}');
      if (data && data.amount){
        $('#summaryCause').textContent = data.cause || '—';
        $('#summaryAmount').textContent = '₹' + Number(data.amount).toLocaleString('en-IN');
        $('#summaryName').textContent = data.name || '—';
        $('#summaryEmail').textContent = data.email || '—';
      }
    }catch(e){/* noop */}
  }
})(); 