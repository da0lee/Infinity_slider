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
