<?php
/**
 * conflict_of_interest.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class conflict_of_interest extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    $data = array();

    $base_sel = lib::create( 'database\select' );
    $base_sel->from( 'reqn' );
    $base_sel->add_column( 'Identifier', 'Identifier' );

    // deadline must have passed
    $base_mod = lib::create( 'database\modifier' );
    $base_mod->join( 'deadline', 'reqn.deadline_id', 'deadline.id' );
    $base_mod->where( 'deadline.datetime', '<', util::get_datetime_object() );

    // current stage must be admin, feasibility or dsac
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $base_mod->join_modifier( 'stage', $join_mod );
    $base_mod->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $base_mod->where( 'stage_type.name', 'IN', array( 'Admin Review', 'Feasibility Review', 'DSAC Selection', 'DSAC Review' ) );

    // join to the current version and order by the identifier
    $base_mod->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $base_mod->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $base_mod->order( 'reqn.identifier' );

    // add the applicant
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $select = clone( $base_sel );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Name', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Institution', false );

    $modifier = clone( $base_mod );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );

    $data = array_merge( $data, $reqn_class_name::select( $select, $modifier ) );
      
    // add the trainee (if there is one)
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $select = clone( $base_sel );
    $select->add_column( 'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )', 'Name', false );
    $select->add_column( 'reqn_version.trainee_institution', 'Institution', false );

    $modifier = clone( $base_mod );
    $modifier->join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', '', 'trainee_user' );
      
    $data = array_merge( $data, $reqn_class_name::select( $select, $modifier ) );

    // add all coapplicants
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $select = clone( $base_sel );
    $select->add_column( 'REPLACE( REPLACE( coapplicant.name, "Dr. ", "" ), "Dr ", "" )', 'Name', false );
    $select->add_column( 'coapplicant.affiliation', 'Institution', false );

    $modifier = clone( $base_mod );
    $modifier->join( 'coapplicant', 'reqn_current_reqn_version.reqn_version_id', 'coapplicant.reqn_version_id' );
      
    $data = array_merge( $data, $reqn_class_name::select( $select, $modifier ) );

    // Now organize the results
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $applicant_data = array();
    // combine applicants with multiple entries
    foreach( $data as $row )
    {
      if( !array_key_exists( $row['Name'], $applicant_data ) )
      {
        $applicant_data[$row['Name']] = $row;
        $applicant_data[$row['Name']]['identifier_list'] = array( $row['Identifier'] );
      }
      else
      {
        $applicant_data[$row['Name']]['identifier_list'][] = $row['Identifier'];
      }
    }

    // sort the identifiers and join them using a semicolon
    foreach( $applicant_data as &$row )
    {
      sort( $row['identifier_list'] );
      $row['Identifier'] = implode( '; ', $row['identifier_list'] );
      unset( $row['identifier_list'] );
    }

    usort( $applicant_data, function ( $row1, $row2 ) {
      return $row1['Identifier'] <=> $row2['Identifier'];
    } );

    $this->add_table_from_select( NULL, array_values( $applicant_data ) );
  }
}
