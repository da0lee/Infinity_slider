## 핵심 아이디어

- 맨 마지막 -> 첫번째 / 첫번째 -> 맨 마지막 장으로 돌아갈 때, 실제로 맨 첫번째, 맨 마지막으로 이동하는 것이 아니라 Clone 하여 양 끝에 붙혀놓은 clonedLi로 이동하여 눈속임한다. (A-B-C => C-A-B-C-A )

1. 사용자가 A에 도착하여 prev 버튼을 누르면 실제 C로 이동하는 것이 아니라 clone하여 A 이전에 붙혀놓은 C로 이동한다. (C -> A의 경우도 마찬가지)
2. Transitionend를 통해 transiton이 끝나는 순간 cloned A,C가 아닌 실제 A,C로 이동하도록 이벤트를 건다.
3. 실제 A,C로 이동할 때는 사용자가 cloned A,C => 실제 A,C로 이동된 것을 눈치 채지 못하도록 animation을 끈다.

<br/>

## clonedNode

- var dupNode = node.cloneNode(deep);
- deep (Optional) : 해당 node의 children 까지 복제하려면 true, 해당 node 만 복제하려면 false

```js
const sliderWrap = document.querySelector('.slider_wrap');
const sliderUl = sliderWrap.querySelector('ul');
const slideLis = sliderUl.querySelectorAll('li');
const sliderBtn = sliderWrap.querySelector('.slider_wrap .slider_btn');
sliderBtn.addEventListener('click', moveSlider);
sliderUl.addEventListener('transitionend', resetSlider);

// 실제 동작
const INIT_POSITION = -liWidth;
const INIT_INDEX = 1;
let leftPosition = INIT_POSITION;
let currentIndex = INIT_INDEX;
let transitionDuration = 300;
sliderUl.style.transition = `all ${transitionDuration}ms ease`;
sliderUl.style.left = leftPosition + 'px';

function moveSlider(e) {
  sliderUl.style.transition = `all ${transitionDuration}ms ease`;
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
    sliderUl.style.left = leftPosition + 'px';
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
    sliderUl.style.transition = 'none';
    sliderUl.style.left = leftPosition + 'px';
  }
}
```
