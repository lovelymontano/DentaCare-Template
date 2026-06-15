// ── Navbar scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 70), { passive: true });

// ── Mobile drawer ──
function toggleDrawer() { document.getElementById('drawer').classList.toggle('open') }

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target) } });
}, { threshold: .1 });
revealEls.forEach(el => revObs.observe(el));

// ── Service tabs ──
document.querySelectorAll('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// ── Testimonial slider ──
(function () {
    const track = document.getElementById('testiTrack');
    const dotsContainer = document.getElementById('sDots');
    const cards = track.querySelectorAll('.testi-card');
    let perView = window.innerWidth < 860 ? 1 : 3;
    let cur = 0;
    const maxSlide = () => Math.ceil(cards.length / perView) - 1;

    // build dots
    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxSlide(); i++) {
            const d = document.createElement('div');
            d.className = 's-dot' + (i === cur ? ' active' : '');
            d.onclick = () => go(i);
            dotsContainer.appendChild(d);
        }
    }

    function go(n) {
        cur = Math.max(0, Math.min(n, maxSlide()));
        const cardW = cards[0].offsetWidth + 28;
        track.style.transform = `translateX(-${cur * perView * cardW}px)`;
        document.querySelectorAll('.s-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    document.getElementById('sPrev').onclick = () => go(cur - 1);
    document.getElementById('sNext').onclick = () => go(cur + 1);

    window.addEventListener('resize', () => {
        perView = window.innerWidth < 860 ? 1 : 3;
        cur = 0;
        buildDots();
        go(0);
    });

    buildDots(); go(0);
})();

// ── Count-up animation ──
function countUp(el, end, dur = 1800) {
    const start = performance.now();
    (function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.firstChild.textContent = Math.floor(ease * end).toLocaleString();
        if (p < 1) requestAnimationFrame(frame);
    })(start);
}
const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target;
            const n = parseInt(el.dataset.count);
            if (n) countUp(el, n);
            statObs.unobserve(el);
        }
    });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

// ── Contact form ──
const form = document.getElementById('bookingForm');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    try {
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        if (data.success) {
            form.reset();
            document.getElementById('success-msg').style.display = 'block';
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        } else { throw new Error() }
    } catch {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error — Try Again';
        setTimeout(() => { btn.disabled = false; btn.innerHTML = '<i class="fa-regular fa-calendar-check"></i> Confirm Appointment' }, 3000);
    }
});