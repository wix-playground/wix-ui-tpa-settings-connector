import { IStyleParams} from './types'
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
})
