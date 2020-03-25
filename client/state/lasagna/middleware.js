/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import { getCurrentUser } from 'state/current-user/selectors';
import { socketConnect, socketDisconnect } from './socket';
import privatePostChannelMiddleware from './private-post-channel/actions-to-events';
import publicPostChannelMiddleware from './public-post-channel/actions-to-events';
import userChannelMiddleware from './user-channel/actions-to-events';

/**
 * Compose a list of middleware into one middleware
 * Props @rhc3
 *
 * @param m middlewares to compose
 */
const combineMiddleware = ( ...m ) => {
	return store => {
		const initialized = m.map( middleware => middleware( store ) );
		return next => initialized.reduce( ( chain, mw ) => mw( chain ), next );
	};
};

/**
 * Connection management middleware
 *
 * @param store middleware store
 */
const connectMiddleware = store => next => action => {
	next( action );

	switch ( action.type ) {
		case 'LASAGNA_SOCKET_CONNECT': {
			const user = getCurrentUser( store.getState() );
			wpcom
				.request( {
					method: 'POST',
					path: '/jwt/sign',
					body: { payload: JSON.stringify( { user } ) },
				} )
				.then( ( { jwt } ) => socketConnect( store, jwt, user.ID ) );
			break;
		}

		case 'LASAGNA_SOCKET_DISCONNECT':
			socketDisconnect( store );
			break;
	}

	return;
};

export default combineMiddleware(
	connectMiddleware,
	userChannelMiddleware,
	privatePostChannelMiddleware,
	publicPostChannelMiddleware
);
