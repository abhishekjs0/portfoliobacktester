declare module 'worker-globals' {
  type DedicatedWorkerGlobalScope = Worker & {
    postMessage(message: any, transfer?: Transferable[]): void;
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    onerror: ((this: Worker, ev: ErrorEvent) => any) | null;
  };

  const self: DedicatedWorkerGlobalScope;
}