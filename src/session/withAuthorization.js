import React from 'react';

import { withRouter } from 'react-router-dom';
import { AuthUserContext } from './context';
import { firebase } from '../index';

const withAuthorization = (condition, locationOnFailure, locationOnFallback) => Component => {
  class WithAuthorizationBase extends React.Component {
    componentDidMount() {
      this.listener = firebase.onAuthUserListener(authUser => {
        if (!condition(authUser)) {
          this.props.history.replace(locationOnFailure);
        }
      }, () => {
        if (locationOnFallback) {
          this.props.history.replace(locationOnFallback);
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorizationBase);
};

export default withAuthorization;
