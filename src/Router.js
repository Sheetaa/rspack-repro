import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { matchRoutes } from 'react-router-config';

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: undefined,
      routeList: [],
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const { location } = history;
    this.match(location.pathname, []);
  }

  match = (pathname, pathList) => {
    const { routes, history } = this.props;
    const _allRoutes = matchRoutes(routes, pathname) || [];
    const _filterRoutes = _allRoutes.filter(route => route.match.url === pathname);
    const curRoute = _filterRoutes.map(route => route.route)[0];
    if (curRoute && curRoute.component) {
      if (curRoute.component.prototype instanceof Component || curRoute._isLoaded) {
        this.updateRoute(curRoute, pathList, pathname);
      } else {
        curRoute
          .component()
          .then((mod) => {
            curRoute.component = mod.default || mod;
            curRoute._isLoaded = true;
            this.updateRoute(curRoute, pathList, pathname);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else {
      history.replace(`/error/404?isDestroy=1&tmp=${pathname}`);
    }
  };

  genRouteCom = route => React.createElement(route.component, this.props, { route });

  updateRoute = (curRoute, pathList, pathname) => {
    const { routeList } = this.state;
    if (curRoute && curRoute.component) {
      const newRouteList = routeList.filter(item => pathList.indexOf(item.pathname) > -1);
      const inTabs = newRouteList.find(item => item.pathname === pathname);
      if (!inTabs) {
        this.setState({
          routeList: [...newRouteList, {
            pathname,
            content: this.genRouteCom(curRoute),
          }],
          activeKey: pathname,
        });
      } else {
        this.setState({
          routeList: newRouteList,
          activeKey: pathname,
        });
      }
    }
  };

  updateRouteList = (pathList) => {
    const { routeList } = this.state;
    const newRouteList = routeList.filter(item => pathList.indexOf(item.pathname) > -1);
    this.setState({ routeList: newRouteList });
  }

  render() {
    const { routeList, activeKey } = this.state;
    if (!routeList.length) return null;
    return (
      <Fragment>
        {
          routeList.map((item) => {
            const { pathname, content } = item;
            return (
              <div
                key={`${pathname}`}
                style={{ display: pathname === activeKey ? 'block' : 'none' }}
                className={pathname === activeKey ? 'antd_auto_active_tab' : ''}
              >{content}
              </div>
            );
          })
        }
      </Fragment>
    );
  }
}

export default withRouter(Router);
