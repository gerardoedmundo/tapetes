import { slogans, iconographyData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {

    if (window.lucide) {
        window.lucide.createIcons();
    }

    initNavigation();
    initRotatingSlogan();
    initCalculadora();
    initGallery();
    initQuoteForm();
});


function initNavigation() {
    const header = document.getElementById('main-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');


    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-xl', 'py-1', 'bg-crema');
        } else {
            header.classList.remove('shadow-xl', 'py-1');
        }
    });


    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });


    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}


function initRotatingSlogan() {
    const sloganEl = document.getElementById('rotating-slogan');
    if (!sloganEl) return;
    
    let index = 0;
    setInterval(() => {
        sloganEl.style.opacity = '0';
        sloganEl.style.transform = 'translateY(10px)';
        setTimeout(() => {
            index = (index + 1) % slogans.length;
            sloganEl.textContent = `"${slogans[index]}"`;
            sloganEl.style.opacity = '1';
            sloganEl.style.transform = 'translateY(0)';
        }, 500);
    }, 6000);
}


function initCalculadora() {
    const inputWidth = document.getElementById('input-width');
    const inputLength = document.getElementById('input-length');
    
    const valWidth = document.getElementById('width-val');
    const valLength = document.getElementById('length-val');
    
    const calcArea = document.getElementById('calc-area');
    const calcKnots = document.getElementById('calc-knots');
    const calcDays = document.getElementById('calc-days');
    
    const telarProgress = document.getElementById('telar-progress');
    const telarPercentage = document.getElementById('telar-percentage');
    const syncBtn = document.getElementById('sync-dimensions');

    function updateCalculations() {
        const width = parseFloat(inputWidth.value);
        const length = parseFloat(inputLength.value);
        
        valWidth.textContent = `${width.toFixed(1)} m`;
        valLength.textContent = `${length.toFixed(1)} m`;
        

        const area = width * length;
        calcArea.textContent = area.toFixed(2);
        

        const totalKnots = Math.round(area * 140000);
        calcKnots.textContent = totalKnots.toLocaleString();
        

        const days = Math.round(area * 42);
        calcDays.textContent = days;
        


        const dailyProgress = Math.min(100, (100 / days)).toFixed(1);
        telarPercentage.textContent = `${dailyProgress}% de avance diario`;
        

        const barWidth = Math.min(100, Math.max(5, (100 - (days / 10))));
        telarProgress.style.width = `${barWidth}%`;
    }

    inputWidth.addEventListener('input', updateCalculations);
    inputLength.addEventListener('input', updateCalculations);
    

    updateCalculations();


    syncBtn.addEventListener('click', () => {
        const customOption = document.querySelector('input[name="size-preset"][value="Medidas personalizadas"]');
        if (customOption) {
            customOption.checked = true;
            
            document.querySelectorAll('input[name="size-preset"]').forEach(radio => {
                const parent = radio.closest('label');
                if (parent) parent.classList.remove('active-preset');
            });
            const customLabel = document.getElementById('lbl-size-custom');
            if (customLabel) customLabel.classList.add('active-preset');
            
            const customValLabel = document.getElementById('lbl-custom-val');
            customValLabel.textContent = `${inputWidth.value}m x ${inputLength.value}m`;
            customValLabel.classList.remove('text-indigo/50');
            customValLabel.classList.add('text-terracota', 'font-bold');
            

            document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth' });
        }
    });
}


function initGallery() {
    const container = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('#iconography-filters button');
    
    if (!container) return;

    function renderGallery(filter = 'todos') {
        container.innerHTML = '';
        
        const filteredData = filter === 'todos' 
            ? iconographyData 
            : iconographyData.filter(item => item.category === filter);

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-card bg-[#FAF6F0] p-6 border-2 border-indigo/10 flex flex-col justify-between hover:border-terracota hover:shadow-2xl transition-all duration-500 relative group';
            card.innerHTML = `
                <div>
                    <!-- Contenedor Visual SVG con Efecto Hover Premium -->
                    <div class="gallery-image-container w-full h-52 bg-[#F4EFE6] flex items-center justify-center p-8 mb-6 relative overflow-hidden border border-indigo/5">
                        <div class="absolute inset-0 opacity-[0.03] border border-indigo flex items-center justify-center"></div>
                        <div class="w-32 h-32 transform transition-transform duration-700 ease-out">
                            ${item.svg}
                        </div>
                    </div>
                    
                    <span class="text-[10px] tracking-[0.25em] uppercase text-terracota font-extrabold block mb-1">
                        ${item.subtitle}
                    </span>
                    <h3 class="font-serif text-2xl text-indigo mb-3 font-bold">${item.title}</h3>
                    <p class="text-xs text-indigo/90 leading-relaxed font-normal mb-4">${item.description}</p>
                </div>

                <div class="pt-4 border-t-2 border-indigo/10 mt-4 transition-colors duration-300 group-hover:border-terracota/30">
                    <span class="text-[10px] uppercase tracking-widest text-oro font-extrabold block">Significado Ancestral:</span>
                    <p class="text-xs italic text-indigo font-medium mt-1.5 bg-oro/5 p-2 border-l-2 border-oro">"${item.meaning}"</p>
                </div>
            `;
            container.appendChild(card);
        });
    }


    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active', 'border-indigo', 'text-indigo'));
            filterButtons.forEach(b => b.classList.add('text-indigo/80'));
            
            e.currentTarget.classList.add('active', 'border-indigo', 'text-indigo');
            e.currentTarget.classList.remove('text-indigo/80');
            
            const category = e.currentTarget.getAttribute('data-category');
            renderGallery(category);
        });
    });


    renderGallery();
}


function initQuoteForm() {
    const form = document.getElementById('quote-form');
    const modal = document.getElementById('certificate-modal');
    const closeModalElements = [document.getElementById('close-modal'), document.getElementById('close-modal-btn')];
    
    const sizeRadios = document.querySelectorAll('input[name="size-preset"]');


    sizeRadios.forEach(radio => {
        const parent = radio.closest('label');
        if (radio.checked && parent) {
            parent.classList.add('active-preset');
        }
        radio.addEventListener('change', () => {
            sizeRadios.forEach(r => {
                const p = r.closest('label');
                if (p) p.classList.remove('active-preset');
            });
            if (radio.checked && parent) {
                parent.classList.add('active-preset');
            }
        });
    });

    const certOwner = document.getElementById('cert-owner');
    const certStyle = document.getElementById('cert-style');
    const certDims = document.getElementById('cert-dims');
    const certKnots = document.getElementById('cert-knots');
    const certTime = document.getElementById('cert-time');
    const downloadBtn = document.getElementById('download-cert-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const selectedStyle = document.getElementById('style-select').value;
        
        let selectedSize = '';
        const sizePresetRadio = document.querySelector('input[name="size-preset"]:checked');
        if (sizePresetRadio) {
            selectedSize = sizePresetRadio.value;
        }

        if (selectedSize === 'Medidas personalizadas') {
            const width = document.getElementById('input-width').value;
            const length = document.getElementById('input-length').value;
            selectedSize = `Medidas personalizadas (${width}m x ${length}m)`;
        }

        const areaVal = parseFloat(document.getElementById('calc-area').textContent);
        const knotsVal = document.getElementById('calc-knots').textContent;
        const daysVal = document.getElementById('calc-days').textContent;

        certOwner.textContent = fullName;
        certStyle.textContent = selectedStyle;
        certDims.textContent = selectedSize;
        certKnots.textContent = `${knotsVal} nudos individuales`;
        certTime.textContent = `~${daysVal} Días de Labor Familiar`;

        modal.classList.remove('pointer-events-none', 'opacity-0');
        modal.classList.add('opacity-100');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    });


    closeModalElements.forEach(el => {
        if (el) {
            el.addEventListener('click', () => {
                modal.classList.add('pointer-events-none', 'opacity-0');
                modal.classList.remove('opacity-100');
                modal.firstElementChild.classList.add('scale-95');
                modal.firstElementChild.classList.remove('scale-100');
            });
        }
    });


    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert("Su Certificado Digital de Intención de Origen ha sido registrado en nuestra base de datos cooperativa de Temoaya. Un representante artesano se pondrá en contacto por WhatsApp o Correo para concretar los detalles de su pieza única.");
            modal.classList.add('pointer-events-none', 'opacity-0');
            modal.classList.remove('opacity-100');
        });
    }
}
