

export function useThemeCode(appColors: Record<string, string>, themeName: ComputedRef<string>) {
  const ld = useColorChosers(themeName)
  const buttonColorMap = (prop: string) => [prop, appColors[`${themeName.value}-text`]]

  const createPressedColors = () => {
    const kind = ['Primary', 'Info', 'Success', 'Warning'] as const
    return Object.fromEntries(['color', 'border'].map(p => kind.map(k => [`${p}Pressed${k}`, appColors[`${themeName.value}-${k === 'Primary' ? 'main-brand' : k.toLowerCase()}-hover`]])).flat())
  }

  return computed<GlobalThemeOverrides>(() => ({
    common: {
      textColor2: ld(appColors['light-text'], appColors['dark-card-text']),
      textColor3: ld(appColors['light-text'], appColors['dark-card-text']),
      baseColor: appColors[`${themeName.value}-background`],
      primaryColor: appColors[`${themeName.value}-main-brand`],
      primaryColorHover: appColors[`${themeName.value}-main-brand-hover`],
      primaryColorSuppl: appColors[`${themeName.value}-main-brand-hover`],
      infoColor: appColors[`${themeName.value}-info`],
      infoColorHover: appColors[`${themeName.value}-info-hover`],
      successColor: appColors[`${themeName.value}-success`],
      successColorHover: appColors[`${themeName.value}-success-hover`],
      warningColor: appColors[`${themeName.value}-warning`],
      warningColorHover: appColors[`${themeName.value}-warning-hover`],
      errorColor: appColors[`${themeName.value}-danger`],
      errorColorHover: appColors[`${themeName.value}-danger-hover`],
      textColorBase: appColors[`${themeName.value}-text`],
      placeholderColor: appColors[`${themeName.value}-placeholder`],
      placeholderColorDisabled: appColors[`${themeName.value}-placeholder-disabled`],
      textColorDisabled: appColors[`${themeName.value}-disabled-text`],
      inputColorDisabled: appColors[`${themeName.value}-disabled-background`],
      borderColor: appColors[`${themeName.value}-border`],
      dividerColor: appColors[`${themeName.value}-border`],
      inputColor: appColors[`${themeName.value}-background`],
      tableColor: appColors[`${themeName.value}-background`],
      cardColor: appColors[`${themeName.value}-background`],
      modalColor: appColors[`${themeName.value}-background`],
      bodyColor: appColors[`${themeName.value}-background`],
      popoverColor: appColors[`${themeName.value}-background`],
      tagColor: appColors[`${themeName.value}-border`],
      hoverColor: appColors[`${themeName.value}-main-brand`],
      opacityDisabled: '0.5',
      boxShadow1: '0 1px 2px rgba(0, 0, 0, .08)',
      boxShadow2: '0 3px 6px rgba(0, 0, 0, .12)',
    },
    Button: {
      ...Object.fromEntries(['textColorPrimary', 'textColorInfo', 'textColorSuccess', 'textColorWarning', 'textColorError'].map(buttonColorMap)),
      ...Object.fromEntries(['textColorHoverPrimary', 'textColorHoverInfo', 'textColorHoverSuccess', 'textColorHoverWarning', 'textColorHoverError'].map(buttonColorMap)),
      color: ld(appColors['light-background'], appColors['dark-card-background']),
      colorHover: ld(appColors['light-background'], appColors['dark-card-background']),
      textColor: ld(appColors[`light-text`], appColors[`dark-card-text`]),
      textColorHover: ld(appColors[`light-main-brand-hover`], appColors[`dark-card-text`]),
      colorTertiary: ld('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      textColorTertiary: ld(appColors[`light-main-brand`], appColors[`dark-accent`]),
      textColorTertiaryHover: ld(appColors[`light-main-brand`], appColors[`dark-accent`]),
      textColorPressed: ld(appColors[`light-main-brand`], appColors[`dark-light-accent`]),
      colorPressed: ld('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      border: '1px solid ' + appColors[`${themeName.value}-border`],
      ...createPressedColors(),
      borderPressed: '1px solid ' + appColors[`${themeName.value}-main-brand`],
      colorPressedError: appColors[`${themeName.value}-danger-hover`],
      borderPressedError: appColors[`${themeName.value}-danger-hover`],
    },
    Card: {
      color: ld('transparent', appColors['dark-card-background']),
      borderColor: 'none',
      paddingMedium: '10px',
      borderRadius: '5px',
      titleFontSizeMedium: '1rem',
      titleTextColor: appColors[`${themeName.value}-text`], //themeName.value == 'light' ? appColors['light-text'] : appColors['dark-card-text'],
    },
    Checkbox: {
      checkMarkColor: appColors[`${themeName.value}-text`],
    },
    Switch: {
      railColor: ld('rgba(0, 0, 0, .14)',  appColors[`dark-border`]),
    },
    Collapse: {
      arrowColor: ld(appColors[`light-main-brand`], appColors[`dark-light-accent`]),
      titleTextColor: appColors[`${themeName.value}-text`], //themeName.value == 'light' ? appColors['light-text'] : appColors[`dark-card-text`],
      dividerColor: appColors[`${themeName.value}-light-accent`] + (themeName.value == 'light' ? 40 : 45),
      itemMargin: '10px 0 0 0',
      titlePadding: '10px 0 0 0',
    },
    DatePicker: {
      calendarTitleColorHover: ld('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      calendarTitleTextColor: appColors[`${themeName.value}-main-brand`],
    },
    Tabs: {
      tabFontWeightActive: '500',
      tabTextColorLine: appColors[`${themeName.value}-text`], //themeName.value == 'light' ? appColors['light-text'] : appColors[`dark-card-text`]
    }
  }))
}