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

    $db_current_stage_type = $this->get_leaf_record()->get_current_stage_type();
    if( !is_null( $db_current_stage_type ) && 1 < $db_current_stage_type->rank )
    {
      throw lib::create( 'exception\notice',
        'Requisitions cannot be deleted once they have been submitted.',
        __METHOD__
      );
    }
  }
}
