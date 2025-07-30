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
camera.position.z = 10; // Posisikan kamera sedikit lebih jauh
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Aktifkan transparansi untuk latar belakang
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


//================================================================
// 2. MEMBUAT PARTIKEL HATI
//================================================================

let particles = null; // Kita akan membuat partikel setelah font dimuat
const fontLoader = new THREE.FontLoader();

// Fungsi untuk membuat tekstur hati (sama seperti sebelumnya)
function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.font = '64px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('♥', 32, 32);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Muat font kita
fontLoader.load(
    './fonts/Great_Vibes_Regular.json',
    (font) => {
        console.log('Font berhasil dimuat');

        const textGeometry = new THREE.TextGeometry(
            'Aline Fiaza',
            {
                font: font,
                size: 1.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        );

        // Pusatkan geometri teks
        textGeometry.center();

        const count = textGeometry.attributes.position.count;
        const particlesGeometry = new THREE.BufferGeometry();
        
        // Buat posisi awal yang acak untuk efek galaksi
        const initialPositions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            initialPositions[i] = (Math.random() - 0.5) * 25;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));

        // Simpan posisi akhir (bentuk nama)
        const finalPositions = textGeometry.attributes.position.array;

        // Material untuk partikel
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            sizeAttenuation: true,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
            alphaMap: createHeartTexture()
        });

        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Fungsi untuk memulai animasi transisi
        const animateToName = () => {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                gsap.to(positions, {
                    duration: 3, // Durasi animasi 3 detik
                    delay: Math.random() * 1, // Beri delay acak agar tidak serentak
                    x: finalPositions[i * 3],
                    y: finalPositions[i * 3 + 1],
                    z: finalPositions[i * 3 + 2],
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        particles.geometry.attributes.position.needsUpdate = true;
                    }
                });
            }
        };

        // Mulai animasi setelah 2 detik halaman dimuat
        setTimeout(animateToName, 2000);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Terjadi kesalahan saat memuat font:', error);
        // Tampilkan pesan error jika font tidak ditemukan
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = "Error: Tidak dapat memuat file font. Pastikan file 'Great_Vibes_Regular.json' berada di dalam folder 'fonts'.";
        errorDiv.style.color = 'white';
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '10px';
        errorDiv.style.left = '10px';
        document.body.appendChild(errorDiv);
    }
);


//================================================================
// 3. ANIMATION LOOP
//================================================================
const clock = new THREE.Clock();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
});

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Jika partikel sudah dibuat, buat ia berputar perlahan dan bereaksi pada mouse
    if (particles) {
        particles.rotation.y = elapsedTime * 0.05 + mouse.x * 0.1;
        particles.rotation.x = mouse.y * 0.1;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

//================================================================
// 4. MENANGANI RESIZE WINDOW
//================================================================
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});