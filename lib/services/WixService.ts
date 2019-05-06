import { ISiteColor, ISiteTextPresets, IStyleParams, IUserSettings, IWixSDK, IWixService} from './types'

/**
 * WixService
 */
export class WixService implements IWixService {
  constructor(private readonly WixSdk: IWixSDK) {}

  public getStyleParams(): Promise<[ISiteColor[], ISiteTextPresets, IStyleParams]> {
    return Promise.all([
      this.getSiteColors(),
      this.getTextPresets(),
      this.getUserStyles(),
    ])
  }

  public onStyleParamsChange(callback: (data: IUserSettings) => void) {
    this.WixSdk.addEventListener(this.WixSdk.Events.STYLE_PARAMS_CHANGE, (styleData: IStyleParams) => {

      // these look quite similar - TODO - refactor into something reusable
      const fontsVariableToValueMap = Object.keys(styleData.fonts).reduce((resultingMap, key) => {
        return {...resultingMap, [key]: styleData.fonts[key].value }
      }, {})
      const colorsVariableToValueMap = Object.keys(styleData.colors).reduce((resultingMap, key) => {
        return {...resultingMap, [key]: styleData.colors[key].value}
      }, {})

      // need to cover styleData.number and styleData.boolean, missing data samples atm.
      const flattenedStyleParams = {...fontsVariableToValueMap, ...colorsVariableToValueMap}
      callback(flattenedStyleParams)
    })
  }

  private readonly getSiteColors = (): ISiteColor[] => this.WixSdk.Style.getSiteColors()
  private readonly getTextPresets = (): ISiteTextPresets => this.WixSdk.Style.getSiteTextPresets()
  private readonly getUserStyles = (): IStyleParams => this.WixSdk.Style.getStyleParams()
}
