import 'i18next';

// Wire the resource shape into i18next so `t('common:buttons.save')` is fully
// type-checked and auto-completed. English is used as the canonical structure.
import common from '@/src/locales/en/common.json';
import errors from '@/src/locales/en/errors.json';
import validation from '@/src/locales/en/validation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      errors: typeof errors;
      validation: typeof validation;
    };
  }
}
