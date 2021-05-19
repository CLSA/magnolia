<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Special user for handling the query meta-resource
 */
class query extends \cenozo\service\query
{
  /**
   * Replaces parent method
   */
  protected function get_record_count()
  {
    if( $this->get_argument( 'choosing', false ) ) return parent::get_record_count();

    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $db_user = $this->get_parent_record();

    // show both owned and trainee or designate reqns
    $modifier = clone $this->modifier;
    $modifier->where_bracket( true );
    $modifier->where( 'reqn.user_id', '=', $db_user->id );
    $modifier->or_where( 'reqn.trainee_user_id', '=', $db_user->id );
    $modifier->or_where( 'reqn.designate_user_id', '=', $db_user->id );
    $modifier->where_bracket( false );
    return $reqn_class_name::count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    if( $this->get_argument( 'choosing', false ) ) return parent::get_record_list();

    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $db_user = $this->get_parent_record();

    // show both owned and trainee or designate reqns
    $modifier = clone $this->modifier;
    $modifier->where_bracket( true );
    $modifier->where( 'reqn.user_id', '=', $db_user->id );
    $modifier->or_where( 'reqn.trainee_user_id', '=', $db_user->id );
    $modifier->or_where( 'reqn.designate_user_id', '=', $db_user->id );
    $modifier->where_bracket( false );
    return $reqn_class_name::select( $this->select, $modifier );
  }
}
