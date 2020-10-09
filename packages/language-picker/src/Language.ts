/**
 * WordPress dependencies
 */
import { I18n } from '@wordpress/i18n';

export type LanguageGroup = {
	id: string;
	name: ( translate: I18n[ '__' ] ) => string;
	subTerritories?: string[];
	countries?: string[];
	default?: boolean;
};

type LanguageSlug = string;
type WPLocale = string;

type BaseLanguage = {
	langSlug: LanguageSlug;
	name: string;
	popular?: number;
	rtl?: boolean;
	territories: string[];
	value: number;
	wpLocale: WPLocale | '';
};

type SubLanguage = BaseLanguage & { parentLangSlug: string };

export type Language = BaseLanguage | SubLanguage;
