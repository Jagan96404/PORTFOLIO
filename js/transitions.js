/* ==========================================================================
   ROUTE TRANSITIONS & NAVIGATION MANAGER
   ========================================================================== */

class Router {
  constructor() {
    this.currentRoute = 'hero';
    this.overlay = document.getElementById('transition-overlay');
    this.pages = {
      'hero': document.getElementById('hero-page'),
      'projects': document.getElementById('projects-page'),
      'skills': document.getElementById('skills-page'),
      'contact': document.getElementById('contact-page')
    };
    this.isTransitioning = false;
  }

  navigateTo(targetRoute) {
    if (targetRoute === this.currentRoute || this.isTransitioning) return;
    this.isTransitioning = true;

    if (window.soundEngine) {
      window.soundEngine.playTransition();
    }

    // Determine transition style based on route pair
    let transitionStyle = 'wipe';
    if (this.currentRoute === 'hero' && targetRoute === 'projects') transitionStyle = 'wipe';
    else if (this.currentRoute === 'projects' && targetRoute === 'skills') transitionStyle = 'fold';
    else if (this.currentRoute === 'skills' && targetRoute === 'contact') transitionStyle = 'zoom';
    else transitionStyle = 'wipe';

    // Trigger overlay animation
    if (this.overlay) {
      this.overlay.className = ''; // Reset classes
      this.overlay.classList.add(`${transitionStyle}-active`);
    }

    setTimeout(() => {
      // Switch active page
      Object.keys(this.pages).forEach(key => {
        if (this.pages[key]) {
          this.pages[key].classList.remove('active');
        }
      });

      if (this.pages[targetRoute]) {
        this.pages[targetRoute].classList.add('active');
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      }

      // Update Nav Buttons
      document.querySelectorAll('.nav-item button').forEach(btn => {
        if (btn.dataset.target === targetRoute) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      // Update Custom Cursor Reticle State
      if (window.customCursor) {
        if (targetRoute === 'hero') window.customCursor.setMode('ring');
        else if (targetRoute === 'projects') window.customCursor.setMode('crosshair');
        else if (targetRoute === 'skills') window.customCursor.setMode('laser');
        else if (targetRoute === 'contact') window.customCursor.setMode('terminal-mode');
      }

      this.currentRoute = targetRoute;
    }, 450);

    setTimeout(() => {
      if (this.overlay) this.overlay.className = '';
      this.isTransitioning = false;
    }, 900);
  }
}

window.appRouter = new Router();
