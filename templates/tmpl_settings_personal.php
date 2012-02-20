<?php
/**
* ownCloud shorty plugin, a URL shortener
*
* @author Christian Reiner
* @copyright 2011-2012 Christian Reiner <foss@christian-reiner.info>
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

<form id="shorty">
  <fieldset class="personalblock">
    <div id="title"><strong>Shorty</strong></div>
    <div id="settings">
      <label for="shortlet" class="bold"><?php echo $l->t('Shortlet');?></label>
      <span id="shortlet"><a class="shortlet" href="javascript:(function(){url=encodeURIComponent(location.href);window.open('<?php echo OC_Helper::linkTo('shorty', 'add.php', null, true); ?>?'+url, 'owncloud-shorty')%20})()"><?php echo $l->t('Add shorty to ownCloud'); ?></a></span>
      <br>
      <span class="explain"><em><?php echo $l->t('Drag this to your browser bookmarks and click it, whenever you want to create a Shorty.'); ?></em></span>
    </div>
  </fieldset>
</form>