<?php
/**
 * head.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\amendment;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * The base class of all head services
 */
class head extends \cenozo\service\head
{
  /**
   * Extends parent method
   */
  protected function setup()
  {
    parent::setup();

    $this->columns['has_agreement'] = array(
      'data_type' => 'tinyint',
      'default' => '0',
      'required' => '1'
    );
  }
}
