<?php
/**
 * deadline_data_option.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
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
    $study_phase_class_name = lib::get_class_name( 'database\study_phase' );

    $study_id = $study_class_name::get_unique_record( 'name', 'CLSA' )->id;
    $bl_id = $study_phase_class_name::get_unique_record( array( 'study_id', 'code' ), array( $study_id, 'bl' ) )->id;
    $f1_id = $study_phase_class_name::get_unique_record( array( 'study_id', 'code' ), array( $study_id, 'f1' ) )->id;

    $select = lib::create( 'database\select' );
    $modifier = lib::create( 'database\modifier' );

    // join to all data options and the current reqn version
    $modifier->inner_join( 'data_option_category' );
    $modifier->join( 'data_option', 'data_option_category.id', 'data_option.data_option_category_id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );

    // only include reqns which aren't in certain stages
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'stage_type.name', 'NOT IN', array( 'New', 'Not Approved', 'Incomplete', 'Withdrawn' ) );

    // order by reqn, then data option
    $modifier->order( 'reqn.identifier' );
    $modifier->order( 'data_option_category.rank' );
    $modifier->order( 'data_option.rank' );

    // join to whether the reqn selected each data option for baseline
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'data_option.id', '=', 'bl_reqn_version_data_option.data_option_id', false );
    $join_mod->where( 'bl_reqn_version_data_option.study_phase_id', '=', $bl_id );
    $join_mod->where( 'bl_reqn_version_data_option.reqn_version_id', '=', 'reqn.id', false );
    $modifier->join_modifier( 'reqn_version_data_option', $join_mod, 'left', 'bl_reqn_version_data_option' );

    // join to whether the reqn selected each data option for follow-up 1
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'data_option.id', '=', 'f1_reqn_version_data_option.data_option_id', false );
    $join_mod->where( 'f1_reqn_version_data_option.study_phase_id', '=', $f1_id );
    $join_mod->where( 'f1_reqn_version_data_option.reqn_version_id', '=', 'reqn.id', false );
    $modifier->join_modifier( 'reqn_version_data_option', $join_mod, 'left', 'f1_reqn_version_data_option' );

    $this->apply_restrictions( $modifier );

    $select->from( 'reqn' );
    $select->add_column( 'identifier' );
    $select->add_table_column( 'data_option', 'name_en' );
    $select->add_table_column( 'bl_reqn_version_data_option', 'reqn_version_id IS NOT NULL', 'bl' );
    $select->add_table_column( 'f1_reqn_version_data_option', 'reqn_version_id IS NOT NULL', 'f1' );

    $header = array();
    $contents = array();
    $row = NULL;
    $first_identifier = NULL;
    $working_identifier = NULL;
    foreach( $reqn_class_name::select( $select, $modifier ) as $data )
    {
      if( $working_identifier == $data['identifier'] )
      { // if we're still on the same identifier then keep adding to the current row
        $row[] = $data['bl'] ? 'yes' : 'no';
        $row[] = $data['f1'] ? 'yes' : 'no';

        if( $first_identifier == $data['identifier'] )
        {
          $header[] = sprintf( '%s (bl)', $data['name_en'] );
          $header[] = sprintf( '%s (f1)', $data['name_en'] );
        }
      }
      else
      { // we're on a new identifier then add the existing row to the contents
        if( !is_null( $row ) ) $contents[] = $row;
        $row = array( $data['identifier'], $data['bl'] ? 'yes' : 'no', $data['f1'] ? 'yes' : 'no' );

        // build the header during the first identifier
        if( is_null( $first_identifier ) )
        {
          $header[] = 'Identifier';
          $header[] = sprintf( '%s (bl)', $data['name_en'] );
          $header[] = sprintf( '%s (f1)', $data['name_en'] );
          $first_identifier = $data['identifier'];
        }

        $working_identifier = $data['identifier'];
      }
    }

    // don't forget to add the last row
    if( !is_null( $row ) ) $contents[] = $row;

    $this->add_table( NULL, $header, $contents );
  }
}
