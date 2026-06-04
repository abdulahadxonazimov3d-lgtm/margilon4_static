const ADMIN_LOGIN='admin', ADMIN_PASS='Admin@1963';
const defaultImg='assets/logo.png';
function normalizeState(raw){
  if(!raw) return null;
  for(const key of ['about','leadership','programs','news','partners','graduates','library']){
    raw[key]=(raw[key]||[]).map(x=>Array.isArray(x)?x:[x.title||'',x.text||'',x.extra||'',x.image||'']);
  }
  raw.gallery=(raw.gallery||[]).map(x=>Array.isArray(x)?x:[x,'','', '']);
  return raw;
}
let state=normalizeState(JSON.parse(localStorage.getItem('m4_state')||'null'))||{
 about:[['Sifatli ta’lim','Malakali o‘qituvchilar, zamonaviy dasturlar va amaliy mashg‘ulotlar.','',''],['Amaliyotga yo‘naltirilgan ta’lim','Nazariya ishlab chiqarish amaliyoti bilan uyg‘unlashtiriladi.','',''],['Xalqaro yondashuv','Hamkorlik, tillar va zamonaviy kasb standartlari.','','']],
 leadership:[['Direktor','Texnikum faoliyatini boshqarish va rivojlantirish','',''],['O‘quv ishlari bo‘yicha direktor o‘rinbosari','Ta’lim jarayonlari va sifat nazorati','',''],['Ishlab chiqarish ta’limi bo‘yicha direktor o‘rinbosari','Amaliyot va ish beruvchilar bilan hamkorlik','',''],['Yoshlar bilan ishlash bo‘yicha direktor o‘rinbosari','Yoshlar siyosati, ma’naviy-ma’rifiy ishlar va o‘quvchilar bilan ishlash','','']],
 programs:[['Arxitektura','11-sinf negizida, zamonaviy loyiha va qurilish chizmalari.','',''],['Geodeziya va kartografiya','O‘lchash, xaritalash va raqamli texnologiyalar.','',''],['Quyosh panellariga texnik xizmat ko‘rsatish','9-sinf negizida, kunduzgi, 30 grant.','',''],['Elektromontyor','Elektr tizimlari, xavfsizlik va amaliy montaj.','',''],['IT dasturchi','Veb, mobil va dasturlash asoslari.','',''],['Avtomobillar servisi','Kunduzgi va dual ta’lim shakli.','','']],
 news:[['Qabul 2026 boshlandi','Marg‘ilon shahar 4-son texnikumida yangi o‘quv yili uchun qabul jarayonlari boshlandi.','',''],['Yangi hamkorlik uchrashuvi','Ish beruvchilar bilan amaliyot va bandlik bo‘yicha uchrashuv o‘tkazildi.','',''],['Ochiq darslar haftaligi','Fanlar kesimida zamonaviy metodikalar asosida ochiq darslar tashkil etildi.','','']],
 partners:[['Xorijiy ta’lim muassasalari','Kasbiy ta’lim sifati va tajriba almashish bo‘yicha hamkorlik.','',''],['Ish beruvchilar','Bitiruvchilar bandligini ta’minlash va amaliyot bazalarini kengaytirish.','',''],['Ausbildung yo‘nalishi','Chet elda o‘qish va ishlash imkoniyatlariga tayyorlov.','','']],
 graduates:[['Bitiruvchilar klubi','Muvaffaqiyatli bitiruvchilar bilan uchrashuvlar.','',''],['Bandlik monitoringi','Bitiruvchilar ishga joylashuvi tahlil qilinadi.','',''],['Karyera markazi','CV, suhbat va kasbiy rivojlanish bo‘yicha yordam.','','']],
 library:[['Darsliklar','Fanlar kesimida elektron o‘quv adabiyotlari.','',''],['Me’yoriy hujjatlar','Ta’lim jarayoniga oid asosiy hujjatlar.','',''],['Metodik qo‘llanmalar','O‘qituvchilar va o‘quvchilar uchun qo‘llanmalar.','','']],
 gallery:[['Texnikum binosi','','', ''],['Amaliy mashg‘ulot','','', ''],['Laboratoriya','','', ''],['Tadbir lavhasi','','', '']],
 socialLinks:{telegram:'#',instagram:'#',youtube:'#',facebook:'#'}
};
if(!state.socialLinks) state.socialLinks={telegram:'#',instagram:'#',youtube:'#',facebook:'#'};
function save(){localStorage.setItem('m4_state',JSON.stringify(state))}
let currentUser=JSON.parse(localStorage.getItem('m4_user')||'null');
let isAdmin=localStorage.getItem('m4_admin')==='1';
function esc(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function cardHtml(section,item,i,type='card'){
 const img=item[3]||'';
 const imageHtml=img?`<img class="itemImage" src="${img}" alt="${esc(item[0])}">`:`<div class="itemImage placeholder">${type==='person'?'👤':'🏫'}</div>`;
 return `<div class="${type}">${imageHtml}<div class="itemBody"><h3>${esc(item[0])}</h3><p>${esc(item[1]||'')}</p>${item[2]?`<small>${esc(item[2])}</small>`:''}<div class="adminControls"><button class="edit" onclick="openEdit('${section}',${i})">Tahrirlash</button><button class="del" onclick="deleteItem('${section}',${i})">O‘chirish</button></div></div></div>`
}
function renderSection(section,el,type='card'){
 const box=document.getElementById(el);
 box.innerHTML=`<div class="addBar"><button class="gold" onclick="openEdit('${section}',-1)">+ Qo‘shish</button></div>`+state[section].map((x,i)=>cardHtml(section,x,i,type)).join('')
}

function socialIcon(name){
 const icons={
  telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.8 4.3 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.5 1.1 12c-1.1-.3-1.1-1.1.2-1.6L20.4 3c.9-.3 1.7.2 1.4 1.3z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.3-2.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
  youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.3a3 3 0 0 0-2.1-2.1C19 4.7 12 4.7 12 4.7s-7 0-8.9.5A3 3 0 0 0 1 7.3 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.7a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.7.5-4.7s0-2.8-.5-4.7zM9.8 15.2V8.8l6 3.2-6 3.2z"/></svg>',
  facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>'
 };
 return icons[name]||'';
}
function renderSocials(){
 const links=state.socialLinks||{};
 const names=[['telegram','Telegram'],['instagram','Instagram'],['youtube','YouTube'],['facebook','Facebook']];
 const html=names.map(([k,label])=>`<a class="social-${k}" href="${esc(links[k]||'#')}" target="_blank" rel="noopener" aria-label="${label}"><span class="brandIcon">${socialIcon(k)}</span><span>${label}</span></a>`).join('');
 const adminBtn=`<button class="socialEditBtn" onclick="openSocialEdit()">Ijtimoiy tarmoq linklarini tahrirlash</button>`;
 const box=document.getElementById('socialsBox'); if(box) box.innerHTML=html+adminBtn;
}

function render(){
 document.body.classList.toggle('admin',isAdmin);
 renderSocials();
 renderSection('about','aboutList');renderSection('leadership','leadershipList','person');renderSection('programs','programList');renderSection('news','newsList');renderSection('partners','partnersList');renderSection('graduates','graduatesList');renderSection('library','libraryList');
 document.getElementById('galleryList').innerHTML=state.gallery.map((x,i)=>`<div class="galleryItem">${x[3]?`<img src="${x[3]}" alt="${esc(x[0])}">`:''}<span>${esc(x[0])}</span><div class="adminControls"><button class="edit" onclick="openEdit('gallery',${i})">Tahrirlash</button><button class="del" onclick="deleteItem('gallery',${i})">O‘chirish</button></div></div>`).join('')+`<div class="addBar"><button class="gold" onclick="openEdit('gallery',-1)">+ Qo‘shish</button></div>`;
 document.getElementById('appProgram').innerHTML=state.programs.map(p=>`<option>${esc(p[0])}</option>`).join('');
 document.getElementById('loginOpen').textContent=isAdmin?'Admin chiqish':currentUser?'Chiqish':'Kirish';
}
function openModal(id){document.getElementById(id).classList.add('show')}function closeAll(){document.querySelectorAll('.modal').forEach(m=>m.classList.remove('show'))}document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeAll);
document.getElementById('menuBtn').onclick=()=>document.getElementById('nav').classList.toggle('show');
let authMode='login';document.getElementById('registerOpen').onclick=()=>{authMode='register';document.getElementById('authTitle').textContent='Ro‘yxatdan o‘tish';document.getElementById('authHint').innerHTML='Ro‘yxatdan o‘tgandan keyin ariza yuborish ochiladi.';openModal('authModal')};
document.getElementById('loginOpen').onclick=()=>{if(isAdmin){localStorage.removeItem('m4_admin');isAdmin=false;render();return} if(currentUser){localStorage.removeItem('m4_user');currentUser=null;render();return} authMode='login';document.getElementById('authTitle').textContent='Kirish';document.getElementById('authHint').innerHTML='Oddiy foydalanuvchi yoki admin sifatida kiring.';openModal('authModal')};
document.getElementById('authSubmit').onclick=()=>{let name=authName.value.trim(),login=authLogin.value.trim(),pass=authPass.value.trim();if(login===ADMIN_LOGIN&&pass===ADMIN_PASS){isAdmin=true;localStorage.setItem('m4_admin','1');closeAll();render();alert('Admin panel yoqildi. Endi bo‘limlarda tahrirlash tugmalari chiqadi.');return} if(authMode==='register'){if(!name||!login||!pass)return alert('Barcha maydonlarni to‘ldiring');currentUser={name,login};localStorage.setItem('m4_user',JSON.stringify(currentUser));closeAll();render();alert('Ro‘yxatdan o‘tildi. Endi ariza yuborishingiz mumkin.');return} let saved=JSON.parse(localStorage.getItem('m4_user')||'null');if(saved&&saved.login===login){currentUser=saved;closeAll();render();alert('Kirish muvaffaqiyatli');}else alert('Avval ro‘yxatdan o‘ting yoki loginni tekshiring')};
function apply(){if(!currentUser&&!isAdmin){authMode='register';document.getElementById('authTitle').textContent='Avval ro‘yxatdan o‘ting';document.getElementById('authHint').innerHTML='Ariza yuborish faqat ro‘yxatdan o‘tgan foydalanuvchilar uchun ochiq.';openModal('authModal');return} appName.value=currentUser?.name||'';openModal('applyModal')}document.getElementById('applyHero').onclick=apply;document.getElementById('applyAdmission').onclick=apply;
document.getElementById('sendApply').onclick=async()=>{let data={name:appName.value,phone:appPhone.value,program:appProgram.value,note:appNote.value,user:currentUser};if(!data.name||!data.phone)return alert('F.I.Sh va telefonni kiriting');try{let res=await fetch('/api/send-telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(res.ok)alert('Ariza Telegram botga yuborildi');else throw new Error()}catch(e){alert('Ariza yuborilmadi. Vercel Environment Variables ichida TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni tekshiring. Demo nusxa brauzerda saqlandi.');localStorage.setItem('m4_last_application',JSON.stringify(data))}closeAll()};
let editTarget=null, pendingImage='';
function showPreview(src){editPreview.src=src||'';editPreview.style.display=src?'block':'none'}
function openEdit(section,i){editTarget={section,i};editTitle.textContent=i<0?'Qo‘shish':'Tahrirlash';let item=i>=0?state[section][i]:['','','',''];editA.value=item[0]||'';editB.value=item[1]||'';editC.value=item[2]||'';pendingImage=item[3]||'';editImage.value='';showPreview(pendingImage);openModal('editModal')}window.openEdit=openEdit;
editImage.onchange=()=>{const file=editImage.files[0];if(!file)return; if(file.size>2*1024*1024){alert('Rasm hajmi 2 MB dan oshmasin.');editImage.value='';return} const reader=new FileReader();reader.onload=e=>{pendingImage=e.target.result;showPreview(pendingImage)};reader.readAsDataURL(file)};
removeImage.onclick=()=>{pendingImage='';showPreview('');editImage.value=''};
function deleteItem(section,i){if(confirm('O‘chirasizmi?')){state[section].splice(i,1);save();render()}}window.deleteItem=deleteItem;
saveEdit.onclick=()=>{let {section,i}=editTarget;let val=[editA.value,editB.value,editC.value,pendingImage];if(i<0)state[section].push(val);else state[section][i]=val;save();closeAll();render()};

function openSocialEdit(){
 socTelegram.value=state.socialLinks?.telegram||'';
 socInstagram.value=state.socialLinks?.instagram||'';
 socYoutube.value=state.socialLinks?.youtube||'';
 socFacebook.value=state.socialLinks?.facebook||'';
 openModal('socialModal');
}
window.openSocialEdit=openSocialEdit;
saveSocials.onclick=()=>{
 state.socialLinks={telegram:socTelegram.value.trim()||'#',instagram:socInstagram.value.trim()||'#',youtube:socYoutube.value.trim()||'#',facebook:socFacebook.value.trim()||'#'};
 save();closeAll();render();
};

chatBtn.onclick=()=>chatBox.classList.toggle('show');chatSend.onclick=()=>{chatAnswer.innerHTML='Javob: Marg‘ilon shahar 4-son texnikumi haqida ma’lumot, qabul, yo‘nalishlar va ariza bo‘yicha yordam bera olaman. To‘liq AI uchun API ulanadi.'};
document.querySelectorAll('.langs button').forEach(b=>b.onclick=()=>alert(b.dataset.lang.toUpperCase()+' tarjima rejimi keyingi bosqichda matn bazasi orqali to‘liq ulanadi.'));
save();render();

// v3: fast static multilingual mode (no server, no npm)
const I18N={
 uz:{navHome:'Bosh sahifa',navAbout:'Texnikum haqida',navLeadership:'Rahbariyat',navPrograms:'Yo‘nalishlar',navAdmission:'Qabul 2026',navNews:'Yangiliklar',navGallery:'Galereya',navTour:'Virtual tur',navPartners:'Xalqaro hamkorlik',navGraduates:'Bitiruvchilar',navLibrary:'Elektron kutubxona',navContact:'Bog‘lanish',navMap:'Xarita',heroBadge:'Qabul 2026 ochiq',heroTitle:'Kasb egasi — kelajak bunyodkori!',heroText:'Zamonaviy ta\'lim, amaliy bilim va xalqaro standartlarga mos kasbiy tayyorgarlik.',applyBtn:'O‘qishga ariza yuborish',seePrograms:'Yo‘nalishlarni ko‘rish',slogan2:'Bilim ol, kasb egalla',aboutTitle:'Texnikum haqida',leadershipTitle:'Rahbariyat',programsTitle:'Yo‘nalishlar',newsTitle:'Yangiliklar',galleryTitle:'Galereya',tourTitle:'Virtual tur',partnersTitle:'Xalqaro hamkorlik',graduatesTitle:'Bitiruvchilar',libraryTitle:'Elektron kutubxona',applyTitle:'O‘qishga ariza yuborish',applyText:'Ariza yuborish uchun avval oddiy foydalanuvchi sifatida ro‘yxatdan o‘ting yoki akkauntingizga kiring.',applyShort:'Ariza yuborish',contactTitle:'Biz bilan bog‘lanish',address:'Manzil',phone:'Telefon',mapTitle:'Google xarita',loginBtn:'Kirish',registerBtn:'Ro‘yxatdan o‘tish',authSafe:'Ma’lumotlaringiz xavfsiz saqlanadi.'},
 ru:{navHome:'Главная',navAbout:'О техникуме',navLeadership:'Руководство',navPrograms:'Направления',navAdmission:'Приём 2026',navNews:'Новости',navGallery:'Галерея',navTour:'Виртуальный тур',navPartners:'Международное сотрудничество',navGraduates:'Выпускники',navLibrary:'Электронная библиотека',navContact:'Контакты',navMap:'Карта',heroBadge:'Приём 2026 открыт',heroTitle:'Профессия — основа будущего!',heroText:'Современное образование, практические знания и профессиональная подготовка по международным стандартам.',applyBtn:'Подать заявление',seePrograms:'Смотреть направления',slogan2:'Учись и осваивай профессию',aboutTitle:'О техникуме',leadershipTitle:'Руководство',programsTitle:'Направления',newsTitle:'Новости',galleryTitle:'Галерея',tourTitle:'Виртуальный тур',partnersTitle:'Международное сотрудничество',graduatesTitle:'Выпускники',libraryTitle:'Электронная библиотека',applyTitle:'Подать заявление',applyText:'Чтобы подать заявление, сначала зарегистрируйтесь или войдите в аккаунт.',applyShort:'Подать заявление',contactTitle:'Связаться с нами',address:'Адрес',phone:'Телефон',mapTitle:'Google карта',loginBtn:'Войти',registerBtn:'Регистрация',authSafe:'Ваши данные хранятся безопасно.'},
 en:{navHome:'Home',navAbout:'About',navLeadership:'Leadership',navPrograms:'Programs',navAdmission:'Admission 2026',navNews:'News',navGallery:'Gallery',navTour:'Virtual tour',navPartners:'International cooperation',navGraduates:'Graduates',navLibrary:'E-library',navContact:'Contact',navMap:'Map',heroBadge:'Admission 2026 is open',heroTitle:'A profession builds the future!',heroText:'Modern education, practical skills and professional training aligned with international standards.',applyBtn:'Apply for admission',seePrograms:'View programs',slogan2:'Learn and master a profession',aboutTitle:'About the technical school',leadershipTitle:'Leadership',programsTitle:'Programs',newsTitle:'News',galleryTitle:'Gallery',tourTitle:'Virtual tour',partnersTitle:'International cooperation',graduatesTitle:'Graduates',libraryTitle:'E-library',applyTitle:'Apply for admission',applyText:'To submit an application, please register or sign in first.',applyShort:'Apply',contactTitle:'Contact us',address:'Address',phone:'Phone',mapTitle:'Google map',loginBtn:'Sign in',registerBtn:'Register',authSafe:'Your information is kept secure.'},
 de:{navHome:'Startseite',navAbout:'Über uns',navLeadership:'Leitung',navPrograms:'Fachrichtungen',navAdmission:'Aufnahme 2026',navNews:'Nachrichten',navGallery:'Galerie',navTour:'Virtuelle Tour',navPartners:'Internationale Zusammenarbeit',navGraduates:'Absolventen',navLibrary:'E-Bibliothek',navContact:'Kontakt',navMap:'Karte',heroBadge:'Aufnahme 2026 geöffnet',heroTitle:'Ein Beruf gestaltet die Zukunft!',heroText:'Moderne Bildung, praktische Kenntnisse und berufliche Ausbildung nach internationalen Standards.',applyBtn:'Bewerbung senden',seePrograms:'Fachrichtungen ansehen',slogan2:'Lernen und Beruf ergreifen',aboutTitle:'Über das Technikum',leadershipTitle:'Leitung',programsTitle:'Fachrichtungen',newsTitle:'Nachrichten',galleryTitle:'Galerie',tourTitle:'Virtuelle Tour',partnersTitle:'Internationale Zusammenarbeit',graduatesTitle:'Absolventen',libraryTitle:'E-Bibliothek',applyTitle:'Bewerbung senden',applyText:'Um eine Bewerbung zu senden, registrieren Sie sich bitte zuerst oder melden Sie sich an.',applyShort:'Bewerben',contactTitle:'Kontaktieren Sie uns',address:'Adresse',phone:'Telefon',mapTitle:'Google-Karte',loginBtn:'Anmelden',registerBtn:'Registrieren',authSafe:'Ihre Daten werden sicher gespeichert.'}
};
function setLang(lang){
  const d=I18N[lang]||I18N.uz;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(d[k])el.textContent=d[k]});
  document.querySelectorAll('.langs button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  localStorage.setItem('m4_lang',lang);
}
document.querySelectorAll('.langs button').forEach(b=>{b.onclick=()=>setLang(b.dataset.lang)});
setLang(localStorage.getItem('m4_lang')||'uz');
