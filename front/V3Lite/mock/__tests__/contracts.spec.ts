import { demoLoginPayload, demoLoginResult, demoUser } from '../auth'
import { demoAccessCodes, demoMenus } from '../menu'

describe('mock contracts', () => {
  it('exposes the login payload shape', () => {
    expect(demoLoginPayload).toEqual({
      password: expect.any(String),
      username: expect.any(String),
    })
  })

  it('exposes the login result shape', () => {
    expect(demoLoginResult).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('exposes the user info payload shape', () => {
    expect(demoUser).toEqual({
      avatar: expect.any(String),
      nickname: expect.any(String),
      roles: expect.any(Array),
      userId: expect.any(String),
      username: expect.any(String),
    })
  })

  it('exposes the menu tree and permission code arrays', () => {
    expect(Array.isArray(demoMenus)).toBe(true)
    expect(demoMenus[0]).toEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          title: expect.any(String),
        }),
        name: expect.any(String),
        path: expect.any(String),
      }),
    )
    expect(demoAccessCodes).toEqual(expect.arrayContaining([expect.any(String)]))
  })
})
