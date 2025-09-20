"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PortfolioRunResponse, RunPortfolioPayload, uploadFiles, runPortfolio } from "../api";

export function usePortfolioData() {
  const [batchId, setBatchId] = useState<string | null>(null);
  const [uploadSummary, setUploadSummary] = useState<PortfolioRunResponse | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      setBatchId(data.batchId);
    },
  });

  const runMutation = useMutation({
    mutationFn: (payload: RunPortfolioPayload) => runPortfolio(payload),
    onSuccess: (data) => {
      setUploadSummary(data);
    },
  });

  return {
    batchId,
    uploadSummary,
    upload: uploadMutation.mutateAsync,
    run: runMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isRunning: runMutation.isPending,
  };
}
