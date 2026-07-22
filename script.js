/* ==========================================================================
   INTERACTIVE SCRIPT - HAPPY WOMEN'S DAY 8/3
   Features: Particle Petals, Fireworks, Web Audio SFX, BGM Player & Dynamic Wishes
   ========================================================================== */

(function () {
    'use strict';

    // State Variables
    let currentRecipient = "Cậu";
    let isPlayingBgm = false;
    let giftRevealed = false;

    // DOM Elements
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const canvasOverlay = document.getElementById('canvasOverlay');
    const ctxOverlay = canvasOverlay.getContext('2d');
    const recipientInput = document.getElementById('recipientInput');
    const receiveGiftBtn = document.getElementById('receiveGiftBtn');
    const nameForm = document.getElementById('nameForm');
    const giftSection = document.getElementById('giftSection');
    const wishSection = document.getElementById('wishSection');
    const recipientElements = document.querySelectorAll('.recipient-name');
    const dynamicWish = document.getElementById('dynamicWish');
    const giftModal = document.getElementById('giftModal');
    const modalGiftTitle = document.getElementById('modalGiftTitle');
    const modalGiftImage = document.getElementById('modalGiftImage');
    const modalWishMessage = document.getElementById('modalWishMessage');
    const musicToggle = document.getElementById('musicToggle');
    const musicStatus = document.getElementById('musicStatus');
    const bgmAudio = document.getElementById('bgmAudio');

    // Canvas Dimensions
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;
    canvasOverlay.width = cw;
    canvasOverlay.height = ch;

    window.addEventListener('resize', () => {
        cw = window.innerWidth;
        ch = window.innerHeight;
        canvas.width = cw;
        canvas.height = ch;
        canvasOverlay.width = cw;
        canvasOverlay.height = ch;
    });

    // ==========================================================================
    // 1. DATA: GIFTS & WISDOM CATEGORIES
    // ==========================================================================
    const gifts = [
        {
            title: "Vườn Hoa Ngát Hương 🌸",
            image: "vuon_hoa.jpg",
            message: "Chúc {name} luôn rực rỡ, tỏa ngát hương thơm và xinh đẹp như một vườn hoa xuân tràn đầy sức sống!"
        },
        {
            title: "Ngàn Điều Ước Thành Hiện Thực ✨",
            image: "dieu_uoc.jpg",
            message: "Gửi tặng {name} ngàn lời chúc tốt đẹp nhất. Mọi ước mơ, nguyện vọng của {name} đều sẽ mỉm cười và thành hiện thực!"
        },
        {
            title: "Tài Lộc & Hạnh Phúc 💰❤️",
            image: "tien.jpg",
            message: "Chúc {name} luôn may mắn, công việc hanh thông, ví tiền luôn rủng rỉnh và cuộc sống ngập tràn niềm vui!"
        }
    ];

    const wishDatabase = {
        all: [
            "Chúc {name} luôn rạng rỡ như những bông hoa ngát hương, xinh đẹp, hạnh phúc và tràn đầy năng lượng tích cực!",
            "Ngày 8/3 thật vui vẻ! Chúc {name} nhận được thật nhiều quà, nhiều hoa và luôn là điều tuyệt vời nhất!",
            "Chúc {name} luôn trẻ trung, cười thật nhiều và lúc nào cũng ngập tràn yêu thương trong trái tim!"
        ],
        mom: [
            "Chúc Mẹ yêu của con ngày 8/3 thật nhiều sức khỏe, luôn vui vẻ và hạnh phúc bên gia đình mình!",
            "Cảm ơn Mẹ đã luôn hy sinh và dành trọn yêu thương cho con. Chúc Mẹ mãi bình an và tràn đầy nụ cười!",
            "Mẹ là người phụ nữ tuyệt vời nhất thế giới! Con chúc Mẹ luôn sống khỏe, vui tươi mỗi ngày!"
        ],
        love: [
            "Chúc người yêu xinh đẹp của anh ngày 8/3 rạng rỡ và tràn ngập niềm vui. Anh yêu em rất nhiều! 💖",
            "Mỗi ngày có em đều là một ngày hạnh phúc. Chúc em mãi xinh đẹp, dịu dàng và luôn bên anh nhé!",
            "Gửi ngàn nụ hôn và tình yêu to lớn nhất đến em trong ngày Quốc tế Phụ nữ này! ✨"
        ],
        sister: [
            "Chúc chị/em gái ngày 8/3 ngày càng xinh đẹp, học giỏi/làm tốt và mau tìm được hoàng tử nhé!",
            "Ngày của phái đẹp, chúc chị/em luôn rạng rỡ, gặp nhiều may mắn và thành công trong cuộc sống!",
            "Chúc người chị/em tuyệt vời của tôi nhận được cả núi quà và luôn cười tươi ngập tràn!"
        ],
        friends: [
            "Chúc cậu ngày 8/3 ngập tràn niềm vui, công việc thuận lợi và luôn giữ vững tinh thần tích cực!",
            "Gửi tới người bạn tuyệt vời nhất lời chúc xinh đẹp, hạnh phúc và thành công rực rỡ!",
            "Chúc phái đẹp nhóm mình 8/3 nhận hoa không hết, nhận quà mỏi tay và mãi đáng yêu!"
        ]
    };

    // Helper: Pick Random Wish
    function getRandomWish(name = currentRecipient) {
        const allWishes = Object.values(wishDatabase).flat();
        const raw = allWishes[Math.floor(Math.random() * allWishes.length)];
        return raw.replace(/{name}/g, name);
    }

    // Update Recipient Name Across UI
    function updateRecipientName() {
        const val = recipientInput.value.trim();
        currentRecipient = val.length > 0 ? val : "Cậu";

        // Update all .recipient-name elements (re-query since modal may have them)
        document.querySelectorAll('.recipient-name').forEach(el => {
            el.textContent = currentRecipient;
        });

        // Refresh dynamic wish card text
        const newWish = getRandomWish(currentRecipient);
        dynamicWish.style.opacity = 0;
        setTimeout(() => {
            dynamicWish.innerHTML = newWish.replace(currentRecipient, `<span class="recipient-name">${currentRecipient}</span>`);
            dynamicWish.style.opacity = 1;
        }, 200);
    }

    // "Nhận quà" button: reveal gift section with animation
    function revealGifts() {
        if (giftRevealed) return;
        giftRevealed = true;

        updateRecipientName();
        playMagicChimeSFX();

        // Big fireworks celebration
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const rx = Math.random() * (cw * 0.8) + (cw * 0.1);
                const ry = Math.random() * (ch * 0.5) + (ch * 0.1);
                spawnFireworkExplosion(rx, ry, 100);
            }, i * 250);
        }

        // Slide up the name form
        nameForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        nameForm.style.opacity = '0';
        nameForm.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            nameForm.style.display = 'none';
        }, 500);

        // Reveal gift section
        setTimeout(() => {
            giftSection.classList.remove('hidden');
            giftSection.style.animation = 'fadeSlideIn 0.7s ease-out forwards';
        }, 400);

        // Reveal wish section
        setTimeout(() => {
            wishSection.classList.remove('hidden');
            wishSection.style.animation = 'fadeSlideIn 0.7s ease-out forwards';
        }, 700);
    }

    receiveGiftBtn.addEventListener('click', revealGifts);
    recipientInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') revealGifts();
    });

    // ==========================================================================
    // 2. WEB AUDIO API SYNTHESIZER (Sound Effects for Unboxing)
    // ==========================================================================
    let audioCtx = null;

    function playMagicChimeSFX() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;
            const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
            
            frequencies.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0, now + idx * 0.08);
                gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.65);
            });
        } catch (e) {
            console.log("Audio SFX not permitted yet");
        }
    }

    // ==========================================================================
    // 3. BACKGROUND MUSIC TOGGLE
    // ==========================================================================
    musicToggle.addEventListener('click', () => {
        if (!isPlayingBgm) {
            bgmAudio.play().then(() => {
                isPlayingBgm = true;
                musicToggle.classList.add('playing');
                musicStatus.textContent = "Bật 🎵";
            }).catch(err => {
                console.log("Autoplay blocked or network error", err);
            });
        } else {
            bgmAudio.pause();
            isPlayingBgm = false;
            musicToggle.classList.remove('playing');
            musicStatus.textContent = "Tắt";
        }
    });

    // ==========================================================================
    // 4. GIFT MODAL & FIREWORKS TRIGGER
    // ==========================================================================
    window.openGift = function (index) {
        const item = gifts[index];
        if (!item) return;

        playMagicChimeSFX();
        spawnFireworkExplosion(cw / 2, ch / 2 + 50, 150);

        modalGiftTitle.textContent = item.title;
        modalGiftImage.src = item.image;
        modalWishMessage.innerHTML = item.message.replace(/{name}/g, `<span class="recipient-name">${currentRecipient}</span>`);

        giftModal.classList.add('active');
    };

    window.closeModal = function () {
        giftModal.classList.remove('active');
    };

    window.triggerExtraFireworks = function () {
        playMagicChimeSFX();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const rx = Math.random() * (cw * 0.8) + (cw * 0.1);
                const ry = Math.random() * (ch * 0.5) + (ch * 0.1);
                spawnOverlayFirework(rx, ry, 90);
            }, i * 200);
        }
    };

    // Close modal on outside click
    giftModal.addEventListener('click', (e) => {
        if (e.target === giftModal) closeModal();
    });

    // ==========================================================================
    // 5. ANIMATION ENGINE: PETALS, HEARTS & FIREWORKS
    // ==========================================================================

    // Petal Particle Class
    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * cw;
            this.y = -20;
            this.size = Math.random() * 10 + 8;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 2;
            this.color = Math.random() > 0.3 ? '#ffb3c6' : '#ff758c';
            this.opacity = Math.random() * 0.6 + 0.4;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.02) + this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y > ch + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            // Draw Sakura Petal Shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    // Firework Particle Class
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 8 + 2;
            this.friction = 0.95;
            this.gravity = 0.12;
            this.color = color || `hsl(${Math.random() * 60 + 330}, 100%, 65%)`;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 3 + 2;
        }

        update() {
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Collections
    const petals = Array.from({ length: 35 }, () => new Petal());
    let fireworkParticles = [];
    let overlayParticles = [];

    function spawnFireworkExplosion(x, y, count = 100) {
        const colors = ['#ff4d6d', '#ffd700', '#c77dff', '#ffb3c6', '#00f5d4'];
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            fireworkParticles.push(new Particle(x, y, color));
        }
    }

    function spawnOverlayFirework(x, y, count = 80) {
        const colors = ['#ff4d6d', '#ffd700', '#c77dff', '#ffb3c6', '#00f5d4', '#ff85a1'];
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            overlayParticles.push(new Particle(x, y, color));
        }
    }

    // Auto-fire fireworks at random intervals
    function autoFireFireworks() {
        const rx = Math.random() * (cw * 0.8) + (cw * 0.1);
        const ry = Math.random() * (ch * 0.45) + (ch * 0.05);
        spawnFireworkExplosion(rx, ry, Math.floor(Math.random() * 40) + 50);
    }

    // Launch auto-fireworks every 1.5–3 seconds
    setInterval(() => {
        autoFireFireworks();
    }, 1800);

    // Occasionally double burst
    setInterval(() => {
        autoFireFireworks();
        setTimeout(autoFireFireworks, 300);
    }, 4500);

    // Main Loop (background canvas)
    function renderLoop() {
        ctx.clearRect(0, 0, cw, ch);

        // Update & Draw Petals
        petals.forEach(p => {
            p.update();
            p.draw();
        });

        // Update & Draw Background Fireworks
        for (let i = fireworkParticles.length - 1; i >= 0; i--) {
            const p = fireworkParticles[i];
            p.update();
            p.draw();
            if (p.alpha <= 0) {
                fireworkParticles.splice(i, 1);
            }
        }

        // Overlay Canvas: render overlay fireworks (above modal)
        ctxOverlay.clearRect(0, 0, cw, ch);
        for (let i = overlayParticles.length - 1; i >= 0; i--) {
            const p = overlayParticles[i];
            p.update();
            // Draw on overlay context
            ctxOverlay.save();
            ctxOverlay.globalAlpha = Math.max(0, p.alpha);
            ctxOverlay.fillStyle = p.color;
            ctxOverlay.beginPath();
            ctxOverlay.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctxOverlay.fill();
            ctxOverlay.restore();
            if (p.alpha <= 0) {
                overlayParticles.splice(i, 1);
            }
        }

        requestAnimationFrame(renderLoop);
    }

    // Start Loop
    renderLoop();

    // Initial fireworks burst on load
    setTimeout(() => {
        spawnFireworkExplosion(cw * 0.3, ch * 0.3, 80);
        setTimeout(() => spawnFireworkExplosion(cw * 0.7, ch * 0.25, 80), 300);
        setTimeout(() => spawnFireworkExplosion(cw * 0.5, ch * 0.4, 60), 600);
    }, 400);

})();