import Papa from "papaparse";

type WorkerMessage = {
  file: File;
};

type WorkerResponse =
  | { type: "progress"; data: { progress: number } }
  | { type: "result"; data: { rows: Array<Record<string, unknown>> } }
  | { type: "error"; data: { message: string } };

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { file } = event.data;
  if (!file) {
    ctx.postMessage({ type: "error", data: { message: "No file received" } } satisfies WorkerResponse);
    return;
  }

  Papa.parse<Record<string, unknown>>(file, {
    worker: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    chunk: (chunk) => {
      const progress = Math.min(1, (chunk.meta.cursor ?? 0) / file.size);
      ctx.postMessage({ type: "progress", data: { progress } } satisfies WorkerResponse);
    },
    complete: (results) => {
      ctx.postMessage({ type: "result", data: { rows: results.data } } satisfies WorkerResponse);
    },
    error: (error) => {
      ctx.postMessage({ type: "error", data: { message: error.message } } satisfies WorkerResponse);
    },
  });
};
