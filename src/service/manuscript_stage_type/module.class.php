<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_stage_type;
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

    $modifier->left_join(
      'notification_type',
      'manuscript_stage_type.notification_type_id',
      'notification_type.id'
    );

    // add the total number of manuscripts
    if( $select->has_column( 'manuscript_count' ) )
    {
      // we can't use parent::add_count_column() since we have to restrict to open manuscript_stages
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'manuscript_stage_type' );
      $join_sel->add_column( 'id', 'manuscript_stage_type_id' );
      $join_sel->add_column(
        'IF( manuscript_stage.manuscript_id IS NOT NULL, COUNT(*), 0 )',
        'manuscript_count',
        false
      );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->left_join(
        'manuscript_stage',
        'manuscript_stage_type.id',
        'manuscript_stage.manuscript_stage_type_id'
      );
      $join_mod->group( 'manuscript_stage_type.id' );
      $join_mod->where( 'manuscript_stage.datetime', '=', NULL ); // only include open stages

      $modifier->left_join(
        sprintf(
          '( %s %s ) AS manuscript_stage_type_join_manuscript_stage',
          $join_sel->get_sql(),
          $join_mod->get_sql()
        ),
        'manuscript_stage_type.id',
        'manuscript_stage_type_join_manuscript_stage.manuscript_stage_type_id'
      );
      $select->add_column( 'IFNULL( manuscript_count, 0 )', 'manuscript_count', false );
    }
  }
}
