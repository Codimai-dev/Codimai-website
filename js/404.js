// Fun Easter Egg: Type "codimai" to trigger surprise
let typed = '';
document.addEventListener('keydown', (e) => {
  typed += e.key.toLowerCase();
  if (typed.includes('codimai')) {
    document.body.style.animation = 'rainbow 3s infinite';
    setTimeout(() => {
      alert('You found the secret! Welcome to the CodimAI family');
      document.body.style.animation = '';
    }, 1000);
    typed = '';
  }
  if (typed.length > 10) typed = typed.slice(-10);
});