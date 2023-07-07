import { get, type Writable } from 'svelte/store';

export function tooltip(node: HTMLElement, tooltipTextStore: Writable<string>) {
    if (tooltipTextStore === undefined) return;
    let tooltipElem: HTMLElement | null = null;

    const updateTooltip = () => {
        if (tooltipElem) {
            tooltipElem.textContent = get(tooltipTextStore) ?? null;
        }
    };

    let unsubscribe = tooltipTextStore.subscribe(updateTooltip);

    function mouseenter() {
        const { top, left, width } = node.getBoundingClientRect();
        tooltipElem = document.createElement('div');
        tooltipElem.className = 'fixed -translate-y-full -translate-x-1/2 bg-gray-800 shadow text-xs text-white  px-2 py-1 rounded';
        tooltipElem.style.top = `${top - 10}px`;
        tooltipElem.style.left = `${left + width / 2}px`;
        tooltipElem.textContent = get(tooltipTextStore) ?? null;
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
        },
    };
}
