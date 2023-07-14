import { get, type Writable } from 'svelte/store';

const gap = 10;

export function tooltip(node: HTMLElement, { tooltipText, position = 'top' }: { tooltipText: Writable<string>, position?: 'top' | 'bottom' | 'left' | 'right' }) {
    if (tooltipText === undefined) return;
    let tooltipElem: HTMLElement;

    function updateTooltip() {
        if (tooltipElem) {
            tooltipElem.textContent = get(tooltipText) ?? null;
            updatePosition();
        }
    };
    let unsubscribe = tooltipText.subscribe(updateTooltip);

    function updatePosition(): void {
        const { top, left, width, height } = node.getBoundingClientRect();
        const elmRect = tooltipElem.getBoundingClientRect();
        let x: number, y: number;
        switch (position) {
            case 'top':
                y = top - elmRect.height - gap;
                x = left + width / 2 - elmRect.width / 2;
                break;
            case 'bottom':
                y = top + height + gap;
                x = left + width / 2 - elmRect.width / 2;
                break;
            case 'left':
                y = top + height / 2 - elmRect.height / 2;
                x = left - elmRect.width - gap;
                break;
            case 'right':
                y = top + height / 2 - elmRect.height / 2;
                x = left + width + gap;
                break;
        }

        if (x + elmRect.width > document.body.offsetWidth - gap)
            x = document.body.offsetWidth - gap - elmRect.width;
        else if (x < gap)
            x = gap;
        if (y + elmRect.height > document.body.offsetHeight - gap)
            y = document.body.offsetHeight - gap - elmRect.height;
        else if (y < gap)
            y = gap;

        tooltipElem.style.top = `${y}px`;
        tooltipElem.style.left = `${x}px`;
    }

    function mouseenter() {
        tooltipElem = document.createElement('div');
        tooltipElem.setAttribute('aria-live', 'polite');
        tooltipElem.setAttribute('aria-atomic', 'true');
        tooltipElem.className = 'fixed bg-gray-800 shadow-sm text-xs font-medium text-white px-2 py-1 rounded text-white z-10';
        tooltipElem.textContent = get(tooltipText) ?? null;
        document.body.appendChild(tooltipElem);
        updatePosition();
    }

    function mouseleave() {
        if (tooltipElem)
            document.body.removeChild(tooltipElem);
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
