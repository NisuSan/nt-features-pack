import { type ComputedRef, computed } from 'vue'
import { type GlobalThemeOverrides } from 'naive-ui'
import { useColorChooser, type AppColors } from "../../../composables/generableComposables.ts"

export function naiveUiOverrides(appColors: ComputedRef<AppColors>) {
  const ch = useColorChooser()
  const buttonColorMap = (prop: string) => [prop, appColors.value.text]

  const createPressedColors = () => {
    const kind = ['Primary', 'Info', 'Success', 'Warning'] as const
    // @ts-expect-error
    return Object.fromEntries(['color', 'border'].map(p => kind.map(k => [`${p}Pressed${k}`, appColors.value[`${k === 'Primary' ? 'main-brand' : k.toLowerCase()}-hover`]])).flat())
  }

  return computed<GlobalThemeOverrides>(() => ({
    common: {
      textColor2: ch('text', 'card-text').value,
      textColor3: ch('text', 'card-text').value,
      baseColor: appColors.value['background'],
      primaryColor: appColors.value['main-brand'],
      primaryColorHover: appColors.value['main-brand-hover'],
      primaryColorSuppl: appColors.value['main-brand-hover'],
      infoColor: appColors.value['info'],
      infoColorHover: appColors.value['info-hover'],
      successColor: appColors.value['success'],
      successColorHover: appColors.value['success-hover'],
      warningColor: appColors.value['warning'],
      warningColorHover: appColors.value['warning-hover'],
      errorColor: appColors.value['danger'],
      errorColorHover: appColors.value['danger-hover'],
      textColorBase: appColors.value['text'],
      placeholderColor: appColors.value['placeholder'],
      placeholderColorDisabled: appColors.value['placeholder-disabled'],
      textColorDisabled: appColors.value['disabled-text'],
      inputColorDisabled: appColors.value['disabled-background'],
      borderColor: appColors.value['border'],
      dividerColor: appColors.value['border'],
      inputColor: appColors.value['background'],
      tableColor: appColors.value['background'],
      cardColor: appColors.value['background'],
      modalColor: appColors.value['background'],
      bodyColor: appColors.value['background'],
      popoverColor: appColors.value['background'],
      tagColor: appColors.value['border'],
      hoverColor: appColors.value['main-brand'],
      opacityDisabled: '0.5',
      boxShadow1: '0 1px 2px rgba(0, 0, 0, .08)',
      boxShadow2: '0 3px 6px rgba(0, 0, 0, .12)',
      scrollbarColor: appColors.value['border'],
      scrollbarColorHover: appColors.value['border'],
      scrollbarColorTrack: appColors.value['border'],
      scrollbarColorTrackHover: appColors.value['border'],
      scrollbarColorThumb: appColors.value['border'],
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
      border: '1px solid ' + appColors.value['border'],
      ...createPressedColors(),
      borderPressed: '1px solid ' + appColors.value[`main-brand`],
      colorPressedError: appColors.value[`danger-hover`],
      borderPressedError: appColors.value[`danger-hover`],
    },
    Card: {
      color: ch('transparent', 'card-background').value,
      borderColor: 'none',
      paddingMedium: '10px',
      borderRadius: '5px',
      titleFontSizeMedium: '1rem',
      titleTextColor: appColors.value['text'],
    },
    Checkbox: {
      checkMarkColor: appColors.value['text'],
    },
    Switch: {
      railColor: ch('rgba(0, 0, 0, .14)',  'border').value,
    },
    Collapse: {
      arrowColor: ch('main-brand', 'light-accent').value,
      titleTextColor: appColors.value['text'],
      dividerColor: appColors.value['light-accent'] + 42,
      itemMargin: '10px 0 0 0',
      titlePadding: '10px 0 0 0',
    },
    DatePicker: {
      calendarTitleColorHover: ch('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)').value,
      calendarTitleTextColor: appColors.value[`main-brand`],
    },
    Tabs: {
      tabFontWeightActive: '500',
      tabTextColorLine: appColors.value['text'],
      tabTextColorBar: appColors.value['text'],
    },
    Dialog: {
      titleFontSize: '1rem',
      titleTextColor: appColors.value['text'],
      textColor: appColors.value['text'],
      color: appColors.value['modal-background'],
      iconMargin: '0 7px 0 0',
    },
  }))
}
