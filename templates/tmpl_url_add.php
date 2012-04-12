<?php
/**
* @package shorty an ownCloud url shortener plugin
* @category internet
* @author Christian Reiner
* @copyright 2011-2012 Christian Reiner <foss@christian-reiner.info>
* @license GNU Affero General Public license (AGPL)
* @link information 
* @link repository https://svn.christian-reiner.info/svn/app/oc/shorty
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
?>

<?php
/**
 * @file templates/tmpl_url_add.php
 * A dialog to add a remote target url as a new shorty.
 * @access public
 * @author Christian Reiner
 */
?>

<!-- (hidden) dialog to add a new shorty -->
<form id="dialog-add" class="shorty-dialog shorty-standalone">
  <fieldset>
    <legend class="shorty-legend"><?php echo OC_Shorty_L10n::t('Add a new shorty:'); ?></legend>
    <a id="close" class="shorty-close-button"
       title="<?php echo OC_Shorty_L10n::t('close'); ?>">
      <img alt="<?php echo OC_Shorty_L10n::t('close'); ?>"
           src="<?php echo OC_Helper::imagePath('shorty','actions/up.png');  ?>">
    </a>
    <label for="target"><?php echo OC_Shorty_L10n::t('Target url:'); ?></label>
    <input id="target" name="target" type="text" maxlength="4096" data="" class="shorty-input"/>
    <br>
    <label for="meta">&nbsp;</label>
    <span id="meta" class="shorty-meta">
    <img id="staticon"  class="shorty-icon" src="" width="16" data="<?php echo OC_Helper::imagePath('shorty', 'status/neutral.png'); ?>">
    <img id="schemicon" class="shorty-icon" src="" width="16" data="<?php echo OC_Helper::imagePath('shorty', 'blank.png'); ?>">
    <img id="favicon"   class="shorty-icon" src="" width="16" data="<?php echo OC_Helper::imagePath('shorty', 'blank.png'); ?>">
    <img id="mimicon"   class="shorty-icon" src="" width="16" data="<?php echo OC_Helper::imagePath('shorty', 'blank.png'); ?>">
    <a id="explanation" maxlength="80" data="" class="shorty-value"></a>
    </span>
    <br>
    <label for="title"><?php echo OC_Shorty_L10n::t('Shorty title:'); ?></label>
    <input id="title" name="title" type="text" maxlength="80" data="" class="shorty-input" placeholder=""/>
    <br>
    <label for="status"><?php echo OC_Shorty_L10n::t('Status:'); ?></label>
    <select id="status" name="status" data="shared" value="shared">
      <option value="blocked"><?php echo OC_Shorty_L10n::t('blocked'); ?></option>
      <option value="shared" ><?php echo OC_Shorty_L10n::t('shared');  ?></option>
      <option value="public" ><?php echo OC_Shorty_L10n::t('public');  ?></option>
    </select>
    <span style="display:inline-block;">
    <label for="until"><?php echo OC_Shorty_L10n::t('Expiration:'); ?></label>
    <input id="until" name="until" type="text" maxlength="10" data="" class="shorty-input" style="width:22%"
           placeholder="<?php echo OC_Shorty_L10n::t('-removal-'); ?>"
           icon="<?php echo OC_Helper::imagePath('shorty', 'calendar.png'); ?>"/>
    </span>
    <br>
    <label for="notes"><?php echo OC_Shorty_L10n::t('Notes:'); ?></label>
    <textarea id="notes" name="notes" maxlength="4096" data="" class="shorty-input"
              placeholder="<?php echo OC_Shorty_L10n::t('help for later recognition…'); ?>"></textarea>
    <br>
    <label for="confirm"></label>
    <button id="confirm" class="shorty-button-submit"><?php echo OC_Shorty_L10n::t('Add as new'); ?></button>
  </fieldset>
</form>
