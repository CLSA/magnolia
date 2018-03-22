<?php
/**
 * delete.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\requisition;
use cenozo\lib, cenozo\log, magnolia\util;

class delete extends \cenozo\service\delete
{
  /**
   * Extends parent method
   */
  protected function setup()
  {
    parent::setup();

    // if the requisition's stage has the first rank then delete that stage
    $db_requisition = $this->get_leaf_record();
    if( 1 == $db_requisition->get_current_rank() )
    {
      $db_last_stage = $db_requisition->get_last_stage();
      $db_last_stage->delete();
    }
  }
}
