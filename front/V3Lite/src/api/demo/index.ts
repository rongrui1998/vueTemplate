import type { DemoRecord } from '../../../mock/demo'
import { demoRecords } from '../../../mock/demo'

export type { DemoRecord }

export async function fetchDemoRecordsApi(): Promise<DemoRecord[]> {
  return Promise.resolve(demoRecords)
}
