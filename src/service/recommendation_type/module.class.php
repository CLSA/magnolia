<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\recommendation_type;
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

    if( $select->has_column( 'review_type_id_list' ) )
    {   
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'review_type_has_recommendation_type' );
      $join_sel->add_column( 'recommendation_type_id' );
      $join_sel->add_column( 'GROUP_CONCAT( review_type_id )', 'review_type_id_list', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->group( 'recommendation_type_id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS recommendation_type_join_review_type', $join_sel->get_sql(), $join_mod->get_sql() ),
        'recommendation_type.id',
        'recommendation_type_join_review_type.recommendation_type_id' );
      $select->add_column( 'IFNULL( review_type_id_list, "" )', 'review_type_id_list', false );
    }   
  }
}
