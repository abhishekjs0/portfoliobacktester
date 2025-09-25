import Papa from "papaparse";

type WorkerMessage = {
  file: File;
};

type WorkerResponse =
  | { type: "progress"; data: { progress: number } }
  | { type: "result"; data: { rows: Array<Record<string, unknown>> } }
  | { type: "error"; data: { message: string } };

type ChunkResult = {
  data: Record<string, unknown>[];
  errors: Array<{ type: string; code: string; message: string; row: number }>;
  meta: {
    cursor: number;
    row: number;
  };
};

const ctx = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { file } = event.data;
  if (!file) {
    ctx.postMessage({ type: "error", data: { message: "No file received" } } satisfies WorkerResponse);
    return;
  }

  Papa.parse(file, {
    worker: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    chunk: (chunk: ChunkResult) => {
      const progress = Math.min(1, (chunk.meta.cursor ?? 0) / file.size);
      ctx.postMessage({ type: "progress", data: { progress } } satisfies WorkerResponse);
    },
    complete: (results: { data: Record<string, unknown>[] }) => {
      ctx.postMessage({ type: "result", data: { rows: results.data } } satisfies WorkerResponse);
    },
    error: (error: { message: string }) => {
      ctx.postMessage({ type: "error", data: { message: error.message } } satisfies WorkerResponse);
    },
  });
};
