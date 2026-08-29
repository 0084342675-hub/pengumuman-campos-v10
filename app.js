const y=document.querySelector("#year");
for(let i=2000;i<=2026;i++){let o=document.createElement("option");o.value=i;o.textContent=i;y.appendChild(o)}
const C=["No", "Nama", "Kelas", "Jenis Kelamin", "Pilihan", "Skolastik", "Wudhu", "Sholat", "Akidah Akhlak", "Hadist & doa sehari-hari", "Tajwid", "Kefasihan", "Kelancaran", "Sub Total Keagamaan Islam", "Ibadah ke Gereja", "Pelayanan di Gereja", "Lagu Pujian", "Berdoa & Membaca Alkitab", "Doa Bapa Kami", "Sepuluh Perintah Allah", "Kebiasaan Baik", "Menghormati Orang Tua", "Sub Total Keagamaan Kristen & Katolik", "Intonasi", "Artikulasi", "Volume Suara", "Pemilihan Kata", "Struktur Kalimat", "Gestur", "Ekspresi", "Kesesuaian Isi", "Kelancaran Public Speaking", "Sub Total Public Speaking", "Sikap & Perilaku", "Komunikasi", "Karakter", "Hubungan", "Dukungan", "Manajemen Waktu", "Konsistensi", "MPK - OSIS", "Komitmen", "Sub Total Wawancara", "Jumlah Nilai", "Keterangan"];
const norm=s=>String(s??"").trim().replace(/\s+/g," ").toUpperCase();
function parseCSV(t){let rows=[],row=[],cell="",q=false;for(let i=0;i<t.length;i++){let c=t[i],n=t[i+1];if(c=='"'&&q&&n=='"'){cell+='"';i++;continue}if(c=='"'){q=!q;continue}if(c==","&&!q){row.push(cell);cell="";continue}if((c=="\n"||c=="\r")&&!q){if(c=="\r"&&n=="\n")i++;row.push(cell);cell="";if(row.some(v=>v.trim()))rows.push(row);row=[];continue}cell+=c}if(cell||row.length){row.push(cell);if(row.some(v=>v.trim()))rows.push(row)}if(!rows.length)return[];let h=rows.shift().map(x=>x.trim());return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]??"").trim()])))}
const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function render(p){
  // Tampilan mengikuti struktur Excel (55 kolom), tanpa menampilkan kolom agama.
  const agamaRaw=norm(p.Agama||p.agama||"");
  const showIslam=agamaRaw.includes("ISLAM");
  const showKristen=agamaRaw.includes("KRISTEN")||agamaRaw.includes("KATOLIK");

  // Jika agama kosong, tampilkan keduanya agar data tidak hilang secara keliru.
  const islamVisible=showIslam||(!showIslam&&!showKristen);
  const kristenVisible=showKristen||(!showIslam&&!showKristen);

  const val=(...keys)=>{
    for(const k of keys){
      if(Object.prototype.hasOwnProperty.call(p,k) && String(p[k]??"").trim()!=="") return p[k];
    }
    return "—";
  };
  const th=(text,attrs="")=>`<th ${attrs}>${esc(text)}</th>`;
  const td=(text,cls="")=>`<td${cls?` class="${cls}"`:""}>${esc(text)}</td>`;

  let r1="",r2="",r3="",body="";
  // Kolom tetap persis seperti Excel: Nama, Kelas, Pilihan, Skolastik.
  for(const [label,key] of [["Nama","Nama"],["Kelas","Kelas"],["Pilihan","Pilihan"],["Skolastik","Skolastik"]]){
    r1+=th(label,'rowspan="3"'); body+=td(val(key));
  }

  const group=(title,cols,subheads=[],leafheads=[])=>{
    r1+=th(title,`colspan="${cols}"`);
    if(subheads.length) r2+=subheads.join("");
    if(leafheads.length) r3+=leafheads.map(x=>th(x)).join("");
  };
  const subtotal=(label,key)=>{r1+=th(label,'rowspan="3"');body+=td(val(key));};

  if(islamVisible){
    group("Keagamaan Islam",8,[
      th("Wudhu",'rowspan="2"'),th("Sholat",'rowspan="2"'),
      th("Akidah",'colspan="3"'),th("Baca Al-Qur\\'an",'colspan="3"')
    ],["Rukun Islam","Rukun Iman","Toleransi Beragama","Tajwid","Kefasihan","Kelancaran"]);
    for(const k of ["Wudhu","Sholat","Rukun Islam","Rukun Iman","Toleransi Beragama","Tajwid","Kefasihan","Kelancaran"]) body+=td(val(k));
    subtotal("Sub Total","Sub Total Keagamaan Islam");
  }

  if(kristenVisible){
    group("Keagamaan Kristen & Katolik",8,[
      th("Beribadah",'colspan="3"'),th("Pemahaman Alkitab",'colspan="3"'),th("Perilaku Sehari-Hari",'colspan="2"')
    ],["Ibadah ke Gereja","Pelayanan di Gereja","Lagu Pujian","Doa Bapa Kami","Sepuluh Perintah Allah","Berdoa dan Membaca Al Kitab","Kebiasaan Baik","Menghormati Orang Tua"]);
    for(const k of ["Ibadah ke Gereja","Pelayanan di Gereja","Lagu Pujian","Doa Bapa Kami","Sepuluh Perintah Allah","Berdoa dan Membaca Al Kitab","Kebiasaan Baik","Menghormati Orang Tua"]) body+=td(val(k));
    subtotal("SubTotal","Sub Total Keagamaan Kristen & Katolik");
  }

  group("Public Speaking",9,[th("Public Speaking",'colspan="9"')],[]);
  // Excel menggabungkan header Public Speaking pada baris 1-2; baris 3 berisi 9 indikator.
  r2=r2.replace(th("Public Speaking",'colspan="9"'),"");
  // group() di atas hanya membantu urutan; ganti bagian public secara tepat di r1/r2/r3.
  r1=r1.replace(`<th colspan="9">Public Speaking</th>`,`<th colspan="9">Public Speaking</th>`);
  const publicKeys=["Intonasi","Artikulasi","Volume Suara","Pemilihan Kata","Struktur Kalimat","Gestur","Ekspresi","Kesesuaian Isi","Kelancaran Public Speaking"];
  r2+=th("",'colspan="9" rowspan="2"');
  r3+=publicKeys.map(x=>th(x)).join("");
  for(const k of publicKeys) body+=td(val(k));
  subtotal("Sub Total","Sub Total Public Speaking");

  if(islamVisible){
    group("Keagamaan Islam",7,[
      th("Wudhu",'rowspan="2"'),th("Sholat",'rowspan="2"'),th("Akidah",'colspan="2"'),th("Baca Al-Qur\\'an",'colspan="3"')
    ],["Akidah Akhlak","Hadist & doa Sehari-hari","Tajwid","Kefasihan","Kelancaran"]);
    for(const [k,...aliases] of [["Wudhu"],["Sholat"],["Akidah Akhlak"],["Hadist & doa Sehari-hari","Hadist & doa sehari-hari"],["Tajwid"],["Kefasihan"],["Kelancaran"]]) body+=td(val(k,...aliases));
    subtotal("Sub Total","Sub Total Keagamaan Islam.1");
  }

  if(kristenVisible){
    group("Keagamaan Kristen & Katolik",4,[th("Beribadah",'colspan="3"'),th("Pemahaman Alkitab",'rowspan="2"')],["Ibadah ke Gereja","Pelayanan di Gereja","Lagu Pujian","Berdoa & Membaca Alkitab"]);
    for(const [k,...aliases] of [["Ibadah ke Gereja"],["Pelayanan di Gereja"],["Lagu Pujian"],["Berdoa & Membaca Alkitab","Berdoa dan Membaca Al Kitab"]]) body+=td(val(k,...aliases));
  }

  const waw=["Sikap & Perilaku","Komunikasi","Karakter","Hubungan","Dukungan","Manajemen Waktu","Konsistensi","MPK-OSIS","Komitmen"];
  group("Wawancara",9,[th("",'colspan="9" rowspan="2"')],waw);
  for(const [k,...aliases] of [["Sikap & Perilaku"],["Komunikasi"],["Karakter"],["Hubungan"],["Dukungan"],["Manajemen Waktu"],["Konsistensi"],["MPK-OSIS","MPK - OSIS"],["Komitmen"]]) body+=td(val(k,...aliases));
  subtotal("Sub Total","Sub Total Wawancara");

  r1+=th("Jumlah Nilai",'rowspan="3"');
  body+=td(val("Jumlah Nilai"),"final");

  document.querySelector("#scoreTable").innerHTML=`<thead><tr class="group-row">${r1}</tr><tr class="sub-row">${r2}</tr><tr class="leaf-row">${r3}</tr></thead><tbody><tr>${body}</tr></tbody>`;
}
document.querySelector("#form").addEventListener("submit",async e=>{e.preventDefault();let m=document.querySelector("#msg");m.textContent="";try{let r=await fetch("data/peserta.csv?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;let d=parseCSV(await r.text()),p=d.find(x=>norm(x.Nama)==norm(document.querySelector("#name").value)&&norm(x.Kelas)==norm(document.querySelector("#class").value)&&x.tahun_lahir==y.value&&norm(x.Pilihan)==norm(document.querySelector("#division").value));if(!p){m.textContent="Data tidak ditemukan. Periksa nama, kelas, tahun lahir, dan pilihan.";return}let s=(p.status||"red").toLowerCase(),card=document.querySelector("#resultCard");card.className="result "+s;document.querySelector("#status").textContent=s=="blue"?"LOLOS":s=="yellow"?"LOLOS BERSYARAT":"TIDAK LOLOS";document.querySelector("#title").textContent=p.judul||"Hasil Seleksi";document.querySelector("#rname").textContent=p.Nama||"—";document.querySelector("#rclass").textContent=p.Kelas||"—";document.querySelector("#rdivision").textContent=p.Pilihan||"—";document.querySelector("#desc").textContent=p.keterangan||"Silakan mengikuti informasi selanjutnya dari panitia.";document.querySelector("#icon").textContent=s=="blue"?"✓":s=="yellow"?"!":"×";render(p);document.querySelector("#result").classList.remove("hidden");document.querySelector("#result").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){m.textContent="Database belum tersedia. Pastikan data/peserta.csv sudah di-upload ke GitHub."}});
document.querySelector("#reset").onclick=()=>{document.querySelector("#form").reset();document.querySelector("#result").classList.add("hidden");document.querySelector("#cek").scrollIntoView({behavior:"smooth"})};