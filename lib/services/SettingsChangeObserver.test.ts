import {SettingsChangeObserver} from './SettingsChangeObserver'
import {IStyleParams} from './types'
import {sdkMock, userStyles} from './wix-sdk-mock'

describe('SettingsChangeObserver', () => {
  it('should call provided callback with updated values', () => {
    let callbackHandle: any = () => ({})
    const sdkWithEventListener = { ...sdkMock, addEventListener: (eventName: string, callback: any) => {
      callbackHandle = (dataToCallCallbackWith: IStyleParams) => {
        callback(dataToCallCallbackWith)
      }
      return 0
    }}

    const observer = new SettingsChangeObserver(sdkWithEventListener)

    observer
      .forVariables(['myMainFont', 'someSettingsColor', 'nonExistantProp'])
      .updateOnChange(([fontValue, colorValue, nonExistentValue]) => {
        expect(fontValue).toEqual(userStyles.fonts.myMainFont.value)
        expect(colorValue).toEqual(userStyles.colors.someSettingsColor.value)
        expect(nonExistentValue).toEqual(undefined)
      })

    callbackHandle(userStyles)
  })
})
