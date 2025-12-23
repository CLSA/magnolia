<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_selection;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
    $modifier->join( 'study_phase', 'data_selection.study_phase_id', 'study_phase.id' );
    $modifier->join( 'study', 'study_phase.study_id', 'study.id' );
    if( $select->has_table_columns( 'data_category' ) )
      $modifier->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );

    if( $select->has_column( 'is_unavailable' ) )
      $select->add_column( 'unavailable_en IS NOT NULL AND unavailable_fr IS NOT NULL', 'is_unavailable', false );

    $reqn_version_id = $this->get_argument( 'reqn_version_id', NULL );
    if( !is_null( $reqn_version_id ) )
    {
      // add the fee for the selected reqn_version
      $db_amendment = lib::create( 'database\reqn_version', $reqn_version_id )->get_amendment();
      $modifier->join(
        'data_selection_fee_schedule',
        'data_selection.id',
        'data_selection_fee_schedule.data_selection_id'
      );
      $modifier->where( 'data_selection_fee_schedule.fee_schedule_id', '=', $db_amendment->fee_schedule_id );
      $select->add_table_column( 'data_selection_fee_schedule', 'fee' );

      // add the fee and whether the reqn_version has selected each record
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'data_selection.id', '=', 'reqn_version_has_data_selection.data_selection_id', false );
      $join_mod->where( 'reqn_version_has_data_selection.reqn_version_id', '=', $reqn_version_id );
      $modifier->join_modifier( 'reqn_version_has_data_selection', $join_mod, 'left' );
      $select->add_column(
        'reqn_version_has_data_selection.reqn_version_id IS NOT NULL',
        'selected',
        false,
        'boolean'
      );
    }
  }
}
