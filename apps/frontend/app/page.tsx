'use client';

import { useQuery } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type HealthResponse = {
  status: string;
  timestamp: string;
};

type FormValues = {
  scenarioType: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error('Failed to fetch backend health');
  }
  return (await response.json()) as HealthResponse;
}

export default function Home() {
  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: { scenarioType: 'happy_path' },
  });
  const scenarioType = useWatch({
    control,
    name: 'scenarioType',
    defaultValue: 'happy_path',
  });

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    enabled: false,
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Signal Lab Platform Foundation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-3"
            onSubmit={handleSubmit(() => healthQuery.refetch())}
          >
            <label className="block text-sm font-medium text-slate-700">
              Scenario type
            </label>
            <Input
              placeholder="happy_path"
              {...register('scenarioType', { required: true })}
            />
            <Button type="submit">Check backend health</Button>
          </form>

          <p className="text-sm text-slate-600">
            Current input: <span className="font-semibold">{scenarioType}</span>
          </p>

          {healthQuery.isFetching && (
            <p className="text-sm text-slate-600">Loading health status...</p>
          )}
          {healthQuery.isError && (
            <p className="text-sm text-red-600">
              {(healthQuery.error as Error).message}
            </p>
          )}
          {healthQuery.data && (
            <p className="text-sm text-green-700">
              Backend is {healthQuery.data.status} at {healthQuery.data.timestamp}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
