# react-component-kit

> **[EN]** Collection of production-ready React hooks, higher-order components and utility functions — no UI framework required.
> **[FR]** Collection de hooks React prêts pour la production, composants d'ordre supérieur et fonctions utilitaires — aucun framework UI requis.

---

## Features / Fonctionnalités

**[EN]**
- 10 battle-tested React hooks: useLocalStorage, useDebounce, useThrottle, useClickOutside, useMediaQuery, usePrevious, useToggle, useAsync, useInterval, useFetch
- 3 higher-order components: withErrorBoundary, withLoading, withAuth
- 8 utility functions: cn (classnames), formatDate, formatNumber, truncateText, generateId, deepClone, deepMerge, isEqual
- TypeScript-friendly — consistent return shapes and predictable APIs
- Zero UI dependencies — bring your own components
- Tree-shakeable — import only what you need

**[FR]**
- 10 hooks React éprouvés : useLocalStorage, useDebounce, useThrottle, useClickOutside, useMediaQuery, usePrevious, useToggle, useAsync, useInterval, useFetch
- 3 composants d'ordre supérieur : withErrorBoundary, withLoading, withAuth
- 8 fonctions utilitaires : cn (classnames), formatDate, formatNumber, truncateText, generateId, deepClone, deepMerge, isEqual
- Compatible TypeScript — formes de retour cohérentes et APIs prévisibles
- Aucune dépendance UI — apportez vos propres composants
- Tree-shakeable — importez uniquement ce dont vous avez besoin

---

## Installation

```bash
npm install @idirdev/react-component-kit
```

---

## API (Programmatic) / API (Programmation)

### Hooks

```jsx
const {
  useLocalStorage, useDebounce, useThrottle, useClickOutside,
  useMediaQuery, usePrevious, useToggle, useAsync, useInterval, useFetch
} = require('@idirdev/react-component-kit');

// Persist state to localStorage / Persister l'état dans localStorage
const [theme, setTheme] = useLocalStorage('theme', 'dark');

// Debounce a search input / Débouncer un champ de recherche
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 400);
useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);

// Throttle a scroll handler / Throttler un gestionnaire de défilement
const throttledHandler = useThrottle(handleScroll, 100);

// Detect clicks outside a dropdown / Détecter les clics en dehors d'un dropdown
const ref = useRef();
useClickOutside(ref, () => setOpen(false));

// Responsive breakpoints / Points de rupture responsifs
const isMobile = useMediaQuery('(max-width: 768px)');

// Toggle boolean state / Basculer un état booléen
const [isOpen, toggle, setOpen] = useToggle(false);

// Async operation with loading/error state / Opération async avec état loading/error
const { data, loading, error, execute } = useAsync(() => fetch('/api/users').then(r => r.json()));

// Poll every 5 seconds / Interroger toutes les 5 secondes
useInterval(() => { refetchData(); }, 5000);

// Fetch with built-in loading state / Fetch avec état loading intégré
const { data, loading, error } = useFetch('https://api.example.com/posts');
```

### Higher-Order Components / Composants d'ordre supérieur

```jsx
const { withErrorBoundary, withLoading, withAuth } = require('@idirdev/react-component-kit');

// Wrap with error boundary / Envelopper avec une limite d'erreur
const SafeChart = withErrorBoundary(Chart, { fallback: <p>Chart failed to load</p> });

// Show spinner while loading / Afficher un spinner pendant le chargement
const LoadingTable = withLoading(DataTable);
<LoadingTable isLoading={isFetching} data={rows} />

// Guard a route by auth / Protéger une route par auth
const AdminPage = withAuth(Dashboard, { redirect: '/login' });
```

### Utility functions / Fonctions utilitaires

```js
const { cn, formatDate, formatNumber, truncateText, generateId, deepClone, deepMerge, isEqual } = require('@idirdev/react-component-kit');

cn('btn', isActive && 'btn--active', size === 'lg' && 'btn--lg');
// 'btn btn--active btn--lg'

formatDate(new Date(), 'YYYY-MM-DD');   // '2026-03-16'
formatNumber(1234567.89, { locale: 'fr-FR' }); // '1 234 567,89'
truncateText('Long text here...', 20);  // 'Long text here...'
generateId();                           // 'k7x2m9p1'
isEqual({ a: 1 }, { a: 1 });           // true
```

---

## License

MIT — idirdev
