<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn_version\data_selection;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Extends parent class
 */
class query extends \cenozo\service\query
{
  /**
   * Extends parent method
   */
  protected function get_record_count()
  {
    if( $this->get_argument( 'full', false ) )
    {
      $data_selection_class_name = lib::get_class_name( 'database\data_selection' );
      $modifier = clone $this->modifier;

      // find aliases in the select and translate them in the modifier
      $this->select->apply_aliases_to_modifier( $modifier );

      return $data_selection_class_name::count( $modifier );
    }

    return parent::get_record_count();
  }

  /**
   * Extends parent method
   */
  protected function get_record_list()
  {
    if( $this->get_argument( 'full', false ) )
    {
      $data_selection_class_name = lib::get_class_name( 'database\data_selection' );
      $db_reqn_version = $this->get_parent_record();
      $db_amendment = $db_reqn_version->get_amendment();

      $modifier = clone $this->modifier;

      // join to the amendment's fee schedule and add the fee to the selection
      $modifier->join(
        'data_selection_fee_schedule',
        'data_selection.id',
        'data_selection_fee_schedule.data_selection_id'
      );
      $modifier->where( 'data_selection_fee_schedule.fee_schedule_id', '=', $db_amendment->fee_schedule_id );
      $this->select->add_table_column( 'data_selection_fee_schedule', 'fee' );

      // left join to whether the reqn_version has selected the data_selection
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'data_selection.id', '=', 'reqn_version_has_data_selection.data_selection_id', false );
      $join_mod->where( 'reqn_version_has_data_selection.reqn_version_id', '=', $db_reqn_version->id );
      $modifier->join_modifier( 'reqn_version_has_data_selection', $join_mod, 'left' );
      $this->select->add_column(
        'reqn_version_has_data_selection.reqn_version_id IS NOT NULL',
        'selected',
        false,
        'boolean'
      );

      // find aliases in the select and translate them in the modifier
      $this->select->apply_aliases_to_modifier( $modifier );

      return $data_selection_class_name::select( $this->select, $modifier );
    }

    return parent::get_record_list();
  }
}
