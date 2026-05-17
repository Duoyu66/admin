/** 主题切换时冻结过渡与毛玻璃，避免快速切换残影 */

let unlockRaf = 0;

export function withInstantThemeSwitch(apply: () => void) {
  const root = document.documentElement;
  root.classList.add('theme-instant');

  if (unlockRaf) {
    cancelAnimationFrame(unlockRaf);
  }

  apply();

  unlockRaf = requestAnimationFrame(() => {
    unlockRaf = requestAnimationFrame(() => {
      root.classList.remove('theme-instant');
      unlockRaf = 0;
    });
  });
}
