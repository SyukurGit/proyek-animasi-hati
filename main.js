//================================================================
// 1. SETUP DASAR (Sama seperti sebelumnya)
//================================================================
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


//================================================================
// 2. MEMBUAT PARTIKEL (PENGGANTI KUBUUS)
//================================================================

// Hapus atau beri komentar kode kubus lama
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// TAMBAHKAN BAGIAN INI
// Geometry untuk partikel
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000; // Jumlah partikel yang kita inginkan

const positions = new Float32Array(count * 3); // Setiap partikel butuh 3 nilai (x, y, z)

// Mengisi array 'positions' dengan koordinat acak
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10; // Sebar partikel secara acak dalam area 10x10x10
}

// Menetapkan atribut posisi pada geometry
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material untuk partikel
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02, // Ukuran setiap partikel
    sizeAttenuation: true, // Partikel yang jauh akan terlihat lebih kecil
    color: 0xffffff, // Warna partikel (putih)
    transparent: true, // Aktifkan transparansi
    blending: THREE.AdditiveBlending // EFEK PENTING: Membuat partikel yang bertumpuk jadi lebih terang (efek glow)
});

// Membuat objek Points (gabungan geometry dan material)
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles); // Menambahkan partikel ke scene


//================================================================
// 3. ANIMATION LOOP (DENGAN SEDIKIT MODIFIKASI)
//================================================================

// Kita tambahkan objek jam untuk animasi yang lebih konsisten
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // UBAH BAGIAN INI: Animasikan partikel
    // Membuat seluruh partikel berputar perlahan
    particles.rotation.y = elapsedTime * 0.1;

    // Render scene
    renderer.render(scene, camera);

    // Panggil tick lagi untuk frame berikutnya
    window.requestAnimationFrame(tick);
};

tick();