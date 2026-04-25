import type { ApiResponse } from '@/types/api'

import { appEnv } from '@/constants/env'
import { requestClient } from '@/utils/request'

import { demoRecords, type DemoRecord } from '../../../../mock/demo'
import { fetchDemoRecordsApi } from '../index'

vi.mock('@/constants/env', () => ({
  appEnv: {
    useMock: true,
  },
}))

vi.mock('@/utils/request', () => ({
  requestClient: {
    get: vi.fn(),
  },
}))

describe('demo api', () => {
  beforeEach(() => {
    appEnv.useMock = true
    vi.mocked(requestClient.get).mockReset()
  })

  it('returns local mock demo data without calling requestClient in mock mode', async () => {
    await expect(fetchDemoRecordsApi()).resolves.toEqual(demoRecords)
    expect(requestClient.get).not.toHaveBeenCalled()
  })

  it("calls requestClient.get('/demo/records') in request mode", async () => {
    const response: ApiResponse<DemoRecord[]> = {
      code: 0,
      data: demoRecords,
      message: 'ok',
    }

    appEnv.useMock = false
    vi.mocked(requestClient.get).mockResolvedValueOnce({
      data: response,
    })

    await fetchDemoRecordsApi()

    expect(requestClient.get).toHaveBeenCalledWith('/demo/records')
  })

  it('unwraps ApiResponse<DemoRecord[]> in request mode', async () => {
    const responseData: DemoRecord[] = [
      ...demoRecords,
      {
        id: 'D-2001',
        name: '请求模式新增记录',
        owner: 'Request User',
        status: '已完成',
      },
    ]
    const response: ApiResponse<DemoRecord[]> = {
      code: 0,
      data: responseData,
      message: 'ok',
    }

    appEnv.useMock = false
    vi.mocked(requestClient.get).mockResolvedValueOnce({
      data: response,
    })

    await expect(fetchDemoRecordsApi()).resolves.toEqual(responseData)
  })
})
