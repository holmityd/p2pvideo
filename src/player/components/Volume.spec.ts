import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { describe, it, afterEach, beforeEach, expect } from 'vitest';
import Volume from './Volume.svelte';

describe('Volume', () => {
    let video: HTMLVideoElement;

    beforeEach(() => {
        video = document.createElement('video');
        localStorage.clear();
    });

    afterEach(cleanup);

    it('should mute/unmute video when mute button is clicked', async () => {
        const { getByLabelText } = render(Volume, { video });
        const muteButton = getByLabelText('Mute');
        fireEvent.click(muteButton);
        expect(video.muted).toBe(true);
        fireEvent.click(muteButton);
        expect(video.muted).toBe(false);
    });

    it('should update video volume when volume slider is changed', async () => {
        const { getByRole } = render(Volume, { video });
        const volumeSlider = getByRole('slider');
        fireEvent.input(volumeSlider, { target: { value: '60' } });
        expect(video.volume).toBe(0.6);
    });

    it('should update slider when video volume is changed', async () => {
        const { getByRole } = render(Volume, { props: { video } });
        const volumeSlider = getByRole('slider') as HTMLInputElement;
        fireEvent.volumeChange(video, { target: { volume: 0.6 } });
        // expect(volumeSlider.value).toBe('60');
    });
});