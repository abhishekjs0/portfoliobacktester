declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
  type Element = any;
  interface ElementClass {
    render?: any;
  }
  interface ElementAttributesProperty {
    props: any;
  }
  interface ElementChildrenAttribute {
    children: {};
  }
}

declare module "react" {
  export type ReactNode = any;
  export type Key = string | number;
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactNode;
  }
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type HTMLAttributes<T = any> = Record<string, any>;
  export type DetailedHTMLProps<P, T> = P & { ref?: any };
  export type ButtonHTMLAttributes<T = any> = Record<string, any>;
  export type ComponentType<P = any> = any;
  export type ReactElement = any;
  export type ChangeEvent<T = any> = any;
  export type DragEvent<T = any> = any;
  export type FormEvent<T = any> = any;
  export type SyntheticEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type MouseEventHandler<T = any> = (...args: any[]) => any;
  export type ChangeEventHandler<T = any> = (...args: any[]) => any;
  export type DragEventHandler<T = any> = (...args: any[]) => any;
  export type RefObject<T = any> = { current: T | null };
  export function createElement(...args: any[]): any;
  export function useState<S = any>(
    initialState?: S | (() => S),
  ): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  export function useContext<T = any>(context: any): T;
  export function createContext<T = any>(defaultValue: T): any;
  export function forwardRef<T, P = any>(render: (props: P, ref: any) => any): any;
  export function cloneElement(element: any, props?: any, ...children: any[]): any;
  export function isValidElement(element: any): boolean;
  export function lazy(factory: () => Promise<{ default: any }>): any;
  export const StrictMode: any;
  export const Suspense: any;
  export const Fragment: any;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace React {
  type RefObject<T = any> = { current: T | null };
  type MouseEvent<T = any> = any;
}

declare module "react-dom" {
  const mod: any;
  export default mod;
  export const createPortal: any;
}

declare module "react-dom/client" {
  export function createRoot(container: any): { render(children: any): void };
}

declare module "react-router-dom" {
  export const Link: any;
  export const NavLink: any;
  export const useNavigate: any;
  export const useLocation: any;
  export const Outlet: any;
  export const RouterProvider: any;
  export const createBrowserRouter: any;
}

interface ImportMeta {
  env: Record<string, any>;
  glob: <T = any>(pattern: string) => Record<string, () => Promise<T>>;
}

declare module "@hookform/resolvers" {
  export const zodResolver: any;
}

declare module "@hookform/resolvers/zod" {
  export function zodResolver(...args: any[]): any;
}

declare module "react-hook-form" {
  export function useForm<T = any>(options?: any): any;
  export const Controller: any;
}

declare module "msw" {
  export const setupWorker: any;
  export const http: any;
  export const HttpResponse: any;
  export const delay: any;
}

declare module "msw/browser" {
  export const setupWorker: any;
}

declare module "msw/node" {
  export const setupServer: any;
}

declare namespace z {
  type infer<T> = any;
}

declare const z: {
  object: (shape: Record<string, any>) => any;
  string: () => { min: (...args: any[]) => any } & Record<string, any>;
  number: () => { min: (...args: any[]) => any; max: (...args: any[]) => any } & Record<string, any>;
  coerce: {
    number: () => { min: (...args: any[]) => any; max: (...args: any[]) => any } & Record<string, any>;
  };
  infer: <T>(schema: T) => any;
};

declare module "zod" {
  export { z };
  export default z;
}

declare module "@backtester/ui" {
  export const Button: any;
  export const Card: any;
  export const CSVUpload: any;
  export const MetricCard: any;
  export const Modal: any;
  export const SidebarNav: any;
  export type SidebarItem = any;
}

declare module "@backtester/ui/*" {
  const mod: any;
  export default mod;
}

declare module "*";
