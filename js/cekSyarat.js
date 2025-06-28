document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cekKelayakanForm');
    const tanggalLahirInput = document.getElementById('tanggalLahir');
    const pendidikanInput = document.getElementById('pendidikan');
    const jenisKelaminInput = document.getElementById('jenisKelamin');
    const tinggiInput = document.getElementById('tinggi');
    const beratInput = document.getElementById('berat');
    const statusPernikahanInput = document.getElementById('statusPernikahan');
    const hasilKelayakanDiv = document.getElementById('hasilKelayakan');
    const pesanKelayakanP = document.getElementById('pesanKelayakan');
    const jalurPendaftaranP = document.getElementById('jalurPendaftaran');

    // Tambahkan log untuk memastikan script dimuat dan form ditemukan
    console.log('Script cekSyarat.js loaded.');
    if (form) {
        console.log('Form cekKelayakanForm found.');
    } else {
        console.error('ERROR: Form cekKelayakanForm not found!');
        return; // Hentikan eksekusi jika form tidak ditemukan
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form submit dan reload halaman
        console.log('Form submitted. Processing data...'); // Log saat submit

        // Reset tampilan hasil
        hasilKelayakanDiv.classList.add('hidden');
        pesanKelayakanP.innerHTML = '';
        jalurPendaftaranP.innerHTML = '';

        // Ambil nilai dari input
        const tanggalLahirStr = tanggalLahirInput.value;
        const pendidikan = pendidikanInput.value;
        const jenisKelamin = jenisKelaminInput.value;
        const tinggi = parseInt(tinggiInput.value);
        const berat = parseInt(beratInput.value);
        const statusPernikahan = statusPernikahanInput.value;

        // Validasi input dasar
        if (!tanggalLahirStr || !pendidikan || !jenisKelamin || isNaN(tinggi) || isNaN(berat) || !statusPernikahan || tinggi <= 0 || berat <= 0) {
            pesanKelayakanP.innerHTML = '<span style="color: red; font-weight: bold;">Mohon lengkapi semua kolom dengan benar (angka positif untuk tinggi/berat).</span>';
            hasilKelayakanDiv.classList.remove('hidden');
            console.log('Validation failed: Incomplete or invalid input.');
            return;
        }

        // Hitung usia
        const tanggalLahir = new Date(tanggalLahirStr);
        const today = new Date();
        let usia = today.getFullYear() - tanggalLahir.getFullYear();
        const m = today.getMonth() - tanggalLahir.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < tanggalLahir.getDate())) {
            usia--;
        }

        let layakKeseluruhan = true;
        let pesanDetailKelayakan = [];
        let rekomendasiJalur = [];

        // --- Logika Persyaratan TNI ---

        // 1. Persyaratan Usia
        let minUsia; // Tahun
        let maxUsia; // Tahun
        let minBulanUsia = 9; // Umumnya minimal 17 tahun 9 bulan

        if (pendidikan === 'SMP') {
            minUsia = 17; maxUsia = 22; // Tamtama
            rekomendasiJalur.push('Tamtama');
        } else if (pendidikan === 'SMA') {
            minUsia = 17; maxUsia = 22; // Bintara (Usia maksimal bisa sampai 23-24 untuk beberapa kasus)
            rekomendasiJalur.push('Bintara');
            rekomendasiJalur.push('Tamtama'); // SMA juga bisa Tamtama
        } else if (pendidikan === 'D3') {
            minUsia = 18; maxUsia = 24; // Bintara atau Perwira (Sepa PK/PSDP)
            rekomendasiJalur.push('Bintara');
            rekomendasiJalur.push('Perwira (Sepa PK/PSDP)');
        } else if (pendidikan === 'S1') {
            minUsia = 18; maxUsia = 26; // Perwira (Sepa PK/PSDP/Akmil Sumber Sarjana)
            rekomendasiJalur.push('Perwira (Sepa PK/PSDP)');
        } else {
             // Fallback jika ada pendidikan tak terduga
             minUsia = 18; maxUsia = 22;
        }

        // Perhitungan usia lebih akurat untuk 17 tahun 9 bulan
        const umurDalamBulan = (today.getFullYear() - tanggalLahir.getFullYear()) * 12 + (today.getMonth() - tanggalLahir.getMonth());
        
        if (usia < minUsia || (usia === minUsia && today.getDate() < tanggalLahir.getDate())) { // Cek minimal tahun
            // Jika persis 17 tahun, cek bulan
            if (usia === 17 && umurDalamBulan < (17 * 12 + minBulanUsia)) {
                layakKeseluruhan = false;
                pesanDetailKelayakan.push(`❌ Usia Anda (${usia} tahun) belum mencapai minimal 17 tahun 9 bulan.`);
            } else if (usia < minUsia) { // Perbaikan: Ganti umur jadi usia
                layakKeseluruhan = false;
                pesanDetailKelayakan.push(`❌ Usia Anda (${usia} tahun) terlalu muda, minimal ${minUsia} tahun.`);
            } else {
                pesanDetailKelayakan.push(`✅ Usia (${usia} tahun) memenuhi syarat minimal.`);
            }
        } else if (usia > maxUsia) {
            layakKeseluruhan = false;
            pesanDetailKelayakan.push(`❌ Usia Anda (${usia} tahun) melebihi batas maksimal ${maxUsia} tahun untuk jalur pendidikan ini.`);
        } else {
            pesanDetailKelayakan.push(`✅ Usia (${usia} tahun) memenuhi syarat.`);
        }


        // 2. Persyaratan Tinggi Badan
        let minTinggiPria = 163; // Umumnya 163 cm untuk Pria
        let minTinggiWanita = 157; // Umumnya 157 cm untuk Wanita
        
        // Atur minimum tinggi khusus untuk jalur Perwira (lebih tinggi)
        if (rekomendasiJalur.includes('Perwira (Sepa PK/PSDP)')) {
            minTinggiPria = Math.max(minTinggiPria, 165); // Misalnya Perwira minimal 165 cm
            minTinggiWanita = Math.max(minTinggiWanita, 160); // Misalnya Perwira minimal 160 cm
        }

        if (jenisKelamin === 'Pria') {
            if (tinggi < minTinggiPria) {
                layakKeseluruhan = false;
                pesanDetailKelayakan.push(`❌ Tinggi badan Pria minimal ${minTinggiPria} cm. Tinggi Anda ${tinggi} cm.`);
            } else {
                pesanDetailKelayakan.push(`✅ Tinggi badan Pria (${tinggi} cm) memenuhi syarat.`);
            }
        } else { // Wanita
            if (tinggi < minTinggiWanita) {
                layakKeseluruhan = false;
                pesanDetailKelayakan.push(`❌ Tinggi badan Wanita minimal ${minTinggiWanita} cm. Tinggi Anda ${tinggi} cm.`);
            } else {
                pesanDetailKelayakan.push(`✅ Tinggi badan Wanita (${tinggi} cm) memenuhi syarat.`);
            }
        }

        // 3. Status Pernikahan (Umumnya belum menikah untuk pendidikan pertama)
        if (statusPernikahan === 'Sudah Menikah') {
            layakKeseluruhan = false;
            pesanDetailKelayakan.push('❌ Status pernikahan: Calon prajurit yang mengikuti pendidikan pertama umumnya harus berstatus belum menikah.');
        } else {
            pesanDetailKelayakan.push('✅ Status pernikahan memenuhi syarat.');
        }

        // 4. BMI (Body Mass Index) - Berat Badan Ideal
        const tinggiM = tinggi / 100;
        const bmi = berat / (tinggiM * tinggiM);
        const minBMI = 18.5;
        const maxBMI = 25;
        
        if (bmi < minBMI || bmi > maxBMI) {
            layakKeseluruhan = false;
            pesanDetailKelayakan.push(`❌ Indeks Massa Tubuh (BMI) Anda (${bmi.toFixed(2)}) tidak ideal (normal: ${minBMI} - ${maxBMI}).`);
        } else {
            pesanDetailKelayakan.push(`✅ BMI Anda (${bmi.toFixed(2)}) ideal.`);
        }

        // 5. Pendidikan Khusus SMP (Hanya Tamtama)
        if (pendidikan === 'SMP' && (rekomendasiJalur.length > 1 || !rekomendasiJalur.includes('Tamtama'))) {
             rekomendasiJalur = ['Tamtama']; // Pastikan hanya Tamtama
        }
        
        // 6. Jenis Kelamin (wanita tidak bisa Tamtama/Taruna Akmil, sebagian Bintara)
        if (jenisKelamin === 'Wanita') {
            // Hapus Tamtama dari rekomendasi jalur jika jenis kelamin wanita
            rekomendasiJalur = rekomendasiJalur.filter(j => j !== 'Tamtama');
            
            // Jika wanita dan tidak ada jalur lain yang tersisa (misal hanya Tamtama yang direkomendasikan sebelumnya)
            if (rekomendasiJalur.length === 0 && pendidikan === 'SMP') { // Wanita SMP tidak ada jalur TNI umum
                 pesanDetailKelayakan.push('❌ Lulusan wanita dari jenjang SMP tidak dapat mendaftar jalur Tamtama atau jalur TNI lainnya secara umum.');
                 layakKeseluruhan = false; 
            } else if (rekomendasiJalur.length === 0 && (pendidikan === 'SMA' || pendidikan === 'D3' || pendidikan === 'S1')) {
                // Untuk wanita SMA/D3/S1 yang mungkin tidak memenuhi syarat lain, tetapi jalur Tamtama telah difilter
                // Mungkin perlu penyesuaian jika hanya Tamtama yang awalnya direkomendasikan karena syarat lain tidak terpenuhi
                 if (!pesanDetailKelayakan.includes('❌ Lulusan wanita tidak dapat mendaftar jalur Tamtama.')) { // Hindari duplikasi pesan
                     pesanDetailKelayakan.push('Catatan: Jalur Tamtama tidak terbuka untuk wanita.');
                 }
            }
        }


        // Tampilkan Hasil Akhir
        if (layakKeseluruhan) {
            pesanKelayakanP.innerHTML = `<span style="color: green; font-weight: bold;">Selamat! Anda kemungkinan memenuhi persyaratan awal.</span><br>${pesanDetailKelayakan.join('<br>')}`;
            // Tambahkan pesan jika tidak ada jalur spesifik yang cocok meskipun "layak keseluruhan"
            if (rekomendasiJalur.length > 0) {
                // HANYA ADA SATU LINK KE HALAMAN RINGKASAN JALUR
                const linkRingkasan = `<a href="ringkasan_jalur.html" target="_blank">Lihat Detail Jalur Pendaftaran</a>`;
                jalurPendaftaranP.innerHTML = `**Jalur Pendaftaran yang Sesuai:**<br>${rekomendasiJalur.map(j => `&bull; ${j}`).join('<br>')}<br><br>${linkRingkasan}`;
            } else {
                jalurPendaftaranP.innerHTML = `**Tidak ada jalur pendaftaran spesifik yang direkomendasikan berdasarkan input Anda saat ini. Silakan cek detail persyaratan.**`;
            }
        } else {
            pesanKelayakanP.innerHTML = `<span style="color: red; font-weight: bold;">Mohon maaf, Anda belum memenuhi beberapa persyaratan awal.</span><br>${pesanDetailKelayakan.join('<br>')}`;
            if (rekomendasiJalur.length > 0) {
                // HANYA ADA SATU LINK KE HALAMAN RINGKASAN JALUR
                const linkRingkasan = `<a href="ringkasan_jalur.html" target="_blank">Lihat Detail Jalur Pendaftaran</a>`;
                jalurPendaftaranP.innerHTML = `**Jalur Pendaftaran yang Mungkin Sesuai (jika semua syarat dipenuhi):**<br>${rekomendasiJalur.map(j => `&bull; ${j}`).join('<br>')}<br><br>${linkRingkasan}`;
            } else {
                jalurPendaftaranP.innerHTML = `**Tidak ada jalur pendaftaran spesifik yang direkomendasikan karena tidak memenuhi persyaratan dasar.**`;
            }
        }
        
        hasilKelayakanDiv.classList.remove('hidden');
        console.log('Result section displayed.'); // Log bahwa hasil sudah ditampilkan
    });
});