import { type ComputedRef, computed } from 'vue'
import { type GlobalThemeOverrides } from 'naive-ui'
import { useAppColors, useColorChooser } from "../../../composables/generableComposables.ts"

export function naiveUiOverrides(overrides: GlobalThemeOverrides = {}) {
  const appColors = useAppColors()
  const ch = useColorChooser()
  const buttonColorMap = (prop: string) => [prop, appColors.currentColors.value.text]

  const createPressedColors = () => {
    const kind = ['Primary', 'Info', 'Success', 'Warning'] as const
    // @ts-expect-error
    return Object.fromEntries(['color', 'border'].map(p => kind.map(k => [`${p}Pressed${k}`, appColors.currentColors.value[`${k === 'Primary' ? 'main-brand' : k.toLowerCase()}-hover`]])).flat())
  }

  return computed<GlobalThemeOverrides>(() => ({
    common: {
      textColor2: ch('text', 'card-text').value,
      textColor3: ch('text', 'card-text').value,
      baseColor: appColors.currentColors.value['background'],
      primaryColor: appColors.currentColors.value['main-brand'],
      primaryColorHover: appColors.currentColors.value['main-brand-hover'],
      primaryColorSuppl: appColors.currentColors.value['main-brand-hover'],
      infoColor: appColors.currentColors.value['info'],
      infoColorHover: appColors.currentColors.value['info-hover'],
      successColor: appColors.currentColors.value['success'],
      successColorHover: appColors.currentColors.value['success-hover'],
      warningColor: appColors.currentColors.value['warning'],
      warningColorHover: appColors.currentColors.value['warning-hover'],
      errorColor: appColors.currentColors.value['danger'],
      errorColorHover: appColors.currentColors.value['danger-hover'],
      textColorBase: appColors.currentColors.value['text'],
      placeholderColor: appColors.currentColors.value['placeholder'],
      placeholderColorDisabled: appColors.currentColors.value['placeholder-disabled'],
      textColorDisabled: appColors.currentColors.value['disabled-text'],
      inputColorDisabled: appColors.currentColors.value['disabled-background'],
      borderColor: appColors.currentColors.value['border'],
      dividerColor: appColors.currentColors.value['border'],
      inputColor: appColors.currentColors.value['background'],
      tableColor: appColors.currentColors.value['background'],
      cardColor: appColors.currentColors.value['background'],
      modalColor: appColors.currentColors.value['background'],
      bodyColor: appColors.currentColors.value['background'],
      popoverColor: appColors.currentColors.value['background'],
      tagColor: appColors.currentColors.value['border'],
      hoverColor: appColors.currentColors.value['main-brand'],
      opacityDisabled: '0.5',
      boxShadow1: '0 1px 2px rgba(0, 0, 0, .08)',
      boxShadow2: '0 3px 6px rgba(0, 0, 0, .12)',
      scrollbarColor: appColors.currentColors.value['border'],
      scrollbarColorHover: appColors.currentColors.value['border'],
      scrollbarColorTrack: appColors.currentColors.value['border'],
      scrollbarColorTrackHover: appColors.currentColors.value['border'],
      scrollbarColorThumb: appColors.currentColors.value['border'],
    },
    Button: {
      ...Object.fromEntries(['textColorPrimary', 'textColorInfo', 'textColorSuccess', 'textColorWarning', 'textColorError'].map(buttonColorMap)),
      ...Object.fromEntries(['textColorHoverPrimary', 'textColorHoverInfo', 'textColorHoverSuccess', 'textColorHoverWarning', 'textColorHoverError'].map(buttonColorMap)),
      color: ch('background', 'card-background').value,
      colorHover: ch('background', 'card-background').value,
      textColor: ch('text', 'card-text').value,
      textColorHover: ch('main-brand-hover', 'card-text').value,
      colorTertiary: ch('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)').value,
      textColorTertiary: ch('main-brand', 'dark-accent').value,
      textColorTertiaryHover: ch('main-brand', 'dark-accent').value,
      textColorPressed: ch('main-brand', 'light-accent').value,
      colorPressed: ch('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)').value,
      border: '1px solid ' + appColors.currentColors.value['border'],
      ...createPressedColors(),
      borderPressed: '1px solid ' + appColors.currentColors.value[`main-brand`],
      colorPressedError: appColors.currentColors.value[`danger-hover`],
      borderPressedError: appColors.currentColors.value[`danger-hover`],
    },
    Card: {
      color: ch('transparent', 'card-background').value,
      borderColor: 'none',
      paddingMedium: '10px',
      borderRadius: '5px',
      titleFontSizeMedium: '1rem',
      titleTextColor: appColors.currentColors.value['text'],
    },
    Checkbox: {
      checkMarkColor: appColors.currentColors.value['text'],
    },
    Switch: {
      railColor: ch('rgba(0, 0, 0, .14)',  'border').value,
    },
    Collapse: {
      arrowColor: ch('main-brand', 'light-accent').value,
      titleTextColor: appColors.currentColors.value['text'],
      dividerColor: appColors.currentColors.value['light-accent'] + 42,
      itemMargin: '10px 0 0 0',
      titlePadding: '10px 0 0 0',
    },
    DatePicker: {
      calendarTitleColorHover: ch('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)').value,
      calendarTitleTextColor: appColors.currentColors.value[`main-brand`],
    },
    Tabs: {
      tabFontWeightActive: '500',
      tabTextColorLine: appColors.currentColors.value['text'],
      tabTextColorBar: appColors.currentColors.value['text'],
    },
    Dialog: {
      titleFontSize: '1rem',
      titleTextColor: appColors.currentColors.value['text'],
      textColor: appColors.currentColors.value['text'],
      color: appColors.currentColors.value['modal-background'],
      iconMargin: '0 7px 0 0',
      closeIconColorHover: appColors.currentColors.value['danger-hover'],
    },
    ...overrides
  }))
}
