// import '@fontsource/poppins';
import { render } from 'preact';
import { App } from './App';
import { MESSAGES } from './constants';
import { setLocale, setMessages } from './i18n';
import './index.css';

const [locale] = window.navigator.language.split('-');

setLocale(locale);
setMessages(MESSAGES);

render(<App />, document.getElementById('root') as HTMLElement);
