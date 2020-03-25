import React from 'react';

export const AuthUserContext = React.createContext(null);

const withAuthUserContext = (Component) => {
    const WrapperComponent = (props) => {
        return (
            <AuthUserContext.Consumer>
				{authUser =>
					<Component {...props} authUser={authUser} />
				}
            </AuthUserContext.Consumer>
        );
	};

	return WrapperComponent;
};

export default withAuthUserContext;
