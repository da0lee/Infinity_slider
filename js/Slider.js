const kindSlider = document.querySelector('.kind_slider');
const slider = document.querySelector('.slider');
const slideLis = slider.querySelectorAll('li');
const moveButton = document.querySelector('.kind_wrap .arrow');
slider.addEventListener('transitionend', resetSlider);
moveButton.addEventListener('click', moveSlider);

const clonedFirstLi = slideLis[0].cloneNode(true);
const clonedLastLi = slideLis[slideLis.length - 1].cloneNode(true);
// dom은 하위호환성을 지킨다. prepend는 dom이니까 x
// 그러나 보통 요새 바벨을 사용하므로 js는 최신문법 맘대로 사용 가능하다.
slider.prepend(clonedLastLi);
slider.appendChild(clonedFirstLi);

// clone 포함해 width 주기
const cloneIncludedLis = slider.querySelectorAll('li');
const imageWidth = document.querySelector('.slider >li >img').clientWidth;

const liWidth = imageWidth > 0 ? cloneIncludedLis[0].clientWidth : 0;

const sliderWidth = liWidth * cloneIncludedLis.length;
kindSlider.style.width = -liWidth + 'px';
slider.style.width = sliderWidth + 'px';

const INIT_DIST = -liWidth;
const INIT_NUM = 1;
let leftPosition = INIT_DIST;
let currentIndex = INIT_NUM;
let transitionDuration = 300;
slider.style.transition = `all ${transitionDuration}ms ease`;
slider.style.left = leftPosition + 'px';

function moveSlider(e) {
  e.preventDefault();
  slider.style.transition = `all ${transitionDuration}ms ease`;
  preventDuplicateClicks(e.target);
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

  function preventDuplicateClicks(target) {
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
    slider.style.transition = 'none';
    slider.style.left = leftPosition + 'px';
  }
}
