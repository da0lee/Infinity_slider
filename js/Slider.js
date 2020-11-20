const Slider = function () {
  const sliderInnerWrap = document.querySelector('.slider-innerWrap');
  const slider = sliderInnerWrap.querySelector('.slider');
  const slideLis = slider.querySelectorAll('li');
  const sliderBtn = document.querySelector('.slider_wrap .slider_btn');
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
  let transitionDuration = 300;
  slider.style.transition = `all ${transitionDuration}ms ease`;
  slider.style.left = leftPosition + 'px';

  function moveSlider(e) {
    slider.style.transition = `all ${transitionDuration}ms ease`;
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

    function preventOverClicks(target) {
      target.setAttribute('disabled', true);
      setTimeout(() => target.removeAttribute('disabled'), transitionDuration);
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
