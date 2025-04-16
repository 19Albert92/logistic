/*
   This is the typical debouncer function that receives
   the "callback" and the time it will wait to emit the event
 */
function debouncer(fn, delay) {
    let timeoutID = null
    return function () {
        clearTimeout(timeoutID)
        const args = arguments
        const that = this
        timeoutID = setTimeout(function () {
            fn.apply(that, args)
        }, delay)
    }
}

export default function debounce(el, binding) {
    if(binding.value !== binding.oldValue) {
        el.oninput = debouncer(() => el.dispatchEvent(new Event('change')), parseInt(binding.value) || 500)
    }
}
