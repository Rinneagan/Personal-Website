// URL state management utilities for maintaining page/section state across refreshes
export interface PageState {
  section?: string;
  projectId?: string;
  tab?: string;
  modal?: string;
  scrollPosition?: number;
}

// Get current state from URL
export function getUrlState(): PageState {
  if (typeof window === 'undefined') return { 
    section: undefined,
    projectId: undefined,
    tab: undefined,
    modal: undefined,
    scrollPosition: 0
  };
  
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.slice(1);
  
  const state = {
    section: params.get('section') || undefined,
    projectId: params.get('project') || undefined,
    tab: params.get('tab') || undefined,
    modal: hash || undefined,
    scrollPosition: (params.get('scroll') ? Number(params.get('scroll')) : 0)
  };
  
  console.log('getUrlState - Current URL:', window.location.search);
  console.log('getUrlState - Parsed state:', state);
  
  return state;
}

// Update URL with new state
export function updateUrlState(updates: Partial<PageState>): void {
  if (typeof window === 'undefined') return;
  
  const currentState = getUrlState();
  const newState = { ...currentState, ...updates };
  
  const params = new URLSearchParams();
  
  if (newState.section) params.set('section', newState.section);
  if (newState.projectId) params.set('project', newState.projectId);
  if (newState.tab) params.set('tab', newState.tab);
  if (newState.scrollPosition !== undefined) params.set('scroll', newState.scrollPosition.toString());
  
  const queryString = params.toString();
  const hash = newState.modal ? `#${newState.modal}` : '';
  
  const newUrl = `${window.location.pathname}${queryString ? '?' + queryString : ''}${hash}`;
  
  window.history.pushState(newState, '', newUrl);
}

// Save scroll position before navigation
export function saveScrollPosition(): void {
  if (typeof window === 'undefined') return;
  
  const scrollY = window.scrollY;
  if (scrollY > 0) {
    updateUrlState({ scrollPosition: scrollY });
  }
}

// Restore scroll position after page load
export function restoreScrollPosition(): void {
  if (typeof window === 'undefined') return;
  
  const state = getUrlState();
  if (state.scrollPosition && state.scrollPosition > 0) {
    setTimeout(() => {
      window.scrollTo(0, state.scrollPosition!);
    }, 100);
  }
}

// Initialize state from URL on page load
export function initializeFromUrl(): PageState {
  if (typeof window === 'undefined') return {};
  
  const state = getUrlState();
  console.log('Initializing from URL state:', state);
  
  return state;
}
