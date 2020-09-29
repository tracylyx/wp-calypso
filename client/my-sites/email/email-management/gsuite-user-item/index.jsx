/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { Button } from '@automattic/components';
import ExternalLink from 'components/external-link';
import PendingGSuiteTosNoticeDialog from 'my-sites/domains/components/domain-warnings/pending-gsuite-tos-notice-dialog';

/**
 * Style dependencies
 */
import './style.scss';

function GSuiteUserItem( props ) {
	const translate = useTranslate();
	const [ dialogVisible, setDialogVisible ] = useState( false );

	const onFixClickHandler = ( e ) => {
		e.preventDefault();
		setDialogVisible( true );
	};

	const onCloseClickHandler = () => {
		setDialogVisible( false );
	};

	const getMailboxLink = () => {
		const { email } = props.user;

		return `https://accounts.google.com/AccountChooser?Email=${ email }&service=CPanel&continue=https://mail.google.com/`;
	};

	const getLoginLink = () => {
		const { email, domain } = props.user;

		return `https://accounts.google.com/AccountChooser?Email=${ email }&service=CPanel&continue=https://admin.google.com/a/${ domain }`;
	};

	const renderMailbox = () => {
		return (
			<ExternalLink
				icon
				href={ getMailboxLink() }
				onClick={ props.onClick }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ translate( 'Mailbox', { context: 'Link pointing to Gmail' } ) }
			</ExternalLink>
		);
	};

	const renderManage = () => {
		if ( ! props.user.is_admin ) {
			return;
		}

		return (
			<ExternalLink
				icon
				href={ getLoginLink() }
				onClick={ props.onClick }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ translate( 'Manage', { context: 'Link pointing to Google Admin Console' } ) }
			</ExternalLink>
		);
	};

	const renderFinishSetup = () => {
		return (
			<Fragment>
				<Button compact={ true } onClick={ onFixClickHandler }>
					{ translate( 'Finish Setup' ) }
				</Button>

				{ props.siteSlug && (
					<PendingGSuiteTosNoticeDialog
						domainName={ props.user.domain }
						onClose={ onCloseClickHandler }
						section={ 'gsuite-users-manage-user' }
						siteSlug={ props.siteSlug }
						user={ props.user.email }
						visible={ dialogVisible }
					/>
				) }
			</Fragment>
		);
	};

	return (
		<li>
			<span className="gsuite-user-item__email">{ props.user.email }</span>

			<div className="gsuite-user-item__actions">
				{ props.user.agreed_to_terms ? renderManage() : renderFinishSetup() }

				{ renderMailbox() }
			</div>
		</li>
	);
}

GSuiteUserItem.propTypes = {
	user: PropTypes.object.isRequired,
	onClick: PropTypes.func,
};

export default GSuiteUserItem;
