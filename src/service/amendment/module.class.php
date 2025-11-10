<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\amendment;
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

    $modifier->join( 'reqn', 'amendment.reqn_id', 'reqn.id' );
    $modifier->join(
      'amendment_current_reqn_version',
      'amendment.id',
      'amendment_current_reqn_version.amendment_id'
    );
    $modifier->join( 'reqn_version', 'amendment_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'fee_schedule', 'amendment.fee_schedule_id', 'fee_schedule.id' );

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'amendment.id', '=', 'first_reqn_version.amendment_id', false );
    $join_mod->where( 'first_reqn_version.version', '=', 1 );
    $modifier->join_modifier( 'reqn_version', $join_mod, '', 'first_reqn_version' );

    if( $select->has_column( 'formatted_name' ) )
      $select->add_column( 'IF("." = amendment.name, "(N/A)", amendment.name)', 'formatted_name', false );

    if( $select->has_column( 'has_agreement' ) )
      $select->add_column( 'reqn_version.agreement_filename IS NOT NULL', 'has_agreement', false, 'boolean' );
  }
}
