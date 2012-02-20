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
      <label for="backend-type"><?php echo $l->t('Backend');?></label>
      <select id="backend-type" name="backend-type" data-placeholder="<?php echo $l->t('Choose service...'); ?>">
        <option value=""></option>
        <option value="none"> [ none ] </option>
        <option value="static">static backend</option>
        <option value="google">google service</option>
        <option value="tinyurl">tinyURL service</option>
        <option value="isgd">is.gd service</option>
        <option value="bitly">bitly.com service</option>
      </select>
      <span id="backend-none" class="backend-supplement" style="display:none;">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Don\'t use a backend, simply generate links to ownClouds shorty module.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://%s%s<em>&lt;shorty key&gt;</em>',$_SERVER['SERVER_NAME'],OC_Helper::linkTo('shorty','',false)) ?></span>
        </span>
      </span>
      <span id="backend-static" class="backend-supplement" style="display:none;">
        <label for="backend-base"><?php echo $l->t('Base url:');?></label>
        <input id="backend-base" type="text" value="" maxsize="256" data-placeholder="<?php echo $l->t('Specify a backend base...');?>">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Static, rule-based backend, generate links relative to a given external url.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://%s/<em>&lt;service&gt;</em>/<em>&lt;shorty key&gt;</em>',$_SERVER['SERVER_NAME']) ?></span>
        </span>
      </span>
      <span id="backend-google" class="backend-supplement" style="display:none;">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Use "google" service and register a short url for each generated shorty.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://goo.gl/<em>&lt;key&gt;</em>') ?></span>
        </span>
      </span>
      <span id="backend-tinyurl" class="backend-supplement" style="display:none;">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Use "tinyURL" service to register a short url for each generated shorty.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://tinyurl.com/<em>&lt;key&gt;</em>') ?></span>
        </span>
      </span>
      <span id="backend-isgd" class="backend-supplement" style="display:none;">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Use "is.gd" service to register a short url for each generated shorty.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://is.gd/<em>&lt;key&gt;</em>') ?></span>
        </span>
      </span>
      <span id="backend-turl" class="backend-supplement" style="display:none;">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Use "turl" service to register a short url for each generated shorty.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://turl.ca/<em>&lt;key&gt;</em>') ?></span>
        </span>
      </span>
      <span id="backend-bitly" class="backend-supplement" style="display:none;">
        <br/>
        <label for="backend-explain"> </label>
        <span id="backend-explain">
          <label for="explain"><?php echo $l->t('Explanation:');?></label>
          <span id="explain" class="explain"><?php echo $l->t('Use "bitly.com" service to register a short url for each generated shorty.');?></span>
          <br/>
        </span>
        <label for="backend-example"> </label>
        <span id="backend-example">
          <label for="example"><?php echo $l->t('Example:');?></label>
          <span id="example" class="example"><?php echo sprintf('http://bitly.com/<em>&lt;key&gt;</em>') ?></span>
        </span>
      </span>
    </div>
  </fieldset>
</form>
