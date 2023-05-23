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
    $today = util::get_datetime_object();

    $data = array();

    // apply the custom restriction to the stage type (must be in or have been in)
    $stage_type_id = NULL;
    foreach( $this->get_restriction_list() as $restriction )
    {
      if( 'stage_type' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $stage_type_id = $restriction['value'];
      }
    }

    // build the modifier
    $modifier = lib::create( 'database\modifier' );

    // join to the current stage's type
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

    // join to the current version
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );

    // join to the applicant and trainee users and contries
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'country', 'reqn_version.applicant_country_id', 'country.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->left_join( 'country', 'reqn_version.trainee_country_id', 'trainee_country.id', 'trainee_country' );

    // join to all coapplicants
    $modifier->left_join( 'coapplicant', 'reqn_version.id', 'coapplicant.reqn_version_id' );

    $modifier->group( 'reqn.id' );
    $modifier->order( 'reqn.identifier' );

    if( !is_null( $stage_type_id ) ) $modifier->where( 'stage_type.id', '=', $stage_type_id );

    // build the select
    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'Identifier', 'Identifier' );

    if( is_null( $stage_type_id ) ) $select->add_column( 'stage_type.name', 'Stage', false );
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
    $select->add_column( 'reqn_version.trainee_institution', 'Trainee Institution', false );
    $select->add_column( 'trainee_country.name', 'Trainee Country', false );
    $select->add_column( 'trainee_user.email', 'Trainee Email', false );

    $select->add_column( 'IF( reqn.show_prices, "", "N/A" )', 'Cost', false );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'reqn_version.ethics', 'Ethics', false );

    $select->add_column( 'keywords', 'Keywords', false );
    $select->add_column(
      'GROUP_CONCAT( DISTINCT coapplicant.affiliation ORDER BY coapplicant.affiliation SEPARATOR "; " )',
      'Project Team Institutions',
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

      // determine the cost
      if( 'N/A' != $row['Cost'] )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $row['Identifier'] );
        $row['Cost'] = $db_reqn->get_current_reqn_version()->calculate_cost();
      }

      $rows[] = array_values( $row );
    }

    $this->add_table( NULL, $header, $rows );
  }
}
