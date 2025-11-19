document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.slider-section .slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    // Thoát nếu không tìm thấy slider
    if (!sliderWrapper || slides.length === 0 || !prevBtn || !nextBtn || !dotsContainer) {
      console.warn("Slider elements not found. Slider will not initialize.");
      return;
    }
  
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
  
    // Đặt chiều rộng cho wrapper để chứa tất cả slide trên một hàng
    sliderWrapper.style.width = `${totalSlides * 100}%`;
    
    // Tạo các dấu chấm (dots)
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.dataset.index = i;
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', (e) => {
        goToSlide(parseInt(e.target.dataset.index));
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.slider-dots .dot');
  
    // Hàm cập nhật vị trí slider và dot
    function updateSlider() {
      // Tính toán vị trí dịch chuyển
      // (currentIndex * 100) / totalSlides = % dịch chuyển
      sliderWrapper.style.transform = `translateX(-${(currentIndex * 100) / totalSlides}%)`;
      
      // Cập nhật dot active
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }
  
    // Hàm đi đến slide cụ thể
    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }
  
    // Hàm chuyển slide tiếp theo
    function showNext() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }
  
    // Hàm lùi slide
    function showPrev() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }
    
    // Gán sự kiện cho nút
    nextBtn.addEventListener('click', () => {
      showNext();
      resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
      showPrev();
      resetAutoPlay();
    });
    
    // Tự động chuyển slide
    function startAutoPlay() {
      autoPlayInterval = setInterval(showNext, 5000); // Chuyển slide mỗi 5 giây
    }
  
    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }
  
    // Khởi động
    updateSlider(); // Đảm bảo slide đầu tiên hiển thị đúng
    startAutoPlay();
  });