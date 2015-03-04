<?php
/**
* @package shorty an ownCloud url shortener plugin
* @category internet
* @author Christian Reiner
* @copyright 2011-2015 Christian Reiner <foss@christian-reiner.info>
* @license GNU Affero General Public license (AGPL)
* @link information http://apps.owncloud.com/content/show.php/Shorty?content=150401
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
* License as published by the Free Software Foundation; either
* version 3 of the license, or any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU AFFERO GENERAL PUBLIC LICENSE for more details.
*
* You should have received a copy of the GNU Affero General Public
* License along with this library.
* If not, see <http://www.gnu.org/licenses/>.
*
*/

/**
 * @file ajax/meta.php
 * @brief Ajax method to query meta information about a given remote url
 * @param target string: Url of a remote web resource
 * @return json: success/error state indicator
 * @return array: Associative array of meta data aspects
 * @author Christian Reiner
 */

namespace OCA\Shorty;

// swallow any accidential output generated by php notices and stuff to preserve a clean JSON reply structure
Tools::ob_control ( TRUE );

//no apps or filesystem
$RUNTIME_NOSETUPFS = true;

// Sanity checks
\OCP\JSON::callCheck ( );
\OCP\JSON::checkLoggedIn ( );
\OCP\JSON::checkAppEnabled ( 'shorty' );

try
{
	$target  = Type::req_argument ( 'target', Type::URL, TRUE );
	$meta    = Meta::fetchMetaData(urldecode($target));

	// swallow any accidential output generated by php notices and stuff to preserve a clean JSON reply structure
	Tools::ob_control ( FALSE );
	\OCP\Util::writeLog( 'shorty', sprintf("Target meta data retrieved for url '%s'.",$target), \OCP\Util::DEBUG );
	\OCP\JSON::success ( [
		'data'    => $meta,
		'level'   => 'info',
		'message' => L10n::t("Target url '%s' is valid", $meta['target'])
	] );
} catch ( Exception $e ) { Exception::JSONerror($e); }
