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

    // update the paid status when overriding the fee
    if( $this->has_column_changed( 'override_fee' ) )
    {
      if( is_null( $this->paid ) && 0 < $this->override_fee ) $this->paid = false;
      else if(
        !is_null( $this->paid ) &&
        ( is_null( $this->override_fee ) || 0 >= $this->override_fee )
      ) $this->paid = NULL;
    }

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

      if( !is_null( $db_reqn_version ) )
      {
        // Go through each data selection and create a list of the following for each:
        // - which amendment first added it
        // - is the option's cost combined
        // - the fee for the selection
        $amendment_list = [];
        $data_selection_sel = lib::create( 'database\select' );
        $data_selection_sel->add_column( 'id' );
        foreach( $db_reqn_version->get_data_selection_list( $data_selection_sel ) as $data_selection )
        {
          $first_sel = lib::create( 'database\select' );
          $first_sel->from( 'amendment' );
          $first_sel->add_column( 'MIN( amendment.name )', 'name', false );
          $first_mod = lib::create( 'database\modifier' );
          $first_mod->join(
            'amendment_current_reqn_version',
            'amendment.id',
            'amendment_current_reqn_version.amendment_id'
          );
          $first_mod->join(
            'reqn_version',
            'amendment_current_reqn_version.reqn_version_id',
            'reqn_version.id'
          );
          $first_mod->join(
            'reqn_version_has_data_selection',
            'reqn_version.id',
            'reqn_version_has_data_selection.reqn_version_id'
          );
          $first_mod->where( 'amendment.reqn_id', '=', $db_reqn->id );
          $first_mod->where( 'reqn_version_has_data_selection.data_selection_id', '=', $data_selection['id'] );

          $name = static::db()->get_one( sprintf(
            '%s %s',
            $first_sel->get_sql(),
            $first_mod->get_sql()
          ) );
          $db_first_amendment = static::get_unique_record( ['reqn_id', 'name'], [$db_reqn->id, $name] );
          if( !array_key_exists( $db_first_amendment->id, $amendment_list ) )
            $amendment_list[$db_first_amendment->id] = [];

          $data_selection_sel = lib::create( 'database\select' );
          $data_selection_sel->from( 'data_selection_fee_schedule' );
          $data_selection_sel->add_table_column( 'data_option', 'id', 'data_option_id' );
          $data_selection_sel->add_table_column( 'data_option', 'name_en' );
          $data_selection_sel->add_table_column( 'data_option', 'cost_combined' );
          $data_selection_sel->add_table_column( 'data_selection_fee_schedule', 'fee' );
          $data_selection_mod = lib::create( 'database\modifier' );
          $data_selection_mod->join(
            'data_selection',
            'data_selection_fee_schedule.data_selection_id',
            'data_selection.id'
          );
          $data_selection_mod->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
          $data_selection_mod->where(
            'data_selection_fee_schedule.fee_schedule_id',
            '=',
            $db_first_amendment->fee_schedule_id
          );
          $data_selection_mod->where( 'data_selection.id', '=', $data_selection['id'] );
          $row = static::db()->get_row( sprintf(
            '%s %s',
            $data_selection_sel->get_sql(),
            $data_selection_mod->get_sql()
          ) );

          if( 0 != $row['fee'] )
          {
            if( !array_key_exists( $row['data_option_id'], $amendment_list[$db_first_amendment->id] ) )
              $amendment_list[$db_first_amendment->id][$row['data_option_id']] = 0;

            if( 1 == $row['cost_combined'] )
            {
              // use the max fee
              $amendment_list[$db_first_amendment->id][$row['data_option_id']] = max(
                $row['fee'],
                $amendment_list[$db_first_amendment->id][$row['data_option_id']]
              );
            }
            else
            {
              // sum all of the fees
              $amendment_list[$db_first_amendment->id][$row['data_option_id']] += $row['fee'];

            }
          }
        }

        // Now add the fee for each amendment
        foreach( $amendment_list as $data_option ) foreach( $data_option as $combined_fee ) $fee += $combined_fee;
      }

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
      $join_mod->where( 'additional_fee_fee_schedule.fee_schedule_id', '=', $db_base_fee_schedule->id );
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

    // check if the paid status has to be updated
    if( is_null( $this->override_fee ) )
    {
      if( is_null( $this->paid ) && 0 < $this->fee ) $this->paid = false;
      else if( !is_null( $this->paid ) && 0 >= $this->fee ) $this->paid = NULL;
    }

    $this->save();
  }

  /**
   * Determines the previous amendment name
   * @return string
   */
  public function get_previous_amendment_name()
  {
    $name = $this->name;
    return (
      '.' == $name ? NULL :
      ( 'A' == $name ? '.' : --$name )
    );
  }

  /**
   * Determines the next amendment name
   * @return string
   */
  public function get_next_amendment_name()
  {
    $name = $this->name;
    return '.' == $name ? 'A' : ++$name;
  }

  /**
   * Get the previous amendment
   * @return database\amendment
   */
  public function get_previous_amendment()
  {
    $prev_amendment_name = $this->get_previous_amendment_name();
    return is_null( $prev_amendment_name ) ? NULL : static::get_unique_record(
      ['reqn_id', 'name'],
      [$this->reqn_id, $prev_amendment_name]
    );
  }

  /**
   * Get the next amendment
   * @return database\amendment
   */
  public function get_next_amendment()
  {
    $prev_amendment_name = $this->get_next_amendment_name();
    return is_null( $prev_amendment_name ) ? NULL : static::get_unique_record(
      ['reqn_id', 'name'],
      [$this->reqn_id, $prev_amendment_name]
    );
  }
}
