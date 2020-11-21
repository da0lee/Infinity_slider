# Infinity Slider

## HTML

사용자가 어떤 이름으로 className을 설정하느냐에 상관 없이 Slider에 같은 값을 인자로 넘겨주기만 하면 사용이 가능하다.

```html
<ul class="slider">
  <li><img src="http://placehold.it/800x300.png?text=A" alt="" /></li>
  <li><img src="http://placehold.it/800x300.png?text=B" alt="" /></li>
  <li><img src="http://placehold.it/800x300.png?text=C" alt="" /></li>
</ul>
<script>
  Slider('.slider', { transitionDuration: 250, transitionTiming: 'ease-in-out' });
</script>
```

<br/>

## CSS

ul.slider를 position으로 띄워, 보여줄 화면을 left값으로 조정

```css
/* reset */
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
img {
  display: block;
}
/* slider */
button {
  width: 35px;
  height: 35px;
  background-color: transparent;
  border-radius: 50%;
  border: 1px solid black;
  font-size: 17px;
  color: black;
}
button:disabled {
  background: transparent;
  color: black;
}
.slider_innerWrap {
  overflow: hidden;
  border: 2px solid black;
  height: 300px;
  position: relative;
}
.slider_innerWrap .slider {
  position: absolute;
}
.slider_innerWrap .slider > li {
  float: left;
}
.slider_wrap {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
}
.slider_wrap .slider_btn .prev {
  position: absolute;
  left: -50px;
  top: 100px;
}
.slider_wrap .slider_btn .next {
  position: absolute;
  right: -50px;
  top: 100px;
}
```

<br/>

## Java Script

<br/>

### 핵심 아이디어

1. 사용자가 A에 도착하여 prev 버튼을 누르면 실제 C로 이동하는 것이 아니라 clone하여 A 이전에 붙혀놓은 C로 이동한다. (C -> A의 경우도 마찬가지) (A-B-C => C-A-B-C-A )
2. Transitionend를 통해 transiton이 끝나는 순간 cloned A,C가 아닌 실제 A,C로 이동하도록 이벤트를 건다.
3. 실제 A,C로 이동할 때는 사용자가 cloned A,C => 실제 A,C로 이동된 것을 눈치 채지 못하도록 animation을 끈다.

<br/>

### window.onload = fucntion() {}

<br/>

https://webdir.tistory.com/515
https://webclub.tistory.com/630

문서의 모든 콘텐츠(images, script, css, etc)가 로드된 후 발생하는 event

- 문서에 포함된 모든 콘텐츠가 로드된 후에 실행되기에 불필요한 로딩시간이 추가될 수 있다.
- 동일한 문서에 오직 onload는 하나만 존재해야 하며, 중복될 경우 마지막 선언이 실행된다.
- 외부 라이브러리에서 이미 선언된 경우 이를 찾아 하나로 합치는 과정이 필요하다.

<br/>

## clonedNode

- var dupNode = node.cloneNode(deep);
- deep (Optional) : 해당 node의 children 까지 복제하려면 true, 해당 node 만 복제하려면 false

<br/>

### [[Environment]]

<br/>

https://ko.javascript.info/closure  
https://velog.io/@surim014/JavaScript-Closure%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80

모든 함수는 함수가 생성된 곳의 렉시컬 환경을 기억한다. 함수는 [[Environment]]라 불리는 숨김 프로퍼티를 갖는데, 여기에 함수가 만들어진 곳의 렉시컬 환경에 대한 참조가 저장된다.

호출 장소와 상관없이 함수가 자신이 태어난 곳을 기억할 수 있는 건 바로 [[Environment]] 프로퍼티 덕분이다. [[Environment]]는 함수가 생성될 때 딱 한 번 그 값이 세팅되고, 이 값은 영원히 변하지 않는다.

아래 moveSlider()를 호출하면 각 호출마다 새로운 렉시컬 환경이 만들어진다. 그리고 이 렉시컬 환경은 moveSlider.[[Environment]]에 저장된 렉시컬 환경을 외부 렉시컬 환경으로서 참조하게 된다.

변숫값 갱신은 변수가 저장된 렉시컬 환경에서 이뤄진다. 따라서 moveSlider()를 여러 번 호출하면 외부의 변수가 2, 3으로 계속 증가하게 된다.

```js
const Slider = function (selectedTarget, option) {
  // window.onload
  // 개발자 도구의 network에서 살펴보면, html는 읽혔지만 (script가 포함된)아직 image가 읽혀지기 전이기 때문에 width가 0이 찍혔다. 이 때 image를 await하거나 window.onload를 해주면 image의 clientWidth를 얻을 수 있다.

  // 비동기 문제 콜백지옥으로 해결. Promise, async/await로도 가능
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
    // 사용자가 Slider 호출하면 slider 동작에 필요한 node들 생성
    const slider = document.querySelector(selectedTarget);
    const slideLis = slider.querySelectorAll('li');
    // wrapper 생성
    const sliderInnerWrap = document.createElement('div');
    const sliderWrap = document.createElement('div');
    slider.parentNode.insertBefore(sliderWrap, slider);
    // 사용자가 어떤 className을 설정하고 넘겨줘도 모두 동작할 수 있도록 classList에 내부적으로 통용할 className 추가.
    slider.classList.add('slider');
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

    // 맨 마지막 -> 첫번째 / 첫번째 -> 맨 마지막장으로 돌아가는 동안 눈속임 할 clonedLi
    const clonedFirstLi = slideLis[0].cloneNode(true);
    const clonedLastLi = slideLis[slideLis.length - 1].cloneNode(true);
    slider.prepend(clonedLastLi);
    slider.appendChild(clonedFirstLi);
    const cloneIncludedLis = slider.querySelectorAll('li');
    const liWidth = cloneIncludedLis[0].clientWidth;
    const sliderWidth = liWidth * cloneIncludedLis.length;
    sliderInnerWrap.style.width = liWidth + 'px';
    slider.style.width = sliderWidth + 'px';

    // Call Stack
    // 0. Global Execution context에 window.onload = function() {}, addeventListener. addeventListener은 1번이 아닌 0번에 존재한다. sliderArrows가 DOM이기 때문에. 마찬가지로 click event에 대한 call back함수인 moveslider도 0번에 적재되어있다.
    // 1. window.onload라는 scope 안에 querySelector로 찾은 DOM들, 2번의 moveSlider scope에서 이용하는 변수 leftPosition, currentIndex 선언
    // 2. 1번의 callback 함수인 moveSlider(). moveslide()는 0번 stack window의 addeventListener를 통해 탑재된 callback함수이므로 0번 stack에 적재되어있으나, 실행하면 2번 stack이 쌓이게 된다.

    // moveSlider()는 자신이 선언됐을 때의 환경 Scope를 기억하고 접근할 수 있다. (본인이 기억하고 있는 주변 상황에 대한 정보를 지속적으로 감지.)
    // 그렇기에 moveSlider() 외부에 leftPosition, currentIndex를 선언 한 후 moveSlider() 함수 내부에서 변수 값을 변경하는 로직을 짜면, click을 할 때마다 moveSlider()가 실행되며 leftPosition, currentIndex의 값이 바뀌게 된다. moveslide()에서 사용해야하기 때문에 currentIndex,leftPosition는 없어지지 않고 살아있기 때문이다. (Closer 이용)
    // 함수가 실행되어 일을 처리하고, 종료되면 그 안에서 참조하던 값들도 사라지기 때문에 moveSlider() 안쪽에 변수를 선언하게 되면, 함수 종료 후 leftPosition, currentIndex를 찾을 수 없다. 따라서 변경도 불가하다.

    // 실제 동작
    const INIT_POSITION = -liWidth;
    const INIT_INDEX = 1;
    let leftPosition = INIT_POSITION;
    let currentIndex = INIT_INDEX;
    let transitionDuration = option.transitionDuration;
    let transitionTiming = option.transitionTiming;
    slider.style.transition = `all ${transitionDuration}ms ${transitionTiming}`;
    // 맨 첫장의 left Position값
    slider.style.left = -liWidth + 'px';

    function moveSlider(e) {
      slider.style.transition = `all ${transitionDuration}ms ${transitionTiming}`;
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
```
