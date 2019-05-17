<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\stage_type\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Extends parent class
 */
class query extends \cenozo\service\query
{
  /**
   * Extends the parent method
   */
  protected function prepare()
  {
    parent::prepare();

    // the status will be 404, reset it to 200
    $this->status->set_code( 200 );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_count()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    $db_stage_type = $this->get_parent_record();
    $modifier = clone $this->modifier;
    $modifier->where( 'stage_type.id', '=', $db_stage_type->id );
    return $reqn_class_name::count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    $db_stage_type = $this->get_parent_record();
    $modifier = clone $this->modifier;
    $modifier->where( 'stage_type.id', '=', $db_stage_type->id );
    return $reqn_class_name::select( $this->select, $modifier );
  }
}
