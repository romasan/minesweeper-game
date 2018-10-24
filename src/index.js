import React, {render} from 'preact-compat';
import App from './components/App';

render(
    <App/>,
    document.getElementById('wrap')
);

module.hot.accept();
