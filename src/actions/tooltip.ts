import { get, type Writable } from 'svelte/store';

export function tooltip(node: HTMLElement, { tooltipText, position = 'top' }: { tooltipText: Writable<string>, position?: 'top' | 'bottom' | 'left' | 'right' }) {
    if (tooltipText === undefined) return;
    let tooltipElem: HTMLElement | null = null;

    const updateTooltip = () => {
        if (tooltipElem) {
            tooltipElem.textContent = get(tooltipText) ?? null;
        }
    };

    let unsubscribe = tooltipText.subscribe(updateTooltip);

    function mouseenter() {
        const { top, left, width, height } = node.getBoundingClientRect();
        tooltipElem = document.createElement('div');
        tooltipElem.setAttribute('aria-live', 'polite');
        tooltipElem.setAttribute('aria-atomic', 'true');
        tooltipElem.className = 'fixed bg-gray-800 shadow-sm text-xs font-medium text-white px-2 py-1 rounded text-white z-10';

        // Calculate position based on the 'position' parameter
        switch (position) {
            case 'top':
                tooltipElem.style.top = `${top - 10}px`;
                tooltipElem.style.left = `${left + width / 2}px`;
                tooltipElem.classList.add('-translate-y-full', '-translate-x-1/2');
                break;
            case 'bottom':
                tooltipElem.style.top = `${top + height + 10}px`;
                tooltipElem.style.left = `${left + width / 2}px`;
                tooltipElem.classList.add('translate-y-0', '-translate-x-1/2');
                break;
            case 'left':
                tooltipElem.style.top = `${top + height / 2}px`;
                tooltipElem.style.left = `${left - 10}px`;
                tooltipElem.classList.add('-translate-y-1/2', '-translate-x-full');
                break;
            case 'right':
                tooltipElem.style.top = `${top + height / 2}px`;
                tooltipElem.style.left = `${left + width + 10}px`;
                tooltipElem.classList.add('-translate-y-1/2', '-translate-x-0');
                break;
            default:
                tooltipElem.style.top = `${top - 10}px`;
                tooltipElem.style.left = `${left + width / 2}px`;
        }

        tooltipElem.textContent = get(tooltipText) ?? null;
        document.body.appendChild(tooltipElem);
    }

    function mouseleave() {
        if (tooltipElem) {
            document.body.removeChild(tooltipElem);
            tooltipElem = null;
        }
    }

    node.addEventListener('mouseenter', mouseenter);
    node.addEventListener('mouseleave', mouseleave);

    return {
        destroy() {
            node.removeEventListener('mouseover', mouseenter);
            node.removeEventListener('mouseout', mouseleave);
            if (tooltipElem) {
                document.body.removeChild(tooltipElem);
            }
            unsubscribe();
        }
    };
}
