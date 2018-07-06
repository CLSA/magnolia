<?php
/**
 * delete.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class delete extends \cenozo\service\delete
{
  /**
   * Extends parent method
   */
  protected function validate()
  {
    parent::validate();

    $db_reqn = $this->get_leaf_record();
    if( 1 < $db_reqn->get_current_rank() )
      throw lib::create( 'exception\notice', 'Requisitions cannot be deleted once they have been submitted.', __METHOD__ );
  }

  /**
   * Extends parent method
   */
  protected function setup()
  {
    parent::setup();

    // if the reqn's stage has the first rank then delete that stage
    $db_reqn = $this->get_leaf_record();
    if( 1 == $db_reqn->get_current_rank() )
    {
      $db_last_stage = $db_reqn->get_last_stage();
      $db_last_stage->delete();
    }
  }
}
