import {normalizeAsArray, anyMatching} from './array';
import {Localizable, LocalizableArray, Localization} from '../types/localization';
import { hasValue } from './object';

export function asLocalizable(localizations: Localization[], ignoreConflicts = false): Localizable {

  const result: Localizable = {};

  for (const localization of normalizeAsArray(localizations)) {
    if (localization.lang) {

      if (!ignoreConflicts && result.hasOwnProperty(localization.lang)) {
        throw new Error('Localization already defined for language: ' + localization.lang);
      }

      result[localization.lang] = localization.value;
    }
  }

  return result;
}

export function withFirstLocalizations(localizable: Localizable|LocalizableArray): Localizable {

  const result: Localizable = {};

  for (const [lang, value] of Object.entries(localizable)) {
    result[lang] = normalizeAsArray(value)[0];
  }

  return result;
}

export function hasLocalization(localizable: Localizable) {
  return !!localizable && hasValue(localizable);
}

export function localizableMatches(localizable: Localizable, search: string): boolean {
  return anyMatching(Object.values(localizable), value => value.toLowerCase().indexOf(search.toLowerCase()) !== -1);
}
