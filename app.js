const y=document.querySelector("#year");
for(let i=2000;i<=2026;i++){const o=document.createElement("option");o.value=i;o.textContent=i;y.appendChild(o)}

const norm=s=>String(s??"").trim().replace(/\s+/g," ").toUpperCase();
function parseCSV(t){
  let rows=[],row=[],cell="",q=false;
  for(let i=0;i<t.length;i++){
    const c=t[i],n=t[i+1];
    if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}
    if(c==='"'){q=!q;continue}
    if(c===','&&!q){row.push(cell);cell="";continue}
    if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell="";if(row.some(v=>v.trim()))rows.push(row);row=[];continue}
    cell+=c;
  }
  if(cell||row.length){row.push(cell);if(row.some(v=>v.trim()))rows.push(row)}
  if(!rows.length)return[];
  const h=rows.shift().map(x=>x.trim().replace(/^\uFEFF/,''));
  return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]??"").trim()])));
}
const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function render(p){
  const agama=norm(p.agama||p.Agama||"");
  const isIslam=agama==="ISLAM";
  const isKristen=agama==="KRISTEN"||agama==="KATOLIK";
  // Jika agama belum diisi, tampilkan kedua kelompok agar data lama tetap terbaca.
  const religion=isIslam?"islam":isKristen?"kristen":"unknown";
  const val=(...keys)=>{
    for(const k of keys){if(Object.prototype.hasOwnProperty.call(p,k)&&String(p[k]??"").trim()!=="")return p[k]}
    return "—";
  };
  const th=(text,attrs="")=>`<th ${attrs}>${esc(text)}</th>`;
  const group=(title,n)=>th(title,`colspan="${n}"`);
  const mid=(title,n=1)=>th(title,`colspan="${n}"`);
  const leaf=t=>th(t);
  const td=(...keys)=>`<td>${esc(val(...keys))}</td>`;
  const sub=(key)=>`<th rowspan="3">Sub Total</th><td class="subtotal">${esc(val(key))}</td>`;

  let r1='',r2='',r3='',body='';
  for(const k of ["Nama","Kelas","Pilihan","Skolastik"]){r1+=th(k,'rowspan="3"');body+=td(k)}

  // Persis pola header Excel untuk satu kelompok agama yang relevan.
  if(religion!=="kristen"){
    r1+=group("Keagamaan Islam",8);
    r2+=mid("Wudhu",1)+mid("Sholat",1)+mid("Akidah",3)+mid("Baca Al-Qur'an",3);
    r3+=["Rukun Islam","Rukun Iman","Toleransi Beragama","Tajwid","Kefasihan","Kelancaran"].map(leaf).join("");
    body+=td("Wudhu")+td("Sholat")+td("Akidah Akhlak","Akidah")+td("Hadist & doa sehari-hari","Hadist & doa Sehari-hari")+td("Tajwid")+td("Kefasihan")+td("Kelancaran");
    body+=`<td class="subtotal">${esc(val("Sub Total Keagamaan Islam"))}</td>`;
  }else{
    r1+=group("Keagamaan Kristen & Katolik",8);
    r2+=mid("Beribadah",3)+mid("Pemahaman Alkitab",3)+mid("Perilaku Sehari-Hari",2);
    r3+=["Ibadah ke Gereja","Pelayanan di Gereja","Lagu Pujian","Doa Bapa Kami","Sepuluh Perintah Allah","Berdoa dan Membaca Al Kitab","Kebiasaan Baik","Menghormati Orang Tua"].map(leaf).join("");
    body+=td("Ibadah ke Gereja")+td("Pelayanan di Gereja")+td("Lagu Pujian")+td("Berdoa & Membaca Alkitab","Berdoa dan Membaca Al Kitab")+td("Doa Bapa Kami")+td("Sepuluh Perintah Allah")+td("Kebiasaan Baik")+td("Menghormati Orang Tua");
    body+=`<td class="subtotal">${esc(val("Sub Total Keagamaan Kristen & Katolik"))}</td>`;
  }

  // Public Speaking — 9 indikator, header 3 tingkat seperti Excel.
  r1+=group("Public Speaking",9);
  r2+=mid("Indikator",9);
  const pub=["Intonasi","Artikulasi","Volume Suara","Pemilihan Kata","Struktur Kalimat","Gestur","Ekspresi","Kesesuaian Isi","Kelancaran Public Speaking"];
  r3+=pub.map(leaf).join(""); body+=pub.map(td).join("");
  body+=`<td class="subtotal">${esc(val("Sub Total Public Speaking"))}</td>`;

  // Wawancara — 9 indikator, dengan subjudul Indikator yang jelas.
  r1+=group("Wawancara",9);
  r2+=mid("Indikator",9);
  const waw=["Sikap & Perilaku","Komunikasi","Karakter","Hubungan","Dukungan","Manajemen Waktu","Konsistensi","MPK-OSIS","Komitmen"];
  r3+=waw.map(leaf).join("");
  body+=waw.map(k=>td(k,k==="MPK-OSIS"?"MPK - OSIS":k)).join("");
  body+=`<td class="subtotal">${esc(val("Sub Total Wawancara"))}</td>`;

  r1+=th("Jumlah Nilai",'rowspan="3"');
  body+=`<td class="final">${esc(val("Jumlah Nilai"))}</td>`;

  document.querySelector("#scoreTable").innerHTML=`<thead><tr class="group-row">${r1}</tr><tr class="sub-row">${r2}</tr><tr class="leaf-row">${r3}</tr></thead><tbody><tr>${body}</tr></tbody>`;
}

document.querySelector("#form").addEventListener("submit",async e=>{e.preventDefault();let m=document.querySelector("#msg");m.textContent="";try{let r=await fetch("data/peserta.csv?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;let d=parseCSV(await r.text()),p=d.find(x=>norm(x.Nama)==norm(document.querySelector("#name").value)&&norm(x.Kelas)==norm(document.querySelector("#class").value)&&x.tahun_lahir==y.value&&norm(x.Pilihan)==norm(document.querySelector("#division").value));if(!p){m.textContent="Data tidak ditemukan. Periksa nama, kelas, tahun lahir, dan pilihan.";return}let s=(p.status||"red").toLowerCase(),card=document.querySelector("#resultCard");card.className="result "+s;document.querySelector("#status").textContent=s=="blue"?"LOLOS":s=="yellow"?"LOLOS BERSYARAT":"TIDAK LOLOS";document.querySelector("#title").textContent=p.judul||"Hasil Seleksi";document.querySelector("#rname").textContent=p.Nama||"—";document.querySelector("#rclass").textContent=p.Kelas||"—";document.querySelector("#rdivision").textContent=p.Pilihan||"—";document.querySelector("#desc").textContent=p.keterangan||"Silakan mengikuti informasi selanjutnya dari panitia.";document.querySelector("#icon").textContent=s=="blue"?"✓":s=="yellow"?"!":"×";render(p);document.querySelector("#result").classList.remove("hidden");document.querySelector("#result").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){m.textContent="Database belum tersedia. Pastikan data/peserta.csv sudah di-upload ke GitHub."}});
document.querySelector("#reset").onclick=()=>{document.querySelector("#form").reset();document.querySelector("#result").classList.add("hidden");document.querySelector("#cek").scrollIntoView({behavior:"smooth"})};
