<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\data_option\reqn;
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
    $db_data_option = $this->get_parent_record();

    $modifier = clone $this->modifier;
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'reqn_version_data_option', 'reqn_version.id', 'reqn_version_data_option.reqn_version_id' );
    $modifier->join( 'data_option', 'reqn_version_data_option.data_option_id', 'data_option.id' );
    $modifier->where( 'data_option.id', '=', $db_data_option->id );
    $modifier->group( 'reqn.id' );
    return $reqn_class_name::count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $db_data_option = $this->get_parent_record();

    $modifier = clone $this->modifier;
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'reqn_version_data_option', 'reqn_version.id', 'reqn_version_data_option.reqn_version_id' );
    $modifier->join( 'data_option', 'reqn_version_data_option.data_option_id', 'data_option.id' );
    $modifier->where( 'data_option.id', '=', $db_data_option->id );
    $modifier->group( 'reqn.id' );
    return $reqn_class_name::select( $this->select, $modifier );
  }
}
