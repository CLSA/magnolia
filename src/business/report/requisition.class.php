<?php
/**
 * requisition.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class requisition extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $db_application = lib::create( 'business\session' )->get_application();

    $data = array();

    // apply the custom restriction to the stage type (must be in or have been in)
    $stage_type_id = NULL;
    $date_span_type = NULL;
    $start_date = NULL;
    $end_date = NULL;
    foreach( $this->get_restriction_list() as $restriction )
    {
      if( 'stage_type' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $stage_type_id = $restriction['value'];
      }
      else if( 'date_span_type' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $date_span_type = $restriction['value'];
      }
      else if( 'start_date' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $start_date = util::get_datetime_object(
          $restriction['value'],
          $db_application->timezone
        )->format( 'Y-m-d' );
      }
      else if( 'end_date' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $end_date = util::get_datetime_object(
          $restriction['value'],
          $db_application->timezone
        )->format( 'Y-m-d' );
      }
    }

    // build the modifier
    $modifier = lib::create( 'database\modifier' );
    $modifier->join_current_reqn_version();

    // join to the current stage
    if( is_null( $stage_type_id ) )
    {
      // the current stage is the one that hasn't finished (has no datetime)
      $modifier->join_current_stage( 'reqn.id', 'current_stage' );
      $modifier->join(
        'stage_type',
        'current_stage.stage_type_id',
        'current_stage_type.id',
        '',
        'current_stage_type'
      );
    }
    else
    {
      // create a temp table with the start/end datetimes of all stages
      $reqn_class_name::db()->execute( sprintf(
        'CREATE TEMPORARY TABLE temp_stage_sort '.
        'SELECT '.
          'amendment_id, stage_type_id, '.
          'DATE( IFNULL( CONVERT_TZ( datetime, "UTC", "%s" ), create_timestamp ) ) as date '.
        'FROM stage '.
        'ORDER BY amendment_id, datetime IS NULL, datetime', // sort by datetime, putting NULL values at the end
        $db_application->timezone
      ) );
      $reqn_class_name::db()->execute( 'SET @d = NULL' );
      $reqn_class_name::db()->execute(
        'CREATE TEMPORARY TABLE temp_stage '.
        'SELECT '.
          'amendment_id, '.
          'stage_type_id, '.
          'CAST( IF(stage_type_id=1, NULL, @d) AS date ) AS start_date, '.
          'CAST( @d := date AS date ) AS end_date '.
        'FROM temp_stage_sort'
      );
      $reqn_class_name::db()->execute(
        'ALTER TABLE temp_stage '.
        'ADD INDEX dk_amendment_id (amendment_id), '.
        'ADD INDEX dk_start_date (start_date), '.
        'ADD INDEX dk_end_date (end_date)'
      );

      // now join to the current stage by type and date-span
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'reqn_current_amendment.amendment_id', '=', 'temp_stage.amendment_id', false );
      $join_mod->where( 'temp_stage.stage_type_id', '=', $stage_type_id );

      // restrict by date-span, if required
      if( !is_null( $date_span_type ) )
      {
        $date_column = 'Start' == $date_span_type ? 'start_date' : 'end_date';
        if( !is_null( $start_date ) )
        {
          // the stage finish date may be NULL if it hasn't been finished yet
          $join_mod->where(
            sprintf( 'IFNULL( temp_stage.%s, "%s")', $date_column, $start_date ),
            '>=',
            $start_date
          );
        }
        if( !is_null( $end_date ) )
        {
          $join_mod->where( sprintf( 'temp_stage.%s', $date_column ), '<=', $end_date );
        }
      }

      $modifier->join_modifier( 'temp_stage', $join_mod );
    }

    // join to the applicant and trainee users and contries
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'country', 'reqn_version.applicant_country_id', 'country.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->left_join( 'country', 'reqn_version.trainee_country_id', 'trainee_country.id', 'trainee_country' );

    // join to a temp table containing the total fee
    $fee_sel = lib::create( 'database\select' );
    $fee_sel->from( 'amendment' );
    $fee_sel->add_column( 'reqn_id' );
    $fee_sel->add_column(
      'CONCAT( "$", SUM( IFNULL( amendment.override_fee, amendment.fee ) ) )',
      'total_fee',
      false
    );
    $fee_mod = lib::create( 'database\modifier' );
    $fee_mod->group( 'reqn_id' );
    $modifier->left_join(
      sprintf( '( %s %s ) AS fees', $fee_sel->get_sql(), $fee_mod->get_sql() ),
      'reqn.id',
      'fees.reqn_id'
    );

    // join to a temp table containing all coapplicants
    $coapplicant_sel = lib::create( 'database\select' );
    $coapplicant_sel->from( 'coapplicant' );
    $coapplicant_sel->add_column( 'reqn_version_id' );
    $coapplicant_sel->add_column(
      'GROUP_CONCAT( DISTINCT coapplicant.affiliation ORDER BY coapplicant.affiliation SEPARATOR "; " )',
      'list',
      false
    );
    $coapplicant_mod = lib::create( 'database\modifier' );
    $coapplicant_mod->group( 'coapplicant.reqn_version_id' );
    $modifier->left_join(
      sprintf( '( %s %s ) AS coapplicants', $coapplicant_sel->get_sql(), $coapplicant_mod->get_sql() ),
      'reqn_version.id',
      'coapplicants.reqn_version_id'
    );

    $modifier->order( 'reqn.identifier' );

    // build the select
    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'Identifier', 'Identifier' );

    if( is_null( $stage_type_id ) )
    {
      $select->add_column( 'current_stage_type.name', 'Stage', false );
    }
    else
    {
      $select->add_column( 'temp_stage.start_date', 'Stage Start', false );
      $select->add_column( 'temp_stage.end_date', 'Stage End', false );
    }

    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Institution', false );
    $select->add_column( 'country.name', 'Country', false );
    $select->add_column( 'user.email', 'Email', false );

    $select->add_column(
      'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )',
      'Trainee',
      false
    );
    $select->add_column( 'reqn_version.trainee_program', 'Trainee Program', false );
    $select->add_column( 'reqn_version.trainee_level', 'Trainee Level', false );
    $select->add_column( 'reqn_version.trainee_institution', 'Trainee Institution', false );
    $select->add_column( 'trainee_country.name', 'Trainee Country', false );
    $select->add_column( 'trainee_user.email', 'Trainee Email', false );
    $select->add_column( 'IF(reqn_version.trainee_project, "Yes", "No")', 'Trainee Project', false );
    $select->add_column( 'IF(reqn_version.waiver, "Yes", "No")', 'Fee Waiver', false );
    $select->add_column( 'IF( reqn.show_prices, fees.total_fee, "N/A" )', 'Total Fee', false );

    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'reqn_version.ethics', 'Ethics', false );
    $select->add_column( 'keywords', 'Keywords', false );
    $select->add_column( 'coapplicants.list', 'Project Team Institutions', false );

    $header = [];
    $rows = [];
    foreach( $reqn_class_name::select( $select, $modifier ) as $row )
    {
      $rows[] = array_values( $row );
      if( 0 == count( $header ) )
        foreach( $row as $column => $value ) $header[] = ucwords( str_replace( '_', ' ', $column ) );
    }

    $this->add_table( NULL, $header, $rows );
  }
}
