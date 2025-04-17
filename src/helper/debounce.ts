function debouncer(fn: Function, delay: number) {
    let timeoutID: number | null = null
    return function (this: any, ...args: any[]) {
        if (timeoutID) clearTimeout(timeoutID)
        timeoutID = window.setTimeout(() => fn.apply(this, args), delay)
    }
}

export default {
    mounted(el: HTMLInputElement, binding: any) {
        if (binding.value !== binding.oldValue) {
            el.oninput = debouncer(() => el.dispatchEvent(new Event('change')), parseInt(binding.value) || 300)
        }
    },
    updated(el: HTMLInputElement, binding: any) {
        if (binding.value !== binding.oldValue) {
            el.oninput = debouncer(() => el.dispatchEvent(new Event('change')), parseInt(binding.value) || 300)
        }
    }
}
