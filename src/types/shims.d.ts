// Minimal module declarations for missing dependencies

declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const createContext: any;
  export const useContext: any;
  export const Fragment: any;
  export default React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom/client' {
  export function createRoot(container: any): { render(children: any): void };
}

declare module 'idb' {
  export const openDB: any;
}

declare module 'vite' {
  export const defineConfig: any;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}
