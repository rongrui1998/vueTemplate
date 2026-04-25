import type { ApiResponse } from '@/types/api'

import { appEnv } from '@/constants/env'
import { requestClient } from '@/utils/request'
import type { DemoRecord } from '../../../mock/demo'
import { demoRecords } from '../../../mock/demo'

export type { DemoRecord }

async function unwrapResponse<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request

  return response.data.data
}

export async function fetchDemoRecordsApi(): Promise<DemoRecord[]> {
  if (!appEnv.useMock) {
    return unwrapResponse(requestClient.get<ApiResponse<DemoRecord[]>>('/demo/records'))
  }

  return Promise.resolve(demoRecords)
}
