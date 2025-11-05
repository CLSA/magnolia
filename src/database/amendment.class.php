<?php
/**
 * amendment.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * amendment: record
 */
class amendment extends \cenozo\database\record
{
  /**
   * Determines the next amendment name
   */
  public function get_next_amendment_name()
  {
    return '.' == $this->name ? 'A' : $this->name + 1;
  }
}
