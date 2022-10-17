<?php
/**
 * head.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user;
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

    $this->columns['suspended'] = array(
      'data_type' => 'tinyint',
      'default' => '1',
      'required' => '1'
    );

    $this->columns['newsletter'] = array(
      'data_type' => 'tinyint',
      'default' => '1',
      'required' => '1'
    );

    $this->columns['note'] = array(
      'data_type' => 'text',
      'type' => 'text',
      'json' => false,
      'max_length' => 65535,
      'required' => '0'
    );
  }
}
