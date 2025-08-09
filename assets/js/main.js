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

  // Gallery using all images from Images folder (static list)
  const allImages = [
    {src:'https://i.pinimg.com/736x/d5/4f/6d/d54f6d96f0e814060c7eef7b78c1fcc8.jpg', alt:'Event highlight'},
    {src:'https://i.pinimg.com/736x/d9/b2/30/d9b230f00d860cbfc58b3e7ecb5157fd.jpg', alt:'Meal distribution'},
    {src:'https://i.pinimg.com/1200x/d4/be/b5/d4beb506ce1c4aa7276c9a44de35aca1.jpg', alt:'Tree plantation'},
    {src:'https://i.pinimg.com/736x/95/2b/1e/952b1e234ee23caa35e49a5822134888.jpg', alt:'Plantation team'},
    {src:'https://i.pinimg.com/1200x/ca/12/4c/ca124ccfed0d2842a5ce243cbcfae45f.jpg', alt:'Watering saplings'},
    {src:'https://i.pinimg.com/1200x/7f/fb/0f/7ffb0f48bad281874abb791d75f5be74.jpg', alt:'Volunteers group'},
    {src:'https://i.pinimg.com/1200x/d0/bf/fd/d0bffdc8fffce2a055a397babbba6252.jpg', alt:'Serving meals'},
    {src:'https://i.pinimg.com/736x/3c/98/46/3c9846e14be50eec0e920bd937e05c92.jpg', alt:'Raskbind Foundation'},
    {src:'https://i.pinimg.com/1200x/3a/85/08/3a8508b37b6eddbfcab9cc0dfb18cd3a.jpg', alt:'Raskbind Foundation logo'},
    {src:'https://i.pinimg.com/1200x/b6/18/36/b618363312dc543f1363745b6022e1fd.jpg', alt:'Community'},
    {src:'https://i.pinimg.com/1200x/26/dd/0f/26dd0fde01abadefe730930ca4d59514.jpg', alt:'Community'},
    {src:'https://i.pinimg.com/736x/d7/41/a1/d741a19b9d92209018736007be6257f8.jpg', alt:'Community'},
    {src:'https://i.pinimg.com/1200x/00/00/86/0000869d26411dcdae1db09b603c4c53.jpg', alt:'Community'},
    {src:'https://i.pinimg.com/1200x/e5/eb/cc/e5ebcc7f8896ca7e936bb1a66a1b97e7.jpg', alt:'Community'},
    {src:'https://i.pinimg.com/1200x/f3/66/66/f36666813f5acc32834d66f09c086a17.jpg', alt:'Background'},
    {src:'https://i.pinimg.com/736x/ab/d7/b4/abd7b4c965ece5e17b7c631a2fdc95a6.jpg', alt:'Raskbind Foundation'},
    {src:'https://i.pinimg.com/1200x/34/9a/a5/349aa52565409579e2bfd961a0680771.jpg', alt:'Raskbind Foundation'}
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