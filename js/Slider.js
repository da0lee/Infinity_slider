const Slider = function (selectedTarget, option) {
  (() => {
    const sliderImgs = document.querySelectorAll(`${selectedTarget} img`);
    let loadedImgs = 0;
    for (let i = 0; i < sliderImgs.length; i++) {
      sliderImgs[i].onload = () => {
        loadedImgs += 1;
        if (loadedImgs === sliderImgs.length) {
          sliderManager(selectedTarget, option);
        } else {
          return;
        }
      };
    }
  })();

  const sliderManager = (selectedTarget, option) => {
    // 사용자가 Slider 호출하면 slider 동작에 필요한 tag들 생성
    const slider = document.querySelector(selectedTarget);
    const slideLis = slider.querySelectorAll('li');
    // wrapper 생성
    const sliderInnerWrap = document.createElement('div');
    const sliderWrap = document.createElement('div');
    slider.parentNode.insertBefore(sliderWrap, slider);
    sliderInnerWrap.appendChild(slider);
    sliderWrap.appendChild(sliderInnerWrap);
    sliderInnerWrap.className = 'slider_innerWrap';
    sliderWrap.className = 'slider_wrap';
    // button 생성
    const sliderBtn = document.createElement('div');
    const prev = document.createElement('button');
    const next = document.createElement('button');
    sliderBtn.appendChild(prev);
    sliderBtn.appendChild(next);
    sliderWrap.appendChild(sliderBtn);
    sliderBtn.className = 'slider_btn';
    prev.className = 'prev';
    next.className = 'next';
    prev.textContent = '<';
    next.textContent = '>';

    slider.addEventListener('transitionend', resetSlider);
    sliderBtn.addEventListener('click', moveSlider);
    const clonedFirstLi = slideLis[0].cloneNode(true);
    const clonedLastLi = slideLis[slideLis.length - 1].cloneNode(true);
    slider.prepend(clonedLastLi);
    slider.appendChild(clonedFirstLi);

    const cloneIncludedLis = slider.querySelectorAll('li');
    const liWidth = cloneIncludedLis[0].clientWidth;
    const sliderWidth = liWidth * cloneIncludedLis.length;
    sliderInnerWrap.style.width = liWidth + 'px';
    slider.style.width = sliderWidth + 'px';

    const INIT_POSITION = -liWidth;
    const INIT_INDEX = 1;
    let leftPosition = INIT_POSITION;
    let currentIndex = INIT_INDEX;
    let transitionDuration = option.transitionDuration;
    slider.style.transition = `all ${transitionDuration}ms ${option.transitionTiming}`;
    slider.style.left = -liWidth + 'px';

    function moveSlider(e) {
      slider.style.transition = `all ${transitionDuration}ms ${option.transitionTiming}`;
      preventOverClicks(e.target);
      if (e.target.className === 'next') {
        moveSliderLeft(-1);
      }
      if (e.target.className === 'prev') {
        moveSliderLeft(1);
      }

      function moveSliderLeft(direction) {
        currentIndex += -1 * direction;
        leftPosition += liWidth * direction;
        slider.style.left = leftPosition + 'px';
      }

      function preventOverClicks(targetBtn) {
        targetBtn.setAttribute('disabled', true);
        setTimeout(() => targetBtn.removeAttribute('disabled'), transitionDuration);
      }
    }

    function resetSlider() {
      if (currentIndex === cloneIncludedLis.length - 1) {
        resetSliderManager(1);
      }
      if (currentIndex === 0) {
        resetSliderManager(cloneIncludedLis.length - 2);
      }

      function resetSliderManager(nextIndex) {
        currentIndex = nextIndex;
        leftPosition = -liWidth * nextIndex;
        console.log(leftPosition);
        slider.style.left = leftPosition + 'px';
        slider.style.transition = 'none';
      }
    }
  };
};
