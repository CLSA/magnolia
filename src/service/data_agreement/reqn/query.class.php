<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\data_agreement\reqn;
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
    $db_data_agreement = $this->get_parent_record();

    // prepend-join to the reqn_version table
    $modifier = clone $this->modifier;
    $modifier->join(
      'reqn_version',
      'reqn_current_reqn_version.reqn_version_id',
      'reqn_version.id',
      '', // default
      NULL, // default
      true // prepend
    );
    $modifier->join(
      'reqn_current_reqn_version',
      'reqn.id',
      'reqn_current_reqn_version.reqn_id',
      '', // default
      NULL, // default
      true // prepend
    );
    $modifier->where( 'reqn_version.data_agreement_id', '=', $db_data_agreement->id );
    $modifier->group( 'reqn.id' );
    return $reqn_class_name::count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $db_data_agreement = $this->get_parent_record();

    // prepend-join to the reqn_version table
    $modifier = clone $this->modifier;
    $modifier->join(
      'reqn_version',
      'reqn_current_reqn_version.reqn_version_id',
      'reqn_version.id',
      '', // default
      NULL, // default
      true // prepend
    );
    $modifier->join(
      'reqn_current_reqn_version',
      'reqn.id',
      'reqn_current_reqn_version.reqn_id',
      '', // default
      NULL, // default
      true // prepend
    );
    $modifier->where( 'reqn_version.data_agreement_id', '=', $db_data_agreement->id );
    $modifier->group( 'reqn.id' );
    return $reqn_class_name::select( $this->select, $modifier );
  }
}
