'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ScenarioType = 'success' | 'validation_error' | 'system_error' | 'slow_request';

type RunScenarioRequest = {
  type: ScenarioType;
  name?: string;
};

type ScenarioRun = {
  id: string;
  type: ScenarioType;
  status: string;
  duration: number | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

type ToastState = {
  kind: 'success' | 'error';
  message: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function runScenario(payload: RunScenarioRequest): Promise<ScenarioRun> {
  const response = await fetch(`${API_BASE_URL}/api/scenarios/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string | string[] };
    const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(message ?? 'Failed to run scenario');
  }

  return (await response.json()) as ScenarioRun;
}

async function fetchScenarioRuns(): Promise<ScenarioRun[]> {
  const response = await fetch(`${API_BASE_URL}/api/scenarios/runs`);
  if (!response.ok) {
    throw new Error('Failed to load scenario run history');
  }
  return (await response.json()) as ScenarioRun[];
}

function getStatusBadgeClass(status: string): string {
  if (status === 'success') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'validation_error') {
    return 'bg-amber-100 text-amber-800';
  }
  return 'bg-red-100 text-red-800';
}

export default function Home() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastState | null>(null);
  const { register, handleSubmit, reset } = useForm<RunScenarioRequest>({
    defaultValues: { type: 'success', name: '' },
  });

  const historyQuery = useQuery({
    queryKey: ['scenario-runs'],
    queryFn: fetchScenarioRuns,
  });

  const runMutation = useMutation({
    mutationFn: runScenario,
    onSuccess: (data) => {
      setToast({
        kind: 'success',
        message: `Scenario "${data.type}" completed in ${data.duration ?? 0}ms`,
      });
      reset({ type: 'success', name: '' });
      void queryClient.invalidateQueries({ queryKey: ['scenario-runs'] });
    },
    onError: (error) => {
      setToast({
        kind: 'error',
        message: (error as Error).message,
      });
      void queryClient.invalidateQueries({ queryKey: ['scenario-runs'] });
    },
  });

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 p-6">
      <Card className="w-full self-start">
        <CardHeader>
          <CardTitle>Scenario Runner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-3"
            onSubmit={handleSubmit((values) => runMutation.mutate(values))}
          >
            <label className="block text-sm font-medium text-slate-700">Scenario type</label>
            <select
              className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('type', { required: true })}
            >
              <option value="success">success</option>
              <option value="validation_error">validation_error</option>
              <option value="system_error">system_error</option>
              <option value="slow_request">slow_request</option>
            </select>

            <label className="block text-sm font-medium text-slate-700">Name</label>
            <Input placeholder="Optional name" {...register('name')} />
            <Button type="submit" disabled={runMutation.isPending}>
              {runMutation.isPending ? 'Running...' : 'Run Scenario'}
            </Button>
          </form>

          {toast && (
            <p
              className={
                toast.kind === 'success'
                  ? 'rounded-md bg-emerald-100 p-2 text-sm text-emerald-800'
                  : 'rounded-md bg-red-100 p-2 text-sm text-red-800'
              }
            >
              {toast.message}
            </p>
          )}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Run History</h2>
            {historyQuery.isLoading && (
              <p className="text-sm text-slate-600">Loading recent runs...</p>
            )}
            {historyQuery.isError && (
              <p className="text-sm text-red-600">
                {(historyQuery.error as Error).message}
              </p>
            )}
            {historyQuery.data && historyQuery.data.length === 0 && (
              <p className="text-sm text-slate-600">No runs yet.</p>
            )}
            {historyQuery.data && historyQuery.data.length > 0 && (
              <ul className="space-y-2">
                {historyQuery.data.map((run) => (
                  <li
                    key={run.id}
                    className="rounded-md border border-slate-200 bg-white p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900">{run.type}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClass(run.status)}`}
                      >
                        {run.status}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Duration: {run.duration ?? 0}ms |{' '}
                      {new Date(run.createdAt).toLocaleString()}
                    </p>
                    {run.error && <p className="text-red-600">Error: {run.error}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
