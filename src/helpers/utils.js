const setHeightScrollHorizontal = (container, elementHeight) => {
    const containerWidth = container.offsetWidth;
    const h = containerWidth - window.innerWidth + window.innerHeight;
    elementHeight.style.height = `${h}px`;
}

const setHeightScrollVertical = (container, elementHeight) => {
    const h = container.clientHeight;
    elementHeight.style.height = `${h}px`;
}

const triggerResize = () => {
    if (document.createEvent){
        let resizeEvent = window.document.createEvent('UIEvents');
        resizeEvent.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(resizeEvent);
    } else {
        window.dispatchEvent(new Event('resize'));
    }
}

const animateFrame = () => {
    let i = 0;
    const t = setInterval(() => {
        if (i < 6) {
            triggerResize();
            i = i + 1;
        } else {
            clearInterval(t);
        }
    }, 1000);

    let lastTime = 0, id = null;
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
};

const elementInViewport = (el) => {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0
        && rect.left >= 0
        && rect.top <= (
        window.innerHeight || document.documentElement.clientHeight
        )
    );
}

export {
    setHeightScrollHorizontal,
    setHeightScrollVertical,
    animateFrame,
    elementInViewport
}
