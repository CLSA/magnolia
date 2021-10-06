<?php
/**
 * deadline_data_option.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

class deadline_data_option extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $study_class_name = lib::get_class_name( 'database\study' );
    $data_category_class_name = lib::get_class_name( 'database\data_category' );

    $study_phase_id_list = array();
    foreach( $data_category_class_name::get_all_study_phase_list() as $db_study_phase )
      $study_phase_id_list[] = $db_study_phase->id;

    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'identifier' );
    $select->add_table_column( 'data_option', 'name_en' );
    $select->add_table_column( 'reqn_version_has_data_selection', 'reqn_version_id IS NOT NULL', 'selected' );
    $select->add_table_column( 'study', 'name', 'study' );
    $select->add_table_column( 'study_phase', 'code' );

    $modifier = lib::create( 'database\modifier' );

    // join to all study phases in use
    $modifier->inner_join( 'study_phase' );
    $modifier->join( 'study', 'study_phase.study_id', 'study.id' );
    $modifier->where( 'study_phase.id', 'IN', $study_phase_id_list );

    $modifier->join(
      'data_category_has_study_phase',
      'study_phase.id',
      'data_category_has_study_phase.study_phase_id'
    );
    $modifier->join(
      'data_category',
      'data_category_has_study_phase.data_category_id',
      'data_category.id'
    );
    $modifier->join( 'data_option', 'data_category.id', 'data_option.data_category_id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'data_option.id', '=', 'data_selection.data_option_id', false );
    $join_mod->where( 'study_phase.id', '=', 'data_selection.study_phase_id', false );
    $modifier->join_modifier( 'data_selection', $join_mod );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn_version.id', '=', 'reqn_version_has_data_selection.reqn_version_id', false );
    $join_mod->where( 'data_selection.id', '=', 'reqn_version_has_data_selection.data_selection_id', false );
    $modifier->join_modifier( 'reqn_version_has_data_selection', $join_mod, 'left' );

    // only include reqns which aren't in certain stages
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'stage_type.name', 'NOT IN', array( 'New', 'Not Approved', 'Incomplete', 'Withdrawn' ) );

    // order by reqn, then data option
    $modifier->order( 'reqn.identifier' );
    $modifier->order( 'data_category.rank' );
    $modifier->order( 'data_option.rank' );

    $this->apply_restrictions( $modifier );

    $header = array( 'Identifier' );
    $contents = array();
    $row = NULL;
    $first_identifier = NULL;
    $working_identifier = NULL;
    foreach( $reqn_class_name::select( $select, $modifier ) as $data )
    {
      if( $working_identifier == $data['identifier'] )
      { // if we're still on the same identifier then keep adding to the current row
        $row[] = $data['selected'] ? 'yes' : 'no';

        // build the header during the first identifier
        if( $first_identifier ) $header[] = sprintf( '%s (%s %s)', $data['name_en'], $data['study'], $data['code'] );
      }
      else
      { // we're on a new identifier then add the existing row to the contents
        $first_identifier = is_null( $first_identifier );
        if( !is_null( $row ) ) $contents[] = $row;

        // build the header during the first identifier
        if( $first_identifier ) $header[] = sprintf( '%s (%s %s)', $data['name_en'], $data['study'], $data['code'] );

        // now start a new row with the identifier and first data-selection's selected value
        $row = array( $data['identifier'], $data['selected'] ? 'yes' : 'no' );

        $working_identifier = $data['identifier'];
      }
    }

    // don't forget to add the last row
    if( !is_null( $row ) ) $contents[] = $row;

    $this->add_table( NULL, $header, $contents );
  }
}
