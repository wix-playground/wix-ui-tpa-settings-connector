import {SettingsChangeObserver} from './SettingsChangeObserver'
import {IStyleParams} from './types'
import {sdkMock, userStyles} from './wix-sdk-mock'

describe('SettingsChangeObserver', () => {
  let triggerSettingsChange: any = () => ({})
  let sdkWithEventListener: any
  let userStylesInstance: IStyleParams
  beforeEach(() => {
    userStylesInstance = getUserStylesCopy()
    sdkWithEventListener = {
      ...sdkMock, addEventListener: (eventName: string, callback: any) => {
        triggerSettingsChange = () => {
          callback()
        }
        return 0
      },
      Style: {
        ...sdkMock.Style,
        getStyleParams: () => userStylesInstance,
      },
    }
  })

  it('should call provided callback on subscription to observer with initial style params', () => {
    const observer = new SettingsChangeObserver(sdkWithEventListener)
    observer
      .forVariables(['myMainFont', 'someSettingsColor', 'nonExistentProp'])
      .updateOnChange(([fontValue, colorValue, nonExistentValue]) => {
          expect(fontValue).toEqual('something')
          expect(colorValue).toEqual('red')
          expect(nonExistentValue).toEqual(undefined)
      })
  })

  it('should call provided callback when settings change', () => {
    const observer = new SettingsChangeObserver(sdkWithEventListener)
    let isInitialStyleUpdate = true
    observer
      .forVariables(['myMainFont', 'someSettingsColor', 'nonExistentProp'])
      .updateOnChange(([fontValue, colorValue, nonExistentValue]) => {
        if (isInitialStyleUpdate) {
          isInitialStyleUpdate = false
          return
        }

        expect(fontValue).toEqual('updated font definition')
        expect(colorValue).toEqual('blue')
        expect(nonExistentValue).toEqual(undefined)
      })

    userStylesInstance.fonts.myMainFont.value = 'updated font definition'
    userStylesInstance.colors.someSettingsColor.value = 'blue'
    triggerSettingsChange()
  })
})

function getUserStylesCopy() {
  return {...userStyles}
}
