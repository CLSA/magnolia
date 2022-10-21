<?php
/**
 * communications.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class communications extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    $data = array();

    $select = lib::create( 'database\select' );
    $modifier = lib::create( 'database\modifier' );

    $select->from( 'reqn' );

    // only display reqns in the Communications Review stage
    $modifier->join( 'stage', 'reqn.id', 'stage.reqn_id' );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'stage_type.name', '=', 'Communications Review' );

    // join to tables that include columns in the report
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'reqn_current_final_report', 'reqn.id', 'reqn_current_final_report.reqn_id' );
    $modifier->join( 'final_report', 'reqn_current_final_report.final_report_id', 'final_report.id' );
    $modifier->left_join( 'output', 'reqn.id', 'output.reqn_id' );
    $modifier->left_join( 'output_type', 'output.output_type_id', 'output_type.id' );
    $modifier->group( 'reqn.id' );
    $modifier->order( 'reqn.identifier' );

    $select->add_column( 'Identifier', 'Identifier' );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'reqn_version.keywords', 'Keywords', false ); 
    $select->add_column( 'GROUP_CONCAT( output_type.name_en ORDER BY output_type.name_en )', 'Outputs', false );
    $select->add_column( 'final_report.thesis_title', 'Thesis Title', false );
    $select->add_column( 'final_report.thesis_status', 'Thesis Status', false );
    $select->add_column( 'final_report.findings', 'Findings', false );
      
    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}
