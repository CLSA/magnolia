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
  protected function prepare()
  {
    parent::prepare();

    $db_current_stage_type = $this->get_leaf_record()->get_current_stage_type();
    if( !is_null( $db_current_stage_type ) ) $this->rank = $db_current_stage_type->rank;
  }

  /**
   * Extends parent method
   */
  protected function validate()
  {
    parent::validate();

    if( 1 < $this->rank )
      throw lib::create( 'exception\notice', 'Requisitions cannot be deleted once they have been submitted.', __METHOD__ );
  }

  /**
   * Extends parent method
   */
  protected function setup()
  {
    parent::setup();

    // if the reqn's stage has the first rank then delete that stage
    if( 1 == $this->rank )
    {
      $db_current_stage = $this->get_leaf_record()->get_current_stage();
      $db_current_stage->delete();
    }
  }

  /**
   * The reqn's current rank
   */
  private $rank = NULL;
}
