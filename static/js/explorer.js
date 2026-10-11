// Progressive enhancement: the complete conference list remains visible if JavaScript is disabled.
(function () {
  function setup(rootSelector, buttonAttribute, itemAttribute, defaultValue) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const buttons = Array.from(root.querySelectorAll('[' + buttonAttribute + ']'));
    const items = Array.from(root.querySelectorAll('[' + itemAttribute + ']'));
    function apply(value) {
      buttons.forEach(button => {
        const active = button.getAttribute(buttonAttribute) === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      items.forEach(item => {
        const visible = value === 'all' || item.getAttribute(itemAttribute) === value;
        item.hidden = !visible;
        if (visible) count++;
      });
      const empty = root.querySelector('.explorer-empty');
      if (empty) empty.hidden = count > 0;
    }
    buttons.forEach(button => button.addEventListener('click', () => apply(button.getAttribute(buttonAttribute))));
    apply(defaultValue);
  }
  function init() {
    setup('[data-conference-explorer]', 'data-conference-filter', 'data-conference-year', 'all');
    setup('[data-awards-explorer]', 'data-award-filter', 'data-award-category', 'grants');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
