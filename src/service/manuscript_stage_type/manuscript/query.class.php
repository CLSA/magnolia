<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\manuscript_stage_type\manuscript;
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
    $manuscript_class_name = lib::get_class_name( 'database\manuscript' );

    $db_manuscript_stage_type = $this->get_parent_record();
    $modifier = clone $this->modifier;
    $modifier->where( 'manuscript_stage_type.id', '=', $db_manuscript_stage_type->id );
    return $manuscript_class_name::count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    $manuscript_class_name = lib::get_class_name( 'database\manuscript' );

    $db_manuscript_stage_type = $this->get_parent_record();
    $modifier = clone $this->modifier;
    $modifier->where( 'manuscript_stage_type.id', '=', $db_manuscript_stage_type->id );
    return $manuscript_class_name::select( $this->select, $modifier );
  }
}
