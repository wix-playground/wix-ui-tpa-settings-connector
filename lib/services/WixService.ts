import { ISiteColor, ISiteTextPresets, IStyleParams, IUserSettings, IWixSDK, IWixService, IColorStyleParams, IFontStyleParams} from './types'

/**
 * WixService
 */
export class WixService implements IWixService {
  private eventListenerId: number = null
  constructor(private readonly WixSdk: IWixSDK) {}

  public getStyleParams(): Promise<[ISiteColor[], ISiteTextPresets, IStyleParams]> {
    return Promise.all([
      this.getSiteColors(),
      this.getTextPresets(),
      this.getUserStyles(),
    ])
  }

  public onStyleParamsChange(callback: (data: IUserSettings) => void) {
    if (this.eventListenerId !== null) {
      this.WixSdk.removeEventListener(this.WixSdk.Events.STYLE_PARAMS_CHANGE, this.eventListenerId)
    }

    this.eventListenerId = this.WixSdk
      .addEventListener(this.WixSdk.Events.STYLE_PARAMS_CHANGE, (styleData: IStyleParams) => {
      const flattenedStyleParams = this.extractUserStyleValues(styleData)(['fonts', 'colors', 'numbers', 'booleans'])
      callback(flattenedStyleParams)
    })
  }

  private readonly extractUserStyleValues = (valueObject: IStyleParams) => (styleProperties: string[]) =>
    styleProperties.reduce((flattenedUsersValues, property) => {
      return {...flattenedUsersValues, ...Object.keys(valueObject[property]).reduce((userSettingsMap, key) => {
        return {...userSettingsMap, [key]: valueObject[property][key].value}
      }, {})}
    }, {})

  private readonly getSiteColors = (): ISiteColor[] => this.WixSdk.Style.getSiteColors()
  private readonly getTextPresets = (): ISiteTextPresets => this.WixSdk.Style.getSiteTextPresets()
  private readonly getUserStyles = (): IStyleParams => this.WixSdk.Style.getStyleParams()
}
