/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useI18n } from '@automattic/react-i18n';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Language, LanguageGroup } from './Language';
import { getSearchedLanguages, LocalizedLanguageNames } from './search';

/**
 * Style dependencies
 */
import './style.scss';

type Props = {
	onSelectLanguage: ( language: Language ) => void;
	languages: Language[];
	languageGroups: LanguageGroup[];
	defaultLananguageGroupId: string;
	selectedLanguage?: Language;
	search?: string;
	localizedLanguageNames?: LocalizedLanguageNames;
};

const LanguagePicker = ( {
	onSelectLanguage,
	languages,
	languageGroups,
	defaultLananguageGroupId,
	selectedLanguage,
	search,
	localizedLanguageNames,
}: Props ) => {
	const { __ } = useI18n();
	const [ filter, setFilter ] = useState( defaultLananguageGroupId );

	const getFilteredLanguages = () => {
		switch ( filter ) {
			case 'popular':
				return languages
					.filter( ( language ) => language.popular )
					.sort( ( a, b ) => ( a.popular as number ) - ( b.popular as number ) );
			default: {
				const languageGroup = languageGroups.find( ( l ) => l.id === filter );
				const subTerritories = languageGroup ? languageGroup.subTerritories : [];
				return languages
					.filter( ( language ) =>
						language.territories.some( ( t ) => subTerritories?.includes( t ) )
					)
					.sort( ( a, b ) => a.name.localeCompare( b.name ) );
			}
		}
	};

	const renderCategoryButtons = () => {
		return languageGroups.map( ( languageGroup ) => {
			const isSelected = filter === languageGroup.id;

			const onClick = () => {
				setFilter( languageGroup.id );
			};

			return (
				<div key={ languageGroup.id }>
					<Button onClick={ onClick } className="language-picker__language-group">
						<span className={ isSelected ? 'is-selected' : '' }>{ languageGroup.name( __ ) }</span>
					</Button>
				</div>
			);
		} );
	};

	const shouldDisplayRegions = ! search;

	const languagesToRender = search
		? getSearchedLanguages( languages, search, localizedLanguageNames )
		: getFilteredLanguages();

	return (
		<>
			<div className="language-picker__labels">
				{ shouldDisplayRegions ? (
					<>
						<div className="language-picker__regions-label">{ __( 'regions' ) }</div>
						<div className="language-picker__languages-label">{ __( 'language' ) }</div>
					</>
				) : (
					<div className="language-picker__search-results-label">{ __( 'search result' ) }</div>
				) }
			</div>
			<div className="language-picker__content">
				{ shouldDisplayRegions && (
					<div className="language-picker__category-filters">{ renderCategoryButtons() }</div>
				) }
				<div className="language-picker__language-buttons">
					{ languagesToRender.map( ( language ) => (
						<Button
							isPrimary={ selectedLanguage && language.langSlug === selectedLanguage.langSlug }
							className="language-picker__language-button"
							key={ language.langSlug }
							onClick={ () => onSelectLanguage( language ) }
							title={ language.name }
						>
							<span lang={ language.langSlug }>{ language.name }</span>
						</Button>
					) ) }
				</div>
			</div>
		</>
	);
};

export default LanguagePicker;
