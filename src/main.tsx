// import '@fontsource/poppins';
// import Router from 'preact-router';
import { render } from 'preact';
import App from './App';
import { MESSAGES } from './constants';
import History from './History';
import { setLocale, setMessages } from './i18n';
import './index.css';
import { isHistory } from './utils';

const [locale] = window.navigator.language.split('-');

setLocale(locale);
setMessages(MESSAGES);

// const Main = () => (
//   <Router>
//     <App path="/" />
//     <History path="/history" />
//   </Router>
// );

const Main = () => (isHistory() ? <History /> : <App />);

render(<Main />, document.getElementById('root') as HTMLElement);
