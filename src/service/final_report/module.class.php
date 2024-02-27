<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\final_report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    if( $this->service->may_continue() && 'PATCH' == $this->get_method() )
    {
      // don't allow DAO to make any changes
      if( 'dao' == lib::create( 'business\session' )->get_role()->name )
      {
        $this->get_status()->set_code( 403 );
        return;
      }
    }
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'reqn', 'final_report.reqn_id', 'reqn.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'language', 'reqn.language_id', 'language.id' );
    $modifier->join( 'reqn_current_destruction_report', 'reqn.id', 'reqn_current_destruction_report.reqn_id' );
    $modifier->left_join(
      'destruction_report',
      'reqn_current_destruction_report.destruction_report_id',
      'destruction_report.id'
    );

    if( $select->has_table_columns( 'stage' ) || $select->has_table_columns( 'stage_type' ) )
    {
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
      $join_mod->where( 'stage.datetime', '=', NULL );
      $modifier->join_modifier( 'stage', $join_mod );
      $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    }

    $db_final_report = $this->get_resource();
    if( !is_null( $db_final_report ) )
    {
      if( $select->has_column( 'has_changed' ) )
        $select->add_constant( $db_final_report->has_changed(), 'has_changed', 'boolean' );
    }
  }
}
