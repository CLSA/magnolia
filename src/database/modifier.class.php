<?php
/**
 * modifier.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * modifier: record
 */
class modifier extends \cenozo\database\modifier
{
  /**
   * A convenience method to join a reqn to its current stage
   * @param string $reqn_id_column: The column in the modifier referencing the reqn.id column
   * @param string $alias: An alias for the stage table
   * @param boolean $prepend: Whether to prepend the join
   */
  public function join_current_stage( $reqn_id_column = 'reqn.id', $alias = NULL, $type = '', $prepend = false )
  {
    $stage_table_name = is_null( $alias ) ? 'stage' : $alias;
    if( $prepend )
    {
      // prepend all joins in reverse order
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where(
        'amendment_for_current_stage.id',
        '=',
        sprintf( '%s.amendment_id', $stage_table_name ),
        false
      );
      $join_mod->where( sprintf( '%s.datetime', $stage_table_name ), '=', NULL );
      $this->join_modifier( 'stage', $join_mod, $type, $alias, true );
      $this->join(
        'amendment',
        $reqn_id_column,
        'amendment_for_current_stage.reqn_id',
        $type,
        'amendment_for_current_stage',
        true // prepend
      );
    }
    else
    {
      $this->join(
        'amendment',
        $reqn_id_column,
        'amendment_for_current_stage.reqn_id',
        $type,
        'amendment_for_current_stage'
      );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where(
        'amendment_for_current_stage.id',
        '=',
        sprintf( '%s.amendment_id', $stage_table_name ),
        false
      );
      $join_mod->where( sprintf( '%s.datetime', $stage_table_name ), '=', NULL );
      $this->join_modifier( 'stage', $join_mod, $type, $alias );
    }
  }

  /**
   * A convenience method to join a reqn to its current reqn_version
   * @param string $reqn_id_column: The column in the modifier referencing the reqn.id column
   * @param string $alias: An alias for the reqn_version table
   * @param boolean $prepend: Whether to prepend the join
   */
  public function join_current_reqn_version( $reqn_id_column = 'reqn.id', $alias = NULL, $prepend = false )
  {
    $reqn_version_table_name = is_null( $alias ) ? 'reqn_version' : $alias;
    if( $prepend )
    {
      // prepend all joins in reverse order
      $this->join(
        'reqn_version',
        'amendment_current_reqn_version.reqn_version_id',
        sprintf( '%s.id', $reqn_version_table_name ),
        '',
        $alias,
        true // prepend
      );
      $this->join(
        'amendment_current_reqn_version',
        'reqn_current_amendment.amendment_id',
        'amendment_current_reqn_version.amendment_id',
        '',
        NULL,
        true // prepend
      );
      $this->join(
        'reqn_current_amendment',
        $reqn_id_column,
        'reqn_current_amendment.reqn_id',
        '',
        NULL,
        true // prepend
      );
    }
    else
    {
      $this->join(
        'reqn_current_amendment',
        $reqn_id_column,
        'reqn_current_amendment.reqn_id'
      );
      $this->join(
        'amendment_current_reqn_version',
        'reqn_current_amendment.amendment_id',
        'amendment_current_reqn_version.amendment_id'
      );
      $this->join(
        'reqn_version',
        'amendment_current_reqn_version.reqn_version_id',
        sprintf( '%s.id', $reqn_version_table_name ),
        '',
        $alias
      );
    }
  }

  /**
   * A convenience method to join a reqn to its last reqn_version with an agreement
   * @param string $reqn_id_column: The column in the modifier referencing the reqn.id column
   * @param string $alias: An alias for the reqn_version table
   * @param string $type: The type of join ('', 'left', etc)
   * @param boolean $prepend: Whether to prepend the join
   */
  public function join_last_reqn_version_with_agreement(
    $reqn_id_column = 'reqn.id',
    $alias = NULL,
    $type = '',
    $prepend = false
  ) {
    $reqn_version_table_name = is_null( $alias ) ? 'reqn_version' : $alias;
    if( $prepend )
    {
      // prepend all joins in reverse order
      $this->join(
        'reqn_version',
        'amendment_last_reqn_version.reqn_version_id',
        sprintf( '%s.id', $reqn_version_table_name ),
        $type,
        $alias,
        true // prepend
      );
      $this->join(
        'amendment_current_reqn_version',
        'reqn_last_amendment_with_agreement.amendment_id',
        'amendment_last_reqn_version.amendment_id',
        $type,
        'amendment_last_reqn_version',
        true // prepend
      );
      $this->join(
        'reqn_last_amendment_with_agreement',
        $reqn_id_column,
        'reqn_last_amendment_with_agreement.reqn_id',
        $type,
        NULL,
        true // prepend
      );
    }
    else
    {
      $this->join(
        'reqn_last_amendment_with_agreement',
        $reqn_id_column,
        'reqn_last_amendment_with_agreement.reqn_id',
        $type
      );
      $this->join(
        'amendment_current_reqn_version',
        'reqn_last_amendment_with_agreement.amendment_id',
        'amendment_last_reqn_version.amendment_id',
        $type,
        'amendment_last_reqn_version'
      );
      $this->join(
        'reqn_version',
        'amendment_last_reqn_version.reqn_version_id',
        sprintf( '%s.id', $reqn_version_table_name ),
        $type,
        $alias
      );
    }
  }
}
