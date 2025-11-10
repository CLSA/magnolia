<?php
/**
 * amendment.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * amendment: record
 */
class amendment extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    $fees_changed = $this->has_column_changed( 'fee_schedule_id' );

    parent::save();

    if( $fees_changed )
    {
      $this->update_fee();
    }
  }

  /**
   * Returns this reqn's latest reqn_version record
   * 
   * @access public
   */
  public function get_current_reqn_version()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query amendment with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'amendment_current_reqn_version' );
    $select->add_column( 'reqn_version_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'amendment_id', '=', $this->id );

    $reqn_version_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $reqn_version_id ? lib::create( 'database\reqn_version', $reqn_version_id ) : NULL;
  }

  /**
   * Update's the amendments fee by calculating it from its newest reqn_version
   */
  public function update_fee()
  {
    $db_reqn = $this->get_reqn();
    $db_reqn_version = $this->get_current_reqn_version();
    $db_base_amendment = static::get_unique_record( ['reqn_id', 'name'], [$this->reqn_id, '.'] );
    $db_base_fee_schedule = $db_base_amendment->get_fee_schedule();

    $fee = 0;

    // only calculate if there isn't a special waiver
    if( is_null( $db_reqn->special_fee_waiver_id ) )
    {
      // if the version hasn't been created yet then just assume a national fee
      $waive_fee = false;
      $international = false;
      $fee = $db_base_fee_schedule->fee_national;
      if( !is_null( $db_reqn_version ) )
      {
        $waive_fee = !is_null( $db_reqn_version->waiver ) && 'none' != $db_reqn_version->waiver;
        $international = $db_reqn_version->is_international();
        $fee = (
          $international ?
          $db_base_fee_schedule->fee_international :
          ($db_reqn->trainee_user_id && $waive_fee ? 0 : $db_base_fee_schedule->fee_national)
        );
      }

      // add amendment fees (including all past amendments) if there is no fee waiver
      if( !$waive_fee )
      {
        $reqn_sel = lib::create( 'database\select' );
        $reqn_sel->from( 'reqn' );
        $reqn_sel->add_column(
          sprintf( 'SUM(fee_%s)', $international ? 'international' : 'national' ),
          'total_fee',
          false
        );
        $reqn_mod = lib::create( 'database\modifier' );
        $reqn_mod->join( 'amendment', 'reqn.id', 'amendment.reqn_id' );
        $reqn_mod->join(
          'amendment_current_reqn_version',
          'amendment.id',
          'amendment_current_reqn_version.amendment_id'
        );
        $reqn_mod->join(
          'reqn_version_has_amendment_type',
          'amendment_current_reqn_version.reqn_version_id',
          'reqn_version_has_amendment_type.reqn_version_id'
        );
        $join_mod = lib::create( 'database\modifier' );
        $join_mod->where(
          'reqn_version_has_amendment_type.amendment_type_id',
          '=',
          'amendment_type_fee_schedule.amendment_type_id',
          false
        );
        $join_mod->where(
          'amendment.fee_schedule_id',
          '=',
          'amendment_type_fee_schedule.fee_schedule_id',
          false
        );
        $reqn_mod->join_modifier( 'amendment_type_fee_schedule', $join_mod );
        $reqn_mod->where( 'amendment.name', '<=', $this->name );
        $reqn_mod->where( 'reqn.id', '=', $this->reqn_id );

        $fee += static::db()->get_one( sprintf(
          '%s %s',
          $reqn_sel->get_sql(),
          $reqn_mod->get_sql()
        ) );
      }

      // add the cost of all data selections for the amendment's current reqn_version
      $data_selection_sel = lib::create( 'database\select' );
      $data_selection_sel->from( 'amendment' );
      $data_selection_sel->add_column(
        'IF( cost_combined, MAX(data_selection_fee_schedule.fee), SUM(data_selection_fee_schedule.fee) )',
        'total_fee',
        false
      );
      $data_selection_mod = lib::create( 'database\modifier' );
      $data_selection_mod->join(
        'amendment_current_reqn_version',
        'amendment.id',
        'amendment_current_reqn_version.amendment_id'
      );
      $data_selection_mod->join(
        'reqn_version',
        'amendment_current_reqn_version.reqn_version_id',
        'reqn_version.id'
      );
      $data_selection_mod->join(
        'reqn_version_has_data_selection',
        'reqn_version.id',
        'reqn_version_has_data_selection.reqn_version_id'
      );
      $data_selection_mod->join(
        'data_selection',
        'reqn_version_has_data_selection.data_selection_id',
        'data_selection.id'
      );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'data_selection.id', '=', 'data_selection_fee_schedule.data_selection_id', false );
      $join_mod->where( 'data_selection_fee_schedule.fee_schedule_id', '=', 'amendment.fee_schedule_id', false );
      $data_selection_mod->join_modifier( 'data_selection_fee_schedule', $join_mod );

      $data_selection_mod->where( 'amendment.id', '=', $this->id );
      $data_selection_mod->group( 'data_selection.data_option_id' );

      $data_selection_fee_list = static::db()->get_col( sprintf(
        '%s %s',
        $data_selection_sel->get_sql(),
        $data_selection_mod->get_sql()
      ) );

      foreach( $data_selection_fee_list as $total_fee ) $fee += $total_fee;

      // add any additional fees
      $additional_fee_sel = lib::create( 'database\select' );
      $additional_fee_sel->from( 'amendment' );
      $additional_fee_sel->add_column( 'SUM( additional_fee_fee_schedule.fee )', 'total_fee', false );
      $additional_fee_mod = lib::create( 'database\modifier' );
      $additional_fee_mod->join(
        'reqn_has_additional_fee',
        'amendment.reqn_id',
        'reqn_has_additional_fee.reqn_id'
      );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where(
        'reqn_has_additional_fee.additional_fee_id',
        '=',
        'additional_fee_fee_schedule.additional_fee_id',
        false
      );
      $join_mod->where( 'additional_fee_fee_schedule.fee_schedule_id', '=', 'amendment.fee_schedule_id', false );
      $additional_fee_mod->join_modifier( 'additional_fee_fee_schedule', $join_mod );
      $additional_fee_mod->where( 'amendment.id', '=', $this->id );

      $fee += static::db()->get_one( sprintf(
        '%s %s',
        $additional_fee_sel->get_sql(),
        $additional_fee_mod->get_sql()
      ) );
    }

    // now subtract the total fee of all previous amendment
    $amendment_sel = lib::create( 'database\select' );
    $amendment_sel->add_column( 'IFNULL( SUM( fee ), 0 )', 'total_fee', false );
    $amendment_mod = lib::create( 'database\modifier' );
    $amendment_mod->where( 'reqn_id', '=', $this->reqn_id );
    $amendment_mod->where( 'name', '<', $this->name );
    $total_fee = current( static::select( $amendment_sel, $amendment_mod ) )['total_fee'];

    $this->fee = $fee - $total_fee;
    $this->save();
  }

  /**
   * Determines the next amendment name
   */
  public function get_next_amendment_name()
  {
    $name = $this->name;
    return '.' == $name ? 'A' : ++$name;
  }
}
