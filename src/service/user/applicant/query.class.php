<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user\applicant;
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
    $applicant_class_name = lib::get_class_name( 'database\applicant' );

    $db_user = $this->get_parent_record();
    $modifier = clone $this->modifier;
    if( !is_null( $db_user ) ) $modifier->where( 'supervisor_user_id', '=', $db_user->id );

    // find aliases in the select and translate them in the modifier
    $this->select->apply_aliases_to_modifier( $modifier );

    return $applicant_class_name::count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    $applicant_class_name = lib::get_class_name( 'database\applicant' );

    $db_user = $this->get_parent_record();
    $modifier = clone $this->modifier;
    if( !is_null( $db_user ) ) $modifier->where( 'supervisor_user_id', '=', $db_user->id );

    // find aliases in the select and translate them in the modifier
    $this->select->apply_aliases_to_modifier( $modifier );

    return $applicant_class_name::select( $this->select, $modifier );
  }
}
