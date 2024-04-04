<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_recommendation_type;
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

    if( $select->has_column( 'manuscript_review_type_id_list' ) )
    {   
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'manuscript_review_type_has_manuscript_recommendation_type' );
      $join_sel->add_column( 'manuscript_recommendation_type_id' );
      $join_sel->add_column(
        'GROUP_CONCAT( manuscript_review_type_id )',
        'manuscript_review_type_id_list',
        false
      );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->group( 'manuscript_recommendation_type_id' );

      $modifier->left_join(
        sprintf(
          '( %s %s ) AS manuscript_recommendation_type_join_manuscript_review_type',
          $join_sel->get_sql(),
          $join_mod->get_sql()
        ),
        'manuscript_recommendation_type.id',
        'manuscript_recommendation_type_join_manuscript_review_type.manuscript_recommendation_type_id'
      );
      $select->add_column(
        'IFNULL( manuscript_review_type_id_list, "" )',
        'manuscript_review_type_id_list',
        false
      );
    }   
  }
}
