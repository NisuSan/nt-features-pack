export const defaultShemas = {
  light: {
    'light-background': '#F3F1F2',
    'light-card-background': 'transparent',
    'light-input-background': 'transparent',
    'light-text': '#252538',
    'light-main-brand': '#6067B1',
    'light-main-brand-hover': '#4F5590',
    'light-light-shades': '#F3F1F2',
    'light-light-accent': '#8478B8',
    'light-light-accent-hover': '#6B5B9E',
    'light-dark-accent': '#AC4259',
    'light-dark-accent-hover': '#903548',
    'light-dark-shades': '#252538',
    'light-default': '#888888',
    'light-success': '#5d9966',
    'light-success-hover': '#4c8053',
    'light-warning': '#da892e',
    'light-warning-hover': '#b26e24',
    'light-danger': '#f44336',
    'light-danger-hover': '#c7352b',
    'light-info': '#7A6AAE',
    'light-info-hover': '#6B5B9E',
    'light-border': '#9E8ECB',
    'light-disabled-background': '#E0E0E0',
    'light-disabled-text': '#A0A0A0',
    'light-disabled-border': '#D1D1D1',
    'light-placeholder': '#B0B0B0',
    'light-placeholder-disabled': '#9d9d9d',
  },
  dark: {
    'dark-background': '#1C1C1E',
    'dark-card-background': '#2C2C2E',
    'dark-input-background': '#3A3A3C',
    'dark-text': '#F3F1F2',
    'dark-card-text': '#d0c8cc',
    'dark-main-brand': '#686CCF',
    'dark-main-brand-hover': '#42477A',
    'dark-light-shades': '#7A6AAE',
    'dark-light-accent': '#A397E1',
    'dark-light-accent-hover': '#42477A',
    'dark-dark-accent': '#AC4259',
    'dark-dark-accent-hover': '#903548',
    'dark-default': '#707070',
    'dark-success': '#5d9966',
    'dark-success-hover': '#4c8053',
    'dark-warning': '#da892e',
    'dark-warning-hover': '#b26e24',
    'dark-danger': '#f44336',
    'dark-danger-hover': '#c7352b',
    'dark-info': '#7A6AAE',
    'dark-info-hover': '#6B5B9E',
    'dark-border': '#6C6C6E',
    'dark-disabled-background': '#2E2E30',
    'dark-disabled-text': '#6C6C6E',
    'dark-disabled-border': '#3D3D3F',
    'dark-placeholder': '#7A7A7C',
    'dark-placeholder-disabled': '#58585a',
  }
}

export const themeMixins = `
@use "sass:map";

@function str-split($string, $separator) {
  $i: str-index($string, $separator);
  @if $i != null {
    @return append(
      str-slice($string, 1, $i - 1),
      str-split(str-slice($string, $i + str-length($separator)), $separator)
    );
  }
  @return $string
}

@mixin themed($selector: '', $theme: null) {
  $themes: (light, dark);

  @if $theme == null {
    @each $th in $themes {
      @each $s in str-split($selector, ',') {
        [theme=#{$th}] #{$s} {
          @content;
        }
      }
    }
  }
  @else {
    @each $s in str-split($selector, ',') {
      [theme=#{$theme}] #{$s} {
        @content;
      }
    }
  }
}

@mixin light() {
  [theme=light] & {
    @content;
  }
}

@mixin dark() {
  [theme=dark] & {
    @content;
  }
}
`

export const themeNaiveUi = `
@include themed('', 'light') {
  background-color: theme('colors.light-background') !important;
  color: theme('colors.light-text') !important;
}

@include themed('', 'dark') {
  background-color: theme('colors.dark-background') !important;
  color: theme('colors.dark-text') !important;
}

@include themed('.n-button.n-button--tertiary-type', 'light') {
  .n-button__border {
    border: 1px solid #E0E0E0 !important;
  }

  .n-button__state-border {
    border: none !important;
  }

  &:not(.n-button--disabled):hover {
    background: #E0E0E0 !important;
    .n-button__state-border {
      border: none !important;
    }
  }
}

@include themed('.n-button.n-button--tertiary-type .n-button__border', 'dark') {
  border: 1px solid transparent !important;
}

@include themed('.n-base-selection:not(.n-base-selection--disabled) .n-base-selection-label, .n-input:not(.n-input--disabled)', 'dark') {
  background-color: theme('colors.dark-input-background') !important;
}

@include themed('.n-base-selection:not(.n-base-selection--disabled) .n-base-selection-placeholder, .n-input:not(.n-input--disabled) .n-input__placeholder', 'dark') {
  color: theme('colors.dark-card-text') !important;
}

@include themed('.n-card', 'light') {
  box-shadow: theme('boxShadow.harder') !important;
}

.n-collapse-item__header--active .n-collapse-item__header-main {
  font-weight: 500 !important;

  @include light() {
    color: theme('colors.light-main-brand') !important;
  }

  @include dark() {
    color: theme('colors.dark-light-accent') !important;
  }
}

.n-base-selection.n-base-selection--disabled {
  border: none !important;

  * {
    border: none !important;
  }
}

$buttons: ('default': 'main-brand', 'primary': 'main-brand', 'info': 'info', 'success': 'success', 'warning': 'warning', 'error': 'danger');
@each $t in ('light', 'dark') {
  @each $btn, $n in $buttons {
    [theme=#{$t}] .n-button.n-button--#{$btn}-type.n-button--dashed:active {
      color: theme('colors.#{$t}-#{$n}-hover') !important;
      background-color: if($t == 'light', rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.05)) !important;

      .n-button__state-border {
        border-width: 1px !important;
      }
    }
  }
}
`

export const themeVanillaCss = ``

export const tailwindFileContent = `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";`
