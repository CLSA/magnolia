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

    // if the only stage the requisition has been in is the New stage then delete it
    $db_requisition = $this->get_leaf_record();
    $db_last_stage = $db_requisition->get_last_stage();
    if( 1 == $db_requisition->get_stage_count() && 'New' == $db_last_stage->get_stage_type()->name )
      $db_last_stage->delete();
  }
}
