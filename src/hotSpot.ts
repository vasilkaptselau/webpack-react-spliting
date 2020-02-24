function createHotSpot(): object {
  let counter: number = 0;
  let isDestroyed: boolean = false;

  const listener = (): number => counter++;
  console.log(listener);
  document.addEventListener('click', listener);
  return {
    destroy() {
      document.removeEventListener('click', listener);
      isDestroyed = true;
    },
    getClicks() {
      if (isDestroyed) {
        return 'HotSpot was destroyed';
      }
      return counter;
    }
  };
}
window['hotspot'] = createHotSpot();
