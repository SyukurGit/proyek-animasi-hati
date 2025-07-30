//================================================================
// 1. SETUP DASAR
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
// 2. MEMBUAT PARTIKEL BERBENTUK HATI
//================================================================

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

// Fungsi untuk membuat tekstur hati untuk setiap partikel
function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    context.fillStyle = 'white';
    context.font = '64px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('♥', 32, 32); // Menggunakan karakter hati

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Material untuk partikel
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05, // Ukuran setiap partikel hati
    sizeAttenuation: true, // Partikel yang jauh akan terlihat lebih kecil
    color: 0xffffff, // Warna partikel (putih)
    transparent: true, // Aktifkan transparansi
    blending: THREE.AdditiveBlending, // Efek glow saat bertumpuk
    alphaMap: createHeartTexture() // Menggunakan tekstur hati yang kita buat
});

// Membuat objek Points (gabungan geometry dan material)
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles); // Menambahkan partikel ke scene


//================================================================
// 3. ANIMATION LOOP
//================================================================

// Objek jam untuk animasi yang lebih konsisten
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Membuat seluruh partikel berputar perlahan
    particles.rotation.y = elapsedTime * 0.1;

    // Render scene
    renderer.render(scene, camera);

    // Panggil tick lagi untuk frame berikutnya
    window.requestAnimationFrame(tick);
};

tick();


//================================================================
// 4. MENANGANI RESIZE WINDOW
//================================================================
window.addEventListener('resize', () => {
    // Update ukuran
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update aspect ratio kamera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});