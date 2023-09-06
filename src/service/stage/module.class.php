<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\stage;
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

    $modifier->join( 'reqn', 'stage.reqn_id', 'reqn.id' );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->left_join( 'user', 'stage.user_id', 'user.id' );

    if( $select->has_column( 'amendment' ) )
      $select->add_column( 'REPLACE( stage.amendment, ".", "no" )', 'amendment', false );

    if( $select->has_column( 'user_full_name' ) )
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'user_full_name', false );

    // only show open stages when getting a list of stages belonging to a stage-type
    if( 'stage_type' == $this->get_parent_subject() ) $modifier->where( 'stage.datetime', '=', NULL );
  }
}
