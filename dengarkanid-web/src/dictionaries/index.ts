import id from './id.json';
import en from './en.json';

const dictionaries = {
  id,
  en,
};

export type Locale = 'id' | 'en';
export type Dictionary = typeof id;

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale] || dictionaries.id;
