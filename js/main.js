// ========================================
// FV パララックス + ロゴ透明化
// ========================================
const fvBg = document.querySelector('.fv__bg');
const fvLogo = document.getElementById('fvLogo');
const contactBg = document.querySelector('.contact__bg');
const contactSection = document.querySelector('.contact');

/**
 * スクロール処理
 * - パララックス効果: .fv__bgを0.5倍速で移動（PCのみ）
 * - ロゴ透明化: スクロール0px→500pxでopacity 1→0
 * - Contact背景のパララックス: Contactセクションが見えている範囲でのみ動作（PCのみ）
 */
function handleScroll() {
  const scrollY = window.scrollY;
  const isPC = window.innerWidth > 768;
  
  // FV背景のパララックス効果（PCのみ実行）
  if (fvBg && isPC) {
    fvBg.style.transform = `translateY(${scrollY * 0.5}px)`;
  } else if (fvBg) {
    // SP版では変位をリセット
    fvBg.style.transform = 'none';
  }
  
  // ロゴ透明化（これはSPでも動かしてOK）
  if (fvLogo) {
    // スクロール量0px → 500pxで opacity: 1 → 0
    // scrollY > 500 の場合は opacity: 0 で固定
    const opacity = Math.max(0, 1 - scrollY / 500);
    fvLogo.style.opacity = opacity;
  }
  
  // Contact背景のパララックス効果（PCのみ実行）
  if (contactBg && contactSection && isPC) {
    const contactTop = contactSection.offsetTop;
    const contactScroll = scrollY - contactTop;
    
    // Contactセクションが見えている範囲でのみ動かす
    if (scrollY > contactTop - window.innerHeight && scrollY < contactTop + contactSection.offsetHeight) {
      // 下方向にのみ動かす（上には伸ばさない）
      const translateY = Math.max(0, contactScroll * 0.3);
      contactBg.style.transform = `translateY(${translateY}px)`;
    }
  } else if (contactBg) {
    // SP版では変位をリセット
    contactBg.style.transform = 'none';
  }
}

// requestAnimationFrameで最適化したスクロールイベント
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// 初回実行（ページ読み込み時）
handleScroll();

// ========================================
// コンセプト - スライダー（テキスト時間差表示）
// ========================================
const conceptSlides = document.querySelectorAll('.concept__slide');
const conceptDots = document.querySelectorAll('.concept__dot');
let currentSlide = 0;
let slideInterval;
let textShowTimeout;

// スライド切り替え関数
function changeSlide(index) {
  // タイマーをクリア
  clearTimeout(textShowTimeout);
  
  // 全スライドを非表示
  conceptSlides.forEach(slide => {
    slide.classList.remove('active', 'is-text-visible');
  });
  
  // 全ドットを非アクティブ
  conceptDots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // 指定スライドを表示（画像のみ）
  conceptSlides[index].classList.add('active');
  conceptDots[index].classList.add('active');
  
  // 1.5秒後にテキストをフェードイン
  textShowTimeout = setTimeout(() => {
    conceptSlides[index].classList.add('is-text-visible');
  }, 1500);
  
  currentSlide = index;
}

// 自動再生（5.7秒ごと = 1.5秒（画像のみ） + 1.2秒（フェードイン） + 3秒（表示））
// フェードアウト1.2秒は次のスライドと同時進行
function startSlider() {
  slideInterval = setInterval(() => {
    const nextSlide = (currentSlide + 1) % conceptSlides.length;
    changeSlide(nextSlide);
  }, 5700);
}

// 初期表示
if (conceptSlides.length > 0) {
  changeSlide(0);
  startSlider();
}

// ドットクリック
conceptDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    clearTimeout(textShowTimeout);
    changeSlide(index);
    startSlider();
  });
});

// ========================================
// ナビゲーションメニュー
// ========================================
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav__link');

// メニュー開閉
function toggleMenu() {
  menuBtn.classList.toggle('is-open');
  nav.classList.toggle('is-open');
  
  // メニューを閉じる時はアニメーションをリセット
  if (!nav.classList.contains('is-open')) {
    const navList = document.querySelector('.nav__list');
    if (navList) {
      navList.style.animation = 'none';
      
      // 次回開く時のためにリセット
      setTimeout(() => {
        navList.style.animation = '';
      }, 50);
    }
  }
  
  // スクロール固定/解除
  if (nav.classList.contains('is-open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// ハンバーガーボタンクリック
if (menuBtn) {
  menuBtn.addEventListener('click', toggleMenu);
}

// オーバーレイクリック（メニューを閉じる）
if (navOverlay) {
  navOverlay.addEventListener('click', toggleMenu);
}

// リンククリック（スムーススクロール + メニューを閉じる）
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      // メニューを閉じる
      toggleMenu();
      
      // スムーススクロール（イージング付き）
      setTimeout(() => {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 400); // メニューが閉じる時間分待つ
    }
  });
});

// ========================================
// ヘッダー横並びメニュー（PC版）のスムーススクロール
// ========================================
const headerNavLinks = document.querySelectorAll('.header__nav-link');

headerNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// ヘッダーロゴクリック → TOP へ戻る
// ========================================
const headerLogo = document.querySelector('.header__logo-wrapper');

if (headerLogo) {
  headerLogo.addEventListener('click', (e) => {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========================================
// ページ読み込み時のフェードイン演出
// ========================================
window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
});

// ========================================
// ヘッダー：スクロール時の背景変更
// ========================================
const header = document.querySelector('.header');

function updateHeaderBackground() {
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
}

// スクロールイベント
window.addEventListener('scroll', updateHeaderBackground);

// 初回実行
updateHeaderBackground();
