import { computed, signal } from '@preact/signals';

export const locale = signal<string>('');
export const setLocale = (newLocale: string) => (locale.value = newLocale);

export const messages = signal<Record<string, Record<string, string>>>({});
export const setMessages = (newMessages: Record<string, Record<string, string>>) => (messages.value = newMessages);

export const localeMessages = computed<Record<string, string>>(() => messages.value[locale.value] || {});

/**
 * Get Message By Locale
 *
 * @param {string} key Message Key
 * @param options Mustache Interpolation
 * @returns {string}
 */
export const getMessage = (key: string, options: Record<string, string> = {}) => {
  const message = localeMessages.value[key] || '';
  return message.replace(/{{(.+?)}}/g, (_, group) => options[group] || group);
};
