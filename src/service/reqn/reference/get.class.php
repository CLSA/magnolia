<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn\reference;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\get
{
  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    log::debug( $this->select, $this->modifier );
  }
}
