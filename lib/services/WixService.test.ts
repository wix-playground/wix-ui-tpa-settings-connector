import {IStyleParams} from './types'
import {sdkMock, siteColors, siteTextPresets, userStyles} from './wix-sdk-mock'
import {WixService} from './WixService'

describe('WixService: communication through wix sdk', () => {
  it('should return style data', async () => {
    const wixService = new WixService(sdkMock)
    const [colors, textPresets, usersStyleParams] = await wixService.getStyleParams()
    expect(colors).toEqual(siteColors)
    expect(textPresets).toEqual(siteTextPresets)
    expect(usersStyleParams).toEqual(userStyles)
  })

  it('onStyleParamsChange it should call a callback with flattened structure of variables', () => {
    const callback = jest.fn()
    const sdkWithMockEventListener = {
      ...sdkMock, addEventListener: (event = 'probably_style_change', callbackFn: (data: IStyleParams) => void) => {
      callbackFn(userStyles)
      return 0
    }}
    const wixService = new WixService(sdkWithMockEventListener)
    wixService.onStyleParamsChange(callback)

    expect(callback.mock.calls[0]).toEqual([{ myMainFont: 'something', someSettingsColor: 'red'}])
  })

  it('should remove old event listener if new one is being registered', () => {
    const removeEventListenerSpy = jest.fn()
    let eventIdCounter = 0
    const sdkWithRemoveListenerSpy = {...sdkMock,
        removeEventListener: removeEventListenerSpy,
        addEventListener: (e: string, callback: (data: IStyleParams) => void) => eventIdCounter++,
      }
    const wixService = new WixService(sdkWithRemoveListenerSpy)
    wixService.onStyleParamsChange(data => {/* do nothing*/ })
    wixService.onStyleParamsChange(data => {/* do nothing*/ })
    expect(removeEventListenerSpy.mock.calls[0]).toEqual([sdkMock.Events.STYLE_PARAMS_CHANGE, 0])
  })
})
