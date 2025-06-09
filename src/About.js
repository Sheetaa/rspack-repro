import React from 'react';

const VERSION_OLD = 0;
const VERSION_NEW = 1;

const VERSION_COMPONENT_MAP = {
    [VERSION_OLD]: () => import('./EmptyComponent')
};

export default class About extends React.Component {

    constructor(props) {
        super(props);
        this.version = 0;
        this.state = {
            result: null
        };
        this._initData();
    }

    _initData() {
        this._loadComponent(VERSION_COMPONENT_MAP[this.version]);
    }

    _loadComponent(addr) {
        return addr().then((component) => {
            console.log('empty component', component);
            const app = () => <component.default />;
            this.setState({
                result: app()
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        const { result } = this.state;
        return result;
    }
}
