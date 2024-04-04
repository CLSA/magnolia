<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_stage;
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

    $modifier->join( 'manuscript', 'manuscript_stage.manuscript_id', 'manuscript.id' );
    $modifier->join(
      'manuscript_stage_type',
      'manuscript_stage.manuscript_stage_type_id',
      'manuscript_stage_type.id'
    );
    $modifier->left_join( 'user', 'manuscript_stage.user_id', 'user.id' );

    if( $select->has_column( 'user_full_name' ) )
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'user_full_name', false );

    // only show open stages when getting a list of stages belonging to a stage-type
    if( 'manuscript_stage_type' == $this->get_parent_subject() )
      $modifier->where( 'manuscript_stage.datetime', '=', NULL );
  }
}
