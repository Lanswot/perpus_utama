console.log("-------------------------------------")
console.log("============ PERPUS KAMI ============")
console.log("====== UAS DDP 2023 - SI PAGI 3 =====")
console.log("============= KELOMPOK 1 ============")
console.log("-------------------------------------")
console.log("")

//function Menu Utama
function menu (){
    console.log("--- Menu Utama ---")
    console.log("1. Tambah Buku")
    console.log("2. Cari Buku")
    console.log("3. Hapus Buku")
    console.log("4. Tambah Peminjaman")
    console.log("5. Cari Peminjaman")
    console.log("6. Hapus Peminjaman")
    console.log("7. Keluar")
    console.log("")
}

//variabel penampung package prompt
//memungkinkan user menginputkan data
let prompt = require('prompt-sync')()

//function Tambah Buku
function inputbuku(judul, pengarang, tahunterbit) {
    const fs = require('fs')
    
    let existingData = []
    
    //Mengecek file Books
    if (fs.existsSync('books.json')) {
        //kondisi jika ada isi di dalam filenya
        const existingJson = fs.readFileSync('books.json', 'utf8')
        existingData = JSON.parse(existingJson)
    }
    
    //Menambahkan data baru ke dalam file books
    existingData.push({ judul: judul, pengarang: pengarang, tahunterbit: tahunterbit })
    
    //Menyimpan kembali keseluruhan data dalam file books
    fs.writeFileSync('books.json', JSON.stringify(existingData, null, 3))
    
    console.log("")
    console.log('Berhasil menambahkan Data Buku ' + `"${judul}"`)
}  

//Function Cari Buku
function cariBuku(judul){
    const fs = require('fs')

    try{
        //membaca isi file
        const data = fs.readFileSync('books.json', 'utf8')
        const daftarBuku = JSON.parse(data)

        //menemukan buku yang sama seperti judul yang dicari
        const bukuDitemukan = daftarBuku.find(buku => buku.judul === judul)
        //kalau ditemukan
        if(bukuDitemukan){
            console.log("")
            console.log("Buku "+`${judul}`+" Berhasil Ditemukan")
            console.log("")
        //kalau tida ditemukan
        } else {
            console.log("")
            console.log("Buku Tidak Ditemukan")
            console.log("")
        }
    } catch(err){
        console.log("Terjadi Kesalahan", err)
    }
}

//Function dari Cari Buku untuk menampilkan Buku
function tampilBuku() {
    const fs = require('fs');

    try {
        //membaca file, apa saja isinya
        const data = fs.readFileSync('books.json', 'utf8');
        const daftarBuku = JSON.parse(data);

        console.log("");
        console.log("Daftar Buku : ");
        //ini perulangan untuk menampilkan data books
        daftarBuku.forEach((buku, index) => {
            console.log("");
            console.log(`${index}. Judul: ${buku.judul}, Pengarang: ${buku.pengarang}, Tahun Terbit: ${buku.tahunterbit}`);
            console.log("");
        });

        return daftarBuku;
    } catch (err) {
        console.log("Terjadi kesalahan: ", err);
    }
    return [];
}

//Function Menghapus Buku
function hapusBuku() {
    const fs = require('fs');

    //memanggil tampil buku
    const daftarBuku = tampilBuku();

    //kalau isi bukunya kosong
    if (daftarBuku.length === 0) {
        console.log("Tidak ada buku yang bisa dihapus");
        return;
    }

    //inputan user memilih index buku ke berapa
    const nomorBuku = prompt("Masukan Nomor Buku yang akan Dihapus : ");
    const indexBuku = parseInt(nomorBuku);

    //bagian utama dari mengahpus data buku
    if (indexBuku >= 0 && indexBuku < daftarBuku.length) {
        const bukuHapus = daftarBuku.splice(indexBuku, 1)[0];
        fs.writeFileSync('books.json', JSON.stringify(daftarBuku, null, 3));
        console.log("");
        console.log(`Buku dengan judul "${bukuHapus.judul}" telah dihapus dari daftar.`);
    } else {
        console.log('Nomor Buku tidak Ditemukan');
    }
}

//Function Input Peminjaman
function inputpinjam(nama, telp, judulpinjam) {
    const fs = require('fs');
    let loans = [];

    try {
        //membaca isi file loans
        const loansData = fs.readFileSync('loans.json', 'utf-8');
        if (loansData.trim() !== '') {
            loans = JSON.parse(loansData);
        }
    } catch (err) {
        console.log("Error reading loans.json", err);
    }

    //pengaturan untuk menangkap tanggal peminjaman
    const pinjamDate = new Date().toLocaleDateString(); // Menggunakan toLocaleDateString() agar hanya tanggal yang diambil
    const kembaliDate = new Date(); // Menggunakan tanggal saat ini untuk tanggal pengembalian
    kembaliDate.setDate(kembaliDate.getDate() + 7);
    const bataspinjam = kembaliDate.toISOString().split('T')[0];

    //susunan array yang akan disimpan
    const newLoan = {
        nama: nama,
        telp: telp,
        judulpinjam: judulpinjam,
        tglpinjam: pinjamDate,
        bataspinjam: bataspinjam
    };

    //push data baru ke loans
    loans.push(newLoan);

    //memasukkan data baru ke file loans
    fs.writeFile('loans.json', JSON.stringify(loans, null, 2), 'utf-8', (err) => {
        if (err) {
            console.error('Error Menulis data loans.json', err);
        } else {
            console.log('');
            console.log('Data Peminjaman', nama ,' Berhasil ditambahkan');
            console.log('');
            console.log('Tanggal Peminjaman Buku : ', pinjamDate);
            console.log('');
            console.log('Tanggal Pengembalian Buku : ', bataspinjam);
            console.log('');

        }
    });

    return bataspinjam; // Mengembalikan tanggal pengembalian untuk keperluan lain jika dibutuhkan
}

//Function Cari Data Peminjaman


function tampilpinjam(namaPeminjam) {
    const fs = require('fs');
    try {
        const data = fs.readFileSync('loans.json', 'utf-8');
        const daftarPinjam = JSON.parse(data);

        if (daftarPinjam.length === 0) {
            console.log('');
            console.log('File loans.json kosong.');
            console.log('');
            return [];
        }

        const hasilPencarian = daftarPinjam.filter(peminjaman => peminjaman.nama.toLowerCase() === namaPeminjam.toLowerCase());

        if (hasilPencarian.length === 0) {
            console.log('');
            console.log(`Data Peminjam dengan Nama ${namaPeminjam} tidak ditemukan`);
            console.log('');
            return [];
        }

        console.log('');
        console.log(`Daftar Peminjaman untuk ${namaPeminjam}: `);

        hasilPencarian.sort((a, b) => new Date(a.tglpinjam) - new Date(b.tglpinjam));

        hasilPencarian.forEach((peminjaman, index) => {
            console.log('');
            console.log(`${index + 1}. Nama Peminjam : ${peminjaman.nama}`);
            console.log(`   No Telp : ${peminjaman.telp}`);
            console.log(`   Judul Buku : ${peminjaman.judulpinjam}`);
            console.log(`   Tanggal Pinjam : ${peminjaman.tglpinjam}`);
            console.log(`   Tanggal Pengembalian : ${peminjaman.bataspinjam}`);
            console.log('');
        });

        return hasilPencarian;  
    } catch (err) {
        console.log('Terjadi Kesalahan: ', err);
        return [];
    }
}

function tampilpinjampus(namaPeminjampus){
    const fs = require('fs')

    try{
        const data = fs.readFileSync('loans.json', 'utf-8')
        const daftarPinjampus = JSON.parse(data)

        const hasilPencarian = daftarPinjampus.filter(peminjaman => peminjaman.nama.toLowerCase() === namaPeminjampus.toLowerCase())

        if(hasilPencarian.length === 0){
            console.log('')
            console.log(`Data Peminjam dengan Nama ${namaPeminjampus} tidak ditemukan`)
            console.log('')
            return[]
        }

        console.log('')
        console.log(`Daftar Peminjaman untuk ${namaPeminjampus} : `)

        hasilPencarian.sort((a,b) => new Date(a.tglpinjam))

        hasilPencarian.forEach((peminjaman, index) => {
            console.log('')
            console.log(`${index + 1}. Nama Peminjam : ${peminjaman.nama}`)
            console.log(`   No Telp : ${peminjaman.telp}`)
            console.log(`   Judul Buku : ${peminjaman.judulpinjam}`)
            console.log(`   Tanggal Pinjam : ${peminjaman.tglpinjam}`)
            console.log(`   Tanggal Pengembalian : ${peminjaman.bataspinjam}`)
            console.log('')
        });

        return hasilPencarian
    } catch(err){
        console.log('Terjadi Kesalahan Ges : ', err)
    }
    return [];
}

//Function Hapus Data Peminjaman
function hapuspinjam(hasilPencarian, indexhapuspinjam){
    const fs = require('fs')

    try{
        if(indexhapuspinjam < 1 || indexhapuspinjam > hasilPencarian.length){
            console.log('Index Tidak Valid Bos')
            return
        }

        const indexreal = indexhapuspinjam - 1
        const daftarPinjam = JSON.parse(fs.readFileSync('loans.json', 'utf-8'))
        const filterpinjam = daftarPinjam.filter(peminjaman => peminjaman.nama.toLowerCase() !== hasilPencarian[0].nama.toLowerCase())

        fs.writeFileSync('loans.json', JSON.stringify(filterpinjam, null, 2), 'utf-8')

        console.log('')
        console.log('Data Peminjaman Berhasil Dihapus')
        console.log('')

    }catch (err){
        console.log('Terjadi Kesalahan Ges : ', err)
    }
}

//perulangan untuk memilih menu
do {
    menu();
    aksi = prompt("Pilih Menu (1-7) : ");
    console.log("");

    let lanjut = 'n'; // Inisialisasi lanjut ke 'n' untuk default

    switch (aksi) {
        case '1':
            const judul = prompt("Judul Buku : ");
            const pengarang = prompt("Pengarang Buku : ");
            const tahunterbit = prompt("Tahun Terbit Buku : ");

            inputbuku(judul, pengarang, tahunterbit);
            console.log("Data buku berhasil ditambahkan!");
            break;

        case '2':
            const judulCari = prompt("Masukan Judul Buku : ");
            cariBuku(judulCari);
            break;

        case '3':
            hapusBuku();
            console.log("Buku berhasil dihapus!");
            break;

        case '4':
            const nama = prompt('Nama Peminjam : ');
            const telp = prompt('No. Telp : ');
            const judulpinjam = prompt('Judul Buku : ');

            const bataspinjam = inputpinjam(nama, telp, judulpinjam);

            console.log('');
            console.log(`Tanggal Pengembalian: ${bataspinjam}`);
            console.log('');
            break;

        case '5':
            const namaPeminjam = prompt('Masukan Nama Peminjam : ');
            tampilpinjampus(namaPeminjam);
            break;

        case '6':
            const namaPeminjampus = prompt('Masukan Nama Peminjam yang Akan dihapus : ');
            const hasilPencarian = tampilpinjampus(namaPeminjampus);

            if (hasilPencarian.length > 0) {
                const indexhapuspinjam = prompt('Masukan Index keberapa yang Dihapus : ');
                hapuspinjam(hasilPencarian, indexhapuspinjam);
                console.log("Data peminjaman berhasil dihapus!");
            } else {
                console.log("Peminjam tidak ditemukan!");
            }
            break;

        case '7':
            console.log("Keluar dari Program");
            break;

        default:
            console.log("Pilihan tidak valid");
            break;
    }


    if (aksi !== '7') {
        lanjut = prompt("Apakah Anda ingin melanjutkan? (y/n): ").toLowerCase();
        if (lanjut !== 'y') {
            aksi = '7';
        }
    }
} while (aksi !== '7');