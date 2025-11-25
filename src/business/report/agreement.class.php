<?php
/**
 * agreement.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class agreement extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $db_application = lib::create( 'business\session' )->get_application();
    $db_one_month_notification_type =
      $notification_type_class_name::get_unique_record( 'name', 'Agreement Expiry Notice (1 month)' );
    $db_two_month_notification_type =
      $notification_type_class_name::get_unique_record( 'name', 'Agreement Expiry Notice (2 months)' );

    $data = array();

    // build the modifier
    $modifier = lib::create( 'database\modifier' );

    // do not include reqns in the finalization or complete phases
    $modifier->join_current_stage();
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'stage_type.phase', 'NOT IN', ['finalization', 'complete'] );

    // join to the applicant
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );

    // join to the latest reqn version that has an agreement and restrict to agreements that are out of date
    $modifier->join_last_reqn_version_with_agreement();
    $modifier->where( 'reqn_version.agreement_end_date', '<=', 'DATE( NOW() )', false );

    // join to the one month and two month notifications
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'one_month.reqn_id', false );
    $join_mod->where( 'one_month.notification_type_id', '=', $db_one_month_notification_type->id );
    $modifier->join_modifier( 'notification', $join_mod, 'left', 'one_month' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'two_month.reqn_id', false );
    $join_mod->where( 'two_month.notification_type_id', '=', $db_two_month_notification_type->id );
    $modifier->join_modifier( 'notification', $join_mod, 'left', 'two_month' );

    // group since some notifications have gone out more than once
    $modifier->group( 'reqn.id' );
    
    // build the select
    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'Identifier', 'Identifier' );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'stage_type.name', 'Stage', false );
    $select->add_column( 'reqn_version.agreement_end_date', 'Agreement End Date', false );
    $select->add_column(
      sprintf(
        'GROUP_CONCAT( DATE( CONVERT_TZ( one_month.datetime, "UTC", "%s" ) ) )',
        $db_application->timezone
      ),
      'First Notice',
      false
    );
    $select->add_column(
      sprintf(
        'GROUP_CONCAT( DATE( CONVERT_TZ( two_month.datetime, "UTC", "%s" ) ) )',
        $db_application->timezone
      ),
      'Second Notice',
      false
    );

    $header = [];
    $rows = [];
    foreach( $reqn_class_name::select( $select, $modifier ) as $row )
    {
      if( 0 == count( $header ) )
      {
        foreach( $row as $column => $value ) $header[] = ucwords( str_replace( '_', ' ', $column ) );
      }

      $rows[] = array_values( $row );
    }

    $this->add_table( NULL, $header, $rows );
  }
}
