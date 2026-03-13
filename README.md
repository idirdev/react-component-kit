# react-component-kit

![TypeScript](https://img.shields.io/badge/TypeScript-3.7+-blue.svg)
![React](https://img.shields.io/badge/React-16.8+-61dafb.svg)
![styled-components](https://img.shields.io/badge/styled--components-4.4+-db7093.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A reusable React component library built with TypeScript and styled-components. Designed for rapid UI development with consistent design tokens, accessible markup, and flexible APIs.

---

## Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Button** | Versatile button element | Variants (primary/secondary/danger/ghost), sizes, loading spinner, icon slots, fullWidth |
| **Input** | Text input with label | Label, error/helper text, prefix/suffix icons, clearable, password visibility toggle |
| **Modal** | Dialog overlay via portal | Backdrop click close, Escape key close, sizes, header/body/footer, scroll lock |
| **Dropdown** | Select / multi-select | Searchable, option groups, multi-select, keyboard navigation, custom option renderer |
| **Toast** | Notification banner | Types (success/error/warning/info), auto-dismiss, progress bar, slide animation |
| **ToastProvider** | Toast context manager | `useToast` hook, max visible toasts, configurable position |
| **Tabs** | Tabbed navigation | Controlled/uncontrolled, horizontal/vertical, disabled tabs, icons, keyboard nav |
| **Avatar** | User avatar | Image with fallback initials, sizes, status indicator, AvatarGroup |
| **Skeleton** | Loading placeholder | Variants (text/circle/rect), shimmer animation, multi-line text mode |

## Hooks

| Hook | Description |
|------|-------------|
| `useClickOutside` | Detects clicks outside a referenced element |
| `useKeyboard` | Listens for keyboard events with modifier key support |
| `useMediaQuery` | Tracks a CSS media query match state |

---

## Installation

```bash
npm install react-component-kit
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react@^16.8.0 react-dom@^16.8.0 styled-components@^4.4.0
```

---

## Usage

### Button

```tsx
import { Button } from 'react-component-kit';

function App() {
  return (
    <>
      <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
        Save Changes
      </Button>

      <Button variant="danger" loading>
        Deleting...
      </Button>

      <Button variant="ghost" iconLeft={<span>+</span>}>
        Add Item
      </Button>
    </>
  );
}
```

### Input

```tsx
import { Input } from 'react-component-kit';

function LoginForm() {
  const [email, setEmail] = React.useState('');

  return (
    <Input
      label="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
      clearable
      onClear={() => setEmail('')}
      error={email && !email.includes('@') ? 'Invalid email address' : undefined}
      helperText="We will never share your email."
    />
  );
}
```

### Modal

```tsx
import { Modal, Button } from 'react-component-kit';

function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>Are you sure you want to proceed with this action?</p>
      </Modal>
    </>
  );
}
```

### Toast

```tsx
import { ToastProvider, useToast, Button } from 'react-component-kit';

function Notifications() {
  const toast = useToast();

  return (
    <div>
      <Button onClick={() => toast.success('File saved successfully!')}>Success</Button>
      <Button onClick={() => toast.error('Something went wrong.')}>Error</Button>
      <Button onClick={() => toast.warning('Disk space running low.')}>Warning</Button>
      <Button onClick={() => toast.info('New update available.')}>Info</Button>
    </div>
  );
}

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={3}>
      <Notifications />
    </ToastProvider>
  );
}
```

### Dropdown

```tsx
import { Dropdown } from 'react-component-kit';

const options = [
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'vue', label: 'Vue', group: 'Frontend' },
  { value: 'node', label: 'Node.js', group: 'Backend' },
  { value: 'django', label: 'Django', group: 'Backend' },
];

function App() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Dropdown
      options={options}
      value={selected}
      onChange={(val) => setSelected(val as string[])}
      searchable
      multiple
      placeholder="Pick technologies..."
    />
  );
}
```

### Tabs

```tsx
import { Tabs } from 'react-component-kit';

const tabs = [
  { key: 'overview', label: 'Overview', content: <p>Overview content here.</p> },
  { key: 'settings', label: 'Settings', content: <p>Settings panel.</p> },
  { key: 'billing', label: 'Billing', content: <p>Billing info.</p>, disabled: true },
];

function App() {
  return <Tabs tabs={tabs} defaultActiveKey="overview" />;
}
```

### Avatar

```tsx
import { Avatar, AvatarGroup } from 'react-component-kit';

function App() {
  return (
    <>
      <Avatar src="/photo.jpg" name="Jane Doe" size="lg" status="online" />
      <Avatar name="John Smith" size="md" />

      <AvatarGroup max={3}>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
      </AvatarGroup>
    </>
  );
}
```

### Skeleton

```tsx
import { Skeleton } from 'react-component-kit';

function LoadingCard() {
  return (
    <div>
      <Skeleton variant="circle" width={48} height={48} />
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="rect" height={200} />
    </div>
  );
}
```

---

## Theme Customization

The library exports a default theme object with design tokens:

```tsx
import { theme } from 'react-component-kit';

// theme.colors.primary    -> '#3B82F6'
// theme.spacing.md        -> '16px'
// theme.typography.fontFamily -> system font stack
// theme.shadows.lg        -> box-shadow value
// theme.radii.md          -> '6px'
```

You can use these tokens with styled-components `ThemeProvider`:

```tsx
import { ThemeProvider } from 'styled-components';
import { theme } from 'react-component-kit';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#8B5CF6',  // Override primary to purple
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

---

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode
npm run watch

# Run tests
npm test
```

---

## License

MIT

---

## 🇫🇷 Documentation en français

### Description
react-component-kit est une bibliothèque de composants React réutilisables, construite avec TypeScript et styled-components. Elle est conçue pour accélérer le développement d'interfaces utilisateur grâce à des composants accessibles, composables et hautement personnalisables (Button, Input, Modal, Dropdown, Toast, Tabs, Avatar, Skeleton, etc.).

### Installation
```bash
npm install react-component-kit
```

**Dépendances pair requises :**
```bash
npm install react@^16.8.0 react-dom@^16.8.0 styled-components@^4.4.0
```

### Utilisation
```tsx
import { Button, Input, Modal } from 'react-component-kit';
```

Importez les composants souhaités et intégrez-les dans votre application React. Consultez la documentation anglaise ci-dessus pour les exemples complets de chaque composant et les options de personnalisation du thème.

